const mongoose = require('mongoose');
require('dotenv').config();

const mongoDb = process.env.MONGODB_URL;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));