import { KineticNetwork } from "./KineticNetwork";
import { IKineticBlockEntity, BlockPos } from "./types";

export class KineticBlockManager {
    private static instance: KineticBlockManager;
    private networks: Map<string, KineticNetwork> = new Map();
    private blockEntities: Map<string, IKineticBlockEntity> = new Map();
    private nextNetworkId = 1;

    private constructor() {}

    public static getInstance(): KineticBlockManager {
        if (!KineticBlockManager.instance) {
            KineticBlockManager.instance = new KineticBlockManager();
        }
        return KineticBlockManager.instance;
    }

    public static init(): void {
        console.log("KineticBlockManager initialized.");
    }

    private posToKey(pos: BlockPos): string {
        return `${pos.x},${pos.y},${pos.z}`;
    }

    public registerBlockEntity(be: IKineticBlockEntity): void {
        const key = this.posToKey(be.pos);
        this.blockEntities.set(key, be);
        // Simplified attach logic for now - in real implementation this discovers neighbors
    }

    public removeBlockEntity(pos: BlockPos): void {
        const key = this.posToKey(pos);
        const be = this.blockEntities.get(key);
        if (be) {
            this.blockEntities.delete(key);
            // Needs to find network and remove it
            for (const network of this.networks.values()) {
                if (network.members.has(be)) {
                    network.remove(be);
                    if (network.members.size === 0) {
                        this.networks.delete(network.id);
                    }
                    break;
                }
            }
        }
    }

    public getOrCreateNetworkFor(be: IKineticBlockEntity): KineticNetwork {
        // Simplified - check if it's already in a network
        for (const network of this.networks.values()) {
            if (network.members.has(be)) {
                return network;
            }
        }

        // Create new network
        const networkId = `network_${this.nextNetworkId++}`;
        const network = new KineticNetwork(networkId);
        this.networks.set(networkId, network);
        network.add(be);
        return network;
    }

    public tick(): void {
        // In real Create, this syncs dirty networks and ticks block entities
        for (const network of this.networks.values()) {
            let needsSync = false;
            for (const be of network.members.keys()) {
                if (be.networkDirty) {
                    needsSync = true;
                    be.networkDirty = false;
                }
            }
            if (needsSync) {
                network.sync();
            }
        }
    }

    // Test helper
    public getNetworks(): Map<string, KineticNetwork> {
        return this.networks;
    }
}
