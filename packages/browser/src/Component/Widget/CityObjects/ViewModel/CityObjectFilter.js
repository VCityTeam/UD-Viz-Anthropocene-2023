/**
 * @callback FilterCityObjects
 * @param {boolean} accepts - check if the cityObject is acceptable
 */
/**
 * Represents a filter for city objects. It is basically a function that takes
 * a city object and returns wether it is acceptable.
 */
export class CityObjectFilter {
  /**
   * Constructs a new city object filter, from an acceptation function. If no
   * acceptation function was provided, the filter accepts all city objects.
   *
   * @param {string} label The unique label identifying the filter.
   * @param {FilterCityObjects} accepts The function responsible to
   * filter the city objects. It must evaluate wether a city object is
   * acceptable according to the filter.
   */
  constructor(label, accepts) {
    /**
     * The unique identifier of the filter.
     *
     * @type {string}
     */
    this.label = label;

    if (typeof accepts === 'function') {
      this.accepts = accepts;
    } else {
      // Necessary if inheritance is used, I'm not sure why though
      this.accepts = this.accepts.bind(this);
    }
  }

  /**
   * The function responsible to filter the city objects. It evaluates wether
   * a city object is acceptable according to the filter.
   *
   * @returns {boolean} Wether the city object is acceptable.
   */
  accepts() {
    return true;
  }

  /**
   * Returns a descriptive string of the filter. By default, it returns the
   * label.
   *
   * @returns {string} The label of the filter
   */
  toString() {
    return this.label;
  }
}
