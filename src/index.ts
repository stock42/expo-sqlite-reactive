import { useState, useEffect } from 'react'
import * as SQLite from 'expo-sqlite';
import { EventEmitter } from 'events';

type ColumnDefinition = {
  [columnName: string]: string;
};

type TypeEventTableEmitted = {
  tableName: string
  eventName: string
}

type KeyValueData = { [key: string]: any };
type TypeReturnQuery = {
  lastInsertRowId: number
  changes: number
}

const eventEmitter = new EventEmitter();

export function translateMongoJsonToSql(query: object) {
  const operatorsMap: {[key: string]: string} = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $ne: '!=',
    $in: 'IN',
    $nin: 'NOT IN'
  };

  const whereClauses = [];
  const values = [];

  for (const [field, condition] of Object.entries(query)) {
    if (typeof condition === 'object' && condition !== null) {
      for (const [operator, value] of Object.entries(condition)) {
        const sqlOperator = operatorsMap[operator];
        if (sqlOperator) {
          if (operator === '$in' || operator === '$nin') {
            if (Array.isArray(value)) {
              const placeholders = value.map(() => '?').join(', ');
              whereClauses.push(`${field} ${sqlOperator} (${placeholders})`);
              values.push(...value);
            } else {
              throw new Error(`Value for ${operator} must be an array`);
            }
          } else {
            whereClauses.push(`${field} ${sqlOperator} ?`);
            values.push(value);
          }
        } else {
          throw new Error(`Unsupported operator: ${operator}`);
        }
      }
    } else {
      // If the condition is a direct value, assume equality
      whereClauses.push(`${field} = ?`);
      values.push(condition);
    }
  }

  const whereStatement = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  return { whereStatement, values };
}


export class SQLiteManager {
  private static db: SQLite.SQLiteDatabase;

  static initialize(databaseName: string) {
    this.db = SQLite.openDatabaseSync(databaseName);
    this.db.execSync('PRAGMA journal_mode = WAL')
    return this
  }

  constructor(databaseName: string) {
    SQLiteManager.db = SQLite.openDatabaseSync(databaseName);
    SQLiteManager.db.execSync('PRAGMA journal_mode = WAL')
  }

  static async createTable(name: string, data: ColumnDefinition): Promise<boolean> {
    data['added'] = 'integer'
    const columns = Object.entries(data)
      .map(([columnName, type]) => `${columnName} ${type.toUpperCase()}`)
      .join(', ');

    const query = `CREATE TABLE IF NOT EXISTS ${name} (${columns})`;
    try {
        await this.db.execAsync(query)
        return true
    } catch (err) {
      throw err
    } 
  }

  static async insert(tableName: string, data: KeyValueData): Promise< TypeReturnQuery | null> {
    data['added'] = new Date().getTime()
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    try {
      const result = await this.db.runAsync(query, values)
      eventEmitter.emit('change', { tableName, eventName: 'insert' } as TypeEventTableEmitted);

      return {
        lastInsertRowId: result.lastInsertRowId,
        changes: result.changes,
      }
    } catch (err) {
      throw err
    }
   
  }

  static async dropTable(tableName: string): Promise<boolean | null> {
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    try {
      await this.db.execAsync(query);
      return true
    } catch (err) {
      throw err
    }
  }

  static async delete(tableName: string, whereClause?: object): Promise<number | null> {
    let whereSentence =  ''
    let whereArgs = []
    if (whereClause) {
      const splited = translateMongoJsonToSql(whereClause)
      whereSentence = splited.whereStatement
      whereArgs = splited.values
    }
    const query = `DELETE FROM ${tableName} ${whereSentence}`;
    try {
      const result = await this.db.runAsync(query, whereArgs);
      eventEmitter.emit('change', { tableName, eventName: 'delete' } as TypeEventTableEmitted);
      return result.changes;
    } catch (err) {
      throw err
    }
  }

  static async update(tableName: string, whereClause: object, data: KeyValueData): Promise<number | null> {
    const setClause = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(data);

    let whereSentence = ''
    let whereArgs = []
    if (whereClause) {
      const splited = translateMongoJsonToSql(whereClause)
      whereSentence = splited.whereStatement
      whereArgs = splited.values
    }

    const query = `UPDATE ${tableName} SET ${setClause} ${whereSentence}`;
    try {
      const result = await this.db.runAsync(query, [...values, ...whereArgs]);
      eventEmitter.emit('change', { tableName: tableName, eventName: 'update', data } as TypeEventTableEmitted);

      return result.changes;
    } catch (err) {
      throw err
    }
  }

  static async select<T>(tableName: string, columns: string[] = ['*'], whereClause?: object, sort?: { [key: string]: number }): Promise<T[] | null> {
    let whereSentence = ''
    let whereArgs = []
    if (whereClause) {
      const splited = translateMongoJsonToSql(whereClause)
      whereSentence = splited.whereStatement
      whereArgs = splited.values
    }

    let orderByClause = '';
  if (sort) {
    const sortClauses = Object.entries(sort).map(([key, value]) => {
      const direction = value === 1 ? 'ASC' : 'DESC';
      return `${key} ${direction}`;
    });
    orderByClause = `ORDER BY ${sortClauses.join(', ')}`;
  }

    const query = `SELECT ${columns.join(', ')} FROM ${tableName} ${whereSentence} ${orderByClause}`;
    try {
      const result = await this.db.getAllAsync<T>(query, whereArgs);
      return result;
    } catch (err) {
      throw err
    }
  }

}


export function useQuery<T>(tableName: string, columns: string[] = ['*'], whereClause?: object, sort?: { [key: string]: number }): T[] {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<any>()

  const fetchData = async () => {
    try {
      const result = await SQLiteManager.select<T>(tableName, columns, whereClause, sort);
      setData(result ?? []);
    } catch (err) {
      setError(err)
    }
    
  };

  useEffect(() => {
    const listener = () => fetchData();
    eventEmitter.on('change', (eventData: TypeEventTableEmitted) => {
      if (eventData.tableName === tableName) listener()
    });

    fetchData();
    return () => {
      eventEmitter.off('change', listener);
    };
  }, []);

  return [data, error];
}
