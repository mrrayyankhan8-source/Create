const fs = require('fs');
const path = require('path');

const BP_PATH = path.join(__dirname, '../../behavior_packs/create_bp');
const BLOCKS_PATH = path.join(BP_PATH, 'blocks');
const ITEMS_PATH = path.join(BP_PATH, 'items');

if (!fs.existsSync(BLOCKS_PATH)) fs.mkdirSync(BLOCKS_PATH, { recursive: true });
if (!fs.existsSync(ITEMS_PATH)) fs.mkdirSync(ITEMS_PATH, { recursive: true });

// Core Create Mod Blocks/Items to generate based on Wiki data
const features = [
    { name: "andesite_alloy", type: "item" },
    { name: "shaft", type: "block", properties: { "minecraft:geometry": "geometry.create.shaft" } },
    { name: "cogwheel", type: "block", properties: { "minecraft:geometry": "geometry.create.cogwheel" } },
    { name: "large_cogwheel", type: "block", properties: { "minecraft:geometry": "geometry.create.large_cogwheel" } },
    { name: "gearbox", type: "block", properties: { "minecraft:geometry": "geometry.create.gearbox" } },
    { name: "vertical_gearbox", type: "block", properties: { "minecraft:geometry": "geometry.create.gearbox" } },
    { name: "clutch", type: "block" },
    { name: "gearshift", type: "block" },
    { name: "encased_chain_drive", type: "block" },
    { name: "adjustable_chain_gearshift", type: "block" },
    { name: "water_wheel", type: "block" },
    { name: "large_water_wheel", type: "block" },
    { name: "windmill_bearing", type: "block" },
    { name: "mechanical_bearing", type: "block" },
    { name: "clockwork_bearing", type: "block" },
    { name: "rope_pulley", type: "block" },
    { name: "elevator_pulley", type: "block" },
    { name: "mechanical_piston", type: "block" },
    { name: "sticky_mechanical_piston", type: "block" },
    { name: "piston_extension_pole", type: "block" },
    { name: "gantry_carriage", type: "block" },
    { name: "gantry_shaft", type: "block" },
    { name: "mechanical_press", type: "block" },
    { name: "mechanical_mixer", type: "block" },
    { name: "basin", type: "block" },
    { name: "blaze_burner", type: "block" },
    { name: "depot", type: "block" },
    { name: "mechanical_crafter", type: "block" },
    { name: "mechanical_drill", type: "block" },
    { name: "mechanical_saw", type: "block" },
    { name: "deployer", type: "block" },
    { name: "portable_storage_interface", type: "block" },
    { name: "chute", type: "block" },
    { name: "smart_chute", type: "block" },
    { name: "andesite_funnel", type: "block" },
    { name: "brass_funnel", type: "block" },
    { name: "andesite_tunnel", type: "block" },
    { name: "brass_tunnel", type: "block" },
    { name: "mechanical_arm", type: "block" },
    { name: "mechanical_belt", type: "block" },
    { name: "fluid_pipe", type: "block" },
    { name: "mechanical_pump", type: "block" },
    { name: "fluid_valve", type: "block" },
    { name: "smart_fluid_pipe", type: "block" },
    { name: "fluid_tank", type: "block" },
    { name: "hose_pulley", type: "block" },
    { name: "item_drain", type: "block" },
    { name: "spout", type: "block" },
    { name: "steam_engine", type: "block" },
    { name: "steam_whistle", type: "block" },
    { name: "analog_lever", type: "block" },
    { name: "redstone_link", type: "block" },
    { name: "redstone_contact", type: "block" },
    { name: "pulse_repeater", type: "block" },
    { name: "pulse_extender", type: "block" },
    { name: "powered_latch", type: "block" },
    { name: "powered_toggle_latch", type: "block" },
    { name: "nixie_tube", type: "block" },
    { name: "display_board", type: "block" },
    { name: "display_link", type: "block" },
    { name: "cuckoo_clock", type: "block" },
    { name: "track", type: "block" },
    { name: "train_station", type: "block" },
    { name: "train_controls", type: "block" },
    { name: "train_door", type: "block" },
    { name: "train_trapdoor", type: "block" },
    { name: "train_casing", type: "block" },
    { name: "andesite_casing", type: "block" },
    { name: "brass_casing", type: "block" },
    { name: "copper_casing", type: "block" },
    { name: "shadow_steel_casing", type: "block" },
    { name: "refined_radiance_casing", type: "block" },
    { name: "belt_observer", type: "block" },
    { name: "stock_ticker", type: "block" },
    { name: "stock_link", type: "block" },
    { name: "packager", type: "block" },
    { name: "re_packager", type: "block" },
    { name: "factory_gauge", type: "block" },
    { name: "redstone_requester", type: "block" },
    { name: "package_frogport", type: "block" },
    { name: "postbox", type: "block" },
    { name: "item_hatch", type: "block" },
    { name: "item_vault", type: "block" },
    { name: "brass_ingot", type: "item" },
    { name: "zinc_ingot", type: "item" },
    { name: "zinc_ore", type: "block" },
    { name: "deepslate_zinc_ore", type: "block" },
    { name: "raw_zinc", type: "item" },
    { name: "raw_zinc_block", type: "block" },
    { name: "crushed_iron_ore", type: "item" },
    { name: "crushed_gold_ore", type: "item" },
    { name: "crushed_copper_ore", type: "item" },
    { name: "crushed_zinc_ore", type: "item" },
    { name: "electron_tube", type: "item" },
    { name: "precision_mechanism", type: "item" },
    { name: "sturdy_sheet", type: "item" },
    { name: "rose_quartz", type: "item" },
    { name: "polished_rose_quartz", type: "item" },
    { name: "cinder_flour", type: "item" },
    { name: "blaze_cake_base", type: "item" },
    { name: "blaze_cake", type: "item" },
    { name: "bar_of_chocolate", type: "item" },
    { name: "sweet_roll", type: "item" },
    { name: "honeyed_apple", type: "item" },
    { name: "builders_tea", type: "item" },
    { name: "dough", type: "item" },
    { name: "wheat_flour", type: "item" },
    { name: "sand_paper", type: "item" },
    { name: "red_sand_paper", type: "item" },
    { name: "wrench", type: "item" },
    { name: "engineers_goggles", type: "item" },
    { name: "super_glue", type: "item" },
    { name: "clipboard", type: "item" },
    { name: "minecart_coupling", type: "item" },
    { name: "wand_of_symmetry", type: "item" },
    { name: "extendo_grip", type: "item" },
    { name: "potato_cannon", type: "item" }
];

function generateBlockJson(feature) {
    return {
        "format_version": "1.20.50",
        "minecraft:block": {
            "description": {
                "identifier": `create:${feature.name}`,
                "menu_category": {
                    "category": "items",
                    "group": "itemGroup.name.create"
                }
            },
            "components": {
                "minecraft:destructible_by_mining": { "seconds_to_destroy": 1.5 },
                "minecraft:destructible_by_explosion": { "explosion_resistance": 3.0 },
                ...feature.properties
            }
        }
    };
}

function generateItemJson(feature) {
    return {
        "format_version": "1.20.50",
        "minecraft:item": {
            "description": {
                "identifier": `create:${feature.name}`,
                "menu_category": {
                    "category": "items",
                    "group": "itemGroup.name.create"
                }
            },
            "components": {
                "minecraft:max_stack_size": 64,
                "minecraft:icon": feature.name,
                ...feature.properties
            }
        }
    };
}

features.forEach(feature => {
    if (feature.type === 'block') {
        fs.writeFileSync(path.join(BLOCKS_PATH, `${feature.name}.json`), JSON.stringify(generateBlockJson(feature), null, 4));
    } else {
        fs.writeFileSync(path.join(ITEMS_PATH, `${feature.name}.json`), JSON.stringify(generateItemJson(feature), null, 4));
    }
});

console.log(`Generated ${features.length} Bedrock definitions.`);
