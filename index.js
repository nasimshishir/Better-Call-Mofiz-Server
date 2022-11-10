const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware==========
app.use(cors());
app.use(express.json());


// MongoDB Config===========
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterofassignment11.bgrdi86.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// MongoDB queries===============

async function run() {
    try {
        const serviceCollection = client.db('Legal_Consultant').collection('services');
        const ordersCollection = client.db('Legal_Consultant').collection('orders')
        const reviewsCollection = client.db('Legal_Consultant').collection('reviews')

        // Read Services for Homepage===========

        app.get("/servicesForHome", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        }),

            // Read Services for Services page===========
            app.get("/services", async (req, res) => {
                const query = {};
                const cursor = serviceCollection.find(query);
                const services = await cursor.toArray();
                res.send(services)
            }),

            // Post services from uder add service page============
            app.post("/services", async (req, res) => {
                const service = req.body;
                const services = await serviceCollection.insertOne(service);
                res.send(services)
            }),

            // Read Services for Service Details page===========
            app.get("/service/:id", async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const service = await serviceCollection.findOne(query);
                res.send(service)
            }),


            // ORDERS==============================================================

            // Post Orders from Place Order page===========
            app.post("/orders", async (req, res) => {
                const order = req.body;
                const orders = await ordersCollection.insertOne(order);
                res.send(orders);

            }),

            // Read orders list for Added Service Page===========
            app.get("/orders", async (req, res) => {
                let query = {};
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                const cursor = ordersCollection.find(query);
                const services = await cursor.toArray();
                res.send(services)
            }),


            // REVIEWS===================================================================

            // Post Reviews from Service Details Page===========
            app.post("/reviews", async (req, res) => {
                const review = req.body;
                const reviews = await reviewsCollection.insertOne(review);
                res.send(reviews);

            }),

            // Read Reviews from Service Details Page===========
            app.get("/reviews", async (req, res) => {
                let query = {};
                if (req.query.service) {
                    query = {
                        forService: req.query.service
                    }
                } const cursor = reviewsCollection.find(query);
                const reviews = await cursor.toArray();
                res.send(reviews)
            }),


            // Read Reviews from My Reviews Page===========
            app.get("/reviews", async (req, res) => {
                let query = {};
                if (req.query.email) {
                    query = {
                        reviewerEmail: req.query.email
                    }
                } const cursor = reviewsCollection.find(query);
                const reviews = await cursor.toArray();
                res.send(reviews)
            }),


            // Read Reviews from My Reviews Update Page===========
            app.get("/reviews/:id", async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const reviews = await reviewsCollection.findOne(query);
                res.send(reviews)
            }),


            // Delete Review from My Reviews Page and for Good=============
            app.delete("/reviews/:id", async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const result = await reviewsCollection.deleteOne(query);
                res.send(result)
            }),

            // Update Review from My Reviews Page and for Good=============
            app.patch("/reviews/:id", async (req, res) => {
                const id = req.params.id;
                console.log(id);
                const filter = { _id: ObjectId(id) };
                const newReview = req.body;
                console.log(newReview);
                const option = { upsert: true };
                const updatedReview = {
                    $set: {
                        review: newReview.feedback
                    }
                }
                const result = await reviewsCollection.updateOne(filter, updatedReview, option);
                res.send(result)
            })



    }


    finally {

    }

}

run().catch(error => console.error(error));


app.get("/", (req, res) => {
    res.send('Server side Running')
})

app.listen(port, () => {
    console.log('Assignment 11 Server running on port- ', port);
})