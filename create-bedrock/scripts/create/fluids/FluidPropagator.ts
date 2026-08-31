import { Dimension, Vector3, Block } from "@minecraft/server";
import { FluidTransportBehaviour } from "./FluidTransportBehaviour.js";
import { PumpBlockEntity } from "./PumpBlockEntity.js";

/**
 * Global manager mapping positions to FluidTransportBehaviours.
 */
export class FluidPipeManager {
    public static pipes: Map<string, FluidTransportBehaviour> = new Map();
    public static pumps: Map<string, PumpBlockEntity> = new Map();

    public static getPosKey(dimension: Dimension, pos: Vector3): string {
        return `${dimension.id}:${pos.x},${pos.y},${pos.z}`;
    }

    public static getPipe(dimension: Dimension, pos: Vector3): FluidTransportBehaviour | undefined {
        return this.pipes.get(this.getPosKey(dimension, pos));
    }
}

/**
 * Port of com.simibubi.create.content.fluids.FluidPropagator
 */
export class FluidPropagator {

    public static propagateChangedPipe(dimension: Dimension, pipePos: Vector3): void {
        const frontier: { distance: number, pos: Vector3 }[] = [];
        const visited: Set<string> = new Set();
        const discoveredPumps: { pump: PumpBlockEntity, targetFace: string }[] = [];

        frontier.push({ distance: 0, pos: pipePos });

        const maxRange = 16; // getPumpRange() usually config driven (e.g. 16)

        while (frontier.length > 0) {
            const entry = frontier.shift()!;
            const currentPos = entry.pos;
            const key = FluidPipeManager.getPosKey(dimension, currentPos);

            if (visited.has(key)) continue;
            visited.add(key);

            const pipe = FluidPipeManager.getPipe(dimension, currentPos);
            if (!pipe) continue;

            pipe.wipePressure();

            const connections = this.getPipeConnections(pipe);
            for (const direction of connections) {
                const targetPos = this.getOffsetPos(currentPos, direction);
                const targetKey = FluidPipeManager.getPosKey(dimension, targetPos);

                const pump = FluidPipeManager.pumps.get(targetKey);
                if (pump) {
                    if (pump.getAxis() === this.getAxisFromDirection(direction)) {
                        discoveredPumps.push({ pump: pump, targetFace: this.getOppositeDirection(direction) });
                    }
                    continue;
                }

                if (visited.has(targetKey)) continue;

                const targetPipe = FluidPipeManager.getPipe(dimension, targetPos);
                if (!targetPipe) continue;

                if (entry.distance >= maxRange && !targetPipe.hasAnyPressure()) {
                    continue;
                }

                if (targetPipe.canHaveFlowToward(this.getOppositeDirection(direction))) {
                    frontier.push({ distance: entry.distance + 1, pos: targetPos });
                }
            }
        }

        // Notify discovered pumps to distribute pressure
        for (const pd of discoveredPumps) {
            pd.pump.distributePressureTo(pd.targetFace);
        }
    }

    public static getPipeConnections(pipe: FluidTransportBehaviour): string[] {
        const list: string[] = [];
        const dirs = ["up", "down", "north", "south", "east", "west"];
        for (const d of dirs) {
            if (pipe.canHaveFlowToward(d)) list.push(d);
        }
        return list;
    }

    private static getOffsetPos(pos: Vector3, dir: string): Vector3 {
        let x = pos.x, y = pos.y, z = pos.z;
        if (dir === "up") y += 1;
        if (dir === "down") y -= 1;
        if (dir === "north") z -= 1;
        if (dir === "south") z += 1;
        if (dir === "east") x += 1;
        if (dir === "west") x -= 1;
        return { x, y, z };
    }

    private static getOppositeDirection(dir: string): string {
        switch (dir) {
            case "east": return "west";
            case "west": return "east";
            case "up": return "down";
            case "down": return "up";
            case "south": return "north";
            case "north": return "south";
            default: return "up";
        }
    }

    private static getAxisFromDirection(dir: string): string {
        if (dir === "east" || dir === "west") return "x";
        if (dir === "up" || dir === "down") return "y";
        if (dir === "south" || dir === "north") return "z";
        return "y";
    }
}
