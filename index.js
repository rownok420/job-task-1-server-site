const express = require("express");
require('dotenv').config()
const cors = require("cors")
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const { MongoClient } = require("mongodb");
const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amu9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
async function run() {
    try {
        await client.connect();
        const database = client.db("Indian_task");
        const usersCollection = database.collection("users");

        // GET USER
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find({});
            const users =  await cursor.toArray();
            res.send(users)
        })

        // POST USER
        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.json(result)
        })

        // DELETE USER
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.json(result)
        })

        console.log("Server Connected")


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Job Task Server is Started");
});

app.listen(port, () => {
    console.log("Listing to the server", port);
});

