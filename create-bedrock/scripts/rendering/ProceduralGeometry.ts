/**
 * Procedural Geometry Definitions
 * Fallback geometry generation for unavailable assets.
 */

export class ProceduralGeometry {
    /**
     * Generates a basic shaft geometry definition string
     */
    public static generateShaft(): string {
        return JSON.stringify({
            "format_version": "1.16.0",
            "minecraft:geometry": [
                {
                    "description": {
                        "identifier": "geometry.create.shaft",
                        "texture_width": 16,
                        "texture_height": 16,
                        "visible_bounds_width": 2,
                        "visible_bounds_height": 2,
                        "visible_bounds_offset": [0, 0.5, 0]
                    },
                    "bones": [
                        {
                            "name": "shaft",
                            "pivot": [0, 8, 0],
                            "cubes": [
                                { "origin": [-2, 0, -2], "size": [4, 16, 4], "uv": [0, 0] }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Generates a basic gear geometry definition string
     */
    public static generateCogwheel(isLarge: boolean): string {
        const radius = isLarge ? 8 : 4;
        return JSON.stringify({
            "format_version": "1.16.0",
            "minecraft:geometry": [
                {
                    "description": {
                        "identifier": `geometry.create.cogwheel${isLarge ? '_large' : ''}`,
                        "texture_width": 32,
                        "texture_height": 32
                    },
                    "bones": [
                        {
                            "name": "cog",
                            "pivot": [0, 8, 0],
                            "cubes": [
                                // Core shaft
                                { "origin": [-2, 6, -2], "size": [4, 4, 4], "uv": [0, 0] },
                                // Gear plate
                                { "origin": [-radius, 7, -radius], "size": [radius*2, 2, radius*2], "uv": [0, 8] }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}
