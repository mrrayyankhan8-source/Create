# Port Status

## Completed
* Setup base directories, TS config, JSON generator, and testing.
* Designed Bedrock Architecture, `KineticNetwork`, and `RotationPropagator`.
* Implemented block stress and capacity systems.
* Implemented and tested base moving parts (Shafts, Cogwheels, Gearboxes, Encased Shafts, Belt Inventories).
* Implemented foundational dummy visualization schemas (`BlockPermutation`, geometry state logic)
* Implemented Fluid Networks (BFS propagation via `FluidPropagator`, basic `PumpBlockEntity` logic).
* Implemented preliminary Contraption block assembly via BFS (`ContraptionAssembler`).
* Implemented foundational Track, Station, Train and Signal architectures.
* Fixed critical Bedrock ESM initialization logic related to `@minecraft/server` circular dependencies.
* **Implemented global `RecipeRegistry.ts` replicating Create's JSON-driven recipe behaviors.**
* Integrated Millstone and Mechanical Mixer natively with Bedrock `minecraft:inventory` components.

## Analyzed
* Kinetic mechanics and propagation (`KineticNetwork`, `RotationPropagator`, `TorquePropagator`).
* Basic kinetic blocks (`CogwheelBlock`, `ShaftBlock`, etc).
* Fluid mechanics (`FluidPropagator`, `FluidNetwork`).
* Contraption structures (`Contraption.java`, `ContraptionCollider.java`).
* Train and signal subsystems.
* Processing recipes (`ProcessingRecipeParams.java`, `ProcessingRecipeBuilder.java`).

## Implemented
* Core Kinetics (`KineticBlockEntity`, `KineticNetwork`, `TorquePropagator`, `RotationPropagator`).
* Machinery (`CreativeMotorBlockEntity`, `MillstoneBlockEntity`, `MechanicalMixerBlockEntity`, `CrushingWheelBlockEntity`).
* Moving Structures (`ContraptionAssembler`, `Contraption`).
* Fluid Handling (`FluidPropagator`, `PumpBlockEntity`).
* Trains & Rail (`TrackGraph`, `Train`, `TrainStationBlockEntity`, `TrackSignalBlockEntity`).
* Data/API (`RecipeRegistry`).
* Extensively verified through 33 unit tests (Jest).

## Tested
* All TypeScript files strictly type check (isolatedModules compliance enforced).
* 33/33 Jest unit tests passing spanning Kinetics, Stress, Trains, Contraptions, Belts, and Recipes.

## Remaining
* Implement Advanced Contraption Sub-Networks (e.g. storage and fluid interactions on moving objects).
* Trains UI, Scheduling, and specific bogie visualization models.
* Implement UI/Container bridging for block configuration (e.g. Filter UI, Station UI, Train Schedule UI).
* Bedrock-native rendering hooks for dynamically rotating gears/contraptions (via Dummy Entities + Molang).

## Current Task
* Pre-commit checks and submit branch.

## Limitations
* Create uses a custom rendering pipeline (Flywheel). The Bedrock port utilizes dynamic dummy entities + resource pack animations/Molang as the closest functional equivalent.
* Strict Bedrock QuickJS ES Module context forbids global cross-require dynamic loading unless carefully decoupled.
* Bedrock has no native Fluid API yet, so `minecraft:inventory` with buckets/custom items will serve as intermediate fluid representation until a robust script-level volume API is fully mapped.

## Bugs
* None currently identified.
