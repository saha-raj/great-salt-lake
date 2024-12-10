class TimelapseScroller {
    constructor() {
        this.container = document.querySelector('.timelapse-container');
        this.image = document.querySelector('.timelapse-image');
        
        this.totalFrames = 37;
        this.currentFrame = 1;
        this.isFixed = false;
        this.scrollHeight = window.innerHeight * 2;
        this.contentBelow = document.querySelector('.timelapse-container').nextElementSibling;
        
        this.init();
    }

    init() {
        this.image.src = 'assets/images/frames/001.jpg';
        this.updatePositions();
        
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.updatePositions());
        
        // Set container height to allow scrolling
        this.container.style.height = `${this.scrollHeight}px`;
    }

    updatePositions() {
        const rect = this.container.getBoundingClientRect();
        this.startPosition = window.scrollY + rect.top;
        this.endPosition = this.startPosition + this.scrollHeight;
    }

    handleScroll() {
        const scrollPosition = window.scrollY;
        const containerTop = this.container.getBoundingClientRect().top;
        
        // Calculate frame based on scroll position
        const progress = (scrollPosition - this.startPosition) / this.scrollHeight;
        const frameIndex = Math.min(
            Math.floor(progress * this.totalFrames),
            this.totalFrames - 1
        );
        
        // Update frame
        const newFrame = frameIndex + 1;
        if (newFrame !== this.currentFrame) {
            this.currentFrame = newFrame;
            const frameNumber = String(this.currentFrame).padStart(3, '0');
            this.image.src = `assets/images/frames/${frameNumber}.jpg`;
        }
        
        // Keep the image fixed until we reach the last frame
        if (containerTop <= 0 && this.currentFrame < this.totalFrames) {
            // Fix both the image and the content below while frames are changing
            if (!this.isFixed) {
                this.image.style.position = 'fixed';
                this.image.style.top = '0';
                this.image.style.left = '50%';
                this.image.style.transform = 'translateX(-50%)';
                // Fix the position of content below
                this.contentBelow.style.marginTop = `${this.container.offsetHeight}px`;
                this.isFixed = true;
            }
        } else {
            // Reset to first frame when scrolling back up
            if (containerTop > 0 && this.currentFrame !== 1) {
                this.currentFrame = 1;
                this.image.src = 'assets/images/frames/001.jpg';
                if (this.isFixed) {
                    this.image.style.position = 'relative';
                    this.image.style.top = '';
                    this.image.style.left = '';
                    this.image.style.transform = '';
                    this.isFixed = false;
                }
            }
        }
        
        // When last frame is reached
        if (this.currentFrame === this.totalFrames) {
            if (this.isFixed) {
                // Unfix everything and let normal scrolling resume
                this.image.style.position = 'relative';
                this.image.style.top = '';
                this.image.style.left = '';
                this.image.style.transform = '';
                // Remove the margin that was keeping content in place
                this.contentBelow.style.marginTop = '';
                this.isFixed = false;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimelapseScroller();
});
