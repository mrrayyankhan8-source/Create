# API Reference

This document outlines the core public APIs used within the Create Bedrock Port's Virtual Algorithmic Backend.

## `KineticNetwork`
The primary mathematical graph representing a cluster of mechanically connected components.
- `addNode(node: KineticNode)`: Adds a node to the graph and triggers recalculation.
- `addConnection(fromNode: KineticNode, toNode: KineticNode, ratio: number)`: Defines a mechanical connection (e.g. gears meshing, shafts connecting) with an optional speed ratio.
- `recalculate()`: The core algorithm. It runs a BFS to propagate rotational speed outward from `Sources`, then calculates total stress vs capacity, and finally updates all node speeds (halting them if overstressed).

## `TickManager`
Handles the simulation loops, decoupling from a strict 20Hz update when performance requires it.
- `registerHighFrequency(callback)`: Fires every tick (ideal for animation/interpolation).
- `registerNormalFrequency(callback)`: Fires every few ticks (ideal for kinetic calculation updates).
- `registerLowFrequency(callback)`: Fires once a second (ideal for cleanup, memory freeing, logging).

## `TrackGraph` (Trains)
Handles the physical layout of train tracks.
- `addNode(id, position)`: Adds a track waypoint.
- `connectNodes(idA, idB)`: Links two waypoints together forming a traversable edge.
- `findPath(startId, endId)`: Runs a BFS pathfinding algorithm to locate the shortest path through the track network.