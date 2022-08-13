class Magnifier {
  constructor({
    targetImg, // img element to be zoomed
    scale, // zoom scale
  }) {
    if (targetImg instanceof HTMLImageElement) {
      this.targetImg = targetImg;
    } else {
      throw new Error('targetImg is not an HTMLImageElement')
    }
    if (typeof scale === 'number' && scale > 1) {
      this.scale = scale;
    } else {
      // set default scale value
      this.scale = 2;
    }

    this.#init();
  }

  // private properties
  #showMagnifier = false;
  #magnifier;
  #magnifierWidth=300;
  #magnifierHeight=300;

  // private methods
  #init = () => {
    this.#createMagnifier();
    this.#handleEvents();
  }

  #handleEvents = () => {
    document.addEventListener('click', (e) => {
      const { clientX, clientY } = e;
      if (!this.#isInTarget(clientX, clientY)) return;
      this.#showMagnifier = !this.#showMagnifier;
      this.#toggleMagnifier();
      if (this.#showMagnifier) {
        this.#updateMagnifierPosition(clientX, clientY);
      }
    });

    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      if (this.#showMagnifier) {
        this.#updateMagnifierPosition(clientX, clientY);
      }
    });
  }

  #toggleMagnifier = () => {
    this.#magnifier.style.transform = this.#showMagnifier ? 'scale(1)' : 'scale(0)';
    document.documentElement.style.cursor = this.#showMagnifier ? 'crosshair' : 'unset';
  }

  #updateMagnifierPosition = (x, y) => {
    this.#magnifier.style.left = x + 'px';
    this.#magnifier.style.top = y + 'px';
    const targetRect = this.targetImg.getBoundingClientRect();
    const bgX = -(x - targetRect.x) * this.scale + this.#magnifierWidth / 2 + 'px'
    const bgY = -(y - targetRect.y) * this.scale + this.#magnifierHeight / 2 + 'px'
    this.#magnifier.style.backgroundPosition = `${bgX} ${bgY}`;
  }

  #isInTarget = (x, y) => {
    const targetRect = this.targetImg.getBoundingClientRect();
    const { left, top, width, height } = targetRect;
    if (x < left || y < top || x > left + width || y > top + height) return false;
    return true;
  }

  #createMagnifier = () => {
    // magnifierElement
    const magnifier = document.createElement('div');
    magnifier.style.cssText = `
      position: fixed;
      width: ${this.#magnifierWidth}px;
      height: ${this.#magnifierHeight}px;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: inset 0 0 20px #fff;
      transform: scale(0);
      transition: transform 0.5s;
      background: url(${this.targetImg.src}) no-repeat #000;
      background-size: ${this.targetImg.clientWidth * this.scale}px auto;
    `
    document.body.append(magnifier);
    this.#magnifier = magnifier;
  }
}