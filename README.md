# API de Recetas - Arquitectura AWS

Una aplicación web completa para gestionar recetas utilizando arquitectura serverless con AWS Lambda, API Gateway, DynamoDB y frontend desplegado en S3 con CloudFront.

## 📋 Descripción del Proyecto

Esta API RESTful permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre recetas de cocina. El proyecto implementa una arquitectura completamente serverless aprovechando los servicios de AWS para garantizar escalabilidad, disponibilidad y costos optimizados.

## 👥 Integrantes del equipo

- **Santillan Jason - CICO** - Desarrollo del backend, configuración de AWS Lambda y Api Gateway
- **Navia Condori Eddy - CICO** - Desarrollo del Frontend, configuración de S3/CloudFront y DynamoDB

### Funcionalidades de la API

- **Crear Receta** (POST): Agregar nuevas recetas a la base de datos
- **Obtener Receta** (GET): Recuperar una receta específica por ID
- **Listar Recetas** (GET): Obtener todas las recetas disponibles
- **Actualizar Receta** (PUT): Modificar recetas existentes
- **Eliminar Receta** (DELETE): Remover recetas de la base de datos

## 🏗️ Arquitectura Serverless

![Screenshot 2025-06-25 151118](https://github.com/user-attachments/assets/b51b7946-9118-4b1b-85dd-1fa69edb6290)

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
4. Habilitar CORS
5. Habilitar Lambda Proxy Integration
6. Desplegar la API y obtener la URL del endpoint

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
https://iudpys93l1.execute-api.us-east-2.amazonaws.com/prod
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/recipe` | Crear nueva receta |
| GET | `/recipe` | Obtener todas las recetas |
| GET | `/recipe/{id}` | Obtener receta por ID |
| PUT | `/recipe/{id}` | Actualizar receta existente |
| DELETE | `/recipe/{id}` | Eliminar receta |

### Ejemplo de estructura JSON para recetas

```json
{
    "status": "success",
    "message": "Recipes retrieved successfully",
    "data": {
        "recipes": [
            {
                "ingredients": [
                    "Linaza a gusto",
                    "Azucar",
                    "Agua caliente"
                ],
                "id_recipe": "c7db2f8e-0143-44df-bb84-1d5db2cfaf21",
                "title": "Chesco de Linaza"
            },
            {
                "ingredients": [
                    "Pasta editada final",
                    "Huevos final",
                    "Tomate final",
                    "Carne"
                ],
                "id_recipe": "5f927a72-cefe-46e6-9f9e-f582dbc5aa5b",
                "title": "Pasta con tomate"
            }
        ]
    }
}
```

## 🛠️ Configuración de desarrollo local

### Prerrequisitos
- Node.js 18.x o superior

### Variables de entorno
```bash
REACT_APP_API_URL=https://your-api-gateway-url/prod
```

## 📊 Monitoreo y Logs

### CloudWatch Logs
Los logs están disponibles en CloudWatch para cada función Lambda:
- `/aws/lambda/CreateRecipe`
- `/aws/lambda/GetRecipeById`
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

## 📝 URL de acceso

- **Frontend**: `https://d28nlw2mkjecpy.cloudfront.net`
- **API**: `https://iudpys93l1.execute-api.us-east-2.amazonaws.com/prod`

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
