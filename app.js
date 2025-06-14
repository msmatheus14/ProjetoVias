import connectDB from './config/db.js';

import recebimentoRouter from './src/routes/recebimentoRouter.js';
import ruaRouter from './src/routes/ruaRouter.js';
import cidadeRouter from './src/routes/cidadeRouter.js';

import express from 'express';
const app = express();
const port = 3000;


connectDB();

app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello World!');
});




app.use('/', recebimentoRouter);
app.use('/', ruaRouter);
app.use('/', cidadeRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});