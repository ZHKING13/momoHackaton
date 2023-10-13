const mongoose = require('mongoose');

const { MONGO_URL } = process.env;
const { MONGO_URI } = process.env

const connectDb = async() => {
    try {
        await mongoose.connect(MONGO_URL, {

            useUnifiedTopology: true
        })
        console.log('DB conneected successfully')
    } catch (error) {
        console.log(error)
    }
}
connectDb();