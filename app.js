import connectDB from './config/db.js';

import {ChatBoot} from './util/chatBoot.js'

import recebimentoRouter from './src/routes/recebimentoRouter.js';
import ruaRouter from './src/routes/ruaRouter.js';
import cidadeRouter from './src/routes/cidadeRouter.js';
import buracoRouter from './src/routes/buracoRouter.js'
import analiseRouter from './src/routes/rotaAnalise.js';

import express from 'express';
import cors from 'cors'

const app = express();
const port = 3000;


connectDB();

app.use(express.json());
app.use(cors())



app.get('/', (req, res) => {
  res.send('Hello World!');
});


const chatboot = new ChatBoot()



app.use('/', recebimentoRouter);
app.use('/', ruaRouter);
app.use('/', cidadeRouter);
app.use('/', buracoRouter)
app.use('/', analiseRouter);

export default app