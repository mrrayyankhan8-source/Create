#!/bin/bash
cd create-bedrock

echo "Packaging the Behavior Pack..."
cd behavior_packs
zip -r ../../CreateMod_BP.mcpack create_bp/
cd ..

echo "Packaging the Resource Pack (placeholder)..."
# We don't have a populated resource pack, but we will make a dummy one for the user
mkdir -p resource_packs/create_rp/textures/blocks
mkdir -p resource_packs/create_rp/models/entity
mkdir -p resource_packs/create_rp/animations
mkdir -p resource_packs/create_rp/render_controllers
cat << 'JSON' > resource_packs/create_rp/manifest.json
{
    "format_version": 2,
    "header": {
        "description": "Create Mod (Virtual Backend) Resource Pack Placeholder",
        "name": "Create RP",
        "uuid": "b5db0f81-5d07-4e58-86fb-0d5b1efeb89c",
        "version": [1, 0, 0],
        "min_engine_version": [1, 20, 50]
    },
    "modules": [
        {
            "description": "Create Mod Resources",
            "type": "resources",
            "uuid": "e8e19b6a-9a99-4c12-a7d1-e6e2467d581a",
            "version": [1, 0, 0]
        }
    ]
}
JSON

cd resource_packs
zip -r ../../CreateMod_RP.mcpack create_rp/
cd ..
