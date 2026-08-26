/**
 * Persistence Manager
 * Handles saving and loading simulation data across world reloads.
 */

export class PersistenceManager {
    // In a real Bedrock addon, this would use world.setDynamicProperty and world.getDynamicProperty.

    private static cache: Map<string, string> = new Map();

    /**
     * Save arbitrary string data
     */
    public static saveData(key: string, data: string): void {
        this.cache.set(key, data);
        // e.g., world.setDynamicProperty(key, data);
    }

    /**
     * Load arbitrary string data
     */
    public static loadData(key: string): string | undefined {
        return this.cache.get(key);
        // return world.getDynamicProperty(key) as string | undefined;
    }

    /**
     * Delete data
     */
    public static deleteData(key: string): void {
        this.cache.delete(key);
        // world.setDynamicProperty(key, undefined);
    }

    /**
     * Saves JSON serializable objects
     */
    public static saveObject<T>(key: string, obj: T): void {
        try {
            const data = JSON.stringify(obj);
            this.saveData(key, data);
        } catch (e) {
            console.error(`Failed to serialize object for persistence key: ${key}`);
        }
    }

    /**
     * Loads JSON serializable objects
     */
    public static loadObject<T>(key: string): T | undefined {
        const data = this.loadData(key);
        if (!data) return undefined;
        try {
            return JSON.parse(data) as T;
        } catch (e) {
            console.error(`Failed to parse object for persistence key: ${key}`);
            return undefined;
        }
    }
}
