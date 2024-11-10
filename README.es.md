- [expo-sqlite-reactive](#expo-sqlite-reactive)
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
  - [Comparación con Realm](#comparación-con-realm)
  - [Ejemplo Completo](#ejemplo-completo)
  - [Hacerca del autor](#hacerca-del-autor)
  - [Licencia](#licencia)

![expo-sqlite-reactive](assets/expo-sqlite-reactive.png)

# expo-sqlite-reactive

`expo-sqlite-reactive` es una solución que extiende la funcionalidad de `expo-sqlite` para proporcionar una forma reactiva de trabajar con bases de datos SQLite en aplicaciones Expo y React Native. Este paquete permite crear tablas, realizar operaciones CRUD y mantener actualizados los datos en tu UI mediante el hook `useQuery`.

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

## Hacerca del autor
Librería desarrollada por [César Casas](https://www.linkedin.com/in/cesarcasas) / [Stock42](https://stock42.com/).

![Stock42](assets/stock42-logo-with-title-horizontal-play-blanco.png)


## Licencia

MIT License. Ver el archivo [LICENSE](./LICENSE) para más detalles.