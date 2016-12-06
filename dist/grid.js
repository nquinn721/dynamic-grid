"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var item_1 = require('./item');
var segment_1 = require('./segment');
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
        this.segments = [];
        this.items = [];
    }
    Grid.prototype.init = function (w, h, gridSize) {
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h, i + gridSize.w, j + gridSize.h);
    };
    Grid.prototype.createItem = function (x, y) {
        var segment = this.getSegmentByXY(x, y), item = new item_1.Item(this.items.length, x, y);
        item.segment = segment;
        this.items.push(item);
        segment.items.push(item);
        return item;
    };
    Grid.prototype.createSegment = function (x, y, w, h, xw, yh) {
        var segment = new segment_1.Segment(this, this.segments.length, x, y, w, h, xw, yh);
        this.segments.push(segment);
    };
    Grid.prototype.getSegmentByXY = function (x, y) {
        var segment;
        for (var i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];
            if (segment.x <= x && segment.xw > x && segment.y <= y && segment.yh > y)
                return segment;
        }
    };
    Grid.prototype.update = function (item) {
        this.emit('before update');
        var segment = this.getSegmentByXY(item.x, item.y);
        segment.items.push(item);
        item.segment = segment;
        item.segment.emit('update');
        this.emit('update');
    };
    return Grid;
}(events_1.EventEmitter));
exports.Grid = Grid;
module.exports = Grid;
//# sourceMappingURL=grid.js.map