class Magnifier {
  constructor({
    targetImg, // img element to be zoomed
    scale, // zoom scale,
    magnifierSize, // magnifier's width and height
  }) {
    // set targetImg
    if (targetImg instanceof HTMLImageElement) {
      this.targetImg = targetImg;
    } else {
      throw new Error('targetImg is not an HTMLImageElement')
    }
    // set scale
    if (typeof scale === 'number' && scale > 1) {
      this.scale = scale;
    } else {
      // default value
      this.scale = 2;
    }
    // set magnifierSize
    if (typeof magnifierSize === 'number') {
      this.magnifierSize = magnifierSize;
    } else {
      // default value
      this.magnifierSize = 300;
    }
    this.#init();
  }

  // private properties
  #showMagnifier = false;
  #magnifier;

  // private methods
  #init = () => {
    this.#createMagnifier();
    this.#handleEvents();
  }

  #handleEvents = () => {
    // toggle magnifier when click
    document.addEventListener('click', (e) => {
      const { clientX, clientY } = e;
      if (e.target === this.targetImg) {
        this.#showMagnifier = !this.#showMagnifier;
      } else {
        this.#showMagnifier = false;
      }
      this.#toggleMagnifier();
      if (this.#showMagnifier) {
        this.#updateMagnifierPosition(clientX, clientY);
      }
    });

    // move magnifier
    document.addEventListener('mousemove', (e) => {
      if (!this.#showMagnifier) return;
      const { clientX, clientY } = e;
      if (this.#isInTarget(clientX, clientY)) {
        this.#updateMagnifierPosition(clientX, clientY);
      } else {
        this.#showMagnifier = false;
        this.#toggleMagnifier();
      }
    });

    // reset backgroundSize after window resize
    window.addEventListener('resize', (e) => {
      this.#magnifier.style.backgroundSize = `${this.targetImg.clientWidth * this.scale}px auto`;
    });
  }

  #toggleMagnifier = () => {
    this.#magnifier.style.display = this.#showMagnifier ? 'block' : 'none';
    this.targetImg.style.cursor = this.#showMagnifier ? 'crosshair' : 'unset';
  }

  #updateMagnifierPosition = (x, y) => {
    if (x + this.magnifierSize > window.innerWidth) {
      // this.#magnifier.style.left = x - (x + this.magnifierSize - window.innerWidth) + 'px';
      this.#magnifier.style.left = window.innerWidth - this.magnifierSize + 'px';
    } else {
      this.#magnifier.style.left = x + 'px';
    }
    if (y + this.magnifierSize > window.innerHeight) {
      this.#magnifier.style.top = window.innerHeight - this.magnifierSize + 'px';
    } else {
      this.#magnifier.style.top = y + 'px';
    }
    const targetRect = this.targetImg.getBoundingClientRect();
    const bgX = -(x - targetRect.x) * this.scale + this.magnifierSize / 2 + 'px'
    const bgY = -(y - targetRect.y) * this.scale + this.magnifierSize / 2 + 'px'
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
      display:none;
      position: fixed;
      width: ${this.magnifierSize}px;
      height: ${this.magnifierSize}px;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: inset 0 0 20px #fff;
      background: url(${this.targetImg.src}) no-repeat #ccc;
      background-size: ${this.targetImg.clientWidth * this.scale}px auto;
    `
    document.body.append(magnifier);
    this.#magnifier = magnifier;
  }
}