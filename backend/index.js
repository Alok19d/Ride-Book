import dotenv from 'dotenv';
dotenv.config();

import {app} from './src/app.js';
import connectDB from './src/config/db.js';

connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  
  app.on('error', (error) => {
    console.log(`Error: ${error}`);
    throw error;
  })

  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`MongoDB Connection Failed!!! ${err}`);
});