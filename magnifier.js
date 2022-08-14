class Magnifier {
  constructor({
    targetImg, // img element to be zoomed in
    scale, // zoom scale
    magnifierSize, // magnifier's width and height
  }) {
    // set targetImg
    if (targetImg instanceof HTMLImageElement) {
      this.targetImg = targetImg;
    } else {
      throw new Error("targetImg is not an HTMLImageElement");
    }

    // set scale
    if (typeof scale === "number" && scale > 1) {
      this.scale = scale;
    } else {
      // use default scale
      this.scale = 3;
    }

    // set magnifierSize
    if (typeof magnifierSize === "number") {
      this.magnifierSize = magnifierSize;
    } else {
      // use default size
      this.magnifierSize = 300;
    }

    this.#init();
  }

  // private properties
  #magnifier;
  #showMagnifier = false;

  // private methods
  #init = () => {
    this.#createMagnifier();
    this.#handleEvents();
  }

  #createMagnifier = () => {
    // magnifier element
    const magnifier = document.createElement('div');
    // hide magnifier by default
    magnifier.style.cssText = `
      display: none;
      position: fixed;
      width: ${this.magnifierSize}px;
      height: ${this.magnifierSize}px;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: inset 0 0 20px #fff;
      background: url(${this.targetImg.src}) no-repeat #ccc;
      background-size: ${this.targetImg.clientWidth * this.scale}px auto;
    `;
    document.body.append(magnifier);
    this.#magnifier = magnifier;
  }

  #handleEvents = () => {
    // toggle magnifier when click
    document.addEventListener('click', (e) => {
      const { clientX, clientY } = e;
      if (e.target === this.targetImg) {
        // if click on target image, toggle
        this.#showMagnifier = !this.#showMagnifier;
      } else {
        // if click elsewhere, hide
        this.#showMagnifier = false;
      }
      this.#toggleMagnifier();
      if (this.#showMagnifier) {
        this.#updateMagnifier(clientX, clientY);
      }
    });

    // move magnifier
    document.addEventListener('mousemove', (e) => {
      if (!this.#showMagnifier) return;
      const { clientX, clientY } = e;
      if (this.#isInTarget(clientX, clientY)) {
        this.#updateMagnifier(clientX, clientY);
      } else {
        // hide magnifier when move out of target image
        this.#showMagnifier = false;
        this.#toggleMagnifier();
      }
    });

    // reset magnifier's background-size after window resize
    window.addEventListener('resize', (e) => {
      this.#magnifier.style.backgroundSize = `${this.targetImg.clientWidth * this.scale}px auto`;
    });
  }

  #toggleMagnifier = () => {
    this.#magnifier.style.display = this.#showMagnifier ? 'block' : 'none';
    // set pointer to crosshair to better target zoom area
    this.targetImg.style.cursor = this.#showMagnifier ? 'crosshair' : 'unset';
  }

  /**
   * update magnifier's position and background image
   */
  #updateMagnifier = (x, y) => {
    if (x + this.magnifierSize > window.innerWidth) {
      // keep magnifier in viewport
      this.#magnifier.style.left = window.innerWidth - this.magnifierSize + 'px';
    } else {
      this.#magnifier.style.left = x + 'px';
    }
    if (y + this.magnifierSize > window.innerHeight) {
      // keep magnifier in viewport
      this.#magnifier.style.top = window.innerHeight - this.magnifierSize + 'px';
    } else {
      this.#magnifier.style.top = y + 'px';
    }
    const targetImgRect = this.targetImg.getBoundingClientRect();
    const bgX = -(x - targetImgRect.x) * this.scale + this.magnifierSize / 2 + 'px';
    const bgY = -(y - targetImgRect.y) * this.scale + this.magnifierSize / 2 + 'px';
    this.#magnifier.style.backgroundPosition = `${bgX} ${bgY}`;
  }

  #isInTarget = (x, y) => {
    const targetImgRect = this.targetImg.getBoundingClientRect();
    const { left, top, width, height } = targetImgRect;
    if (x < left || y < top || x > left + width || y > top + height) {
      return false;
    }
    return true;
  }
}