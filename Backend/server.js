import app from './app.js'

const port = process.env.PORT || 3002
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
  console.log(`Servidor rodando em ${host}:${port}`)
})
