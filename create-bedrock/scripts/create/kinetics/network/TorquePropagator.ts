import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { KineticNetwork } from "./KineticNetwork.js";

/**
 * Port of com.simibubi.create.content.kinetics.TorquePropagator
 */
export class TorquePropagator {
    private static networks: Map<string, Map<number, KineticNetwork>> = new Map();
    private static nextNetworkId = 0;

    public static getOrCreateNetworkFor(be: KineticBlockEntity): KineticNetwork {
        let id = be.networkId;
        const dimensionId = be.block.dimension.id;

        let map = this.networks.get(dimensionId);
        if (!map) {
            map = new Map();
            this.networks.set(dimensionId, map);
        }

        if (id === null || id === undefined) {
            id = this.nextNetworkId++;
            be.networkId = id;
        }

        let network = map.get(id);
        if (!network) {
            network = new KineticNetwork(id, dimensionId);
            map.set(id, network);
        }

        return network;
    }

    public static removeNetwork(dimensionId: string, id: number): void {
        const map = this.networks.get(dimensionId);
        if (map) {
            map.delete(id);
        }
    }
}
