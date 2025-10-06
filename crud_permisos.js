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

// 🔹 Crear permiso
app.post('/permisos', async (req, res) => {
  const { nombre_permiso, descripcion } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('nombre_permiso', sql.NVarChar, nombre_permiso)
      .input('descripcion', sql.NVarChar, descripcion)
      .query('INSERT INTO Permisos (nombre_permiso, descripcion) VALUES (@nombre_permiso, @descripcion)');
    res.status(201).send('✅ Permiso creado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al crear permiso');
  }
});

// 🔹 Leer todos
app.get('/permisos', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Permisos');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al obtener permisos');
  }
});

// 🔹 Actualizar
app.put('/permisos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_permiso, descripcion } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre_permiso', sql.NVarChar, nombre_permiso)
      .input('descripcion', sql.NVarChar, descripcion)
      .query('UPDATE Permisos SET nombre_permiso=@nombre_permiso, descripcion=@descripcion WHERE id_permiso=@id');
    res.send('✅ Permiso actualizado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al actualizar permiso');
  }
});

// 🔹 Eliminar
app.delete('/permisos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Permisos WHERE id_permiso=@id');
    res.send('🗑️ Permiso eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al eliminar permiso');
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`🚀 CRUD Permisos ejecutándose en http://localhost:${PORT}`));
