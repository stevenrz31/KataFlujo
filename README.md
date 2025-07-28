Hola, este es el repositorio para el dasafio de Kata, actualmente el proyecto se encuentra desplegado en docker, para que funcione se debe:

1.Clonar el repositorio con: git clone https://github.com/stevenrz31/KataFlujo.git

2.Ir a la carpeta principal Kata

3.Una vez en la carpeta, se ejecuta el comando de docker: bashdocker-compose up -d / Esperar 2-3 minutos (primera vez toma más tiempo) y finalmente acceder a la aplicación

Frontend: http://localhost Backend API: http://localhost:8080/api

Es necesario tener docker desktop, si no cuentas con, ve a: https://www.docker.com/products/docker-desktop/ - Descarga Docker Desktop.

El sistema crea automáticamente usuarios de prueba:
Administrador - Luis Fernando Rodríguez Fernández - luis.rodriguez@banco.com

Aprobadores

María Elena García López - maria.garcia@banco.com
Carlos Alberto López Rodríguez - carlos.lopez@banco.com
Diana Patricia Morales Cruz - diana.morales@banco.com

Solicitantes

Juan Carlos Pérez Martínez - juan.perez@banco.com
Ana Sofía Martínez Sánchez - ana.martinez@banco.com
Roberto Carlos Jiménez Vargas - roberto.jimenez@banco.com

Este proyecto usa 

Backend: Java 21 + Spring Boot 3.5.4 + Maven

Frontend: React 18 + JavaScript + CSS

Base de Datos: MySQL 8.0

Contenedores: Docker Desktop

Para tener datos de prueba puedes ejecutar este script dentro de la base de datos mysql:

INSERT INTO solicitudes (id, titulo, descripcion, solicitante_id, aprobador_id, tipo_solicitud, estado, comentarios) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 
 'Despliegue de Microservicio de Autenticación', 
 'Solicitud para desplegar la nueva versión v2.1.3 del microservicio de autenticación en el ambiente de producción', 
 1, 2, 'DESPLIEGUE', 'PENDIENTE', NULL),

('550e8400-e29b-41d4-a716-446655440002', 
 'Acceso a Base de Datos de Producción', 
 'Necesito acceso de solo lectura a la base de datos de producción para realizar análisis de rendimiento y optimización de consultas', 
 4, 3, 'ACCESO', 'APROBADA', 'Aprobado por 30 días. Revisar el 15 de agosto.'),

('550e8400-e29b-41d4-a716-446655440003', 
 'Modificación del Pipeline CI/CD', 
 'Incorporar pruebas de seguridad automatizadas con SonarQube en el pipeline de integración continua del proyecto Alpha', 
 1, 2, 'CAMBIO_TECNICO', 'RECHAZADA', 'Falta documentación detallada del impacto y cronograma');

-- Insertar historial de ejemplo
INSERT INTO historial_solicitudes (solicitud_id, estado_anterior, estado_nuevo, accion_por, comentarios) VALUES 
('550e8400-e29b-41d4-a716-446655440001', NULL, 'PENDIENTE', 1, 'Solicitud creada por el sistema'),
('550e8400-e29b-41d4-a716-446655440002', NULL, 'PENDIENTE', 4, 'Solicitud creada por el sistema'),
('550e8400-e29b-41d4-a716-446655440002', 'PENDIENTE', 'APROBADA', 3, 'Aprobada después de revisar justificación técnica'),
('550e8400-e29b-41d4-a716-446655440003', NULL, 'PENDIENTE', 1, 'Solicitud creada por el sistema'),
('550e8400-e29b-41d4-a716-446655440003', 'PENDIENTE', 'RECHAZADA', 2, 'Requiere más información sobre el cronograma de implementación');
