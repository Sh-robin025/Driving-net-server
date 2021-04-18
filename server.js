const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 5050;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.fhgqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error :", err)
    const topBannerCollection = client.db("driving-net-school").collection("top-banner-images");
    const serviceCollection = client.db("driving-net-school").collection("services");
    const courseCollection = client.db("driving-net-school").collection("courses");
    app.post('/addTopBanner', (req, res) => {
        topBannerCollection.insertOne(req.body.body)
            .then(result => {
                result.insertedCount > 0 && res.sendStatus(200)
            })
            .catch(err => console.log("banner post err : ", err))
    })
    app.get('/topBanner', (req, res) => {
        topBannerCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("service post err : ", err))
    })
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.post('/addCourse', (req, res) => {
        courseCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("course post err : ", err))
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})