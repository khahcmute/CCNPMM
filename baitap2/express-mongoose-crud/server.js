const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/database');
const webRoutes = require('./src/routes/web');

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', webRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});