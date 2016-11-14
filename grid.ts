import events = require('events');
var EventEmitter = events.EventEmitter;

class Item extends EventEmitter{
    public segment;

    constructor(public id, public x, public y) {super();}

    update (x, y){
        this.x = x;
        this.y = y;
        if(this.x < this.segment.x || this.x >= this.segment.xw || this.y < this.segment.y || this.y >= this.segment.yh){
            this.segment.update(this);
            this.emit('update');
        }

    }
    plain(){
        return {
            x : this.x,
            y : this.y,
            id : this.id
        }
    }
}

class Segment extends EventEmitter{
    public items = [];

    constructor(
        public grid: Grid,
        public id,
        public x,
        public y,
        public w,
        public h,
        public xw,
        public yh
    ) {super();}

    update (item: Item){
        this.emit('before update');
        this.items.splice(this.items.indexOf(item), 1);
        this.grid.update(item);
        this.emit('update');
    }
    createItem (x, y){

    }
    getAllItemsPlain (){
        return this.items.map(v => v.plain());
    }
    getItemsExcept (id){
        return this.items.map(v => v.plain()).filter(v => v.id != id);
    }
    emitToAllItems (event, data){
        this.items.forEach(v => v.emit(event, data));
    }
    emitToAllItemsExcept(item: Item, event, data){
        this.items.filter(v => v.id !== item.id).forEach(v => v.emit(event, data));
    }
}

class Grid extends EventEmitter {
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
module.exports = Grid;