const THREE = require('three');
const { Component, Model } = require('./Component');

/**
 * Render object3D component
 *
 * @see module:Render
 */
const RenderComponent = class extends Component {};

RenderComponent.TYPE = 'Render';

/** @see module:Render */
const RenderModel = class extends Model {
  /**
   * Render object3D component model store data to render an object3D (in an external context), a render controller should be implemented to use it
   *
   * @param {object} json - json to configure render model
   * @param {string} json.uuid - uuid render model
   * @param {string=} json.idRenderData - id of render data (could be an id link to gltf, obj file)
   * @param {Array<number>} [json.color=[1,1,1]] - [r,g,b] format color
   */
  constructor(json) {
    super(json);

    /**
     * id of render data
     *
     *  @type {string}
     */
    this.idRenderData = json.idRenderData || null;

    /**
     * color to apply to the 3D model
     *
     * @type {THREE.Color}
     */
    this.color = new THREE.Color().fromArray(json.color || [1, 1, 1]);
  }

  /**
   *
   * @returns {object} - export render model to json object
   */
  toJSON() {
    return {
      uuid: this.uuid,
      type: RenderModel.TYPE,
      idRenderData: this.idRenderData,
      color: this.color.toArray(),
    };
  }

  /**
   *
   * @returns {THREE.Color} - render model color
   */
  getColor() {
    return this.color;
  }

  /**
   *
   * @param {THREE.Color} color - new color of render model
   */
  setColor(color) {
    this.color = color;
  }

  /**
   *
   * @param {string} value - new id render data of render model
   */
  setIdRenderData(value) {
    this.idRenderData = value;
  }

  /**
   *
   * @returns {string} - script model id render data
   */
  getIdRenderData() {
    return this.idRenderData;
  }
};
/**
 * `MODULE` Render
 *
 * @exports Render
 */
module.exports = {
  /** @see RenderComponent */
  Component: RenderComponent,
  /** @see RenderModel */
  Model: RenderModel,
};
