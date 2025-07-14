
const fetch = require('node-fetch');

const RuasOverpass = async () => {


    const query = `

        [out:json][timeout:60];
        area["name"="Nova Andradina"]["boundary"="administrative"]->.searchArea;
        way["highway"]["name"](area.searchArea);
        out tags;
`;

  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: 'Erro na consulta Overpass API' });
    }

    const data = await response.json();

    
    const nomes = [...new Set(data.elements
        
      .map(e => e.tags && e.tags.name)
      .filter(Boolean))];

    return { ruas: nomes };

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados da API', details: error.message });
  }

}

const retornarNomeRua = async (lat, lon) => {


   const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'projetovia/1.0' 
      }
    });

    if (!response.ok) {
      throw new Error('Erro na requisição para Nominatim');
    }

    const data = await response.json();

    const rua = data.address.road || data.address.footway || data.address.path || 'Rua não encontrada';
    return rua;

  } catch (error) {
    console.error('Erro ao buscar nome da rua:');
    return null;
  }

}

module.exports = { RuasOverpass, retornarNomeRua }

