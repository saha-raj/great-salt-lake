class TimelapseScroller {
    constructor() {
        this.container = document.querySelector('.timelapse-container');
        this.image = document.querySelector('.timelapse-image');
        
        this.totalFrames = 37;
        this.currentFrame = 1;
        this.isFixed = false;
        this.scrollHeight = window.innerHeight * 2;
        
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
        
        if (containerTop <= 0 && scrollPosition <= this.endPosition) {
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
            
            // Fix the image and its container
            if (!this.isFixed) {
                this.image.style.position = 'fixed';
                this.image.style.top = '0';
                this.image.style.left = '50%';
                this.image.style.transform = 'translateX(-50%)';
                this.isFixed = true;
            }
        } else {
            // Reset position when outside the scroll range
            if (this.isFixed) {
                this.image.style.position = 'relative';
                this.image.style.top = '';
                this.image.style.left = '';
                this.image.style.transform = '';
                this.isFixed = false;
            }
            
            // Reset to first frame when above
            if (containerTop > 0 && this.currentFrame !== 1) {
                this.currentFrame = 1;
                this.image.src = 'assets/images/frames/001.jpg';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimelapseScroller();
});
