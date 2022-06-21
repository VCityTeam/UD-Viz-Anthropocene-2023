/** @format */

/**
 * Object computed by the InputManager and pass to a WorldContext for the World simulation
 */
const CommandModule = class Command {
  constructor(json) {
    if (!json) throw new Error('no json');

    //type of the command
    this.type = json.type;

    //uuid of the user (TODO remove this for a single uuid)
    this.userID = json.userID;

    //uuid of the gameobject concerned by this (TODO use a single uuid)
    this.gameObjectUUID = json.gameObjectUUID;

    //data of the command (optional)
    this.data = json.data || null;
  }

  /**
   *
   * @returns {JSON}
   */
  getData() {
    return this.data;
  }

  /**
   *
   * @returns {Command.TYPE}
   */
  getType() {
    return this.type;
  }

  /**
   *
   * @param {String} id
   */
  setGameObjectUUID(id) {
    this.gameObjectUUID = id;
  }

  /**
   *
   * @returns {String}
   */
  getGameObjectUUID() {
    return this.gameObjectUUID;
  }

  /**
   *
   * @param {String} userID
   */
  setUserID(userID) {
    this.userID = userID;
  }

  /**
   *
   * @returns {String}
   */
  getUserID() {
    return this.userID;
  }

  /**
   * Compute this to JSON
   * @returns {JSON}
   */
  toJSON() {
    return {
      type: this.type,
      gameObjectUUID: this.gameObjectUUID,
      userID: this.userID,
      data: this.data,
    };
  }
};

CommandModule.TYPE = {
  MOVE_FORWARD_START: 'move_forward_start',
  MOVE_FORWARD_END: 'move_forward_end',
  MOVE_BACKWARD_START: 'move_backward_start',
  MOVE_BACKWARD_END: 'move_backward_end',
  MOVE_LEFT_START: 'move_left_start',
  MOVE_LEFT_END: 'move_left_end',
  MOVE_RIGHT_START: 'move_right_start',
  MOVE_RIGHT_END: 'move_right_end',
  MOVE_FORWARD: 'move_forward',
  MOVE_BACKWARD: 'move_backward',
  MOVE_LEFT: 'move_left',
  MOVE_RIGHT: 'move_right',
  ROTATE: 'rotate',
  MOVE_TO: 'move_to',
  Z_UPDATE: 'z_update',
  ESCAPE: 'escape',
  TELEPORT: 'teleport',
};

module.exports = CommandModule;
