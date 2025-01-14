import { DocumentProvider } from '../../Documents/ViewModel/DocumentProvider';
import { Document } from '../../Documents/Model/Document';
import { RequestService } from '../../Component/RequestService';

/**
 * This class performs the requests on the server to update and create
 * documents.
 */
export class ContributeService {
  /**
   * Creates a contribute service.
   *
   * @param {RequestService} requestService The request service.
   * @param {DocumentProvider} provider The document provider.
   * @param {object} configServer The server configuration.
   * @param {string} configServer.url The server url.
   * @param {string} configServer.document The base route for documents.
   */
  constructor(requestService, provider, configServer) {
    /**
     * The request service.
     *
     * @type {RequestService}
     */
    this.requestService = requestService;

    /**
     * The document provider.
     *
     * @type {DocumentProvider}
     */
    this.provider = provider;

    /**
     * The UD-Viz configuration.
     *
     * @type {{
     *  server: {
     *    url: string,
     *    document: string
     *  }
     * }}
     */
    this.configServer = configServer;

    /**
     * The base URL for documents.
     *
     * @type {string}
     */
    this.documentUrl = this.configServer.url;
    if (!this.documentUrl.endsWith('/')) {
      this.documentUrl += '/';
    }
    this.documentUrl += this.configServer.document;
  }

  /**
   * Sends the request to update the document.
   *
   * @param {FormData} updatedData The updated document data.
   * @returns {Document} The updated document.
   */
  async updateDocument(updatedData) {
    // Get current doc data and id
    const currentDoc = this.provider.getDisplayedDocument();
    const id = currentDoc.id;

    const url = this.documentUrl + '/' + id;

    const response = await this.requestService.request('PUT', url, {
      body: updatedData,
    });

    if (response.status >= 200 && response.status < 300) {
      const updated = JSON.parse(response.responseText);
      await this.provider.refreshDocumentList();
      this.provider.setDisplayedDocument(updated);
      return updated;
    }
    throw response.statusText;
  }

  /**
   * Sends the request to create the document.
   *
   * @param {FormData} creationData The document data.
   * @returns {Document} The created document.
   */
  async createDocument(creationData) {
    const response = await this.requestService.request(
      'POST',
      this.documentUrl,
      {
        body: creationData,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const created = JSON.parse(response.responseText);
      await this.provider.refreshDocumentList();
      return created;
    }
    throw response.statusText;
  }

  /**
   * Sends the request to delete the current document.
   */
  async deleteDocument() {
    const currentDoc = this.provider.getDisplayedDocument();
    const id = currentDoc.id;

    const url = this.documentUrl + '/' + id;

    const response = await this.requestService.request('DELETE', url);

    if (response.status >= 200 && response.status < 300) {
      await this.provider.refreshDocumentList();
      return;
    }
    throw response.statusText;
  }
}
