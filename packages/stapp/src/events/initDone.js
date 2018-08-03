"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createEvent_1 = require("../core/createEvent/createEvent");
var constants_1 = require("../helpers/constants");
/**
 * Indicates about completing initialization
 * @private
 */
exports.initDone = createEvent_1.createEvent(constants_1.APP_KEY + ": Initialization complete");
