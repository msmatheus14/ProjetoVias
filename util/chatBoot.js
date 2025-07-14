import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import axios from 'axios';

let currentQrCode = '';

export class ChatBoot {
    constructor() {
        this.arraymsg = [];
        this.obj = {};

        this.client = new Client({
            authStrategy: new LocalAuth({
                // MUITO IMPORTANTE: Salvar a sessão em um caminho persistente.
                // Este caminho DEVE ser mapeado para um Volume Persistente no Railway.
                dataPath: '/app/.wwebjs_auth'
            }),
            puppeteer: {
                headless: true, // Apenas true ou false, não um objeto
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage', // Essencial para ambientes com pouca memória
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process', // Reduz o uso de memória
                    '--disable-gpu'
                ]
                // Não use executablePath aqui, deixe o Puppeteer encontrar no Dockerfile
            }
        });

        this.client.on('qr', qr => {
            console.log('QR Code recebido:', qr);
            qrcode.generate(qr, { small: true });
            currentQrCode = qr; // Armazena o QR Code para ser acessado via API
        });

        this.client.on('ready', () => {
            console.log('API WHATSAPP CONECTADA !');
            currentQrCode = ''; // Limpa o QR Code quando conectado
        });

        this.client.on('authenticated', () => {
            console.log('WhatsApp autenticado!');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('Falha na autenticação:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('WhatsApp desconectado:', reason);
            // Se desconectar, pode ser necessário gerar um novo QR
            currentQrCode = ''; 
        });

        this.client.on('message', async msg => {
            if (msg.fromMe) {
                return; // Ignora mensagens enviadas por você mesmo
            }

            if (msg.body === '!registrarBuraco') {
                msg.reply('Olá! Este é um projeto desenvolvido pelos alunos: Matheus Andrade e Gabriel Alves do Instituto Federal de Nova Andradina \n \n Envie a localização do buraco:');
                this.arraymsg.push({ mensagem: 'aguardandoLocalização', remetente: msg.from, etapa: 1 });
            } else if (this.arraymsg.some(p => p.mensagem == 'aguardandoLocalização' && p.remetente == msg.from && p.etapa == 1)) {
                if (msg.location) {
                    const response = await axios.get('http://localhost:3000/verificarCidade', {
                        params: {
                            latitude: msg.location.latitude,
                            longitude: msg.location.longitude
                        }
                    });
                    if (response.data && response.data.idRua) { // Acesse response.data
                        this.arraymsg.push({ remetente: msg.from, latitude: msg.location.latitude, longitude: msg.location.longitude, etapa: 2 });
                        msg.reply(`Localização Recebida: Buraco está na ${response.data.nomeRua}`); // Acesse response.data
                        msg.reply('De 1 a 5 como esta a gravidade do buraco?');
                    } else {
                        msg.reply(':( \n\nLamento! Infelizmente estamos operando apenas em Nova Andradina. \nFavor forneça uma localização de Nova Andradina ou digite "Sair" para cancelar!');
                    }
                } else {
                    msg.reply('Por favor, envie a localização do buraco.');
                }
            } else if (msg.body.toLowerCase() === 'sair') {
                // Limpa todas as etapas para o remetente
                this.arraymsg = this.arraymsg.filter(p => p.remetente !== msg.from);
                msg.reply('Processo cancelado. Digite !registrarBuraco para iniciar novamente.');
            } else if (this.arraymsg.some(p => p.remetente == msg.from && p.latitude && p.longitude && p.etapa == 2)) {
                const gravidade = parseInt(msg.body);
                if (gravidade >= 1 && gravidade <= 5) {
                    this.arraymsg.push({ remetente: msg.from, mensagem: gravidade, etapa: 3 });
                    msg.reply('Digite uma descrição ou escreva NÃO:');
                } else {
                    msg.reply('Favor digite um número de 1 a 5!');
                }
            } else if (this.arraymsg.some(p => p.remetente == msg.from && p.mensagem && p.etapa == 3)) {
                let descricao = msg.body.toLowerCase();
                if (['não', 'nao', 'n'].includes(descricao)) {
                    descricao = 'SEM DESCRIÇÃO';
                }
                this.arraymsg.push({ mensagem: descricao, remetente: msg.from, etapa: 4 });

                // Se a etapa 4 foi adicionada, processar o report
                if (this.arraymsg.some(p => p.remetente == msg.from && p.etapa == 4)) {
                    let item4 = this.arraymsg.find(p => p.remetente == msg.from && p.etapa == 4);
                    let item2 = this.arraymsg.find(p => p.remetente == msg.from && p.etapa == 2);
                    let item3 = this.arraymsg.find(p => p.remetente == msg.from && p.etapa == 3);

                    this.obj = {
                        idDispositivo: item4.remetente,
                        descricao: item4.mensagem,
                        latitude: item2.latitude,
                        longitude: item2.longitude,
                        criticidade: item3.mensagem
                    };

                    try {
                        const response = await axios.post('http://localhost:3000/report', this.obj);
                        const valid = response.data; // Acesse response.data

                        if (valid) {
                            if (response.status == 208) {
                                msg.reply('Olá! Esse buraco já foi reportado por alguém mas aumentamos a priorização dele no sistema. Agradecemos por sua participação!');
                            } else if (response.status == 201) {
                                msg.reply('Olá! seu report foi adicionado com sucesso! Agradecemos por sua participação!');
                            }
                        }
                    } catch (error) {
                        console.error('DEU ERRO NA API INTERNA DO SERVIDOR!', error.message);
                        msg.reply('Ocorreu um erro ao registrar o buraco. Por favor, tente novamente mais tarde.');
                    } finally {
                        // Limpa todas as etapas para o remetente após o processamento
                        this.arraymsg = this.arraymsg.filter(p => p.remetente !== msg.from);
                    }
                }
            }
        });

        this.client.initialize();
    }

    // Método para obter o QR Code (para sua API Express)
    getQrCode() {
        return currentQrCode;
    }

    // Método para verificar se o cliente está pronto
    isClientReady() {
        return this.client.isReady;
    }
}

