const express = require('express');

// Import mongodb, cors, dotenv and objectId
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

//App and Port here
const app = express();
const port = process.env.PORT || 5000;


// Set MiddleWare
app.use(cors());
app.use(express.json());

// Node server to mongodb database connection uri here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttpfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




/********************************************
 * Node server crud operation start from here
 ********************************************/

async function run() {

    try{

        // Connect with db
        await client.connect();

        // Recognize the database and data collection
        const database = client.db('Wow_Watch'); // Database name
        const watchesCollection = database.collection('Watches');
        const reviewsCollection = database.collection('Reviews');
        const ordersCollection = database.collection('Orders');
        const usersCollection = database.collection('Users');

        /*********************************
         *  All Post Api Here
         * ******************************/

        // Reviews Post Api
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
            
        }); 
       
       
        // Order Watch Post Api
        app.post('/orders', async(req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result);
            
        });
        
        // Add Watch Post Api
        app.post('/watches', async(req, res) => {
            const watches = req.body;
            const result = await watchesCollection.insertOne(watches);
            res.json(result);
            
        });

        // Users creation and saving the data Api
        app.post('/users', async(req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.json(result);
            
        });
        
        // Put api for storing hte third party login data api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Put api for storing thes admin data api
        app.put('/users/admin', async (req, res) => {
            const admin = req.body;
            const filter = { email: admin.email };
            const updateDoc = { $set: {role: 'admin'} };
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        });


        /*******************************
         * All Get Api Here
         * *****************************/

        // Get the watches data from the mongodb database
        app.get('/watches', async (req, res) => {
            const findWatch = watchesCollection.find({});
            const watches = await findWatch.toArray();
            res.send(watches);
        });
  
        // Get the reviews from the mongodb database
        app.get('/reviews', async (req, res) => {
            const findReview = reviewsCollection.find({});
            const review = await findReview.toArray();
            res.send(review);
        });
        
        // Get the orders from the mongodb database
        app.get('/orders', async (req, res) => {
            const findOrders = ordersCollection.find({});
            const orders = await findOrders.toArray();
            res.send(orders);
        });
        
        // Logged in user is admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })



        /******************************
         * Delete Api from the server
         * ***************************/

        // Delete the ordered watches from the database using delete api
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });

        // Delete the watches from the database using delete api
        app.delete('/watches/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await watchesCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });


    }

    finally{

        // await client.close();

    }
}


// Call the async function here
run().catch(console.dir);

/********************************************
 * Node server crud operation ends to here
 ********************************************/


app.get('/', (req, res) => {
    res.send('Node server is running');
});

app.listen(port, () => {
    console.log('App is running on port', port);
})