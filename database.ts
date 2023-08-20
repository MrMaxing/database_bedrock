import * as mc from '@minecraft/server'

export class Database<Key, Value> {
    /**
     * The name of the database (scoreboard objective)
     * @type {string} The name of the database
     */
    private DATABASE_NAME: string
    /**
     * The display name of the scoreboard objective
     * @type {string} The display name of the scoreboard objective
     */
    private DISPLAY_NAME: string
    /**
     * Creates a new database instance with the given name and optional display name
     * @param databaseName The name of the database
     * @example new Database('name')
     * @throws {Error} If the database name is less than 1 character long
     */
    constructor(databaseName: string) {
        if (databaseName.length < 1)
            throw new Error('Database name must be at least 1 character long');
        this.DATABASE_NAME = databaseName;
        this.DISPLAY_NAME = `Database:${databaseName}`;
        try { mc.world.scoreboard.addObjective(this.DATABASE_NAME, this.DISPLAY_NAME) } catch { }
    }
    /**
     * Converts a string to base 36
     * @param {string} value The string to convert
     * @returns {string} The base 36 string
     */
    private valueToBase36(value: string): string {
        return value.split('').map(value => value.charCodeAt(0).toString(32)).join(' ');
    }
    /**
     * Converts a base 36 string to a string
     * @param {string} base36 The base 36 string to convert
     * @returns {string} The converted string
     */
    private base36ToValue(base36: string): string {
        return base36.split(' ').map(value => String.fromCharCode(parseInt(value, 32))).join('');
    }
    /** 
     * Runs a command
     * @param {string} command The command to run
     * @returns {void}
     * @example this.runCommand('say Hello World!')
     */
    private runCommand(command: string): void {
        mc.world.getDimension('overworld').runCommandAsync(command)
    }
    /**
     * Gets the database
     * @returns {Array<{key: Key, value: Value}>} The database
     */
    public getDatabase(): Array<{ key: Key; value: Value; }> {
        return mc.world.scoreboard.getObjective(this.DATABASE_NAME).getParticipants().map(data => {
            if (data.displayName.startsWith('Database:')) {
                const [key, value] = JSON.parse(this.base36ToValue(data.displayName.split(':')[1]));
                return { key, value }
            }
        }).filter((data): data is { key: Key; value: Value; } => data instanceof Object)
    }
    /**
     * Sets a key-value pair
     * @param {Key} key The key
     * @param {Value} value The value
     * @returns {void}
     * @example this.set('key', 'value')
     */
    public set(key: Key, value: Value): void {
        const database = this.valueToBase36(JSON.stringify([key, value]));
        this.runCommand(`scoreboard players set "Database:${database}" "${this.DATABASE_NAME}" 0`);
    }
    /**
     * Deletes a key-value pair
     * @param {Key} key The key
     * @returns {void}
     * @example this.delete('key')
     */
    public delete(key: Key): void {
        const database = this.valueToBase36(JSON.stringify([key, this.get(key)]));
        this.runCommand(`scoreboard players reset "Database:${database}" "${this.DATABASE_NAME}"`);
    }
    /**
     * Clears the database
     * @returns {void}
     * @example this.clear()
     */
    public clear(): void {
        this.getDatabase().forEach(({ key }) => this.delete(key))
    }
    /**
     * Replaces a key-value pair
     * @param {Key} key The key
     * @param {Value} value The value
     * @returns {void}
     */
    public replace(key: Key, value: Value): void {
        this.delete(key)
        this.set(key, value)
    }
    /**
     * Gets a value from the database
     * @param {Key} key The key
     * @returns {Value | undefined} The value
     * @example this.get('key')
     */
    public get(key: Key): Value | undefined {
        return this.getDatabase().find(({ key: databaseKey }) => key === databaseKey)?.value
    }
    /**
     * Checks if a key exists in the database
     * @param {Key} key The key
     * @returns {boolean} Whether the key exists in the database
     * @example this.has('key')
     */
    public has(key: Key): boolean {
        return Boolean(this.get(key))
    }
    /**
     * Gets the size of the database
     * @returns {number} The size of the database
     */
    public size(): number {
        return this.getDatabase().length
    }
    /**
     * Gets the keys of the database
     * @returns {Key[]} The keys of the database
     */
    public keys(): Key[] {
        return this.getDatabase().map(({ key }) => key)
    }
    /**
     * Gets the values of the database
     * @returns {Value[]} The values of the database
     */
    public values(): Value[] {
        return this.getDatabase().map(({ value }) => value)
    }
    /**
     * Maps the database
     * @param callback The callback
     * @returns {Array<{key: Key, value: Value}>} The mapped database
     */
    public map<Data>(callback: (Data: { key: Key; value: Value }) => Data): Data[] {
        return this.getDatabase().map(({ key, value }) => callback({ key, value }))
    }
    /**
     * Executes a callback for each key-value pair
     * @param callback The callback
     * @returns {void}
     */
    public forEach(callback: (key: Key, value: Value) => void): void {
        this.getDatabase().forEach(({ key, value }) => callback(key, value))
    }
    /**
     * Filters the database
     * @param callback The callback
     * @returns {Array<{key: Key, value: Value}>} The filtered database
     */
    public filter(callback: (key: Key, value: Value) => boolean): Array<{ key: Key; value: Value; }> {
        return this.getDatabase().filter(({ key, value }) => callback(key, value))
    }
    /**
     * Finds a key-value pair
     * @param callback The callback
     * @returns {{key: Key, value: Value} | undefined} The key-value pair
     */
    public find(callback: (key: Key, value: Value) => boolean): { key: Key; value: Value; } | undefined {
        return this.getDatabase().find(({ key, value }) => callback(key, value))
    }
}
