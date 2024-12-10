class ScrollSequence {
    constructor() {
        this.sequenceBlocks = document.querySelectorAll('.sequence-block');
        this.currentFrame = 1;
        this.isActive = false;
        this.TOTAL_FRAMES = 38;
        this.lastWheelTime = Date.now();
        this.WHEEL_THROTTLE = 50;
        this.hasReachedEnd = false;
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        
        // Set up observers and listeners
        this.setupIntersectionObserver();
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('wheel', this.handleWheel, { passive: false });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0, 1]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const block = entry.target;
                const rect = block.getBoundingClientRect();
                
                // When block hits the top of viewport
                if (entry.isIntersecting && rect.top <= 0) {
                    this.activateSequence(block);
                }
            });
        }, options);

        this.sequenceBlocks.forEach(block => observer.observe(block));
    }

    activateSequence(block) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.hasReachedEnd = false;
        this.activeBlock = block;
        this.currentFrame = 1;
        
        // Store the scroll position where sequence was activated
        this.activationScrollY = window.scrollY;
        
        // Create and insert placeholder
        this.placeholder = document.createElement('div');
        this.placeholder.style.height = `${block.offsetHeight}px`;
        block.parentNode.insertBefore(this.placeholder, block);
        
        block.classList.add('is-active');
        document.body.classList.add('sequence-scrolling');
        
        const progress = block.querySelector('.sequence-progress');
        if (progress) {
            progress.style.width = '0%';
        }
    }

    deactivateSequence() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.body.classList.remove('sequence-scrolling');
        this.activeBlock.classList.remove('is-active');
        
        // When scrolling up from first frame, return to activation position
        if (this.currentFrame === 1) {
            window.scrollTo({
                top: this.activationScrollY,
                behavior: 'smooth'
            });
        }
        
        // Remove placeholder
        if (this.placeholder) {
            this.placeholder.remove();
            this.placeholder = null;
        }
    }

    handleWheel(event) {
        if (!this.isActive || this.hasReachedEnd) return;
        
        const delta = Math.sign(event.deltaY);
        
        // Allow upward scrolling if we're at the first frame
        if (delta < 0 && this.currentFrame === 1) {
            this.deactivateSequence();
            return;
        }
        
        event.preventDefault();
        
        // Throttle frame changes
        const now = Date.now();
        if (now - this.lastWheelTime < this.WHEEL_THROTTLE) return;
        this.lastWheelTime = now;
        
        if (delta > 0) {
            // Scrolling down
            if (this.currentFrame < this.TOTAL_FRAMES) {
                this.nextFrame();
            } else {
                // When reaching last frame
                this.hasReachedEnd = true;
                this.deactivateSequence();
                window.scrollTo({
                    top: this.activeBlock.offsetTop + this.activeBlock.offsetHeight,
                    behavior: 'smooth'
                });
            }
        } else if (delta < 0 && this.currentFrame > 1) {
            // Scrolling up within sequence
            this.previousFrame();
        }
    }

    nextFrame() {
        if (this.currentFrame >= this.TOTAL_FRAMES) return;
        
        this.currentFrame++;
        this.updateFrame();
    }

    previousFrame() {
        if (this.currentFrame <= 1) return;
        
        this.currentFrame--;
        this.updateFrame();
    }

    updateFrame() {
        const frame = this.activeBlock.querySelector('.current-frame');
        if (frame) {
            frame.src = `assets/images/frames/${this.currentFrame.toString().padStart(3, '0')}.jpg`;
        }
        
        // Update progress bar
        const progress = this.activeBlock.querySelector('.sequence-progress');
        if (progress) {
            const percentage = ((this.currentFrame - 1) / (this.TOTAL_FRAMES - 1)) * 100;
            progress.style.width = `${percentage}%`;
        }
    }

    handleScroll() {
        if (!this.isActive && !this.hasReachedEnd) {
            this.sequenceBlocks.forEach(block => {
                const rect = block.getBoundingClientRect();
                if (rect.top <= 0) {
                    this.activateSequence(block);
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollSequence();
});