import pkg from 'whatsapp-web.js'
import axios from 'axios'
import puppeteer, { executablePath } from 'puppeteer'


const {Client, LocalAuth} = pkg

import qrcode from 'qrcode-terminal'

export class ChatBoot {

    constructor() {

        this.arraymsg = []
        this.obj = {}


        this.arraymsg = []

       this.client = new Client({
        
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: {
                executablePath: puppeteer.executablePath(),
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        }
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
                
                msg.reply('Ola! Este é um projeto desevolvido pelos alunos: Matheus Andrade e Gabriel Alves do Instituto Federal de Nova Andradina \n \n Envie a localização do buraco:')
                

                this.arraymsg.push({mensagem: 'aguardandoLocalização', remetente: msg.from, etapa: 1})

            }

            if(this.arraymsg.some(p => p.mensagem == 'aguardandoLocalização' && p.remetente == msg.from && p.etapa == 1)){

                if(msg.location){

                    const objeto = {latitude:msg.location.latitude, longitude: msg.location.longitude}

                    const response = await axios.get('http://localhost:3000/verificarCidade', {

                         params: {
                            latitude: msg.location.latitude,
                            longitude: msg.location.longitude
  }

                    })

                    if(response.idRua){

                         this.arraymsg.push( {remetente: msg.from, latitude:msg.location.latitude, longitude: msg.location.longitude, etapa: 2})

                            msg.reply('Localização Recebida: Buraco está na ', response.nomeRua)

                            msg.reply('De 1 a 5 como esta a gravidade do buraco?')


                    }else
                    {
                        msg.reply(':( \n\nLamento! Infelizmente estamos operando apenas em Nova Andradina. \nFavor forneça uma localização de Nova Andradina ou digite "Sair" para cancelar!')
                    }

                  
                   
                    
                }
            }

            if(msg.body === 'sair' || msg.body == 'Sair' || msg.body == 'SAIR'){

                    let etapa1 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 1 )
                    let etapa2 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 2 )
                    let etapa3 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 3 )
                    let etapa4 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 4 )

                    this.arraymsg.splice(etapa1, 1)
                    this.arraymsg.splice(etapa2, 1)
                    this.arraymsg.splice(etapa3, 1)
                    this.arraymsg.splice(etapa4, 1)

            }

            if(this.arraymsg.some(p => p.remetente == msg.from && p.latitude && p.longitude && p.etapa == 2)){

                if(msg.body != '1' || msg.body != '2' || msg.body != '3' || msg.body != '4' || msg.body != '5'){

                    msg.reply('Favor digite um número de 1 a 5!')

                    
                }
                else
                {

                    this.arraymsg.push({remetente: msg.from, mensagem: msg.body, etapa: 3})

                    msg.reply('Digite uma descrição ou escreva NÃO:')

                }
            }

            if(this.arraymsg.some (p => p.remetente == msg.from && p.mensagem && p.etapa == 3)){

                if(msg.body == 'não' || msg.body == 'Não' || msg.body == 'nao' || msg.body == 'NAO' || msg.body == 'n' || msg.body == 'N'){

                    this.arraymsg.push({mensagem: 'SEM DESCRIÇÃO', remetente: msg.from, etapa: 4})
                   
                }else
                if(msg.body != '1' && msg.body != '2' && msg.body != '3' && msg.body != '4' && msg.body != '5' && msg.body != 'não' && msg.body != 'Não' && msg.body != 'nao' && msg.body != 'NAO' && msg.body != 'n' && msg.body != 'N' ){
                
                    this.arraymsg.push({mensagem: msg.body, remetente: msg.from, etapa: 4})
                   
                }

                if(this.arraymsg.some(p => p.remetente ==  msg.from && p.etapa == 4)){
                    
                    let  item1 = this.arraymsg.find (p => p.remetente == msg.from && p.etapa == 4 )
                    let  item2 = this.arraymsg.find (p => p.remetente == msg.from && p.etapa == 2 )
                    let  item3 = this.arraymsg.find (p => p.remetente == msg.from && p.etapa == 3 )

                    let etapa1 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 1 )
                    let etapa2 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 2 )
                    let etapa3 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 3 )
                    let etapa4 = this.arraymsg.findIndex(p => p.remetente == msg.from && p.etapa == 4 )

                    this.arraymsg.splice(etapa1, 1)
                    this.arraymsg.splice(etapa2, 1)
                    this.arraymsg.splice(etapa3, 1)
                    this.arraymsg.splice(etapa4, 1)

                    this.obj = {

                    idDispositivo: item1.remetente,
                    descricao: item1.mensagem,
                    latitude: item2.latitude,
                    longitude: item2.longitude,
                    criticidade: item3.mensagem

                }

                    try {
                        const response = await axios.post('http://localhost:3000/report', this.obj)
                       const valid = response


                        if(valid){
                    
                    if(valid.status == 208 ){

                        msg.reply('Ola! Esse buraco já foi reportado por alguém mas aumentamos a priorização dele no sistema. Agradecemos por sua participação!')
                        
                    }else
                    if(valid.status == 201){

                        msg.reply('Ola! seu report foi adicionado com sucesso! Agradecemos por sua participação!')
                        
                    }
                }


                    }
                    catch(error){

                        console.log('DEU ERRO NA API INTERNA DO SERVIDOR!')
                    }
                }

                
                
            }
            
})
        this.client.initialize()

    }

}




