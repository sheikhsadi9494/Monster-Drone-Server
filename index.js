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
        const reviewCollection = database.collection('reviews');
        const usersCollectoin = database.collection('users');

         // post product data
         app.post('/products', async (req, res) => {
            const product = req.body;
            const reuslt = await productsCollection.insertOne(product);
            res.json(reuslt);
        })
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
        // post review data
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })
        // get all review data 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        // post users data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollectoin.insertOne(user);
            res.json(result);
        })
        // usert for cheack uesr 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true };
            const updateDoc = {$set: user};
            const reslut = await usersCollectoin.updateOne(filter, updateDoc, options);
            res.json(reslut);
        })
        // update user as admim
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('pur', user);
            const filter = {email: user.email};
            const updateDoc = { $set: {role: 'admin'} };
            const result = await usersCollectoin.updateOne(filter, updateDoc);
            res.json(result);
        })
        // cheak user admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollectoin.findOne(query);
            let isAdmin = false;
            if( user?.role === 'admin' ){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
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