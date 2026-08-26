import { BaseKineticNode } from "../kinetic/KineticNode";
import { FluidTank } from "../fluids/Tank";

export enum BoilerHeatLevel {
    NONE = 0,
    PASSIVE = 1, // Campfire
    HEATED = 2,  // Blaze burner
    SUPERHEATED = 3 // Superheated blaze burner
}

export class SteamBoiler {
    public waterTank: FluidTank;
    public heatLevel: BoilerHeatLevel = BoilerHeatLevel.NONE;

    public attachedEngines: number = 0;

    // Steam generation per tick
    public steamGenerated: number = 0;

    constructor() {
        this.waterTank = new FluidTank("boiler_tank", 10000);
    }

    public tick(deltaTime: number) {
        if (this.heatLevel === BoilerHeatLevel.NONE) {
            this.steamGenerated = 0;
            return;
        }

        // Logic based on Create Mod Steam Engine mechanics:
        // Requires Water and Heat to produce steam.

        // Example logic:
        // Passive: 10 mb water -> 100 steam
        // Heated: 20 mb water -> 500 steam
        // Superheated: 50 mb water -> 2000 steam

        let waterNeeded = 0;
        let steamYield = 0;

        switch (this.heatLevel) {
            case BoilerHeatLevel.PASSIVE: waterNeeded = 10; steamYield = 100; break;
            case BoilerHeatLevel.HEATED: waterNeeded = 20; steamYield = 500; break;
            case BoilerHeatLevel.SUPERHEATED: waterNeeded = 50; steamYield = 2000; break;
        }

        waterNeeded *= (deltaTime / 0.05); // Scale by tick duration

        if (this.waterTank.getAmount() >= waterNeeded) {
            this.waterTank.drain(waterNeeded);
            this.steamGenerated = steamYield;
        } else {
            this.steamGenerated = 0;
        }
    }
}

export class SteamEngine extends BaseKineticNode {

    public boiler: SteamBoiler | null = null;

    constructor(id: string) {
        super(id);
        this.isSource = true;
    }

    getGeneratedSpeed(): number {
        if (!this.boiler) return 0;

        // Speed depends on boiler steam output
        if (this.boiler.steamGenerated > 1000) return 64;
        if (this.boiler.steamGenerated > 100) return 32;
        if (this.boiler.steamGenerated > 0) return 16;

        return 0;
    }

    getGeneratedCapacity(): number {
        if (!this.boiler) return 0;

        // Capacity depends on steam output as well
        if (this.boiler.steamGenerated > 1000) return 2048;
        if (this.boiler.steamGenerated > 100) return 1024;
        if (this.boiler.steamGenerated > 0) return 512;

        return 0;
    }
}
