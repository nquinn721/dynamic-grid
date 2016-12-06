"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var Segment = (function (_super) {
    __extends(Segment, _super);
    function Segment(grid, id, x, y, w, h, xw, yh) {
        _super.call(this);
        this.grid = grid;
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.xw = xw;
        this.yh = yh;
        this.items = [];
    }
    Segment.prototype.update = function (item) {
        this.emit('before update');
        this.items.splice(this.items.indexOf(item), 1);
        this.grid.update(item);
        this.emit('update');
    };
    Segment.prototype.getAllItemsPlain = function () {
        return this.items.map(function (v) { return v.plain(); });
    };
    Segment.prototype.getItemsExcept = function (id) {
        return this.items.map(function (v) { return v.plain(); }).filter(function (v) { return v.id != id; });
    };
    Segment.prototype.emitToAllItems = function (event, data) {
        this.items.forEach(function (v) { return v.emit(event, data); });
    };
    Segment.prototype.emitToAllItemsExcept = function (item, event, data) {
        this.items.filter(function (v) { return v.id !== item.id; }).forEach(function (v) { return v.emit(event, data); });
    };
    return Segment;
}(events_1.EventEmitter));
exports.Segment = Segment;
//# sourceMappingURL=segment.js.map