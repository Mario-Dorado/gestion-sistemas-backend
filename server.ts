import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Casa Toyosato Backend Running!');
});

//------------------------------------------------------ USUARIOS ------------------------------------------------------

// Registro de usuario
app.post('/register', async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    return; 
  }

  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      res.status(409).json({ error: 'El correo ya está registrado.' });
      return; 
    }

    const nuevo = await prisma.usuario.create({
      data: { nombre, email, password }
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevo
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
});

// Login de usuario
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Correo y contraseña requeridos.' });
    return;
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Credenciales incorrectas.' });
      return; 
    }

    res.json({ mensaje: 'Login exitoso', usuario: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login.' });
  }
});

//------------------------------------------------------ PRODUCTOS ------------------------------------------------------

app.get('/productos', async (_req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    console.error('ERROR EN /productos:', error);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

app.post('/productos', async (req: Request, res: Response) => {
  const { codigo, nombre, precioUnitario, pesoKg } = req.body;

  if (
    !codigo || !nombre ||
    typeof precioUnitario !== 'number' || precioUnitario <= 0 ||
    typeof pesoKg !== 'number' || pesoKg <= 0
  ) {
    res.status(400).json({ error: 'Datos inválidos o incompletos' });
    return;
  }

  try {
    const existe = await prisma.producto.findUnique({ where: { codigo } });

    if (existe) {
      res.status(409).json({ error: 'El código ya está registrado' });
      return;
    }

    const nuevo = await prisma.producto.create({
      data: { codigo, nombre, precioUnitario, pesoKg },
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al guardar producto' });
  }
});

app.put('/productos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, precioUnitario, pesoKg } = req.body;

  if (
    !nombre ||
    typeof precioUnitario !== 'number' || precioUnitario <= 0 ||
    typeof pesoKg !== 'number' || pesoKg <= 0
  ) {
    res.status(400).json({ error: 'Datos inválidos para actualizar' });
    return;
  }

  try {
    const actualizado = await prisma.producto.update({
      where: { id },
      data: { nombre, precioUnitario, pesoKg },
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE: Eliminar producto por ID
app.delete('/productos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    await prisma.producto.delete({
      where: { id },
    });
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// ------------------------------------------------------ CLIENTES ------------------------------------------------------

// GET: Listar todos los clientes
app.get('/clientes', async (_req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('ERROR EN /clientes (GET):', error);
    res.status(500).json({ error: 'Error al obtener clientes.' });
  }
});

// POST: Registrar un nuevo cliente
app.post('/clientes', async (req: Request, res: Response) => {
  const { ci, nombre, tipo } = req.body;

  if (!ci || !nombre || !tipo) {
    res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    return 
  }

  try {
    const existe = await prisma.cliente.findUnique({ where: { ci } });

    if (existe) {
      res.status(409).json({ error: 'El CI ya está registrado.' });
      return 
    }

    const nuevoCliente = await prisma.cliente.create({
      data: { ci, nombre, tipo },
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error en POST /clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.put('/clientes/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, tipo } = req.body;

  if (!nombre || !tipo) {
    res.status(400).json({ error: 'Nombre y tipo son obligatorios para editar' });
    return 
  }

  try {
    const actualizado = await prisma.cliente.update({
      where: { id },
      data: { nombre, tipo },
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// DELETE: Eliminar cliente por ID
app.delete('/clientes/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return 
  }

  try {
    await prisma.cliente.delete({
      where: { id },
    });
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('ERROR AL ELIMINAR CLIENTE:', error);
    res.status(500).json({ error: 'Error al eliminar cliente.' });
  }
});

// ------------------------------------------------------ PEDIDOS ------------------------------------------------------

// Obtener todos los pedidos con sus relaciones
app.get('/pedidos', async (_req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        seguro: true,
        transportadora: true,
        tasaImpositiva: true,
        costoFronterizo: true,
        productosPedido: {
          include: {
            producto: true
          }
        }
      }
    });

    const pedidosConResumen = pedidos.map((pedido: any) => {
      let pesoTotal = 0;
      for (const item of pedido.productosPedido) {
        pesoTotal += item.pesoKg * item.cantidad;
      }
      const camiones = Math.ceil(pesoTotal / 18000);

      return {
        ...pedido,
        pesoTotal,
        camionesNecesarios: camiones
      };
    });

    res.json(pedidosConResumen);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST: Crear nuevo pedido
app.post('/pedidos', async (req: Request, res: Response) => {
  const {
    codigoPedido,
    clienteId,
    seguroId,
    transportadoraId,
    tasaImpositivaId,
    productos,
    aplicarCostosFronterizos
  } = req.body;

  if (!codigoPedido || !clienteId || !seguroId || !transportadoraId || !tasaImpositivaId || !productos || !Array.isArray(productos) || productos.length === 0) {
    res.status(400).json({ error: 'Faltan campos obligatorios o productos para crear el pedido.' });
    return;
  }

  const productosValidos = productos.every(p => typeof p.productoId === 'number' && typeof p.cantidad === 'number');
  if (!productosValidos) {
    res.status(400).json({ error: 'Cada producto debe tener productoId y cantidad válidos.' });
    return;
  }

  try {
    let costoTotal = 0;
    let pesoTotal = 0;
    const productosParaCrear = [];

    for (const item of productos) {
      const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
      if (!producto) {
        res.status(404).json({ error: `Producto con ID ${item.productoId} no encontrado` });
        return;
      }
      costoTotal += producto.precioUnitario * item.cantidad;
      pesoTotal += producto.pesoKg * item.cantidad;
      productosParaCrear.push({
        producto: { connect: { id: producto.id } },
        cantidad: item.cantidad,
        pesoKg: producto.pesoKg
      });
    }

    let costoFronterizoExtra = 0;
    let primerCostoId: number | null = null;
    if (aplicarCostosFronterizos) {
      const todos = await prisma.costoFronterizo.findMany();
      costoFronterizoExtra = todos.reduce((sum: number, c: { costo: number }) => sum + c.costo, 0);
      if (todos.length > 0) primerCostoId = todos[0].id;
      costoTotal += costoFronterizoExtra;
    }

    const nuevoPedido = await prisma.pedido.create({
      data: {
        codigo: codigoPedido,
        costoTotal,
        cliente: { connect: { id: clienteId } },
        seguro: { connect: { id: seguroId } },
        transportadora: { connect: { id: transportadoraId } },
        tasaImpositiva: { connect: { id: tasaImpositivaId } },
        ...(primerCostoId && aplicarCostosFronterizos && {
          costoFronterizo: { connect: { id: primerCostoId } }
        }),
        productosPedido: { create: productosParaCrear }
      },
      include: {
        cliente: true,
        seguro: true,
        transportadora: true,
        tasaImpositiva: true,
        costoFronterizo: true,
        productosPedido: { include: { producto: true } }
      }
    });

    const camionesNecesarios = Math.ceil(pesoTotal / 18000);
    res.status(201).json({ ...nuevoPedido, pesoTotal, camionesNecesarios });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
});

// PUT: Actualizar un pedido
app.put('/pedidos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    codigoPedido,
    clienteId,
    seguroId,
    transportadoraId,
    tasaImpositivaId,
    productos,
    aplicarCostosFronterizos
  } = req.body;

  if (!codigoPedido || !clienteId || !seguroId || !transportadoraId || !tasaImpositivaId || !productos || !Array.isArray(productos) || productos.length === 0) {
    res.status(400).json({ error: 'Faltan campos obligatorios o productos para actualizar el pedido.' });
    return;
  }

  const productosValidos = productos.every(p => typeof p.productoId === 'number' && typeof p.cantidad === 'number');
  if (!productosValidos) {
    res.status(400).json({ error: 'Cada producto debe tener productoId y cantidad válidos.' });
    return;
  }

  try {
    let costoTotal = 0;
    let pesoTotal = 0;
    const productosParaCrear = [];

    for (const item of productos) {
      const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
      if (!producto) {
        res.status(404).json({ error: `Producto con ID ${item.productoId} no encontrado` });
        return;
      }
      costoTotal += producto.precioUnitario * item.cantidad;
      pesoTotal += producto.pesoKg * item.cantidad;
      productosParaCrear.push({
        producto: { connect: { id: producto.id } },
        cantidad: item.cantidad,
        pesoKg: producto.pesoKg
      });
    }

    let costoFronterizoExtra = 0;
    let primerCostoId: number | null = null;
    if (aplicarCostosFronterizos) {
      const todos = await prisma.costoFronterizo.findMany();
      costoFronterizoExtra = todos.reduce((sum: number, c: { costo: number }) => sum + c.costo, 0);
      if (todos.length > 0) primerCostoId = todos[0].id;
      costoTotal += costoFronterizoExtra;
    }

    await prisma.productoPedido.deleteMany({ where: { pedidoId: id } });

    const pedidoActualizado = await prisma.pedido.update({
      where: { id },
      data: {
        codigo: codigoPedido,
        costoTotal,
        cliente: { connect: { id: clienteId } },
        seguro: { connect: { id: seguroId } },
        transportadora: { connect: { id: transportadoraId } },
        tasaImpositiva: { connect: { id: tasaImpositivaId } },
        ...(aplicarCostosFronterizos
          ? (primerCostoId && { costoFronterizo: { connect: { id: primerCostoId } } })
          : { costoFronterizo: { disconnect: true } }),
        productosPedido: { create: productosParaCrear }
      },
      include: {
        cliente: true,
        seguro: true,
        transportadora: true,
        tasaImpositiva: true,
        costoFronterizo: true,
        productosPedido: { include: { producto: true } }
      }
    });

    const camionesNecesarios = Math.ceil(pesoTotal / 18000);
    res.json({ ...pedidoActualizado, pesoTotal, camionesNecesarios });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
});

// Eliminar un pedido
app.delete('/pedidos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.productoPedido.deleteMany({ where: { pedidoId: id } });
    await prisma.pedido.delete({ where: { id } });

    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

// ------------------------------------------------------ PROVEEDORES ------------------------------------------------------

// Obtener todos los proveedores
app.get('/proveedores', async (_req: Request, res: Response) => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// Crear un nuevo proveedor
app.post('/proveedores', async (req: Request, res: Response) => {
  const { nombre, pais, contacto } = req.body;

  if (!nombre || !pais || !contacto) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' });
    return;
  }

  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: { nombre, pais, contacto },
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// Actualizar un proveedor existente
app.put('/proveedores/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, pais, contacto } = req.body;

  if (!nombre || !pais || !contacto) {
    res.status(400).json({ error: 'Todos los campos son obligatorios para editar' });
    return;
  }

  try {
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id },
      data: { nombre, pais, contacto },
    });
    res.json(proveedorActualizado);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// Eliminar un proveedor
app.delete('/proveedores/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.proveedor.delete({ where: { id } });
    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

// ------------------------------------------------------ TRANSPORTADORAS ------------------------------------------------------

// Obtener todas las transportadoras
app.get('/transportadoras', async (_req: Request, res: Response) => {
  try {
    const transportadoras = await prisma.transportadora.findMany();
    res.json(transportadoras);
  } catch (error) {
    console.error('Error al obtener transportadoras:', error);
    res.status(500).json({ error: 'Error al obtener transportadoras' });
  }
});

// Crear una nueva transportadora
app.post('/transportadoras', async (req: Request, res: Response) => {
  const { nombre, contacto, costoBase } = req.body;

  if (!nombre || !contacto || typeof costoBase !== 'number' || costoBase <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos' });
    return 
  }

  try {
    const nuevaTransportadora = await prisma.transportadora.create({
      data: { nombre, contacto, costoBase },
    });
    res.status(201).json(nuevaTransportadora);
  } catch (error) {
    console.error('Error al crear transportadora:', error);
    res.status(500).json({ error: 'Error al crear transportadora' });
  }
});

// Actualizar una transportadora
app.put('/transportadoras/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, contacto, costoBase } = req.body;

  if (!nombre || !contacto || typeof costoBase !== 'number' || costoBase <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos para editar' });
    return 
  }

  try {
    const actualizada = await prisma.transportadora.update({
      where: { id },
      data: { nombre, contacto, costoBase },
    });
    res.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar transportadora:', error);
    res.status(500).json({ error: 'Error al actualizar transportadora' });
  }
});

// Eliminar una transportadora
app.delete('/transportadoras/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.transportadora.delete({ where: { id } });
    res.json({ mensaje: 'Transportadora eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar transportadora:', error);
    res.status(500).json({ error: 'Error al eliminar transportadora' });
  }
});

// ------------------------------------------------------ SEGUROS ------------------------------------------------------

// Obtener todos los seguros
app.get('/seguros', async (_req: Request, res: Response) => {
  try {
    const seguros = await prisma.seguro.findMany();
    res.json(seguros);
  } catch (error) {
    console.error('Error al obtener seguros:', error);
    res.status(500).json({ error: 'Error al obtener seguros' });
  }
});

// Crear un nuevo seguro
app.post('/seguros', async (req: Request, res: Response) => {
  const { nombre, tipoCobertura, costo } = req.body;

  if (!nombre || !tipoCobertura || typeof costo !== 'number' || costo <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos' });
    return 
  }

  try {
    const nuevoSeguro = await prisma.seguro.create({
      data: { nombre, tipoCobertura, costo },
    });
    res.status(201).json(nuevoSeguro);
  } catch (error) {
    console.error('Error al crear seguro:', error);
    res.status(500).json({ error: 'Error al crear seguro' });
  }
});

// Actualizar un seguro
app.put('/seguros/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, tipoCobertura, costo } = req.body;

  if (!nombre || !tipoCobertura || typeof costo !== 'number' || costo <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos para editar' });
    return 
  }

  try {
    const actualizado = await prisma.seguro.update({
      where: { id },
      data: { nombre, tipoCobertura, costo },
    });
    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar seguro:', error);
    res.status(500).json({ error: 'Error al actualizar seguro' });
  }
});

// Eliminar un seguro
app.delete('/seguros/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.seguro.delete({ where: { id } });
    res.json({ mensaje: 'Seguro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar seguro:', error);
    res.status(500).json({ error: 'Error al eliminar seguro' });
  }
});

// ------------------------------------------------------ COSTOS FRONTERIZOS ------------------------------------------------------

// Obtener todos los costos fronterizos
app.get('/costos-fronterizos', async (_req: Request, res: Response) => {
  try {
    const costos = await prisma.costoFronterizo.findMany();
    res.json(costos);
  } catch (error) {
    console.error('Error al obtener costos fronterizos:', error);
    res.status(500).json({ error: 'Error al obtener costos fronterizos' });
  }
});

// Crear un nuevo costo fronterizo
app.post('/costos-fronterizos', async (req: Request, res: Response) => {
  const { tipoCosto, costo } = req.body;

  if (!tipoCosto || typeof costo !== 'number' || costo <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos' });
    return 
  }

  try {
    const nuevoCosto = await prisma.costoFronterizo.create({
      data: { tipoCosto, costo },
    });
    res.status(201).json(nuevoCosto);
  } catch (error) {
    console.error('Error al crear costo fronterizo:', error);
    res.status(500).json({ error: 'Error al crear costo fronterizo' });
  }
});

// Actualizar un costo fronterizo
app.put('/costos-fronterizos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { tipoCosto, costo } = req.body;

  if (!tipoCosto || typeof costo !== 'number' || costo <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos para editar' });
    return 
  }

  try {
    const actualizado = await prisma.costoFronterizo.update({
      where: { id },
      data: { tipoCosto, costo },
    });
    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar costo fronterizo:', error);
    res.status(500).json({ error: 'Error al actualizar costo fronterizo' });
  }
});

// Eliminar un costo fronterizo
app.delete('/costos-fronterizos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.costoFronterizo.delete({ where: { id } });
    res.json({ mensaje: 'Costo fronterizo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar costo fronterizo:', error);
    res.status(500).json({ error: 'Error al eliminar costo fronterizo' });
  }
});

// ------------------------------------------------------ TASAS IMPOSITIVAS ------------------------------------------------------

// Obtener todas las tasas impositivas
app.get('/tasas-impositivas', async (_req: Request, res: Response) => {
  try {
    const tasas = await prisma.tasaImpositiva.findMany();
    res.json(tasas);
  } catch (error) {
    console.error('Error al obtener tasas impositivas:', error);
    res.status(500).json({ error: 'Error al obtener tasas impositivas' });
  }
});

// Crear una nueva tasa impositiva
app.post('/tasas-impositivas', async (req: Request, res: Response) => {
  const { nombre, porcentaje } = req.body;

  if (!nombre || typeof porcentaje !== 'number' || porcentaje <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos' });
    return 
  }

  try {
    const nuevaTasa = await prisma.tasaImpositiva.create({
      data: { nombre, porcentaje },
    });
    res.status(201).json(nuevaTasa);
  } catch (error) {
    console.error('Error al crear tasa impositiva:', error);
    res.status(500).json({ error: 'Error al crear tasa impositiva' });
  }
});

// Actualizar una tasa impositiva
app.put('/tasas-impositivas/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, porcentaje } = req.body;

  if (!nombre || typeof porcentaje !== 'number' || porcentaje <= 0) {
    res.status(400).json({ error: 'Todos los campos son obligatorios y válidos para editar' });
    return 
  }

  try {
    const actualizada = await prisma.tasaImpositiva.update({
      where: { id },
      data: { nombre, porcentaje },
    });
    res.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar tasa impositiva:', error);
    res.status(500).json({ error: 'Error al actualizar tasa impositiva' });
  }
});

// Eliminar una tasa impositiva
app.delete('/tasas-impositivas/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.tasaImpositiva.delete({ where: { id } });
    res.json({ mensaje: 'Tasa impositiva eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tasa impositiva:', error);
    res.status(500).json({ error: 'Error al eliminar tasa impositiva' });
  }
});

// ------------------------------------------------------ LISTEN ------------------------------------------------------

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
