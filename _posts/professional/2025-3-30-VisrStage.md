---
layout: portfolio_rethink
category: paid_work
title: VISR - Stage XR
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/professional/stage.jpg
pagecount: 1
engine: youtube-player
demo: 01eTa1WNBTo?si=9UN0p52CUV_55MMZ&autoplay=1
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

# Intro

The Stage project was one of the larger projects I'd worked on in my time at VISR. Spanning over multiple years, this project had one key aim: "learning should be fun". Due to the rise of applications like TikTok, teachers are finding it increasingly difficult to keep students engaged with their lessons. Our solution for this was to produce a software package that'd allow teachers to deliver lessons utilising XR to increase student engagement through allowing them to take part in collaborative exercises and games.

There are three main selling points that set Stage apart from the competition. 

- We utilised VERTX, an in-house networking engine that had an internal CDN to allow the app to make use of dynamic content. Our expertise in producing networked applications, along with the majority of our team being game development focused allowed us to build a very good application that was constantly receiving positive feedback from our customers.
- We built the app around the concept of shared space multiplayer VR utilising a third party tracking solution to localise each user in the virtual space, ensuring that users wouldn't bump into each other. (Pre-dating shared spatial anchors)
- We had a simple to use, web based experience editor. This was designed so that both teachers and students could create experiences. Having the option for students to make experiences 



My role at VISR was rather fluid. Up until I became the lead game developer of Stage, I was often jumping between different projects within the company providing assistance where needed. This essentially meant that I'd often drop in to perform some major technical work. From around June 2023, Stage became my only focus. 

Something that I took extremely seriously was trying to build an improved culture within the company. My dream was to be in a situation in which everyone in the company felt like they could contribute to Stage as a product. When I became Stage lead, I began to develop and foster communication lines between myself and the leads of the Content, Art and QA departments as well as the sales representatives that were directly dealing with customers. I believe a lot in the power of togetherness, when a group of people are all pulling in the right direction it can push everyone to achieve more. And most importantly, I think when you're part of a successful group it makes everyone happier. 

## Breakdown of my contributions

Due to gaps in the timeline, I'll split this section up into multiple bits. This is ordered from newest to oldest.

### Stage Lead Work (August 2023 - November 2024)

- Worked with the art department to improve production pipelines and our renderer.
- Created systems for QA to provide feedback and helped to improve the testing process.
- Assisted into making changes to Unity's PBR shader to improve performance for mobile VR.
- Ran planning meetings and scrums.
- Acted as code owner, managing merge requests and releases.
- Performed multiple graphics analysis using RenderDoc (Meta Fork) to address rendering performance problems and graphics bugs.
- Researched potential runtime improved lighting solutions for dynamic content.
- Developed networked physics system that worked within our networking architecture.
- Integrated networked full body tracked avatars using quaternion compression.
- Refactored application to support new API endpoints using an improved pattern to make future changes faster to implement.
- Improved performance of the application through making proper use of multithreading rather than relying on coroutines.
- Implemented Lua based modding API to improve interactivity of experiences.
- Developed system to support accessing any controller that Unity recognises from a Lua mod.
- Converted our GTLF loader to use GLTFast to better match the GLTF spec.
- Built various GLTF extensions to manage collision bounds generation as well as to provide useful ways of handling video textures and hooks for the Lua mods to use. This also included support for changing Unity's lighting conditions.
- Wrote Blender plugin to simplify the process for artists to add Stage specific GLTF extensions.
- Researched alternatives to shadow mapping on Quest 2, including using planar shadows.
- Created system to support improved user control over spawned media assets including allowing videos to be played on GLTFs.
- Developed system for managing networked playback and synchronise GLTF animations. 
- Sat in Metaverse Standards calls to ensure we stayed on top of new developments for the GLTF format.
- Assisted the development of virtual production systems, allowing for cameras in the app to stream video to NDI sources.
- Provided support in the development of a feature to have Stage be usable in projection rooms.
- Tested the viability of remote rendering support on Quest devices.
- Mentored junior developers in the team.

### Technical Support Work (Pre June 2023)

- Integrated support for head tracked 3D displays.
- Created custom MRTK controllers for tracked input devices.
- Added support for manipulation axis locks on movable content.
- Rewrote the logic for how MRTK handles rotation axis locks as the behaviour of the rotation was unpredictable.
- Debugged rendering artefacts caused by alpha surfaces when using passthrough.
- Provided investigation into using raster based ray cast instead of CPU side collision queries.

### Early Work (Pre MVP)

- Designed the original dynamic content loading logic along with being able to transition between multiple stored networked states.
- Created packages for original networked components simplifying the implementation of features such as networked synced video and audio players, as well as image gallery and PDF viewer components.
- Provided development support on the web editor, ensuring state management would work as expected.
- Assisted with early integration of tracked external props.
- Helped to demo the app at Humber Tech Week


</div>
