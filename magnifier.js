class Magnifier {
  constructor({
    targetElement, // element to be zoomed in
    magnifierElement, // element works as a magnifier
  }) {
    if (targetElement instanceof HTMLImageElement) {
      this.targetElement = targetElement;
    } else {
      throw new Error('targetElement is not <img>')
    }
    this.magnifierElement = magnifierElement;
    this.#init();
  }

  // private properties
  #showMagnifier = false;
  #magnifierImg;

  // private methods
  #init = () => {
    this.#handleEvents();
    this.#setMagnifierImage();
  }

  #handleEvents = () => {
    document.addEventListener('dblclick', (e) => {
      const { clientX, clientY } = e;
      // if (!this.#isInTarget(clientX, clientY)) return;
      this.#showMagnifier = !this.#showMagnifier;
      this.#toggleMagnifier();
      if (this.#showMagnifier) {
        this.#updateMagnifierPosition(clientX, clientY);
      }
    });

    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      // if (!this.#isInTarget(clientX, clientY)) return;
      if (this.#showMagnifier) {
        this.#updateMagnifierPosition(clientX, clientY);
      }
    });
  }

  #toggleMagnifier = () => {
    this.magnifierElement.style.display = this.#showMagnifier ? 'block' : 'none';
    document.documentElement.style.cursor = this.#showMagnifier ? 'crosshair' : 'unset';
  }

  #updateMagnifierPosition = (x, y) => {
    this.magnifierElement.style.left = x + 'px';
    this.magnifierElement.style.top = y + 'px';
    const targetRect = this.targetElement.getBoundingClientRect();
    const magnifierRect = this.magnifierElement.getBoundingClientRect();
    let xPercentage = (x - targetRect.x) / targetRect.width * 100;
    let yPercentage = (y - targetRect.y) / targetRect.height * 100;
    this.#magnifierImg.style.transform = `translate(calc(${-xPercentage}% + ${magnifierRect.width / 2}px), calc(${-yPercentage}% + ${magnifierRect.height / 2}px))`;
  }

  #isInTarget = (x, y) => {
    const targetRect = this.targetElement.getBoundingClientRect();
    const { left, top, width, height } = targetRect;
    if (x < left || y < top || x > left + width || y > top + height) return false;
    return true;
  }

  #setMagnifierImage = () => {
    const img = document.createElement('img');
    img.src = this.targetElement.src;
    this.#magnifierImg = img;
    this.magnifierElement.style.overflow = 'hidden';
    this.magnifierElement.append(img);
  }
}