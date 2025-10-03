require('dotenv').config();   // carga las variables del .env
const sql = require('mssql');

// Configuración usando variables del .env
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, // requerido en Azure
        trustServerCertificate: false
    }
};

// Probar conexión
async function testConnection() {
    try {
        let pool = await sql.connect(config);
        console.log("✅ Conexión exitosa a la base de datos:", process.env.DB_NAME);
        await pool.close();
    } catch (err) {
        console.error("❌ Error de conexión:", err.message);
    }
}

testConnection();
