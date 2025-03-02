// Preset data structures for different prompts

// 1. Shortest Path Algorithm
const shortestPathData = {
    id: "root",
    text: "Which of the following best describes the balance the Supreme Court has struck between the Establishment Clause and the Free-Exercise Clause? A: Freedom of speech has few exceptions. B: Churches get tax-exempt status. C: Administrative agencies can be dissolved. D: State-sponsored prayer during school is prohibited, but voluntary prayer before/after school is allowed.",
    type: "input",
    children: [
        {
            id: "approach1",
            text: "Understanding the Establishment Clause",
            status: "productive",
            children: [
                {
                    id: "approach1-1",
                    text: "Understanding the Establishment Clause and the Free-Exercise Clause",
                    status: "productive",
                    children: [
                        {
                            id: "approach1-1-1",
                            text: "Analyzing voluntary student-led prayer before school",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "approach1-1-2",
                            text: "Examining state-sponsored prayer prohibitions",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "approach1-2",
                    text: "Analyzing state-sponsored prayer and the Establishment Clause",
                    status: "productive",
                    children: [
                        {
                            id: "approach1-2-1",
                            text: "Government cannot establish religion",
                            status: "productive",
                            children: [
                                {
                                    id: "approach1-2-1-1",
                                    text: "Establishment Clause prevents gov't endorsement",
                                    status: "productive",
                                    children: []
                                },
                                {
                                    id: "approach1-2-1-2",
                                    text: "Citizens are more free with religious constraints on gov't",
                                    status: "rejected",
                                    rejectionReason: "Confuses freedom with constraint",
                                    children: []
                                }
                            ]
                        },
                        {
                            id: "approach1-2-2",
                            text: "Free-Exercise Clause limitations on government",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            id: "approach2",
            text: "Understanding the Free-Exercise Clause",
            status: "productive",
            children: [
                {
                    id: "approach2-1",
                    text: "Evaluating Option A: Freedom of speech exceptions",
                    status: "rejected",
                    rejectionReason: "Not directly relevant to the balance",
                    children: []
                },
                {
                    id: "approach2-2",
                    text: "Evaluating Option B: Tax-exempt status for churches",
                    status: "rejected",
                    rejectionReason: "Not the central issue in the balance",
                    children: []
                }
            ]
        },
        {
            id: "approach3",
            text: "Evaluating remaining options",
            status: "productive",
            children: [
                {
                    id: "approach3-1",
                    text: "Option C: Administrative agency dissolution",
                    status: "rejected",
                    rejectionReason: "Unrelated to religious clauses",
                    children: []
                }
            ]
        },
        {
            id: "conclusion",
            text: "Option D:State-sponsored prayer during school is prohibited, but voluntary prayer before/after school is allowed",
            type: "output",
            children: [
                {
                    id: "verification1",
                    text: "Verify state-sponsored prayer prohibition",
                    status: "productive",
                    children: [
                        {
                            id: "verification1-1",
                            text: "Supreme Court prohibits mandatory prayer in school (Engel v. Vitale)",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "verification1-2",
                            text: "State cannot require prayer even if non-denominational",
                            status: "productive",
                            children: []
                        }
                    ]
                },
                {
                    id: "verification2",
                    text: "Verify voluntary prayer allowance",
                    status: "productive",
                    children: [
                        {
                            id: "verification2-1",
                            text: "Students can pray voluntarily (Tinker v. Des Moines)",
                            status: "productive",
                            children: []
                        },
                        {
                            id: "verification2-2",
                            text: "Prayer clubs allowed before/after school (Equal Access Act)",
                            status: "productive",
                            children: []
                        }
                    ]
                }
            ]
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
    "approach2-2",
    "approach3",
    "approach3-1",
    "conclusion",
    "verification1",
    "verification1-1",
    "verification1-2",
    "verification2",
    "verification2-1",
    "verification2-2"
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