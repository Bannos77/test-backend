import express from 'express';
import dotenv from 'dotenv';
import routeIndex from './routes/index.js';  // Import the route files, check your filenames
import routeTest from './routes/test.js';  // this list will grow over time...
import routeMessages from './routes/messages.js';
import routeUser from './routes/user.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();


app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

 // Use the imported routes
 app.use('/', routeIndex);
 app.use('/test', routeTest);
 app.use('/messages', routeMessages);
 app.use('/user', routeUser);

// Event listeners for the connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });
