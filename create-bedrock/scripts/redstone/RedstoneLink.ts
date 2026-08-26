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
            RedstoneNetwork.broadcast(this.frequency1, this.frequency2, power);
        }
    }

    public receivePower(power: number) {
        if (!this.isTransmitter) {
            this.currentPower = power;
            // Update physical block redstone output here via BedrockAdapter
        }
    }

    public getPower(): number {
        return this.currentPower;
    }
}

export class RedstoneNetwork {
    private static links: RedstoneLink[] = [];

    public static register(link: RedstoneLink) {
        this.links.push(link);
    }

    public static broadcast(freq1: string, freq2: string, power: number) {
        for (const link of this.links) {
            if (!link.isTransmitter && link.frequency1 === freq1 && link.frequency2 === freq2) {
                link.receivePower(power);
            }
        }
    }
}
