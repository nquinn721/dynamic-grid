var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventEmitter = require('events').EventEmitter, util = require('util');
var Item = (function () {
    function Item(x, y) {
        this.x = x;
        this.y = y;
    }
    Item.prototype.update = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return Item;
}());
var Segment = (function () {
    function Segment(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.items = [];
    }
    Segment.prototype.update = function (item) {
    };
    return Segment;
}());
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        _super.apply(this, arguments);
        this.segments = [];
    }
    Grid.prototype.init = function (w, h, gridSize) {
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h);
    };
    Grid.prototype.createItem = function (x, y) {
        var item = new Item(x, y), segment = this.getSegmentByXY(x, y);
        segment.items.push(item);
        item.segment = segment;
        return item;
    };
    Grid.prototype.createSegment = function (x, y, w, h) {
        var segment = new Segment(this.segments.length, x, y, w, h);
        this.segments.push(segment);
    };
    Grid.prototype.getSegmentByXY = function (x, y) {
        var segment;
        for (var i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];
            if (segment.x <= x && segment.x + segment.w > x && segment.y <= y && segment.y + segment.h > y)
                return segment;
        }
    };
    return Grid;
}(EventEmitter));
var grid = new Grid;
grid.init(2000, 2000, { w: 100, h: 100 });
var item = grid.createItem(300, 300);
console.log(item);
