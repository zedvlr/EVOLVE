const { connect } = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
require('colors');

async function connectDb() {
    connect(mongoUri);
    console.log('Database connected!'.yellow);
}

module.exports = connectDb;