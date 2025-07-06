const { Pool } = require('pg')

const pool = new Pool({
    user: 'elias',
    host: 'localhost',
    database: 'imc_db',
    password: '123321',
    port: 5432,
});

pool.connect()
    .then(() => console.log('Conectado ao PostgreSQL!'))
    .catch(err => console.error('Erro na conexão ao banco de dados: ', err));

module.exports = pool; 