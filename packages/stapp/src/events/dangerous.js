"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This events can be used in epics. But should not.
 */
var createEvent_1 = require("../core/createEvent/createEvent");
var constants_1 = require("../helpers/constants");
/**
 * Can be used to replace state completely
 */
exports.dangerouslyReplaceState = createEvent_1.createEvent(constants_1.APP_KEY + ": Replace state");
/**
 * Can be used to reinitialize state
 */
exports.dangerouslyResetState = createEvent_1.createEvent(constants_1.APP_KEY + ": Reset state");
