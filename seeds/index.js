const express = require('express');
const path = require('path');
const cities = require('./cities');
const mongoose = require('mongoose');
const Group = require('../models/group');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/ConfApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Group.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const group = new Group({
            author: '6071eb303d220f07083b466a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            image: {
                url: 'https://res.cloudinary.com/dnqq7bvic/image/upload/v1618157925/ConfApp/z3daunrxa0pty0iqfidr.jpg',
                filename: 'ConfApp/z3daunrxa0pty0iqfidr'
            }
        })
        await group.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})