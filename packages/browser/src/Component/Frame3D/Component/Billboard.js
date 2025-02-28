import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Color } from 'three';

/**
 * Material making an "hole" in a {@link THREE.Scene} to see html css3D behind
 *
 * @type {THREE.MeshBasicMaterial}
 */
const BLANK_MATERIAL = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  opacity: 0,
  transparent: true,
  blending: THREE.NoBlending,
  color: new Color(0, 0, 0),
});
/** @class */
export class Billboard {
  /**
   * Composed of a {@link CSS3DObject} containing html and a {@link THREE.Object3D} superposing each other
   *
   * @param {HTMLElement} html - html of billboard
   * @param {THREE.Vector3} position - position in world referential
   * @param {THREE.Vector3} rotation - rotation in world referential
   * @param {THREE.Vector3} scale - scale in world referential
   * @param {number} [resolution=1] - increase size of html element
   */
  constructor(html, position, rotation, scale, resolution = 1) {
    /**
     * uuid
     *
      @type {string} */
    this.uuid = THREE.MathUtils.generateUUID();

    /**
     * html element of css3Dobject
     *
      @type {HTMLElement} */
    this.html = html;

    // scale html size
    this.html.style.width = resolution * scale.x + 'px';
    this.html.style.height = resolution * scale.y + 'px';

    // initialize css3Dobject
    const newElement = new CSS3DObject(this.html);
    newElement.position.copy(position);
    newElement.rotation.setFromVector3(rotation);

    const css3DScale = scale.clone();
    css3DScale.x *= 1 / resolution;
    css3DScale.y *= 1 / resolution;
    css3DScale.z *= 1 / resolution;

    newElement.scale.copy(css3DScale);

    /**
     * css3D object
     *
      @type {CSS3DObject}  */
    this.css3DObject = newElement;

    // initiliaze THREE.Object3D (mask)
    const geometry = new THREE.PlaneGeometry(scale.x, scale.y);
    const plane = new THREE.Mesh(geometry, BLANK_MATERIAL);
    plane.position.copy(position);
    plane.rotation.setFromVector3(rotation);
    plane.scale.copy(scale);
    plane.updateMatrixWorld();

    /**
     * mask superposing css3DObject
     *
      @type {THREE.Object3D} */
    this.maskObject = plane;

    /**
     * selected (css style is different if true or false)
     *
      @type {boolean} */
    this.isSelected = false;
    this.select(this.isSelected);
  }

  /**
   *
   * @returns {HTMLElement} - html element
   */
  getHtml() {
    return this.html;
  }

  /**
   * Set if this is selected or not and update css style
   *
   * @param {boolean} value - new selected value
   */
  select(value) {
    this.isSelected = value;
    if (value) {
      this.html.style.filter = 'grayscale(0%)';
    } else {
      this.html.style.filter = 'grayscale(100%)';
    }
  }

  /**
   * Optionally, the x, y and z components of the world space position. Rotates the object to face a point in world space. This method does not support objects having non-uniformly-scaled parent(s).
   *
   * @param {THREE.Vector3} vector - vector to lookAt
   */
  lookAt(vector) {
    this.maskObject.lookAt(vector);
    this.css3DObject.lookAt(vector);
  }

  /**
   *
   * @returns {THREE.Object3D} - mask object3D
   */
  getMaskObject() {
    return this.maskObject;
  }

  /**
   *
   * @returns {CSS3DObject} - css3D object
   */
  getCss3DObject() {
    return this.css3DObject;
  }
}
