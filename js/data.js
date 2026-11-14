/* =========================================================
   Alpina Compras · SIGOC  —  Datos de demostración
   Usuarios, roles y registros iniciales (ficticios).
   ========================================================= */

const ROLES = {
  solicitante: { label: 'Solicitante',    short: 'Registra y consulta sus solicitudes de compra',      icon: 'edit'   },
  jefe:        { label: 'Jefe aprobador', short: 'Aprueba, devuelve o rechaza solicitudes',            icon: 'shield' },
  comprador:   { label: 'Comprador',      short: 'Genera órdenes, gestiona proveedores y recepciones', icon: 'cart'   }
};

const PASSWORD_DEMO = 'prototipo123';

const USERS = [
  { id: 'u-sol',  name: 'Laura Gómez',     initials: 'LG', email: 'solicitante@alpina.com', password: PASSWORD_DEMO, role: 'solicitante', area: 'Producción',  title: 'Analista de producción' },
  { id: 'u-jefe', name: 'Ricardo Herrera', initials: 'RH', email: 'jefe@alpina.com',        password: PASSWORD_DEMO, role: 'jefe',        area: 'Operaciones', title: 'Jefe de operaciones' },
  { id: 'u-comp', name: 'Camila Martínez', initials: 'CM', email: 'comprador@alpina.com',   password: PASSWORD_DEMO, role: 'comprador',   area: 'Compras',     title: 'Analista de compras' }
];

const AREAS = ['Producción', 'Mantenimiento', 'Calidad', 'Logística', 'Administración', 'Seguridad y salud'];

/* Entrada de historial: fecha, quién, rol, acción, observación */
const H = (date, by, role, action, note = '') => ({ date, by, role, action, note });

function seedData() {
  const requests = [
    { id: 'SOL-2026-0149', title: 'Cajas de cartón corrugado', area: 'Logística', ownerId: null, owner: 'Mateo Castro',
      created: '2026-11-14', required: '2026-11-28', amount: 3900000, status: 'Pendiente', orderId: null,
      justification: 'Reposición de empaque secundario para los despachos de la próxima semana.',
      items: [{ desc: 'Cajas de cartón corrugado 40x30 cm', qty: 1300, price: 3000 }],
      history: [H('2026-11-14', 'Mateo Castro', 'solicitante', 'Registrada', 'Enviada a aprobación.')] },

    { id: 'SOL-2026-0148', title: 'Empaques para línea de yogures', area: 'Producción', ownerId: 'u-sol', owner: 'Laura Gómez',
      created: '2026-11-14', required: '2026-11-25', amount: 4850000, status: 'Pendiente', orderId: null,
      justification: 'El stock de empaque de la línea de yogures cubre menos de una semana de producción.',
      items: [{ desc: 'Rollos de film para empaque', qty: 40, price: 85000 }, { desc: 'Tapas termoselladas', qty: 29, price: 50000 }],
      history: [H('2026-11-14', 'Laura Gómez', 'solicitante', 'Registrada', 'Enviada a aprobación.')] },

    { id: 'SOL-2026-0147', title: 'Etiquetas adhesivas para producto terminado', area: 'Producción', ownerId: 'u-sol', owner: 'Laura Gómez',
      created: '2026-11-13', required: '2026-11-24', amount: 2100000, status: 'Aprobada', orderId: null,
      justification: 'Se requieren etiquetas para el cambio de presentación del lote de diciembre.',
      items: [{ desc: 'Etiquetas adhesivas (caja x 5.000 u.)', qty: 20, price: 105000 }],
      history: [H('2026-11-13', 'Laura Gómez', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-14', 'Ricardo Herrera', 'jefe', 'Aprobada', 'Aprobada. Coordinar la entrega con planeación de producción.')] },

    { id: 'SOL-2026-0145', title: 'Servicio de mantenimiento industrial', area: 'Mantenimiento', ownerId: null, owner: 'Andrés Ruiz',
      created: '2026-11-12', required: '2026-11-20', amount: 3200000, status: 'Con orden', orderId: 'OC-2026-0081',
      justification: 'Mantenimiento preventivo programado de equipos críticos de la planta.',
      items: [{ desc: 'Mantenimiento preventivo de compresores', qty: 1, price: 2000000 }, { desc: 'Cambio de rodamientos', qty: 1, price: 1200000 }],
      history: [H('2026-11-12', 'Andrés Ruiz', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-12', 'Ricardo Herrera', 'jefe', 'Aprobada', 'Aprobada por criticidad del equipo.'),
                H('2026-11-13', 'Camila Martínez', 'comprador', 'Orden generada', 'OC-2026-0081 · Servicios Industriales del Norte S.A.S.')] },

    { id: 'SOL-2026-0142', title: 'Insumos de laboratorio', area: 'Producción', ownerId: 'u-sol', owner: 'Laura Gómez',
      created: '2026-11-12', required: '2026-11-26', amount: 1750000, status: 'Devuelta', orderId: null,
      justification: 'Insumos para los controles de calidad en línea.',
      items: [{ desc: 'Reactivos', qty: 5, price: 200000 }, { desc: 'Material de vidrio', qty: 15, price: 50000 }],
      history: [H('2026-11-12', 'Laura Gómez', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-13', 'Ricardo Herrera', 'jefe', 'Devuelta', 'Detallar referencias y cantidades por reactivo antes de aprobar.')] },

    { id: 'SOL-2026-0139', title: 'Elementos de protección personal', area: 'Seguridad y salud', ownerId: null, owner: 'Carlos Díaz',
      created: '2026-11-10', required: '2026-11-18', amount: 2680000, status: 'Con orden', orderId: 'OC-2026-0078',
      justification: 'Dotación trimestral de EPP para el personal operativo.',
      items: [{ desc: 'Guantes de nitrilo (caja)', qty: 40, price: 18000 }, { desc: 'Gafas de seguridad', qty: 30, price: 40000 }, { desc: 'Tapabocas (caja x 50)', qty: 38, price: 20000 }],
      history: [H('2026-11-10', 'Carlos Díaz', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-11', 'Ricardo Herrera', 'jefe', 'Aprobada', 'Aprobada. Requisito de seguridad.'),
                H('2026-11-11', 'Camila Martínez', 'comprador', 'Orden generada', 'OC-2026-0078 · Suministros Técnicos Andinos S.A.S.')] },

    { id: 'SOL-2026-0136', title: 'Repuestos para llenadora', area: 'Mantenimiento', ownerId: null, owner: 'Andrés Ruiz',
      created: '2026-11-13', required: '2026-11-30', amount: 6300000, status: 'Pendiente', orderId: null,
      justification: 'Cambio de piezas con desgaste para evitar paradas no programadas en la llenadora 2.',
      items: [{ desc: 'Sellos mecánicos', qty: 6, price: 650000 }, { desc: 'Juego de empaques', qty: 8, price: 300000 }],
      history: [H('2026-11-13', 'Andrés Ruiz', 'solicitante', 'Registrada', 'Enviada a aprobación.')] },

    { id: 'SOL-2026-0133', title: 'Material de oficina', area: 'Administración', ownerId: null, owner: 'Sandra Torres',
      created: '2026-11-09', required: '2026-11-20', amount: 480000, status: 'Rechazada', orderId: null,
      justification: 'Reposición general de papelería.',
      items: [{ desc: 'Resmas de papel y papelería varia', qty: 12, price: 40000 }],
      history: [H('2026-11-09', 'Sandra Torres', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-10', 'Ricardo Herrera', 'jefe', 'Rechazada', 'Existe inventario suficiente de papelería en almacén.')] },

    { id: 'SOL-2026-0128', title: 'Bolsas de empaque para línea de quesos', area: 'Producción', ownerId: 'u-sol', owner: 'Laura Gómez',
      created: '2026-11-05', required: '2026-11-15', amount: 5100000, status: 'Con orden', orderId: 'OC-2026-0074',
      justification: 'Empaque primario para la producción de quesos del mes.',
      items: [{ desc: 'Bolsas de empaque al vacío', qty: 1000, price: 5100 }],
      history: [H('2026-11-05', 'Laura Gómez', 'solicitante', 'Registrada', 'Enviada a aprobación.'),
                H('2026-11-06', 'Ricardo Herrera', 'jefe', 'Aprobada', 'Aprobada.'),
                H('2026-11-08', 'Camila Martínez', 'comprador', 'Orden generada', 'OC-2026-0074 · Empaques Flexibles del Caribe S.A.S.')] }
  ];

  const suppliers = [
    { id: 'PRV-001', name: 'Empaques Flexibles del Caribe S.A.S.',     nit: '900.456.123-1', category: 'Empaques',      contact: 'María Fernanda Ríos', email: 'ventas@efcaribe.com',         status: 'Activo' },
    { id: 'PRV-002', name: 'Servicios Industriales del Norte S.A.S.',  nit: '901.234.567-8', category: 'Mantenimiento', contact: 'Jorge Salcedo',       email: 'comercial@sinorte.com',       status: 'Activo' },
    { id: 'PRV-003', name: 'Suministros Técnicos Andinos S.A.S.',      nit: '900.876.543-2', category: 'Insumos',       contact: 'Paula Méndez',        email: 'pedidos@sta.com.co',          status: 'Activo' },
    { id: 'PRV-004', name: 'Etiquetas y Adhesivos de Colombia S.A.S.', nit: '901.112.334-5', category: 'Empaques',      contact: 'Daniel Ortiz',        email: 'ventas@etiquetascol.co',      status: 'Activo' },
    { id: 'PRV-005', name: 'Cartones del Valle S.A.S.',                nit: '900.321.654-7', category: 'Empaques',      contact: 'Lucía Vargas',        email: 'comercial@cartonesvalle.com', status: 'Activo' }
  ];

  const orders = [
    { id: 'OC-2026-0081', requestId: 'SOL-2026-0145', supplierId: 'PRV-002', date: '2026-11-13', expected: '2026-11-20', total: 3200000, received: 2000000,
      receipts: [{ date: '2026-11-14', amount: 2000000, note: 'Primera entrega: mantenimiento de compresores.', by: 'Camila Martínez' }] },
    { id: 'OC-2026-0078', requestId: 'SOL-2026-0139', supplierId: 'PRV-003', date: '2026-11-11', expected: '2026-11-18', total: 2680000, received: 2680000,
      receipts: [{ date: '2026-11-13', amount: 2680000, note: 'Entrega completa de EPP.', by: 'Camila Martínez' }] },
    { id: 'OC-2026-0074', requestId: 'SOL-2026-0128', supplierId: 'PRV-001', date: '2026-11-08', expected: '2026-11-15', total: 5100000, received: 0, receipts: [] }
  ];

  return { requests, suppliers, orders, seq: { req: 150, ord: 82 } };
}
