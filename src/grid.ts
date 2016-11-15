import {EventEmitter} from 'events';
import {Item} from './item';
import {Segment} from './segment';

export class Grid extends EventEmitter {
    private segments = [];
    private items = [];

    init (w, h, gridSize) {
        for (var i = 0; i < w; i += gridSize.w)
            for (var j = 0; j < h; j += gridSize.h)
                this.createSegment(i, j, gridSize.w, gridSize.h, i + gridSize.w, j + gridSize.h);
    }
    createItem (x, y) {
        var segment = this.getSegmentByXY(x, y),
            item = new Item(this.items.length, x, y);

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

    update (item: Item){
        this.emit('before update');
        var segment = this.getSegmentByXY(item.x, item.y)
        segment.items.push(item);
        item.segment = segment;
        item.segment.emit('update');
        this.emit('update');
    }
}

