const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxywfhi.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d6iql3w.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const carCollection = client.db('carDB').collection('car');

    const myCartCollection = client.db('carDB').collection('myCart');

    const brandCollection = client.db('brandDB').collection('brand')

    app.get('/car', async(req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

   // data from brandName
    app.get('/car/:brandName', async(req, res) => {
      const brandName = req.params.brandName
      const query = {brandName: brandName}
      const cursor = carCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    // get data for details route
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      console.log("result", result);
      res.send(result);
    });
   
   // To update car
    app.get('/car/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.findOne(query);
      res.send(result);
    })


    // app.get('/myCart', async (req, res) => {
    //   try {
    //     const cursor = myCartCollection.find();
    //     const result = await cursor.toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error('Error fetching cart items:', error);
    //     res.status(500).send('Error fetching cart items');
    //   }
    // });

    app.post('/myCart', async(req, res) =>{
      const myCart = req.body;
      console.log(myCart);
      const result = await myCartCollection.insertOne(myCart);
      res.send(result);
    })
    

    app.post('/car', async(req, res) =>{
      const newCar = req.body;
      console.log(newCar);
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    })


   app.put('/product/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true };
    const updatedCar = req.body;
    const car = {
      $set: {
        name:updatedCar.name, 
        price:updatedCar.price, 
        type:updatedCar.type, 
        rating:updatedCar.rating, 
        brandName:updatedCar.brandName, 
        addButton:updatedCar.addButton, 
        detailsButton:updatedCar.detailsButton, 
        shortDescription:updatedCar.shortDescription, 
        image:updatedCar.image,

      }
    }
    const result = await carCollection.updateOne(filter, car, options);
    res.send(result);
   })

    app.delete('/car/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await carCollection.deleteOne(query);
      res.send(result);
    })

    
   // add to cart to my cart

   app.post('/brandCarts', async(req, res) => {
     const brand = req.body
     const result = await brandCollection.insertOne(brand)
     res.send(result)   

   })


   app.get('/brandCarts', async(req,res) => {
    const result = await brandCollection.find().toArray()
    res.send(result)
   })

   app.delete('/brandCarts/:id', async(req, res) =>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)} 
    const result = await brandCollection.deleteOne(query)
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//routes
app.get('/', (req, res) => {
    res.send('Abrars automobile server is running')
})

app.listen(port, () => {
    console.log(`Abrars automobile server is running on port: ${port}`);

})





