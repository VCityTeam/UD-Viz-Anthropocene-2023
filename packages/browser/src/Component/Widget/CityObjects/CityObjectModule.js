import { CityObjectStyle } from '../../Itowns/3DTiles/Model/CityObjectStyle';
import { CityObjectProvider } from './ViewModel/CityObjectProvider';
import { CityObjectWindow } from './View/CityObjectWindow';

/**
 * @callback ActionCB
 * @param {any} data
 * @returns {any}
 */

/**
 * Manages the city objects and allows the user to visualize them with
 * filters. Other modules can extend the functionnalities of the city object
 * module by adding filters.
 */
export class CityObjectModule {
  /**
   * Manages the city objects and allows the user to visualize them with
   * filters. Other modules can extend the functionnalities of the city object
   * module by adding filters.
   *
   * @param {import("../../Itowns/LayerManager/LayerManager").LayerManager} layerManager The layer manager.
   * @param {object} configCityObjects The city objects config.
   * @param {Object<string, CityObjectStyle>} configCityObjects.styles The
   * city object styles.
   * @param {CityObjectStyle} configCityObjects.styles.layerDefault The default
   * style for the layer.
   * @param {CityObjectStyle} configCityObjects.styles.selection The style
   * for the selected city object.
   */
  constructor(layerManager, configCityObjects) {
    /**
     * The city object provider, whichs manages the city objects in terms
     * of layer and selected city object.
     */
    this.provider = new CityObjectProvider(layerManager);
    this.provider.setSelectionStyle(configCityObjects.styles.selection);

    /**
     * The city object view. It consist of a main window, called the city
     * object window.
     */
    this.view = new CityObjectWindow(this.provider);
    this.view.setDefaultLayerStyle(configCityObjects.styles.layerDefault);
  }

  /**
   * Adds an event listener to the city object provider.
   *
   * @param {string} event The event of the city object provider.
   * @param {ActionCB} action The listener method.
   */
  addEventListener(event, action) {
    this.provider.addEventListener(event, action);
  }

  /**
   * Removes the event listener from the city object provider.
   *
   * @param {ActionCB} action The listener to remove.
   */
  removeEventListener(action) {
    this.provider.removeEventListener(action);
  }

  /**
   * Creates a new extension for the city object window. An extension is
   * a piece of HTML identified by a label.
   *
   * @param {string} label The extension label.
   * @param {object} options The options for the extension.
   * @param {string} options.type The type of the extension. Can either be
   * `button` or `div`.
   * @param {string} options.html The inner HTML content for the extension. If
   * this is a `button`, it represents the displayed text. If this is a `div`,
   * it represents the inner HTML content.
   * @param {string} options.container The label of the parent container.
   * @param {Function} [options.oncreated] A callback triggered when the
   * HTML elements of the extension is effectively created.
   * @param {Function} [options.callback] The callback to call when the user
   * clicks on a `button` extension. This has no effects on `div` extensions.
   */
  addExtension(label, options) {
    this.view.addExtension(label, options);
  }

  /**
   * Removes an existing extension in the city object window.
   *
   * @param {string} label The extension label.
   */
  removeExtension(label) {
    this.view.removeExtension(label);
  }

  /**
   * Removes an existing extension in the city object window.
   *
   * @param {string} label The extension label.
   * @returns {boolean} True if the extension is used
   */
  isExtensionUsed(label) {
    return this.view.isExtensionUsed(label);
  }

  /**
   * Adds a filter selector in the city object filter window.
   *
   * @param {import("./View/CityObjectFilterSelector").CityObjectFilterSelector} filterSelector The filter selector to
   * add.
   */
  addFilterSelector(filterSelector) {
    this.view.addFilterSelector(filterSelector);
  }
}
