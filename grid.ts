var EventEmitter = require('events').EventEmitter,
    util = require('util');

class Item {
    public segment;

    constructor(public x, public y) {
    }

    update (x, y){
        this.x = x;
        this.y = y;
    }
}

class Segment {
    public items = [];
    public grid;

    constructor(public id, public x, public y, public w, public h) {
    }

    update (item: Item){

    }
}

class Grid extends EventEmitter {
    private segments = [];

    init (w, h, gridSize) {
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h);
    }
    createItem (x, y) {
        var item = new Item(x, y),
            segment = this.getSegmentByXY(x, y);

        segment.items.push(item);
        item.segment = segment;

        return item;
    }
    createSegment (x, y, w, h) {
        var segment = new Segment(this.segments.length, x, y, w, h);
        this.segments.push(segment);
    }
    getSegmentByXY (x, y) {
        var segment;
        for (var i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];

            if (segment.x <= x && segment.x + segment.w > x && segment.y <= y && segment.y + segment.h > y)
                return segment;
        }

    }
}


var grid = new Grid;
grid.init(2000, 2000, {w: 100, h: 100});

var item = grid.createItem(300, 300);
console.log(item);