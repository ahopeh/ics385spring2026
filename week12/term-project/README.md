# HW12-C: Hale Ōhiʻa Lehua 

This is the React marketing page for Hale Ōhiʻa Lehua, which I'm desiging as a science retreat and 
hospitality property on Hawaiʻi Island near Kīlauea volcano buttressing a Ohia Lehua forest. 
This was built with Vite and React functional components.

The page includes a HeroSection with looping USGS volcano footage from the recent April 9, 20206 episode. 
- AboutSection introducing the property's Two-Eyed Seeing philosophy 
- AmenitiesSection rendering 10 amenities via .map(), a ConditionsSnapshot 
- Live USGS alert level color coding, meaning the color composition of the site changes according the current alert level of the volcano (I thought this would be super neat!!!)
- CTASection with dual calls to action to target either Leisure and Research guests individually.

Decisions Made for this Week: chose to include a video hero over a static image to reflect the living, 
active nature of Kīlauea. Also wanted to add volcanic cursor particle effect adds subtle 
interactivity without overwhelming the content.

## Prior Work
This page connects to the Express/Mongoose backend built in Week 11, which is providing the GET properties/:id routes backed by MongoDB Atlas. Week 13 will be where the full API integration happens (at least that is the plan so far)

AI tools used: Claude (Anthropic) assisted with component structure, 
CSS styling, volcanic particle effect, and debugging. 