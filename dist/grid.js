var EventEmitter = require('events').EventEmitter, util = require('util');
var Item = (function () {
    function Item(x, y) {
        this.x = x;
        this.y = y;
    }
    return Item;
}());
var Segment = (function () {
    function Segment(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    return Segment;
}());
function Grid() {
    this.segments = [];
}
util.inherits(Grid, EventEmitter);
Grid.prototype = {
    init: function (w, h, gridSize) {
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h);
    },
    createItem: function (x, y) {
        var item = new Item(x, y), segment = this.getSegmentByXY(x, y);
        segment.push(item);
        item.segment = segment;
        return item;
    },
    createSegment: function (x, y, w, h) {
        var segment = new Segment(x, y, w, h);
        console.log(segment);
        this.segments.push(segment);
    },
    getSegmentByXY: function (x, y) {
        var segment;
        for (var i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];
            if (segment.x <= x && segment.x + segment.w >= x && segment.y <= y && segment.y + segment.h >= y)
                return segment;
        }
    }
};
var grid = new Grid;
grid.init(2000, 2000, { w: 100, h: 100 });
//# sourceMappingURL=grid.js.map