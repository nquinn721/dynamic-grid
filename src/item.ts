import {EventEmitter} from 'events';
export class Item extends EventEmitter{

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