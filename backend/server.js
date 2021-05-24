import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//BodyParser middleware
app.use(express.json());
dotenv.config();

//error middleware
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

//Conect to database
connectDB();

//Route
app.get('/', (req, res) => {
  res.send('APP is running');
});

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// routes middleware
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

//Static files
const __dirname = path.resolve(); // For es6 syntax ( import)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//ERROR middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const mode = process.env.NODE_ENV;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}  in ${mode} mode `);
});
