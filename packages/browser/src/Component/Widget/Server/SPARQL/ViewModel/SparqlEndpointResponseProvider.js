import { EventSender } from '@ud-viz/shared';
import { SparqlEndpointService } from '../Model/SparqlEndpointService';

/**
 * Creates a SPARQL Endpoint Provider which manages treating SPARQL endpoint
 * responses and events for a specific SPARQL Endpoint. Also contains helper
 * functions for manipulating RDF data.
 */
export class SparqlEndpointResponseProvider extends EventSender {
  /**
   * Creates a SPARQL Endpoint Provider
   *
   * @param {object} configSparql - config sparql need description
   */
  constructor(configSparql) {
    super();

    /**
     * The SPARQL Endpoint Service..
     *
     * @type {SparqlEndpointService}
     */
    this.service = new SparqlEndpointService(configSparql);

    this.registerEvent(
      SparqlEndpointResponseProvider.EVENT_ENDPOINT_RESPONSE_UPDATED
    );
  }

  /**
   * Query the SPARQL endpoint service
   *
   * @param {string} query - The query to send to the SPARQL endpoint.
   */
  async querySparqlEndpointService(query) {
    const response = await this.service.querySparqlEndpoint(query);
    await this.sendEvent(
      SparqlEndpointResponseProvider.EVENT_ENDPOINT_RESPONSE_UPDATED,
      JSON.parse(response.responseText)
    );
  }

  // //////////
  // /// EVENTS

  static get EVENT_ENDPOINT_RESPONSE_UPDATED() {
    return 'EVENT_ENDPOINT_RESPONSE_UPDATED';
  }
}
