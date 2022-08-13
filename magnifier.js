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
  #magnifierImg;

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
    this.#magnifier.style.display = this.#showMagnifier ? 'block' : 'none';
    document.documentElement.style.cursor = this.#showMagnifier ? 'crosshair' : 'unset';
  }

  #updateMagnifierPosition = (x, y) => {
    this.#magnifier.style.left = x + 'px';
    this.#magnifier.style.top = y + 'px';
    const targetRect = this.targetImg.getBoundingClientRect();
    const magnifierRect = this.#magnifier.getBoundingClientRect();
    const xPercentage = (x - targetRect.x) / targetRect.width * 100;
    const yPercentage = (y - targetRect.y) / targetRect.height * 100;
    const translateX = `calc(${-xPercentage}% + ${magnifierRect.width / 2}px)`;
    const translateY = `calc(${-yPercentage}% + ${magnifierRect.height / 2}px)`;
    this.#magnifierImg.style.transform = `translate(${translateX}, ${translateY})`;
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
      display: none;
      position: fixed;
      width: 300px;
      height: 300px;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 0 0 20px #fff;
      background-color: #000;
    `
    // img in magnifier
    const img = document.createElement('img');
    img.src = this.targetImg.src;
    img.style.width = this.targetImg.clientWidth * this.scale + 'px';
    img.style.height = 'auto';
    magnifier.append(img);
    document.body.append(magnifier);

    this.#magnifier = magnifier;
    this.#magnifierImg = img;
  }
}