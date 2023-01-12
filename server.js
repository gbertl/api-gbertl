const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const worksRoutes = require('./routes/works');

const app = express();

const corsOrigins = process.env.CORS_ORIGINS.split(',');

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.use('/api/works', worksRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;

    app.listen(port, () => console.log(`Server started at ${port}`));
  })
  .catch((e) => console.log(e));
