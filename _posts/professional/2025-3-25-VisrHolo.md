---
layout: portfolio_rethink
category: paid_work
title: VISR - Holographic Video Calls
pagecount: 1

---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">

As a lot of my early VISR work revolved around working with depth sensing cameras I was given a research project for one of our partners who specialised in selling virtual meeting solutions. At the time they were investigating the concept of holographic in which depth information would be sent in a WebRTC call along with the users' colour information to allow a user to be reconstructed in 3D on the call receiver's device.

My role in this project was to research the problem and then build an MVP with what I learnt. For this project I had the following constraints:
- It must run using our partner's call management solution.
- It must use depth sensing cameras
- The application that received the call must run on a Quest Pro and Magic Leap 2.

As the client's call management solution was built for virtual conferencing, I also had to work around the fact that the video that was sent would likely be processed in ways that I wouldn't have control over. This essentially amounted to being restricted to only being able to send one video stream, not being able to send application messages through the data stream and being limited to a 16:9 aspect ratio to avoid the video being stretched. I also had very little control over the bitrate and quality settings.

After spending a month researching, I had two months to experiment and build an MVP. Whilst solutions like Microsoft's Holoportation was the dream, as the sole developer on the project I knew that expectations would have to be managed. As such my plan was to use the depth information from the camera as a heightmap and give that to a dense grid to provide a 3D approximation of a user. 

Due to the limitation of only having one video stream, I made the decision to create a texture atlas that contained both the depth and colour information. Originally I'd hoped that I could just use the alpha channel of the WebRTC stream for the depth information, but this turned out to be a dead end due to the low precision of the video stream's alpha channel. I had also briefly considered interlacing the depth information with the colour feed but I instantly realised this would be a bad idea as it'd cause huge issues with video compression. Instead, I settled for a naïve atlasing solution of just allocating specific areas of a texture to represent either colour or depth information, with a small amount of padding to protect against overflow caused by compression artefacts.

Planning for the future, I also wanted to support multiple camera sources that'd contribute to the population of a voxel grid. I also wanted to be able to test multiple depth cameras without having to make code changes on the receiver application, so to support both of these I needed to send metadata about where the camera feeds were in the texture along with the intrinsic and extrinsic values so that the depth information could be reconstructed accurately. As I couldn't use the WebRTC data channel, I used the chat function within the client's conferencing app to send the metadata on connection. This was a little naughty, however it meant that the application could work and support late joining users so it was a creative solution to a problem that couldn't be approached any other way.

Originally I only sent the depth texture as a greyscale value. As a lot of cameras capture depth images in 16 bit, this meant I was losing a lot of precision. Some of the research I'd done suggested encoding the depth information at full precision in the red and green channels and then utilising Hue-Depth encoding to add some compression resistance. 

This is a project that I wish I had more time with, it was a lot of fun but I know I could achieve a lot more with more time.

### My contributions to the project
- Performed research and wrote up reports for the client to understand what they should expect.
- Wrote native Unity plugin to read data from Intel RealSense cameras.
- Integrated WebRTC into the Unity project to connect to the client's Web Conferencing platform.
- Created dynamic texture atlasing system for incorporating multiple video sources into one video stream.
- Wrote system to encode depth information to make it resilient against compression artefacts.
- Tested multiple depth cameras to give recommendations of which are ideal for the usecase.
- Built receiver application with a custom shader to process the depth information and show an accurately sized recreation of the user in XR.

</div>
