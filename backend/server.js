const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

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
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/gpus', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM dbo.Carte_Graphique LEFT JOIN dbo.Nom_Constructeur ON dbo.Carte_Graphique.Id_Nom_Constructeur = dbo.Nom_Constructeur.Id_Nom_Constructeur');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL query failed: ', err);
        res.status(500).send('Server error');
    }
});

app.get('/api/gpus/:model', async (req, res) => {
    const model = decodeURIComponent(req.params.model);
    console.log(model)
    try {
        const result = await sql.query`SELECT * FROM dbo.Carte_Graphique WHERE Nom_CG = ${model}`;
        if (!result.recordset.length) return res.status(404).send('GPU not found');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL query failed: ', err);
        res.status(500).send('Server error');
    }
});

app.post('/api/gpus', async (req, res) => {
    try {
        const { Nom_CG, GPU, Generation, Base_clock, Boost_clock, Fonderie, Taille_puce, Date_de_sortie, Interface_Bus, Fréquence_mémoire, Qte_VRAM, Bande_passante_mem, Type_mem, Coeurs, Coeurs_Tensor, Coeurs_RT, TDP, Largeur, Longueur, Slots, Alimentation_recom, Connecteurs_dalim, Connecteurs_daffi } = req.body;
        const result = await sql.query`INSERT INTO dbo.Carte_Graphique (Nom_CG, GPU, Generation, Base_clock, Boost_clock, Fonderie, Taille_puce, Date_de_sortie, Interface_Bus, Fréquence_mémoire, Qte_VRAM, Bande_passante_mem, Type_mem, Coeurs, Coeurs_Tensor, Coeurs_RT, TDP, Largeur, Longueur, Slots, Alimentation_recom, Connecteurs_dalim, Connecteurs_daffi) VALUES (${Nom_CG}, ${GPU}, ${Generation}, ${Base_clock}, ${Boost_clock}, ${Fonderie}, ${Taille_puce}, ${Date_de_sortie}, ${Interface_Bus}, ${Fréquence_mémoire}, ${Qte_VRAM}, ${Bande_passante_mem}, ${Type_mem}, ${Coeurs}, ${Coeurs_Tensor}, ${Coeurs_RT}, ${TDP}, ${Largeur}, ${Longueur}, ${Slots}, ${Alimentation_recom}, ${Connecteurs_dalim}, ${Connecteurs_daffi})`;
        res.status(201).json({ message: 'GPU added successfully' });
    } catch (err) {
        console.error('SQL query failed: ', err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
