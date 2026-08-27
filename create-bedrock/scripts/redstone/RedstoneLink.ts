import { Location } from "../core/BedrockAdapter";

export class RedstoneLink {
    public id: string;
    public location: Location;
    public frequency1: string;
    public frequency2: string;
    public isTransmitter: boolean = false;

    private currentPower: number = 0;

    constructor(id: string, location: Location, freq1: string, freq2: string) {
        this.id = id;
        this.location = location;
        this.frequency1 = freq1;
        this.frequency2 = freq2;
    }

    public setPower(power: number) {
        if (this.isTransmitter && this.currentPower !== power) {
            this.currentPower = power;
            RedstoneNetwork.recalculate(this.frequency1, this.frequency2);
        }
    }

    public receivePower(power: number) {
        if (!this.isTransmitter) {
            this.currentPower = power;
            // Update physical block redstone output here via BedrockAdapter
            // BedrockAdapter.setBlockRedstonePower(this.location, power);
        }
    }

    public getPower(): number {
        return this.currentPower;
    }
}

export class RedstoneNetwork {
    private static links: Map<string, RedstoneLink> = new Map();

    public static register(link: RedstoneLink) {
        this.links.set(link.id, link);
        this.recalculate(link.frequency1, link.frequency2);
    }

    public static unregister(linkId: string) {
        const link = this.links.get(linkId);
        if (link) {
            this.links.delete(linkId);
            this.recalculate(link.frequency1, link.frequency2);
        }
    }

    public static getNetworkPower(freq1: string, freq2: string): number {
        let maxPower = 0;
        for (const link of this.links.values()) {
            if (link.isTransmitter && link.frequency1 === freq1 && link.frequency2 === freq2) {
                if (link.getPower() > maxPower) {
                    maxPower = link.getPower();
                }
            }
        }
        return maxPower;
    }

    public static recalculate(freq1: string, freq2: string) {
        // Redstone link receivers emit signal with the level of the strongest transmitter of the same frequency
        const networkPower = this.getNetworkPower(freq1, freq2);

        for (const link of this.links.values()) {
            if (!link.isTransmitter && link.frequency1 === freq1 && link.frequency2 === freq2) {
                link.receivePower(networkPower);
            }
        }
    }

    public static getLinks(): RedstoneLink[] {
        return Array.from(this.links.values());
    }

    public static clear() {
        this.links.clear();
    }
}
