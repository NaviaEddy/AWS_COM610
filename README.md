# API de Recetas - Arquitectura Serverless en AWS

Una aplicación web completa para gestionar recetas utilizando arquitectura serverless con AWS Lambda, API Gateway, DynamoDB y frontend desplegado en S3 con CloudFront.

## 📋 Descripción del Proyecto

Esta API RESTful permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre recetas de cocina. El proyecto implementa una arquitectura completamente serverless aprovechando los servicios de AWS para garantizar escalabilidad, disponibilidad y costos optimizados.

### Funcionalidades de la API

- **Crear Receta** (POST): Agregar nuevas recetas a la base de datos
- **Obtener Receta** (GET): Recuperar una receta específica por ID
- **Listar Recetas** (GET): Obtener todas las recetas disponibles
- **Actualizar Receta** (PUT): Modificar recetas existentes
- **Eliminar Receta** (DELETE): Remover recetas de la base de datos

## 🏗️ Arquitectura Serverless

### Componentes Principales

- **AWS Lambda**: Funciones serverless para la lógica de backend
- **API Gateway**: Punto de entrada para las APIs REST
- **DynamoDB**: Base de datos NoSQL para almacenar las recetas
- **S3**: Almacenamiento de archivos estáticos del frontend
- **CloudFront**: CDN para distribución global y hosting
- **IAM**: Gestión de roles y permisos
- **CloudWatch**: Monitoreo y logs del sistema

## 🚀 Despliegue paso a paso

### 1. Configuración de AWS Lambda Functions

Crear las siguientes funciones Lambda, una por cada operación CRUD:

#### Funciones a crear:
- `CreateRecipe` - Método POST
- `GetRecipe` - Método GET (receta individual)
- `GetRecipes` - Método GET (todas las recetas)
- `EditRecipe` - Método PUT
- `DeleteRecipe` - Método DELETE

#### Configuración de permisos IAM:
Asegurar que cada función Lambda tenga permisos para:
- Leer/escribir en DynamoDB
- Escribir logs en CloudWatch

### 2. Configuración de DynamoDB

1. Crear tabla `recipes-table`
2. Configurar clave primaria (ej: `recipeId`)
3. Configurar índices secundarios si es necesario
4. Establecer capacidad de lectura/escritura

### 3. Configuración de API Gateway

1. Crear nueva REST API
2. Configurar recursos y métodos:
   ```
   /recipes
   ├── POST (CreateRecipe)
   ├── GET (GetRecipes)
   └── /{id}
       ├── GET (GetRecipe)
       ├── PUT (EditRecipe)
       └── DELETE (DeleteRecipe)
   ```
3. Integrar cada método con su respectiva función Lambda
4. Habilitar CORS si es necesario
5. Desplegar la API y obtener la URL del endpoint

### 4. Configuración del Frontend en S3

#### Crear y configurar bucket S3:

1. **Crear bucket**: `recipes-com610`
2. **Aplicar política de bucket**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::recipes-com610/*"
    }
  ]
}
```
3. **Habilitar hosting de sitio web estático**
4. **Subir archivos build** del frontend
5. **Configurar página de índice y error**

### 5. Configuración de CloudFront

1. Crear nueva distribución de CloudFront
2. Configurar origen: bucket S3 `recipes-com610`
3. Configurar comportamientos de caché
4. Habilitar compresión
5. Configurar página de error personalizada (opcional)
6. Obtener URL de distribución para acceso público

### 6. Configuración de CloudWatch

CloudWatch se configura automáticamente para:
- Recopilar logs de las funciones Lambda
- Métricas de API Gateway
- Métricas de CloudFront y S3

## 📚 Endpoints de la API

### Base URL
```
https://your-api-gateway-url/prod
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/recipes` | Crear nueva receta |
| GET | `/recipes` | Obtener todas las recetas |
| GET | `/recipes/{id}` | Obtener receta por ID |
| PUT | `/recipes/{id}` | Actualizar receta existente |
| DELETE | `/recipes/{id}` | Eliminar receta |

### Ejemplo de estructura JSON para recetas

```json
{
  "recipeId": "123",
  "name": "Tacos al Pastor",
  "description": "Deliciosos tacos mexicanos",
  "ingredients": [
    "Carne de cerdo",
    "Tortillas",
    "Piña",
    "Cebolla"
  ],
  "instructions": [
    "Marinar la carne",
    "Cocinar en trompo",
    "Servir en tortillas"
  ],
  "prepTime": "30 minutos",
  "cookTime": "45 minutos",
  "servings": 4
}
```

## 🛠️ Configuración de desarrollo local

### Prerrequisitos
- Node.js 18.x o superior

### Variables de entorno
```bash
REACT_APP_API_URL=https://your-api-gateway-url/prod
DYNAMODB_TABLE_NAME=recipes-table
AWS_REGION=us-east-1
```

## 📊 Monitoreo y Logs

### CloudWatch Logs
Los logs están disponibles en CloudWatch para cada función Lambda:
- `/aws/lambda/CreateRecipe`
- `/aws/lambda/GetRecipe`
- `/aws/lambda/GetRecipes`
- `/aws/lambda/EditRecipe`
- `/aws/lambda/DeleteRecipe`

### Métricas importantes a monitorear
- Latencia de API Gateway
- Errores 4xx/5xx
- Duración de ejecución de Lambda
- Invocaciones de Lambda
- Capacidad consumida de DynamoDB

## 🔧 Solución de problemas

### Problemas comunes

1. **Error 403 en S3**: Verificar política de bucket
2. **Timeout en Lambda**: Ajustar timeout y memoria
3. **CORS issues**: Configurar CORS en API Gateway
4. **DynamoDB throttling**: Ajustar capacidad de tabla

### Logs útiles
```bash
# Ver logs de Lambda
aws logs tail /aws/lambda/CreateRecipe --follow

# Ver métricas de API Gateway
aws cloudwatch get-metric-statistics --namespace AWS/ApiGateway
```

## 👥 Integrantes del equipo

- **Santillan Jason - CICO** - Desarrollo del backend y configuración de AWS Lambda
- **Navia Condori Eddy - CICO** - Desarrollo del frontend, configuración de S3/CloudFront y DynamoDB

## 📝 URL de acceso

- **Frontend**: `https://your-cloudfront-distribution.cloudfront.net`
- **API**: `https://your-api-gateway-url/prod`

## 🔒 Seguridad

- Autenticación y autorización implementada via IAM roles
- HTTPS habilitado en todos los endpoints
- Validación de entrada en funciones Lambda
- Principio de menor privilegio aplicado en roles IAM

## 📈 Escalabilidad

La arquitectura serverless permite:
- Escalado automático basado en demanda
- Pago por uso (sin servidores inactivos)
- Alta disponibilidad y tolerancia a fallos
- Distribución global via CloudFront

---

*Este proyecto implementa las mejores prácticas de AWS Well-Architected Framework para seguridad, rendimiento, confiabilidad y optimización de costos.*
