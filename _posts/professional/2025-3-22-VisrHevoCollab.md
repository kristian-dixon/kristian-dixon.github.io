---
layout: portfolio_rethink
category: paid_work
title: VISR x Hevolus - Hevo-Collaboration
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/professional/hevocollab.jpg
pagecount: 1
engine: youtube-player
demo: AoeSDE9KwqA
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

# Intro

Hevo-Collaboration, now known as Hybrid Learning Spaces, was an application we built for one of our partners. The core concept of this application was to provide lecturers with the ability to create and present holographic slide decks to both local and remote users. Content was localised with a QR code, that's would provide an anchor point to ensure each user was localised correctly within the shared space.

Developed for mixed reality devices, the viewing application was developed primarily for Hololens 2 and then ported to iOS and Android. The port to iOS and Android was partially done as an accessibility feature, lowering the barrier of entry of the application whilst also allowing students to experience the content without risking simulation sickness. 

This project leveraged our in-house VERTX engine for networking. Using VERTX not only provided us with a simplified way to synchronise the viewed content, but it also meant we could incorporate features such as WebRTC. The primary use for WebRTC was to enable communication with remote users, but we were also able to make novel use of the video stream feature to enhance the accessibility of the application. By sending a copy of a user's render target through a WebRTC stream we could support showing the holographic content to all users in the room by displaying the video call on a projector screen. 

The holographic application also became something of a technical demo piece for many Azure features, such as remote rendering and live transcription complete with translation. Due to this we really pushed the Hololens 2 to the edge of what was possible for it to do.

A core part of this project was the editing tools, building on what we'd learnt in previous projects we were able to build a web editor that supported collaborative editing with another user that was using the holographic viewer application. This was another advantage of using VERTX, as both applications shared the same networked data schema, the only difficulty came with ensuring content looked the same on both the web and holographic sides.

Whilst this application was eventually handed back to Hevolus for their developers to continue work on it, a lot of the work my team completed is still present in the final product.

## Breakdown of my contributions

I worked on both the holographic app and the web based editor simultaneously. Being able to work on both sides simplified a lot of the implementation details as it meant the majority of the problems only needed to be solved once. Whilst I was essentially the primary developer, both teams had a junior engineer supporting me, this gave me the opportunity to mentor both engineers whilst helping them with adding their own features.

### Shared features between Web and Unity

- Designed and implemented system for loading and editing the holographic slide decks.
- Created networked components for synchronised text annotations, a audio/video player, and an image gallery renderer.
- Ensured application's networked gameplay logic matched the networked truth to support "late-joining" users.
- Integrated client's desired application flow.
- Worked with QA and stakeholders on tasking out each sprint.

### Holographic Unity App

- Built a call management/ user tracking system using our WebRTC offering.
- Implemented the WebRTC based video streaming solution to allow non-holographic users to experience the content.
- Integrated Azure Remote Rendering.
- Wrote a simplistic avatar system that'd render a user's gravatar in virtual space for remote users.
- Developed a system to allow users to draw line annotations.
- Used Azure to support real-time speech to text that would also be translated based on the users' language preferences.
- Networked positional manipulation of holographic objects.
- Built Android and iOS versions of the Unity application complete with device appropriate UI.

### Web App
- Built Babylon.js based web application that connected to the networked Unity session to enable "edit mode"
- Attempted to visually match holographic content to what Babylon.js was rendering
- Ensured the networked component's schema stayed consistent.
- Built system to manage saving deck content to VERTX.

</div>
