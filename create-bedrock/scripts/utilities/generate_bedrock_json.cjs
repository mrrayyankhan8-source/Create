const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../../../create-bedrock/behavior_packs/create_bp/blocks');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to write JSON files
const writeJson = (filename, data) => {
    const outputPath = path.join(targetDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
    console.log(`Generated JSON at ${outputPath}`);
};

// 1. Shaft Block JSON
const shaftJson = {
    "format_version": "1.20.80",
    "minecraft:block": {
        "description": {
            "identifier": "create:shaft",
            "menu_category": {
                "category": "construction"
            },
            "states": {
                "create:axis": ["y", "x", "z"],
                "create:waterlogged": [false, true]
            }
        },
        "components": {
            "minecraft:geometry": {
                "identifier": "geometry.create.shaft"
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "create_shaft",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 1.0
            },
            "minecraft:collision_box": {
                "origin": [-2, -8, -2],
                "size": [4, 16, 4]
            },
            "minecraft:selection_box": {
                "origin": [-2, -8, -2],
                "size": [4, 16, 4]
            },
            "minecraft:on_interact": {
                "event": "create:on_interact"
            },
            "minecraft:tick": {
                "interval_range": [1, 1],
                "looping": true
            },
            "minecraft:custom_components": ["create:kinetic_block"]
        },
        "events": {
            "create:on_interact": {
                "sequence": [
                    {
                        "condition": "q.is_item_name_any('slot.weapon.mainhand', 'create:metal_girder') && q.block_state('create:axis') != 'y'",
                        "set_block": {
                            "block_type": "create:metal_girder_encased_shaft"
                        }
                    },
                    {
                        "condition": "q.is_item_name_any('slot.weapon.mainhand', 'create:andesite_casing')",
                        "set_block": {
                            "block_type": "create:andesite_encased_shaft"
                        }
                    },
                    {
                        "condition": "q.is_item_name_any('slot.weapon.mainhand', 'create:brass_casing')",
                        "set_block": {
                            "block_type": "create:brass_encased_shaft"
                        }
                    }
                ]
            }
        },
        "permutations": [
            {
                "condition": "q.block_state('create:axis') == 'x'",
                "components": {
                    "minecraft:rotation": [0, 0, 90],
                    "minecraft:collision_box": {
                        "origin": [-8, -2, -2],
                        "size": [16, 4, 4]
                    },
                    "minecraft:selection_box": {
                        "origin": [-8, -2, -2],
                        "size": [16, 4, 4]
                    }
                }
            },
            {
                "condition": "q.block_state('create:axis') == 'z'",
                "components": {
                    "minecraft:rotation": [90, 0, 0],
                    "minecraft:collision_box": {
                        "origin": [-2, -2, -8],
                        "size": [4, 4, 16]
                    },
                    "minecraft:selection_box": {
                        "origin": [-2, -2, -8],
                        "size": [4, 4, 16]
                    }
                }
            }
        ]
    }
};
writeJson('shaft.json', shaftJson);

// 2. Powered Shaft Block JSON (re-implementation of Java's PoweredShaftBlock)
const poweredShaftJson = {
    "format_version": "1.20.80",
    "minecraft:block": {
        "description": {
            "identifier": "create:powered_shaft",
            "menu_category": {
                "category": "construction"
            },
            "states": {
                "create:axis": ["y", "x", "z"],
                "create:waterlogged": [false, true]
            }
        },
        "components": {
            "minecraft:geometry": {
                "identifier": "geometry.create.powered_shaft"
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "create_powered_shaft",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 1.0
            },
            "minecraft:loot": "rtb://minecraft:shaft", // Drops normal shaft just like Java
            "minecraft:collision_box": {
                "origin": [-4, -8, -4], // Eight voxel pole
                "size": [8, 16, 8]
            },
            "minecraft:selection_box": {
                "origin": [-4, -8, -4],
                "size": [8, 16, 8]
            },
            "minecraft:tick": {
                "interval_range": [1, 1], // Simulates tick() check to revert to normal shaft if no steam engine is valid
                "looping": true
            },
            "minecraft:custom_components": ["create:generating_kinetic_block"]
        },
        "permutations": [
            {
                "condition": "q.block_state('create:axis') == 'x'",
                "components": {
                    "minecraft:rotation": [0, 0, 90],
                    "minecraft:collision_box": {
                        "origin": [-8, -4, -4],
                        "size": [16, 8, 8]
                    },
                    "minecraft:selection_box": {
                        "origin": [-8, -4, -4],
                        "size": [16, 8, 8]
                    }
                }
            },
            {
                "condition": "q.block_state('create:axis') == 'z'",
                "components": {
                    "minecraft:rotation": [90, 0, 0],
                    "minecraft:collision_box": {
                        "origin": [-4, -4, -8],
                        "size": [8, 8, 16]
                    },
                    "minecraft:selection_box": {
                        "origin": [-4, -4, -8],
                        "size": [8, 8, 16]
                    }
                }
            }
        ]
    }
};
writeJson('powered_shaft.json', poweredShaftJson);

// 3. Steam Engine Block JSON
const steamEngineJson = {
    "format_version": "1.20.80",
    "minecraft:block": {
        "description": {
            "identifier": "create:steam_engine",
            "menu_category": {
                "category": "construction"
            },
            "states": {
                "create:facing_direction": [0, 1, 2, 3, 4, 5],
                "create:waterlogged": [false, true]
            }
        },
        "components": {
            "minecraft:geometry": {
                "identifier": "geometry.create.steam_engine"
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "create_steam_engine",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 1.0
            },
            "minecraft:on_placed": {
                "event": "create:update_shaft"
            },
            "minecraft:on_player_destroyed": {
                "event": "create:revert_shaft"
            },
            "minecraft:tick": {
                "interval_range": [1, 1],
                "looping": true
            },
            "minecraft:custom_components": ["create:steam_engine_block"]
        },
        "events": {
            "create:update_shaft": {
                // To be handled via Bedrock Scripting (custom component "create:steam_engine_block")
                // since detecting the 2-block gap and validating shaft axis requires code.
            },
            "create:revert_shaft": {
                // Handled in scripting
            }
        }
    }
};
writeJson('steam_engine.json', steamEngineJson);

// 4. Cogwheel JSON
const cogwheelJson = {
    "format_version": "1.20.80",
    "minecraft:block": {
        "description": {
            "identifier": "create:cogwheel",
            "menu_category": {
                "category": "construction"
            },
            "states": {
                "create:axis": ["y", "x", "z"],
                "create:waterlogged": [false, true]
            }
        },
        "components": {
            "minecraft:geometry": {
                "identifier": "geometry.create.cogwheel"
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "create_cogwheel",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 1.0
            },
            "minecraft:collision_box": {
                "origin": [-6, -8, -6],
                "size": [12, 16, 12]
            },
            "minecraft:selection_box": {
                "origin": [-6, -8, -6],
                "size": [12, 16, 12]
            },
            "minecraft:tick": {
                "interval_range": [1, 1],
                "looping": true
            },
            "minecraft:custom_components": ["create:kinetic_block"]
        },
        "permutations": [
            {
                "condition": "q.block_state('create:axis') == 'x'",
                "components": {
                    "minecraft:rotation": [0, 0, 90],
                    "minecraft:collision_box": {
                        "origin": [-8, -6, -6],
                        "size": [16, 12, 12]
                    },
                    "minecraft:selection_box": {
                        "origin": [-8, -6, -6],
                        "size": [16, 12, 12]
                    }
                }
            },
            {
                "condition": "q.block_state('create:axis') == 'z'",
                "components": {
                    "minecraft:rotation": [90, 0, 0],
                    "minecraft:collision_box": {
                        "origin": [-6, -6, -8],
                        "size": [12, 12, 16]
                    },
                    "minecraft:selection_box": {
                        "origin": [-6, -6, -8],
                        "size": [12, 12, 16]
                    }
                }
            }
        ]
    }
};
writeJson('cogwheel.json', cogwheelJson);

// 5. Large Cogwheel JSON
const largeCogwheelJson = {
    "format_version": "1.20.80",
    "minecraft:block": {
        "description": {
            "identifier": "create:large_cogwheel",
            "menu_category": {
                "category": "construction"
            },
            "states": {
                "create:axis": ["y", "x", "z"],
                "create:waterlogged": [false, true]
            }
        },
        "components": {
            "minecraft:geometry": {
                "identifier": "geometry.create.large_cogwheel"
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "create_large_cogwheel",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 1.0
            },
            "minecraft:collision_box": {
                "origin": [-14, -8, -14],
                "size": [28, 16, 28] // Exceeds default bedrock bounds, Bedrock limits box size to 16x16x16 natively for some engines, but using standard representation.
            },
            "minecraft:selection_box": {
                "origin": [-14, -8, -14],
                "size": [28, 16, 28]
            },
            "minecraft:tick": {
                "interval_range": [1, 1],
                "looping": true
            },
            "minecraft:custom_components": ["create:kinetic_block"]
        },
        "permutations": [
            {
                "condition": "q.block_state('create:axis') == 'x'",
                "components": {
                    "minecraft:rotation": [0, 0, 90],
                    "minecraft:collision_box": {
                        "origin": [-8, -14, -14],
                        "size": [16, 28, 28]
                    },
                    "minecraft:selection_box": {
                        "origin": [-8, -14, -14],
                        "size": [16, 28, 28]
                    }
                }
            },
            {
                "condition": "q.block_state('create:axis') == 'z'",
                "components": {
                    "minecraft:rotation": [90, 0, 0],
                    "minecraft:collision_box": {
                        "origin": [-14, -14, -8],
                        "size": [28, 28, 16]
                    },
                    "minecraft:selection_box": {
                        "origin": [-14, -14, -8],
                        "size": [28, 28, 16]
                    }
                }
            }
        ]
    }
};
writeJson('large_cogwheel.json', largeCogwheelJson);
