---
layout: post
title: "Multiple fog densities without depth sampling"
date: 2024-08-18 21:37:00 +0001
tags: Shaders Prototypes
categories: GraphicsProgramming
---


![Image]({{"assets/screenshots/FogDensity.png" | relative_url}})

## Intro

This weekend, after reading a message from one of my friends I was really curious about how to go about rendering multiple fog densities in a scene without using any post processing effects or screen space quads so that it’d run fast on a Quest 2. My plan was to spend an evening writing a quick shader to see how the effect would look and then if it felt cool then I’d think about integrating it into future work.

The difference between this and a traditional “underwater fogginess” renderer is that in most cases that I’ve seen the water’s surface is responsible for applying the fog by rendering the surface after all other geometry and then reading the depth buffer to essentially apply the fog to the pixel colour of the water. This wouldn’t be ideal on a Quest for two main reasons; the first is that reading the depth buffer is incredibly slow (the Quest 2 barely has time to render a scene, nevermind having to stall the GPU to readback the current depth value). The second is that having a translucent surface that fills up a large portion of the render target tends to really upset a tiled renderer, from what I’ve read a lot of performance often is lost to rendering large water quads that aren’t actually visible.


## Calculating the fog densities
To simplify things I decided to split the world into two volumes “air” and “water”. If a point’s Y value is below zero then it’s considered to be in water, otherwise it’s in the air. This essentially means that there’s a theoretical vertical plane that acts as the boundary between the two volumes. I like this because I find planar maths quite fun :) 

The first step to calculating the fog is to figure out whether we actually need to calculate multiple levels of fog. This means that we need to test whether our view ray intersects with the plane. As we know the location of the camera and the pixel we’re rendering in worldspace, all we have to do is to figure out how far away from the plane the two points are. This is one of my favourite bits of maths because initially it seems tricky but it’s deceptively simple. To calculate the distance of an arbitrary point from a plane all you need is to do the following:

- Get a point on the plane (in this case we know the plane passes through [0,0,0])
- Subtract it from your arbitrary point in space
- Use the result of that in a dot product with the plane’s normal (in this case since it’s a vertical plane it’d be [0,1,0])

This would return the signed distance of a point from the plane, with the sign representing which side of the plane the point is on. If the sign of the two distances match it is impossible for a line that travels between the two points to intersect the plane so we can just apply the one level of fog based on whether the points are above or below the plane.

In the cases in which we intersect the plane we now essentially need to split the view ray into two segments: the segment from the camera to the plane, and the segment from the plane to the surface. 

As we already know how far the camera is from the plane we just need to find how far we have to travel until we’ve reached that point. If we get the dot product of the (normalised) view direction and the plane’s normal it’ll return a value. This value represents how far we travel along the plane’s normal for each metre step we take in the view direction. So for instance if you’re looking in the same direction as the plane is facing then the dot product would be 1 but if you look in a direction parallel to the plane it’d return 0 as over the course of a metre you wouldn’t be travelling any closer or further than the plane. If you divide the distance the camera is from the plane by the result of the dot product it’ll return the exact distance you have to walk along the view ray to reach the plane.

For the second segment it’s really simple, as we now know how far we have to travel to reach the plane, we can just subtract the distance the first segment travels from the total distance between the two points.

Finally you can calculate the two fog densities using the two segment lengths, I used exponential fog for both the air and the sea and just used different density values for the two. I really like how the distant islands in Wind Waker fade to (not quite) black so I decided to have the air fog trend towards black with a low density and then the water is just blue with quite a high density. A minor issue I found was that I had to add a fake skybox to allow the water to look like it’d go on forever in all directions, this uses the same water fog density but since I wanted a coloured sky I set it to a really low air density.


Below is a video of the prototype version, for this I also decided to add a scrolling texture on a plane to add water foam to give the surface a bit more grounding but I also feel like without any refraction/reflection the effect is a little bit harder to sell. 
{% include youtubePlayer.html id="8EOW8XMUXxM" %}

Thanks for reading :)