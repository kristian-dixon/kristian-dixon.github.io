---
layout: post
title: "C++ Programming and Design & Realtime Graphics"
date: 2022-01-02 14:21:00 +0000
categories: jekyll 
---

## C++ Programming and Design + Realtime Graphics

<p align=center>
  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/_q_MZ7ccnyo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

### Summary
- ECS based engine architecture
- C++ code written to conform to Parasoft standards
- First experience with DirectX 11 
- Environment mapping & shadow mapping expanded upon existing rendering knowledge.
- Simple physics and voxel destruction

### Overview
This project was the first main assignment of my masters year. It combined two modules, one of which was focused on improving our ability with C++ and the other taught us more about how we can use shaders to produce more realistic 3D renders.
 
As we hadn’t covered much C++ since the second year of the undergrad course, this assignment was designed as a refresher and to test us with a much more complex project than anything we'd experienced before. This project and module was hugely important in building my confidence with using C++ and reinforcing standards that should always be followed whilst working with such a complex language.
 
At the start of the assignment, we were told that it was likely we'd have to reuse the codebase from this project in the next semester. Because of this, I decided to first focus on the design side so that I had an architecture in place that would be flexible enough to be able to support any future work. I settled on building an Entity-Component-System based architecture. I chose this as I had experience writing one before so I knew I could get it done without eating too much into the time I had available and I knew it would bring a degree of modularity which would let me add and remove features without having to worry about how things were coupled together.
 
A core aim of this module was to develop our knowledge of how DirectX 11 worked, we previously had worked with OpenGL in Undergrad but we hadn't had the opportunity to dig too deeply into the API so it was essentially a black box. Being allowed to work through the setup and later having to make edits to this setup to achieve more complex visuals gave me a greater understanding on how the entire graphics pipeline worked. This is one of the things I enjoyed most about the project. I had a lot of fun reading one of the textbooks in the library to get an idea of what my code was doing and then being able to make informed changes based on that. This gave me a lot of confidence in working with APIs I hadn't touched before which then helped a lot with my introduction to professional work where I've had to work with more obtuse APIs and SDKs like PCL which aren't quite as well documented.  
 
I also decided early on that resource management was important, this is because the spec wanted a 35x35x10 voxel grid and it wouldn't have been ideal to have 12250 different instances of the same mesh, texture and shader loaded in memory. To resolve this I created a system where a “material” would have references to a mesh, shader and any number of textures and then the render component on an entity would reference that material using it’s given key. Due to the number of meshes I also decided to use instanced rendering to keep things nice and fast, this was tricky to achieve whilst avoiding too much coupling, but I worked around it by having the material store the transform data of each entity that uses it and then using that to fill out the instance buffer.

<p align="center">
  <img src="/assets/screenshots/rocketflight.gif" />
  <p align="center"> Shadow mapping, particles, and rolling time of day </p>
</p>
 
In the graphics assignments during undergrad, I was always slightly disappointed that we never got taught how to approach rendering shadows, so I was extremely excited to get to do shadow mapping in this project. My favourite bit about this objective was that it was the thing that finally made working with matrices click for me, I love how you can just be like “here’s where this point is in space, using the view and projection matrix is it occluded by anything in the depth texture?” and then it just works. I also really like that there’s potentially other cool uses for this, I might be wrong but I’m pretty sure you could do a one bounce GI pass by storing the colour information in the depth buffer but I need to read up on whether that would work or not because I feel like it's going to be a more complex problem. I also just like the idea of projecting textures in 3D space, since it’s one of those cool effects which always seem to look really good.
 
For the rocket's thruster, I also had to implement a particle system. I decided to do this completely in a shader using a mesh with 100 quads in it so that it could be updated quickly on the GPU instead of having to update buffers on the CPU side. I had also written separate shaders for the explosion effect, these were all animated through the vertex shader, now had I written it I'd probably use a geometry shader so that the mesh can just be a bunch of indexed points and have the quads be generated on the fly.  

### Improvements
I’m happy with a lot of what I achieved in this project at the time, I was still learning how to use C++ and a lot of the dumb design decisions I made were both because of that and due to time constraints.

The main thing I’d want to improve at the moment is how the systems run, at the minute every frame it checks a bitmask against every entity to see if it should run it’s logic. Now I’d either have the system store a list of compatible entities or have each entity store a list of the system’s “run” functions as delegates so that they can be called by the entity instead. I think the latter would work better for having a more dynamic engine where entities can be destroyed during the normal app flow but I’m not sure which would be better on the memory side. 

One of the optional objectives was to implement volumetric shadows, I’d have loved to implement this at the time because I’m slightly obsessed with volumetrics but nobody in my course did this simply because there wasn’t enough time. Softer shadows would have been a bit more realistic and would be something nice to add in a possible future version. There’s a million other visual things I’d love to change too just for the challenge, some post processing would go a long way in improving the visuals and having a proper model for the rocket would be quite nice too. 

I also now aren’t too happy with how I handled the voxel system, we were told to keep this simple so I went for the naive approach of just having each voxel being an individual cube entity but if I was doing this project now I would likely store the voxel grid in a single data structure and have a procedural mesh that gets regenerated whenever the grid is damaged. With enough time I’d look into optimising the mesh with greedy meshing, but I realise this would have been outside of my skill set at the time.  
