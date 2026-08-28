# Create Mod - Bedrock Port Status

## Current Progress
- **Initialization**: Project structure for tracking initialized.
- **Shaft Extraction**: Analyzed and extracted core logic for the Shaft block, Powered Shaft Block, and Steam Engine Block interactions.
- **Generator Script**: Extended `generate_bedrock_json.js` to create representations for `shaft`, `powered_shaft`, and `steam_engine`.
- **Script Components**: Stubs created for custom block components (`create:kinetic_block`, `create:steam_engine_block`).

## Extracted Behaviors Documented

### Shaft (Kinetic Block)
- **Source Files**: `ShaftBlock.java`, `AbstractSimpleShaftBlock.java`, `AbstractShaftBlock.java`, `KineticBlock.java`, `KineticBlockEntity.java`, `KineticNetwork.java`.
- **Properties**:
  - `AXIS` (x, y, z): Orientation of the shaft.
  - `WATERLOGGED` (boolean): Minecraft standard waterlogging support.
- **Interactions**:
  - `Wrenchable`: Can be wrenched.
  - `Bracket`: Can be removed when replacing states (drops bracket item).
  - `Encasing`: Can be encased with casing blocks (e.g., Metal Girder Encased Shaft, Andesite Casing, Brass Casing). Handled by replacing the state to the encased variant on interaction.
- **Kinetic Network**:
  - Represents a node (`SimpleKineticBlockEntity`).
  - Capable of being attached to a `KineticNetwork` (via `TorquePropagator`).
  - Propagates rotation, stress, and capacity.

### Powered Shaft (Generating Kinetic Block)
- **Source Files**: `PoweredShaftBlock.java`, `PoweredShaftBlockEntity.java`
- **Behavior**:
  - Acts as a kinetic source when powered by a Steam Engine.
  - Voxel Shape: `EIGHT_VOXEL_POLE` (thicker than normal shafts).
  - Validates attachment to `SteamEngineBlock` during placement and ticks. If invalidated, replaces itself back to `ShaftBlock`.
  - Determines combined capacity and generated speed dynamically from the Steam Engine it connects to.

### Steam Engine Block
- **Source Files**: `SteamEngineBlock.java`, `SteamEngineBlockEntity.java`
- **Behavior**:
  - Attached to tanks (boilers).
  - Looks for a valid `ShaftBlock` exactly 2 blocks away in the connected direction.
  - When placed, replaces the valid `ShaftBlock` with a `PoweredShaftBlock`.
  - When broken, forces the `PoweredShaftBlock` to check its validity and revert.

## Completed Features
(Pending)

### Cogwheel (Small & Large)
- **Source Files**: `CogWheelBlock.java`, `CogwheelBlockItem.java`, `ICogWheel.java`, `EncasedCogwheelBlock.java`.
- **Properties**:
  - Inherits from `AbstractSimpleShaftBlock`.
  - Properties: `AXIS` (x,y,z), `WATERLOGGED` (boolean).
  - Encased variants have `TOP_SHAFT` and `BOTTOM_SHAFT` to conditionally render the protruding shafts.
- **Interactions & Placement**:
  - Placed diagonally or on shafts using `CogwheelBlockItem` placement helpers (`SmallCogHelper`, `LargeCogHelper`).
  - Cannot overlap invalidly in the kinetic network (prevents placing large and small cogs directly meshing in physically impossible bounds).
  - Shape bounds are different (`SMALL_GEAR` vs `LARGE_GEAR` shapes).
  - Rotational meshes (visually and logically) require an 11.25-degree offset in some axes for large cogwheels (handled via visual component rendering).
- **Network**:
  - Connects to other cogwheels, shafts, and encased machines. Diagonals transfer speed.
  - Generates advancements (`AllAdvancements.COGS`) on complex placements.
