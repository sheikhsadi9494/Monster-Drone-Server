const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4wgcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
    
        const database = client.db("monster-drone");
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
    
        //get all products data
        app.get('/products', async (req, res) => {
            const query = productsCollection.find({});
            const result = await query.toArray();
            res.json(result);
        })
        // get product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.json(result);
        })
        // post order data
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })
        // get all orders by thire email 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            console.log(query)
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })
        // get all orders data
        // app.get('/orders', async (req, res) => {
        //     const query = ordersCollection.find({});
        //     const result = await query.toArray();
        //     res.json(result);
        // })
        // get all orders by thire id
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await ordersCollection.findOne(query);
            res.json(result);
        })
        // delete order by thire id
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Monster Drone Server Running')
})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})