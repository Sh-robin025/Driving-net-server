const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { json } = require('express');
const { ObjectID } = require('mongodb');
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
    const orderCollection = client.db("driving-net-school").collection("orders");
    const adminCollection = client.db("driving-net-school").collection("admins");
    const userCollection = client.db("driving-net-school").collection("users");

    app.post('/addTopBanner', (req, res) => {
        topBannerCollection.insertOne(req.body.body)
            .then(result => {
                result.insertedCount > 0 && res.sendStatus(200)
            })
            .catch(err => console.log("banner post err : ", err))
    })
    app.get('/topBanner', (req, res) => {
        topBannerCollection.find()
            .toArray((err, items) => res.send(items))
    })
    app.delete('/deleteBanner/:id', (req, res) => {
        console.log(req.params.id)
        topBannerCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                result.deletedCount === 1 && res.send("delete success")
            })
            .catch(err => console.log("delete err : ", err))
    })
    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("service post err : ", err))
    })
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => res.send(items))
    })
    app.delete('/deleteService/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                result.deletedCount === 1 && res.send("delete success")
            })
            .catch(err => console.log("delete err : ", err))
    })
    app.post('/addCourse', (req, res) => {
        courseCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("course post err : ", err))
    })
    app.get('/courses', (req, res) => {
        courseCollection.find()
            .toArray((err, items) => res.send(items))
    })
    app.delete('/deleteCourse/:id', (req, res) => {
        courseCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                result.deletedCount === 1 && res.send("delete success")
            })
            .catch(err => console.log("delete err : ", err))
    })
    app.post('/addAdmin', (req, res) => {
        adminCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("admin add err : ", err))
    })
    app.post('/addUser', (req, res) => {
        adminCollection.find({ email: req.body.body.email })
            .toArray((err, admin) => {
                if (admin.length === 0) {
                    userCollection.find({ 'data.email': { $exists: true } }, { 'data.email': req.body.body.email })
                        .toArray((err, result) => {
                            if (result.length === 0) {
                                userCollection.insertOne({ data: req.body.body, isCustomer: true })
                                    .then(result => result.insertedCount > 0 && res.sendStatus(200))
                                    .catch(err => console.log("user add err :", err))
                            }
                        })
                }
                adminCollection.updateOne({ email: req.body.body.email }, { $set: req.body.body })
            })

    })
    app.get('/user/:email', (req, res) => {
        adminCollection.find({ email: req.params.email })
            .toArray((err, admin) => {
                admin.length !== 0 && res.send(admin)
                if (admin.length === 0) {
                    userCollection.find({ 'data.email': { $exists: true } }, { 'data.email': req.params.email })
                        .toArray((err, user) => res.send(user))
                }
            })
    })
    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body.body)
            .then(result => result.insertedCount > 0 && res.sendStatus(200))
            .catch(err => console.log("order add err :", err))
    })
    app.get('/orders/:email', (req, res) => {
        adminCollection.find({ "email": req.params.email })
            .toArray((err, result) => {
                if (result.length) {
                    orderCollection.find()
                        .toArray((err, items) => res.send(items))
                } else {
                    orderCollection.find({ "email": req.params.email })
                        .toArray((err, items) => res.send(items))
                }
            })

    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})