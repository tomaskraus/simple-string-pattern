"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMiddlePatt = exports.toEndPatt = exports.toStartPatt = exports.addSuffix = exports.addPrefix = exports.id = void 0;
// id :: a -> a
const id = (a) => a;
exports.id = id;
// addPrefix :: String -> String -> String
const addPrefix = (p, s) => p + s;
exports.addPrefix = addPrefix;
// addSuffix :: String -> String -> String
const addSuffix = (p, s) => s + p;
exports.addSuffix = addSuffix;
// toStartPatt :: String -> String
const toStartPatt = (s) => (0, exports.addSuffix)(' ...', s);
exports.toStartPatt = toStartPatt;
const toEndPatt = (s) => (0, exports.addPrefix)('... ', s);
exports.toEndPatt = toEndPatt;
const toMiddlePatt = (s) => (0, exports.toStartPatt)((0, exports.toEndPatt)(s));
exports.toMiddlePatt = toMiddlePatt;
exports.default = {
    id: exports.id,
    addPrefix: exports.addPrefix,
    addSuffix: exports.addSuffix,
    toStartPatt: exports.toStartPatt,
    toEndPatt: exports.toEndPatt,
    toMiddlePatt: exports.toMiddlePatt,
};
