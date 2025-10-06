require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true }
};

// 🔹 Crear cliente
app.post('/clientes', async (req, res) => {
  const { id_usuario, razon_social, direccion, telefono } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('razon_social', sql.NVarChar, razon_social)
      .input('direccion', sql.NVarChar, direccion)
      .input('telefono', sql.NVarChar, telefono)
      .query('INSERT INTO Clientes (id_usuario, razon_social, direccion, telefono) VALUES (@id_usuario, @razon_social, @direccion, @telefono)');
    res.status(201).send('✅ Cliente creado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al crear el cliente');
  }
});

// 🔹 Leer todos
app.get('/clientes', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Clientes');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al obtener clientes');
  }
});

// 🔹 Actualizar
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { id_usuario, razon_social, direccion, telefono } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('id_usuario', sql.Int, id_usuario)
      .input('razon_social', sql.NVarChar, razon_social)
      .input('direccion', sql.NVarChar, direccion)
      .input('telefono', sql.NVarChar, telefono)
      .query('UPDATE Clientes SET id_usuario=@id_usuario, razon_social=@razon_social, direccion=@direccion, telefono=@telefono WHERE id_cliente=@id');
    res.send('✅ Cliente actualizado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al actualizar cliente');
  }
});

// 🔹 Eliminar
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Clientes WHERE id_cliente=@id');
    res.send('🗑️ Cliente eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al eliminar cliente');
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 CRUD Clientes ejecutándose en http://localhost:${PORT}`));
