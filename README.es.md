![expo-sqlite-reactive](assets/expo-sqlite-reactive.png)

- [expo-sqlite-reactive](#expo-sqlite-reactive)
  - [Comparación con Realm](#comparación-con-realm)
  - [Características](#características)
  - [Instalación](#instalación)
  - [Uso Básico](#uso-básico)
    - [1. Inicialización de la Base de Datos](#1-inicialización-de-la-base-de-datos)
    - [2. Crear Tablas](#2-crear-tablas)
    - [3. Insertar Datos](#3-insertar-datos)
    - [4. Realizar Consultas con `useQuery`](#4-realizar-consultas-con-usequery)
      - [Parámetros de `useQuery`](#parámetros-de-usequery)
    - [5. Eliminar y Actualizar Datos](#5-eliminar-y-actualizar-datos)
    - [Ejemplos de Consultas Complejas](#ejemplos-de-consultas-complejas)
      - [Consulta con Condiciones](#consulta-con-condiciones)
      - [Insertar y Consultar Datos](#insertar-y-consultar-datos)
  - [Comparación con Realm](#comparación-con-realm-1)
  - [Ejemplo Completo](#ejemplo-completo)
- [Métodos de `expo-sqlite-reactive`](#métodos-de-expo-sqlite-reactive)
  - [Métodos Principales](#métodos-principales)
    - [**`initialize(databaseName: string): SQLiteManager`**](#initializedatabasename-string-sqlitemanager)
    - [**`createTable(tableName: string, data: ColumnDefinition): Promise<boolean>`**](#createtabletablename-string-data-columndefinition-promiseboolean)
    - [**`dropTable(tableName: string): Promise<boolean | null>`**](#droptabletablename-string-promiseboolean--null)
    - [**`insert(tableName: string, data: KeyValueData): Promise<TypeReturnQuery | null>`**](#inserttablename-string-data-keyvaluedata-promisetypereturnquery--null)
    - [**`update(tableName: string, whereClause: object, data: KeyValueData): Promise<number | null>`**](#updatetablename-string-whereclause-object-data-keyvaluedata-promisenumber--null)
    - [**`delete(tableName: string, whereClause?: object): Promise<number | null>`**](#deletetablename-string-whereclause-object-promisenumber--null)
    - [**`select<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }, limit?: number, offset?: number): Promise<T[] | null>`**](#selectttablename-string-columns-string-whereclause-object-sort--key-string-number--limit-number-offset-number-promiset--null)
  - [Métodos Avanzados](#métodos-avanzados)
    - [**`createIndex(tableName: string, columnName: string): Promise<void>`**](#createindextablename-string-columnname-string-promisevoid)
    - [**`addTableColumns(tableName: string, changes: ColumnDefinition): Promise<boolean>`**](#addtablecolumnstablename-string-changes-columndefinition-promiseboolean)
    - [**`getAllTables(): Promise<tableInternalSchema[]>`**](#getalltables-promisetableinternalschema)
    - [**`getTableSchema(tableName: string): Promise<tableRowSchema[]>`**](#gettableschematablename-string-promisetablerowschema)
    - [**`validateTableSchema(tableName: string, expectedSchema: ColumnDefinition): Promise<boolean>`**](#validatetableschematablename-string-expectedschema-columndefinition-promiseboolean)
  - [Métodos de Reactividad](#métodos-de-reactividad)
    - [**`useWatchTable(tableName: string, listener: () => void): void`**](#usewatchtabletablename-string-listener---void-void)
    - [**`useQuery<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): T[]`**](#usequeryttablename-string-columns-string-whereclause-object-sort--key-string-number--t)
    - [**`translateMongoJsonToSql(query: object): { whereStatement: string; values: any[] }`**](#translatemongojsontosqlquery-object--wherestatement-string-values-any-)
- [Ejemplos](#ejemplos)
  - [Crear tabla e índices](#crear-tabla-e-índices)
  - [Uso de `useQuery`](#uso-de-usequery)
  - [Escucha de cambios en Tablas](#escucha-de-cambios-en-tablas)
- [Roadmap](#roadmap)
- [Hacerca del autor](#hacerca-del-autor)
- [Licencia](#licencia)


[![npm version](https://img.shields.io/npm/v/expo-sqlite-reactive.svg?style=flat)](https://www.npmjs.com/package/expo-sqlite-reactive)
[![Downloads](https://img.shields.io/npm/dm/expo-sqlite-reactive.svg)](https://www.npmjs.com/package/expo-sqlite-reactive)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Node Version](https://img.shields.io/node/v/expo-sqlite-reactive.svg)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-available-blue.svg)](https://tu-proyecto-docs.com)
[![Expo SDK](https://img.shields.io/badge/expo-%5E52.0.0-blue.svg)](https://expo.dev/)
[![Last Commit](https://img.shields.io/github/last-commit/stock42/expo-sqlite-reactive.svg)](https://github.com/stock42/expo-sqlite-reactive/commits)
[![GitHub Stars](https://img.shields.io/github/stars/stock42/expo-sqlite-reactive.svg?style=social)](https://github.com/stock42/expo-sqlite-reactive)





# expo-sqlite-reactive

`expo-sqlite-reactive` es una solución que extiende la funcionalidad de `expo-sqlite` para proporcionar una forma reactiva de trabajar con bases de datos SQLite en aplicaciones Expo y React Native. Este paquete permite crear tablas, realizar operaciones CRUD y mantener actualizados los datos en tu UI mediante el hook `useQuery`.
Esto permite crear aplicaciones offline de manera rápida, simple y estable.
[Stock42](https://stock42.com) utiliza esta librería para todas sus aplicaciones.
Recomendamos [S42](https://s42ui.com) para desarrollar aplicaciones móviles de manera mucho mas rápida.


## Comparación con Realm
| Característica       | expo-sqlite-reactive      | Realm                    |
|----------------------|---------------------------|--------------------------|
| Peso de la Librería  | Ligero                    | Pesado                  |
| Reactividad          | Sí, con `useQuery`        | Sí, integrado            |
| Compatibilidad       | SQLite nativo             | Limitado a base Realm    |
| Facilidad de Uso     | Sencillo                  | Complejo para principiantes |



## Características

- **Reactividad**: Utiliza `useQuery` para escuchar y actualizar la UI automáticamente cuando hay cambios en la base de datos.
- **Soporte para CRUD**: Métodos simples para crear, leer, actualizar y eliminar datos.
- **Basado en SQLite**: Aprovecha la robustez de `expo-sqlite` para almacenamiento local.
- **Simplicidad**: Proporciona una interfaz intuitiva y directa.

## Instalación

```bash
npm install expo-sqlite-reactive
```

Asegúrate de que `expo-sqlite` esté instalado como dependencia.

```bash
expo install expo-sqlite
```

## Uso Básico

### 1. Inicialización de la Base de Datos

Primero, inicializa la base de datos con el nombre deseado:

```typescript
import { SQLiteManager } from 'expo-sqlite-reactive';

async function initializeDB() {
  try {
    SQLiteManager.initialize('mydatabase.db');

    await SQLiteManager.createTable('users', {
      usersUUID: 'text',
      firstName: 'text',
      lastName: 'text',
      email: 'text',
      password: 'text',
    });
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
```

### 2. Crear Tablas

```typescript
await SQLiteManager.createTable('products', {
  productUUID: 'text',
  productName: 'text',
  productPrice: 'integer',
});
```

### 3. Insertar Datos

```typescript
const product = {
  productUUID: '1234',
  productName: 'Laptop',
  productPrice: 999,
};

await SQLiteManager.insert('products', product);
```

### 4. Realizar Consultas con `useQuery`

`useQuery` proporciona una forma reactiva de consultar y actualizar la UI cuando los datos cambian.

```typescript
import { useQuery } from 'expo-sqlite-reactive';

export default function ProductList() {
  // Consulta reactiva a la tabla "products"
  const [products, error] = useQuery('products', ['*'], undefined, { productName: 1 });

  if (error) return <Text>Error loading products</Text>;

  return (
    <View>
      {products.map((product) => (
        <Text key={product.productUUID}>{product.productName} - ${product.productPrice}</Text>
      ))}
    </View>
  );
}
```

#### Parámetros de `useQuery`

```typescript
const [data, error] = useQuery(
  tableName: string,          // Nombre de la tabla a consultar
  columns: string[],          // Columnas a seleccionar (ej. ['*'] para seleccionar todas)
  whereClause?: object,       // Condiciones opcionales de filtrado (ej. { price: { $gt: 50 } })
  sort?: { [key: string]: 1 | -1 } // Ordenamiento (ej. { price: 1 } para orden ascendente por precio)
);
```

- **`tableName`**: El nombre de la tabla a consultar.
- **`columns`**: Un array de cadenas que indica qué columnas seleccionar. `['*']` selecciona todas las columnas.
- **`whereClause`**: Un objeto opcional para definir condiciones de filtrado, similar a una consulta de MongoDB.
- **`sort`**: Un objeto opcional para definir el orden de los resultados (1 para ascendente, -1 para descendente).

### 5. Eliminar y Actualizar Datos

Eliminar una tabla:

```typescript
await SQLiteManager.dropTable('products');
```

Actualizar un registro:

```typescript
await SQLiteManager.update('products', { productUUID: '1234' }, { productPrice: 899 });
```

Eliminar un registro:

```typescript
await SQLiteManager.delete('products', { productUUID: '1234' });
```

### Ejemplos de Consultas Complejas

#### Consulta con Condiciones

```typescript
const [products, error] = useQuery(
  'products',
  ['productName', 'productPrice'],
  { productPrice: { $gt: 100 } }, // Condición: precios mayores a 100
  { productName: 1 }              // Orden ascendente por nombre de producto
);
```

#### Insertar y Consultar Datos

```typescript
// Insertar un nuevo usuario
await SQLiteManager.insert('users', {
  usersUUID: '1234',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
});

// Consultar todos los usuarios
const [users, error] = useQuery('users', ['*']);
```

## Comparación con Realm

`expo-sqlite-reactive` puede considerarse una alternativa ligera y eficiente a Realm en ciertas situaciones:

- **Sincronización Reactiva**: `useQuery` proporciona una forma reactiva de actualizar la UI similar a las colecciones reactivas de Realm.
- **Simplicidad**: Mientras que Realm ofrece muchas características avanzadas, `expo-sqlite-reactive` es más sencillo y está diseñado para escenarios donde no se requiere sincronización compleja o bases de datos pesadas.
- **Soporte Nativo**: Al estar basado en SQLite, aprovecha un backend que es común en muchos sistemas y dispositivos, lo que puede ser una ventaja en términos de rendimiento y compatibilidad.

## Ejemplo Completo

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { SQLiteManager, useQuery } from 'expo-sqlite-reactive';
import * as uuid from 'uuid';

export default function App() {
  const [stores, error] = useQuery('stores', ['*'], undefined, { added: -1 });

  async function createStores() {
    for (let i = 0; i < 5; i++) {
      const store = {
        storesUUID: uuid.v4(),
        storeName: `Store ${i}`,
        storeAddress: `Address ${i}`,
      };
      await SQLiteManager.insert('stores', store);
    }
  }

  return (
    <View>
      <Button title="Create Stores" onPress={createStores} />
      {error && <Text>Error loading stores: {error.message}</Text>}
      {stores.map((store) => (
        <Text key={store.storesUUID}>
          {store.storeName} - {store.storeAddress}
        </Text>
      ))}
    </View>
  );
}
```

# Métodos de `expo-sqlite-reactive`

Este apartado contiene todos los métodos disponibles en la librería `expo-sqlite-reactive`, con una descripción detallada y ejemplos de uso.


## Métodos Principales

### **`initialize(databaseName: string): SQLiteManager`**
Inicializa la base de datos SQLite y configura el modo `WAL` para mejorar el rendimiento.

**Parámetros:**
- `databaseName`: Nombre de la base de datos.

**Ejemplo:**
```typescript
SQLiteManager.initialize('mydatabase.db');
```


### **`createTable(tableName: string, data: ColumnDefinition): Promise<boolean>`**
Crea una tabla en la base de datos si no existe.

**Parámetros:**
- `tableName`: Nombre de la tabla.
- `data`: Objeto que define las columnas y sus tipos de datos.

**Ejemplo:**
```typescript
await SQLiteManager.createTable('users', {
  userId: 'TEXT PRIMARY KEY',
  userName: 'TEXT',
  createdAt: 'INTEGER',
});
```


### **`dropTable(tableName: string): Promise<boolean | null>`**
Elimina una tabla de la base de datos si existe.

**Parámetros:**
- `tableName`: Nombre de la tabla.

**Ejemplo:**
```typescript
await SQLiteManager.dropTable('users');
```


### **`insert(tableName: string, data: KeyValueData): Promise<TypeReturnQuery | null>`**
Inserta un registro en una tabla.

**Parámetros:**
- `tableName`: Nombre de la tabla.
- `data`: Objeto que contiene los datos a insertar.

**Ejemplo:**
```typescript
await SQLiteManager.insert('users', {
  userId: '1',
  userName: 'John Doe',
  createdAt: Date.now(),
});
```

### **`update(tableName: string, whereClause: object, data: KeyValueData): Promise<number | null>`**
Actualiza registros en una tabla según una condición.

**Parámetros:**
- `tableName`: Nombre de la tabla.
- `whereClause`: Objeto que define las condiciones de actualización.
- `data`: Objeto que contiene los valores a actualizar.

**Ejemplo:**
```typescript
await SQLiteManager.update('users', { userId: '1' }, { userName: 'Jane Doe' });
```


### **`delete(tableName: string, whereClause?: object): Promise<number | null>`**
Elimina registros en una tabla según una condición.

**Parámetros:**
- `tableName`: Nombre de la tabla.
- `whereClause`: Objeto que define las condiciones de eliminación.

**Ejemplo:**
```typescript
await SQLiteManager.delete('users', { userId: '1' });
```


### **`select<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }, limit?: number, offset?: number): Promise<T[] | null>`**
Realiza una consulta en una tabla.

**Parámetros:**
- `tableName`: Nombre de la tabla.
- `columns`: Array de nombres de columnas a seleccionar.
- `whereClause`: Objeto que define las condiciones de la consulta.
- `sort`: Objeto que define el orden de los resultados.
- `limit`: Número entero que define el número máximo de resultados a devolver.
- `offset`: Número entero que define el número de resultados a omitir.

**Ejemplo:**
```typescript 
const users = await SQLiteManager.select('users', ['userId', 'userName'], { userName: { $like: '%John%' } }, undefined, 10, 0);
```


## Métodos Avanzados

### **`createIndex(tableName: string, columnName: string): Promise<void>`**
Crea un índice en una columna para mejorar el rendimiento de las consultas.

**Ejemplo:**
```typescript
await SQLiteManager.createIndex('users', 'userName');
```

### **`addTableColumns(tableName: string, changes: ColumnDefinition): Promise<boolean>`**
Agrega nuevas columnas a una tabla existente.

**Ejemplo:**
```typescript
await SQLiteManager.addTableColumns('users', {
  middleName: 'TEXT',
  isActive: 'INTEGER',
});
```


### **`getAllTables(): Promise<tableInternalSchema[]>`**
Devuelve una lista de todas las tablas de la base de datos.

**Ejemplo:**
```typescript
const tables = await SQLiteManager.getAllTables();
console.log(tables);
```


### **`getTableSchema(tableName: string): Promise<tableRowSchema[]>`**
Obtiene el esquema de una tabla específica.

**Ejemplo:**
```typescript
const schema = await SQLiteManager.getTableSchema('users');
console.log(schema);
```

### **`validateTableSchema(tableName: string, expectedSchema: ColumnDefinition): Promise<boolean>`**
Valida si el esquema de una tabla coincide con un esquema esperado.

**Ejemplo:**
```typescript
const isValid = await SQLiteManager.validateTableSchema('users', {
  userId: 'TEXT',
  userName: 'TEXT',
});
console.log(isValid);
```

## Métodos de Reactividad

### **`useWatchTable(tableName: string, listener: () => void): void`**
Escucha cambios en una tabla y ejecuta una función cuando ocurren.

**Ejemplo:**
```typescript
useWatchTable('users', () => {
  console.log('La tabla "users" ha cambiado.');
});
```

### **`useQuery<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): T[]`**
Consulta datos de una tabla y actualiza la UI automáticamente cuando hay cambios.

**Ejemplo:**
```typescript
const [users, error] = useQuery('users', ['userId', 'userName'], { userName: { $like: '%John%' } });
```

### **`translateMongoJsonToSql(query: object): { whereStatement: string; values: any[] }`**
Convierte un objeto de consulta al estilo MongoDB en una consulta SQL.

**Ejemplo:**
```typescript
const { whereStatement, values } = translateMongoJsonToSql({
  name: { $like: '%John%' },
  age: { $gte: 18 },
});
```

# Ejemplos

## Crear tabla e índices
```ts
await SQLiteManager.createTable('users', {
  userId: 'TEXT PRIMARY KEY',
  userName: 'TEXT',
  createdAt: 'INTEGER',
});

await SQLiteManager.createIndex('users', 'userName');

```


## Uso de `useQuery`

```ts
function UserList() {
  const [users, error] = useQuery('users', ['userId', 'userName'], { userName: { $like: 'John%' } });

  if (error) return <Text>Error loading users: {error.message}</Text>;

  return (
    <View>
      {users.map(user => (
        <Text key={user.userId}>{user.userName}</Text>
      ))}
    </View>
  );
}
```
## Escucha de cambios en Tablas
```ts
useWatchTable('users', () => {
  console.log('Table "users" has changed');
});
```

# Roadmap
- [ ] Soporte para transacciones.
- [ ] Agregar soporte para Server Remoto de Sincronización.
- [ ] Agregar soporte para exportar a CSV toda la base de datos.
- [ ] Agregar soporte para exportar a JSON toda la base de datos.
- [ ] Agregar soporte para exportar a Excel toda la base de datos.
- [ ] Agregar soporte para importar desde CSV.
- [ ] Agregar soporte para importar desde JSON.
- [ ] Agregar soporte para importar desde Excel.
- [ ] Agregar soporte para actualizar la base de datos en segundo plano.
- [ ] Agregar soporte para actualizar la base de datos en segundo plano con transacciones.
- [ ] Agregar soporte para enviar la DB a un servidor remoto.



# Hacerca del autor
Librería desarrollada por [César Casas](https://www.linkedin.com/in/cesarcasas) / [Stock42](https://stock42.com/).

![Stock42](assets/stock42-logo-with-title-horizontal-play-blanco.png)

# Licencia

MIT License. Ver el archivo [LICENSE](./LICENSE) para más detalles.