// Component
import { Window } from '../Component/GUI/js/Window';
import * as THREE from 'three';

/** @typedef {import("../../InputManager")} InputManager */
/** @typedef {import("itowns")} itowns*/
/**
 * @typedef {object} TextureFile
 * @property {number} index Index of the file (use to order file)
 * @property {string} name Name of the file
 * @property {THREE.CanvasTexture|THREE.VideoTexture} texture Texture to apply on the plane
 * @property {{height:number,width:number}} size Size of the texture
 * @property {HTMLVideoElement} [video] Html video element if it is an video texture.
 */
export class SlideShow extends Window {
  /**
   * It initializes the widget.
   *
   * @param {itowns.PlanarView} itownsView - The itowns view.
   * @param {object} configSlideShow - The configuration of the widget. need description
   * @param {Array<{name:string,folder:string,diapositives:Array<string>}>} configSlideShow.slides - Array of slide object
   * @param {itowns.Extent} extent - The extent of the widget.
   * @param {InputManager} inputManager - the input manager of the application
   */
  constructor(itownsView, configSlideShow, extent, inputManager) {
    super('slideShow', 'Slide Show 3D', false);

    this.configSlideShow = configSlideShow || null;
    /** @type {itowns.Extent} */
    this.extent = extent;
    /** @type {itowns.PlanarView} */
    this.itownsView = itownsView;
    /** @type {InputManager} */
    this.inputManager = inputManager;

    /** @type {HTMLElement} Content html */
    this.htmlSlideShow = null;
    // Ids
    this.coordinatesInputVectorID = null;
    this.rotationInputVectorID = null;
    this.sizeInputVectorID = null;
    this.aspectRatioCheckboxID = null;
    this.loopSlideShowCheckboxID = null;
    this.slideSelectID = null;
    this.durationLoopInputID = null;
    this.counterLoopTimeDivID = null;

    // Vectors
    this.coordinatesVector = new THREE.Vector3();
    this.rotationVector = new THREE.Vector3();
    this.sizeVector = new THREE.Vector2();

    /** @type {{event:string,id:number,cb:Function}[]} List of callbacks to set when the window is created  */
    this.callbacksHTMLEl = [];

    /** @type {THREE.Mesh} */
    this.plane = null;

    /** @type {TextureFile[]} List of textures with data*/
    this.texturesFiles = null;
    this.iCurrentTextureFile = 0;

    /** @type {boolean} if true the application update its view3D eachFrame*/
    this.notifyValue = false;

    this.initDefaultTextureFile();

    if (configSlideShow) {
      this.setSlideshowInConfig(0);
    }

    this.intervalLoop = null;
    this.counterIntervalLoop = null;
    this.durationLoopInSec = configSlideShow.durationLoopInSec || 10; // Take config value or 10s by default

    this.currentTexture = null;

    this.initHtml();
    this.initInputListener(itownsView, this.inputManager);
    this.initCBDrop();
    const _this = this;
    /** A function call each frame by the browser */
    const tick = function () {
      requestAnimationFrame(tick);
      _this.notifyChangeEachFrame();
    };
    tick();
  }

  /** If the notifyValue is true, then update the 3D view*/
  notifyChangeEachFrame() {
    if (this.notifyValue) {
      this.itownsView.notifyChange();
    }
  }

  /**
   * It loads the textures and videos of the slideshow and stores them in the `this.texturesFiles` array
   *
   * @param {number} slideIndex - the index of the slideshow in the config file
   */
  setSlideshowInConfig(slideIndex) {
    if (isNaN(slideIndex)) return;
    const conf = this.configSlideShow;
    const slide = conf[Object.keys(conf)[0]][slideIndex];
    const folder = slide.folder;
    const diapos = slide.diapositives;
    this.texturesFiles = [];
    this.iCurrentTextureFile = 0;

    const _this = this;
    for (let i = 0; i < diapos.length; i++) {
      this.texturesFiles.push({
        index: i,
        name: diapos[i],
        texture: this.defaultTexture,
        size: {
          height: this.defaultTexture.image.height,
          width: this.defaultTexture.image.width,
        },
      });

      const xhr = new XMLHttpRequest();
      xhr.open('GET', folder.concat('/'.concat(diapos[i])));

      xhr.onload = function () {
        const type = this.getResponseHeader('Content-Type');
        if (type.includes('image')) {
          new THREE.TextureLoader().load(this.responseURL, function (texture) {
            _this.texturesFiles[i].texture = texture;
            _this.texturesFiles[i].size = {
              height: texture.image.height,
              width: texture.image.width,
            };
            if (i == 0) _this.setTexture(0);
          });
        } else if (type.includes('video')) {
          const video = document.createElement('video');
          video.src = this.responseURL;
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.load();

          video.onloadedmetadata = function () {
            const videoTexture = new THREE.VideoTexture(video);
            _this.texturesFiles[i].texture = videoTexture;
            _this.texturesFiles[i].video = video;
            _this.texturesFiles[i].size = {
              height: video.videoHeight,
              width: video.videoWidth,
            };
            if (i == 0) _this.setTexture(0);
          };
        } else {
          console.error(
            this.responseURL,
            ' is not a valid video or image file'
          );
        }
      };
      xhr.send();
    }
  }

  /** Create a default texture and fill the first texture file in `this.texturesFiles` */
  initDefaultTextureFile() {
    const canvas = document.createElement('canvas');
    canvas.height = 512;
    canvas.width = 512;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    const colors = [
      'red',
      'orange',
      'DarkOliveGreen',
      'SpringGreen',
      'cyan',
      'MidnightBlue',
      'MediumVioletRed',
    ];
    for (let i = 0; i < colors.length; i++) {
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.width);
      gradient.addColorStop(0, colors[i]);
      gradient.addColorStop(1, 'white');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        (canvas.width / colors.length) * i,
        0,
        (canvas.width / colors.length) * (i + 1),
        canvas.height
      );
    }

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = '70px Arial';
    const stringDefaultTexture = 'Default Texture';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(stringDefaultTexture, 256, 256);

    this.defaultTexture = new THREE.CanvasTexture(canvas);
    this.texturesFiles = [
      {
        index: 0,
        name: 'First',
        texture: this.defaultTexture,
        size: { height: canvas.height, width: canvas.width },
      },
    ];
  }

  /** Create all HTMLElements and fill `this.htmlSlideShow`*/
  initHtml() {
    const htmlSlideShow = document.createElement('div');
    const coordinatesElement = this.createInputVector(
      ['X', 'Y', 'Z'],
      'Coordinates',
      100
    );
    htmlSlideShow.appendChild(coordinatesElement.title);
    this.coordinatesInputVectorID = coordinatesElement.inputVector.id;
    htmlSlideShow.appendChild(coordinatesElement.inputVector);

    const rotationElement = this.createInputVector(
      ['X', 'Y', 'Z'],
      'Rotation',
      0.1
    );
    htmlSlideShow.appendChild(rotationElement.title);
    this.rotationInputVectorID = rotationElement.inputVector.id;
    htmlSlideShow.appendChild(rotationElement.inputVector);

    const sizeElement = this.createInputVector(
      ['Height', 'Width'],
      'Size',
      100
    );
    htmlSlideShow.appendChild(sizeElement.title);
    this.sizeInputVectorID = sizeElement.inputVector.id;
    htmlSlideShow.appendChild(sizeElement.inputVector);

    const matchExtentButton = document.createElement('button');
    matchExtentButton.id = '_button_match_extent';
    matchExtentButton.innerHTML = 'Match Extent';
    this.callbacksHTMLEl.push({
      event: 'click',
      id: matchExtentButton.id,
      cb: this.matchExtent,
    });
    htmlSlideShow.appendChild(matchExtentButton);

    const aspectRatioDiv = document.createElement('div');
    htmlSlideShow.appendChild(aspectRatioDiv);

    const aspectRatioCheckbox = document.createElement('input');
    aspectRatioCheckbox.id = 'aspectRatio';
    aspectRatioCheckbox.type = 'checkbox';
    this.callbacksHTMLEl.push({
      event: 'change',
      id: aspectRatioCheckbox.id,
      cb: function (event) {
        if (event.target.checked) {
          const currentW = this.getSizeValues().width;
          const w =
            currentW != 0 ? currentW : this.currentTextureFile.size.width;
          this.setSizeInputs(new THREE.Vector2(null, w));
        }
      },
    });

    this.aspectRatioCheckboxID = aspectRatioCheckbox.id;
    aspectRatioDiv.appendChild(aspectRatioCheckbox);

    const labelAspectRatio = document.createElement('label');
    labelAspectRatio.htmlFor = aspectRatioCheckbox.id;
    labelAspectRatio.innerHTML = 'Aspect Ratio';
    aspectRatioDiv.appendChild(labelAspectRatio);

    const loopDiv = document.createElement('div');
    htmlSlideShow.appendChild(loopDiv);

    const loopCheckbox = document.createElement('input');
    loopCheckbox.id = 'loopSlideShow';
    loopCheckbox.type = 'checkbox';
    this.callbacksHTMLEl.push({
      event: 'change',
      id: loopCheckbox.id,
      cb: function (event) {
        if (this.intervalLoop) this.stopLoopSlideShow();
        if (event.target.checked) {
          this.loopSlideShow();
        }
      },
    });

    this.loopSlideShowCheckboxID = loopCheckbox.id;
    loopDiv.appendChild(loopCheckbox);

    const labelLoopSlideShow = document.createElement('label');
    labelLoopSlideShow.htmlFor = loopCheckbox.id;
    labelLoopSlideShow.innerHTML = 'Loop SlideShow';
    loopDiv.appendChild(labelLoopSlideShow);

    const durationLoopInSecDiv = document.createElement('div');
    htmlSlideShow.appendChild(durationLoopInSecDiv);

    const durationLoopInSecInput = document.createElement('input');
    durationLoopInSecInput.id = 'durationLoopInputSlideShow';
    durationLoopInSecInput.type = 'number';
    durationLoopInSecInput.max = 100;
    durationLoopInSecInput.min = 1;
    durationLoopInSecInput.setAttribute('value', this.durationLoopInSec);
    durationLoopInSecDiv.step = 0.5;
    this.callbacksHTMLEl.push({
      event: 'change',
      id: durationLoopInSecInput.id,
      cb: function (event) {
        this.durationLoopInSec = parseFloat(event.target.value);
        if (this.intervalLoop) {
          this.restartLoopSlideShow();
        }
      },
    });

    this.durationLoopInputID = durationLoopInSecInput.id;
    durationLoopInSecDiv.appendChild(durationLoopInSecInput);

    const durationLoopInSecLabel = document.createElement('label');
    durationLoopInSecLabel.htmlFor = durationLoopInSecInput.id;
    durationLoopInSecLabel.innerHTML = 'Duration Loop (s)';
    durationLoopInSecDiv.appendChild(durationLoopInSecLabel);

    const counterLoopTimeDiv = document.createElement('div');
    counterLoopTimeDiv.id = 'counterLoopTimeDivSlideShow';
    counterLoopTimeDiv.innerHTML = this.durationLoopInSec;

    this.counterLoopTimeDivID = counterLoopTimeDiv.id;
    durationLoopInSecDiv.appendChild(counterLoopTimeDiv);

    const slideSelect = document.createElement('select');
    slideSelect.id = 'slideSelect';
    htmlSlideShow.appendChild(slideSelect);

    const unsetOptionSlide = document.createElement('option');
    unsetOptionSlide.value = 'null';
    unsetOptionSlide.innerHTML = 'Select config slide';
    slideSelect.appendChild(unsetOptionSlide);
    this.slideSelectID = slideSelect.id;

    const conf = this.configSlideShow;
    if (conf) {
      for (let i = 0; i < conf[Object.keys(conf)[0]].length; i++) {
        const element = conf[Object.keys(conf)[0]][i];
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = element.name;
        slideSelect.appendChild(option);
      }
      this.callbacksHTMLEl.push({
        event: 'change',
        id: slideSelect.id,
        cb: function (event) {
          this.setSlideshowInConfig(event.target.value);
        },
      });
    }

    this.htmlSlideShow = htmlSlideShow;
  }

  /**
   * It sets the size, coordinates and rotation inputs to the values of the extent
   */
  matchExtent() {
    const extentCenter = this.extent.center();
    this.setSizeInputs(
      new THREE.Vector2(
        Math.abs(this.extent.west - this.extent.east),
        Math.abs(this.extent.north - this.extent.south)
      )
    );
    let elevationZ = 0.1;

    const itownsViewLayers = this.itownsView.getLayers();
    for (let index = 0; index < itownsViewLayers.length; index++) {
      const layer = itownsViewLayers[index];
      if (layer.isElevationLayer) {
        elevationZ = layer.colorTextureElevationMaxZ;
        break;
      }
    }

    this.setCoordinatesInputs(
      new THREE.Vector3(extentCenter.x, extentCenter.y, elevationZ)
    );
    this.setRotationInputs(new THREE.Vector3(0, 0, 0));
  }

  /**
   * Add event listeners to input
   */
  initInputListener() {
    // Hide and show the geometryPlane
    this.inputManager.addKeyInput('h', 'keydown', () => {
      if (!this.plane) return;
      this.plane.visible = !this.plane.visible;
      this.itownsView.notifyChange();
    });

    // Change the next slide
    this.inputManager.addKeyInput('ArrowRight', 'keydown', () => {
      this.nextSlide();
      this.restartLoopSlideShow();
    });

    // Change the previous slide
    this.inputManager.addKeyInput('ArrowLeft', 'keydown', () => {
      this.previousSlide();
      this.restartLoopSlideShow();
    });

    this.inputManager.addKeyInput('s', 'keydown', () => {
      const htmlElement = document.getElementById(this.windowId); // -sale mais je veux rentrer chez moi

      if (!htmlElement) return;

      if (htmlElement.style.display == 'none') {
        htmlElement.style.display = '';
      } else {
        htmlElement.style.display = 'none';
      }
    });
  }

  nextSlide() {
    if (!this.plane) return;

    this.iCurrentTextureFile =
      (this.iCurrentTextureFile + 1) % this.texturesFiles.length; // Loop

    this.setTexture(this.iCurrentTextureFile);

    this.aspectRatioCheckboxDOM.dispatchEvent(new Event('change'));

    this.itownsView.notifyChange();
  }

  previousSlide() {
    if (!this.plane) return;

    this.iCurrentTextureFile =
      this.iCurrentTextureFile - 1 < 0
        ? this.texturesFiles.length - 1
        : this.iCurrentTextureFile - 1;

    this.setTexture(this.iCurrentTextureFile);

    this.aspectRatioCheckboxDOM.dispatchEvent(new Event('change'));

    this.itownsView.notifyChange();
  }

  /** Set the callback function of event 'drop' @warn !event.preventDefault! */
  initCBDrop() {
    const _this = this;
    const body = document.body;
    body.addEventListener('drop', function (event) {
      event.preventDefault();
      if (!_this.plane) return;
      _this.initDefaultTextureFile();
      const files = Array.from(event.dataTransfer.files);

      files.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          try {
            const reader = new FileReader();

            reader.onload = function (data) {
              if (file.type.includes('image/')) {
                new THREE.TextureLoader().load(
                  data.target.result,
                  function (texture) {
                    _this.texturesFiles.push({
                      index: i + 1,
                      name: file.name,
                      texture: texture,
                      size: {
                        height: texture.image.height,
                        width: texture.image.width,
                      },
                    });
                  }
                );
              } else if (file.type.includes('video/')) {
                const video = document.createElement('video');
                video.src = data.target.result;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.load();

                video.onloadedmetadata = function () {
                  const videoTexture = new THREE.VideoTexture(video);
                  // Rotate the video texture with
                  // videoTexture.center.set(0.5, 0.5);
                  // videoTexture.rotation = Math.PI / 2;
                  _this.texturesFiles.push({
                    index: i + 1,
                    name: file.name,
                    texture: videoTexture,
                    video: video,
                    size: {
                      height: video.videoHeight,
                      width: video.videoWidth,
                    },
                  });
                };
              }
            };

            reader.readAsDataURL(file);
          } catch (e) {
            throw new Error(e);
          }
        }
      }
      _this.setTexture(0);
    });

    body.addEventListener(
      'dragover',
      function (event) {
        event.preventDefault();
      },
      false
    );
  }

  /**
   * @param {Array.String} labels List of labels name
   * @param {string} vectorName Name of the vector
   * @param {number} step The step of HTMLElement input (type number)
   * @returns {{title:HTMLHeadingElement, inputVector:HTMLDivElement}} The `inputVector` 'div' contains labels and inputs HTMLElements
   */
  createInputVector(labels, vectorName, step = 0.5) {
    const titleVector = document.createElement('h3');
    titleVector.innerHTML = vectorName;

    const inputVector = document.createElement('div');
    inputVector.id = vectorName + '_inputVector';
    inputVector.style.display = 'grid';
    for (let iInput = 0; iInput < labels.length; iInput++) {
      const labelElement = document.createElement('label');
      labelElement.innerHTML = labels[iInput];

      const componentElement = document.createElement('input');
      componentElement.id = vectorName + labelElement.innerHTML;
      componentElement.type = 'number';
      componentElement.setAttribute('value', '0');
      componentElement.step = step;

      labelElement.htmlFor = componentElement.id;
      this.callbacksHTMLEl.push({
        event: 'change',
        id: componentElement.id,
        cb: function (event) {
          const value = event.target.value;
          const element = event.target;
          element.setAttribute('value', value);
          if (this.aspectRatioCheckboxDOM.checked)
            if (vectorName.toLowerCase().includes('size'))
              this.matchRatio(iInput, value);
          this.updateVectors();
        },
      });

      inputVector.appendChild(labelElement);
      inputVector.appendChild(componentElement);
    }
    return {
      title: titleVector,
      inputVector: inputVector,
    };
  }

  /**
   * Function called when aspectRatio is checked
   *
   * @param {number} iInput The index of the input element
   * @param {number} value The value of the input element
   */
  matchRatio(iInput, value) {
    const linkedSizeElement =
      this.sizeInputVectorDOM.getElementsByTagName('input')[
        iInput == 0 ? 1 : 0
      ];
    const height = this.currentTextureFile.size.height;
    const width = this.currentTextureFile.size.width;
    const ratio = width / height;
    const newValue = iInput == 0 ? value / ratio : value * ratio;

    linkedSizeElement.value = newValue;
  }

  /** Update vectors variables with the values contained in inputs elements in DOM */
  updateVectors() {
    this.coordinatesVector =
      this.inputVectorToVector(this.coordinatesInputVectorDOM) ||
      new THREE.Vector3();

    this.rotationVector =
      this.inputVectorToVector(this.rotationInputVectorDOM) ||
      new THREE.Vector3();

    this.sizeVector =
      this.inputVectorToVector(this.sizeInputVectorDOM) || new THREE.Vector2();

    this.modifyPlane();
  }

  /**
   * Convert inputVector HTMLElement to THREE.Vector
   *
   * @param {HTMLDivElement} inputVector HTMLElement 'div' contains labels and inputs HTMLElements
   * @returns {THREE.Vector} vector
   */
  inputVectorToVector(inputVector) {
    const inputEls = inputVector.getElementsByTagName('input');

    const countEls = inputEls.length;

    switch (countEls) {
      case 2:
        return new THREE.Vector2(inputEls[0].value, inputEls[1].value);
      case 3:
        return new THREE.Vector3(
          inputEls[0].value,
          inputEls[1].value,
          inputEls[2].value
        );
      case 4:
        return new THREE.Vector4(
          inputEls[0].value,
          inputEls[1].value,
          inputEls[2].value,
          inputEls[3].value
        );
    }

    return null;
  }

  /**
   * Set `this.currentTexture`
   *
   * @param {number} iText The index of the texture to set
   */
  setTexture(iText) {
    const _this = this;
    if (this.currentTextureFile && this.currentTextureFile.video) {
      this.currentTextureFile.video.pause();
      this.currentTextureFile.video.currentTime = 0;
      this.notifyValue = false;
    }

    this.texturesFiles.forEach(function (tf) {
      if (tf.index == iText) {
        _this.iCurrentTextureFile = tf.index;
        if (tf.video) {
          tf.video.play();
          _this.notifyValue = true;
        }
      }
    });

    this.currentTexture = this.currentTextureFile.texture;
    this.modifyPlane();
    this.itownsView.notifyChange();
  }

  /** Modify `this.plane` {THREE.Mesh} */
  modifyPlane() {
    if (!this.plane) {
      this.createPlane();
    }
    this.plane.position.set(
      this.coordinatesVector.x,
      this.coordinatesVector.y,
      this.coordinatesVector.z
    );

    this.plane.rotation.set(
      this.rotationVector.x,
      this.rotationVector.y,
      this.rotationVector.z
    );
    this.plane.scale.set(this.sizeVector.x, this.sizeVector.y, 1);
    this.plane.material.map = this.currentTexture || this.plane.material.map;

    this.plane.updateMatrixWorld();
    this.itownsView.scene.add(this.plane);
    this.itownsView.notifyChange();
  }

  /**
   * It creates a PlaneGeometry and a MeshBasicMaterial, to create the Mesh `this.plane`
   */
  createPlane() {
    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.MeshBasicMaterial({
      map: this.currentTextureFile.texture,
      side: THREE.DoubleSide,
    });

    this.plane = new THREE.Mesh(geometry, material);
  }

  /**
   * Loop through a slide show of textures
   *
   */
  loopSlideShow() {
    if (!this.loopCheckboxDOM.checked) return;
    const durationInMS = this.durationLoopInSec * 1000; // Loop event
    this.counterLoopTimeDivDOM.innerHTML = this.durationLoopInSec;
    this.intervalLoop = setInterval(() => {
      this.nextSlide();
    }, durationInMS);

    this.counterIntervalLoop = setInterval(() => {
      this.updateCounterLoop();
    }, 100);
  }

  updateCounterLoop() {
    const value = parseFloat(this.counterLoopTimeDivDOM.innerHTML);
    const newValue = value - 0.1 <= 0 ? this.durationLoopInSec : value - 0.1;
    this.counterLoopTimeDivDOM.innerHTML = newValue.toFixed(1);
  }

  stopLoopSlideShow() {
    clearInterval(this.intervalLoop);
    clearInterval(this.counterIntervalLoop);
  }

  restartLoopSlideShow() {
    this.stopLoopSlideShow();
    this.loopSlideShow();
  }

  // DOM GETTERS
  /* Return coordinates HTMLElements (inputs+labels) */
  get coordinatesInputVectorDOM() {
    return document.getElementById(this.coordinatesInputVectorID);
  }

  /* Return rotation HTMLElement (inputs+labels)*/
  get rotationInputVectorDOM() {
    return document.getElementById(this.rotationInputVectorID);
  }

  /* Return size HTMLElement (inputs+labels)*/
  get sizeInputVectorDOM() {
    return document.getElementById(this.sizeInputVectorID);
  }

  /* Return apspect ratio HTMLElement (checkbox)*/
  get aspectRatioCheckboxDOM() {
    return document.getElementById(this.aspectRatioCheckboxID);
  }

  get counterLoopTimeDivDOM() {
    return document.getElementById(this.counterLoopTimeDivID);
  }

  get loopCheckboxDOM() {
    return document.getElementById(this.loopSlideShowCheckboxID);
  }

  get innerContentHtml() {
    return this.htmlSlideShow.outerHTML;
  }

  get currentTextureFile() {
    return this.texturesFiles[this.iCurrentTextureFile];
  }

  // INPUTS ELEMENTS SETTERS
  /* Setting the values of the input fields in the DOM. */
  setSizeInputs(vec2) {
    const sizeInputEls = this.sizeInputVectorDOM.getElementsByTagName('input');

    if (vec2.x !== null) {
      const element0 = sizeInputEls[0];
      element0.value = vec2.x;
      element0.dispatchEvent(new Event('change'));
    }

    if (vec2.y !== null) {
      const element1 = sizeInputEls[1];
      element1.value = vec2.y;
      element1.dispatchEvent(new Event('change'));
    }
  }

  setCoordinatesInputs(vec3) {
    const coordinatesInputEls =
      this.coordinatesInputVectorDOM.getElementsByTagName('input');

    if (vec3.x !== null) {
      const element0 = coordinatesInputEls[0];
      element0.value = vec3.x;
      element0.dispatchEvent(new Event('change'));
    }
    if (vec3.y !== null) {
      const element1 = coordinatesInputEls[1];
      element1.value = vec3.y;
      element1.dispatchEvent(new Event('change'));
    }

    if (vec3.z !== null) {
      const element2 = coordinatesInputEls[2];
      element2.value = vec3.z || this.coordinatesVector.z;
      element2.dispatchEvent(new Event('change'));
    }
  }

  setRotationInputs(vec3) {
    const rotationInputEls =
      this.rotationInputVectorDOM.getElementsByTagName('input');

    if (vec3.x !== null) {
      const element0 = rotationInputEls[0];
      element0.value = vec3.x;
      element0.dispatchEvent(new Event('change'));
    }
    if (vec3.y !== null) {
      const element1 = rotationInputEls[1];
      element1.value = vec3.y;
      element1.dispatchEvent(new Event('change'));
    }
    if (vec3.z !== null) {
      const element2 = rotationInputEls[2];
      element2.value = vec3.z;
      element2.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Get size values contained in inputs elements in DOM
   *
   * @returns {{height:number,width:number}} sizevalues
   */
  getSizeValues() {
    const sizeInputEls = this.sizeInputVectorDOM.getElementsByTagName('input');
    return {
      height: parseInt(sizeInputEls[0].value),
      width: parseInt(sizeInputEls[1].value),
    };
  }

  /** It adds event listeners to the HTML elements created by the Window class.*/
  windowCreated() {
    // Through this.callbacksHTMLEl and addEventListeners to HTMLElements in DOM (elements which created by Window class)
    this.callbacksHTMLEl.forEach((element) => {
      const htmlElement = document.getElementById(element.id);
      htmlElement.addEventListener(element.event, element.cb.bind(this));
    });
    this.matchExtent();
  }

  windowDestroyed() {
    if (this.plane) {
      this.plane.removeFromParent();
      this.plane = null;
    }
    this.itownsView.notifyChange();
  }
}
