"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var item_1 = require('./item');
var segment_1 = require('./segment');
var flatten = function (list) { return list.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []); };
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(w, h, gridSize) {
        _super.call(this);
        this.w = w;
        this.h = h;
        this.gridSize = gridSize;
        this.segments = [];
        this.items = [];
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h, i + gridSize.w, j + gridSize.h);
    }
    Grid.prototype.createItem = function (x, y) {
        var segment = this.getSegmentByXY(x, y), item = new item_1.Item(this, this.items.length, x, y);
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
    Grid.prototype.getSegmentAboveLeft = function (x, y) {
        return this.getSegmentByXY(x - this.gridSize.w, y - this.gridSize.h);
    };
    Grid.prototype.getSegmentAbove = function (x, y) {
        return this.getSegmentByXY(x, y - this.gridSize.h);
    };
    Grid.prototype.getSegmentAboveRight = function (x, y) {
        return this.getSegmentByXY(x + this.gridSize.w, y - this.gridSize.h);
    };
    Grid.prototype.getSegmentBelowRight = function (x, y) {
        return this.getSegmentByXY(x + this.gridSize.w, y + this.gridSize.h);
    };
    Grid.prototype.getSegmentBelow = function (x, y) {
        return this.getSegmentByXY(x, y + this.gridSize.h);
    };
    Grid.prototype.getSegmentBelowLeft = function (x, y) {
        return this.getSegmentByXY(x - this.gridSize.w, y + this.gridSize.h);
    };
    Grid.prototype.getSegmentToLeft = function (x, y) {
        return this.getSegmentByXY(x - this.gridSize.w, y);
    };
    Grid.prototype.getSegmentToRight = function (x, y) {
        return this.getSegmentByXY(x + this.gridSize.w, y);
    };
    Grid.prototype.getSurroundingSegments = function (x, y) {
        return [
            this.getSegmentToLeft(x, y),
            this.getSegmentAbove(x, y),
            this.getSegmentAboveLeft(x, y),
            this.getSegmentAboveRight(x, y),
            this.getSegmentBelowRight(x, y),
            this.getSegmentBelowLeft(x, y),
            this.getSegmentToRight(x, y),
            this.getSegmentBelow(x, y),
            this.getSegmentByXY(x, y)
        ].filter(function (v) { return v; });
    };
    Grid.prototype.update = function (item) {
        this.emit('before update');
        var segment = this.getSegmentByXY(item.x, item.y);
        if (!segment)
            return;
        segment.items.push(item);
        item.segment = segment;
        if (item.segment)
            item.segment.emit('update');
        this.emit('update');
    };
    return Grid;
}(events_1.EventEmitter));
exports.Grid = Grid;
module.exports = Grid;
//# sourceMappingURL=grid.js.map