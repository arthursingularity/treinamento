import sql from 'mssql'

const config = {
    user: 'STAM_DEV',
    password: 'admin',
    server: 'localhost',
    database: 'AULASQL',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS'
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

let cachedPool = null;

export async function connectToDatabase() {
    try {
        if (cachedPool) {
            return cachedPool;
        }

        cachedPool = await sql.connect(config);
        console.log('Conectado ao SQL Server com sucesso!');
        return cachedPool;
    } catch (err) {
        console.error('Erro na conexão com o banco de dados:', err);
        throw err;
    }
}