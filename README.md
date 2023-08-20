# MC Database 0.1.0
This class provides a convenient way to store and retrieve key-value pairs in Minecraft using the scoreboard objective. It allows you to set, get, delete, and replace key-value pairs, as well as perform various operations on the database such as clearing, checking for key existence, and retrieving the size, keys, and values.

## Usage

Here's an example of how to use the `Database` class:

```typescript
// Import the required modules
import * as mc from '@minecraft/server';

// Create a new instance of the database
const database = new Database<string, number>('example');

// Set key-value pairs
database.set('key1', 1);
database.set('key2', 2);
database.set('key3', 3);

// Get a value from a key
const value = database.get('key2');
console.log(value); // Output: 2

// Check if the database has a key
const hasKey = database.has('key3');
console.log(hasKey); // Output: true

// Get the size of the database
const size = database.size();
console.log(size); // Output: 3

// Iterate over key-value pairs
database.forEach((key, value) => {
    console.log(`${key}: ${value}`);
});

// Clear the database
database.clear();
```

| Method                                | Description                                                         |
| ------------------------------------- | ------------------------------------------------------------------- |
| `constructor(databaseName: string)`   | Creates a new database instance with the given name.                |
| `getDatabase(): Array<{ key: Key; value: Value }>` | Returns the entire database as an array of key-value pairs.  |
| `set(key: Key, value: Value): void`   | Sets a key-value pair in the database.                               |
| `clear(): void`                       | Clears the entire database.                                          |
| `delete(key: Key): void`              | Deletes a key-value pair from the database.                          |
| `replace(key: Key, value: Value): void` | Replaces a key-value pair in the database with a new value.         |
| `get(key: Key): Value \| undefined`   | Retrieves the value associated with a key.                           |
| `has(key: Key): boolean`              | Checks if the database contains a specific key.                      |
| `size(): number`                      | Returns the size of the database.                                    |
| `keys(): Key[]`                       | Returns an array of all keys in the database.                        |
| `values(): Value[]`                   | Returns an array of all values in the database.                      |
| `forEach(callback: (key: Key, value: Value) => void): void` | Executes a callback function for each key-value pair in the database. |
| `map(callback: (key: Key, value: Value) => [Key, Value]): Array<[Key, Value]>` | Maps the database using a callback function and returns the result.   |
| `filter(callback: (key: Key, value: Value) => boolean): Array<[Key, Value]>` | Filters the database using a callback function and returns the result. |
