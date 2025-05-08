---
layout: portfolio_rethink
title: "Simple Building Generator"
date: 2025-01-07 12:31:00 +0001
engine: "threejs-viewer"
demo: "skyscraper_generator"
pagecount: 1
desc: A port of my first procedural generation project.
img: https://kristian-dixon.github.io/assets/images/post_thumbnails/BuildingGenerator.png
---


<div markdown="1" class="pagnated-page-wrapper" data-page-index="0">


<button class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='generate'> Generate New Building </button>

## Intro

This project is a port of my one of my initial explorations into procedural mesh generation that dates back to around 2018. At that time, I was taking part in a lot of game jams and one game I worked on was "Stop Stealing Our Beans". In this game, the objective was to collect tins of beans from the streets of the city before returning them to your spacecraft to fuel it up. As this game was set in a New York style city, I wanted some way to generate interesting looking buildings and at the same time I was interested in learning how to procedurally generate meshes. Creating this building generator in Unity was the perfect excuse to do just that, and fast forward 7 years it's the perfect choice to do some initial exploration into mesh generation in ThreeJS.

My main objective for the building generator was that it to be capable of making low poly skyscrapers, to act as background elements of the scene. It required a variable height and sizing system to allow zoning of different city blocks and I also wanted to have some way to render windows on the surface. When porting this to ThreeJS, I kept everything largely the same outside of some minor refactoring. If I was to approach this from scratch, I'd be likely to just use Blender's geometry node system and add a lot more detail. 

The approach to generating these buildings is rather simple, the process it uses is as follows:

- Get a random number of iterations for the amount of building segments that'll be generated.
- Get random values for the initial building width and depth

And then for each iteration it does the following:
- Roll dice to see if this floor can expand
	- If it can expand it calculates how much can be potentially added to the width and depth
- Roll dice to see if the size of the width and depth values can taper.
	- If it can, generate values for top width and depth based on the per segment scale change parameter
	- If it can't set the top width and depth values to match the width and depth values
- Calculate a new random height for this segment
- Ensure all width and depth variables are positive
- Generate the mesh data for the segment
- Set width and depth values to the top width and depth values.
- Roll dice to see if the next floor is inset
	- If it is, generate new width and depth values for the next floor
- Ensure width and depth aren't getting too small

This will loop until the segment count is reached, at which point a spire may be generated after an extra dice roll. 

Whilst this is all rather simple, I'd like to go into a little more detail on a few points, which is what follows in this post. If you'd like to just play with the generator, the settings tab at the top will allow you to make a large range of different looking buildings.

#### Calculating Each Segment's size

As briefly touched on above, there are multiple steps in the process where the "size" (the width and depth) of a segment is calculated. The building generator is largely based on being subtractive, that being each iteration is likely to make up a smaller footprint than the last. This approach means that each building is confined it it's base size. 

Whilst this is ideal, it means that there's no chance of the generator creating buildings that have overhangs. This is why the expansion chance is an additional parameter. Having expansion enabled allows for the generation of more interesting buildings that slightly break how real buildings should look. 

The code for generating a floor's width is the following:

```TypeScript
let expansionAmount = rand() < expansionChance ? randFloat(minExpansion, maxExpansion) : 0.0;
let width = randFloat(currentWidth - perSegmentScaleChange, currentWidth + expansionAmount)
```

As you can see in the code, the chance of expansion is extremely low, as it first has to pass the expansion check and then generate a value between expansion min and max, and then once it has that value it's still heavily weighted towards the lower width boundary.

#### Rendering the windows

To render the windows I simply took the UV coordinates and multiplied them by a constant value to subdivide the UV space into 8 rectangles. The UV coordinates themselves range from 0 to 1 for each segment's face. Using a unique ID for each UV cell I could then use that as a random seed for the hash function and then lerp between two colours for the window's colour. There is then a simple lerp between two smoothsteps to control whether it's rendering the window or the building.

I did think about using an interior mapping shader for the building's windows but it never ended up looking quite right, so that'll be something to revisit in the future. The windows also have their roughness set to 0 when being rendered, this was just used to give a bit more of a "windowy" effect. As you can see in the demo, the number of windows per floor is fixed, this wasn't ideal but at the time it was the simplest approach to get something going. 

### Future notes

This is one of those projects that was so simple to implement that it took me about half an hour to get up and running in TypeScript and that's including the frustrating lack of operator overloading. One thing I would love to investigate someday would be using a similar subtractive approach but with support for buildings that have multiple main segments, instead of being generated around a central part. I'd also spend a lot more time on detailing and I'd likely work to a fixed grid so that a modular asset kit could be used to generate walls. 

Overall though, for a low poly building generator, I thought it was a fun toy to share that might be a simple first step for someone to get into procedural generation.


</div>

<div id="post_settings" markdown="1">

## Generator settings

<button class="in-post-button" style="margin:auto; width: 100%; min-height: 2rem;" data-cmd-call='generate'> Generate New Building </button>

<div class="settings_group">

<label for="iterations_min">Generate Building</label> <button class="in-post-button" data-cmd-call='generate'> Click </button>

<label for="iterations_min">Minimum Interations</label> 
<input type="number" id="iterations_min" class="in-post-inputfield" data-cmd-call='set:iterationsMin' value="3"/>

<label for="iterations_max">Maximum Interations</label> 
<input type="number" id="iterations_max" class="in-post-inputfield" data-cmd-call='set:iterationsMax' value="5"/>

<label for="segment_scale">Segment Scale</label> 
<input type="number" id="segment_scale" class="in-post-inputfield" data-cmd-call='set:initialScale' value="10"/>

<label for="segment_scale_change">Per segment scale change</label> 
<input type="number" id="segment_scale_change" class="in-post-inputfield" data-cmd-call='set:perSegmentScaleChange' value="10"/>

<label for="width_and_depth">Match Width and Depth</label> 
<input type="range" id="width_and_depth" class="in-post-inputfield" data-cmd-call='set:matchWidthAndDepthChance' value="1.0" min="0.0" max="1.0" step="0.1"/>

<label for="height_min">Minimum Height Per Segment</label> 
<input type="number" id="height_min" class="in-post-inputfield" data-cmd-call='set:heightMin' value="10.0"/>

<label for="height_max">Maximum Height Per Segment</label> 
<input type="number" id="height_max" class="in-post-inputfield" data-cmd-call='set:heightMax' value="15.0"/>

<label for="height_max">Maximum Height Per Segment</label> 
<input type="number" id="height_max" class="in-post-inputfield" data-cmd-call='set:heightMax' value="15.0"/>

<label for="expand_chance">Expand Chance</label> 
<input type="range" id="expand_chance" class="in-post-inputfield" data-cmd-call='set:expandChance' value="0.2" min="0.0" max="1.0" step="0.1"/>

<label for="expand_min">Expand Amount Minimum</label> 
<input type="number" id="expand_min" class="in-post-inputfield" data-cmd-call='set:expand_min' value="2.0"/>

<label for="expand_max">Expand Amount Maximum</label> 
<input type="number" id="expand_max" class="in-post-inputfield" data-cmd-call='set:expand_max' value="3.0"/>

<label for="inset_chance">Inset Chance</label> 
<input type="range" id="inset_chance" class="in-post-inputfield" data-cmd-call='set:insetChance' value="0.25" min="0.0" max="1.0" step="0.05"/>

<label for="taper_chance">Taper Chance</label> 
<input type="range" id="taper_chance" class="in-post-inputfield" data-cmd-call='set:taperChance' value="0.1" min="0.0" max="1.0" step="0.05"/>

<label for="spire_chance">Spire Chance</label> 
<input type="range" id="spireChance" class="in-post-inputfield" data-cmd-call='set:spireChance' value="0.2" min="0.0" max="1.0" step="0.05"/>



</div>
</div>