/** @format */

const THREE = require('three');

const WorldScriptModule = class WorldScript {
  constructor(parent, json) {
    this.parent = parent;
    this.uuid = json.uuid || THREE.MathUtils.generateUUID();
    this.idScripts = json.idScripts || [];
    this.type = json.type || WorldScriptModule.TYPE;
    this.conf = json.conf || {};

    //internal
    this.scripts = {};
  }

  getConf() {
    return this.conf;
  }

  initAssets(assetsManager, udvShared) {
    const _this = this;
    this.idScripts.forEach(function (id) {
      const constructor = assetsManager.fetchWorldScript(id);
      _this.scripts[id] = new constructor(_this.conf, udvShared);
    });
  }

  execute(event, params) {
    const _this = this;

    this.idScripts.forEach(function (idScript) {
      _this.executeScript(idScript, event, params);
    });
  }

  executeScript(id, event, params) {
    let s = this.scripts[id];

    if (s[event]) {
      return s[event].apply(s, [this.parent].concat(params));
    } else {
      return null;
    }
  }

  getScripts() {
    return this.scripts;
  }

  isServerSide() {
    return true;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      idScripts: this.idScripts,
      conf: this.conf,
      type: WorldScriptModule.TYPE,
    };
  }
};

WorldScriptModule.TYPE = 'WorldScript';
WorldScriptModule.EVENT = {
  INIT: 'init', //when added
  TICK: 'tick', //every tick
  LOAD: 'load', //at world load return promises
  ON_ENTER_COLLISION: 'onEnterCollision', //first collsion
  IS_COLLIDING: 'isColliding', //is colliding
  ON_LEAVE_COLLISION: 'onLeaveCollision', //on leave collision
};

module.exports = WorldScriptModule;