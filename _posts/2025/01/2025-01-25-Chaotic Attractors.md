---
layout: portfolio_rethink
title: "Chaotic Attractors - WebGPU"
date: 2025-01-21 21:37:00 +0001
engine: "webgpu-viewer"
demo: "particles"
pagecount: 2
tags: Featured
desc: A live demo showcasing a set of chaotic attractor based particle systems running in WebGPU.
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

This post covers a project I’ve been excited to work on for a long time and has come together thanks to advancements in modern web browser technology. As WebGPU is still cutting edge, on Safari you have to enable a feature flag, Firefox may require the nightly branch. I’ve mainly tested this on Edge and Chrome.

A few years ago I’d come across chaotic/strange attractors and I instantly fell in love. At the time I didn’t know about chaos theory (and I must not have been paying enough attention to the first Jurassic Park movie) but the idea that a tiny change to the starting position of a particle can cause it to follow a dramatically different path but still eventually return to a predictable state was something that really blew my mind. Originally I assumed chaotic attractors were created by mathematicians who were trying to prove this concept by writing equations that produced beautiful looking graphs (and by extension particle systems). This was wrong of course, there’s a multitude of uses outside of visualisation including using Lorenz and Arnedo systems to securely transmit images, and the Three Cell CNN attractor literally has the clue in its name that it comes from research into neural networks. 

Whilst I’m planning on reading more into the use cases for chaotic attractors, my core focus at the minute is using the GPU to create pretty images. When I was first learning about chaotic attractors I wanted a way to reproduce the equations and share them with people. I already knew I wanted to visualise the attractors with particles and because I wanted an excuse to learn compute shaders I decided to try and do this in Unity. This resulted in the video below:

{% include youtubePlayer.html id="nx3pMp76xHE" %}

As you can see I had a lot of trouble with video compression, this became a big roadblock in terms of sharing it with people because I knew realistically not many would actually download the Unity app and since the video doesn’t look great it’s harder to sell the idea of how cool chaotic attractors are to people.

Something I find really funny is that in that video’s description I wrote that I couldn’t wait for WebGPU so I could just do live demos. This whole website has been in the back of my mind for years and I’m really happy that I can finally do it. I’d been following WebGPU closely and was fully aware of the plan to include support for compute shaders so as soon as it was supported in the public releases of Chrome I knew I wanted to port as much of my Unity based work over as possible. I was so excited for WebGPU that I’d even had it written in my personal development plan at my previous job that this was something I was going to do when I had the time.

With respect to the fact that this is my first pure WebGPU based project, I don’t think it’d be wise to delve into the process I’ve undertaken to build this application as I’m still learning the best practice and there’s much better sources of information such as [WebGPU Fundamentals](webgpufundamentals.org). This is largely what I read whilst working on this piece.
Whilst I could have just used ThreeJS or Babylon for this project I wanted to experience building a WebGPU solution from the ground up, as I felt it’d be a good opportunity to learn and gain a lot more experience with TypeScript in the process.
From my current experience I feel that working with WebGPU doesn’t feel all that different to work with than DirectX 11 or OpenGL. It’s certainly got a bit more legwork to do than WebGL which just felt like you had to call one function and you had a cube rendering but that’s understandable given the amount of control you now have. I’d be curious if DX12 or Vulkan features will be added down the line such as Mesh shaders but it likely will depend on whether hardware support becomes more common, and with access to compute shaders anyway there’s a lot of new possibilities that have opened up. I did enjoy working with WGSL too, but I aren’t a fan of writing vec3<f32> so I would be happy if some of that gets neatened up.

Following this admittedly rather long intro, I wanted to include an overview of what the program is doing just in case it gives anyone some inspiration. 


## Program overview

The lifecycle of the program is pretty simple, it starts with initialising WebGPU which is all largely boilerplate code such as setting up the render targets and allocating any buffers we’ll be using in the GPU’s memory. There are only three buffers used in this project, these are a read/write storage buffer that contains all of the particle data, a uniform render settings buffer and finally a buffer that contains the vertex positions for rendering a quad. 

Once everything is initialized, the shader programs are then loaded. As the compute shaders are all doing work on the same data and are related in what their purpose is, I decided to write them all in the same .wgsl file. This just means for the loading logic all I needed to do was change the entrypoint for each attractor which would then contain the attractor specific behaviour. Each compute program is then stored in a map so that they are easily accessible later. As part of this step the render material is also intialised, this has a simple shader which will draw an instance of a billboarded quad at each particle and then in the fragment shader it will also use the length from the center of the quad to mask out a circular shape. The render pass is set up to be additive so that when I add bloom support I can make the effect pop a little bit more.

After everything is loaded, the program then enters the update loop. The update loop first triggers the active attractor to run and then immediately renders the result. It’d be theoretically possible to chain attractors together, and maybe something that I explore in the future, however my gut feeling is that it’d result in particles not really doing much or just exploding off into space. 

For switching the active attractor I realised there was a minor issue in which some attractors will break if the particles are in an unexpected location which will often result in the guilty particle being stuck in place. The Aizawa Attractor specifically seems to form a strip of particles that get stuck if their positions are greater than one on the z axis. To work around this, I decided to play it safe and reset the position of all the particles when changing the attractor. At this point I realised too that different attractors have different sizes and also require different framing within the camera frustum, so as part of the shader initialisation I added some additional logic for running configuration changes and for moving the camera around to get the most satisfying angle. 

Each attractor is based on an existing piece of work by a different author. As such the second page of this blog is set up to act as a reference list to give credit where it’s due. The initial attractor list I’ve been working from comes from this [website](http://www.3d-meier.de/tut19/Seite0.html) which I have no memory of finding but it’s been quite a useful resource. 

Every frame the attractor is integrated by a fixed delta which has been tuned to look good, this is multiplied by the result of the given formula for each attractor. The only issue I have come across whilst writing the attractors is that the pow function can be a little funny and ends up resulting in nan’s so instead I had to hand write every pow operation.

One thing that isn’t obvious is how an attractor works to help explain this, a code sample from the Bouali attractor is included below.

```glsl

//Load the particle from the particles buffer
var particle = particles[id.x];

//Bouali's constants
var a = 0.3;
var s = 1.0;
var dt = 0.006;

var pos = particle.Position;
var result = vec3(0.0,0.0,0.0);

//Calculate new position
result.x = pos.x * (4.0 - pos.y) + a * pos.z;
result.y = -pos.y * (1.0 - (pos.x * pos.x));
result.z = -pos.x * (1.5 - s * pos.z) - 0.05 * pos.z;
particle.Position = pos + result * dt;

```

The equation that calculates the position is literally just translated from Bouali’s original paper as are the constants. The only questionable bit is the delta, I think this theoretically can be the delta time however using a fixed delta means that I can use a basic form of integration (of just multiplying) rather than having to implement something like Runge Kutta integration to ensure consistency over different frame times.

Bouali's Equation:
![Bouali](/assets/images/BoualiEquation.png "Bouali")


## Future Work

Like with my ThreeJS sandbox, which has been used for other demos on this website, I see the WebGPU project as something I’ll keep coming back to overtime to make improvements to.

One feature I’d really like to add that’ll really improve the visual quality is support for multi-sampling to get some basic antialiasing in. This was something I initially assumed would work out of the box like with WebGL but it requires a little more technical effort so I’d like to give it a bit more time instead of trying to cram the feature in for this post. To follow this on I’d also like to add support for post processing effects, I briefly mentioned above that I’d already planned for adding bloom through making the particles additive but I’ve not yet read into how to set up the multiple render targets that’ll be necessary to handle a bloom pass but it’ll likely become easier after adding MSAA support. 

As there’s hundreds of attractors, I am planning to add more to this demo whenever I have downtime. I’d love to get to the point where every attractor is supported some day. To extend on this, I’d also like to make the constants that make up an attractor to be exposed for tweaking since I think it’d be a lot of fun to play around with however since there’s no standard nomenclature for the constants I’d like to figure out a clean way of doing it without trying to invent a standard myself as I don’t want to be disrespectful to the original authors.    

--

Thank you for reading this post, this has been something I’ve wanted to make for a long time and I’m so excited to share the initial version of it. 


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