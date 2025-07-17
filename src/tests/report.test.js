import request from 'supertest'
import app from '../../app.js'
import buracoModel from '../models/buracoModel.js'

//TESTE DE LANÇAMENTO MATHEUS ANDRADE, GALBRIEL ALVES E IGOR

describe('TESTE FUNCIONAL ROTA POST /report', () => {

  beforeAll(async () => {
    
    await buracoModel.deleteMany({})

  })

   

  it('REGISTRO COM SUCESSO!', async () => {

    const res = await request(app)

      .post('/report')
      .send({

        idDispositivo: 'teste123',
        latitude: -22.25376,
        longitude: -53.343953,
        descricao: 'Teste matheus123',
        criticidade: 3
      });

    expect(res.statusCode).toBe(201)
   
  })

  it('REGISTRO DUPLICADO', async () => {

    const res = await request(app)

      .post('/report')
      .send({

        idDispositivo: 'teste123',
        latitude: -22.25376,
        longitude: -53.343953,
        descricao: 'Teste matheus123',
        criticidade: 3
      });

    expect(res.statusCode).toBe(208)
   
  })

  it('DEVE RETORNAR ERRO POIS ESTÁ FALTANDO O idDISPOSITIVO', async () => {

    const res = await request(app)

      .post('/report')
      .send({

        
        latitude: -22.25376,
        longitude: -53.343953,
        descricao: 'Teste matheus123',
        criticidade: 3
      });

    expect(res.statusCode).toBe(400)
   
  })

  



})

describe('TESTE DE INTEGRAÇÃO POST /report', () => {

  beforeAll(async () => {
    
    await buracoModel.deleteMany({})
    
  })

   

  it('REALIZA REGISTRO E VERIFICAR SE SALVOU NO BANCO', async () => {

    const buracoTest = {

        idDispositivo: 'teste123',
        latitude: -22.25376,
        longitude: -53.343953,
        descricao: 'Teste matheus123',
        criticidade: 3
      }


    const res = await request(app)

      .post('/report')
      .send(buracoTest);

    expect(res.statusCode).toBe(201)
    
    const buraco = await buracoModel.findOne({idDispositivo:'teste123'})

    expect(buraco).not.toBeNull()
    expect(buraco.descricao).toBe(buracoTest.descricao)
   
  })

   
  })


  describe('TESTE DE REGRESSÃO GET /retornartodosburacos', () => {

  
  it('VERIFICA SE APÓS A INCLUSÃO DA NOVA ROTA, SE A ROTA GETBURACOS CONTINUA FUNCIONANDO', async () => {

  

    const res = await request(app).get('/retornartodosburacos')
      
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeInstanceOf(Array)

    
  })



   
  })


  describe('TESTE DE PERFORMACE POST /report', () => {

     beforeAll(async () => {
    
    await buracoModel.deleteMany({})
    
  })

  
   it('Deve responder em até 3 segundos', async () => {

    const tempoInicio = Date.now();

    const res = await request(app).post('/report')

      .send({

        idDispositivo: 'teste_performance',
        latitude: -22.25376,
        longitude: -53.343953,
        descricao: 'Teste de performance',
        criticidade: 2

      })

    
    const tempo = Date.now() - tempoInicio

            
      expect(tempo).toBeLessThan(3000)   
  })

  

   
  })
  

  




