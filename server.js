const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/works', require('./routes/works'));

connectDB().then(() => {
  const port = process.env.PORT || 5000;

  app.listen(port, () => console.log(`Server started at ${port}`));
});
