class SwipeEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.index = 0;
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    
    this.items = [...container.children];
    
    this.onChange = options.onChange || function() {};
    
    this.init();
  }
  
  init() {
    this.container.addEventListener("touchstart", (e) => this.touchStart(e));
    this.container.addEventListener("touchmove", (e) => this.touchMove(e));
    this.container.addEventListener("touchend", (e) => this.touchEnd(e));
    
    this.update();
  }
  
  touchStart(e) {
    this.startY = e.touches[0].clientY;
    this.isDragging = true;
  }
  
  touchMove(e) {
    if (!this.isDragging) return;
    
    this.currentY = e.touches[0].clientY;
    let diff = this.currentY - this.startY;
    
    this.container.style.transform = `translateY(${ -this.index * 100 + diff / window.innerHeight * 100 }vh)`;
  }
  
  touchEnd(e) {
    this.isDragging = false;
    
    let diff = this.currentY - this.startY;
    
    if (diff < -80 && this.index < this.items.length - 1) {
      this.index++;
    }
    
    if (diff > 80 && this.index > 0) {
      this.index--;
    }
    
    this.update();
  }
  
  update() {
    this.container.style.transition = "transform 0.3s ease-out";
    this.container.style.transform = `translateY(-${this.index * 100}vh)`;
    
    setTimeout(() => {
      this.container.style.transition = "none";
    }, 300);
    
    this.onChange(this.index);
  }
}