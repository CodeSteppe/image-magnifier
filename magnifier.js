class Magnifier {
  constructor({
    targetElement, // element to be zoomed in
    magnifierElement, // element works as a magnifier
  }) {
    this.targetElement = targetElement;
    this.magnifierElement = magnifierElement;
    this.#init();
  }

  // private properties
  #root = document.documentElement;
  #showMagnifier = false;

  // private methods
  #init = () => {
    this.target.addEventListener('dblclick', (e) => {
      this.#showMagnifier = !this.#showMagnifier;
      if (showMagnifier) {
        this.#setMousePosition(e.clientX, e.clientY);
      }
      this.#root.style.setProperty('--magnifier-display', this.#showMagnifier ? 'block' : 'none');
    });

    this.target.addEventListener('mousemove', (e) => {
      if (this.#showMagnifier) {
        this.#setMousePosition(e.clientX, e.clientY);
      }
    });
  }

  #setMousePosition = (x, y) => {
    this.#root.style.setProperty('--x', x + 'px');
    this.#root.style.setProperty('--y', y + 'px');
  }
}