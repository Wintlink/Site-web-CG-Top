const sql = require('mssql');

const config = {
    user: 'RobinTerry',
    password: 'PM-Rp&9',
    server: 'ND4BN206',
    database: 'PM-RobinTerry',
    options: {
        encrypt: true, // Use encryption
        enableArithAbort: true
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

module.exports = {
    sql,
    connectToDatabase
};
