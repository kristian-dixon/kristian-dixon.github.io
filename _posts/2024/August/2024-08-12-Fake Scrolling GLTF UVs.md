---
layout: post
title: "A novel approach to faking UV scrolling in a GLTF file"
date: 2024-08-12 21:37:00 +0001
tags: Prototypes Modelling
categories: Experimental
---

## Intro

This post is partly cool because I figured out how to render GLTFs in Jekyll :)

For a while now I’ve wanted to try and set up UV scrolling on a GLTF either through an existing GLTF Extension such as using [KHR_animation_pointer](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_animation_pointer/README.md) and [KHR_texture_transform](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_transform/README.md) together or by writing a custom extension that just manages UV scrolling within the shader itself (which might be more performant). Unfortunately I’ve not had time to sit down with my artist friends and figure out what would work best in their pipelines so as a stop gap, I was curious if I could come up with a way of faking texture scrolling without any extensions at all. The model below is what I ended up making.

{% include modelViewer.html id="scrolling_uv/scrolling_demo.glb"%}

If you look at the bottom of the model it may give away what I’m doing to make this work. 

The start of this idea came from pop-up picture books and how you can pull a bit of card to slide a hidden element into view. The main image I had in my head was of a book I vaguely remember where you can “peek” into a tiger enclosure and watch it wander around its cage. With this in mind the first prototype I made was a quad that’d move back and forth. I mainly built this model to test how tight I could pack the model before ZFighting became an issue but I feel like you could make a lot of cool effects with a semi occluded quad moving around. The model below is the result of the first test. These models also have an animated squishing on the Z so that it’s easier to show how the more complex ones work but it’s unnecessary otherwise.  

{% include modelViewer.html id="scrolling_uv/linear_mover"%}

The next thing I wanted to do was try and get a similar effect with torus shaped hole. I knew if I just moved a quad around it’d look rubbish but I liked the idea of having a straight edge so I didn’t want to just use a circle in place of the quad and call it a day. My first thought was to design a piece of geometry that could be translated and rotated to fit the curve of the torus but I couldn’t imagine what that’d actually look like in reality, so instead I decided to instead introduce an extra occlusion element. 

After a bit of tinkering I realised that the occlusion element has to be a spiral shape, this makes sense when you think about looking at a spiral from the top down, it will just be a circle which is essentially the shape we’re trying to fill in. 

{% include modelViewer.html id="scrolling_uv/sprial_test"%}

Then for the final bit of the complete version of the effect, the spinning is simply me rotating the spiral about the Y axis. I thought this might be cool for something like a radar effect.

{% include modelViewer.html id="scrolling_uv/sprial_spin"%}


Obviously there are some caveats with what I’ve done here, namely that different renders have different depth accuracy so it won’t necessarily work on everything. There’s also the fact that GLTF animation tends to balloon file sizes which isn’t super ideal. But I was happy enough with the prototype I made to show it to my artist friends so that if they get any ideas they can run with it.

Thanks for reading :)

<!-- 

{% include modelViewer.html id="dino.glb"%} -->

<!-- {% assign explainer = site.posts | where:"title","Test" %}
{{ explainer[0].excerpt }} -->

