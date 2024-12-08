---
layout: portfolio
title: Fast Runtime Texture Painting on a Mesh
subtitle: Click or touch the model to begin painting
engine: threejs-viewer
demo: whiteboard
pagecount: 2
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0" data-cmd-call='changeModel' data-cmd-args='test/chunkysmooth.glb'>

# Intro

This technical demo demonstrates one of my favourite solutions to a problem that is quite tricky to solve, drawing a texture onto a mesh at runtime. I love this solution because as soon as I learnt it my understanding of what you can do with the standard render pipeline completely changed and it also forced me to imagine the coordinate spaces that we interact with in a different way. It made me really appreciate just how versatile everything is, and I’ve always been excited to use it whenever I can.

To interact with the demo, click or touch the model to paint on it. If you wish to modify the properties of the painter, click the cog and it’ll provide you with options such as brush colour, radius and hardness. This menu will also allow you to save and load your drawn textures.

This demo is implemented using ThreeJS, however I have also implemented this effect in Unity and I am certain that it’d be relatively simple to implement in Unreal and Godot. The only requirement to replicate this feature in your engine of choice is that you must be able to render content to a separate render target using a different material to the one you’d usually render with. The next page will walk through the technical details for how I implemented mesh painting in ThreeJS.

# Technical Breakdown

<input type="color" name="colorField" class="in-post-inputfield" data-cmd-call='setBrushColour'/>
<input type="file" accept='.glb' class="in-post-inputfield" data-cmd-call='loadModel'/>

<input type="range" min="-3.14" max="3.14" step="0.1" value="0" data-cmd-call='setCameraPitch' class="in-post-inputfield"/>
<input type="range" min="-3.14" max="3.14" step="0.1" value="0" data-cmd-call='setCameraYaw' class="in-post-inputfield"/>
<input type="checkbox" value="true" data-cmd-call='setCameraOrbit' class="in-post-inputfield" checked/>
</div>