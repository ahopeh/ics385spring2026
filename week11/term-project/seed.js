require('dotenv').config(); // loads the .env file so my database credentials stay secret
const mongoose = require('mongoose'); // imports mongoose 
const Property = require('./models/Property'); // imports my Property model so I can use it to shape the data I want to seed into my database

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('Connected to:', process.env.MONGO_URI))
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Connection error:', err));
/*

Purpose of above code: 
- mongoose.connect() is what actually copens the door to my database 
- process.env.MONGO_URI is what allows me to keep my database address a secret. If it was exposed it'd be a security risk. This allows it to be read from my .env file instead. 
- .then() will print "MongoDB connected" if the onnection is successful 
- .catch() will print an error message if something goes wrong when connecting. 

*/

const properties = [
    {
        name: 'Hale Ōhiʻa Lehua',
        island: 'Hawaiʻi',
        type: 'eco-lodge',
        description: 'An eco-lodge in the ancient ōhiʻa forests of Hawaiʻi near Volcano National Park. Guests are invited to participate in native plant tours, the quiet magic of the forest, craft workshops, and visits to the nearby volcano.',
        amenities: ['native plant tours', 'craft workshops', 'volcano hikes','farm to table meals', 'narrated stargazing', 'cold plunge', 'sauna'],
        targetSegment: 'eco-tourists',
        imageURL: '',
    },
    {
        name: 'Hilo Garden B&B',
        island: 'Hawaiʻi',
        type: 'vacation rental',
        description: 'A cozy B&B nestled next a lush garden in Hilo. Perfect for families who want to explore nearby waterfalls while also being close to farmers markets, the zoo, and local shops.',
        amenities: ['family-friendly sleeping arrangements', 'complimentary rain and beach gear', 'washer and dryer in house', 'spacious garden lanai', 'easy access to Rainbow Falls'], 
        targetSegment: 'families',
        imageURL: '',

    },
    {
        name: 'Kona Coast Vacation Rental',
        island: 'Hawaiʻi',
        type: 'vacation rental',
        description: 'A spacious ocean-view rental on the sunny Kona coast. Surrounded by coffee farms and artisan chocolate makers, this is the perfect retreat for those who farm-to-table luxuries.',
        amenities: ['ocean views', 'chocolate making workshops', 'coffee tasting tours', 'snorkel gear provided'],
        targetSegment: 'returning visitors',
        imageURL: '',
    },
    {
        name: 'Waimea Ranch Hotel',
        island: 'Hawaiʻi',
        type: 'hotel',
        description: 'A ranch-style hotel in the heart of paniolo country. Set against the backdrop of Mauna Kea, guests can experience the Hawaiian cowboy lifestyle with guided and unguided horseback rides, Polaris trails, and evening dinner concerts under the stars.',
        amenities: ['private horse included in rental price with all tack included', 'guided horseback tours', 'unguided horseback trails', 'Polaris trails', 'evening concerts', 'farm-to-table meals'],
        targetSegment: 'adventure seekers',
        imageURL: '',
    },
    {
        name: 'Waipio Valley Honeymoon Cottage',
        island: 'Hawaiʻi',
        type: 'vacation rental',
        description: 'A secluded and romantic cottage nestled in the lush jungle above Waipio Valley. Surrounded by waterfalls and tropical greenery, this intimate retreat is designed exclusively for couples seeking privacy, relaxation, and connection with the beauty of nature. Special massage and private chef services available to ensure a relaxing and unforgettable experience.',
        amenities: ['private chef', 'massage services', 'drop-off laundry service', 'private menu meal service', 'beach gear provided', 'saltwater plunge pool', 'sauna', 'hottub'],
        targetSegment: 'honeymooners',
        imageURL: '',
    },
];

const seedDB = async () => { // this is the function that seeds the database. It's async because it has to wait for a connection to the database to be established before it can do its work. 
    await Property.deleteMany({}); // clears any exisiting records so there are no duplicates
    await Property.insertMany(properties); // inserts all 5 of the properties in the array above into the database at once 
    console.log('Database seeded successfully!'); // prints a success message if everything goes as expected
    mongoose.connection.close(); // closes the connection with the database when done. 
};

seedDB(); // actually runs the function to seed the database.