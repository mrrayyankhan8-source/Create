export interface BlockPos {
    x: number;
    y: number;
    z: number;
}

export interface IKineticBlockEntity {
    pos: BlockPos;
    isSource: () => boolean;
    getGeneratedSpeed: () => number;
    calculateAddedStressCapacity: () => number;
    getTheoreticalSpeed: () => number;
    calculateStressApplied: () => number;
    updateFromNetwork: (maxStress: number, currentStress: number, networkSize: number) => void;
    networkDirty: boolean;
}
