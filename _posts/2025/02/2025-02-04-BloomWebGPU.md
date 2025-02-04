---
layout: portfolio_rethink
title: "Bloom - WebGPU"
date: 2025-02-04 13:37:00 +0001
engine: "webgpu-viewer"
demo: "particles"
pagecount: 2
desc: An update post for the previous work on a WebGPU chaotic attractor post.
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/chaos.png
---

<div class="post_control_container">
    <p style="margin: 0px;font-weight: 700;text-align: center; font-size: 1.75rem;margin-bottom: 4px;">Attractor Settings</p>
    <select name="paint_mode" id="paint_mode" class="in-post-inputfield" data-cmd-call='ChangeComputeProgram'>
        <option value="Nose-Hoover Attractor">Nose-Hoover Attractor</option>
        <option value="Three Cell CNN Attractor">Three Cell CNN Attractor</option>
        <option value="Aizawa Attractor">Langford Attractor</option>
        <option value="Arneodo Attractor">Arneodo Attractor</option>
        <option value="Bouali Attractor">Bouali Attractor</option>
        <option value="Burke-Shaw Attractor">Burke-Shaw Attractor</option>
        <option value="Chen-Celikovsky Attractor">Chen-Celikovsky Attractor</option>
        <option value="Dequan Li Attractor">Dequan Li Attractor</option>
        <option value="Halvorsen Attractor">Halvorsen Attractor</option>
        <!--<option value="Flow">Arneodo</option>-->
    </select>
    <button id="save_texture" class="in-post-button" data-cmd-call='ResetSim'> Reset Simulation </button>
</div>


<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

## Intro

This post is essentially an add-on to the [previous post]({% post_url 2025/01/2025-01-25-Chaotic Attractors %}) that covered implementing a WebGPU based Chaotic Attractor visualiser which used compute shaders to simulate a high volume of particles to demonstrate the return to an orderly state effect. After uploading the post, I spent some time comparing the project to what I already achieved in Unity, it was immediately clear that without bloom the particle effects felt a little flat. I decided to focus on fixing this by implementing bloom support into my WebGPU renderer which is what this post covers.

To implement bloom I felt like I had two immediate options. I could either use a raster based approach or attempt to process the source image in a compute shader. Whilst the latter sounded fun, I chose to do the former. Primarily, I chose this because it gave me a reason to expand the raster based functionality of my WebGPU renderer, implementing features that’ll be useful for future exploratory projects, whilst also following an approach that seems to be common to most game engines. 

## Implementation
The approach I’ve used to implement bloom does the following:

1. Prefilters non-contributing values
2. Downsamples the source image
3. Additively upsample the downsampled image
4. Blends the upsampled result with the initial render buffer

As alluded to above, to implement this approach I had to add some new features to my renderer. The most important feature is the ability to change render targets on the fly. Previously, the renderer was hardcoded to only output to the page’s canvas, limiting us to a single render pass. I originally expected refactoring this would be tricky, but thankfully I had originally structured the render calls in such a way that it was open to being tinkered with. All I had to do was add a new function that changes the render pass’ description to point at a different texture view prior to the render commands being registered.

Being able to change the render target is essential to how the whole bloom effect works. Core to the bloom operation is blurring the original source image. This is where the downsampling and upsampling comes in. By copying a source image to a render target with half its resolution (downsample), it will naturally lose some information. Copying the image back into a render target with the original source resolution (upsample) will then return a slightly blurred version of the original image. You can test this in most image editing programs by scaling images up and down. If you do this iteratively, repeatedly downsampling until you reach the lowest possible resolution of a render target cascade, and then upsample back up towards the original source resolution you’ll receive a very blurry version of the original image as a lot of information has now been lost in the process.

In some cases, this is exactly what you want, but even with bilinear sampling the resultant texture is quite blocky and tends to lose slightly too much information. Using a different sampling method will solve this. In this demo I’m using box sampling. This is relatively simple to implement as instead of sampling the source texture from one point, it takes the average of four samples on the edges of a box around the uv position. The size of this box can also be optionally scaled which affects how focused the final result appears to be. Eventually I want to look into other sampling methods, box sampling appears to lack temporal consistency which is part of why some of the attractors start out a little bit wibbly. I’m curious about randomly distributing sampling points in a circle since I think that’d create an interesting effect.

Another change feature I needed to add to my renderer was the ability to change the ‘load’ operation of the render pass descriptor. The load operation runs at the start of a render pass and by default is set to clear the bound render target. During the upsample phase, we can produce a better quality image by performing the upsample additively. This improves quality as it ensures that no information is lost, it does this by not clearing the current render target and enabling additive blending. Doing this means that the upsample is being added to the original source’s downsample, this has the effect of also brightening the overall image which can be useful for preventing dark images from eating the bloom. Whilst it’d be nice to use this all the way up the chain to the canvas’ render target, for the final step we have to re-enable clear and manually add the source image and highest resolution bloom cascade render target, as otherwise each frame the bloom will propagate and just make your screen white. 

Something I spent a little time dithering over was whether or not to have the demo require each pixel reach some set brightness threshold before it contributed to the bloom effect. In a game this makes sense because you only want the very bright objects contributing to bloom, but for a fancy particle simulation I think it makes sense to overdo the bloom a little bit. As I want to reuse my bloom logic in other parts of the project I decided to add the feature anyway and set the threshold to 0 for the time being. With the next update I plan on adding a toggle to the main post to allow the viewer to at least disable the bloom if they wish to do so, however I think the bloom does a good job of exposing just how many overlapping particles there is by making the bloom extra blobby at really intense points.

Thanks for reading, as this was a quick post I may come back to this at some point soon to add more images and flesh it out a bit more, but for now I hope this was an interesting read :) 

</div>



<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="1">

# References

This reference page is copied from the standard chaotic attractors post. 

As stated in the post, all of the chaotic attractors I've implemented have come thanks to the maths in this [website](http://www.3d-meier.de/tut19/Seite0.html) whilst I've tweaked some values such as spawn radius, the equations and constants all came from this resource. As a lot of the links in the reference list no longer work I also want to include as close to a source of the original authors as possible.

The following is a list of sources for each attractor:

Three Cell CNN Attractor - Arena, P., Caponetto, R., Fortuna, L., and Porto, D., Bifurcation and chaos in noninteger order cellular neural networks, International Journal of Bifurcation and Chaos in Applied Sciences and Engineering, 1998, 8, 1527-1539

Langford Attractor - Langford, William. (1984). Numerical Studies of Torus Bifurcations. 70. 10.1007/978-3-0348-6256-1_19. 

Arneodo Attractor - Arneodo, A., Coullet, P., & Tresser, C. (1980). Oscillators with chaotic behavior: An approach to the study of turbulence. Physics Letters A, 79(4), 259-263.

Bouali Attractor - Safieddine Bouali. A Versatile Six-wing 3D Strange Attractor. 2019. hal-02306636

Burke-Shaw Attractor - Shaw, Robert. (2014). Strange Attractors, Chaotic Behavior, and Information Flow. Zeitschrift für Naturforschung A. 36. 10.1515/zna-1981-0115. 

Chen-Celikovsky Attractor - Celikovský, Sergej & Chen, Guanrong. (2002). ON A GENERALIZED LORENZ CANONICAL FORM OF CHAOTIC SYSTEMS. International Journal of Bifurcation and Chaos. 12. 1789-1812. 10.1142/S0218127402005467. 

Dequan Li Attractor - Li, Dequan. (2008). A three-scroll chaotic attractor. Physics Letters A. 372. 387-393. 10.1016/j.physleta.2007.07.045. 

Halvorsen Attractor - Sprott, J.C. (1994). Strange Attractors. Chaos, Solitons & Fractals, 4(3), 311-314

Nose-Hoover Attractor - Hoover, William. (1985). Canonical Dynamics: Equilibrium Phase-Space Distributions. Phys. Rev. A: At., Mol., Opt. Phys.. 31. 1695. 10.1103/PhysRevA.31.1695. 


</div>