import fs from 'fs';
import path from 'path';

export function generateBlockJson(identifier, outputDir) {
    const json = {
        "format_version": "1.20.10",
        "minecraft:block": {
            "description": {
                "identifier": identifier,
                "menu_category": {
                    "category": "construction"
                }
            },
            "components": {
                "minecraft:destructible_by_mining": {
                    "seconds_to_destroy": 1.5
                },
                "minecraft:custom_components": [
                    "create:kinetic_block"
                ]
            }
        }
    };

    const fileName = identifier.replace('create:', '') + '.json';
    const outputPath = path.join(outputDir, fileName);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
    console.log(`Generated ${outputPath}`);
}
