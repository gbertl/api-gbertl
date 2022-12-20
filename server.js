const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const cors = require('cors');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/works', require('./routes/works'));

app.listen(port, () => console.log(`Server started at ${port}`));
