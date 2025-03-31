---
layout: portfolio_rethink
category: paid_work
title: VISR - Hevolus - Hevo-Collaboration
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/professional/hevocollab.jpg
pagecount: 1
engine: youtube-player
demo: 2mFcE8gJX-0
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

# Intro

Hevo-Collaboration was an application that we built for one of our primary partners in Hevolus.  The core concept of this application was to provide lecturers with the ability to present holographic slide decks to both local and remote users. Using a simple QR code for localisation, content would appear in the shared space correctly for each user, whether they were viewing the lecture through a Hololens 2 or their own personal smart device.

This project leveraged VERTX for networking, but was also a demo piece for a lot of Azure technologies such as Remote Rendering and live dictation with translation. The project also contained a web component, which was used to simplify the spawning of objects in 3D space. I worked on both sides of this project. 

## Breakdown of my contributions
In this project I was essentially the primary developer until it was handed off to Hevolus. A lot of the features were developed whilst supporting a junior developer.

### Unity App
- Designed and implemented system for loading and editing the holographic slide decks
- Created networked components for synchronised text annotations, a media player, and an image gallery renderer.
- Wrote a simplistic avatar system that'd render a user's gravatar in virtual space for remote users.
- Built a call management/ user tracking system using our WebRTC offering.
- Implemented a video streaming system using WebRTC to present the user's point of view whilst including the holographic content.
- Integrated Azure Remote Rendering.
- Added a system to allow users to draw line annotations
- Used Azure to support real-time speech to text that would also be translated based on the users' language preferences.
- Built Android and iOS versions of the Unity application.

### Web App
Like with the Unity side, this part of the project was built alongside a junior programmer.

- Built Babylon.js based web application that connected to the networked Unity session to enable "edit mode"
- Attempted to visually match holographic content to what Babylon.js was rendering
- Ensured the networked component's schema stayed consistent.
- Built system to manage saving deck content to VERTX.
- Learnt how to use Docker to publish the application

</div>
