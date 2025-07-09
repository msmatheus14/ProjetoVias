import pkg from 'whatsapp-web.js'
import axios from 'axios'

//Adicionado por Matheus Andrade

const {Client, LocalAuth} = pkg

import qrcode from 'qrcode-terminal'

export class ChatBoot {

    constructor() {

        this.arraymsg = []
        this.obj = {}


        this.arraymsg = []

       this.client = new Client({
        
        authStrategy: new LocalAuth()
    });

        this.client.on('qr', qr => {

        qrcode.generate(qr, {small: true})

        })

        this.client.on('ready', () => {
            
        console.log('API WHATSAPP CONECTADA !')
});

        this.client.on('message', async msg => {

            

            

            if(msg.fromMe){

            }else
            if(msg.body === '!registrarBuraco'){
                
                msg.reply('Ola! Este é um projeto desevolvido pelos alunos: Matheus Andrade e Gabriel Alves do Instituto Federal de Nova Andradina')
                msg.reply('Envie a localização do buraco:')

                this.arraymsg[0] = 'aguardandoLocalização'

            }

            if(this.arraymsg[0] === 'aguardandoLocalização'){

                if(msg.location){
                    this.arraymsg[1] = {latitude:msg.location.latitude, longitude: msg.location.longitude}
                    msg.reply('De 1 a 5 como esta a gravidade do buraca?')
                }
            }
            console.log(this.arraymsg[0])

            if(this.arraymsg[1]){
                if(msg.body == '1' || msg.body == '2' || msg.body == '3' || msg.body == '4' || msg.body == '5'){
                    this.arraymsg[2] = msg.body
                    msg.reply('Digite uma descrição ou escreva NÃO:')
                }
            }

            if(this.arraymsg[2]){

                if(msg.body == 'não' || msg.body == 'Não' || msg.body == 'nao' || msg.body == 'NAO' || msg.body == 'n' || msg.body == 'N'){
                    this.arraymsg[3] = 'SEM DESCRIÇÃO'
                    this.arraymsg[4] = msg.from
                }else
                if(msg.body != '1' && msg.body != '2' && msg.body != '3' && msg.body != '4' && msg.body != '5' && msg.body != 'não' && msg.body != 'Não' && msg.body != 'nao' && msg.body != 'NAO' && msg.body != 'n' && msg.body != 'N' ){

                    this.arraymsg[3] = msg.body
                    this.arraymsg[4] = msg.from

                }

                if(this.arraymsg[4]){

                    this.obj = {

                    idDispositivo: this.arraymsg[4],
                    descricao: this.arraymsg[3],
                    latitude: this.arraymsg[1].latitude,
                    longitude: this.arraymsg[1].longitude,
                    criticidade: this.arraymsg[2]

                }

                    try {
                        const response = await axios.post('http://localhost:3000/report', this.obj)
                        this.arraymsg[5] = response
                    }
                    catch(error){

                        console.log('DEU ERRO NA API INTERNA DO SERVIDOR!')
                    }
                }

                if(this.arraymsg[5]){
                    
                    if(this.arraymsg[5].status == 208 ){

                        msg.reply('Ola! Esse buraco já foi reportado por alguém mas aumentamos a priorização dele no sistema. Agradecemos por sua participação!')
                        this.arraymsg = []
                        
                    }else
                    if(this.arraymsg[5].status == 201){

                        msg.reply('Ola! seu report foi adicionado com sucesso! Agradecemos por sua participação!')
                        this.arraymsg = []
                        
                    }
                }
                

                
            }
            
})
        this.client.initialize()

    }

}




