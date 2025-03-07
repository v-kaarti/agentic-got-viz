class TreeVisualization {
    constructor(containerId, data, traversalType = "sequential") {
        this.containerId = containerId;
        this.data = data;
        this.traversalType = traversalType;
        this.currentStepIndex = -1;
        this.highlightedNodes = new Set();
        this.animationInterval = null;
        this.animationSpeed = 5;
        this.selectedNode = null;
        this.zoomBehavior = null;
        this.traversalDirection = "down";
        
        setTimeout(() => this.initialize(), 100);
    }
    
    initialize() {
        const container = document.getElementById(this.containerId);
        const containerRect = container.getBoundingClientRect();
        
        this.width = containerRect.width;
        this.height = containerRect.height;
        
        // Create info panel before the visualization
        this.createInfoPanel();
        
        // Remove any existing SVG
        d3.select(`#${this.containerId} svg`).remove();
        
        // Create new SVG
        const svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
        
        // Create a container for node details
        d3.select(`#${this.containerId}`)
            .append("div")
            .attr("class", "node-details-container")
            .style("display", "none");
        
        // Setup zoom behavior
        this.zoomBehavior = d3.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", (event) => {
                mainGroup.attr("transform", event.transform);
            });
        
        svg.call(this.zoomBehavior);
        
        // Add a background rect for catching clicks
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", () => this.resetZoom());
        
        // Add overlay for shadowing background when node is selected
        // Put it BEFORE the main group so it doesn't cover the nodes
        const overlay = svg.append("rect")
            .attr("class", "shadow-overlay")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "rgba(0, 0, 0, 0.45)")
            .style("opacity", 0)
            .style("pointer-events", "none");
        
        // Create main group for the tree
        const mainGroup = svg.append("g");
        this.svg = mainGroup;
        
        // Create hierarchy
        this.root = d3.hierarchy(this.data);
        
        // Calculate layout with significantly improved spacing
        const maxNodesPerLevel = {};
        this.root.each(node => {
            if (!maxNodesPerLevel[node.depth]) {
                maxNodesPerLevel[node.depth] = 0;
            }
            maxNodesPerLevel[node.depth]++;
        });
        
        const maxNodesInLevel = Math.max(...Object.values(maxNodesPerLevel));
        const nodeWidth = 220; // Further increased for more horizontal space
        const levelHeight = 140; // Further increased for more vertical space
        
        // Calculate minimum width needed based on content
        const minTreeWidth = Math.max(this.width * 0.9, maxNodesInLevel * nodeWidth * 1.2); // Add 20% extra space
        const treeHeight = (this.root.height + 1) * levelHeight;
        
        this.treeLayout = d3.tree()
            .size([minTreeWidth, treeHeight])
            .separation((a, b) => {
                // Dynamic separation based on text length
                const aLength = a.data.text ? a.data.text.length : 0;
                const bLength = b.data.text ? b.data.text.length : 0;
                
                // Base separation plus additional for long text
                const baseSeparation = a.parent === b.parent ? 2.5 : 3.5;
                const textFactor = Math.max(0, (aLength + bLength - 30) / 100);
                
                return baseSeparation + textFactor;
            });
        
        this.treeLayout(this.root);
        
        // Check for overlaps and adjust if needed
        this.fixNodeOverlap();
        
        // Center the tree
        const centerOffset = (this.width / 2) - (minTreeWidth / 2);
        mainGroup.attr("transform", `translate(${centerOffset}, 40)`);
        
        // Updated initial transform with better zoom and centering
        this.initialTransform = d3.zoomIdentity
            .translate(centerOffset, this.height / 6)  // Better vertical centering
            .scale(1.2);  // Increased scale from 0.8 to 1.2
        
        // Draw links
        const linkGroup = mainGroup.append("g")
            .attr("class", "links");
        
        linkGroup.selectAll(".link")
            .data(this.root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y));
        
        // Draw nodes
        const nodeGroup = mainGroup.append("g")
            .attr("class", "nodes");
        
        const nodeGroups = nodeGroup.selectAll(".node")
            .data(this.root.descendants())
            .enter()
            .append("g")
            .attr("class", d => {
                let classes = "node";
                if (d.data.type === "input" || d.data.type === "output") {
                    classes += ` ${d.data.type}`;
                } else {
                    classes += ` node-neutral`;
                }
                return classes;
            })
            .attr("id", d => `node-${d.data.id}`)
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                event.stopPropagation();
                this.showNodeDetails(d, event);
            });
        
        // Add shapes
        nodeGroups.each(function(d) {
            const node = d3.select(this);
            
            if (d.data.type === "input" || d.data.type === "output") {
                node.append("ellipse")
                    .attr("rx", 90)
                    .attr("ry", 35)
                    .attr("class", "node-ellipse");
            } else {
                const rectWidth = 160;
                const rectHeight = 44;
                
                node.append("rect")
                    .attr("width", rectWidth)
                    .attr("height", rectHeight)
                    .attr("x", -rectWidth / 2)
                    .attr("y", -rectHeight / 2)
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("class", "node-rect");
            }
        });
        
        // Add text
        nodeGroups.append("text")
            .attr("class", "node-text")
            .attr("dy", 5)
            .each(function(d) {
                const text = d3.select(this);
                const maxLength = d.data.type === "input" || d.data.type === "output" ? 35 : 25;
                
                let displayText = d.data.text;
                if (displayText.length > maxLength) {
                    const truncated = displayText.substring(0, maxLength);
                    const lastSpace = truncated.lastIndexOf(' ');
                    if (lastSpace > maxLength * 0.7) {
                        displayText = truncated.substring(0, lastSpace) + "...";
                    } else {
                        displayText = truncated + "...";
                    }
                }
                text.text(displayText);
            });
        
        // Set up traversal steps
        this.traversalSteps = this.traversalType === "parallel" ? 
            this.generateBFSSteps() : this.generateDFSSteps();
        
        // Initial zoom
        svg.call(this.zoomBehavior.transform, this.initialTransform);
    }
    
    showNodeDetails(node) {
        // Get the details container
        const detailsContainer = d3.select(`#${this.containerId} .node-details-container`);
        
        // Create HTML for the details panel
        let detailsHTML = `
            <div class="details-header">
                <h3>Node Details</h3>
                <button class="details-close">&times;</button>
            </div>
            <div class="details-content">
                <p class="details-text">${node.data.text}</p>
                <div class="details-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Type:</span>
                        <span>${node.data.type || 'thought'}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Status:</span>
                        <span>${node.data.status || 'neutral'}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Depth:</span>
                        <span>${node.depth}</span>
                    </div>
                    ${node.data.rejectionReason ? 
                      `<div class="metadata-item rejection-reason">
                          <span class="metadata-label">Rejection Reason:</span>
                          <span>${node.data.rejectionReason}</span>
                       </div>` : ''}
                </div>
            </div>
        `;
        
        // Update and show the details container
        detailsContainer.html(detailsHTML)
            .style("display", "block")
            .style("opacity", 0)
            .transition()
            .duration(300)
            .style("opacity", 1);
        
        // Add event listener to close button
        detailsContainer.select(".details-close")
            .on("click", () => {
                detailsContainer.transition()
                    .duration(300)
                    .style("opacity", 0)
                    .on("end", function() {
                        d3.select(this).style("display", "none");
                    });
                
                // Remove any focus highlighting
                d3.selectAll(".node").classed("individual-focus", false);
            });
    }
    
    resetZoom() {
        // Reset all visual states
        d3.selectAll(".node")
            .classed("selected", false)
            .classed("individual-focus", false)
            .classed("dimmed", false)
            .classed("current", false)
            .classed("visited", false)
            .classed("deleted", false)
            .classed("faded-out", false)
            .classed("upward-highlighted", false);
        
        // Reset ALL inline styles for all node elements
        d3.selectAll(".node, .node rect, .node ellipse, .node-text")
            .style("fill", null)
            .style("stroke", null)
            .style("stroke-dasharray", null)
            .style("stroke-width", null)
            .style("text-decoration", null)
            .style("opacity", 1);
        
        // Reset link styles
        d3.selectAll(".links path")
            .style("opacity", 1)
            .style("stroke-dasharray", null);
        
        // Remove completion checkmark
        d3.select(`#${this.containerId} .completion-checkmark`).remove();
        
        this.selectedNode = null;
        
        // Hide shadow overlay
        d3.select(`#${this.containerId} .shadow-overlay`)
            .transition()
            .duration(500)
            .style("opacity", 0);
        
        // Hide details
        d3.select(`#${this.containerId} .node-details-container`)
            .transition()
            .duration(300)
            .style("opacity", 0)
            .on("end", function() {
                d3.select(this).style("display", "none");
            });
        
        // Reset zoom
        d3.select(`#${this.containerId} svg`)
            .transition()
            .duration(750)
            .call(this.zoomBehavior.transform, this.initialTransform);
        
        // Reset traversal state
        this.highlightedNodes.clear();
        this.currentStepIndex = -1;
        this.traversalDirection = "down"; // Reset direction
        this.upwardSteps = null; // Clear upward steps
    }
    
    // Add methods for different traversal patterns
    initializeTraversalSteps() {
        // Group nodes by level for parallel (BFS) traversal
        this.traversalSteps = this.generateBFSSteps();
    }
    
    generateBFSSteps() {
        // Group nodes by level for parallel traversal
        const nodesByLevel = [];
        this.root.eachBefore(node => {
            if (!nodesByLevel[node.depth]) {
                nodesByLevel[node.depth] = [];
            }
            nodesByLevel[node.depth].push(node.data.id);
        });
        
        // Return layers, with nodes at the same level processed in parallel
        return nodesByLevel;
    }
    
    generateDFSSteps() {
        // Sequential DFS traversal
        const steps = [];
        this.root.eachBefore(node => {
            steps.push([node.data.id]); // Each step is a single node
        });
        return steps;
    }
    
    showTooltip(event, d) {
        this.tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        this.tooltip.html(d.data.text)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px");
    }
    
    hideTooltip() {
        this.tooltip.transition()
            .duration(300)
            .style("opacity", 0);
    }
    
    // Modified to handle BFS layers with the new color scheme
    stepForward() {
        // If we've reached the end of downward traversal, switch to upward traversal
        if (this.traversalDirection === "down" && 
            this.currentStepIndex === this.traversalSteps.length - 1) {
            
            // Switch to upward traversal
            this.traversalDirection = "up";
            this.currentStepIndex = -1; // Reset step index for upward traversal
            
            // Mark all nodes as visited from previous downward traversal
            d3.selectAll(".node.current").classed("current", false)
                                         .classed("visited", true);
                                     
            return this.stepUpward(); // Start the upward traversal
        }
        
        // Handle normal downward traversal
        if (this.traversalDirection === "down" && 
            this.currentStepIndex < this.traversalSteps.length - 1) {
            
            // Clear individual focus when transitioning to step mode
            if (this.selectedNode) {
                this.selectedNode = null;
                d3.selectAll(".node")
                    .classed("selected", false)
                    .classed("individual-focus", false);
            }
            
            this.currentStepIndex++;
            const nodeIds = this.traversalSteps[this.currentStepIndex];
            
            // Remove 'current' class from previous layer
            d3.selectAll(".node.current").classed("current", false)
                                         .classed("visited", true);
            
            // Get all nodes in this layer
            const nodesInLayer = [];
            const deletedNodesInLayer = [];
            
            nodeIds.forEach(nodeId => {
                this.root.each(node => {
                    if (node.data.id === nodeId) {
                        nodesInLayer.push(node);
                        if (node.data.status === 'rejected' || node.data.deleted) {
                            deletedNodesInLayer.push(node);
                        }
                    }
                });
            });
            
            if (nodesInLayer.length > 0) {
                // Reset dimmed state for all nodes
                d3.selectAll(".node").classed("dimmed", true);
                
                // Mark all nodes in this layer properly
                nodeIds.forEach(nodeId => {
                    this.root.each(node => {
                        if (node.data.id === nodeId) {
                            const nodeElement = d3.select(`#node-${nodeId}`);
                            
                            if (node.data.status === 'rejected' || node.data.deleted) {
                                // For deleted nodes, show deletion effect
                                nodeElement.classed("deleted", true)
                                          .classed("dimmed", false);
                                this.showDeletionEffect(node);
                            } else {
                                // For normal nodes, mark as current
                                nodeElement.classed("current", true)
                                          .classed("dimmed", false);
                            }
                            this.highlightedNodes.add(nodeId);
                        }
                    });
                });
                
                // Calculate center of these nodes for zooming
                let centerX = 0, centerY = 0, count = 0;
                nodesInLayer.forEach(node => {
                    centerX += node.x;
                    centerY += node.y;
                    count++;
                });
                
                if (count > 0) {
                    centerX /= count;
                    centerY /= count;
                    
                    // Zoom to this layer
                    const scale = 1.5;
                    const x = -centerX * scale + this.width / 2;
                    const y = -centerY * scale + this.height / 2;
                    
                    d3.select(`#${this.containerId} svg`)
                        .transition()
                        .duration(750)
                        .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
                        
                    // Show layer details
                    this.showLayerDetails(nodesInLayer, this.currentStepIndex, deletedNodesInLayer);
                }
                
                return true;
            }
        }
        
        // Handle upward traversal if in that phase
        if (this.traversalDirection === "up") {
            return this.stepUpward();
        }
        
        return false;
    }
    
    // New method for upward traversal steps
    stepUpward() {
        // For upward traversal, we go from max depth to root
        const upwardSteps = [];
        let maxDepth = 0;
        
        // Find max depth of tree
        this.root.each(node => {
            maxDepth = Math.max(maxDepth, node.depth);
        });
        
        // If we've already created the steps, use them
        if (!this.upwardSteps) {
            // Create arrays of nodes at each depth level
            const nodesByDepth = Array(maxDepth + 1).fill().map(() => []);
            
            // Populate the arrays
            this.root.each(node => {
                // Only include productive nodes that weren't deleted
                if ((node.data.status === 'productive' || node.data.type === 'input' || node.data.type === 'output') && 
                    !node.data.deleted && !d3.select(`#node-${node.data.id}`).classed("faded-out")) {
                    nodesByDepth[node.depth].push(node.data.id);
                }
            });
            
            // Create upward steps from deepest to root
            this.upwardSteps = [];
            for (let depth = maxDepth; depth >= 0; depth--) {
                if (nodesByDepth[depth].length > 0) {
                    this.upwardSteps.push(nodesByDepth[depth]);
                }
            }
        }
        
        // Check if we have more steps
        if (this.currentStepIndex < this.upwardSteps.length - 1) {
            this.currentStepIndex++;
            const nodeIds = this.upwardSteps[this.currentStepIndex];
            
            // Reset all highlighted states
            d3.selectAll(".node")
                .classed("upward-highlighted", false)
                .classed("dimmed", true);
            
            // Get nodes in this upward layer
            const nodesInLayer = [];
            
            nodeIds.forEach(nodeId => {
                this.root.each(node => {
                    if (node.data.id === nodeId) {
                        nodesInLayer.push(node);
                    }
                });
            });
            
            if (nodesInLayer.length > 0) {
                // Highlight nodes in this layer with a lighter, thinner gold outline
                // but keep their current green color
                nodeIds.forEach(nodeId => {
                    const nodeElement = d3.select(`#node-${nodeId}`);
                    
                    // Add upward highlighting class
                    nodeElement.classed("upward-highlighted", true)
                              .classed("dimmed", false);
                    
                    // Flash effect - just add the gold outline without changing fill color
                    const nodeShape = nodeElement.select("rect, ellipse");
                    
                    // Apply a subtle flash effect with gold outline
                    nodeShape.transition()
                        .duration(300)
                        .style("stroke", "#F0E68C") // Light gold/khaki color
                        .style("stroke-width", "2px") // Thinner stroke
                        .transition()
                        .duration(300)
                        .style("stroke-opacity", 0.7) // Fade a bit
                        .transition()
                        .duration(300)
                        .style("stroke-opacity", 1) // Back to full opacity
                        .style("stroke", "#F0E68C") // Keep light gold color
                        .style("stroke-width", "2px"); // Keep thinner stroke
                });
                
                // Calculate center of these nodes for zooming
                let centerX = 0, centerY = 0, count = 0;
                nodesInLayer.forEach(node => {
                    centerX += node.x;
                    centerY += node.y;
                    count++;
                });
                
                if (count > 0) {
                    centerX /= count;
                    centerY /= count;
                    
                    // Zoom to this layer
                    const scale = 1.5;
                    const x = -centerX * scale + this.width / 2;
                    const y = -centerY * scale + this.height / 2;
                    
                    d3.select(`#${this.containerId} svg`)
                        .transition()
                        .duration(750)
                        .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
                        
                    // Show upward layer details
                    this.showUpwardLayerDetails(nodesInLayer);
                }
                
                // Show completion checkmark on the final step (root)
                if (this.currentStepIndex === this.upwardSteps.length - 1) {
                    this.showCompletionCheckmark();
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    // Show upward layer details
    showUpwardLayerDetails(nodesInLayer) {
        const detailsContainer = d3.select(`#${this.containerId} .node-details-container`);
        
        // Calculate depth - all nodes should be at same depth
        const depth = nodesInLayer[0].depth;
        
        // Get layer title based on depth
        let layerTitle;
        if (depth === 0) {
            layerTitle = "Final Summary";
        } else if (depth === 1) {
            layerTitle = "High-Level Synthesis";
        } else {
            layerTitle = `Depth ${depth} Integration`;
        }
        
        // Create node list
        let nodesList = "";
        nodesInLayer.forEach(node => {
            nodesList += `<li class="status-productive">${node.data.text}</li>`;
        });
        
        // Create details HTML
        let detailsHTML = `
            <div class="details-header">
                <h3>Upward Integration: ${layerTitle}</h3>
                <button class="details-close">&times;</button>
            </div>
            <div class="details-content">
                <p>Processing completed at depth ${depth}</p>
                <p>Productive pathways: ${nodesInLayer.length}</p>
                <div class="details-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Phase:</span>
                        <span class="status-productive">Synthesis</span>
                    </div>
                </div>
                <div class="layer-nodes">
                    <h4>Validated nodes:</h4>
                    <ul class="nodes-list">
                        ${nodesList}
                    </ul>
                </div>
            </div>
        `;
        
        detailsContainer.html(detailsHTML)
            .style("display", "block")
            .style("opacity", 0)
            .transition()
            .duration(300)
            .style("opacity", 1);
        
        // Add close button event listener
        detailsContainer.select(".details-close")
            .on("click", () => this.resetZoom());
    }
    
    // Show completion checkmark when traversal is complete
    showCompletionCheckmark() {
        const container = d3.select(`#${this.containerId}`);
        
        // Create checkmark in top right corner
        const checkmark = container.append("div")
            .attr("class", "completion-checkmark")
            .html("✓")
            .style("position", "absolute")
            .style("top", "20px")
            .style("right", "20px")
            .style("font-size", "60px")
            .style("opacity", "0");
        
        // Create a flashing effect for the checkmark
        checkmark.transition()
            .duration(300)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .transition()
            .duration(200)
            .style("opacity", 1);
    }
    
    showDeletionEffect(node) {
        const nodeElement = d3.select(`#node-${node.data.id}`);
        const container = d3.select(`#${this.containerId}`);
        
        // Create scales in top right corner
        const scalesIndicator = container.append("div")
            .attr("class", "scales-indicator")
            .html("⚖️")
            .style("position", "absolute")
            .style("top", "20px")
            .style("right", "20px")
            .style("font-size", "60px") // Very large scales, node-sized
            .style("opacity", "0");
        
        // Create a flashing effect for the scales
        scalesIndicator.transition()
            .duration(300)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .transition()
            .delay(400)
            .duration(400)
            .style("opacity", 0)
            .on("end", function() {
                d3.select(this).remove();
            });
        
        // Still fade the link to show disconnection
        if (node.parent) {
            // Find the link that connects this node to its parent
            const linkElement = d3.select(`#${this.containerId} svg .links path`)
                .filter(function(d) {
                    return d.source && d.target && 
                           d.source.data.id === node.parent.data.id && 
                           d.target.data.id === node.data.id;
                });
            
            // Animate the link disappearing
            linkElement
                .transition()
                .delay(800)
                .duration(800)
                .style("opacity", 0.2)
                .style("stroke-dasharray", "5,3");
        }
        
        // Add a text notification near the node
        const notification = container
            .append("div")
            .attr("class", "deletion-notice")
            .html(node.data.rejectionReason || "Path rejected")
            .style("left", (this.width/2 + node.x * 1.3 - 100) + "px")
            .style("top", (this.height/3 + node.y * 1.3 + 30) + "px");
        
        // Show and then fade out the notification
        notification.transition()
            .duration(500)
            .style("opacity", 1)
            .transition()
            .delay(2500)
            .duration(500)
            .style("opacity", 0)
            .remove();
        
        // Fade out the deleted node
        nodeElement
            .transition()
            .delay(800) 
            .duration(1000)
            .style("opacity", 0.4)
            .on("end", function() {
                d3.select(this).classed("faded-out", true);
            });
        
        // Also fade out any children of the deleted node
        this.fadeOutSubtree(node, 1200);
    }
    
    // New method to fade out a subtree
    fadeOutSubtree(node, delay) {
        if (node.children) {
            node.children.forEach(child => {
                // Fade out the child node
                d3.select(`#node-${child.data.id}`)
                    .transition()
                    .delay(delay)
                    .duration(800)
                    .style("opacity", 0.4)
                    .on("end", function() {
                        // Add faded-out class for tracking state
                        d3.select(this).classed("faded-out", true);
                    });
                
                // Fade out the link to this child
                const linkElement = d3.select(`#${this.containerId} svg .links path`)
                    .filter(function(d) {
                        return d.source && d.target && 
                               d.source.data.id === node.data.id && 
                               d.target.data.id === child.data.id;
                    });
                
                linkElement
                    .transition()
                    .delay(delay - 200)
                    .duration(800)
                    .style("opacity", 0.2)
                    .style("stroke-dasharray", "5,3");
                
                // Recursively fade out this child's subtree
                this.fadeOutSubtree(child, delay + 200);
            });
        }
    }
    
    // New method to show details for an entire layer
    showLayerDetails(nodesInLayer, layerIndex, deletedNodes = []) {
        // Get the details container
        const detailsContainer = d3.select(`#${this.containerId} .node-details-container`);
        
        // Calculate status counts
        const statusCounts = {
            productive: 0,
            neutral: 0,
            rejected: 0
        };
        
        nodesInLayer.forEach(node => {
            const status = node.data.status || "neutral";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        // Get the layer title - use the first node text to represent the layer
        const layerDepth = nodesInLayer[0].depth;
        let layerTitle = "Root";
        
        if (layerDepth > 0) {
            // Use the parent's name to describe the layer
            const parent = nodesInLayer[0].parent;
            if (parent && parent.data.text) {
                layerTitle = parent.data.text.length > 30 
                    ? parent.data.text.substring(0, 30) + "..." 
                    : parent.data.text;
            }
        }
        
        // Create HTML for node list
        let nodesList = "";
        nodesInLayer.forEach(node => {
            const status = node.data.status || "neutral";
            const isDeleted = node.data.status === 'rejected' || node.data.deleted;
            
            if (isDeleted) {
                // Add strikethrough for deleted nodes
                nodesList += `<li class="status-${status}" style="text-decoration: line-through; opacity: 0.7;">
                    ${node.data.text} <span class="delete-reason">(${node.data.rejectionReason || "Rejected"})</span>
                </li>`;
            } else {
                nodesList += `<li class="status-${status}">${node.data.text}</li>`;
            }
        });
        
        // Create details HTML with X button (not gavel)
        let detailsHTML = `
            <div class="details-header">
                <h3>Layer Details: ${layerTitle}</h3>
                <button class="details-close">&times;</button>
            </div>
            <div class="details-content">
                <p>Layer depth: ${nodesInLayer[0].depth}</p>
                <p>Nodes in layer: ${nodesInLayer.length}</p>
                ${deletedNodes.length > 0 ? `<p>Rejected paths: ${deletedNodes.length}</p>` : ''}
                <div class="details-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Status counts:</span>
                        <span>Productive: ${statusCounts.productive}, 
                              Neutral: ${statusCounts.neutral}, 
                              Rejected: ${statusCounts.rejected}</span>
                    </div>
                </div>
                <div class="layer-nodes">
                    <h4>Nodes in this layer:</h4>
                    <ul class="nodes-list">
                        ${nodesList}
                    </ul>
                </div>
            </div>
        `;
        
        detailsContainer.html(detailsHTML)
            .style("display", "block")
            .style("opacity", 0)
            .transition()
            .duration(300)
            .style("opacity", 1);
        
        // Add close button event listener
        detailsContainer.select(".details-close")
            .on("click", () => this.resetZoom());
    }
    
    highlightNode(nodeId) {
        // Select the node
        const nodeElement = d3.select(`#node-${nodeId}`);
        
        // Add to tracked set without changing appearance
        this.highlightedNodes.add(nodeId);
        
        // Don't highlight links anymore
        // Previously we were highlighting links with a 'productive' class
    }
    
    reset() {
        // Stop any running animation
        this.stopAnimation();
        
        // Reset traversal state
        this.traversalDirection = "down";
        this.currentStepIndex = -1;
        this.upwardSteps = null;
        this.highlightedNodes.clear();
        
        // Reset all node states
        d3.selectAll(".node")
            .classed("current", false)
            .classed("visited", false)
            .classed("dimmed", false)
            .classed("upward-highlighted", false)
            .classed("individual-focus", false)
            .classed("selected", false)
            .classed("deleted", false)
            .classed("faded-out", false);
        
        // Reset styles
        d3.selectAll(".node rect, .node ellipse, .node-text")
            .style("stroke", null)
            .style("stroke-width", null)
            .style("text-decoration", null)
            .style("opacity", 1);
        
        // Reset link styles
        d3.selectAll(".links path")
            .style("opacity", 1)
            .style("stroke-dasharray", null);
        
        // Hide details panel
        d3.select(`#${this.containerId} .node-details-container`)
            .transition()
            .duration(300)
            .style("opacity", 0)
            .on("end", function() {
                d3.select(this).style("display", "none");
            });
        
        // Remove completion checkmark
        d3.select(`#${this.containerId} .completion-checkmark`).remove();
        
        // Hide shadow overlay
        d3.select(`#${this.containerId} .shadow-overlay`)
            .transition()
            .duration(500)
            .style("opacity", 0);
        
        // Reset zoom to initial transform (top view)
        d3.select(`#${this.containerId} svg`)
            .transition()
            .duration(750)
            .call(this.zoomBehavior.transform, this.initialTransform);
    }
    
    fixNodeOverlap() {
        // Get all nodes
        const nodes = this.root.descendants();
        
        // Simple collision detection and resolution
        const minDistance = 180; // Minimum horizontal distance between node centers
        
        // Sort nodes by depth to process level by level
        const nodesByLevel = {};
        nodes.forEach(node => {
            if (!nodesByLevel[node.depth]) {
                nodesByLevel[node.depth] = [];
            }
            nodesByLevel[node.depth].push(node);
        });
        
        // For each level, ensure nodes don't overlap
        Object.values(nodesByLevel).forEach(levelNodes => {
            // Sort by x position
            levelNodes.sort((a, b) => a.x - b.x);
            
            // Ensure minimum spacing
            for (let i = 1; i < levelNodes.length; i++) {
                const prev = levelNodes[i - 1];
                const curr = levelNodes[i];
                
                const actualDistance = curr.x - prev.x;
                
                if (actualDistance < minDistance) {
                    // Move current node to the right
                    const shift = minDistance - actualDistance;
                    curr.x += shift;
                    
                    // Also move all descendants
                    this.shiftSubtree(curr, shift);
                }
            }
        });
    }
    
    shiftSubtree(node, shiftX) {
        // Move all descendants by the same amount
        if (node.children) {
            node.children.forEach(child => {
                child.x += shiftX;
                this.shiftSubtree(child, shiftX);
            });
        }
    }

    // Update playAnimation to handle animation state correctly
    startAnimation() {
        // Clear any existing animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // Get the speed value (1-10) and convert to milliseconds (2000ms to 200ms)
        const speed = document.getElementById('speed-control').value;
        const interval = 2000 - (speed - 1) * 180;

        // Start new animation
        this.animationInterval = setInterval(() => {
            const hasMoreSteps = this.stepForward();
            
            // If no more steps, stop animation
            if (!hasMoreSteps) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                
                // Reset Play button to play state
                const playButton = document.getElementById('play-btn');
                playButton.innerHTML = '<i class="ph ph-play"></i> Play Animation';
                playButton.classList.remove('button-warning');
                playButton.classList.add('button-success');
            }
        }, interval);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    setSpeed(speed) {
        // If animation is running, restart it with new speed
        const wasPlaying = !!this.animationInterval;
        if (wasPlaying) {
            this.stopAnimation();
            this.startAnimation();
        }
    }

    /**
     * Create a visualization from a serialized tree format
     * @param {string} containerId - The container element ID
     * @param {Object} serializedData - The serialized tree data
     * @param {string} traversalType - The traversal type ('parallel' or 'sequential')
     * @returns {TreeVisualization} - A new tree visualization instance
     */
    static fromSerializedData(containerId, serializedData, traversalType = "parallel") {
        // Convert serialized format to hierarchical format
        const hierarchicalData = TreeVisualization.convertToHierarchical(serializedData);
        
        // Create and return a new visualization
        return new TreeVisualization(containerId, hierarchicalData, traversalType);
    }

    /**
     * Convert from serialized format to hierarchical format
     * @param {Object} serializedData - The serialized tree data
     * @returns {Object} - Hierarchical tree data for D3
     */
    static convertToHierarchical(serializedData) {
        // Handle different serialization formats
        if (serializedData.nodes && serializedData.edges) {
            // Handle node/edge format
            return TreeVisualization.convertFromNodeEdgeFormat(serializedData);
        } else if (Array.isArray(serializedData)) {
            // Handle flat array with parent pointers
            return TreeVisualization.convertFromFlatArray(serializedData);
        } else {
            // Assume data is already in hierarchical format
            return serializedData;
        }
    }

    /**
     * Convert from node/edge format to hierarchical format
     * @param {Object} data - The serialized data with nodes and edges
     * @returns {Object} - Hierarchical tree data for D3
     */
    static convertFromNodeEdgeFormat(data) {
        const { nodes, edges } = data;
        
        // Create a map of all nodes by ID
        const nodesMap = {};
        nodes.forEach(node => {
            nodesMap[node.id] = {
                ...node,
                children: []
            };
        });
        
        // Connect nodes based on edges
        edges.forEach(edge => {
            const parent = nodesMap[edge.parent];
            const child = nodesMap[edge.child];
            
            if (parent && child) {
                parent.children.push(child);
            }
        });
        
        // Find the root node (node with no parents)
        const rootId = findRootId(nodesMap, edges);
        return nodesMap[rootId];
        
        function findRootId(nodesMap, edges) {
            // Get all node IDs
            const nodeIds = Object.keys(nodesMap).map(id => parseInt(id));
            
            // Get all child IDs
            const childIds = edges.map(edge => edge.child);
            
            // Find node IDs that are not children (root nodes)
            const rootIds = nodeIds.filter(id => !childIds.includes(id));
            
            // Return the first root ID, or the first node ID if no root found
            return rootIds.length > 0 ? rootIds[0] : nodeIds[0];
        }
    }

    /**
     * Convert from flat array with parent pointers to hierarchical format
     * @param {Array} data - The serialized data as flat array
     * @returns {Object} - Hierarchical tree data for D3
     */
    static convertFromFlatArray(data) {
        // Create a copy of the data to avoid modifying original
        const nodes = JSON.parse(JSON.stringify(data));
        
        // Create a map for quick node lookup
        const nodeMap = {};
        nodes.forEach((node, index) => {
            // Ensure each node has an ID
            if (!node.id) node.id = index + 1;
            
            // Initialize children array
            node.children = [];
            
            // Add to map
            nodeMap[node.id] = node;
        });
        
        // Create hierarchy
        let root = null;
        nodes.forEach(node => {
            if (node.parentId) {
                // This is a child node
                const parent = nodeMap[node.parentId];
                if (parent) {
                    parent.children.push(node);
                }
            } else {
                // This is a root node
                root = node;
            }
        });
        
        return root;
    }

    /**
     * Create a tree from a simple text array
     * @param {string} containerId - The container element ID
     * @param {Array} textArray - Array of node texts
     * @param {Array} parentIndices - Array of parent indices (0-based, -1 for root)
     * @param {Array} nodeTypes - Optional array of node types
     * @param {Array} nodeStatuses - Optional array of node statuses
     * @param {Array} rejectionReasons - Optional array of rejection reasons
     * @returns {TreeVisualization} - A new tree visualization instance
     */
    static fromTextArray(containerId, textArray, parentIndices, nodeTypes = [], nodeStatuses = [], rejectionReasons = []) {
        // Create nodes array
        const nodes = textArray.map((text, index) => {
            return {
                id: index + 1,
                text: text,
                parentId: parentIndices[index] >= 0 ? parentIndices[index] + 1 : null,
                type: nodeTypes[index] || (index === 0 ? 'input' : 'thought'),
                status: nodeStatuses[index] || 'neutral',
                deleted: nodeStatuses[index] === 'rejected',
                rejectionReason: rejectionReasons[index] || null
            };
        });
        
        // Convert to hierarchical format
        const hierarchicalData = TreeVisualization.convertFromFlatArray(nodes);
        
        // Create and return visualization
        return new TreeVisualization(containerId, hierarchicalData);
    }

    // Update playAnimation to simulate clicking the Step button
    playAnimation() {
        // Get the Play Animation button
        const playButton = document.getElementById('play-btn');
        // Get the Step button
        const stepButton = document.getElementById('step-btn');
        
        if (this.animationInterval) {
            // If animation is running, stop it
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            
            // Reset Play button text and icon to play state
            playButton.innerHTML = '<i class="ph ph-play"></i> Play Animation';
        } else {
            // Start animation by simulating clicks on the Step button
            this.animationInterval = setInterval(() => {
                // Simulate clicking the Step button
                stepButton.click();
                
                // Check if we've reached the end of traversal
                if ((this.traversalDirection === "down" && this.currentStepIndex >= this.traversalSteps.length - 1) &&
                    (this.traversalDirection === "up" && this.upwardSteps && this.currentStepIndex >= this.upwardSteps.length - 1)) {
                    // If we're at the end of both traversals, stop the animation
                    clearInterval(this.animationInterval);
                    this.animationInterval = null;
                    
                    // Reset Play button to play state
                    playButton.innerHTML = '<i class="ph ph-play"></i> Play Animation';
                }
            }, 1500); // Fixed speed of 1.5 seconds per step
            
            // Update Play button to pause state
            playButton.innerHTML = '<i class="ph ph-pause"></i> Pause Animation';
        }
    }

    // Update stepBackward to handle both directions
    stepBackward() {
        // Clear any running animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            
            d3.select(`#${this.containerId} .control-play`)
                .html('<i class="fa fa-play"></i> Play');
        }
        
        // If in upward traversal, go back one step
        if (this.traversalDirection === "up" && this.currentStepIndex > 0) {
            this.currentStepIndex--;
            
            // Reset all highlighting
            d3.selectAll(".node")
                .classed("upward-highlighted", false)
                .classed("dimmed", true);
            
            // Re-highlight previous layer
            const nodeIds = this.upwardSteps[this.currentStepIndex];
            
            // Get nodes in this layer
            const nodesInLayer = [];
            
            nodeIds.forEach(nodeId => {
                this.root.each(node => {
                    if (node.data.id === nodeId) {
                        nodesInLayer.push(node);
                    }
                });
            });
            
            // Highlight nodes in this layer
            nodeIds.forEach(nodeId => {
                const nodeElement = d3.select(`#node-${nodeId}`);
                nodeElement.classed("upward-highlighted", true)
                          .classed("dimmed", false);
                
                // Add gold outline
                const nodeShape = nodeElement.select("rect, ellipse");
                nodeShape.style("stroke", "#F0E68C") 
                        .style("stroke-width", "2px");
            });
            
            // Calculate center of these nodes for zooming
            let centerX = 0, centerY = 0, count = 0;
            nodesInLayer.forEach(node => {
                centerX += node.x;
                centerY += node.y;
                count++;
            });
            
            if (count > 0) {
                centerX /= count;
                centerY /= count;
                
                // Zoom to this layer
                const scale = 1.5;
                const x = -centerX * scale + this.width / 2;
                const y = -centerY * scale + this.height / 2;
                
                d3.select(`#${this.containerId} svg`)
                    .transition()
                    .duration(750)
                    .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
                
                // Show upward layer details
                this.showUpwardLayerDetails(nodesInLayer);
            }
            
            return true;
        }
        // If at the first step of upward traversal, go back to downward
        else if (this.traversalDirection === "up" && this.currentStepIndex === 0) {
            // Switch back to downward traversal, last step
            this.traversalDirection = "down";
            this.currentStepIndex = this.traversalSteps.length - 1;
            this.upwardSteps = null; // Clear upward steps
            
            // Remove upward highlighting
            d3.selectAll(".node")
                .classed("upward-highlighted", false)
                .style("stroke", null)
                .style("stroke-width", null);
            
            // Show the last step of downward traversal
            const nodeIds = this.traversalSteps[this.currentStepIndex];
            
            // Reset all nodes
            d3.selectAll(".node")
                .classed("current", false)
                .classed("visited", false)
                .classed("dimmed", true);
            
            // Re-highlight nodes from traversal steps
            for (let i = 0; i < this.currentStepIndex; i++) {
                this.traversalSteps[i].forEach(nodeId => {
                    d3.select(`#node-${nodeId}`).classed("visited", true);
                });
            }
            
            // Highlight current layer
            const nodesInLayer = [];
            const deletedNodesInLayer = [];
            
            nodeIds.forEach(nodeId => {
                this.root.each(node => {
                    if (node.data.id === nodeId) {
                        nodesInLayer.push(node);
                        if (node.data.status === 'rejected' || node.data.deleted) {
                            deletedNodesInLayer.push(node);
                        } else {
                            d3.select(`#node-${nodeId}`)
                                .classed("current", true)
                                .classed("dimmed", false);
                        }
                    }
                });
            });
            
            // Zoom to this layer
            let centerX = 0, centerY = 0, count = 0;
            nodesInLayer.forEach(node => {
                centerX += node.x;
                centerY += node.y;
                count++;
            });
            
            if (count > 0) {
                centerX /= count;
                centerY /= count;
                
                const scale = 1.5;
                const x = -centerX * scale + this.width / 2;
                const y = -centerY * scale + this.height / 2;
                
                d3.select(`#${this.containerId} svg`)
                    .transition()
                    .duration(750)
                    .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
                
                // Show layer details
                this.showLayerDetails(nodesInLayer, this.currentStepIndex, deletedNodesInLayer);
            }
            
            return true;
        }
        // Regular backward step in downward traversal
        else if (this.traversalDirection === "down" && this.currentStepIndex > 0) {
            this.currentStepIndex--;
            
            // Reset all nodes
            d3.selectAll(".node")
                .classed("current", false)
                .classed("visited", false)
                .classed("dimmed", true);
            
            // Re-highlight nodes from traversal steps
            for (let i = 0; i < this.currentStepIndex; i++) {
                this.traversalSteps[i].forEach(nodeId => {
                    d3.select(`#node-${nodeId}`).classed("visited", true);
                });
            }
            
            // Highlight current layer
            const nodeIds = this.traversalSteps[this.currentStepIndex];
            const nodesInLayer = [];
            const deletedNodesInLayer = [];
            
            nodeIds.forEach(nodeId => {
                this.root.each(node => {
                    if (node.data.id === nodeId) {
                        nodesInLayer.push(node);
                        if (node.data.status === 'rejected' || node.data.deleted) {
                            deletedNodesInLayer.push(node);
                        } else {
                            d3.select(`#node-${nodeId}`)
                                .classed("current", true)
                                .classed("dimmed", false);
                        }
                    }
                });
            });
            
            // Zoom to this layer
            let centerX = 0, centerY = 0, count = 0;
            nodesInLayer.forEach(node => {
                centerX += node.x;
                centerY += node.y;
                count++;
            });
            
            if (count > 0) {
                centerX /= count;
                centerY /= count;
                
                const scale = 1.5;
                const x = -centerX * scale + this.width / 2;
                const y = -centerY * scale + this.height / 2;
                
                d3.select(`#${this.containerId} svg`)
                    .transition()
                    .duration(750)
                    .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
                
                // Show layer details
                this.showLayerDetails(nodesInLayer, this.currentStepIndex, deletedNodesInLayer);
            }
            
            return true;
        }
        
        return false;
    }

    // Update resetTraversal to handle both directions
    resetTraversal() {
        // Clear animation if running
        this.stopAnimation();
        
        // Reset direction and steps
        this.traversalDirection = "down";
        this.currentStepIndex = -1;
        this.upwardSteps = null;
        this.highlightedNodes.clear();
        
        // Reset all node states
        d3.selectAll(".node")
            .classed("current", false)
            .classed("visited", false)
            .classed("dimmed", false)
            .classed("upward-highlighted", false)
            .classed("individual-focus", false)
            .classed("selected", false)
            .classed("deleted", false)
            .classed("faded-out", false);
        
        // Reset styles
        d3.selectAll(".node rect, .node ellipse, .node-text")
            .style("stroke", null)
            .style("stroke-width", null)
            .style("text-decoration", null)
            .style("opacity", 1);
        
        // Reset link styles
        d3.selectAll(".links path")
            .style("opacity", 1)
            .style("stroke-dasharray", null);
        
        // Hide details panel
        d3.select(`#${this.containerId} .node-details-container`)
            .transition()
            .duration(300)
            .style("opacity", 0)
            .on("end", function() {
                d3.select(this).style("display", "none");
            });
        
        // Remove completion checkmark if present
        d3.select(`#${this.containerId} .completion-checkmark`).remove();
        
        // Reset zoom to initial transform (top view)
        d3.select(`#${this.containerId} svg`)
            .transition()
            .duration(750)
            .call(this.zoomBehavior.transform, this.initialTransform);
    }

    // Add this new method to create the information panel
    createInfoPanel() {
        // Instead of creating a new element, find and update the existing sidebar
        const sidebar = d3.select(".sidebar");
        
        // Clear existing content
        sidebar.html("");
        
        // Set smaller font size for the entire sidebar
        sidebar.style("font-size", "0.85rem");
        
        // Add the title
        sidebar.append("h2")
            .style("color", "#000000") // Explicitly set to black
            .style("margin-bottom", "15px")
            .style("font-size", "1.3rem")
            .text("Agentic Graph-of-Thought Reasoning for Non-Verifiable Tasks");
            
        // Add the main content sections
        this.addInfoSection(sidebar, "Overview", 
            "The Agentic Graph-of-Thought (AGT) model is an novel approach for tackling complex, non-verifiable reasoning tasks. " +
            "Unlike traditional prompting, AGT breaks down complex problems into simpler, pairwise disjoint subproblems, verifies the quality of these breakdowns, " +
            "and then either recurses the process or solves them in parallel before integrating the results.");
            
        this.addInfoSection(sidebar, "How It Works", 
            "1. <strong>Problem Decomposition:</strong> Complex problems are split into manageable, pairwise disjoint subproblems that can be solved more easily.<br><br>" +
            "2. <strong>Verification:</strong> Judge models evaluate whether the decomposition is coherent, appropriate, and accurate, either terminating the branching process or continuing. If the judge model catches an inconsistency, it is given privilege to override the main model<br><br>" +
            "3. <strong>Recursive Solution:</strong> The process repeats for complex subproblems until reaching atomic tasks, smaller-one shot tasks, that can be solved directly.<br><br>" +
            "4. <strong>Backpropagation:</strong> Results from subproblems are propagated up the graph to create the final solution.");
            
        this.addInfoSection(sidebar, "Benefits", 
            "• <strong>Improved Reasoning:</strong> Breaking down complex problems leads to better reasoning pathways. Consider asking a student to explain a complex topic. The student might chunk all their reasoning together and make intermediate false claims. If you ask them to go step by step, they are morely likely to catch their own mistakes.<br><br>" +
            "• <strong>Increased Faithfulness:</strong> Verification steps ensure solutions remain aligned with the original task throughout the entire reasoning process.<br><br>" +
            "• <strong>Efficient Reasoning:</strong> Parallelization of subproblems significantly speeds up the overall solution process, taking advantage of the fact that many subproblems are independent and can be solved in parallel via continuous batching.");
            
        // Add "Did you know" boxes
        this.addDidYouKnow(sidebar, 
            "Qualitatively, AGT tends to catch itself mid-fallacy more than traditional prompting.");
        
        this.addDemo(sidebar, 
            "Step through the tree see to AGT in action.");
        
            this.addDemo(sidebar, 
                "Click on individual nodes to learn more about them.");

        // Add author links to the navigation bar instead of floating div
        this.addAuthorLinks();
    }

    // Helper method to add a section to the info panel
    addInfoSection(container, title, content) {
        const section = container.append("div")
            .attr("class", "info-section")
            .style("margin-bottom", "15px");
            
        section.append("h3")
            .style("color", "#444")
            .style("margin-bottom", "8px")
            .style("font-size", "1.1rem")
            .text(title);
            
        section.append("div")
            .attr("class", "section-content")
            .style("color", "#555")
            .style("line-height", "1.3")
            .style("font-size", "0.85rem")
            .html(content);
    }

    // Helper method to add "Did you know" boxes
    addDidYouKnow(container, content) {
        const tidbit = container.append("div")
            .attr("class", "did-you-know")
            .style("background", "#e3f2fd")
            .style("border-left", "4px solid #2196f3")
            .style("padding", "8px 12px")
            .style("margin", "12px 0")
            .style("border-radius", "4px")
            .style("font-size", "0.85rem");
            
        tidbit.append("h4")
            .style("margin", "0 0 6px 0")
            .style("color", "#1565c0")
            .style("font-size", "1rem")
            .text("Did you know?");
            
        tidbit.append("p")
            .style("margin", "0")
            .style("color", "#333")
            .html(content);
    }

    addDemo(container, content) {
        const tidbit = container.append("div")
            .attr("class", "demo")
            .style("background", "#ffebee")
            .style("border-left", "4px solid #ef5350")
            .style("padding", "8px 12px")
            .style("margin", "12px 0")
            .style("border-radius", "4px")
            .style("font-size", "0.85rem");
            
        tidbit.append("h4")
            .style("margin", "0 0 6px 0")
            .style("color", "#c62828")
            .style("font-size", "1rem")
            .text("Check it out");
            
        tidbit.append("p")
            .style("margin", "0")
            .style("color", "#333")
            .html(content);
    }

    // New method to add author links to the navigation bar
    addAuthorLinks() {
        // Find or create the navigation bar
        let navbar = d3.select(".navbar");
        if (navbar.empty()) {
            navbar = d3.select("body")
                .insert("div", ":first-child")
                .attr("class", "navbar")
                .style("display", "flex")
                .style("justify-content", "space-between") // Space between elements
                .style("align-items", "center")
                .style("padding", "10px 20px")
                .style("background-color", "#f8f9fa")
                .style("border-bottom", "1px solid #e9ecef")
                .style("width", "100%")
                .style("box-sizing", "border-box")
                .style("position", "fixed")
                .style("top", "0")
                .style("z-index", "1000");
        }
        
        // Clear existing content
        navbar.html("");
        
        // Create a container for the title (takes up 100% width for centering)
        const titleContainer = navbar.append("div")
            .style("flex-grow", "1")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("position", "absolute")
            .style("left", "0")
            .style("right", "0");
        
        // Add centered title
        titleContainer.append("h2")
            .style("color", "#000000") // Black
            .style("margin", "0")
            .style("text-align", "center")
            .style("font-size", "1.3rem")
            .text("Agentic Graph-of-Thought Reasoning for Non-Verifiable Tasks");
        
        // Add author links container to the right
        const authorLinks = navbar.append("div")
            .attr("class", "author-links")
            .style("display", "flex")
            .style("gap", "15px")
            .style("margin-left", "auto") // Push to the far right
            .style("z-index", "1") // Ensure it's above the centered title
            .style("position", "relative"); // Needed for z-index
        
        // Aaquib Syed first (as requested)
        authorLinks.append("a")
            .attr("href", "https://scholar.google.com/citations?user=yJMAIJsAAAAJ&hl=en")
            .attr("target", "_blank")
            .style("color", "#4dabf7") // Light blue
            .style("text-decoration", "none")
            .style("font-size", "0.9rem")
            .text("Aaquib Syed");
        
        // Vijay Sundarapandiyan second
        authorLinks.append("a")
            .attr("href", "https://scholar.google.com/citations?user=WpNUidQAAAAJ&hl=en")
            .attr("target", "_blank")
            .style("color", "#4dabf7") // Light blue
            .style("text-decoration", "none")
            .style("font-size", "0.9rem")
            .text("Vijay Sundarapandiyan");
    }
}
