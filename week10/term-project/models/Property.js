const mongoose = require('mongoose'); // imports mongoose

const propertySchema = new mongoose.Schema({ // creates an empty template to be filled in
name: { type: String, required: true }, // name=field label, type=string means the value has to be text, required=true means the field can't be left blank 
island: { type: String, required: true }, // same as above but for the island
type: { type: String, enum:['hotel', 'vacation rental', 'eco-lodge'], required: true }, // enum means that only the exact values listed are allowed, like a dropdown menu with only these options. I added eco-lodge since that's what my property will be. 
description: { type: String, required: true }, // this is just to describe the property
amenities: [{ type: String }], // the brackets mean that this field will hold a list of things instead of just one value, in this case a list of amenities. 
targetSegment: { type: String, required: true }, // who is this property marketed towards? 
imageURL: { type: String }, // this is where a web address that points to a photo of the property will go. This will be used later to feed directly into my marketing page hero image. 
})

const Property = mongoose.model('Property', propertySchema); // mongoose.model() takes the template and turns it into someting I can acutally use for records in my database. 'Property' is the name MongoDB will use for the collection. In my database it'll automatically change to lowercase properties 

module.exports = Property; // this makes the file available to other files in my project - for instance seed.js  