import {EventEmitter} from 'events';
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
export class Item extends EventEmitter{

    public segment;
    public segments;

    constructor(public grid, public id, public x, public y) {super();}

    update (x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;
        }

        this.x = x || this.x;
        this.y = y || this.y;
        if(this.segment)
            if(this.x < this.segment.x || this.x >= this.segment.xw || this.y < this.segment.y || this.y >= this.segment.yh){
                this.segment.update(this);
                this.emit('segment change');
            }

    }
    withinRange(x, y){
        var coords = this.grid.getSurroundingSegmentCoords(this.x, this.y);
        if(x > coords.x && x < coords.endX && y > coords.y && y < coords.endY)return true;
    }
    getOtherItemsInSegment (plain){
        if(plain)
            return this.segment.getItemsExcept(this.id).map(v => v.plain());

        if(this.segment)
            return this.segment.getItemsExcept(this.id);
    }
    getItemsInSurroundingSegments (plain){
        var segments = this.grid.getSurroundingSegments(this.x, this.y),
            self = this;
        this.segments = segments;
        if(plain){
            return flatten(segments.map(v => v && v.getItemsExcept(self.id).map(v => v.plain())));
        }else{
            return flatten(segments.map(v => v && v.getItemsExcept(self.id)));
        }
    }
    listenToSurroundingSegments (cb){
        for(var i = 0; i < this.segments.length; i++){
            this.segments[i].on('update', cb);
        }
    }
    destroy(){
        if(this.segment)
            this.segment.removeItem(this);
        this.grid.destroyItem(this);
    }
    plain(){
        return {
            x : this.x,
            y : this.y,
            id : this.id
        }
    }
}