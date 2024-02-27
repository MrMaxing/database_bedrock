export default class DynamicProperties<Value extends number | string | boolean | Object> {

    /**
     * @type {string} DYNAMIC_NAME - The name of the dynamic property
     */
    private DYNAMIC_NAME: string

    /**
     * @type {Map<string, Value>} DYNAMIC_MAP - The dynamic property map
     */
    private DYNAMIC_MAP: Map<string, Value>

    /**
     * @param {string} dynamicName - The name of the dynamic property
     */
    constructor(dynamicName: string)

    /**
     * @private save - Save the dynamic property
     */
    private save(): void

    /**
     * @param {Key} key - The key of the dynamic property
     * @param {Value} value - The value of the dynamic property
     * @returns {DynamicProperties} - The dynamic property
     */
    public set(key: string, value: Value): this

    /**
     * @param {Key} key - The key of the dynamic property
     * @returns {boolean} - The result of the delete
     */
    public delete(key: string): boolean

    /**
     * @returns {DynamicProperties} - The dynamic property
     */
    public clear(): this

    /**
     * @param {Key} key - The key of the dynamic property
     * @returns {boolean} - The result of the has
     */
    public has(key: string): boolean

    /**
     * @param {Key} key - The key of the dynamic property
     * @returns {Value} - The value of the dynamic property
     */
    public get(key: string): Value

    /**
     * @param {void} callbackfn - The callback of the dynamic property
     * @returns {void} - The result of the forEach
     */
    public forEach(callbackfn: (value: Value, key: string, map: Map<string, Value>) => void, thisArg?: any): void

    /**
     * @returns {IterableIterator<string>} - The keys of the dynamic property
     */
    public keys(): IterableIterator<string>

    /**
     * @returns {IterableIterator<Value>} - The values of the dynamic property
     */
    public values(): IterableIterator<Value>

    /**
     * @returns {IterableIterator<[string, Value]>} - The entries of the dynamic property
     */
    public entries(): IterableIterator<[string, Value]>

    /**
     * @param {Key} thisArg - The key of the dynamic property
     * @param {Value} callback - The value of the dynamic property
     * @returns {boolean} - The result of the some
     */
    public find(callback: (value: [string, Value], index: number, array: [string, Value][]) => boolean, thisArg?: any): [string, Value]
    /**
     * @param {Key} thisArg - The key of the dynamic property
     * @param {Value} callback - The value of the dynamic property
     * @returns {T[]} - The entries of the dynamic property
     */
    public map<T>(callback: (value: [string, Value], index: number, array: [string, Value][]) => T, thisArg?: any): T[]

    /**
     * @param {Key} thisArg - The key of the dynamic property
     * @param {Value} callback - The value of the dynamic property
     * @returns {[string, Value][]} - The entries of the dynamic property
     */
    public filter(callback: (value: [string, Value], index: number, array: [string, Value][]) => boolean, thisArg?: any): [string, Value][]

    /**
     * @returns {number} - The size of the dynamic property
     */
    public get size(): number

    /**
     * @param {number} bytes - The bytes of the dynamic property
     * @returns {string} - The name of the dynamic property
     */
    public hex(bytes: number): string
}