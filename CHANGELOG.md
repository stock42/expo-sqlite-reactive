# Changelog
# V0.0.2

## Características Clave:
### Reactividad Mejorada:

- Uso de EventEmitter para disparar eventos específicos de tabla (change-${tableName}).
- Introducción de useWatchTable para escuchar cambios en tablas específicas.

### CRUD Avanzado:

- Métodos completos para crear, insertar, actualizar, eliminar y consultar datos.
- Métodos adicionales como createIndex y addTableColumns para gestionar esquemas dinámicamente.

### Soporte para Validación de Esquema:

- Métodos como getTableSchema y validateTableSchema para asegurar que los esquemas sean consistentes.

### Soporte a Consultas Reactivas:

- useQuery permite mantener la UI sincronizada con los datos de la base de datos en tiempo real.
- Gestión eficiente de consultas con soporte para condiciones (whereClause) y ordenamiento (sort).


### Manejo Eficiente de Eventos:

- Uso de eventEmitter.setMaxListeners(100) para evitar limitaciones en listeners simultáneos.
# v0.0.4

## Características Clave:
### Reactividad Mejorada:

- Uso de EventEmitter para disparar eventos específicos de tabla (change-${tableName}).
- Introducción de useWatchTable para escuchar cambios en tablas específicas.

### CRUD Avanzado:

- Métodos completos para crear, insertar, actualizar, eliminar y consultar datos.
- Métodos adicionales como createIndex y addTableColumns para gestionar esquemas dinámicamente.
- Método select con soporte para limites y offsets.


### Soporte para Validación de Esquema:

- Métodos como getTableSchema y validateTableSchema para asegurar que los esquemas sean consistentes.

### Soporte a Consultas Reactivas:

- useQuery permite mantener la UI sincronizada con los datos de la base de datos en tiempo real.
- Gestión eficiente de consultas con soporte para condiciones (whereClause) y ordenamiento (sort).


### Manejo Eficiente de Eventos:

- Uso de eventEmitter.setMaxListeners(100) para evitar limitaciones en listeners simultáneos.

## Version 0.0.5

### Added event emitter from expo package.
### Update expo and expo-sqlite dependencies.