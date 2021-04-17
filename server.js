const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.DB_PORT || 5555;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.htm')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.fhgqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    err && console.log("connection error :", err)
    const topBannerCollection = client.db("driving-net-school").collection("top-banner-images");
    app.post('/addTopBanner', (req, res) => {
        topBannerCollection.insertOne(req.body.body)
            .then(result => {
                result.insertedCount > 0 && res.sendStatus(200)
            })
            .catch(err => console.log("create err : ", err))
    })
    app.get('/topBanner', (req, res) => {
        topBannerCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})