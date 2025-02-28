/**
 * Implements the bounding volume part of the 3DTILES_temporal
 * extension. See the spec in
 * ./jsonSchemas/3DTILES_temporal.boundingVolume.schema.json
 *
 */

/** @class */
export class $3DTemporalBoundingVolume {
  /**
   * Verifies the integrity and stores the data corresponding to the
   * bounding volume part of the 3DTiles_temporal extension.
   *
   * @param {object} json The json containing the 3DTiles_temporal
   * extension bounding volume part for a given tile.
   */
  constructor(json) {
    if (!json.startDate) {
      console.error(
        '3D Tiles bounding volume temporal extension ' +
          'requires a startDate. Refer to the spec.'
      );
    }
    if (!json.endDate) {
      console.error(
        '3D Tiles bounding volume temporal extension ' +
          'requires an endDate. Refer to the spec.'
      );
    }
    /** @type {number} */
    this.startDate = json.startDate;
    /** @type {number} */
    this.endDate = json.endDate;
  }
}
