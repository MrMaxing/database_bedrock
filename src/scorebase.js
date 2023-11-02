import * as mc from '@minecraft/server';
export class Database {
    /**
     * The map of key-value pairs
     * @type {Map<string, string>} The map of key-value pairs
     */
    DATABASE_MAP = new Map();
    /**
     * The name of the database (scoreboard objective)
     * @type {string} The name of the database
     */
    DATABASE_NAME;
    /**
     * The display name of the scoreboard objective
     * @type {string} The display name of the scoreboard objective
     */
    DISPLAY_NAME;
    /**
     * Creates a new database instance with the given name and optional display name
     * @param databaseName The name of the database
     * @example new Database('name')
     * @throws {Error} If the database name is less than 1 character long
     */
    constructor(databaseName) {
        if (databaseName.length < 1)
            throw new Error('Database name must be at least 1 character long');
        this.DATABASE_NAME = databaseName;
        this.DISPLAY_NAME = `Database:${databaseName}`;
        this.start();
    }
    /**
     * Starts the database
     * Adds all key-value pairs to the map
     * @returns {void}
     */
    start() {
        try {
            mc.world.scoreboard.addObjective(this.DATABASE_NAME, this.DISPLAY_NAME);
        }
        catch { }
        mc.world.scoreboard.getObjective(this.DATABASE_NAME).getParticipants().forEach(data => {
            if (data.displayName.startsWith('db:')) {
                const [key, value] = JSON.parse(this.base36ToValue(data.displayName.split(':')[1]));
                this.DATABASE_MAP.set(key, value);
            }
        });
    }
    /**
     * Saves the database
     * Removes the scoreboard objective and adds it again
     * @returns {void}
     */
    save() {
        mc.world.scoreboard.removeObjective(this.DATABASE_NAME);
        mc.world.scoreboard.addObjective(this.DATABASE_NAME, this.DISPLAY_NAME);
        this.DATABASE_MAP.forEach((value, key) => {
            const database = this.valueToBase36(JSON.stringify([key, value]));
            this.runCommand(`scoreboard players set "db:${database}" "${this.DATABASE_NAME}" 0`);
        });
    }
    /**
     * Converts a string to base 36
     * @param {string} value The string to convert
     * @returns {string} The base 36 string
     */
    valueToBase36(value) {
        return value.split('').map(value => value.charCodeAt(0).toString(32)).join(' ');
    }
    /**
     * Converts a base 36 string to a string
     * @param {string} base36 The base 36 string to convert
     * @returns {string} The converted string
     */
    base36ToValue(base36) {
        return base36.split(' ').map(value => String.fromCharCode(parseInt(value, 32))).join('');
    }
    /**
     * Runs a command
     * @param {string} command The command to run
     * @returns {void}
     * @example this.runCommand('say Hello World!')
     */
    runCommand(command) {
        mc.world.getDimension('overworld').runCommandAsync(command);
    }
    /**
     * Gets the database
     * @returns {Array<{key: string, value: string}>} The database
     */
    getDatabase() {
        const data = Object.fromEntries(this.DATABASE_MAP);
        return Object.entries(data).map(([key, value]) => ({ key, value }));
    }
    /**
     * Sets a key-value pair
     * @param {string} key The key
     * @param {string} value The value
     * @returns {void}
     * @example this.set('key', 'value')
     */
    set(key, value) {
        this.DATABASE_MAP.set(key, value);
        this.save();
    }
    /**
     * Clears the database
     * @returns {void}
     * @example this.clear()
     */
    clear() {
        this.DATABASE_MAP.clear();
        this.save();
    }
    /**
     * Deletes a key-value pair
     * @param {string} key The key
     * @returns {void}
     * @example this.delete('key')
     */
    delete(key) {
        this.DATABASE_MAP.delete(key);
        this.save();
    }
    /**
     * Finds a key-value pair
     * @param {string} key The key
     * @param {string} value The value
     * @returns {void}
     */
    replace(key, value) {
        this.delete(key);
        this.set(key, value);
        this.save();
    }
    /**
     * Gets a value from a key
     * @param key The key
     * @returns {string | undefined} The value
     * @example this.get('key')
     */
    get(key) {
        return this.DATABASE_MAP.get(key);
    }
    /**
     * Checks if the database has a key
     * @param {string} key The key
     * @returns {boolean} Whether the database has the key
     * @example this.has('key')
     */
    has(key) {
        return this.DATABASE_MAP.has(key);
    }
    /**
     * Gets the size of the database
     * @returns {number} The size of the database
     */
    size() {
        return this.DATABASE_MAP.size;
    }
    /**
     * Gets the entries of the database
     * @returns {IterableIterator<[string, string]>} The entries of the database
     */
    entries() {
        return this.DATABASE_MAP.entries();
    }
    /**
     * Gets the keys of the database
     * @returns {string[]} The keys of the database
     */
    keys() {
        return this.getDatabase().map(({ key }) => key);
    }
    /**
     * Gets the values of the database
     * @returns {string[]} The values of the database
     */
    values() {
        return this.getDatabase().map(({ value }) => value);
    }
    /**
     * Executes a callback for each key-value pair
     * @param {Function} callback The callback
     * @returns {void}
     */
    forEach(callback) {
        this.DATABASE_MAP.forEach(callback);
    }
    /**
     * Maps the database
     * @param {Function} callback The callback
     * @returns {Array<[string, string]>} The mapped database
     */
    map(callback) {
        return this.getDatabase().map(({ key, value }) => callback(key, value));
    }
    /**
     * Filters the database
     * @param callback The callback
     * @returns {Array<[string, string]>} The filtered database
     */
    filter(callback) {
        return this.getDatabase().filter(({ key, value }) => callback(key, value)).map(({ key, value }) => [key, value]);
    }
}
