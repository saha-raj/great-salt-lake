class ScrollSequence {
    constructor() {
        this.sequenceBlocks = document.querySelectorAll('.sequence-block');
        this.content = document.querySelector('.content');
        this.isFixed = false;
        this.initialScrollY = 0;
        this.placeholder = null;
        
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        this.sequenceBlocks.forEach((block, index) => {
            const rect = block.getBoundingClientRect();
            
            // When a sequence block hits the top
            if (rect.top <= 0 && !this.isFixed) {
                console.log('Freezing content');
                this.isFixed = true;
                this.initialScrollY = scrollY;
                
                // Fix the entire content in place
                this.content.style.position = 'fixed';
                this.content.style.top = `${-this.initialScrollY}px`;
                this.content.style.left = '50%';
                this.content.style.transform = 'translateX(-50%)';
                
                // Add a placeholder to maintain scroll position
                this.placeholder = document.createElement('div');
                this.placeholder.style.height = `${this.content.offsetHeight}px`;
                this.content.parentNode.insertBefore(this.placeholder, this.content);
            }
            
            // When scrolling continues past the fixed state
            if (this.isFixed && scrollY > this.initialScrollY + 100) { // 100px threshold
                console.log('Resuming scroll');
                this.isFixed = false;
                
                // Remove fixed positioning
                this.content.style.position = '';
                this.content.style.top = '';
                this.content.style.left = '';
                this.content.style.transform = '';
                
                // Remove placeholder
                if (this.placeholder) {
                    this.placeholder.remove();
                    this.placeholder = null;
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollSequence();
});