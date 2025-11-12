import pkg from 'whatsapp-web.js';
import axios from 'axios';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

export class ChatBoot {

    constructor() {
        
        this.userStates = {};
        this.isInitializing = false;

        this.initializeClient();
    }

    initializeClient() {
        try {
            this.client = new Client({

                authStrategy: new LocalAuth(),
                puppeteer: {
                   // executablePath: '/usr/bin/chromium-browser',
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-extensions',
                        '--disable-gpu',
                        '--single-process',
                        '--no-zygote'
                    ]
                }
            });

            this.client.on('qr', qr => qrcode.generate(qr, { small: true }));
            this.client.on('ready', () => {
                console.log('API WHATSAPP CONECTADA!');
                this.isInitializing = false;
            });
            this.client.on('message', msg => this.handleMessage(msg));
            
           
            this.client.on('disconnected', (reason) => {
                console.error('WhatsApp desconectado:', reason);
                this.restartChatBot();
            });

            this.client.initialize();
        } catch (error) {
            console.error('Erro ao inicializar ChatBot:', error.message);
            this.restartChatBot();
        }
    }

    restartChatBot() {
        if (this.isInitializing) return;
        
        this.isInitializing = true;
        console.log('🔄 Reiniciando ChatBot em 5 segundos...');
        
        setTimeout(() => {
            try {
                if (this.client) {
                    this.client.destroy().catch(() => {});
                }
            } catch (error) {
                console.error('Erro ao destruir cliente anterior:', error.message);
            }
            
            this.initializeClient();
        }, 5000);
    }

    async handleMessage(msg) {
        try {
            if (msg.fromMe) return;

            const from = msg.from;
            const userState = this.userStates[from] || { etapa: 0 };
            const text = msg.body?.trim();

            if (['sair', 'SAIR', 'Sair'].includes(text)) {
                delete this.userStates[from];
                await msg.reply('Operação cancelada.');
                return;
            }

            if (userState.etapa === 0) {

                await msg.reply(
                    'Bem-vindo ao Chatbot do Projeto Vias!\n\n' +
                    '1 - Reportar buraco\n' +
                    '2 - Verificar estado de reportes\n\n' +
                    'Digite "Sair" para cancelar.'
                );

                this.userStates[from] = { etapa: 1, status: 'menu' };
                return;
            }

            if (userState.etapa === 1 && userState.status === 'menu') {

                if (text === '1') {

                    this.userStates[from] = { etapa: 2, status: 'aguardandoLocalizacao' };
                    await msg.reply('Envie a localização do buraco que deseja reportar.');
                    return;

                } else if (text === '2') {

                    this.userStates[from] = {etapa: 2, status: 'retornoburacos' };

                    const idDispositivo = msg.from;

                    try {
                        const response = await axios.get('http://localhost:3000/retornarestados', {
                            params: { idDispositivo } 
                        });
                        
                        let mensagem = "Buracos encontrados:\n\n";

                        response.data.forEach(b => {
                            mensagem += `Buraco ${b.N}\n`;
                            mensagem += `Data: ${b.data}\n`;
                            mensagem += `Latitude: ${b.latitude}\n`;
                            mensagem += `Longitude: ${b.longitude}\n`;
                            mensagem += `Descrição: ${b.descricao}\n`;
                            mensagem += `Status: ${b.status}\n`;
                            mensagem += `------------------------\n`;
                        });
                        
                        await msg.reply(mensagem);
                    } catch (error) {
                        console.error('❌ Erro ao buscar buracos:', error.message);
                        await msg.reply('Ocorreu um erro ao buscar os buracos. Tente novamente mais tarde.');
                    }

                    delete this.userStates[from];
                    return;

                } else {
                    await msg.reply('Opção inválida. Escolha 1 ou 2.');
                }

                return;
            }

            if (userState.etapa === 2 && msg.location && userState.status === 'aguardandoLocalizacao') {
                try {
                    const { latitude, longitude } = msg.location;

                    const cidadeResp = await axios.put(
                        'http://localhost:3000/verificarCidadePorRua',
                        { latitude, longitude }
                    );

                    if (cidadeResp.data != 'Nova Andradina') {

                        await msg.reply(
                            'Infelizmente estamos operando apenas em Nova Andradina.\n' +
                            'Por favor, envie uma localização válida ou digite "Sair" para cancelar.'
                        );
                        return;

                    } else {

                        const ruaResp = await axios.get(
                            'http://localhost:3000/verificarCidade',
                            { params: { latitude, longitude } }
                        );

                        if (ruaResp) {
                            await msg.reply(
                                `Localização recebida!\nBuraco localizado na rua: ${ruaResp.data.nomeRua}\n\n` +
                                `Informe a gravidade do buraco (1 a 5):\n\n` +
                                '1 - Leve (quase imperceptível)\n' +
                                '2 - Moderado (afeta um pouco a via)\n' +
                                '3 - Considerável (gera desconforto ao passar)\n' +
                                '4 - Grave (dificulta o tráfego e pode causar danos)\n' +
                                '5 - Crítico (alto risco de acidentes)'
                            );
                        }
                    }

                    this.userStates[from] = {
                        etapa: 3,
                        latitude,
                        longitude,
                        status: 'aguardandoGravidade'
                    };

                } catch (error) {
                    console.error('Erro ao verificar cidade:', error.message);
                    await msg.reply('Ocorreu um erro ao verificar a cidade. Tente novamente.');
                }
                return;
            }

            if (userState.etapa === 3 && userState.status === 'aguardandoGravidade') {
                if (!['1', '2', '3', '4', '5'].includes(text)) {
                    await msg.reply('Valor inválido. Digite um número entre 1 e 5.');
                    return;
                }

                this.userStates[from] = {
                    ...userState,
                    etapa: 4,
                    gravidade: text,
                    status: 'aguardandoDescricao'
                };

                await msg.reply(
                    'Deseja adicionar um comentário sobre o buraco?\n\n' +
                    'Digite 1 - para pular ou escreva seu comentário.'
                );
                return;
            }

            if (userState.etapa === 4 && userState.status === 'aguardandoDescricao') {

                
                let descricaoFinal = text === '1' ? 'SEM DESCRIÇÃO' : text;

                const reportObj = {
                    idDispositivo: msg.from,
                    descricao: descricaoFinal,
                    latitude: userState.latitude,
                    longitude: userState.longitude,
                    criticidade: userState.gravidade
                };

                try {
                    const response = await axios.post('http://localhost:3000/report', reportObj);

                    if (response.status === 208) {
                        await msg.reply(
                            `Buraco já reportado anteriormente.\n` +
                            `A prioridade do seu reporte foi aumentada.\n` +
                            `Total de confirmações: ${response.data.confirmacoes.confirmacoes}`
                        );
                    } else if (response.status === 201) {
                        await msg.reply('Reporte adicionado com sucesso! Obrigado pela colaboração!');
                    }
                } catch (error) {
                    console.error('❌ Erro ao enviar reporte:', error.message);
                    await msg.reply('Ocorreu um erro ao enviar seu reporte. Tente novamente mais tarde.');
                }

                delete this.userStates[from];
            }
        } catch (error) {
            console.error(' ERRO CRÍTICO no handleMessage:', error.message);
            try {
                await msg.reply('Desculpe, ocorreu um erro no chatbot. Por favor, tente novamente.');
            } catch (replyError) {
                console.error(' Erro ao enviar mensagem de erro:', replyError.message);
            }
        }
    }
}
