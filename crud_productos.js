require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Configuración de la base de datos
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// 🔹 Ruta principal para probar conexión desde el navegador
app.get('/', (req, res) => {
  res.send(`
    <h1>✅ Servidor del ERP funcionando correctamente</h1>
    <p>Rutas disponibles:</p>
    <ul>
      <li><a href="/productos" target="_blank">GET /productos</a> → Ver productos</li>
      <li>POST /productos → Crear producto</li>
      <li>PUT /productos/:id → Actualizar producto</li>
      <li>DELETE /productos/:id → Eliminar producto</li>
    </ul>
  `);
});

// 🔹 Crear (POST)
app.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock)
      .query('INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES (@nombre, @descripcion, @precio, @stock)');
    res.status(201).send('✅ Producto creado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al crear el producto');
  }
});

// 🔹 Leer todos (GET)
app.get('/productos', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Productos');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al obtener productos');
  }
});

// 🔹 Actualizar (PUT)
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock)
      .query('UPDATE Productos SET nombre=@nombre, descripcion=@descripcion, precio=@precio, stock=@stock WHERE id=@id');
    res.send('✅ Producto actualizado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al actualizar producto');
  }
});

// 🔹 Eliminar (DELETE)
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Productos WHERE id=@id');
    res.send('🗑️ Producto eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error al eliminar producto');
  }
});

// 🔹 Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
});
