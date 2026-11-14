# Alpina Compras – SIGOC (prototipo académico)

Prototipo navegable de experiencia de usuario para un sistema de gestión de solicitudes, aprobaciones, proveedores, órdenes de compra y recepciones, con **tres sesiones independientes** según el rol.

**Caso de estudio:** proceso de compras inspirado en las necesidades descritas para una empresa de alimentos. Se utiliza el nombre Alpina Productos Alimenticios S.A.S. únicamente como referencia académica. Este proyecto no es oficial, no está afiliado a Alpina y no representa sus sistemas internos.

## Requisitos
- Navegador actualizado (Chrome, Firefox, Safari o Edge).
- No requiere PHP, MySQL ni XAMPP: es un prototipo frontend estático.
- Para cargar las tipografías (Google Fonts) se necesita conexión a internet; sin ella se usan fuentes del sistema.

## Cómo abrirlo
1. Descomprime el ZIP y abre la carpeta `alpina_compras_sigoc` en Visual Studio Code.
2. Abre `index.html` con doble clic, o con la extensión **Live Server** (clic derecho > *Open with Live Server*).

## Cuentas de demostración (contraseña: `prototipo123`)
| Rol | Usuario | Correo |
|---|---|---|
| Solicitante | Laura Gómez | `solicitante@alpina.com` |
| Jefe aprobador | Ricardo Herrera | `jefe@alpina.com` |
| Comprador | Camila Martínez | `comprador@alpina.com` |

En el inicio de sesión basta con elegir un perfil. Una vez dentro, el menú del usuario (arriba a la derecha) permite **cambiar de sesión** sin volver a ingresar, ideal para la sustentación.

## Qué puede hacer cada rol
**Solicitante**
- Crear solicitudes con artículos y cálculo del valor estimado.
- Consultar únicamente *sus* solicitudes y filtrarlas por estado.
- Corregir y reenviar las solicitudes devueltas por el jefe.
- Seguir el avance de las órdenes generadas a partir de sus solicitudes.

**Jefe aprobador**
- Bandeja de aprobaciones con detalle completo de cada solicitud.
- Aprobar, devolver o rechazar (la observación es obligatoria y queda en el historial).
- Historial de decisiones, consulta de todas las solicitudes y reportes.

**Comprador**
- Lista “Por ordenar” con las solicitudes aprobadas.
- Generar la orden de compra eligiendo proveedor y fecha de entrega.
- Directorio y registro de proveedores (valida NIT duplicado).
- Órdenes de compra y recepciones parciales/completas (no se puede superar el saldo).
- Reportes con gráficos, vista previa por rango de fechas y exportación a CSV.

## Flujo completo para probar
1. **Solicitante:** crea una solicitud → queda *Pendiente*.
2. **Jefe:** la revisa y la aprueba (o la devuelve/rechaza con observación).
3. **Comprador:** la ve en “Por ordenar”, genera la orden y registra recepciones.
4. **Solicitante:** ve la orden y su avance de recepción.

## Estructura
```
alpina_compras_sigoc/
├── index.html
├── css/styles.css     ← diseño y paleta
└── js/
    ├── data.js        ← usuarios, roles y datos de ejemplo
    └── app.js         ← pantallas, permisos por rol y lógica
```

## Alcance y limitaciones
- Los cambios se guardan en el navegador (localStorage) para que el flujo entre sesiones se mantenga al recargar. Para volver a los datos iniciales usa **Restablecer datos de demostración** (pantalla de inicio o menú de usuario).
- No hay conexión con base de datos ni servidor, ni autenticación real.
- Nombres, proveedores, importes y fechas son datos ficticios.

## Próxima etapa
Después de la revisión y aprobación docente del prototipo, se implementará el sistema funcional con PHP y MySQL, autenticación, control de roles, persistencia y validaciones del lado del servidor.
