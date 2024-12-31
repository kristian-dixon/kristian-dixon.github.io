---
layout: portfolio_rethink
title: UV Distortion and Flowmap Painting
subtitle: 
engine: threejs-viewer
demo: uv_displacement
pagecount: 3
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0" data-cmd-call='changePage' data-cmd-args=0>

# Intro

This post showcases two individual pieces of work that happened to go together nicely. 
The first part demonstrates how the combination of a flow map, scrolling uvs and a gradient can be used to create a simple fire effect by distorting a base texture. I made this effect around the time I first started experimenting with writing shaders in ThreeJS so it was an ideal project to play around with. 

The side window is currently showing the result of the first part of the post, the second part of the post covers a feature I added for fun in which you can draw a rudimentary flowmap. I originally anticipated this feature to be quite simple to implement, given that I have the drawing logic from a [previous post](/2024/11/28/Mesh-Painting-Demo.html "Runtime painting on a mesh") but it ended up being more technical than I expected so it became an interesting thing to write about.

In this post I’m also experimenting with having the written content interact with the demo a lot more than in previous posts. This is done in two different ways, the first is when you change the page it’ll change the state of the demo to fit the written content. The second is that scattered throughout the post there’ll be input fields, buttons and sliders to allow you to change values within the demo. I’m excited by these features because I think it’ll make reading the post more fun, but I am aware that it could get annoying if you can’t find a button you want to press, so I’ve ensured that all buttons and input fields are available within the settings tab. I’ve also added additional features within the settings page, such as the ability to set your own base texture and to import a custom flowmap.

As was the case with previous posts, whilst this demo has been written in ThreeJS, there are no implementation specific details that mean it shouldn’t work in game engines such as Unreal or Unity, and it should also be possible to port to other frameworks such as BabylonJS relatively easily. 

The next page covers the approach to UV distortion, so please continue if you want to read more. 

</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="1" data-cmd-call='changePage' data-cmd-args=1>

# UV Distortion

The main aim of this page is to utilise UV Distortion to achieve a simple flickering fire effect. To help explain how this all works, I’ve changed the values within the material to essentially disable the effect. As you make your way through the post, you’ll interact with the demo in such a way that you will essentially rebuild the effect.

To start with, I think it’s important to have a quick refresher on what UV coordinates are. In the simplest possible terms, the UV coordinate is a 2D number which tells the texture sampler whereabouts in a given texture we want to pull the colour from. In most cases the coordinate (0,0) would be the bottom left of the texture and (1,1) would be the top right with the values in between essentially covering the whole texture. A cool feature of texture samplers is that it’s perfectly valid to sample from outside of this space as long as the texture has been set up with the correct wrapping modes when it was imported. As such the UV coordinate (5.5,-29.5) would still read from the central pixel of the texture, so long as the wrapping mode was set to repeat or mirror. The reason why this is important is that the UV scrolling step later on depends on this, but as we’re manipulating UV coordinates from the start I thought it was important to bring it up early in the post.

Breaking it down into its simplest parts, this shader does the following:

1. Calculates the scrolled UV coordinates
2. Samples the flowmap texture with the scrolled UV coordinates to get the distortion direction
3. Remaps and scales distortion direction
4. Calculates and applies strength gradient to distortion direction
5. Outputs the basemap with the original UV coordinates + distortion direction

For this post I’m not going to follow that exact order, as I think describing how uv distortion works first is more important to understand than the rest of the steps.

## Flowmaps and UV Distortion

A flowmap is a texture where each pixel represents a direction in 2D and we can use that direction to offset the UV coordinates by some given amount. The image below is the flowmap that this demo uses.

![Flowmap](/assets/screenshots/2024-12/flowmap.png "Flowmap")

Traditionally in a flowmap the red colour maps to a value on the X axis and the green colour maps to a value on the Y axis, and helpfully due to how most shader languages are made, you can access these variables with flowmap.xy or flowmap.rg and these are functionally the same thing. 

As most texture formats cannot have negative values, we need to remap the colour we sample from the flowmap so that the direction can range from -1 to 1. This is done with a lot of textures, such as normal maps with the following equation (flow.rg * 2.0) - 1.0 . As a side note, I sometimes get the terms of this equation the wrong way around but the easiest way to validate it is to do the maths with the number 0 and then with the number 1. Since this is the min and max 0 should become -1 and 1 should stay as 1.

As the remapped value is a direction, we can use this to offset our original UV coordinates to sample a different area of the texture. At the minute if you did this, what you’d find is that the distortion is far too high for the fire effect, so I multiply the distortion by a strength value to lessen this across the whole image. Below is a slider that lets you control the distortion amount to see how this works. 

<!-- I've also included a fun button to toggle the range correction of the flowmap direction so that you can see why doing the range correction is important. -->

<div style="display:flex;justify-content:center;">
    <label for='distortion_intensity'>Distortion Intensity - </label>
    <input type="range" id="distortion_intensity" class="in-post-inputfield" data-cmd-call='setDisplacementStrength' min='0' max='1' step='0.001' value='0'/>
</div>

## Scrolling UVs

Scrolling the UV coordinates is a common practice in a lot of shader effects, it’s relatively easy to do and it can improve a lot of effects by making them look more animated. An important distinction to make here is that we’re not going to be scrolling the uv coordinates used in the texture read for the fire texture, the scrolling is only applied to the texture read for the flowmap. 

To scroll the uv’s I tend to use a 2d vector that represents the scroll speed in the X and Y directions and then I multiply that by the elapsed time. The use of a 2d vector is important as it means you can have essentially two different speeds which will make the flowmap seem to repeat less. I tend to have one direction run at about four times faster than the other but that is heavily dependent on what you’re working on. What is worth doing is having the scroll speed be changeable outside of the shader, such as in UI or just exposed to an inspector. This is the sort of thing where the feel of what you’re looking at is heavily dependent on so many things that being able to quickly tweak it until you find a value you’re happy with is very important.

The two number fields below will allow you to set the x and y scroll speed. As a hint, these are floating point values so don’t restrict yourself to whole numbers.

<div style="display:flex;justify-content:center;">
    <label for='scrollspeedx'>Scroll Speed - X :</label>
    <input type="number" id="scrollspeedx" class="in-post-inputfield" data-cmd-call='setUVScrollSpeedX' value='0'/>
    <label for='scrollspeedy'> Y :</label>
    <input type="number" id="scrollspeedy" class="in-post-inputfield" data-cmd-call='setUVScrollSpeedY' value='0'/>
</div>

As you might have noticed, just scrolling the uv coordinates doesn’t always equal better results. This is because the flowmap is quite smooth so the changes in direction are quite gradual. In this situation we need to make the changes in direction faster. An easy way of doing this is to scale the uv coordinates so that the flowmap essentially becomes smaller. This means that the creation of the flowmap uvs ends up looking like this:

```
vec2 flowUV = (uv * scale) + (scrollSpeed * time);
```

Below you can play around with the UV scale.
<div style="display:flex;justify-content:center;">
    <label for='uvscalex'>UV Scale - X :</label>
    <input type="number" id="uvscalex" class="in-post-inputfield" data-cmd-call='setUVScaleX' value='1'/>
    <label for='uvscaley'> Y :</label>
    <input type="number" id="uvscaley" class="in-post-inputfield" data-cmd-call='setUVScaleY' value='1'/>
</div>

## Gradients

The final problem to solve for this effect is that the distortion is applied uniformly across the whole image. In some cases this would be what you want, for instance if you were rendering water you might want to use two flowmaps scrolling in different directions to give the impression of rippley water but for this shader I want the bottom of the fire to look relatively stable whilst the top is being distorted strongly enough that it breaks apart like it’s forming embers.

The approach I’ve used to solve this issue is to multiply the distortion strength by a gradient that’s controlled by the Y axis of the UV coordinate. In some cases, you may want to bake the gradient into a texture but I find it more fun to use maths instead. The gradient I used for this shader is quite simple, it raises the value of the Y axis of the UV coordinate to a given power which is configurable outside of the shader for tweaking and as such you can play with it below. I also have added a feature to visualise the gradient that is togglable with red being 1 and black being 0. 

<div style="display:flex;justify-content:center;">
    <label for='gradstrength'>Gradient Strength - </label>
    <input type="number" id="gradstrength" class="in-post-inputfield" data-cmd-call='setGradientStrength' value='1'/>
</div>

<div style="display:flex;justify-content:center;">
    <label>Render Gradient - </label>
    <input type="checkbox" data-cmd-call='setRenderGradient' class="in-post-inputfield" >
</div>  
The next page will cover drawing on the flowmaps.

</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="2" data-cmd-call='changePage' data-cmd-args=2>

# Painting flowmaps

This page is a little more brief than the last as it’s more about the steps I had to take to make flowmap drawing work rather than the concepts of how everything works but I wanted a place to cover it anyway because it was an interesting problem to solve. If you notice in the demo panel there’s now a yellow quad, this is a blank flowmap that you can draw on top of. For fun I’ve also made it possible to draw directly on the fire. The drawing might not look like it’s working as very small changes cause large distortions, however if you draw across the fire you should see it push in the direction you drew.

My painter tool from (this post) is designed in such a way that I can override the default shader that is used for painting and that I can also change the blend mode of the brush. Initially my plan was to write a new painter shader that’d output the direction away from the brush so that it’d essentially push any pixels away from the brush in the flowmap. Then I’d just use additive blending to have the values in the texture nicely push each other around based on where the mouse position was.

This plan didn’t work for one simple reason, additive blending cannot also subtract from the existing frame even if you provide a negative output value. I assume this value gets clamped in the output merger stage. I tried all sorts of custom blend modes but I couldn’t find one that did what I needed so I had to find a different approach.

Instead I decided to have a render target that’d essentially act as a result that the painting logic would contribute to. This required three render targets all told, one being the paintbrush’s render target, one being the result and the final one being a render target that copies the result so we can add to it. The reason the copy render target is necessary is that we need to add the direction from the paintbrush to the current result, however the current result cannot be read whilst it’s being written to. This then allowed me to add and subtract the direction of the brush simultaneously which allows for the creation of flowmaps closer to what you’d expect dedicated software to produce.


</div>






<div id="post_settings" markdown="1">

Note - Because of how the blog currently works I don't have a nice way to sync settings values, this will be a future feature but apologies for any confusion :)

## Distortion Settings 
    
<div class="settings_group">

<label for='distortion_intensity'>Distortion Intensity - </label>
<input type="range" id="distortion_intensity" class="in-post-inputfield" data-cmd-call='setDisplacementStrength' min='0' max='1' step='0.001' value='0'/>

<label for='scrollspeedx'>Scroll Speed - X :</label>
<input type="number" id="scrollspeedx" class="in-post-inputfield" data-cmd-call='setUVScrollSpeedX' value='0'/>
<label for='scrollspeedy'>Scroll Speed Y :</label>
<input type="number" id="scrollspeedy" class="in-post-inputfield" data-cmd-call='setUVScrollSpeedY' value='0'/>


<label for='uvscalex'>UV Scale - X :</label>
<input type="number" id="uvscalex" class="in-post-inputfield" data-cmd-call='setUVScaleX' value='1'/>
<label for='uvscaley'>UV Scale Y :</label>
<input type="number" id="uvscaley" class="in-post-inputfield" data-cmd-call='setUVScaleY' value='1'/>

<label for='gradstrength'>Gradient Strength - </label>
<input type="number" id="gradstrength" class="in-post-inputfield" data-cmd-call='setGradientStrength' value='1'/>

<label>Render Gradient - </label>
<input type="checkbox" data-cmd-call='setRenderGradient' class="in-post-inputfield" >

</div>

## Drawing Settings

<div class="settings_group">

<label for="paint_mode">Paint Mode </label> 
<select name="paint_mode" id="paint_mode" class="in-post-inputfield" data-cmd-call='setPaintMode'>
<option value="None">None</option>
<option value="Albedo">Albedo</option>
<option value="Flow">Flow</option>
</select>

<!-- <label>Use Custom Albedo Texture - </label>
<input type="checkbox" data-cmd-call='setRenderDrawnAlbedo' class="in-post-inputfield" > -->

<label>Use Custom Flowmap - </label>
<input type="checkbox" data-cmd-call='setRenderDrawnFlowmap' class="in-post-inputfield" >

<label for="brush_color">Albedo only - Colour</label> 
<input type="color" id="brush_color" class="in-post-inputfield" data-cmd-call='setBrushColour' value="#FF0000"/>


<label for="import_texture">Import Albedo Texture</label>
<input type="file" accept=".png" class="in-post-inputfield" data-cmd-call='loadTexture' value=""/>

<label for="import_model">Import Flowmap</label>
<input type="file" accept=".png" class="in-post-inputfield" data-cmd-call='importFlowmap'/>

</div>








</div>