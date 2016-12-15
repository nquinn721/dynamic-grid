import {EventEmitter} from 'events';
import {Grid} from './grid';
import {Segment} from './segment';

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
export class Item extends EventEmitter{

    private segmentGroupListenerCallback;
    private isListeningToSegmentGroup;


    constructor(
        public grid: Grid,
        public segment: Segment,
        public segmentGroup: Array<Segment>,
        public id,
        public x,
        public y
    ) {super();}

    update (x, y){
        if(typeof x === 'object'){
            y = x.y;
            x = x.x;
        }

        this.x = x || this.x;
        this.y = y || this.y;
        if(this.segment)
            if(this.x < this.segment.x || this.x >= this.segment.xw || this.y < this.segment.y || this.y >= this.segment.yh){
                this.grid.moveSegment(this);
                this.emit('segment change');

                if(this.isListeningToSegmentGroup) {
                    this.clearSegmentGroupListeners();
                    this.segmentGroup = this.grid.getSurroundingSegments(this);
                    this.setupSegmentGroupListener();
                }


            }
        if(this.segment)
            this.segment.moveItem(this);
        this.emit('move');

        if(!this.segment){
            if(this.x >= 0 || this.x <=  this.grid.w || this.y >= 0 || this.y <=  this.grid.h)
                this.segment = this.grid.getSegmentByXY(this);
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
        if(plain){
            return flatten(segments.map(v => v && v.getItemsExcept(self.id).map(v => v.plain())));
        }else{
            return flatten(segments.map(v => v && v.getItemsExcept(self.id)));
        }
    }
    listenToSegmentGroup (cb){
        this.isListeningToSegmentGroup = true;
        this.segmentGroupListenerCallback = cb;
        this.setupSegmentGroupListener();
    }
    clearSegmentGroupListeners(){

        for(var i = 0; i < this.segmentGroup.length; i++){
            this.segmentGroup[i].removeListener('add item', this.segmentGroupListenerCallback);
            this.segmentGroup[i].removeListener('remove item', this.segmentGroupListenerCallback);
            this.segmentGroup[i].removeListener('move item', this.segmentGroupListenerCallback);
        }
    }
    setupSegmentGroupListener(){
        for(var i = 0; i < this.segmentGroup.length; i++){
            this.segmentGroup[i].on('add item', this.segmentGroupListenerCallback);
            this.segmentGroup[i].on('remove item', this.segmentGroupListenerCallback);
            this.segmentGroup[i].on('move item', this.segmentGroupListenerCallback);
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