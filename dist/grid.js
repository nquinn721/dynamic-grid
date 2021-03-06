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
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        var segment = this.getSegmentByXY(x, y);
        var item = new item_1.Item(this, segment, this.getSurroundingSegments(x, y), this.items.length, x, y);
        this.items.push(item);
        segment.addItem(item);
        this.emit('update', item);
        return item;
    };
    Grid.prototype.destroyItem = function (item) {
        this.items.splice(this.items.indexOf(item), 1);
        this.emit('destroyed item', item);
        this.emit('update', item);
    };
    Grid.prototype.moveSegment = function (item) {
        var newSegment = this.getSegmentByXY(item);
        if (item.segment)
            item.segment.removeItem(item);
        if (newSegment)
            item.segment = newSegment;
        if (item.segment)
            item.segment.addItem(item);
    };
    Grid.prototype.createSegment = function (x, y, w, h, xw, yh) {
        var segment = new segment_1.Segment(this, this.segments.length, x, y, w, h, xw, yh);
        this.segments.push(segment);
    };
    Grid.prototype.getSegmentByXY = function (x, y) {
        if (x instanceof item_1.Item) {
            y = x.y;
            x = x.x;
        }
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
        if (x instanceof item_1.Item) {
            y = x.y;
            x = x.x;
        }
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
    Grid.prototype.getSurroundingSegmentCoords = function (x, y) {
        var segments = this.getSurroundingSegments(x, y);
        var startX = 0, startY = 0, endX = 0, endY = 0;
        for (var i = 0; i < segments.length; i++) {
            if (segments[i].x < startX)
                startX = segments[i].x;
            if (segments[i].x + segments[i].w > endX)
                endX = segments[i].x + segments[i].w;
            if (segments[i].y < startY)
                startY = segments[i].y;
            if (segments[i].y + segments[i].h > endY)
                endY = segments[i].y + segments[i].h;
        }
        return {
            x: startX,
            y: startY,
            w: x + endX,
            h: y + endY,
            endX: endX,
            endY: endY
        };
    };
    return Grid;
}(events_1.EventEmitter));
exports.Grid = Grid;
module.exports = Grid;
//# sourceMappingURL=grid.js.map