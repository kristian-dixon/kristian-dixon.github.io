---
layout: portfolio_rethink
title: Interior Mapping
subtitle: Drag to rotate. Pinch/ scroll to zoom :)
desc: A live demo that showcases Interior Mapping Using ThreeJS.
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/InteriorMapping.png
engine: threejs-viewer
demo: interior_mapping_ar
pagecount: 2
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0" data-cmd-call='showBuildingScene'>

# Intro

This post is one of those projects that grew over time. My original plan was to explore implementing interior mapping in ThreeJS using an idea that I had which would reduce the shader complexity by using a mathematical approach instead of relying on branching. When I got to the point where I was happy my approach would work, I was just about to start writing this post when the thought passed through my mind: “how can I do frosted glass windows”, and then when I implemented that I naturally wanted reflections to complete the set. As the environment map I originally used for the reflections was taken at night, I also wanted to play around with having lights that turn on and off inside the rooms.

As such this post covers the following:
1. Branchless interior mapping
2. Fresnel Reflections
3. Frosted Glass 
4. Using a texture to simulate day/night cycles.

On this page, the demo shows a building that I made in Blender. If you drag across the model it should rotate. When rotating you’ll see that there’s different types of windows across the surface of the building. I figured having a whole building to play with would give me plenty of room to experiment with different ideas, my favourite being the hole on the back of the building since it’s a fun use of the effect. 

If you look closely enough, you may notice that some of the rooms are spatially impossible and theoretically should overlap or even exceed the bounds of the building’s walls. Also if you look under the building, you’ll see that there’s no interior geometry. This is because the rooms aren’t real. Interior mapping creates the illusion of a room behind the windows by projecting a view ray into a cubemap. This effect was largely popularised by Insomniac's Spiderman, but it has been used in games for a long while before that. 

The coolest thing about interior mapping is that it’s extremely efficient. Rather than having to render a bunch of interior geometry which is likely to get occluded by the building’s walls, one large quad could represent the entire interior of a building. To demonstrate this, one side of the building has had its entire face set to use the window material. By making use of smart UV tiling, making an entire skyscraper would be possible with no additional overdraw. 

Interior mapping is something that I implemented a few years ago in Unity but as mentioned above my original approach relied on branching. Whilst playing around with writing a raymarched voxel renderer (coming soon™), I realised the DDA line drawing algorithm I was using to find the distance to the next closest voxel cell should also work for interior mapping. From the position our view intersects the window’s surface, we can use the same theory to find which interior wall our view ray would go on to intersect. Realising this, I gave myself the challenge of re-implementing interior mapping without using any branching at all.

The next page will provide a breakdown of how the interior mapping works by demonstrating it on a quad as well as talking briefly about the secondary effects I’ve added. 

</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="1" data-cmd-call='showExplainerScene'>

# Effect Breakdown
As this whole shader is largely done in the fragment shader, let’s speedrun the vertex shader as it’s quite simple and we can get straight into the important stuff. The vertex shader that passes the following information:
1. UV coordinatess
2. Tangent space view direction
3. World space normal, tangent, and binormal vectors.
4. World space view direction.

An important thing to note is that in ThreeJS I couldn’t find a way to use the inverse model matrix, so I couldn’t convert the view direction into object space which is why I’m using world space normal vectors. The world space view direction was simply for calculating reflections.  

The tangent space view direction is essentially just the view direction multiplied by a TBN matrix (Tangent, Binormal, Normal). This is a relatively standard, and is usually used when doing things like normal mapping as well as similar effects such as parallax mapping. This ensures that all the maths will be done relative to the surface which reduces complexity.

## Interior Mapping
To implement interior mapping we need to find where in the room our view ray would intersect with an interior wall. To do this we first need to find the near intersection and then we can do a little bit of vector maths to extrapolate the rest of the information. The image below shows in 2D what this looks like. 

![](/assets/images/2025/InteriorMapping/VoxelRayVisualisation.svg "Visualisation of Voxel Ray query")

#### Finding the near intersection

As can be seen in the diagram, our first step is to find the near intersection. We can use the UV coordinates to do this. As our view ray is in tangent space, the uvs define the location that you’re looking on this face’s surface. By remapping the uv’s so that they range between -1 and 1 the center of the quad essentially becomes the center of the room. The button below visualises this with red and blue values showing the x and y of the uv coordinates respectively. (Note the bottom left is black as both values are negative).


<button id="show_near_intersection" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showNearIntersection'> Show Near Intersection </button>


At the moment, this plane is in the center of the room. Adding a depth value to the uv coordinates will allow us to define how far away from the centre the near intersection plane is. Increasing this will essentially stretch the room out which can be fun as extreme values feels like you’re peeking down a tunnel. Below is some sample code for finding this position. 

```glsl
//Remap UV Coordinates
vec2 uv = fract(vUv) * 2.0 - 1.0;
vec3 pos = vec3(uv, ZOffset);
```
With that, we now know relative to the center of the room where our view ray first intersects with the room. Something that’s important to highlight in the code block is that I only use the fractional component of the uvs, this ensures that tiling works by forcing the uvs to fall between 0 and 1 before remapping it to -1 to 1. Doing this also allows us to use the integer part of the uv coordinates later in the shader.

#### Finding the far intersection

Now that we know the near intersection, we can start working on finding the far intersection. We do that by calculating how far along the view ray we have to travel until we intersect with the wall.  

To calculate this we can use the inverse value of the view ray by doing 1.0/viewDir. The inverse of the view ray tells us starting from the origin how far you’d have to walk along the view ray until you cross the next meter boundary along each axis. So for example if the view direction’s X value was 0.5 then you’d have to travel two meters along the view direction until you cross a meter along the X axis.

Using the inverse view direction, we can now calculate the distance we need to travel to reach the next integer step on each axis. By multiplying the intersection position with the inverse of the view direction you essentially find how far you’ve already travelled along each axis, and then subtracting that by the absolute value of the inverse direction removes any the sign so you know how much you have left to travel. This is one of those things that makes a little more sense in code so please see the code sample below.

```glsl
//Get how much along each axis we need to travel along the 
//view direction to intersect with an axis aligned voxel grid.
vec3 invDir = 1.0 / viewDir;

//Figure out where we actually are in this voxel grid based 
//on the resolved position
vec3 distToAxisBorder = abs(invDir) - pos * invDir;
```

The result of this code can be seen by pressing the button below, this will visualise the distToAxisBorder variable. Along the horizontal axis, the colour becomes quite a strong green, this is because to reach the top of the room from the center of the window the view ray would have to travel quite far so it naturally has a stronger colour. The same is true for red and the X axis, and the yellow square in the center is essentially where both the x and y values have to travel a large distance to reach the interior walls.

<button id="show_axis_dist" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showAxisBorderDist'> Show Distance to Axis Border </button>

All that remains is to find the minimum value from the distToAxisBorder vector. This value is the exact amount we need to travel along the view ray from the near intersection point to reach the far intersection point so we can finally get the direction we need to sample the cubemap in by scaling the view direction by this value and then adding that to the near intersection’s position as can be seen below.  

```glsl
float dist = min(distToAxisBorder.x, min(distToAxisBorder.y, distToAxisBorder.z));
pos += viewDir * dist;

//Sample cubemap using the position as the direction vector
return textureCube(roomSampler, pos).rgb;
```

The buttons below will visualise the nearest axis, distance to wall intersection and the completed effect. The interesting thing is the nearest axis visualiser is just set to 1 for whichever axis is the closest, this shows the box shape prior to sampling the cubemap.

With that, interior mapping is complete. Next I wanted to provide a quick overview of the secondary effects I added for this post. These may get more coverage in the future but the following won’t be as in depth.

<button id="nearest_axis" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showMinDirection'> Show nearest axis </button>
<button id="nearest_dist" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showMinDistance'> Show distance to intersection </button>
<button id="raw_interior" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showInteriorOnly'> Show Interior Only </button>

## Secondary Effects

#### Fresnel Reflections
<button id="show_reflections" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='showBasicInteriorReflection'> Show Reflections </button>
To fully sell the effect that you’re looking through a window, it’s necessary to have exterior reflections as otherwise it feels like you’re just looking through a hole. Originally I just reflected the view ray off the surface normal and mixed it to the interior map using a lerp function with a constant value but that didn’t feel right. 

With real windows, the reflection gets stronger as you’re getting closer to a grazing angle. This is a Fresnel reflection. Computing the true value for a Fresnel reflection is extremely expensive computationally as surfaces are full of microfacets that define how rough a surface is and allows incoming light to properly diffuse over its surface. Thankfully Fresnel reflections have a number of ways to approximate them, and in this demo I’m using Shlick’s Approximation. 

Shlick’s approximation is a useful choice as it provides parameters for bias and reflection strength which I thought would be useful given when you look at a window head on you’ll often still see a slight reflection. The output of Shlick’s approximation is a scalar value. This value can be seen as the intensity of the reflection and is what I use to lerp between the reflection and the interior values. Below is a code sample that follows what I’ve done to implement Fresnel Reflections.

```glsl
vec3 refl = reflect(wsViewDir, wsNormal);

//Shlick’s Approximation
float reflectionStrength = (reflBias + reflScale * pow(dot(-wsViewDir, wsNormal), reflPower));
//Clamp to stop any weird artifacts
reflectionStrength = clamp(reflectionStrength, 0.0,1.0);

vec3 reflectionColour = textureCube(reflectCube, refl.xyz);
vec3 interiorColour = ParrallaxMap(viewDir,seed);
vec3 outputCol = mix(reflectionColour, interiorColour, reflectionStrength);
```

#### Frosted glass

Something I became curious about whilst working on this project is what would happen if I distorted the view ray with a normal map. Knowing how refraction commonly works in games, in which it’s essentially a post processing effect where the final render is distorted by a displacement texture, I figured it might provide a similar sort of effect that at a high enough strength might give the illusion of frosted glass. 

The buttons below will allow you to change the strength of view ray distortion.

<button id="low_distortion" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='setDistortion' value="0.01"> Low Strength </button>
<button id="medium_distortion" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='setDistortion' value="0.1"> Medium Strength </button>
<button id="strong_distortion" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='setDistortion' value="0.5"> High Strength </button>

For a closer approximation to frosted glass, rather than distorting the view ray, I could potentially blur the cubemap (either through mip-mapping or applying a blur effect during sampling). Whilst I think that’d give better results, my approach will be quite cheap which fits more into the theme of this post. 

When I’d added this feature, I also became curious about manipulating the final colour with a texture to give a true stained-glass look. If I spent more time on this effect, I’d have the alpha component of the tint texture act as the glass thickness and then play around with the seams of the Voronoi texture to actually make it look like layered glass but as a fun bonus feature I thought just multiplying the final colour by the tint was good enough.

<button id="show_tint" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='enableTint'> Show Tint </button>



#### Variation
<button id="show_reflections" class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='show Final'> Show Final </button>
The final part of this effect that I want to discuss in this post is how the rooms vary and change over time. A small effect that I’ve always really loved in games is when towns transition from their daytime version to the night time version. I always really liked the vibe of Windfall Island during the night and there was something really special about how the windows being lit up made it feel as you drove the boat towards it. I’d also noticed in Spiderman different rooms had different lighting conditions despite sharing the same interior texture. This caused the buildings to feel more natural, like they’re being occupied. This inspired me to implement both a day/night cycle and a way to modify a room’s lighting settings. The reason these are bundled together in this section is that the texture above handles both of these jobs.

![](/assets/images/2025/InteriorMapping/RoomSettingsTexture.png "Room Settings")

The Y axis of this texture represents time and handles the animation of the day/night cycle. In this version of the demo the changes caused by time are quite abrupt. This is because I had to use point filtering instead of bilinear on the texture as the texture was too small to reliably sample without it flashing. When sampling the texture, each room uses a random value on the X axis using the integer part of the UV coordinates as a seed. The RGB values tint the room’s interior colour. The alpha value of the texture is used to represent the frosted glass strength.

## Conclusion 
I had a lot of fun making this effect, and there are still elements I could add such as occlusion planes for curtains or cutout men and dirt on the windows but I am happy with what I have now as it’s much better than what I’ve done before. I also think it’d be fun to investigate implementing a texture atlas system to have more options for rooms than the 4 that’s in the cubemap. 

Something I played around with a while ago was whether or not this effect would work well in VR, which it does but it’s almost like you can sense the cube shape. Although with better interior graphics it would likely be something that your brain would just accept as real. It could be a really cool effect for a game where you’re a big monster lobbing buildings at another big monster.

I recently tried the demo for Spiderman 2 and their new window system is incredible. From what I’ve heard, since the whole game is raytraced, when a ray hits a window it queries a separate acceleration structure that contains a room which allows them to have animated 3D content inside such as someone watching telly or cooking dinner. The only thing it seems to be missing is people getting jumpscared by a man running across their windows.

I think it’s likely I’ll revisit this effect some time in the future. Part of me also really wants to try just writing to the depth buffer and seeing if that’ll have any interesting effects where you could theoretically put a model inside the window. Also you could theoretically store normal and depth information of the room and potentially do some fun lighting stuff. It’s very much a fun area that can be dug into a lot more.

Thanks for reading this post 🙂


</div>

