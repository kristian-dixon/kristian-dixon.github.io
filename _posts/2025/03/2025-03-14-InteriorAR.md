---
layout: portfolio_rethink
title: Interior Mapping AR
subtitle: Drag to rotate. Pinch/ scroll to zoom :)
desc: A live demo of AR Integration in my blog.
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/ar_interiorthumb.png
engine: threejs-viewer
demo: interior_mapping_ar
pagecount: 1
AR_SUPPORTED: true
VR_SUPPORTED: true
---

<div markdown="1" class="pagnated-page-wrapper" data-page-index="0" data-cmd-call='showBuildingScene'>

## Intro

This is a relatively short post to demonstrate a new feature for this website, WebXR support. This feature is a combination of multiple web technologies working together. Originally I wasn't confident that WebXR content could render within an iFrame but barring any unexpected browser compatibility issues it seems to work perfectly.

In supported posts, there'll now be two additional buttons to enable either an AR or VR viewer at the top of the page. Unfortunately WebXR isn't supported on iOS, outside of a [WebXR viewer app](https://apps.apple.com/us/app/webxr-viewer/id1295998056) created by Mozilla so your viewing experience may be restricted. Hopefully sometime soon Apple will add full WebXR support to their phones. If your device doesn't support WebXR, or if it's disabled in your security settings then it should alert you when you click the button.

For testing WebXR in a desktop browser there's also some useful extensions, I've been using [Meta's WebXR device emulator](https://microsoftedge.microsoft.com/addons/detail/immersive-web-emulator/hhlkbhldhffpeibcfggfndbkfohndamj), although I think there's more options available that may do a better job of AR support.

Due to how my sandbox project works, it will now be simple to backport XR support into the existing ThreeJS based posts on this website however this feature will be rolled out gradually as some tweaks such as how objects are scaled and positioned will need to be rethought. Input is also an issue that needs thinking about, in demo pieces such as the mesh painter just won't work at the moment but I already have a system that generalises input across touch and mouse pointers so I will likely be able to extend that when I have the time.

In the future, I also want to add WebXR support to the WebGPU engine I've been making for the [chaotic attractors](<../../01/Chaotic Attractors.html>) but that'll be a little bit more involved so I'm saving it for a rainy weekend. I think WebXR will eventually open a lot of doors to new experiences as it matures.



## Shader Breakdown

Outside of all the talk about WebXR, this page also demonstrates a new take on my [previous interior mapping shader](../../02/27/InteriorMapping.html). Whilst I was working on this post I was playing Arkham Horror with my friends and I was thinking a lot about portals opening up through cracks in the fabric of the Universe. I thought the effect of a portal to a different room opening would look cool, and I knew it'd be a relatively quick turn around to write if I built on top of my previous work.

This shader is driven by the texture below. I'm essentially using the texture as an alpha mask, where time is used as the clip threshold to discard pixels that won't be drawn yet. To achieve the blue edges around the rim of the portal I added a small amount to the time value and used a smoothstep to lerp between the colour of the interior map and the highlight colour. I made the texture through taking a birds eye depth capture of some noisy terrain in Blender to get the original opening shape and then I overlaid some additional noise in Gimp to get some more interesting shaping.

![Heightmap](/assets/images/2025/ar_interiormapping/Crack.png)

The brighter areas of this texture will be drawn in first, and I limited the thresholding to ensure that there's a nice cracked boarder as when it touches the edge of the quad it slightly ruins the effect.

For the interior map I decided to use a normal house texture, originally I wanted to use a squiddy Lovecraftian style skybox but it was difficult to get looking nice. What I'd like to try in the future is rendering a second scene to a cubemap and using that as the interior map since then you could theoretically get cool animated environments as an interior.

I think this is a fun initial piece for a WebXR demo, and I'm excited to play with more ideas in the future :)

</div>




