class ScrollSequence {
    constructor() {
        this.container = document.querySelector('.scroll-sequence-container');
        this.imageWrapper = document.querySelector('.sequence-image');
        this.image = this.imageWrapper.querySelector('img');
        
        this.frameCount = 38;
        this.currentFrame = 1;
        this.isFixed = false;
        
        console.log('ScrollSequence initialized:', {
            container: this.container,
            imageWrapper: this.imageWrapper,
            image: this.image,
            frameCount: this.frameCount
        });
        
        this.handleScroll = this.handleScroll.bind(this);
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll);
        this.updatePositions();
        this.handleScroll();
        window.addEventListener('resize', () => this.updatePositions());
        
        console.log('Initial positions:', {
            startPosition: this.startPosition,
            endPosition: this.endPosition,
            windowHeight: window.innerHeight
        });
        
        const contentBelow = document.querySelector('.content-below');
        if (contentBelow) {
            contentBelow.style.position = 'relative';
            contentBelow.style.marginTop = `${this.imageWrapper.offsetHeight}px`;
        }
    }
    
    updatePositions() {
        const rect = this.container.getBoundingClientRect();
        this.startPosition = rect.top + window.scrollY;
        this.endPosition = this.startPosition + (this.container.offsetHeight - this.imageWrapper.offsetHeight);
        
        console.log('Positions updated:', {
            scrollY: window.scrollY,
            rectTop: rect.top,
            startPosition: this.startPosition,
            endPosition: this.endPosition
        });
    }
    
    handleScroll() {
        const scrollPosition = window.scrollY;
        const containerTop = this.container.getBoundingClientRect().top;
        
        console.log('Scroll event:', {
            scrollPosition,
            containerTop,
            isFixed: this.isFixed
        });
        
        if (containerTop <= 0) {
            const progress = (scrollPosition - this.startPosition) / (this.endPosition - this.startPosition);
            
            console.log('Progress calculation:', {
                progress,
                scrollPosition,
                startPosition: this.startPosition,
                endPosition: this.endPosition
            });
            
            if (progress <= 1) {
                // During sequence
                if (!this.isFixed) {
                    this.imageWrapper.classList.add('fixed');
                    this.isFixed = true;
                }
                
                const frameIndex = Math.min(
                    Math.max(1, Math.floor(progress * this.frameCount) + 1),
                    this.frameCount
                );
                
                if (frameIndex !== this.currentFrame) {
                    console.log('Updating frame:', {
                        oldFrame: this.currentFrame,
                        newFrame: frameIndex,
                        progress
                    });
                    
                    this.currentFrame = frameIndex;
                    const frameNumber = String(this.currentFrame).padStart(3, '0');
                    this.image.src = `assets/images/frames/${frameNumber}.jpg`;
                }
            } else {
                // After sequence - keep last frame visible but scroll with page
                this.imageWrapper.classList.remove('fixed');
                this.imageWrapper.style.position = 'absolute';
                this.imageWrapper.style.top = `${this.endPosition}px`;
                this.isFixed = false;
            }
        } else {
            // Before sequence starts
            this.imageWrapper.classList.remove('fixed');
            this.imageWrapper.style.position = '';
            this.imageWrapper.style.top = '';
            this.isFixed = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ScrollSequence');
    new ScrollSequence();
});
