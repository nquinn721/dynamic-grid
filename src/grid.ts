import {EventEmitter} from 'events';
import {Item} from './item';
import {Segment} from './segment';
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

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
    destroyItem(item){
        this.items.splice(this.items.indexOf(item),1);
        this.emit('destroyed item', item);
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
    getSegmentAboveLeft(x, y){
        return this.getSegmentByXY(x - this.gridSize.w, y - this.gridSize.h);
    }
    getSegmentAbove (x, y){
        return this.getSegmentByXY(x, y - this.gridSize.h);
    }
    getSegmentAboveRight(x, y){
        return this.getSegmentByXY(x + this.gridSize.w, y - this.gridSize.h);
    }
    getSegmentBelowRight(x, y){
        return this.getSegmentByXY(x + this.gridSize.w, y + this.gridSize.h);
    }
    getSegmentBelow (x, y){
        return this.getSegmentByXY(x, y + this.gridSize.h);
    }
    getSegmentBelowLeft(x, y){
        return this.getSegmentByXY(x - this.gridSize.w, y + this.gridSize.h);
    }
    getSegmentToLeft (x, y){
        return this.getSegmentByXY(x - this.gridSize.w, y);
    }
    getSegmentToRight (x, y){
        return this.getSegmentByXY(x + this.gridSize.w, y);
    }
    getSurroundingSegments(x, y){
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
        ].filter(v => v);
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

