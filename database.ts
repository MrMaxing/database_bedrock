import * as mc from '@minecraft/server'
export class Database {
    /**
     * The map of key-value pairs
     * @type {Map<string, string>} The map of key-value pairs
     */
    private DATABASE_MAP: Map<string, string> = new Map()
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
            throw new Error('Database name must be at least 1 character long')
        this.DATABASE_NAME = databaseName
        this.DISPLAY_NAME = `Database:${databaseName}`
        this.start()
    }
    /**
     * Starts the database
     * Adds all key-value pairs to the map
     * @returns {void}
     */
    private start(): void {
        try {
            mc.world.scoreboard.addObjective(this.DATABASE_NAME, this.DISPLAY_NAME)
        } catch { }
        mc.world.scoreboard.getObjective(this.DATABASE_NAME).getParticipants().forEach(data => {
            if (data.displayName.startsWith('db:')) {
                const [key, value] = JSON.parse(this.base36ToValue(data.displayName.split(':')[1]))
                this.DATABASE_MAP.set(key, value)
            }
        })
    }
    /**
     * Saves the database
     * Removes the scoreboard objective and adds it again
     * @returns {void}
     */
    private save(): void {
        mc.world.scoreboard.removeObjective(this.DATABASE_NAME)
        mc.world.scoreboard.addObjective(this.DATABASE_NAME, this.DISPLAY_NAME)
        this.DATABASE_MAP.forEach((value, key) => {
            const database = this.valueToBase36(JSON.stringify([key, value]))
            this.runCommand(`scoreboard players set "db:${database}" "${this.DATABASE_NAME}" 0`)
        })
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
     * @returns {Array<{key: string, value: string}>} The database
     */
    public getDatabase(): Array<{ key: string; value: string }> {
        const data = Object.fromEntries(this.DATABASE_MAP)
        return Object.entries(data).map(([key, value]) => ({ key, value }))
    }
    /**
     * Sets a key-value pair
     * @param {string} key The key
     * @param {string} value The value
     * @returns {void}
     * @example this.set('key', 'value')
     */
    public set(key: string, value: string): void {
        this.DATABASE_MAP.set(key, value)
        this.save()
    }
    /**
     * Clears the database
     * @returns {void}
     * @example this.clear()
     */
    public clear(): void {
        this.DATABASE_MAP.clear()
        this.save()
    }
    /**
     * Deletes a key-value pair
     * @param {string} key The key
     * @returns {void}
     * @example this.delete('key')
     */
    public delete(key: string): void {
        this.DATABASE_MAP.delete(key)
        this.save()
    }
    /**
     * Finds a key-value pair
     * @param {string} key The key
     * @param {string} value The value
     * @returns {void}
     */
    public replace(key: string, value: string): void {
        this.delete(key)
        this.set(key, value)
        this.save()
    }
    /**
     * Gets a value from a key
     * @param key The key
     * @returns {string | undefined} The value
     * @example this.get('key')
     */
    public get(key: string): string | undefined {
        return this.DATABASE_MAP.get(key)
    }
    /**
     * Checks if the database has a key
     * @param {string} key The key
     * @returns {boolean} Whether the database has the key
     * @example this.has('key')
     */
    public has(key: string): boolean {
        return this.DATABASE_MAP.has(key)
    }
    /**
     * Gets the size of the database
     * @returns {number} The size of the database
     */
    public size(): number {
        return this.DATABASE_MAP.size
    }
    /**
     * Gets the entries of the database
     * @returns {IterableIterator<[string, string]>} The entries of the database
     */
    public entries(): IterableIterator<[string, string]> {
        return this.DATABASE_MAP.entries()
    }
    /**
     * Gets the keys of the database
     * @returns {string[]} The keys of the database
     */
    public keys(): string[] {
        return this.getDatabase().map(({ key }) => key)
    }
    /**
     * Gets the values of the database
     * @returns {string[]} The values of the database
     */
    public values(): string[] {
        return this.getDatabase().map(({ value }) => value)
    }
    /**
     * Executes a callback for each key-value pair
     * @param {Function} callback The callback
     * @returns {void}
     */
    public forEach(callback: (key: string, value: string) => void): void {
        this.DATABASE_MAP.forEach(callback)
    }
    /**
     * Maps the database
     * @param {Function} callback The callback
     * @returns {Array<[string, string]>} The mapped database
     */
    public map(callback: (key: string, value: string) => [string, string]): Array<[string, string]> {
        return this.getDatabase().map(({ key, value }) => callback(key, value))
    }
    /**
     * Filters the database
     * @param callback The callback
     * @returns {Array<[string, string]>} The filtered database
     */
    public filter(callback: (key: string, value: string) => boolean): Array<[string, string]> {
        return this.getDatabase().filter(({ key, value }) => callback(key, value)).map(({ key, value }) => [key, value])
    }
}
