import {EventEmitter} from 'events';
export class Item extends EventEmitter{

    public segment;

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
    getOtherItemsInSegment (plain){
        if(plain)
            return this.segment.getItemsExcept(this.id).map(v => v.plain());

        if(this.segment)
            return this.segment.getItemsExcept(this.id);
    }
    getItemsInSurroundingSegments (plain){
        var segments = this.grid.getSurroundingSegments(this.x, this.y),
            self = this;
        if(plain){
            return segments.map(v => v.getItemsExcept(self.id).map(v => v.plain()));
        }else{
            return segments.map(v => v.getItemsExcept(self.id));
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