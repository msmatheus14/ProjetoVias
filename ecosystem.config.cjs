module.exports = {
  apps: [
    {
      name: 'ProjetoVias',
      script: './app.js',
      cwd: '/home/projetovias/ProjetoVias',
      env: {
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      watch: false
    }
  ]
};
