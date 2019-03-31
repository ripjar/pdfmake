'use strict';

function isString(variable) {
	return typeof variable === 'string' || variable instanceof String;
}

function isNumber(variable) {
	return typeof variable === 'number' || variable instanceof Number;
}

function isBoolean(variable) {
	return typeof variable === 'boolean';
}

function isArray(variable) {
	return Array.isArray(variable);
}

function isFunction(variable) {
	return typeof variable === 'function';
}

function isObject(variable) {
	return variable !== null && typeof variable === 'object';
}

function isNull(variable) {
	return variable === null;
}

function isUndefined(variable) {
	return variable === undefined;
}

function pack() {
	var result = {};

	for (var i = 0, l = arguments.length; i < l; i++) {
		var obj = arguments[i];

		if (obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					result[key] = obj[key];
				}
			}
		}
	}

	return result;
}

function offsetVector(vector, x, y) {
	switch (vector.type) {
		case 'ellipse':
		case 'rect':
			vector.x += x;
			vector.y += y;
			break;
		case 'line':
			vector.x1 += x;
			vector.x2 += x;
			vector.y1 += y;
			vector.y2 += y;
			break;
		case 'polyline':
			for (var i = 0, l = vector.points.length; i < l; i++) {
				vector.points[i].x += x;
				vector.points[i].y += y;
			}
			break;
	}
}

function fontStringify(key, val) {
	if (key === 'font') {
		return 'font';
	}
	return val;
}

function fixedCharCodeAt(str, idx) {
	// ex. fixedCharCodeAt('\uD800\uDC00', 0); // 65536
	// ex. fixedCharCodeAt('\uD800\uDC00', 1); // false
	idx = idx || 0;
	var code = str.charCodeAt(idx);
	var hi, low;
	
	// High surrogate (could change last hex to 0xDB7F
	// to treat high private surrogates 
	// as single characters)
	if (0xD800 <= code && code <= 0xDBFF) {
		hi = code;
		low = str.charCodeAt(idx + 1);
		if (isNaN(low)) {
			throw 'High surrogate not followed by ' +
				'low surrogate in fixedCharCodeAt()';
		}
		return ((hi - 0xD800) * 0x400) +
			(low - 0xDC00) + 0x10000;
	}
	if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		// We return false to allow loops to skip
		// this iteration since should have already handled
		// high surrogate above in the previous iteration
		return false;
		// hi = str.charCodeAt(idx - 1);
		// low = code;
		// return ((hi - 0xD800) * 0x400) +
		//   (low - 0xDC00) + 0x10000;
	}
	return code;
}

function spreadify (fn, fnThis) {
	return function (/* accepts unlimited arguments */) {
			// Holds the processed arguments for use by `fn`
			var spreadArgs = [ ];

			// Caching length
			var length = arguments.length;

			var currentArg;

			for (var i = 0; i < length; i++) {
					currentArg = arguments[i];

					if (Array.isArray(currentArg)) {
							spreadArgs = spreadArgs.concat(currentArg);
					} else {
							spreadArgs.push(currentArg);
					}
			}

			return fn.apply(fnThis, spreadArgs);
	};
}

module.exports = {
	isString: isString,
	isNumber: isNumber,
	isBoolean: isBoolean,
	isArray: isArray,
	isFunction: isFunction,
	isObject: isObject,
	isNull: isNull,
	isUndefined: isUndefined,
	pack: pack,
	fontStringify: fontStringify,
	offsetVector: offsetVector,
	spreadify: spreadify,
	fixedCharCodeAt: fixedCharCodeAt
};
