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

// 🔹 Crear proveedor
app.post('/proveedores', async (req, res) => {
  const { id_usuario, razon_social, direccion, telefono } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('razon_social', sql.NVarChar, razon_social)
      .input('direccion', sql.NVarChar, direccion)
      .input('telefono', sql.NVarChar, telefono)
      .query('INSERT INTO Proveedores (id_usuario, razon_social, direccion, telefono) VALUES (@id_usuario, @razon_social, @direccion, @telefono)');
    res.status(201).send('✅ Proveedor creado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al crear proveedor');
  }
});

// 🔹 Leer todos
app.get('/proveedores', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Proveedores');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al obtener proveedores');
  }
});

// 🔹 Actualizar
app.put('/proveedores/:id', async (req, res) => {
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
      .query('UPDATE Proveedores SET id_usuario=@id_usuario, razon_social=@razon_social, direccion=@direccion, telefono=@telefono WHERE id_proveedor=@id');
    res.send('✅ Proveedor actualizado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al actualizar proveedor');
  }
});

// 🔹 Eliminar
app.delete('/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Proveedores WHERE id_proveedor=@id');
    res.send('🗑️ Proveedor eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al eliminar proveedor');
  }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`🚀 CRUD Proveedores ejecutándose en http://localhost:${PORT}`));
