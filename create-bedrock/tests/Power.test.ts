import { SteamBoiler, SteamEngine, BoilerHeatLevel } from "../scripts/kinetic/SteamEngine";

describe("Steam Engine Simulation", () => {
    test("Boiler consumes water and generates steam based on heat", () => {
        const boiler = new SteamBoiler();
        boiler.waterTank.fill("water", 1000);

        // No heat
        boiler.tick(0.05);
        expect(boiler.steamGenerated).toBe(0);
        expect(boiler.waterTank.getAmount()).toBe(1000);

        // Passive heat
        boiler.heatLevel = BoilerHeatLevel.PASSIVE;
        boiler.tick(0.05);
        expect(boiler.waterTank.getAmount()).toBe(990); // consumes 10
        expect(boiler.steamGenerated).toBe(100);

        // Superheated
        boiler.heatLevel = BoilerHeatLevel.SUPERHEATED;
        boiler.tick(0.05);
        expect(boiler.waterTank.getAmount()).toBe(940); // consumes 50
        expect(boiler.steamGenerated).toBe(2000);
    });

    test("Steam engine generates kinetic power from boiler", () => {
        const boiler = new SteamBoiler();
        boiler.waterTank.fill("water", 10000);

        const engine = new SteamEngine("engine1");
        engine.boiler = boiler;

        // Unpowered
        expect(engine.getGeneratedSpeed()).toBe(0);
        expect(engine.getGeneratedCapacity()).toBe(0);

        // Superheated
        boiler.heatLevel = BoilerHeatLevel.SUPERHEATED;
        boiler.tick(0.05); // Generates 2000 steam

        expect(engine.getGeneratedSpeed()).toBe(64);
        expect(engine.getGeneratedCapacity()).toBe(2048);
    });
});
