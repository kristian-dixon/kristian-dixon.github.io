---
layout: portfolio_rethink
title: "Chaotic Attractors - WebGPU"
date: 2025-01-21 21:37:00 +0001
engine: "webgpu-viewer"
demo: "particles"
pagecount: 2
tags: Featured
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

This post covers a project I’ve been excited to work on for a long time and has come together thanks to advancements within what is possible for a web browser to do. 

A few years I’d come across chaotic attractors and I instantly fell in love. The whole concept that a minor change to the starting position of a particle can create such amazing looking effects was really exciting to me and at the time I was learning how to write compute shaders in Unity so it was the perfect thing to play around with. My only problem at the time was that it was difficult to share, videos are hard to make because their quality would often be destroyed by compression and I didn’t want to limit the potential audience by expecting people to download an application from the internet.

When WebGPU became available and I found out that it had support for compute shaders I became really excited about the idea of porting the work I’d done in Unity across into a website so that it’d be easily accessible for everyone. I was so excited in fact that in my last personal development review I had written down that I wanted to finally make this application so I’m really happy that I have finally had the chance to do it. As this is my first pure WebGPU based project, I don’t think it’d be wise to delve into the process I’ve undertaken to build the application as I’m still learning the best ways to do things and there’s much better sources of information such as [WebGPU Fundamentals](webgpufundamentals.org) which is largely what I read whilst working on this piece. All in all, WebGPU doesn’t feel all that different to work with than DirectX 11 or OpenGL and I’m curious if they’ll ever expect the developer to handle device synchronization like in DX12 or Vulkan. 

## Program overview

The lifecycle of the program is pretty simple, it starts with initialising WebGPU which is all largely boilerplate code such as setting up the render targets and allocating any buffers we’ll be using in the GPU’s memory. There are only three buffers used in this project, these are a read/write storage buffer that contains all of the particle data, a uniform render settings buffer and finally a buffer that contains the vertex positions for rendering a quad. 

Once everything is initialized, the shader programs are then loaded. As the compute shaders are all doing work on the same data and are related in what their purpose is, I decided to write them all in the same .wgsl file. This just means for the loading logic all I needed to do was change the entrypoint for each attractor which would then contain the attractor specific behaviour. Each compute program is then stored in a map so that they are easily accessible later. As part of this step the render material is also intialised, this has a simple shader which will draw an instance of a billboarded quad at each particle and then in the fragment shader it will also use the length from the center of the quad to mask out a circular shape. The render pass is set up to be additive so that when I add bloom support I can make the effect pop a little bit more.

After everything is loaded, the program then enters the update loop. The update loop first triggers the active attractor to run and then immediately renders the result. It’d be theoretically possible to chain attractors together, and maybe something that I explore in the future, however my gut feeling is that it’d result in particles not really doing much or just exploding off into space. 

For switching the active attractor I realised there was a minor issue in which some attractors will break if the particles are in an unexpected location which will often result in the guilty particle being stuck in place. The Aizawa Attractor specifically seems to form a strip of particles that get stuck if their positions are greater than one on the z axis. To work around this, I decided to play it safe and reset the position of all the particles when changing the attractor. At this point I realised too that different attractors have different sizes and also require different framing within the camera frustum, so as part of the shader initialisation I added some additional logic for running configuration changes and for moving the camera around to get the most satisfying angle. 

Each attractor is based on an existing piece of work by a different author. As such the second page of this blog is set up to act as a reference list to give credit where it’s due. The initial attractor list I’ve been working from comes from this [website](http://www.3d-meier.de/tut19/Seite0.html) which I have no memory of finding but it’s been quite a useful resource. 

Every frame the attractor is integrated by a fixed delta which has been tuned to look good, this is multiplied by the result of the given formula for each attractor. The only issue I have come across whilst writing the attractors is that the pow function can be a little funny and ends up resulting in nan’s so instead I had to hand write every pow operation.   

## Future Work
Like with my ThreeJS sandbox, which has been used for other demos on this website, I see the WebGPU project as something I’ll keep coming back to overtime to make improvements to.

One thing I’d really like to get in to improve quality is support for multi-sampling to get some basic antialiasing in. This was something I initially assumed would work out of the box like with WebGL but it requires a little more technical effort so I’d like to give it a bit more time instead of trying to cram the feature in for this post. 

I’d also like to add support for post processing effects, I briefly mentioned above that I’d already planned for adding bloom through making the particles additive but I’ve not yet read into how to set up the multiple render targets that’ll be necessary to handle a bloom pass. 

As there’s hundreds of attractors, I am planning to add more to this demo whenever I have downtime. I’d love to get to the point where every attractor is supported some day. To extend on this, I’d also like to make the constants that make up an attractor to be exposed for tweaking since I think it’d be a lot of fun to play around with however since there’s no standard nomenclature for the constants I’d like to figure out a clean way of doing it without trying to invent a standard myself as I don’t want to be disrespectful to the original authors. 

</div>



<div markdown="1" class="pagnated-page-wrapper hidden" data-page-index="1">

# References

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