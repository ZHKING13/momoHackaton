const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./src/routes/user');
const { epargneRouter } = require('./src/routes/epargne');
const { transactionRouter } = require('./src/routes/transaction');
require('./config/DB');
const port = process.env.PORT;
const bodyParser = express.json;
require("./src/feature/MOMO_API")
require("./src/feature/disturbment")
const app = express();
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.use("/api/v1", router)
app.use("/api/v1", epargneRouter)
app.use("/api/v1", transactionRouter)

app.listen((process.env.PORT || 4000), () => {
    console.log(` app listening on port ${process.env.PORT}!`)
});