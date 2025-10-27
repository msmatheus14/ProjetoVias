import pkg from 'whatsapp-web.js';
import axios from 'axios';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

export class ChatBoot {

    constructor() {

        this.userStates = {}

        this.client = new Client({

            authStrategy: new LocalAuth(),

            puppeteer: {

                executablePath: '/usr/bin/chromium-browser',
                headless: true,

                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ],
            },
        });

        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('API WHATSAPP CONECTADA');
        });

        this.client.on('message', async msg => {
            const from = msg.from;
            const text = msg.body?.trim();
            const userState = this.userStates[from] || { etapa: 1, status: 'inicio' };

            if (text.toLowerCase() === 'oi' || text.toLowerCase() === 'olá') {
                msg.reply('Olá! Digite 1 para reportar um buraco ou 2 para listar os buracos próximos.');
                this.userStates[from] = { etapa: 1, status: 'inicio' };
                return;
            }

            if (userState.etapa === 1 && userState.status === 'inicio') {

                if (text === '1') {
                    this.userStates[from] = { etapa: 2, status: 'aguardandoCoordenadas' };
                    msg.reply('Envie as coordenadas do buraco no formato: latitude,longitude');
                    return;
                }

                if (text === '2') {
                    const idDispositivo = msg.from;
                    const response = await axios.get('http://localhost:3000/retornarestados', {
                        params: { idDispositivo }
                    });

                    msg.reply(JSON.stringify(response.data, null, 2));
                    delete this.userStates[from];
                    return;
                }

                msg.reply('Opção inválida. Digite 1 ou 2.');
                return;
            }

            if (userState.etapa === 2 && userState.status === 'aguardandoCoordenadas') {
                const partes = text.split(',');
                if (partes.length !== 2) {
                    msg.reply('Formato inválido. Envie no formato: latitude,longitude');
                    return;
                }

                const latitude = parseFloat(partes[0]);
                const longitude = parseFloat(partes[1]);

                if (isNaN(latitude) || isNaN(longitude)) {
                    msg.reply('Coordenadas inválidas. Envie novamente.');
                    return;
                }

                userState.latitude = latitude;
                userState.longitude = longitude;
                userState.etapa = 3;
                userState.status = 'aguardandoGravidade';
                msg.reply('Informe a gravidade do buraco:\n1 - Leve\n2 - Moderada\n3 - Grave\n4 - Muito Grave\n5 - Crítica');
                this.userStates[from] = userState;
                return;
            }

            if (userState.etapa === 3 && userState.status === 'aguardandoGravidade') {
                if (!['1','2','3','4','5'].includes(text)) {
                    msg.reply('Escolha um número de 1 a 5.');
                    return;
                }

                userState.gravidade = parseInt(text);
                userState.etapa = 4;
                userState.status = 'aguardandoDescricao';
                msg.reply('Deseja adicionar uma descrição?\n\nDigite 1 para pular ou escreva sua descrição.');
                this.userStates[from] = userState;
                return;
            }

           
            if (userState.etapa === 4 && userState.status === 'aguardandoDescricao') {

                if (text === '1') {

                    userState.descricao = 'SEM DESCRIÇÃO';

                    userState.etapa = 5;

                    userState.status = 'enviandoReporte';

                    msg.reply('Enviando seu reporte...');

                } else {

                    userState.descricao = text;

                    userState.etapa = 5;

                    userState.status = 'enviandoReporte';

                    msg.reply('Enviando seu reporte...');
                }

                this.userStates[from] = userState;
            }

            if (userState.etapa === 5 && userState.status === 'enviandoReporte') {

                const reportObj = {

                    idDispositivo: msg.from,

                    descricao: userState.descricao,

                    latitude: userState.latitude,

                    longitude: userState.longitude,
                    
                    criticidade: userState.gravidade
                };

                try {
                    const response = await axios.post('http://localhost:3000/report', reportObj);

                    if (response.status === 208) {
                        msg.reply(
                            `Buraco já reportado anteriormente.\n` +
                            `A prioridade do seu reporte foi aumentada.\n` +
                            `Total de confirmações: ${response.data.confirmacoes.confirmacoes}`
                        );
                    } else if (response.status === 201) {
                        msg.reply('Reporte adicionado com sucesso! Obrigado pela colaboração!');
                    }
                } catch (error) {
                    console.error('Erro ao enviar reporte:', error);
                    msg.reply('Ocorreu um erro ao enviar seu reporte. Tente novamente mais tarde.');
                }

                delete this.userStates[from];
                return;
            }

        });

        this.client.initialize();
    }
}
