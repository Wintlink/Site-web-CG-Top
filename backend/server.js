const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

const config = {
    user: 'RobinTerry',
    password: 'PM-Rp&9',
    server: 'ND4BN206',
    database: 'PM-RobinTerry',
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Connected to the database successfully');
    } catch (err) {
        console.error('Database connection failed: ', err);
    }
}

connectToDatabase();

app.use(cors());

app.get('/api/gpus', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM dbo.Carte_Graphique');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL query failed: ', err);
        res.status(500).send('Server error');
    }
});

app.get('/api/gpus/:model', async (req, res) => {
    const model = req.params.model;
    try {
        const result = await sql.query(`SELECT * FROM dbo.Carte_Graphique WHERE GPU = '${model}'`);
        if (!result.recordset.length) res.status(404).send('GPU not found');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('SQL query failed: ', err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
