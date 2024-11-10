- [Documetación en español](#documetación-en-español)
- [expo-sqlite-reactive](#expo-sqlite-reactive)
  - [Features](#features)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [1. Database Initialization](#1-database-initialization)
    - [2. Creating Tables](#2-creating-tables)
    - [3. Inserting Data](#3-inserting-data)
    - [4. Querying Data with `useQuery`](#4-querying-data-with-usequery)
      - [`useQuery` Parameters](#usequery-parameters)
    - [5. Deleting and Updating Data](#5-deleting-and-updating-data)
    - [Examples of Complex Queries](#examples-of-complex-queries)
      - [Query with Conditions](#query-with-conditions)
      - [Inserting and Querying Data](#inserting-and-querying-data)
  - [Comparison with Realm](#comparison-with-realm)
  - [Full Example](#full-example)
  - [About the Author](#about-the-author)
  - [License](#license)


![alt text](assets/expo-sqlite-reactive.png)

# Documetación en español
[Ver acá](README.es.md)
# expo-sqlite-reactive

`expo-sqlite-reactive` is a solution that extends the functionality of `expo-sqlite` to provide a reactive way to work with SQLite databases in Expo and React Native applications. This package allows you to create tables, perform CRUD operations, and keep your UI in sync with data changes using the `useQuery` hook.


## Features

- **Reactivity**: Use `useQuery` to listen for changes and automatically update the UI when the database changes.
- **CRUD Support**: Simple methods for creating, reading, updating, and deleting data.
- **SQLite-Based**: Leverages the robustness of `expo-sqlite` for local storage.
- **Simplicity**: Provides an intuitive and straightforward interface.

## Installation

```bash
npm install expo-sqlite-reactive
```

Make sure `expo-sqlite` is installed as a dependency.

```bash
expo install expo-sqlite
```

## Basic Usage

### 1. Database Initialization

First, initialize the database with your desired name:

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

### 2. Creating Tables

```typescript
await SQLiteManager.createTable('products', {
  productUUID: 'text',
  productName: 'text',
  productPrice: 'integer',
});
```

### 3. Inserting Data

```typescript
const product = {
  productUUID: '1234',
  productName: 'Laptop',
  productPrice: 999,
};

await SQLiteManager.insert('products', product);
```

### 4. Querying Data with `useQuery`

`useQuery` provides a reactive way to query and update the UI when data changes.

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
  whereClause?: object,       // Optional filtering conditions (e.g., { price: { $gt: 50 } })
  sort?: { [key: string]: 1 | -1 } // Sorting (e.g., { price: 1 } for ascending order by price)
);
```

- **`tableName`**: The name of the table to query.
- **`columns`**: An array of strings specifying which columns to select. `['*']` selects all columns.
- **`whereClause`**: An optional object defining filtering conditions, similar to MongoDB queries.
- **`sort`**: An optional object defining the order of results (1 for ascending, -1 for descending).

### 5. Deleting and Updating Data

Dropping a table:

```typescript
await SQLiteManager.dropTable('products');
```

Updating a record:

```typescript
await SQLiteManager.update('products', { productUUID: '1234' }, { productPrice: 899 });
```

Deleting a record:

```typescript
await SQLiteManager.delete('products', { productUUID: '1234' });
```

### Examples of Complex Queries

#### Query with Conditions

```typescript
const [products, error] = useQuery(
  'products',
  ['productName', 'productPrice'],
  { productPrice: { $gt: 100 } }, // Condition: prices greater than 100
  { productName: 1 }              // Ascending order by product name
);
```

#### Inserting and Querying Data

```typescript
// Insert a new user
await SQLiteManager.insert('users', {
  usersUUID: '1234',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
});

// Query all users
const [users, error] = useQuery('users', ['*']);
```

## Comparison with Realm

`expo-sqlite-reactive` can be considered a lightweight and efficient alternative to Realm in certain scenarios:

- **Reactive Synchronization**: `useQuery` provides a reactive way to update the UI, similar to Realm's reactive collections.
- **Simplicity**: While Realm offers many advanced features, `expo-sqlite-reactive` is simpler and designed for scenarios where complex synchronization or heavy databases are not required.
- **Native Support**: Being based on SQLite, it leverages a backend that is common across many systems and devices, offering potential performance and compatibility advantages.

## Full Example

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

## About the Author
This library was developed by [César Casas](https://www.linkedin.com/in/cesarcasas) / [Stock42](https://stock42.com/).

![alt text](assets/stock42-logo-with-title-horizontal-play-blanco.png)

## License

MIT License. See the [LICENSE](./LICENSE) file for more details.