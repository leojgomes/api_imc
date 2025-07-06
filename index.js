const express = require('express');
const app = express();
const pool = require('./config/db')

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

app.use(express.json());

function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

// Função para classificar IMC
function classificarIMC(imc) {
    if (imc < 18.5) {
        return 'Abaixo do peso';
    } else if (imc < 25) {
        return 'Peso normal';
    } else if (imc < 30) {
        return 'Sobrepeso';
    } else if (imc < 35) {
        return 'Obesidade grau I';
    } else if (imc < 40) {
        return 'Obesidade grau II';
    } else {
        return 'Obesidade grau III';
    }
}

// Rota para criar usuário com IMC
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, peso, altura } = req.body;

        // Validação dos dados
        if (!nome || !peso || !altura) {
            return res.status(400).json({
                erro: 'Nome, peso e altura são obrigatórios'
            });
        }

        if (peso <= 0 || altura <= 0) {
            return res.status(400).json({
                erro: 'Peso e altura devem ser valores positivos'
            });
        }

        // Calcula IMC
        const imc = calcularIMC(peso, altura);
        const classificacao = classificarIMC(imc);

        // Insere no banco
        const query = `
            INSERT INTO usuarios (nome, peso, altura, imc, classificacao)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const result = await pool.query(query, [nome, peso, altura, imc, classificacao]);
        const usuario = result.rows[0];

        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            peso: usuario.peso,
            altura: usuario.altura,
            imc: parseFloat(usuario.imc),
            classificacao: usuario.classificacao,

        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Rota para listar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        const query = 'SELECT * FROM usuarios ORDER BY created_at DESC';
        const result = await pool.query(query);

        const usuarios = result.rows.map(usuario => ({
            id: usuario.id,
            nome: usuario.nome,
            peso: usuario.peso,
            altura: usuario.altura,
            imc: parseFloat(usuario.imc),
            classificacao: usuario.classificacao,

        }));

        res.json(usuarios);

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            peso: usuario.peso,
            altura: usuario.altura,
            imc: parseFloat(usuario.imc),
            classificacao: usuario.classificacao,
            created_at: usuario.created_at
        });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Rota para atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, peso, altura } = req.body;

        // Validação dos dados
        if (!nome || !peso || !altura) {
            return res.status(400).json({
                erro: 'Nome, peso e altura são obrigatórios'
            });
        }

        if (peso <= 0 || altura <= 0) {
            return res.status(400).json({
                erro: 'Peso e altura devem ser valores positivos'
            });
        }

        // Calcula novo IMC
        const imc = calcularIMC(peso, altura);
        const classificacao = classificarIMC(imc);

        // Atualiza no banco
        const query = `
            UPDATE usuarios 
            SET nome = $1, peso = $2, altura = $3, imc = $4, classificacao = $5
            WHERE id = $6
            RETURNING *
        `;

        const result = await pool.query(query, [nome, peso, altura, imc, classificacao, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            peso: usuario.peso,
            altura: usuario.altura,
            imc: parseFloat(usuario.imc),
            classificacao: usuario.classificacao,
            created_at: usuario.created_at
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Rota para deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário deletado com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});