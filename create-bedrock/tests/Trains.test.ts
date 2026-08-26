import { TrackGraph, TrainSchedule } from "../scripts/trains/TrackGraph";
import { TrainPhysics } from "../scripts/trains/TrainPhysics";
import { Vector3 } from "../scripts/utilities/Math";

describe("Train Simulation", () => {
    test("TrackGraph pathfinding", () => {
        const graph = new TrackGraph();

        // Simple line: A - B - C - D
        graph.addNode("A", new Vector3(0,0,0));
        graph.addNode("B", new Vector3(10,0,0));
        graph.addNode("C", new Vector3(20,0,0));
        graph.addNode("D", new Vector3(30,0,0));

        graph.connectNodes("A", "B");
        graph.connectNodes("B", "C");
        graph.connectNodes("C", "D");

        const path = graph.findPath("A", "D");
        expect(path).toEqual(["A", "B", "C", "D"]);
    });

    test("Train physics movement along path", () => {
        const graph = new TrackGraph();
        graph.addNode("A", new Vector3(0,0,0));
        graph.addNode("B", new Vector3(100,0,0));
        graph.connectNodes("A", "B");

        const train = new TrainPhysics("train1");
        train.maxSpeed = 10;
        train.acceleration = 10; // Reach max speed in 1 second

        train.assignPath(graph, ["A", "B"]);
        train.targetSpeed = train.maxSpeed;

        expect(train.speed).toBe(0);
        expect(train.position).toBe(0);

        // Tick 1 second
        train.tick(1.0);
        expect(train.speed).toBe(10);
        // Using Euler integration for simplicity, distance might just be speed * dt
        // Since we accelerate over time, actual distance is less, but our simple tick just takes current speed
        // Actual tick logic: speed is increased, then distance covered is speed * dt
        expect(train.position).toBe(10);

        // Run until end
        for(let i = 0; i < 9; i++) {
            train.tick(1.0);
        }

        expect(train.currentPathIndex).toBe(1); // Reached B
        expect(train.speed).toBe(0);
    });

    test("Train Schedule execution", () => {
        const graph = new TrackGraph();
        graph.addNode("A", new Vector3(0,0,0));
        graph.addNode("B", new Vector3(10,0,0));
        graph.connectNodes("A", "B");

        const train = new TrainPhysics("train1");
        train.maxSpeed = 10;
        train.acceleration = 100; // Instantly fast for test

        const schedule = new TrainSchedule();
        schedule.entries.push({ stationId: "A", waitDelay: 1.0 });
        schedule.entries.push({ stationId: "B", waitDelay: 1.0 });

        // Start at A, heading to B
        schedule.currentEntryIndex = 1; // 0 is A, 1 is B
        train.assignPath(graph, ["A", "B"]);
        train.targetSpeed = train.maxSpeed;

        // Reach B (10 units away, speed 10)
        train.tick(1.0);
        expect(train.currentPathIndex).toBe(1); // At index 1 of ["A", "B"]
        expect(train.speed).toBe(0);

        // Schedule check
        schedule.tick(1.0, train, graph);
        expect(schedule.isWaiting).toBe(true);
        expect(schedule.waitTimer).toBe(1.0); // B's wait delay (index 1)

        // Wait expires, should route back to A
        schedule.tick(1.0, train, graph);
        expect(schedule.isWaiting).toBe(false);
        expect(train.currentPath).toEqual(["B", "A"]);
        expect(train.targetSpeed).toBe(train.maxSpeed);
    });
});
