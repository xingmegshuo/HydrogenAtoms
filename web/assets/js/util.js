/**
 * 
 */
var Capabilities = {
	isOnline: function () {
		return navigator.onLine;
	},

	isTouchDevice: function () {
		return navigator.userAgent.match(/(iphone|ipad|ipod|android)/gi);
	},

	suportsLocalStorage: function () {
		return ('localStorage' in window) && window['localStorage'] !== null;
	}
};

/**
 * Defines a 2D position.
 */
function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.distanceTo = function (x, y) {
	var dx = x - this.x;
	var dy = y - this.y;
	return Math.sqrt(dx * dx + dy * dy);
};

Point.prototype.clonePosition = function () {
	return { x: this.x, y: this.y };
};

Point.prototype.interpolate = function (x, y, amp) {
	this.x += (x - this.x) * amp;
	this.y += (y - this.y) * amp;
};

/**
 * Defines of a rectangular region.
 */
function Region() {
	this.left = 999999;
	this.top = 999999;
	this.right = 0;
	this.bottom = 0;
}

Region.prototype.reset = function () {
	this.left = 999999;
	this.top = 999999;
	this.right = 0;
	this.bottom = 0;
};

Region.prototype.inflate = function (x, y) {
	this.left = Math.min(this.left, x);
	this.top = Math.min(this.top, y);
	this.right = Math.max(this.right, x);
	this.bottom = Math.max(this.bottom, y);
};

Region.prototype.expand = function (x, y) {
	this.left -= x;
	this.top -= y;
	this.right += x;
	this.bottom += y;
};

Region.prototype.contains = function (x, y) {
	return x > this.left && x < this.right && y > this.top && y < this.bottom;
};

Region.prototype.size = function () {
	return ((this.right - this.left) + (this.bottom - this.top)) / 2;
};

Region.prototype.center = function () {
	return new Point(this.left + (this.right - this.left) / 2, this.top + (this.bottom - this.top) / 2);
};

Region.prototype.toRectangle = function () {
	return { x: this.left, y: this.top, width: this.right - this.left, height: this.bottom - this.top };
};



// shim layer with setTimeout fallback from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

!function (t, e) { "use strict"; function n() { this.dispatchEvent(new CustomEvent("long-press", { bubbles: !0, cancelable: !0 })), clearTimeout(o), console && console.log && console.log("long-press fired on " + this.outerHTML) } var o = null, u = "ontouchstart" in t || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, s = u ? "touchstart" : "mousedown", i = u ? "touchcancel" : "mouseout", a = u ? "touchend" : "mouseup", c = u ? "touchmove" : "mousemove"; "initCustomEvent" in e.createEvent("CustomEvent") && (t.CustomEvent = function (t, n) { n = n || { bubbles: !1, cancelable: !1, detail: void 0 }; var o = e.createEvent("CustomEvent"); return o.initCustomEvent(t, n.bubbles, n.cancelable, n.detail), o }, t.CustomEvent.prototype = t.Event.prototype), e.addEventListener(s, function (t) { var e = t.target, u = parseInt(e.getAttribute("data-long-press-delay") || "1500", 10); o = setTimeout(n.bind(e), u) }), e.addEventListener(a, function (t) { clearTimeout(o) }), e.addEventListener(i, function (t) { clearTimeout(o) }), e.addEventListener(c, function (t) { clearTimeout(o) }) }(this, document);