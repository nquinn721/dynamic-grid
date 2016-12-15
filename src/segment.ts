import {EventEmitter} from 'events';
import {Grid} from './grid';
import {Item} from './item';

export class Segment extends EventEmitter{
    public items = [];

    constructor(
        public grid,
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
        this.emit('update', item);
    }
    removeItem(item: Item){
        this.items.splice(this.items.indexOf(item),1);
        this.emit('update');
    }
    getAllItemsPlain (){
        return this.items.map(v => v.plain());
    }
    getItemsExcept (id){
        return this.items.filter(v => v.id != id);
    }
    emitToAllItems (event, data){
        this.items.forEach(v => v.emit(event, data));
    }
    emitToAllItemsExcept(item: Item, event, data){
        this.items.filter(v => v.id !== item.id).forEach(v => v.emit(event, data));
    }
}
