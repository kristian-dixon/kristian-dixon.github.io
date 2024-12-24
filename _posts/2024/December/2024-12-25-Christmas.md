---
layout: portfolio_rethink
title: Christmas 2024
subtitle: Happy Holidays :)
engine: shadertoy-viewer
address: https://www.shadertoy.com/embed/M3tyWr?gui=true&t=10&paused=false&muted=false
pagecount: 1
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

Happy Holidays to anyone reading this post. This is another very quick post because I wanted to implement ShaderToy support into the live demo system and this was a good excuse to do so. 

Please excuse the quality of the model, I've not done any raymarching in such a long time that I was really rusty but it's something I get to practice a bit more over the next year so that I can get good at it. For this post I'm not going to discuss too much the process, but the inspiration was based on a Dunlem Santa ornament we'd seen and since a shader didn't already exist for it I thought I should make one.

For anyone reading this that hasn't come across implicit geometry before, unlike a regular mesh that's made in software such as Blender and is made up of a set of discrete connected points in space. A raymarched model is defined entirely though maths. A ray is fired from each pixel and the scene is evaluated for the nearest object, we then step along that ray by that much distance and we evaulate the scene again. We continue marching along the ray with the most recent evaluated distance until we fall below some given distance threshold. Once we fall below the threshold we can assume we've hit a surface and return the colour of the nearest surface.

As mentioned the space is also made up of a mathematical function, all of the objects in the scene are defined mathematically and it's a bit tricky to get your head around but the closest thing is basically that it is the contour maps you'd see in Geography lessons. Usually when the height of the terrain passes a given threshold a line is drawn to show change in elevation. This is essentially the same just in 3D.

I hope everyone has a nice Christmas and a really really good 2025. 

</div>