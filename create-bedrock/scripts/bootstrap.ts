import { TickManager } from "./core/TickManager";
// import { system } from "@minecraft/server";
// In a real bedrock addon environment, this is how we would hook up the ticking

/**
 * Bootstrap class to initialize the Virtual Backend
 * and bind it to the Bedrock engine event loop.
 */
export class CreateBootstrap {
    private static isRunning = false;

    public static initialize() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.warn("[Create] Initializing Virtual Backend...");

        // Bedrock script API hook:
        // system.runInterval(() => {
        //     TickManager.tick();
        // });

        // For standard testing environments or mock implementations:
        if (typeof setInterval !== "undefined") {
            setInterval(() => {
                TickManager.tick();
            }, 50); // 50ms = 20 ticks per second
        }

        console.warn("[Create] Virtual Backend Running.");
    }
}

// Auto-init for testing purposes.
// In actual Bedrock, you'd call this on world load.
// CreateBootstrap.initialize();
