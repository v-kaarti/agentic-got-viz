document.addEventListener('DOMContentLoaded', () => {
    // Initialize only parallel visualization
    let parallelViz = new TreeVisualization('parallel-tree-container', sampleReasoningData, "parallel");
    
    let isPlaying = false;
    
    // Setup event listeners
    const stepBtn = document.getElementById('step-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playBtn = document.getElementById('play-btn');
    const speedControl = document.getElementById('speed-control');
    const promptInput = document.getElementById('prompt-input');
    const presetPrompts = document.getElementById('preset-prompts');
    
    // Handle preset prompt selection
    presetPrompts.addEventListener('change', () => {
        const selectedValue = presetPrompts.value;
        
        if (selectedValue) {
            const preset = presetDataMap[selectedValue];
            
            if (preset) {
                promptInput.value = preset.data.text;
                sampleReasoningData = preset.data;
                reinitializeVisualization();
            }
        }
    });
    
    // Function to reinitialize visualization
    function reinitializeVisualization() {
        stopAnimation();
        
        d3.select('#parallel-tree-container svg').remove();
        
        parallelViz = new TreeVisualization('parallel-tree-container', sampleReasoningData, "parallel");
        
        const speed = speedControl.value;
        parallelViz.setSpeed(speed);
        
        playBtn.innerHTML = '<i class="ph ph-play"></i> Play Animation';
        playBtn.classList.remove('button-warning');
        playBtn.classList.add('button-success');
        isPlaying = false;
    }
    
    function stopAnimation() {
        if (parallelViz) parallelViz.stopAnimation();
    }
    
    // Step button
    stepBtn.addEventListener('click', () => {
        const hasMoreSteps = parallelViz.stepForward();
        
        if (!hasMoreSteps) {
            stepBtn.classList.add('disabled');
            setTimeout(() => {
                stepBtn.classList.remove('disabled');
            }, 500);
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        // Reset the visualization
        parallelViz.reset();
        
        // Reset the play button state
        playBtn.innerHTML = '<i class="ph ph-play"></i> Play Animation';
        playBtn.classList.remove('button-warning');
        playBtn.classList.add('button-success');
        isPlaying = false;
    });
    
    // Play/Pause button
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            parallelViz.stopAnimation();
            playBtn.innerHTML = '<i class="ph ph-play"></i> Play Animation';
            playBtn.classList.remove('button-warning');
            playBtn.classList.add('button-success');
        } else {
            parallelViz.startAnimation();
            playBtn.innerHTML = '<i class="ph ph-pause"></i> Pause Animation';
            playBtn.classList.remove('button-success');
            playBtn.classList.add('button-warning');
        }
        isPlaying = !isPlaying;
    });
    
    // Speed control
    speedControl.addEventListener('input', () => {
        const speed = speedControl.value;
        parallelViz.setSpeed(speed);
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            reinitializeVisualization();
        }, 250);
    });
    
    // Start with the first preset
    presetPrompts.value = "shortest-path";
    presetPrompts.dispatchEvent(new Event('change'));
});