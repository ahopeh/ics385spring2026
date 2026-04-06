const mongoose = require('mongoose');
const Customer = require('./customerModel');
const Hotel = require('./hotelModel');
const Amenities = require('./amenitiesModel');

// Replace 'myDatabase' with the desired database name
require('dotenv').config();
const connectionString = process.env.ATLAS_URI || process.env.LOCAL_URI;

mongoose.connect(connectionString, { useNewUrlParser: true})
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Insert three records into the Customer model
    const customersToInsert = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '555-987-6543'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '555-555-1234'
      }
    ];

    // Delete all documents in the Customers collection
    try {
      const result = await Customer.deleteMany({});

      console.log(`Deleted ${result.deletedCount} customers.`);
    } catch (error) {
      console.error('Error deleting customers:', error);
    }
    
    // Insert Array of CustomersToInsert into Customers Collection
    try {
      const insertedCustomers = await Customer.insertMany(customersToInsert);
      console.log('Inserted customers:', insertedCustomers);
    } catch (error) {
      console.error('Error inserting customers:', error);
    }

    // Find all the documents with the last name 'Doe'
    try {
      const lastNameToFind = 'Doe';
      const customer = await Customer.find({ lastName: lastNameToFind });

      if (customer) {
        console.log(`Found customer with last name '${lastNameToFind}':`, customer);
      } else {
        console.log(`No customer found with last name '${lastNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding customer:', error);
    }
    
    // ── HOTELS ──────────────────────────────────────────────
    const hotelsToInsert = [
      {
        name: 'Hale Ōhiʻa Lehua',
        rating: 5,
        location: 'Volcano, Big Island',
        description: 'Eco-lodge nestled in ōhiʻa forests near Volcano National Park.'
      },
      {
        name: 'Waimea Ranch Hotel',
        rating: 4,
        location: 'Waimea, Big Island',
        description: 'Ranch-style hotel in the heart of paniolo country.'
      },
      {
        name: 'Hilo Garden B&B',
        rating: 4,
        location: 'Hilo, Big Island',
        description: 'Cozy family-friendly B&B nestled next to a lush garden in Hilo.'
      }
    ];

    try {
      await Hotel.deleteMany({});
      const insertedHotels = await Hotel.insertMany(hotelsToInsert);
      console.log('Inserted hotels:', insertedHotels);
    } catch (error) {
      console.error('Error inserting hotels:', error);
    }

    try {
      const nameToFind = 'Waimea Ranch Hotel';
      const hotel = await Hotel.find({ name: nameToFind });
      console.log(`Found hotel with name '${nameToFind}':`, hotel);
    } catch (error) {
      console.error('Error finding hotel:', error);
    }

    // ── AMENITIES ────────────────────────────────────────────
    const amenitiesToInsert = [
      { pool: true, lawn: true, BBQ: false, laundry: true },
      { pool: false, lawn: true, BBQ: true, laundry: false },
      { pool: true, lawn: false, BBQ: true, laundry: true }
    ];

    try {
      await Amenities.deleteMany({});
      const insertedAmenities = await Amenities.insertMany(amenitiesToInsert);
      console.log('Inserted amenities:', insertedAmenities);
    } catch (error) {
      console.error('Error inserting amenities:', error);
    }

    try {
      const amenities = await Amenities.find({ pool: true });
      console.log('Amenities with pool:', amenities);
    } catch (error) {
      console.error('Error finding amenities:', error);
    }

    // Close the MongoDB connection after finishing the operations
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Customer.find({});