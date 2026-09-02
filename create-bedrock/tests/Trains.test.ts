import { TrackGraph } from "../scripts/create/trains/graph/TrackGraph.js";
import { TrackNode } from "../scripts/create/trains/graph/TrackNode.js";
import { Train } from "../scripts/create/trains/entity/Train.js";
import { Carriage } from "../scripts/create/trains/entity/Carriage.js";

describe("Trains Foundation", () => {
    it("should build a track graph and move a train carriage", () => {
        const graph = new TrackGraph("graph_1");

        const nodeA = new TrackNode("A", {x: 0, y: 0, z: 0});
        const nodeB = new TrackNode("B", {x: 10, y: 0, z: 0});

        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.connectNodes(nodeA, nodeB, 10);

        expect(graph.edges.get("A")?.length).toBe(1);

        const train = new Train("train_1");
        train.graph = graph;

        const carriage = new Carriage();
        carriage.leadingNode = nodeA;
        train.addCarriage(carriage);

        train.throttle = 1.0;

        train.tick();

        expect(train.speed).toBe(1.0);
        expect(carriage.travelDistance).toBe(1.0);
    });
});
