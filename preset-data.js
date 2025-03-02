// Preset data structures for different prompts

// 1. Shortest Path Algorithm
const shortestPathData = {
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
                            text: "Dijkstra's algorithm for non-negative weights",
                            status: "productive",
                            children: [
                                {
                                    id: "approach1-2-1-1",
                                    text: "Min-heap: O(E log V)",
                                    status: "productive",
                                    children: []
                                },
                                {
                                    id: "approach1-2-1-2",
                                    text: "Array: O(V²)",
                                    status: "rejected",
                                    children: []
                                }
                            ]
                        },
                        {
                            id: "approach1-2-2",
                            text: "Bellman-Ford for negative weights: O(VE)",
                            status: "productive",
                            children: []
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
                }
            ]
        },
        {
            id: "approach3",
            text: "What about dynamic programming?",
            status: "productive",
            children: [
                {
                    id: "approach3-1",
                    text: "Floyd-Warshall for all pairs: O(V³)",
                    status: "productive",
                    children: []
                }
            ]
        },
        {
            id: "conclusion",
            text: "For efficiency, Dijkstra's with min-heap is optimal for most cases",
            type: "output",
            children: []
        }
    ]
};

// 2. Chess Move Analysis
const chessData = {
    id: "root",
    text: "What's the best next move in this chess position: e4 e5, Nf3 Nc6, Bb5?",
    type: "input",
    children: [
        {
            id: "opening",
            text: "This is the Ruy Lopez opening (Spanish Game)",
            status: "productive",
            children: [
                {
                    id: "option1",
                    text: "The main line continues with a6",
                    status: "productive",
                    children: [
                        {
                            id: "option1-1",
                            text: "After a6, White typically plays Ba4",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "option1-2",
                            text: "Black can then play Nf6 developing the knight",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "option2",
                    text: "Black could play d6 (Steinitz Defense)",
                    status: "rejected",
                    children: [
                        {
                            id: "option2-1",
                            text: "This is solid but slightly passive",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "option3",
                    text: "Black could play Nf6 immediately (Berlin Defense)",
                    status: "productive",
                    children: [
                        {
                            id: "option3-1",
                            text: "Very solid and drawish at high levels",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "tactical",
            text: "Let me check for tactical opportunities",
            status: "productive",
            children: [
                {
                    id: "tactical1",
                    text: "Could Black try Nd4 attacking the knight?",
                    status: "rejected",
                    children: [
                        {
                            id: "tactical1-1",
                            text: "No, White would win a piece with Nxe5",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "tactical2",
                    text: "Is there a knight fork possibility?",
                    status: "rejected",
                    children: [
                        {
                            id: "tactical2-1",
                            text: "No immediate tactics available",
                            status: "rejected",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "conclusion",
            text: "Best move is a6, challenging the bishop and preparing for a solid position",
            type: "output",
            children: []
        }
    ]
};

// 3. Math Problem Solving
const mathData = {
    id: "root",
    text: "How would you solve the equation: 3x² + 8x - 5 = 0?",
    type: "input",
    children: [
        {
            id: "method1",
            text: "Let's use the quadratic formula",
            status: "productive",
            children: [
                {
                    id: "method1-1",
                    text: "Identify a=3, b=8, c=-5",
                    status: "productive",
                    children: []
                },
                {
                    id: "method1-2",
                    text: "x = (-b ± √(b² - 4ac)) / 2a",
                    status: "productive",
                    children: [
                        {
                            id: "method1-2-1",
                            text: "x = (-8 ± √(64 - 4(3)(-5))) / 6",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "method1-2-2",
                            text: "x = (-8 ± √(64 + 60)) / 6",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "method1-2-3",
                            text: "x = (-8 ± √124) / 6",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "method1-2-4",
                            text: "x = (-8 ± 11.14) / 6",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "method2",
            text: "Let's try factoring",
            status: "productive",
            children: [
                {
                    id: "method2-1",
                    text: "Find factors of -15 that sum to 8",
                    status: "productive",
                    children: [
                        {
                            id: "method2-1-1",
                            text: "15 and -1? No, sum is 14",
                            status: "rejected",
                            children: []
                        },
                        {
                            id: "method2-1-2",
                            text: "10 and -5? No, sum is 5",
                            status: "rejected",
                            children: []
                        },
                        {
                            id: "method2-1-3",
                            text: "-3 and 5? No, product is -15, not -5",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "method2-2",
                    text: "Direct factoring is difficult here",
                    status: "rejected",
                    children: []
                }
            ]
        },
        {
            id: "result",
            text: "Using quadratic formula: x ≈ 0.51 or x ≈ -3.18",
            type: "output",
            children: []
        }
    ]
};

// 4. Medical Diagnosis
const medicalData = {
    id: "root",
    text: "What are possible diagnoses for symptoms of fever, headache, and fatigue?",
    type: "input",
    children: [
        {
            id: "category1",
            text: "Common viral infections",
            status: "productive",
            children: [
                {
                    id: "category1-1",
                    text: "Influenza (flu)",
                    status: "productive",
                    children: [
                        {
                            id: "category1-1-1",
                            text: "Sudden onset, high fever, muscle aches",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "category1-2",
                    text: "Common cold",
                    status: "rejected",
                    children: [
                        {
                            id: "category1-2-1",
                            text: "Fever typically mild or absent",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "category1-3",
                    text: "COVID-19",
                    status: "productive",
                    children: [
                        {
                            id: "category1-3-1",
                            text: "May include loss of taste/smell",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "category2",
            text: "Bacterial infections",
            status: "productive",
            children: [
                {
                    id: "category2-1",
                    text: "Streptococcal pharyngitis (strep throat)",
                    status: "rejected",
                    children: [
                        {
                            id: "category2-1-1",
                            text: "Typically includes sore throat",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "category2-2",
                    text: "Bacterial pneumonia",
                    status: "productive",
                    children: [
                        {
                            id: "category2-2-1",
                            text: "Often includes cough and chest pain",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "category3",
            text: "Other conditions",
            status: "productive",
            children: [
                {
                    id: "category3-1",
                    text: "Chronic fatigue syndrome",
                    status: "rejected",
                    children: [
                        {
                            id: "category3-1-1",
                            text: "Fever not typically present",
                            status: "rejected",
                            children: []
                        }
                    ]
                },
                {
                    id: "category3-2",
                    text: "Mono (infectious mononucleosis)",
                    status: "productive",
                    children: [
                        {
                            id: "category3-2-1",
                            text: "Often with swollen lymph nodes",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "conclusion",
            text: "Most likely flu, COVID-19, or mono, but medical testing needed for confirmation",
            type: "output",
            children: []
        }
    ]
};

// Define reasoning steps for each preset
const shortestPathSteps = [
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
    "approach2",
    "approach2-1",
    "approach3",
    "approach3-1",
    "conclusion"
];

const chessSteps = [
    "root",
    "opening",
    "option1",
    "option1-1",
    "option1-2",
    "option2",
    "option2-1",
    "option3",
    "option3-1",
    "tactical",
    "tactical1",
    "tactical1-1",
    "tactical2",
    "tactical2-1",
    "conclusion"
];

const mathSteps = [
    "root",
    "method1",
    "method1-1",
    "method1-2",
    "method1-2-1",
    "method1-2-2",
    "method1-2-3",
    "method1-2-4",
    "method2",
    "method2-1",
    "method2-1-1",
    "method2-1-2",
    "method2-1-3",
    "method2-2",
    "result"
];

const medicalSteps = [
    "root",
    "category1",
    "category1-1",
    "category1-1-1",
    "category1-2",
    "category1-2-1",
    "category1-3",
    "category1-3-1",
    "category2",
    "category2-1",
    "category2-1-1",
    "category2-2",
    "category2-2-1",
    "category3",
    "category3-1",
    "category3-1-1",
    "category3-2",
    "category3-2-1",
    "conclusion"
];

// Map for easy lookup
const presetDataMap = {
    "shortest-path": {
        data: shortestPathData,
        steps: shortestPathSteps
    },
    "chess-move": {
        data: chessData,
        steps: chessSteps
    },
    "math-problem": {
        data: mathData,
        steps: mathSteps
    },
    "medical-diagnosis": {
        data: medicalData,
        steps: medicalSteps
    }
};

// Default data to display initially
let sampleReasoningData = shortestPathData;
let reasoningSteps = shortestPathSteps; 