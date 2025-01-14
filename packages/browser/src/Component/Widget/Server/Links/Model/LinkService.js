import { RequestService } from '../../Component/RequestService';
import { Link } from './Link';

/**
 * This class is used to perform requests concerning links.
 */
export class LinkService {
  /**
   * Creates a link service Service.
   *
   * @param {RequestService} requestService The request service.
   * @param {object} configServer The server configuration.
   * @param {string} configServer.url The server URL.
   * @param {string} configServer.link The link route.
   */
  constructor(requestService, configServer) {
    /**
     * Request service used to perform REST calls.
     */
    this.requestService = requestService;

    /**
     * GET url to retrieve supported link types.
     * GET url/<type> to retrieve links of this type.
     * POST url/<type> to create a link of this type.
     */
    this.linkURL = `${configServer.url}${configServer.link}`;
  }

  /**
   * Return supported link types.
   *
   * @returns {Promise<Array<string>>} An array containing the supported link
   * types.
   */
  async getSupportedLinkTypes() {
    const req = await this.requestService.request('GET', this.linkURL, {
      authenticate: false,
    });
    const types = JSON.parse(req.response);
    return types;
  }

  /**
   * Retrieves all links matching the given link type and filters.
   *
   * @param {string} linkType A supported link type.
   * @param {FormData} [filters] Filtering criteria for the link. Possible filters
   * are `source_id` (which must be a document id) and `target_id` (an ID of
   * type `linkType`).
   * @returns {Promise<Array<Link>>} An array of links.
   */
  async getLinks(linkType, filters = null) {
    const url = `${this.linkURL}/${linkType}`;
    const req = await this.requestService.request('GET', url, {
      authenticate: false,
      urlParameters: filters,
    });
    const links = JSON.parse(req.response);
    return links;
  }

  /**
   * Creates a new link with the given type.
   *
   * @param {string} linkType A supported link type.
   * @param {FormData} formData Properties of the created link. It must include
   * `source_id` (the document id) and `target_id` (ID of the target of type
   * `linkType`)
   */
  async createLink(linkType, formData) {
    const url = `${this.linkURL}/${linkType}`;
    const req = await this.requestService.request('POST', url, {
      authenticate: false,
      body: formData,
    });
    const created = JSON.parse(req.response);
    return created;
  }

  /**
   * Deletes a link of the given type with the given ID.
   *
   * @param {string} linkType A supported link type.
   * @param {number} linkId ID of the link to delete.
   */
  async deleteLink(linkType, linkId) {
    const url = `${this.linkURL}/${linkType}/${linkId}`;
    const req = await this.requestService.request('DELETE', url, {
      authenticate: false,
    });
    const deleted = JSON.parse(req.response);
    return deleted;
  }
}
