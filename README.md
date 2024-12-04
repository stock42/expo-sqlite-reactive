![expo-sqlite-reactive](assets/expo-sqlite-reactive.png)

- [expo-sqlite-reactive](#expo-sqlite-reactive)
  - [Comparación con Realm](#comparación-con-realm)
  - [Features](#features)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [1. Database Initialization](#1-database-initialization)
    - [2. Create Tables](#2-create-tables)
    - [3. Insert Data](#3-insert-data)
    - [4. Perform Queries with `useQuery`](#4-perform-queries-with-usequery)
      - [`useQuery` Parameters](#usequery-parameters)
    - [5. Delete and Update Data](#5-delete-and-update-data)
    - [Complex Query Examples](#complex-query-examples)
      - [Query with Conditions](#query-with-conditions)
      - [Insert and Query Data](#insert-and-query-data)
  - [Comparison with Realm](#comparison-with-realm)
  - [Complete Example](#complete-example)
- [`expo-sqlite-reactive` Methods](#expo-sqlite-reactive-methods)
  - [Main Methods](#main-methods)
    - [**`initialize(databaseName: string): SQLiteManager`**](#initializedatabasename-string-sqlitemanager)
    - [**`createTable(tableName: string, data: ColumnDefinition): Promise<boolean>`**](#createtabletablename-string-data-columndefinition-promiseboolean)
    - [**`dropTable(tableName: string): Promise<boolean | null>`**](#droptabletablename-string-promiseboolean--null)
    - [**`insert(tableName: string, data: KeyValueData): Promise<TypeReturnQuery | null>`**](#inserttablename-string-data-keyvaluedata-promisetypereturnquery--null)
    - [**`update(tableName: string, whereClause: object, data: KeyValueData): Promise<number | null>`**](#updatetablename-string-whereclause-object-data-keyvaluedata-promisenumber--null)
    - [**`delete(tableName: string, whereClause?: object): Promise<number | null>`**](#deletetablename-string-whereclause-object-promisenumber--null)
    - [**`select<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): Promise<T[] | null>`**](#selectttablename-string-columns-string-whereclause-object-sort--key-string-number--promiset--null)
  - [Advanced Methods](#advanced-methods)
    - [**`createIndex(tableName: string, columnName: string): Promise<void>`**](#createindextablename-string-columnname-string-promisevoid)
    - [**`addTableColumns(tableName: string, changes: ColumnDefinition): Promise<boolean>`**](#addtablecolumnstablename-string-changes-columndefinition-promiseboolean)
    - [**`getAllTables(): Promise<tableInternalSchema[]>`**](#getalltables-promisetableinternalschema)
    - [**`getTableSchema(tableName: string): Promise<tableRowSchema[]>`**](#gettableschematablename-string-promisetablerowschema)
    - [**`validateTableSchema(tableName: string, expectedSchema: ColumnDefinition): Promise<boolean>`**](#validatetableschematablename-string-expectedschema-columndefinition-promiseboolean)
  - [Reactivity Methods](#reactivity-methods)
    - [**`useWatchTable(tableName: string, listener: () => void): void`**](#usewatchtabletablename-string-listener---void-void)
    - [**`useQuery<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): T[]`**](#usequeryttablename-string-columns-string-whereclause-object-sort--key-string-number--t)
    - [**`translateMongoJsonToSql(query: object): { whereStatement: string; values: any[] }`**](#translatemongojsontosqlquery-object--wherestatement-string-values-any-)
- [Examples](#examples)
  - [Create Table and Indexes](#create-table-and-indexes)
  - [Using `useQuery`](#using-usequery)
  - [Listening for Changes in Tables](#listening-for-changes-in-tables)
- [Roadmap](#roadmap)
- [About the Author](#about-the-author)
- [License](#license)


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

`expo-sqlite-reactive` is a solution that extends the functionality of `expo-sqlite` to provide a reactive way of working with SQLite databases in Expo and React Native applications. This package allows creating tables, performing CRUD operations, and keeping your UI updated using the `useQuery` hook.
It enables the creation of offline applications quickly, simply, and reliably.
[Stock42](https://stock42.com) uses this library for all its applications.
We recommend [S42](https://s42ui.com) for faster mobile application development.


## Comparación con Realm
| Feature       | expo-sqlite-reactive      | Realm                    |
|----------------------|---------------------------|--------------------------|
| Library Size  | Lightweight                    | Heavy                  |
| Reactivity          | Yes, with `useQuery`        | Yes, integrated            |
| Compatibility       | Native SQLite             | Limited to Realm database    |
| Ease of Use	     | Simple                  | Complex for beginners |


## Features

- **Reactivity**: Use `useQuery` to listen for and automatically update the UI when changes occur in the database.
- **CRUD Support**: Simple methods to create, read, update, and delete data.
- **SQLite-Based**: Leverages the robustness of `expo-sqlite` for local storage.
- **Simplicity**: Provides an intuitive and straightforward interface.

## Installation

```bash
npm install expo-sqlite-reactive
```

Make sure `expo-sqlite` is installed as a dependency:

```bash
expo install expo-sqlite
```

## Basic Usage

### 1. Database Initialization

First, initialize the database with the desired name:

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

### 2. Create Tables

```typescript
await SQLiteManager.createTable('products', {
  productUUID: 'text',
  productName: 'text',
  productPrice: 'integer',
});
```

### 3. Insert Data

```typescript
const product = {
  productUUID: '1234',
  productName: 'Laptop',
  productPrice: 999,
};

await SQLiteManager.insert('products', product);
```

### 4. Perform Queries with `useQuery`

`useQuery` provides a reactive way to query data and update the UI when changes occur.

```typescript
import { useQuery } from 'expo-sqlite-reactive';

export default function ProductList() {
  // Reactive query on the "products" table
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

#### `useQuery` Parameters

```typescript
const [data, error] = useQuery(
  tableName: string,          // Name of the table to query
  columns: string[],          // Columns to select (e.g., ['*'] to select all)
  whereClause?: object,       // Optional filter conditions (e.g., { price: { $gt: 50 } })
  sort?: { [key: string]: 1 | -1 } // Sorting (e.g., { price: 1 } for ascending order by price)
);
```

- **`tableName`**: The name of the table to query.
- **`columns`**: An array of strings specifying which columns to select. `['*']` selects all columns.
- **`whereClause`**: An optional object to define filter conditions, similar to a MongoDB query.
- **`sort`**: An optional object to define the sorting order (1 for ascending, -1 for descending).

### 5. Delete and Update Data

Drop a table:

```typescript
await SQLiteManager.dropTable('products');
```

Update a record:

```typescript
await SQLiteManager.update('products', { productUUID: '1234' }, { productPrice: 899 });
```

Delete a record:

```typescript
await SQLiteManager.delete('products', { productUUID: '1234' });
```

### Complex Query Examples

#### Query with Conditions

```typescript
const [products, error] = useQuery(
  'products',
  ['productName', 'productPrice'],
  { productPrice: { $gt: 100 } }, // Condición: precios mayores a 100
  { productName: 1 }              // Orden ascendente por nombre de producto
);
```

#### Insert and Query Data

```typescript
// Insertar new row
await SQLiteManager.insert('users', {
  usersUUID: '1234',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
});

// get all users
const [users, error] = useQuery('users', ['*']);
```

## Comparison with Realm

`expo-sqlite-reactive` an be considered a lightweight and efficient alternative to Realm in certain situations:

- **Reactive Sync**: `useQuery` provides a reactive way to update the UI, similar to Realm's reactive collections.
- **Simplicity**: While Realm offers many advanced features, `expo-sqlite-reactive` is simpler and designed for scenarios where complex synchronization or heavy databases are not required.
- **Native Support**: Being based on SQLite, it leverages a backend that is common in many systems and devices, offering advantages in performance and compatibility.

## Complete Example

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

# `expo-sqlite-reactive` Methods

This section includes all the available methods in the `expo-sqlite-reactive` library, with detailed descriptions and usage examples.


## Main Methods

### **`initialize(databaseName: string): SQLiteManager`**
Initializes the SQLite database and sets the `WAL` mode to improve performance.

**Parameters:**
- `databaseName`: The name of the database.

**Example:**
```typescript
SQLiteManager.initialize('mydatabase.db');
```


### **`createTable(tableName: string, data: ColumnDefinition): Promise<boolean>`**
Creates a table in the database if it does not already exist.

**Parameters:**
- `tableName`: The name of the table.
- `data`: An object defining the columns and their data types.

**Example:**
```typescript
await SQLiteManager.createTable('users', {
  userId: 'TEXT PRIMARY KEY',
  userName: 'TEXT',
  createdAt: 'INTEGER',
});
```


### **`dropTable(tableName: string): Promise<boolean | null>`**
Deletes a table from the database if it exists.

**Parameters:**
- `tableName`: The table name.

**Example:**
```typescript
await SQLiteManager.dropTable('users');
```


### **`insert(tableName: string, data: KeyValueData): Promise<TypeReturnQuery | null>`**
Inserta new row into table

**Parameters:**
- `tableName`: The table name
- `data`: Objec with data to insert

**Example:**
```typescript
await SQLiteManager.insert('users', {
  userId: '1',
  userName: 'John Doe',
  createdAt: Date.now(),
});
```

### **`update(tableName: string, whereClause: object, data: KeyValueData): Promise<number | null>`**
Updates records in a table based on a condition.


**Parameters:**
- `tableName`: Table name.
- `whereClause`: An object that defines the update conditions.
- `data`: An object containing the values to update.

**Example:**
```typescript
await SQLiteManager.update('users', { userId: '1' }, { userName: 'Jane Doe' });
```


### **`delete(tableName: string, whereClause?: object): Promise<number | null>`**
Deletes records in a table based on a condition.

**Parameters:**
- `tableName`: Table Name
- `whereClause`: An object that defines the deletion conditions.

**Example:**
```typescript
await SQLiteManager.delete('users', { userId: '1' });
```


### **`select<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): Promise<T[] | null>`**
Performs a query on a table.

**Parameters:**
- `tableName`: Table name.
- `columns`: An array of column names to select.
- `whereClause`: An object that defines the query conditions.
- `sort`: An object that defines the sorting order of the results.

**Example:**
```typescript
const users = await SQLiteManager.select('users', ['userId', 'userName'], { userName: { $like: '%John%' } });
```


## Advanced Methods

### **`createIndex(tableName: string, columnName: string): Promise<void>`**
Creates an index on a column to improve query performance.

**Example:**
```typescript
await SQLiteManager.createIndex('users', 'userName');
```

### **`addTableColumns(tableName: string, changes: ColumnDefinition): Promise<boolean>`**
Adds new columns to an existing table.

**Example:**
```typescript
await SQLiteManager.addTableColumns('users', {
  middleName: 'TEXT',
  isActive: 'INTEGER',
});
```


### **`getAllTables(): Promise<tableInternalSchema[]>`**
Returns a list of all tables in the database.

**Example:**
```typescript
const tables = await SQLiteManager.getAllTables();
console.log(tables);
```


### **`getTableSchema(tableName: string): Promise<tableRowSchema[]>`**
Retrieves the schema of a specific table.

**Example:**
```typescript
const schema = await SQLiteManager.getTableSchema('users');
console.log(schema);
```

### **`validateTableSchema(tableName: string, expectedSchema: ColumnDefinition): Promise<boolean>`**
Validates whether the schema of a table matches an expected schema.

**Example:**
```typescript
const isValid = await SQLiteManager.validateTableSchema('users', {
  userId: 'TEXT',
  userName: 'TEXT',
});
console.log(isValid);
```

## Reactivity Methods

### **`useWatchTable(tableName: string, listener: () => void): void`**
Listens for changes in a table and executes a function when changes occur.

**Example:**
```typescript
useWatchTable('users', () => {
  console.log('La tabla "users" ha cambiado.');
});
```

### **`useQuery<T>(tableName: string, columns?: string[], whereClause?: object, sort?: { [key: string]: number }): T[]`**
Consulta datos de una tabla y actualiza la UI automáticamente cuando hay cambios.

**Example:**
```typescript
const [users, error] = useQuery('users', ['userId', 'userName'], { userName: { $like: '%John%' } });
```

### **`translateMongoJsonToSql(query: object): { whereStatement: string; values: any[] }`**
Queries data from a table and automatically updates the UI when changes occur.

**Example:**
```typescript
const { whereStatement, values } = translateMongoJsonToSql({
  name: { $like: '%John%' },
  age: { $gte: 18 },
});
```

# Examples

## Create Table and Indexes
```ts
await SQLiteManager.createTable('users', {
  userId: 'TEXT PRIMARY KEY',
  userName: 'TEXT',
  createdAt: 'INTEGER',
});

await SQLiteManager.createIndex('users', 'userName');

```


## Using `useQuery`

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
## Listening for Changes in Tables
```ts
useWatchTable('users', () => {
  console.log('Table "users" has changed');
});
```

# Roadmap
- [ ] Support for transactions.
- [ ] Add support for remote server synchronization.
- [ ] Add support to export the entire database to CSV.
- [ ] Add support to export the entire database to JSON.
- [ ] Add support to export the entire database to Excel.
- [ ] Add support to import data from CSV.
- [ ] Add support to import data from JSON.
- [ ] Add support to import data from Excel.
- [ ] Add support for background database updates.
- [ ] Add support for background database updates with transactions.
- [ ] Add support to send the database to a remote server.


# About the Author
Library developed by [César Casas](https://www.linkedin.com/in/cesarcasas) / [Stock42](https://stock42.com/).

![Stock42](assets/stock42-logo-with-title-horizontal-play-blanco.png)

# License

MIT License. See the [LICENSE](./LICENSE) file for more details.