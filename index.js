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

        app.get("/servicesForHome", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        }),
            app.get("/services", async (req, res) => {
                const query = {};
                const cursor = serviceCollection.find(query);
                const services = await cursor.toArray();
                res.send(services)
            }),

            app.get("/service/:id", async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const service = await serviceCollection.findOne(query);
                res.send(service)
            });



    }


    finally {

    }

}

run().catch(error => console.error(error));


app.get("/", (req, res) => {
    res.send('Server side Running')
})

app.listen(port, () => {
    console.log('Education Server running on port- ', port);
})