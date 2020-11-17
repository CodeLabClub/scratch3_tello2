const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const AdapterBaseClient = require("../scratch3_eim/codelab_adapter_base.js");

const blockIconURI = require("./icon_logo.png");
const menuIconURI = blockIconURI;
/**
 * Enum for button parameter values.
 * @readonly
 * @enum {string}
 */

const NODE_ID = "eim/node_tello2";
const HELP_URL = "https://adapter.codelab.club/extension_guide/tello2/";

// 翻译
const FormHelp = {
    en: "help",
    "zh-cn": "帮助",
};

const FormSetEmitTimeout = {
    en: "set wait timeout [emit_timeout]s",
    "zh-cn": "设置等待超时时间[emit_timeout]秒",
};

const FormConnect = {
  en: "connect tello",
  "zh-cn": "连接tello",
};

const FormDisConnect = {
  en: "disconnect",
  "zh-cn": "断开连接",
};

const Form_control_node = {
  en: "[turn] [node_name]",
  "zh-cn": "[turn] [node_name]",
}

const FormTakeOff = {
  en: "takeoff",
  "zh-cn": "起飞",
}

const FormLand = {
  en: "land",
  "zh-cn": "降落",
}


const FormMoveCmd = {
  en: "fly [direction] [DISTANCE] cm",
  "zh-cn": "向[direction]飞行[DISTANCE]cm",
}


// Rotate x degree clockwise
const Form_rotate_clockwise = {
  en: "Rotate [CMD] degree [DEGREE] ",
  "zh-cn": "[CMD] 旋转 [DEGREE] 度",
}

const FormFlip = {
  en: "flip [DIRECTION]",
  "zh-cn": "向[DIRECTION]翻滚",
}

const FormGo = {
  en: "go x:[X] y:[Y] z:[Z] speed:[SPEED]",
  "zh-cn": "飞向 x:[X] y:[Y] z:[Z] 速度:[SPEED]",
}

const FormSetSpeed = {
  en: "set speed [SPEED]",
  "zh-cn": "设置速度 [SPEED]",
}

const Form_sendTopicMessageAndWait = {
  en: "broadcast [content] and wait",
  "zh-cn": "广播[content]并等待",
}

const Form_sendTopicMessageAndWait_REPORTER = {
  en: "broadcast [content] and wait",
  "zh-cn": "广播[content]并等待",
}

class AdapterClient {
    onAdapterPluginMessage(msg) {
        this.node_id = msg.message.payload.node_id;
        if (this.node_id === this.NODE_ID) {
            // json 数据, class

            this.adapter_node_content_hat = msg.message.payload.content;
            this.adapter_node_content_reporter = msg.message.payload.content;
            console.log("content ->", msg.message.payload.content);
        }
    }

    constructor(node_id, help_url) {
        this.NODE_ID = node_id;
        this.HELP_URL = help_url;

        this.emit_timeout = 5000; //ms

        this.adapter_base_client = new AdapterBaseClient(
            null, // onConnect,
            null, // onDisconnect,
            null, // onMessage,
            this.onAdapterPluginMessage.bind(this), // onAdapterPluginMessage,
            null, // update_nodes_status,
            null, // node_statu_change_callback,
            null, // notify_callback,
            null, // error_message_callback,
            null // update_adapter_status
        );
    }

    emit_with_messageid(NODE_ID, content, timeout=5000){
      return this.adapter_base_client.emit_with_messageid(NODE_ID,content,timeout)
    }
}

class Scratch3TelloBlocks {
    constructor(runtime) {
        this.client = new AdapterClient(
            NODE_ID,
            HELP_URL,
            runtime,
            this
        );
    }

    /**
     * The key to load & store a target's test-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Scratch.tello2";
    }

    get CMDMENU_INFO() {
        return [
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.up",
                    default: "up",
                    description: "",
                }),
                value: "up",
            },
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.down",
                    default: "down",
                    description: "",
                }),
                value: "down",
            },
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.left",
                    default: "left",
                    description: "",
                }),
                value: "left",
            },
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.right",
                    default: "right",
                    description: "",
                }),
                value: "right",
            },
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.forward",
                    default: "forward",
                    description: "",
                }),
                value: "forward",
            },
            {
                name: formatMessage({
                    id: "cxtello.cmdmenu.back",
                    default: "back",
                    description: "",
                }),
                value: "back",
            },
        ];
    }

    get CWMENU_INFO() {
        return [
            {
                name: formatMessage({
                    id: "cxtello.cwmenu.cw",
                    default: "cw",
                    description: "",
                }),
                value: "cw",
            },
            {
                name: formatMessage({
                    id: "cxtello.cwmenu.ccw",
                    default: "ccw",
                    description: "",
                }),
                value: "ccw",
            },
        ];
    }

    get DIRECTIONMENU() {
        return [
            {
                name: formatMessage({
                    id: "cxtello.directionmenu.l",
                    default: "left",
                    description: "",
                }),
                value: "l",
            },
            {
                name: formatMessage({
                    id: "cxtello.directionmenu.r",
                    default: "right",
                    description: "",
                }),
                value: "r",
            },
            {
                name: formatMessage({
                    id: "cxtello.directionmenu.b",
                    default: "back",
                    description: "",
                }),
                value: "b",
            },
            {
                name: formatMessage({
                    id: "cxtello.directionmenu.f",
                    default: "forward",
                    description: "",
                }),
                value: "f",
            },
        ];
    }

    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    _setLocale() {
        let now_locale = "";
        switch (formatMessage.setup().locale) {
            case "en":
                now_locale = "en";
                break;
            case "zh-cn":
                now_locale = "zh-cn";
                break;
            default:
                now_locale = "zh-cn";
                break;
        }
        return now_locale;
    }
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        let the_locale = this._setLocale();
        return {
            id: "tello2",
            name: "tello2",
            colour: "#ff641d",
            colourSecondary: "#c94f18",
            colourTertiary: "#c94f18",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "open_help_url",
                    blockType: BlockType.COMMAND,
                    text: FormHelp[the_locale],
                    arguments: {},
                },
                {
                    opcode: "set_emit_timeout",
                    blockType: BlockType.COMMAND,
                    text: FormSetEmitTimeout[the_locale],
                    arguments: {
                        emit_timeout: {
                            type: ArgumentType.NUMBER,
                            defaultValue:5.0,
                        },
                    },
                },
                {
                  opcode: "control_node",
                  blockType: BlockType.COMMAND,
                  text: Form_control_node[the_locale],
                  arguments: {
                      turn: {
                          type: ArgumentType.STRING,
                          defaultValue: "start",
                          menu: "turn",
                      },
                      node_name: {
                          type: ArgumentType.STRING,
                          defaultValue: "node_tello2",
                      },
                  },
               },
                {
                    opcode: "connect",
                    blockType: BlockType.COMMAND,
                    text: FormConnect[the_locale]
                },
                {
                  opcode: "disconnect",
                  blockType: BlockType.COMMAND,
                  text: FormDisConnect[the_locale]
               },
                //FormDisConnect
                {
                    opcode: "takeoff",
                    blockType: BlockType.COMMAND,
                    text: FormTakeOff[the_locale]
                },
                {
                    opcode: "land",
                    blockType: BlockType.COMMAND,
                    text: FormLand[the_locale]
                },
                {
                    opcode: "movecmd",
                    blockType: BlockType.COMMAND,
                    text: FormMoveCmd[the_locale],
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20,
                        },
                        direction: {
                            type: ArgumentType.STRING,
                            menu: "cmdmenu",
                            defaultValue: "up",
                        },
                    },
                },
                {
                    opcode: "rotate_clockwise",
                    blockType: BlockType.COMMAND,
                    text: Form_rotate_clockwise[the_locale],
                    arguments: {
                        DEGREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 45
                        },
                        CMD: {
                            type: ArgumentType.STRING,
                            menu: "cwcmdmenu",
                            defaultValue: "cw",
                        },
                    },
                },
                {
                    opcode: "flip",
                    blockType: BlockType.COMMAND,
                    text: FormFlip[the_locale],
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: "directionmenu",
                            defaultValue: "l",
                        },
                    },
                },
                {
                    opcode: "go",
                    blockType: BlockType.COMMAND,
                    text: FormGo[the_locale],
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20,
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                        },
                    },
                },
                {
                    opcode: "setspeed",
                    blockType: BlockType.COMMAND,
                    text: FormSetSpeed[the_locale],
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                        },
                    },
                },
                {
                  opcode: "broadcastTopicMessageAndWait",
                  blockType: BlockType.COMMAND,
                  text: Form_sendTopicMessageAndWait[the_locale],
                  arguments: {
                      content: {
                          type: ArgumentType.STRING,
                          defaultValue: "tello.move_forward(20)",
                      },
                  },
              },
              {
                opcode: "broadcastTopicMessageAndWait_REPORTER",
                blockType: BlockType.REPORTER,
                text: Form_sendTopicMessageAndWait_REPORTER[the_locale],
                arguments: {
                    content: {
                        type: ArgumentType.STRING,
                        defaultValue: "tello.query_height()",
                    },
                },
              },
                /*
                {
                    opcode: "setwifi",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.setwifi",
                            default: "set wifi:[WIFI] pass:[PASS]",
                            description: "setwifi",
                        }),
                        description: "setwifi",
                    }),
                    arguments: {
                        WIFI: {
                            type: ArgumentType.STRING,
                            defaultValue: "wifi",
                        },
                        PASS: {
                            type: ArgumentType.STRING,
                            defaultValue: "password",
                        },
                    },
                },*/
                /*
                {
                    opcode: "setrc",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.setrc",
                            default:
                                "set roll:[A] pitch:[B] accelerator:[C] rotation:[D]",
                            description: "setrc",
                        }),
                        description: "setrc",
                    }),
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                        },
                        C: {
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                        },
                        D: {
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                        },
                    },
                },
                */
                {
                  opcode: "getbattery",
                  blockType: BlockType.REPORTER,
                  text: formatMessage({
                      default: formatMessage({
                          id: "cxtello.actionMenu.getbattery",
                          default: "get battery",
                          description: "getbattery",
                      }),
                      description: "getbattery",
                  }),
                },
                {
                    opcode: "getspeed",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getspeed",
                            default: "get speed",
                            description: "getspeed",
                        }),
                        description: "getspeed",
                    }),
                },
                {
                    opcode: "gettime",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.gettime",
                            default: "get time",
                            description: "gettime",
                        }),
                        description: "gettime",
                    }),
                },
                {
                    opcode: "getheight",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getheight",
                            default: "get height",
                            description: "getheight",
                        }),
                        description: "getheight",
                    }),
                },
                {
                    opcode: "gettemp",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.gettemp",
                            default: "get temp",
                            description: "gettemp",
                        }),
                        description: "gettemp",
                    }),
                },
                {
                    opcode: "getattitude",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getattitude",
                            default: "get attitude",
                            description: "getattitude",
                        }),
                        description: "getattitude",
                    }),
                },
                {
                    opcode: "getbaro",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getbaro",
                            default: "get baro",
                            description: "getbaro",
                        }),
                        description: "getbaro",
                    }),
                },
                /*
                {
                    opcode: "getacceleration",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getacceleration",
                            default: "get acceleration",
                            description: "getacceleration",
                        }),
                        description: "getacceleration",
                    }),
                },*/
                {
                    opcode: "gettof",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.gettof",
                            default: "get tof",
                            description: "gettof",
                        }),
                        description: "gettof",
                    }),
                },
                {
                    opcode: "getwifi",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: formatMessage({
                            id: "cxtello.actionMenu.getwifi",
                            default: "get wifi",
                            description: "getwifi",
                        }),
                        description: "getwifi",
                    }),
                },
            ],
            menus: {
                cmdmenu: {
                    acceptReporters: true,
                    items: this._buildMenu(this.CMDMENU_INFO),
                },
                cwcmdmenu: {
                    acceptReporters: true,
                    items: this._buildMenu(this.CWMENU_INFO),
                },
                directionmenu: {
                    acceptReporters: true,
                    items: this._buildMenu(this.DIRECTIONMENU),
                },
                turn: {
                    acceptReporters: true,
                    items: ["start", "stop"],
                },

            },
        };
    }

    connect(args, util) {
        const content = "tello.connect()";
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    disconnect(args, util) {
      const content = "tello.__del__()";
      return this.client.emit_with_messageid(
          NODE_ID,
          content
      );
    }

    

    takeoff(args, util) {
        const content = "tello.takeoff()";
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    land(args, util) {
        const content = "tello.land()";
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }


    movecmd(args, util) {
        const direction = args.direction;
        const DISTANCE = parseFloat(args.DISTANCE);
        const content = `tello.move_${direction}(${DISTANCE})`;
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    rotate_clockwise(args, util) {
      const  _map = {
        "cw": "rotate_clockwise",
        "ccw": "rotate_counter_clockwise",
      };
      const  action = _map[args.CMD];
      const  DEGREE = parseFloat(args.DEGREE);
      const  content = `tello.${action}(${DEGREE})`;
      return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    flip(args, util) {
        const  DIRECTION = args.DIRECTION;
        const  content = `tello.flip("${DIRECTION}")`;
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    go(args, util) {
        const content = `tello.go_xyz_speed(${args.X}, ${args.Y}, ${args.Z}, ${args.SPEED})`;
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }

    setspeed(args, util) {
        const SPEED = parseFloat(args.SPEED);
        const content = `tello.set_speed(${SPEED})`;
        return this.client.emit_with_messageid(
            NODE_ID,
            content
        );
    }
    // broadcast
    broadcastTopicMessageAndWait(args) {
      const node_id = args.node_id;
      const content = args.content;
      this.client.emit_with_messageid(node_id, content);
      return;
  }

    getspeed() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.query_speed()"
        );
    }

    getbattery() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.get_battery()"
        );
    }

    gettime() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.get_flight_time()"
        );
    }

    getheight() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.get_height()"
        );
    }

    gettemp() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.query_temperature()"
        );
    }

    getattitude() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.query_attitude()"
        );
    }

    getbaro() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.query_barometer()"
        );
    }

    gettof() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.get_distance_tof()"
        );
    }

    getwifi() {
        return this.client.emit_with_messageid(
            NODE_ID,
            "tello.query_wifi_signal_noise_ratio()"
        );
    }

    open_help_url(args) {
        window.open(HELP_URL);
    }


    control_node(args) {
      const content = args.turn;
      const node_name = args.node_name;
      return this.client.adapter_base_client.emit_with_messageid_for_control(
          NODE_ID,
          content,
          node_name,
          "node"
      );
    }

    set_emit_timeout(args) {
        const timeout = parseFloat(args.emit_timeout) * 1000;
        this.emit_timeout = timeout;
    }

    broadcastTopicMessageAndWait(args) {
      const content = args.content;
      return this.eim_client.adapter_base_client.emit_with_messageid(NODE_ID, content);
  }

  broadcastTopicMessageAndWait_REPORTER(args) {
      const content = args.content;
      return this.eim_client.adapter_base_client.emit_with_messageid(NODE_ID, content);
  }

}

module.exports = Scratch3TelloBlocks;
