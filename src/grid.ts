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
    createItem (x, y?): Item {
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;
        }

        var segment = this.getSegmentByXY(x, y);
        var item = new Item(this, segment, this.getSurroundingSegments(x, y), this.items.length, x, y);

        this.items.push(item);
        segment.addItem(item);
        this.emit('update', item);
        return item;
    }
    destroyItem(item: Item){
        this.items.splice(this.items.indexOf(item),1);
        this.emit('destroyed item', item);
        this.emit('update', item);
    }
    moveSegment(item: Item){
        var newSegment = this.getSegmentByXY(item);
        if(item.segment)
            item.segment.removeItem(item);
        if(newSegment)
            item.segment = newSegment;
        if(item.segment)
            item.segment.addItem(item);
    }
    createSegment (x, y, w, h, xw, yh) {
        var segment = new Segment(this, this.segments.length, x, y, w, h, xw, yh);
        this.segments.push(segment);
    }
    getSegmentByXY (x, y?): Segment {
        if(x instanceof Item){
            y = x.y;
            x = x.x;
        }

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
    getSurroundingSegments(x, y?): Array<Segment>{
        if(x instanceof Item){
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
        ].filter(v => v);
    }
    getSurroundingSegmentCoords(x, y){
        var segments = this.getSurroundingSegments(x, y);
        var startX = 0, startY = 0, endX = 0, endY = 0;
        for(var i = 0; i < segments.length; i++){
            if(segments[i].x < startX)startX = segments[i].x;
            if(segments[i].x + segments[i].w > endX)endX = segments[i].x + segments[i].w;
            if(segments[i].y < startY)startY = segments[i].y;
            if(segments[i].y + segments[i].h > endY)endY = segments[i].y + segments[i].h;
        }
        return {
            x : startX,
            y : startY,
            w : x + endX,
            h : y + endY,
            endX : endX,
            endY : endY
        };
    }


}
module.exports = Grid;

