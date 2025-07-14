// app.js
import connectDB from './config/db.js';
import { ChatBoot } from './util/chatBoot.js'; // Importa a classe ChatBoot
import recebimentoRouter from './src/routes/recebimentoRouter.js';
import ruaRouter from './src/routes/ruaRouter.js';
import cidadeRouter from './src/routes/cidadeRouter.js';
import buracoRouter from './src/routes/buracoRouter.js';
import analiseRouter from './src/routes/rotaAnalise.js';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const chatboot = new ChatBoot(); // Instancia o ChatBoot

// Adicione rotas para o status do bot e QR Code
app.get('/bot-status', (req, res) => {
    res.json({ ready: chatboot.isClientReady(), hasQr: !!chatboot.getQrCode() });
});

app.get('/bot-qr', (req, res) => {
    const qr = chatboot.getQrCode();
    if (qr) {
        res.json({ qr: qr });
    } else {
        res.status(404).json({ message: 'QR Code não disponível ou bot já conectado.' });
    }
});

app.use('/', recebimentoRouter);
app.use('/', ruaRouter);
app.use('/', cidadeRouter);
app.use('/', buracoRouter);
app.use('/', analiseRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});