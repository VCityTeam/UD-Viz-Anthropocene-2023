const THREE = require('three');

const ComponentModule = class Component {
  constructor(model) {
    this.model = model;
    this.controller = null; // will be initialize by assetsManager
  }

  getModel() {
    return this.model;
  }

  getController() {
    return this.controller;
  }

  initController(controller) {
    this.controller = controller;
  }
};

const ModelModule = class Model {
  constructor(json) {
    // Uuid
    this.uuid = json.uuid || THREE.MathUtils.generateUUID();
  }

  getUUID() {
    return this.uuid;
  }

  isWorldComponent() {
    throw 'Your model should implement a isWorldComponent function';
  }
};

const ControllerModule = class Controller {
  constructor(assetsManager, model) {
    this.assetsManager = assetsManager;
    this.model = model;
  }
};

module.exports = {
  Component: ComponentModule,
  Controller: ControllerModule,
  Model: ModelModule,
};