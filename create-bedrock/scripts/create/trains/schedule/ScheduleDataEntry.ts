export abstract class ScheduleDataEntry {
    public id: string = "";
    public data: any = {};

    public getId(): string {
        return this.id;
    }

    public abstract writeAdditional(data: any): void;
    public abstract readAdditional(data: any): void;

    public write(): any {
        const outData = JSON.parse(JSON.stringify(this.data));
        this.writeAdditional(outData);
        return {
            Id: this.getId(),
            Data: outData
        };
    }

    public static fromData<T extends ScheduleDataEntry>(
        data: any,
        registry: Map<string, () => T>,
        fallback: () => T
    ): T {
        const id = data.Id;
        const factory = registry.get(id);
        const instance = factory ? factory() : fallback();

        instance.id = id;
        instance.data = data.Data || {};
        instance.readAdditional(instance.data);
        return instance;
    }
}
