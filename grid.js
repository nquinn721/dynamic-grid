"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require('events');
var EventEmitter = events.EventEmitter;
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(id, x, y) {
        _super.call(this);
        this.id = id;
        this.x = x;
        this.y = y;
    }
    Item.prototype.update = function (x, y) {
        this.x = x;
        this.y = y;
        if (this.x < this.segment.x || this.x >= this.segment.xw || this.y < this.segment.y || this.y >= this.segment.yh) {
            this.segment.update(this);
            this.emit('update');
        }
    };
    Item.prototype.plain = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    };
    return Item;
}(EventEmitter));
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
    Segment.prototype.createItem = function (x, y) {
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
}(EventEmitter));
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
        var segment = this.getSegmentByXY(x, y), item = new Item(this.items.length, x, y);
        item.segment = segment;
        this.items.push(item);
        segment.items.push(item);
        return item;
    };
    Grid.prototype.createSegment = function (x, y, w, h, xw, yh) {
        var segment = new Segment(this, this.segments.length, x, y, w, h, xw, yh);
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
}(EventEmitter));
module.exports = Grid;
