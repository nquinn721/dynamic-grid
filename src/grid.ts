import {EventEmitter} from 'events';
import {Item} from './item';
import {Segment} from './segment';

export class Grid extends EventEmitter {
    private segments = [];
    private items = [];

    constructor (public w, public h, public gridSize) {
        super();
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h, i + gridSize.w, j + gridSize.h);
    }
    createItem (x, y) {
        var segment = this.getSegmentByXY(x, y),
            item = new Item(this, this.items.length, x, y);

        item.segment = segment;
        this.items.push(item);
        segment.items.push(item);

        return item;
    }
    createSegment (x, y, w, h, xw, yh) {
        var segment = new Segment(this, this.segments.length, x, y, w, h, xw, yh);
        this.segments.push(segment);
    }
    getSegmentByXY (x, y) {
        var segment;
        for (var i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];

            if (segment.x <= x && segment.xw > x && segment.y <= y && segment.yh > y)
                return segment;
        }

    }
    getSegmentAbove (x, y){
        return this.getSegmentByXY(x, y - this.gridSize.h);
    }
    getSegmentBelow (x, y){
        return this.getSegmentByXY(x, y + this.gridSize.h);
    }
    getSegmentToLeft (x, y){
        return this.getSegmentByXY(x - this.gridSize.w, y);
    }
    getSegmentToRight (x, y){
        return this.getSegmentByXY(x + this.gridSize.w, y);
    }
    getSurroundingSegments(x, y){
        return []
            .concat(this.getSegmentToLeft(x, y))
            .concat(this.getSegmentAbove(x, y))
            .concat(this.getSegmentToRight(x, y))
            .concat(this.getSegmentBelow(x, y))
            .concat(this.getSegmentByXY(x, y));
    }

    update (item: Item){
        this.emit('before update');
        var segment = this.getSegmentByXY(item.x, item.y);
        if(!segment)return;
        segment.items.push(item);
        item.segment = segment;
        if(item.segment)
            item.segment.emit('update');
        this.emit('update');
    }
}
module.exports = Grid;

