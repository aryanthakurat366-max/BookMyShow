const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');



dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/movies', require('./src/routes/movieRoutes'));
app.use('/api/v1/theatres', require('./src/routes/theatreRoutes'));
app.use('/api/v1/shows', require('./src/routes/showRoutes'));
app.use('/api/v1/bookings', require('./src/routes/bookingRoutes'));

app.get('/', (req, res) => {
    res.send('Book My Show Server');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});