import { EventSender } from '@ud-viz/shared';
import { CityObjectStyle } from '../../../Itowns/3DTiles/Model/CityObjectStyle';
import {
  CityObjectID,
  CityObject,
} from '../../../Itowns/3DTiles/Model/CityObject';
import { focusCameraOn } from '../../../Itowns/Component/Component';
import { LayerManager } from '../../../Itowns/LayerManager/LayerManager';
import { CityObjectFilter } from './CityObjectFilter';
import { CityObjectLayer } from './CityObjectLayer';
/**
 * The city object provider manages the city object by organizing them in two
 * categories : the _layer_ and the _selected city object_. The layer
 * represents a set of city objects to highlight, determined by a specific
 * filter.
 */
export class CityObjectProvider extends EventSender {
  /**
   * Constructs a city object provider, using a layer manager.
   *
   * @param {LayerManager} layerManager The layer manager.
   */
  constructor(layerManager) {
    super();
    /**
     * The tiles manager.
     *
     * @type {LayerManager}
     */
    this.layerManager = layerManager;

    /**
     * The available filters.
     *
     * @type {Object<string, CityObjectFilter>}
     */
    this.filters = {};

    /**
     * The current highlighted layer.
     *
     * @type {CityObjectLayer}
     */
    this.cityObjectLayer = undefined;

    /**
     * The array of city objects in the layer.
     *
     * @type {Array<CityObjectID>}
     */
    this.layerCityObjectIds = [];

    /**
     * The selected city object.
     *
     * @type {CityObject}
     */
    this.selectedCityObject = undefined;

    this.selectedTilesManager = undefined;

    this.selectedStyle = undefined;

    /**
     * The style applied to the selected city object.
     *
     * @type {CityObjectStyle | string}
     */
    this.defaultSelectionStyle = { materialProps: { color: 0x13ddef } };

    // Event registration
    this.registerEvent(CityObjectProvider.EVENT_FILTERS_UPDATED);
    this.registerEvent(CityObjectProvider.EVENT_LAYER_CHANGED);
    this.registerEvent(CityObjectProvider.EVENT_CITY_OBJECT_SELECTED);
    this.registerEvent(CityObjectProvider.EVENT_CITY_OBJECT_UNSELECTED);
    this.registerEvent(CityObjectProvider.EVENT_CITY_OBJECT_CHANGED);
  }

  // /////////////////////////
  // /// CITY OBJECT SELECTION

  /**
   * Selects a city object from a mouse event. If a city object is actually
   * under the mouse, the `EVENT_CITY_OBJECT_SELECTED` event is sent.
   *
   * @param {MouseEvent} mouseEvent The mouse click event.
   */
  selectCityObject(mouseEvent) {
    const cityObject = this.layerManager.pickCityObject(mouseEvent);
    if (cityObject) {
      this.sendEvent(CityObjectProvider.EVENT_CITY_OBJECT_SELECTED, cityObject);
      if (this.selectedCityObject != cityObject) {
        if (this.selectedCityObject) {
          this.sendEvent(
            CityObjectProvider.EVENT_CITY_OBJECT_CHANGED,
            cityObject
          );
          this.unselectCityObject(false);
        }

        this.selectedCityObject = cityObject;
        this.selectedTilesManager = this.layerManager.getTilesManagerByLayerID(
          this.selectedCityObject.tile.layer.id
        );
        this.selectedStyle =
          this.selectedTilesManager.styleManager.getStyleIdentifierAppliedTo(
            this.selectedCityObject.cityObjectId
          );
        this.selectedTilesManager.setStyle(
          this.selectedCityObject.cityObjectId,
          'selected'
        );
        this.selectedTilesManager.applyStyles({
          updateFunction: this.selectedTilesManager.view.notifyChange.bind(
            this.selectedTilesManager.view
          ),
        });
        this.removeLayer();
      }
    }
  }

  changeSelectedCityObject(cityObject) {
    this.sendEvent(CityObjectProvider.EVENT_CITY_OBJECT_SELECTED, cityObject);
    if (this.selectedCityObject != cityObject) {
      if (this.selectedCityObject) {
        this.sendEvent(
          CityObjectProvider.EVENT_CITY_OBJECT_CHANGED,
          cityObject
        );
        this.unselectCityObject(false);
      }

      this.selectedCityObject = cityObject;
      this.selectedTilesManager = this.layerManager.getTilesManagerByLayerID(
        this.selectedCityObject.tile.layer.id
      );
      this.selectedStyle =
        this.selectedTilesManager.styleManager.getStyleIdentifierAppliedTo(
          this.selectedCityObject.cityObjectId
        );
      this.selectedTilesManager.setStyle(
        this.selectedCityObject.cityObjectId,
        'selected'
      );
      this.selectedTilesManager.applyStyles({
        updateFunction: this.selectedTilesManager.view.notifyChange.bind(
          this.selectedTilesManager.view
        ),
      });
      this.removeLayer();
    }
  }

  focusOnObject(_verticalDistance = 200, _horizontalDistance = 200) {
    if (this.selectedTilesManager && this.selectedCityObject) {
      focusCameraOn(
        this.selectedTilesManager.view,
        this.selectedTilesManager.view.controls,
        this.selectedCityObject.centroid,
        {
          verticalDistance: _verticalDistance,
          horizontalDistance: _horizontalDistance,
        }
      );
    }
  }
  /**
   * Unset the selected city object and sends an `EVENT_CITY_OBJECT_SELECTED`
   * event.
   *
   * @param {boolean} sendEvent True if an event should be send when a city object is selected
   */
  unselectCityObject(sendEvent = true) {
    if (this.selectedCityObject) {
      this.selectedTilesManager.setStyle(
        this.selectedCityObject.cityObjectId,
        this.selectedStyle
      );
      this.selectedTilesManager.applyStyles();
    }
    if (sendEvent)
      this.sendEvent(
        CityObjectProvider.EVENT_CITY_OBJECT_UNSELECTED,
        this.selectedCityObject
      );
    this.selectedTilesManager = undefined;
    this.selectedStyle = undefined;
    this.selectedCityObject = undefined;
  }

  /**
   * Select a city object based on a corresponding key,value pair in the batch table.
   *
   * @param {string} key the batch table key to search by.
   * @param {string} value the batch table value to search for.
   */
  selectCityObjectByBatchTable(key, value) {
    const cityObject = this.layerManager.pickCityObjectByBatchTable(key, value);
    if (cityObject) {
      if (this.selectedCityObject != cityObject) {
        if (this.selectedCityObject) {
          this.sendEvent(
            CityObjectProvider.EVENT_CITY_OBJECT_CHANGED,
            cityObject
          );
          this.unselectCityObject();
        } else {
          this.sendEvent(
            CityObjectProvider.EVENT_CITY_OBJECT_SELECTED,
            cityObject
          );
        }
        this.selectedCityObject = cityObject;
        this.selectedTilesManager = this.layerManager.getTilesManagerByLayerID(
          this.selectedCityObject.tile.layer.id
        );
        this.selectedStyle =
          this.selectedTilesManager.styleManager.getStyleIdentifierAppliedTo(
            this.selectedCityObject.cityObjectId
          );
        this.selectedTilesManager.setStyle(
          this.selectedCityObject.cityObjectId,
          'selected'
        );
        this.selectedTilesManager.applyStyles({
          updateFunction: this.selectedTilesManager.view.notifyChange.bind(
            this.selectedTilesManager.view
          ),
        });
        this.removeLayer();
      }
    }
  }

  /**
   * Sets the style for the selected city object.
   *
   * @param {CityObjectStyle | string} style The style.
   */
  setSelectionStyle(style) {
    this.defaultSelectionStyle = style;
    this.layerManager.registerStyle('selected', style);
  }

  // ///////////
  // /// FILTERS

  /**
   * Adds a filter to the dictionnary of available filters. The key shall be
   * the `label` attribute of the filter. After that, the
   * `EVENT_FILTERS_UPDATED` event is sent.
   *
   * @param {CityObjectFilter} cityObjectFilter The filter to add.
   */
  addFilter(cityObjectFilter) {
    const label = cityObjectFilter.label;

    if (this.filters[label] !== undefined) {
      throw 'A filter with this label already exists : ' + label;
    }

    this.filters[label] = cityObjectFilter;

    this.sendEvent(CityObjectProvider.EVENT_FILTERS_UPDATED, this.filters);
  }

  /**
   * Returns the currently available filters.
   *
   * @returns {Array<CityObjectFilter>} The currently available filters.
   */
  getFilters() {
    return Object.values(this.filters);
  }

  // ////////////////////
  // /// LAYER MANAGEMENT

  /**
   * Sets the current layer. The layer is defined by a filter (ie. a set
   * of city objects) and a style. Sends the `EVENT_LAYER_CHANGED` event.
   *
   * @param {string} filterLabel Label of the filter that defines the layer.
   * The filter must first be registered using `addFilter`.
   * @param {CityObjectStyle | string} style The style to associate to the
   * layer.
   */
  setLayer(filterLabel, style) {
    const filter = this.filters[filterLabel];

    if (filter === undefined) {
      throw 'No filter found with the label : ' + filterLabel;
    }

    this.cityObjectLayer = new CityObjectLayer(filter, style);

    this.sendEvent(CityObjectProvider.EVENT_LAYER_CHANGED, filter);

    this.unselectCityObject();

    this.applyStyles();
  }

  /**
   * Returns the current layer.
   *
   * @returns {CityObjectLayer} The current layer.
   */
  getLayer() {
    return this.cityObjectLayer;
  }

  /**
   * Unsets the current layer. Sends the `EVENT_LAYER_CHANGED` event.
   */
  removeLayer() {
    this.cityObjectLayer = undefined;
    this.sendEvent(CityObjectProvider.EVENT_LAYER_CHANGED, undefined);
    this.applyStyles();
  }

  /**
   * Updates the tiles manager so that it has the correct styles associated with
   * the right city objects.
   *
   * @private
   */
  _updateTilesManager() {
    if (this.selectedCityObject) {
      const tileManager = this.layerManager.getTilesManagerByLayerID(
        this.selectedCityObject.tile.layer.id
      );

      if (this.cityObjectLayer === undefined) {
        this.layerCityObjectIds = [];
      } else {
        this.layerCityObjectIds = tileManager
          .findAllCityObjects(this.cityObjectLayer.filter.accepts)
          .map((co) => co.cityObjectId);

        tileManager.setStyle(
          this.layerCityObjectIds,
          this.cityObjectLayer.style
        );
      }

      tileManager.setStyle(
        this.selectedCityObject.cityObjectId,
        this.defaultSelectionStyle
      );
    }
  }

  /**
   * Apply the styles to the tiles manager. This function is necessary as the
   * event for tile loading does not exist yet. In the future, it shouldn't be
   * necessary to manually call this function.
   */
  applyStyles() {
    this._updateTilesManager();
    this.layerManager.applyAll3DTilesStyles();
  }

  // //////////
  // /// EVENTS

  static get EVENT_FILTERS_UPDATED() {
    return 'EVENT_FILTERS_UPDATED';
  }

  static get EVENT_LAYER_CHANGED() {
    return 'EVENT_LAYER_CHANGED';
  }

  static get EVENT_CITY_OBJECT_SELECTED() {
    return 'EVENT_CITY_OBJECT_SELECTED';
  }

  static get EVENT_CITY_OBJECT_UNSELECTED() {
    return 'EVENT_CITY_OBJECT_UNSELECTED';
  }

  static get EVENT_CITY_OBJECT_CHANGED() {
    return 'EVENT_CITY_OBJECT_CHANGED';
  }
}
