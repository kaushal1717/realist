import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { DATABASE } from './config.js';
import authRoutes from './Routes/routes.js';

//port of localhost
const port = 6969;

//database
mongoose.connect(DATABASE).then(()=>{console.log('connected successfully with database')}).catch(err => {console.error(`Error occured : ${err}`)});

const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/", authRoutes);

app.listen(port, () => {console.log(`server listed on : http://localhost:${port}`)});