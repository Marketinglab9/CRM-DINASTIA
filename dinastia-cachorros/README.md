# 🐕 Dinastía Cachorros - CRM Sistema de Gestión

Sistema integral de gestión CRM para criaderos de cachorros desarrollado con **Next.js 14**, **TypeScript**, **PostgreSQL**, y **Prisma ORM**.

## 🚀 Características Principales

### 👨‍💼 Panel Administrativo/Asesor
- **Dashboard Inteligente**: KPIs, métricas de ventas, entregas pendientes y leads activos
- **Gestión de Ventas**: Proceso completo de venta con facturación automática
- **Control de Clientes**: Base de datos completa con historial de transacciones
- **Inventario de Cachorros**: Estados, fotografías, precios y disponibilidad
- **Gestión de Leads**: Calificación automática, seguimiento y conversión
- **Control de Entregas**: Programación, tracking y confirmación
- **Reportes Avanzados**: Gráficas de ingresos, conversiones y tendencias
- **Sistema de Banners**: Comunicación dirigida por roles
- **Configuración Global**: Ajustes de empresa, integraciones y usuarios

### 👤 Portal del Cliente
- **Dashboard Personal**: Información de mascotas y cuenta
- **Cartilla de Vacunación**: Seguimiento automático y recordatorios
- **Historial de Facturas**: Descargas y estado de pagos
- **Guías de Cuidado**: Documentos personalizados por raza
- **Notificaciones**: Recordatorios de vacunas y citas

### 🔐 Sistema de Roles
- **Administrador**: Acceso completo al sistema
- **Asesor**: Gestión de ventas, clientes y leads
- **Cliente**: Portal personal con información de mascotas

### 🔧 Funcionalidades Técnicas
- **Autenticación Segura**: NextAuth con JWT y bcrypt
- **Base de Datos Robusta**: PostgreSQL con Prisma ORM
- **Emails Automáticos**: Resend/SendGrid con plantillas personalizadas
- **Generación de PDFs**: Facturas y guías automáticas
- **Almacenamiento**: Cloudinary para imágenes
- **Recordatorios**: Sistema de cron jobs para notificaciones
- **API REST**: Endpoints seguros con middleware de autorización

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **PostgreSQL**
- **Prisma ORM**
- **NextAuth.js**

### Integraciónes
- **Resend/SendGrid** (Emails)
- **Cloudinary** (Almacenamiento)
- **React PDF** (Generación de PDFs)
- **React Query** (Estado y caching)

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 15+
- Docker y Docker Compose (opcional)

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd dinastia-cachorros
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dinastia"

# Autenticación
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (configura uno)
RESEND_API_KEY="your-resend-key"
# o
SENDGRID_API_KEY="your-sendgrid-key"

# Almacenamiento
CLOUDINARY_URL="cloudinary://key:secret@cloudname"

# Información de la Empresa
COMPANY_NAME="Dinastía Cachorros"
COMPANY_EMAIL="admin@dinastiacachorros.com"
COMPANY_PHONE="+57 300 123 4567"
COMPANY_TAX_ID="NIT-123456789-0"
```

### 4. Configurar Base de Datos

#### Opción A: Con Docker (Recomendado)
```bash
# Iniciar servicios
npm run docker:up

# Esperar 10 segundos para que PostgreSQL inicie
sleep 10

# Configurar base de datos
npm run db:push
npm run db:seed
```

#### Opción B: PostgreSQL Local
1. Instala PostgreSQL
2. Crea la base de datos `dinastia`
3. Ejecuta:
```bash
npm run db:push
npm run db:seed
```

### 5. Iniciar Desarrollo
```bash
npm run dev
```

El sistema estará disponible en: http://localhost:3000

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@dinastiacachorros.com | admin123 |
| **Asesor 1** | maria@dinastiacachorros.com | advisor123 |
| **Asesor 2** | carlos@dinastiacachorros.com | advisor123 |
| **Cliente** | ana.lopez@email.com | client123 |

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor de desarrollo
npm run build              # Construir para producción
npm run start              # Iniciar servidor de producción

# Base de Datos
npm run db:generate        # Generar cliente Prisma
npm run db:push           # Aplicar cambios al esquema
npm run db:migrate        # Crear y aplicar migraciones
npm run db:seed           # Poblar base de datos con datos de prueba
npm run db:reset          # Reiniciar base de datos
npm run db:studio         # Abrir Prisma Studio

# Docker
npm run docker:up         # Iniciar contenedores
npm run docker:down       # Detener contenedores

# Setup Completo
npm run setup            # Docker + Base de datos + Seed
```

## 🔄 Flujos de Trabajo Principales

### 1. Nueva Venta
1. Asesor crea una venta desde el dashboard
2. Se genera automáticamente una factura PDF
3. Si es cliente nuevo, se crea cuenta con credenciales temporales
4. Se envía email de bienvenida con factura adjunta
5. Se programa la entrega automáticamente

### 2. Gestión de Leads
1. Lead ingresa por formulario web o se crea manualmente
2. Se asigna automáticamente a un asesor
3. Sistema de calificación (Cold/Warm/Hot)
4. Recordatorios automáticos para próximo contacto
5. Conversión a venta cuando corresponde

### 3. Proceso de Entrega
1. Venta confirmada activa el proceso de entrega
2. Se programa fecha estimada según método (recogida/envío)
3. Al marcar como entregada:
   - Se envía email de confirmación
   - Se adjunta guía de cuidados personalizada
   - Se inicializa calendario de vacunación

### 4. Sistema de Vacunación
1. Al entregar mascota se crean recordatorios automáticos
2. Cron job diario verifica próximas vacunas
3. Envío de notificaciones X días antes
4. Cliente puede ver progreso en su portal

## 🗂️ Estructura del Proyecto

```
dinastia-cachorros/
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   └── seed.ts                 # Datos de prueba
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Rutas de admin/asesor
│   │   ├── (client)/          # Rutas de cliente
│   │   ├── api/               # API endpoints
│   │   ├── login/             # Página de login
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   ├── ui/                # Componentes de shadcn/ui
│   │   ├── dashboard/         # Componentes de admin
│   │   └── client/            # Componentes de cliente
│   ├── lib/
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── prisma.ts          # Cliente Prisma
│   │   └── utils.ts           # Utilidades
│   └── types/
│       └── next-auth.d.ts     # Tipos de NextAuth
├── docker-compose.yml         # Servicios de desarrollo
├── .env.example              # Variables de entorno
└── README.md                 # Este archivo
```

## 🔒 Seguridad

### Autenticación
- Contraseñas hasheadas con bcrypt (12 rounds)
- Sessions JWT con expiración de 30 días
- Middleware de autorización en todas las rutas protegidas

### Autorización por Roles
- **Administrador**: Acceso total al sistema
- **Asesor**: Gestión de ventas, clientes y leads
- **Cliente**: Solo su información personal

### Protección de API
- Verificación de session en todos los endpoints
- Rate limiting configurable
- Validación de entrada con Zod
- Logs de auditoría para acciones críticas

## 📧 Sistema de Emails

### Plantillas Disponibles
1. **Bienvenida + Credenciales** (nuevos clientes)
2. **Factura de Venta** (con PDF adjunto)
3. **Confirmación de Entrega** (con guía de cuidados)
4. **Recordatorio de Vacuna** (X días antes)
5. **Próximo Contacto** (para asesores)

### Configuración
- **Desarrollo**: Usar Mailhog (incluido en Docker)
- **Producción**: Resend o SendGrid

## 📊 Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema con roles
- **Client/Advisor**: Perfiles específicos por rol
- **Pet**: Información de cachorros
- **Sale**: Ventas realizadas
- **Lead**: Prospectos de venta
- **Delivery**: Entregas programadas
- **PetVaccination**: Seguimiento de vacunas
- **Invoice**: Facturas generadas
- **Banner**: Anuncios por rol

### Características
- Índices optimizados para consultas frecuentes
- Relaciones FK con cascada donde corresponde
- Enums para estados y tipos
- Auditoría automática con timestamps

## 🚀 Deploy

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Otras Opciones
- **Railway**: PostgreSQL incluido
- **Fly.io**: Con Dockerfile
- **Render**: Deploy directo desde Git

### Variables de Entorno para Producción
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
RESEND_API_KEY="re_..."
CLOUDINARY_URL="cloudinary://..."
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reportar Bugs

Si encuentras algún problema, por favor:
1. Verifica que no esté ya reportado
2. Crea un issue con información detallada
3. Incluye pasos para reproducir el error

## 📞 Soporte

Para soporte técnico o consultas:
- Email: support@dinastiacachorros.com
- Issues: GitHub Issues
- Documentación: Wiki del repositorio

---

**Desarrollado con ❤️ para criaderos profesionales**
