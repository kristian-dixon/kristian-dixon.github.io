---
layout: portfolio_rethink
title: Worldspace Low Resolution Filter
subtitle: Drag model to rotate camera
desc: A live demo of a post processing effect that lowers the resolution of what you're viewing through a quad.
image: https://kristian-dixon.github.io/assets/images/post_thumbnails/googlies.gif
engine: threejs-viewer
demo: lowresfilter
pagecount: 1
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

## Intro

This is a relatively short post for a fun effect I implemented this weekend. My friend sent me this [post](https://boingboing.net/2024/07/11/this-curious-crystal-converts-the-real-world-into-8-bit.html) about a crystal that has the effect of lowering the resolution of the world when you look through it and I was curious how to implement a similar effect in ThreeJS. 

Originally I thought it might be a bit complex to implement as I was picturing each "pixel" as it's own view frustum and that modelling that cleanly would be really tricky. But then I remembered that we can just use fun tricks in graphics programming as we are rendering what is vaguely close to reality rather than what is actually real. This meant that I got to play around with rendering post process effects in the middle of the render process which was a fun issue to think about.

This post will be broken into dicussing the pixelisation aspect and the steps to the render.

## The Pixelisation Shader

The key to achieving this effect is the pixelisation shader. The most simple explanation for this shader is that it essentially renders the mesh with a texture using screenspace coordinates that have been slightly modified to give the effect of the texture it’s presenting being a lower resolution than it is. I’m not 100% sure what the correct term for this is, however I think quantisation of the UV space sounds about right. Below is a snippet that shows how the UV modification works.

``` glsl
//Screenspace coordinates (ranging from 0 to 1)
varying vec2 screenUv;
uniform sampler2D map;

//The targeted screenspace resolution
uniform float resolution;

void main() 
{
    vec2 steppedUv = floor(screenUv * resolution)/resolution;
    gl_FragColor = texture2D(map, steppedUv);
}

``` 

The most important part of this is the line that declares the “steppedUv” variable. By multiplying it by our target resolution and removing the fractional component (with the floor function) you will essentially get an integer value in the range of 0 to the target resolution. This means when the value is divided back down by the resolution instead of a smooth value it is stepped. I’ve included a graph to demonstrate what happens to the value when the resolution is set as 16.

![](/assets/screenshots/2024-12/graph.png "Graph")

## Render Approach

The shader above could reference any texture but I liked the idea of it integrating the effect with a scene running in realtime. To demonstrate this working I decided to create a simple scene with a single model in it and have the shader be applied to a quad. Whilst this scene is simple I’ve written the effect that it could theoretically work with any scene, and I’ve considered issues such as handling occlusion. 

The render approach goes as follows:

1. Render the scene
2. Copy the render result to a secondary render target
3. Render the pixelisation quad on top of the original render
4. Copy the result to the final output

To start with, the scene is rendered (without the pixelisation quad) and the result is stored in a render target by copying it in the second step. The second step is important as it allows us to read the current frame information in the pixelisation shader without causing a circular dependency and blowing up the render stack. 

When we render the pixelisation quad, we also have to ensure that no information is cleared from the initial render pass as we’ll be drawing over the top of what’s already there. By not clearing the colour or depth buffers, we also get depth occlusion management for free.

Then to wrap things up, I’d actually secretly been doing all of the work in another render target so I need to copy all of the results into the final output so that it’s actually rendered to the screen. I needed to initially render everything to another render texture as it felt a lot easier to copy it to the secondary render target than if it was directly targeting the canvas. 

I had a lot of fun writing this shader, so I hope this post helps someone figure out something similar :)


</div>