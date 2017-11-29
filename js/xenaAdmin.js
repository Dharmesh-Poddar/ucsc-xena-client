/*global define: false */
'use strict';
var Rx = require('./rx');
var {isArray, zip, map, apply, times,
	constant, flatmap, merge} = require('./underscore_ext');

function expandArrays(v, k) {
	if (isArray(v)) {
		return zip(v, times(v.length, constant(k)));
	}
	return [[v, k]];
}

function encodeParam(v, k) {
	return k + "=" + encodeURIComponent(v);
}

function encodeObject(obj) {
	return map(flatmap(obj, expandArrays), apply(encodeParam)).join("&");
}

function update(host, files, flags) {
	files = isArray(files) ? files : [files];
	return {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		url: host + '/update/',
		body: encodeObject(merge({file: files}, flags)),
		method: 'POST',
		crossDomain: true
	};
}

module.exports = {
	load: function (host, files, always) {
		return Rx.Observable.ajax(update(host, files, always ? {always: true} : {}));
	},
	delete: function (host, files) {
		return Rx.Observable.ajax(update(host, files, {delete: true}));
	}
};
