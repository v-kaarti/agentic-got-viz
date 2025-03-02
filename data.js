// Sample data structure for a language model's Tree of Thoughts
const sampleReasoningData = {
    id: "root",
    text: "What is the most efficient algorithm for finding the shortest path in a graph?",
    type: "input",
    children: [
        {
            id: "approach1",
            text: "Let me consider different algorithms for finding shortest paths",
            status: "productive",
            children: [
                {
                    id: "approach1-1",
                    text: "For unweighted graphs, BFS is optimal",
                    status: "productive",
                    children: [
                        {
                            id: "approach1-1-1",
                            text: "BFS has O(V+E) time complexity",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "approach1-1-2",
                            text: "BFS only works when all edges have equal weight",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "approach1-2",
                    text: "For weighted graphs, we need different algorithms",
                    status: "productive",
                    children: [
                        {
                            id: "approach1-2-1",
                            text: "Dijkstra's algorithm works for non-negative weights",
                            status: "productive",
                            children: [
                                {
                                    id: "approach1-2-1-1",
                                    text: "Using min-heap implementation: O(E log V)",
                                    status: "productive",
                                    children: []
                                },
                                {
                                    id: "approach1-2-1-2",
                                    text: "Using array implementation: O(V²)",
                                    status: "rejected",
                                    children: []
                                }
                            ]
                        },
                        {
                            id: "approach1-2-2",
                            text: "Bellman-Ford handles negative weights: O(VE)",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "approach1-2-3",
                            text: "A* algorithm is faster with heuristics",
                            status: "rejected",
                            children: [
                                {
                                    id: "approach1-2-3-1",
                                    text: "But requires domain knowledge for heuristics",
                                    status: "rejected",
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "approach2",
            text: "Could we use a modified DFS approach?",
            status: "rejected",
            children: [
                {
                    id: "approach2-1",
                    text: "DFS doesn't guarantee shortest paths",
                    status: "rejected",
                    children: []
                },
                {
                    id: "approach2-2",
                    text: "Would require visiting all paths which is inefficient",
                    status: "rejected",
                    children: []
                }
            ]
        },
        {
            id: "approach3",
            text: "What about dynamic programming solutions?",
            status: "productive",
            children: [
                {
                    id: "approach3-1",
                    text: "Floyd-Warshall for all pairs shortest paths",
                    status: "productive",
                    children: [
                        {
                            id: "approach3-1-1",
                            text: "Time complexity: O(V³)",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "approach3-2",
                    text: "But this is overkill for single-source problems",
                    status: "rejected",
                    children: []
                }
            ]
        },
        {
            id: "conclusion",
            text: "For general efficiency, Dijkstra's with min-heap is optimal for most cases",
            type: "output",
            children: []
        }
    ]
};

// Define the reasoning steps for animation (traversal order)
const reasoningSteps = [
    "root",
    "approach1",
    "approach1-1",
    "approach1-1-1",
    "approach1-1-2",
    "approach1-2",
    "approach1-2-1",
    "approach1-2-1-1",
    "approach1-2-1-2",
    "approach1-2-2",
    "approach1-2-3",
    "approach1-2-3-1",
    "approach2",
    "approach2-1",
    "approach2-2",
    "approach3",
    "approach3-1",
    "approach3-1-1",
    "approach3-2",
    "conclusion"
];

// Optional: Simplify some parts of the data for better visualization
// For example, you could reduce some of the deeper nested children
// or combine some nodes to create a more balanced tree

// For very wide trees, you might want to change the treeLayout in tree.js to:
// this.treeLayout = d3.tree()
//     .nodeSize([80, 100]) // Fixed node size instead of overall dimensions
//     .separation((a, b) => a.parent === b.parent ? 1.2 : 2);