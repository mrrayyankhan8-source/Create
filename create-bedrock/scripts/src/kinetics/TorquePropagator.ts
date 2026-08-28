import { Dimension } from "@minecraft/server";
import { KineticNetwork } from "./KineticNetwork.js";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

export class TorquePropagator {
    private networks: Map<string, KineticNetwork> = new Map();
    private nextNetworkId: number = 0;

    public getOrCreateNetworkFor(be: KineticBlockEntity): KineticNetwork {
        if (!be.network) {
            const id = `network_${this.nextNetworkId++}`;
            const network = new KineticNetwork(id);
            this.networks.set(id, network);
            be.network = network;
        }
        return be.network;
    }

    public removeNetwork(networkId: string) {
        this.networks.delete(networkId);
    }
}

export const GlobalTorquePropagator = new TorquePropagator();
