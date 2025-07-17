import { adicionarReportBuraco, verificarExistenciaBuraco } from './buracoController.js';

const recebimentoReport = async (req, res) => {

  const { idDispositivo, latitude, longitude, descricao, criticidade } = req.body;

  if (!idDispositivo || !latitude || !longitude || !criticidade) {

    if (!idDispositivo) {

      console.log('aqui, sem id');

      return res.status(400).json({ Mensagem: 'Erro no dado idDispositivo' })

    } else if (!latitude) {

      return res.status(400).json({ Mensagem: 'Erro no dado localizacao' })

    } else if (!longitude) {

      return res.status(400).json({ Mensagem: 'Erro no dado localizacao' })

    } else if (!criticidade) {

      return res.status(400).json({ Mensagem: 'Erro no dado criticidade' })

    }
  } else {

    const localizacao = {

      coordinates: [latitude, longitude]

    }

    try {

      const validacaoExistencia = await verificarExistenciaBuraco(latitude, longitude);

      if (validacaoExistencia.buracoExistente === true) {

        return res.status(208).json(validacaoExistencia)
      }

      if (validacaoExistencia.buracoExistente === false) {

        const reportAdicionado = await adicionarReportBuraco(

          idDispositivo,
          descricao,
          latitude,
          longitude,
          criticidade
        )

        if (reportAdicionado) {

          return res.status(201).json({ buracoExistente: false, reportAdicionado: true })

        } else {

          return res.status(500).json({ Mensagem: 'Erro ao adicionar report' })

        }
      }

      return res.status(404).json({ Mensagem: 'Erro desconhecido' })

    } catch (error) {

      console.error('Erro no recebimentoReport:', error)

      return res.status(500).json({ Mensagem: 'Erro interno do servidor' })
    }
  }
}

export { recebimentoReport }
