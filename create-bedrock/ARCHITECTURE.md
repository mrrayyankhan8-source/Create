# Create for Bedrock Architecture

This document describes the high-level architecture of the Create for Bedrock Edition port.
The goal is to provide a robust, performant, and faithful reimplementation of the Create mod, using standard Minecraft Bedrock Edition capabilities (Script API, Entity/Block components).

## Layers

The project is structured in layers, to keep core logic independent from engine specifics where possible.

### 1. Bedrock Adapter Layer (`scripts/core/BedrockAdapter.ts`)
- Isolates platform-specific behavior (e.g., spawning entities, setting blocks, reading dynamic properties).
- This protects the core logic from direct dependencies on `mojang-minecraft` module versions, making it easier to maintain during Minecraft updates.

### 2. Math & Utilities Layer (`scripts/utilities/`)
- Contains mathematical models and utilities (`Vector3`, `Transform`, `Matrix4`, etc.).
- Essential for procedural geometry generation, contraption movement, and collision detection.

### 3. Core Simulation & Ticking (`scripts/core/TickManager.ts`)
- Manages the execution context of the simulation.
- Employs a multi-frequency tick architecture:
  - **High Frequency**: Animation, interpolation, fast-moving items/contraptions.
  - **Normal Frequency**: Kinetic simulation updates, machine processing steps.
  - **Low Frequency**: Network recalculation, cleanup, integrity validation.

### 4. Persistence Layer (`scripts/persistence/`)
- Saves and loads dynamic data (e.g., kinetic network configurations, machine state, unique IDs) across world reloads.
- Uses dynamic properties or data entities.

### 5. Kinetic Engine (`scripts/kinetic/`)
- **KineticNetwork**: A graph representation of connected mechanical components.
- Handles rotational speed, torque/stress calculation, capacities, and network splitting/merging.
- Nodes calculate their speed based on connections and source nodes.

### 6. Contraption Engine (`scripts/contraption/`)
- Handles assembling structures out of blocks.
- Uses math to transform "local" block coordinates to "world" space coordinates to create moving structures.

### 7. Logistics, Fluids & Processing Engines
- Virtualized transport systems (Belts, Chutes) to minimize physical entity counts.
- Modular fluid abstractions and data-driven processing recipes.

### 8. Train Engine (`scripts/trains/`)
- Dedicated subsystem for handling track graphs, pathfinding, schedules, and train physics (acceleration/braking).

### 9. Presentation Layer
- Deals with synchronization between server-authoritative simulation and client-side rendering (particles, animations, procedural geometry).