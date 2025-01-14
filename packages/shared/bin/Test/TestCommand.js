const Shared = require('../../src/index');

const COMMAND_TYPE = 'cmd_type';

const gameContext = new Shared.Game.Context(
  {
    CommandTest: class extends Shared.Game.ScriptBase {
      constructor(context, object3D, variables) {
        super(context, object3D, variables);
      }

      tick() {
        this.context.getCommands().forEach((cmd) => {
          switch (cmd.getType()) {
            case COMMAND_TYPE:
              console.log(cmd);
              process.exit(0);
              break;
            default:
              throw new Error('cmd type');
          }
        });
      }
    },
  },
  new Shared.Game.Object3D({
    object: {
      name: 'Command Test',
      components: {
        GameScript: {
          idScripts: ['CommandTest'],
        },
      },
    },
  })
);

gameContext.load().then(() => {
  const processInterval = new Shared.ProcessInterval({ fps: 51 });
  processInterval.start((dt) => {
    gameContext.step(dt);
  });

  // wait a bit and send a command
  setTimeout(() => {
    gameContext.onCommand([
      new Shared.Command({
        type: COMMAND_TYPE,
      }),
    ]);
  }, 1000);
});
