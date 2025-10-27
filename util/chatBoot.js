import pkg from 'whatsapp-web.js';
import axios from 'axios';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

export class ChatBoot {

    constructor() {
        
        this.userStates = {};

        this.client = new Client({

            authStrategy: new LocalAuth(),
            puppeteer: {
                executablePath: '/usr/bin/chromium-browser',
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
        this.client.on('ready', () => console.log('API WHATSAPP CONECTADA!'));
        this.client.on('message', msg => this.handleMessage(msg));

        this.client.initialize();
    }

    async handleMessage(msg) {
        if (msg.fromMe) return;

        const from = msg.from;
        const userState = this.userStates[from] || { etapa: 0 };
        const text = msg.body?.trim();

        if (['sair', 'SAIR', 'Sair'].includes(text)) {
            delete this.userStates[from];
            msg.reply('Operação cancelada.');
            return;
        }

        if (userState.etapa === 0) {

            msg.reply(

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

                msg.reply('Envie a localização do buraco que deseja reportar.');

                return;
            }else

            if (text === '2') {

                this.userStates[from] = {etapa: 2, status: 'retornoburacos' }

                const idDispositivo = msg.from

                const response = await axios.get('http://localhost:3000/retornarestados', {
                params: { idDispositivo } 
                });
                
                let mensagem = "Buracos encontrados:\n\n"

                response.data.forEach(b => {

                mensagem += `Buraco ${b.N}\n`
                mensagem += `Data: ${b.data}\n`
                mensagem += `Latitude: ${b.latitude}\n`
                mensagem += `Longitude: ${b.longitude}\n`
                mensagem += `Descrição: ${b.descricao}\n`
                mensagem += `Status: ${b.status}\n`

                mensagem += `------------------------\n`

            })
            

            msg.reply(mensagem);
            
            delete this.userStates[from];
            
            }
            else {

                msg.reply('Opção inválida. Escolha 1 ou 2.');
            }

            
            return;
        }

        if (userState.etapa === 2 && msg.location && userState.status == 'aguardandoLocalizacao') {
            try {
                const { latitude, longitude } = msg.location;

                const cidadeResp = await axios.put(
                    'http://localhost:3000/verificarCidadePorRua',
                    { latitude, longitude }
                );

                if (cidadeResp.data != 'Nova Andradina') {

                    msg.reply(

                        'Infelizmente estamos operando apenas em Nova Andradina.\n' +
                        'Por favor, envie uma localização válida ou digite "Sair" para cancelar.'

                    )

                    return

                }else{

                    const ruaResp = await axios.get(

                    'http://localhost:3000/verificarCidade',

                    { params: { latitude, longitude } }
                    
                );

                if(ruaResp){

                    msg.reply(`Localização recebida! Buraco localizado na ${ruaResp.data.nomeRua}` + '\n\nDe 1 a 5, qual a gravidade do buraco?\n\n' +
                    '1 - Leve (quase imperceptível)\n' +
                    '2 - Moderado (afeta um pouco a via)\n' +
                    '3 - Considerável (causa incômodo ao passar)\n' +
                    '4 - Grave (dificulta o tráfego)\n' +
                    '5 - Crítico (risco de acidente)');


                }


                }

            
                this.userStates[from] = {
                    etapa: 3,
                    latitude,
                    longitude,
                    status: 'aguardandoGravidade'
                };

            } catch (error) {
                
                console.error('Erro ao verificar cidade:', error);
                msg.reply('Ocorreu um erro ao verificar a cidade. Tente novamente.');
            }
            return;
        }



        if (userState.etapa === 3 && userState.status === 'aguardandoGravidade') {
            if (!['1', '2', '3', '4', '5'].includes(text)) {
                msg.reply('Valor inválido. Digite um número entre 1 e 5.');
                return;
            }

            this.userStates[from] = {
                ...userState,
                etapa: 4,
                gravidade: text,
                status: 'aguardandoDescricao'
            };

            msg.reply(
                
                '\n\nDeseja adicionar um comentário sobre o buraco?\n\n' +
                    '1 - Sim\n' +
                    '2 - Não' 
                
            );

            return;
        }

        if (userState.etapa === 4 && userState.status === 'aguardandoDescricao') {

            if (text === '1') {

                msg.reply('Digite sua descrição do buraco:');
                
                this.userStates[from] = {
                    ...userState,
                    etapa: 5,
                    status: 'esperandoDescricaoTexto'
                };

                return;
            } 
            
            if (text === '2') {

                this.userStates[from] = {
                    ...userState,
                    etapa: 5,
                    status: 'enviandoBuraco',
                    descricao: 'SEM DESCRIÇÃO'
                };
            }

        }

        if (userState.etapa === 5) {

            if (userState.status === 'esperandoDescricaoTexto') {
                this.userStates[from] = {
                    ...userState,
                    descricao: text,
                    status: 'enviandoBuraco'
                };
            }

            if (userState.status === 'enviandoBuraco') {

                const reportObj = {
                    idDispositivo: msg.from,
                    descricao: userState.descricao,
                    latitude: userState.latitude,
                    longitude: userState.longitude,
                    criticidade: userState.gravidade
                };

                try {
                    const response = await axios.post(
                        'http://localhost:3000/report',
                        reportObj
                    );

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
            }
        }
    }
}
