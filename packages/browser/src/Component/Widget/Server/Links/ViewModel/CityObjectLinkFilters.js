import { CityObject } from '../../../../Itowns/3DTiles/Model/CityObject';
import { CityObjectFilter } from '../../../CityObjects/ViewModel/CityObjectFilter';
import { LinkProvider } from './LinkProvider';

/**
 * A filter for city objects based how many documents are linked to them.
 */
export class LinkCountFilter extends CityObjectFilter {
  /**
   * Instantiates the filter.
   *
   * @param {LinkProvider} linkProvider The link provider.
   */
  constructor(linkProvider) {
    super('linkCount');

    /**
     * The minimum required count of linked documents.
     */
    this.requiredCount = 1;

    /**
     * The link provider
     *
     * @type {LinkProvider}
     */
    this.provider = linkProvider;
  }

  /**
   * Accepts city objects that have at least `this.requiredCount` linked
   * documents.
   *
   * @param {CityObject} cityObject The CItyObject
   * @returns {boolean} True if the CItyObject is accepted
   */
  accepts(cityObject) {
    const linkCount = this.provider.getLinksFromCityObject(cityObject).length;
    return linkCount >= this.requiredCount;
  }

  /**
   * Returns the required count of linked documents as string
   *
   * @returns {string} Required linked documents as string
   */
  toString() {
    let str = 'At least ' + this.requiredCount + ' linked document';
    if (this.requiredCount > 1) {
      str += 's';
    }
    return str;
  }
}

/**
 * A filter for city objects based on wether they are linked with the currently
 * displayed document.
 */
export class LinkedWithDisplayedDocumentFilter extends CityObjectFilter {
  /**
   * Instantiates the filter.
   *
   * @param {LinkProvider} linkProvider The link provider.
   */
  constructor(linkProvider) {
    super('linkDisplayedDoc');

    /**
     * The link provider.
     *
     * @type {LinkProvider}
     */
    this.provider = linkProvider;
  }

  /**
   * Accepts city objects that are linked with the currently displayed document.
   *
   * @param {CityObject} cityObject The CityObject
   * @returns {boolean} True if the CityObject is accepted
   */
  accepts(cityObject) {
    const found = this.provider
      .getDisplayedDocumentLinks()
      .find(
        (link) => link.target_id == cityObject.props['cityobject.database_id']
      );
    return !!found;
  }

  /**
   * Return a string saying the cityObject is linked to the displayed document
   *
   * @returns {string} String 'Linked to the displayed document'
   */
  toString() {
    return 'Linked to the displayed document';
  }
}

/**
 * A filter for city objects based on wether they are linked with the currently
 * filtered documents.
 */
export class LinkedWithFilteredDocumentsFilter extends CityObjectFilter {
  /**
   * Instantiates the filter.
   *
   * @param {LinkProvider} linkProvider The link provider.
   */
  constructor(linkProvider) {
    super('linkFilteredDocs');

    /**
     * The link provider.
     *
     * @type {LinkProvider}
     */
    this.provider = linkProvider;
  }

  /**
   * Accepts city objects that are linked with the currently filtered documents.
   *
   * @param {CityObject} cityObject The CityObect
   * @returns {boolean} True if the CityObject is accepted
   */
  accepts(cityObject) {
    const found = this.provider
      .getFilteredDocumentsLinks()
      .find(
        (link) => link.target_id == cityObject.props['cityobject.database_id']
      );
    return !!found;
  }

  /**
   * Return a string saying the cityObject is linked to the filtered documents
   *
   * @returns {string} String 'Linked to the filtered documents'
   */
  toString() {
    return 'Linked to the filtered documents';
  }
}
