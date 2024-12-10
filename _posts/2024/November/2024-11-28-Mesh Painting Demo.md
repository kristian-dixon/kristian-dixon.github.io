---
layout: portfolio
title: Fast Runtime Texture Painting on a Mesh
subtitle: Click or touch the model to begin painting
engine: threejs-viewer
demo: whiteboard
pagecount: 3
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

# Intro

This technical demo showcases one of my favourite solutions to a problem which is quite tricky to solve, drawing a texture onto a mesh at runtime. 

The solution makes use of the GPU to paint on a render texture and leverages the standard drawing pipeline rather than making use of compute shaders so it’s both fast and portable. The usage of the GPU is also what makes me love this solution so much, when I first learnt about the approach it fundamentally changed my understanding of what the vertex shader does and it forced me to imagine coordinate spaces in a different way.

To interact with the demo, click or touch the model to paint on it. If you wish to change properties of the painter, or access additional settgings, the 'open controls' button in the top right will allow you to do so. Whilst this demo should just be considered a toy rather than serious texture painting software, if you wish to export the painted texture the settings menu also includes the ability to do that, as well as uploading a custom base texture and model. 

This demo is implemented using ThreeJS, however I have also implemented this effect in Unity and I am certain that it’d be relatively simple to implement in other engines and rendering platforms. The only requirement to replicate this feature in your engine of choice is that you must be able to render content to a separate render target using a different material to the one you’d usually render with.

The model used for this demo was sourced from the GLTF samples repo, provided by Cesium. The original model can be downloaded through this link: [Cesium Milk Truck Model](https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/CesiumMilkTruck) 

The next page will walk through the technical details for how I implemented mesh painting in ThreeJS. 

</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="1">

# Technical Breakdown

This page will hopefully cover all the concepts that you need to know to reproduce the effect.

## Resources Setup

The first step to painting on the model is to set up somewhere to paint to, essentially like a ‘virtual canvas’. In ThreeJS this takes the form of a RenderTarget and in Unity it is in most cases a RenderTexture. The RenderTarget I have been using in this demo is 512x512 but this should be modified to whatever is most appropriate for your needs. 

This post assumes you already have a model loaded but it’s important to note that the model’s material will need to reference the RenderTarget in some way so that you can see the result of your painting. In this demo, the texture overrides the albedo texture on all materials within the loaded GLTF. 

Finally we’ll also need a custom material that we’ll delve more into later in the post as it will have its own vertex and fragment behaviour. This material can be considered to be the “paintbrush material” and will be responsible for providing the information required to paint on the canvas. The main settings that this material needs is that alpha blending needs to be enabled and depth testing needs to be disabled. This allows the paint to blend together with the previous frame and prevents any unexpected rendering artifacts. I also have the material render both sides of the mesh, this is because depending on modelling software the winding order of the UV’s could be incorrect.

## Render Pass Setup

Painting is done in a separate render pass from the main scene. This renderpass does the following:
- Disables the auto clear function of the renderer
- Sets the renderer’s RenderTarget to the ‘virtual canvas’
- For each model: render model with the paintbrush material’
- Set the renderer’s RenderTarget back to null
- Re-enable auto clear

We start by disabling the autoclear function of the renderer. This may be only necessary in ThreeJS but it’s worth discussing. Painting is an accumulative process, this means that each time we run the paint render pass we want to add to the result of the previous frame rather than entirely overwrite it. Ensuring that the previous frame’s render pass doesn’t get cleared allows you to achieve this. This is also partly why I disable the function on the renderer before setting the RenderTarget. I felt it reduced the chance of ThreeJS clearing the render target when I didn’t want it to.

When rendering each model it’s important that they retain all the data relating to their placement in the main scene. This is because the world position of the model’s surface and the world space position of the brush will be used to handle the painting logic. In ThreeJS rendering a mesh with a different material than its default was a little tricker than expected as the engine doesn’t seem to facilitate a “please render this with this material instead” type feature like Unity would with its replacement shaders. Initially it seemed like the only approach I had available to me would be to maintain a second scene which was a 1 to 1 copy of the main scene just with the materials swapped out, but I didn’t like this as it didn’t feel scalable. Instead I decided to be a bit sneaky and during the render pass I swapped the default material out and then put it back after the model had been rendered. 

After all the models are rendered, it is important to clean up after ourselves, so we re-enable the autoclear and unset the RenderTarget. This should hopefully prevent any unexpected behaviour in the main render pass.

## Material and Shaders
The material’s vertex shader is the part of this solution that excites me the most. The job of the vertex shader is to output information that eventually reaches the fragment shader, arguably the most important piece of information that it sends is the clip space coordinates of the vertices from the mesh that’s currently being rendered. This data traditionally represents the position of the vertex after it’s been multiplied by the model, view, projection matrix to figure out where exactly the model would be rendered on your display. The neat thing about this is that you don’t actually have to be truthful about what the position of the vertex is. 

My vertex shader instead pretends the UV position is the vertex position. This is done by taking the UV coordinates, remapping them so they fit within the normalized device coordinates (-1 to 1 instead of 0-1) and then placing them within the output vector that the fragment shader is expecting. This is hard to explain in text so below is a quick code sample. 

```glsl
//Remap uv into ndc range
vec2 ndcUv = (uv * 2.0) - 1.0;

//Output uv as a compliant position
gl_Position = vec4(ndcUv.xy, 0, 1);
```

The reason why we remap the uv into NDC space is that the coordinate (-1,-1) is essentially the top left of the render target. This produces a value that maps cleanly to where the model’s UV coordinates would fall on an actual texture. 
Use the toggle below to switch between the unfolded model in UV space and the model rendered in its normal state.

<!-- Rounded switch -->
<div style="margin: auto; width: 20%; padding: 10px;">
    <label class="switch switch-center">
        <input type="checkbox" data-cmd-call='setUnfolded' class="in-post-inputfield">
        <span class="slider round"></span>
    </label>
</div>

The vertex shader also passes through the world space position of the vertex (by multiplying the vertex position by the model matrix). This is used in the fragment shader to figure out how far the paint brush is from the vertex.

The fragment shader is fundamentally a lot simpler in concept, it finds the distance between the paintbrush and the world space position which was passed in by the vertex shader. This distance is then passed through a step function to get a hard cutoff of where is and isn’t being painted. This all essentially means that your paintbrush is a sphere in space that colours in any geometry it overlaps with. The result of the step function is multiplied by the alpha component of the output colour. This allows us to use alpha blending to draw on the texture without having to worry about manually blending the content.

With this information it should be possible to attempt to implement this feature on your own. In the next I wanted to discuss some additional problems I had to solve for this which may or may not be relevant to any recreation attempts.

</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="2">

# Additional Notes

## Cracks
One issue with this approach I was having was that I was finding cracks in the painted textures which seemed to occur along the edges of the UV islands. I spent a while looking for potential fixes to this. Originally I wanted to use conservative rasterization as I assumed the issue was being caused by the UV edge not filling the whole pixel and therefore not drawing to the pixels along the edge of a UV island but from what I could find ThreeJS doesn’t support hardware based conservative rasterization and implementing it myself seemed a little out of scope for what I wanted to achieve.

Instead I looked at introducing a blur filter, this worked but I noticed it’d cause performance issues on mobile and it was hard to tune for all models.

Another idea was one my friend suggested to me, which was to essentially inflate the UV islands to essentially ensure that all the required pixels were properly covered. This seemed promising but without having access to geometry shaders I couldn’t think of a way to do it without involving a lot of preprocessing. 

Instead my solution was to randomly offset the UV coordinates by a tiny amount each time the render pass runs. This does come with the caveat that you cannot be completely accurate with the drawing but it solves the problem in a way that doesn’t require specific setup in the model. The only issue this doesn’t solve is that if a UV island is entirely smaller than a pixel (such as if the model has been created with a palette texture in mind) then it isn’t possible to draw as it’ll be attempting to draw over an infinitely small pixel. This is why the windows of the truck aren’t drawable.

## Picking skinned meshes
Originally I wanted to support animated skinned meshes because I thought it’d be fun to try and draw on people that are walking past the screen. ThreeJS has a CPU raycaster which can be useful for attempting to pick content but it doesn’t support transparency and skinned meshes. 

Since I only care about where in worldspace the user has selected I wrote a function to render a 1x1 depth buffer around the mouse and then I read that to infer the selection position. This actually worked great and supported all of the test models I’d downloaded. I was happy with this but then I found that unlike Unity, ThreeJS expects you to handle skinned meshes properly in the custom shader which meant the positions I was getting in the paintbrush were always wrong. I decided to leave this feature until another time as I still need to properly learn how to write a skinned mesh shader. 


</div>

<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="3">

### Paint Brush Settings

Color: <input type="color" name="colorField" class="in-post-inputfield" data-cmd-call='setBrushColour'/>

Radius: <input type="number" name="colorField" class="in-post-inputfield" data-cmd-call='setBrushRadius' value='0.1'/>

### Camera Settings

Camera Auto Spin: 
<div style="margin: auto; width: 20%; padding: 10px;">
    <label class="switch">
        <input type="checkbox" data-cmd-call='setUnfolded' class="in-post-inputfield" checked>
        <span class="slider round"></span>
    </label>
</div>

Camera Pitch: <input type="range" min="-3.14" max="3.14" step="0.1" value="0" data-cmd-call='setCameraPitch' class="in-post-inputfield"/>

Camera Yaw: <input type="range" min="-3.14" max="3.14" step="0.1" value="0" data-cmd-call='setCameraYaw' class="in-post-inputfield"/>


### Model Settings

Toggle 2D Visualiser: 
<div style="margin: auto; width: 20%; padding: 10px;">
    <label class="switch">
        <input type="checkbox" data-cmd-call='setTexturePreviewVisibility' class="in-post-inputfield" checked>
        <span class="slider round"></span>
    </label>
</div>

Save Texture: <input type="file" accept='.png' class="in-post-inputfield" data-cmd-call='export'/>

Load Texture: <input type="file" accept='.png' class="in-post-inputfield" data-cmd-call='loadTexture'/>

Load Model: <input type="file" accept='.glb' class="in-post-inputfield" data-cmd-call='loadModel'/>

</div>

