require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
