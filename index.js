const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI;

const app = express()
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("booknplay")
    const booknplayCollection = db.collection("facilities")

    // All facilities page API
    app.get('/facilities', async (req, res) => {
        const result = await booknplayCollection.find().toArray();
      res.json(result);
    })

    // Add facility API
    app.post('/facilities', async (req, res) => {
        const facilityData = req.body;
        console.log(facilityData)
        const result = await booknplayCollection.insertOne(facilityData);
        
        res.json(result);
    })

    // Facility Details page API
    app.get("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const result = await booknplayCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // Edit a facility API
    app.patch("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      console.log(updatedData);

      const result = await booknplayCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.json(result);
    });

    // Delete a facility API
    app.delete("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const result = await booknplayCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running fine!")
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})