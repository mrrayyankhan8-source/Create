import { Dimension } from "@minecraft/server";
import { Train } from "../entity/Train.js";
import { Schedule } from "./Schedule.js";
import { DiscoveredPath } from "../graph/TrackGraph.js";

/**
 * Partial port of com.simibubi.create.content.trains.schedule.ScheduleRuntime
 */
export class ScheduleRuntime {
    public train: Train;
    public schedule: Schedule | null = null;

    public isAutoSchedule: boolean = false;
    public paused: boolean = false;
    public completed: boolean = false;
    public state: RuntimeState = RuntimeState.PRE_TRANSIT;
    public currentEntry: number = 0;

    public ticksInTransit: number = 0;
    public conditionProgress: number[][] = [];
    public conditionContext: any[][] = [];

    constructor(train: Train) {
        this.train = train;
    }

    public setSchedule(schedule: Schedule | null, auto: boolean): void {
        this.schedule = schedule;
        this.isAutoSchedule = auto;
        this.currentEntry = 0;
        this.paused = false;
        this.completed = false;
        if (schedule !== null) {
            this.currentEntry = schedule.savedProgress;
        }
        this.state = RuntimeState.PRE_TRANSIT;
        this.conditionProgress = [];
        this.conditionContext = [];
    }

    public getSchedule(): Schedule | null {
        return this.schedule;
    }

    public tick(dimension: Dimension): void {
        if (!this.schedule) return;
        if (this.paused) return;
        if (this.completed) return;

        if (this.schedule.entries.length === 0) {
            this.completed = true;
            return;
        }

        if (this.currentEntry >= this.schedule.entries.length) {
            if (this.schedule.cyclic) {
                this.currentEntry = 0;
            } else {
                this.completed = true;
                return;
            }
        }

        // This is a simplified port of the tick machine
        const entry = this.schedule.entries[this.currentEntry];
        if (this.state === RuntimeState.PRE_TRANSIT) {
            // Attempt to start instruction
            const path = entry.instruction.start(this, dimension);
            // In a real port this sets train navigation path
            this.state = RuntimeState.IN_TRANSIT;
            this.ticksInTransit = 0;
        } else if (this.state === RuntimeState.IN_TRANSIT) {
            this.ticksInTransit++;
            // For now, assume train immediately arrives if navigation is mocked
            // In full port, wait for train navigation to finish
            if (this.train.navigationCompleted) {
                this.state = RuntimeState.POST_TRANSIT;
                this.initConditions(entry);
            }
        } else if (this.state === RuntimeState.POST_TRANSIT) {
            if (this.tickConditions(dimension)) {
                this.state = RuntimeState.PRE_TRANSIT;
                this.currentEntry++;
                this.schedule.savedProgress = this.currentEntry;
            }
        }
    }

    private initConditions(entry: any) {
        this.conditionProgress = [];
        this.conditionContext = [];
        for (let i = 0; i < entry.conditions.length; i++) {
            this.conditionProgress[i] = [];
            this.conditionContext[i] = [];
            for (let j = 0; j < entry.conditions[i].length; j++) {
                this.conditionProgress[i][j] = 0;
                this.conditionContext[i][j] = {};
            }
        }
    }

    private tickConditions(dimension: Dimension): boolean {
        const entry = this.schedule!.entries[this.currentEntry];
        if (!entry.instruction.supportsConditions() || entry.conditions.length === 0) {
            return true;
        }

        // Each column is an OR condition, each element in column is an AND condition
        for (let i = 0; i < entry.conditions.length; i++) {
            const column = entry.conditions[i];
            let columnComplete = true;
            for (let j = 0; j < column.length; j++) {
                const condition = column[j];
                const context = this.conditionContext[i][j];
                const completed = condition.tickCompletion(dimension, this.train, context);
                if (!completed) {
                    columnComplete = false;
                }
            }
            if (columnComplete) {
                return true;
            }
        }
        return false;
    }
}

export enum RuntimeState {
    PRE_TRANSIT,
    IN_TRANSIT,
    POST_TRANSIT
}
