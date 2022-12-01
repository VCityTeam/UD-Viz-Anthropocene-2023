/** @format */

import * as itowns from 'itowns';

// Components
import { Window } from '../Components/GUI/js/Window';

export class BaseMap extends Window {
  /**
   * Manages multiple WMS sources used as Itowns ColoLayer for background
   *
   * @param {itownsView}itownsView An ItownsView.
   * @param {object} config.baseMapLayers The baseMapLayers
   * @param {appExtent} vec3 The extent used to set up the layers
   * @param {appProjection} string The projection used to set up the layers
   * @param baseMapLayers
   * @param appExtent
   * @param appProjection
   */
  constructor(itownsView, baseMapLayers, appExtent, appProjection) {
    super('baseMap', 'base Map', false);
    this.appExtent = appExtent;
    this.appProjection = appProjection;
    this.baseMapLayers = baseMapLayers;
    this.itownsView = itownsView;
    this.createLayers();
  }

  windowCreated() {
    this.window.style.left = '10px';
    this.window.style.top = 'unset';
    this.window.style.bottom = '10px';
    this.window.style.width = '270px';
    this.displayLayersImage();
  }

  /**
   * Create a WMSSource and an Itowns ColorLayer from each baseMapLayer.
   * The first added is visible.
   */
  createLayers() {
    let i = 0;
    for (const layer of this.baseMapLayers) {
      layer.id = 'baseMapLayer_' + i;
      const source = new itowns.WMSSource({
        extent: this.appExtent,
        name: layer.name,
        url: layer.url,
        version: layer.version,
        crs: this.appProjection,
        format: 'image/jpeg',
      });
      // Add a WMS imagery layer
      const colorLayer = new itowns.ColorLayer(layer.id, {
        updateStrategy: {
          type: itowns.STRATEGY_DICHOTOMY,
          options: {},
        },
        source: source,
        transparent: true,
      });
      if (i != 0) colorLayer.visible = false;
      this.itownsView.addLayer(colorLayer);
      itowns.ColorLayersOrdering.moveLayerToIndex(this.itownsView, layer.id, i);
      i++;
    }
  }
  /**
   * Display in the widget an image of the Layer, referenced in the field layer.id.
   * It can either be an external URL or an image in the asset folder
   */
  displayLayersImage() {
    for (const layer of this.baseMapLayers) {
      const new_img = document.createElement('img');
      new_img.src = layer.image;
      new_img.id = layer.id + '_img';
      new_img.width = 250;
      new_img.height = 200;
      new_img.onclick = () => this.changeVisibleLayer(layer.id);
      this.baseDivElement.appendChild(new_img);
    }
  }

  changeVisibleLayer(layerID) {
    for (const layer of this.baseMapLayers) {
      this.itownsView.getLayerById(layer.id).visible = layer.id == layerID;
    }
    this.itownsView.notifyChange();
  }

  get innerContentHtml() {
    return /* html*/ `
    <div id="${this.baseDivId}"></div>
    `;
  }

  get baseDivId() {
    return `${this.windowId}_baseMap_div`;
  }

  get baseDivElement() {
    return document.getElementById(this.baseDivId);
  }
}
