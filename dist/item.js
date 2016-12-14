"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var flatten = function (list) { return list.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []); };
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(grid, id, x, y) {
        _super.call(this);
        this.grid = grid;
        this.id = id;
        this.x = x;
        this.y = y;
    }
    Item.prototype.update = function (x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || this.x;
        this.y = y || this.y;
        if (this.segment)
            if (this.x < this.segment.x || this.x >= this.segment.xw || this.y < this.segment.y || this.y >= this.segment.yh) {
                this.segment.update(this);
                this.emit('segment change');
            }
    };
    Item.prototype.getOtherItemsInSegment = function (plain) {
        if (plain)
            return this.segment.getItemsExcept(this.id).map(function (v) { return v.plain(); });
        if (this.segment)
            return this.segment.getItemsExcept(this.id);
    };
    Item.prototype.getItemsInSurroundingSegments = function (plain) {
        var segments = this.grid.getSurroundingSegments(this.x, this.y), self = this;
        if (plain) {
            return flatten(segments.map(function (v) { return v && v.getItemsExcept(self.id).map(function (v) { return v.plain(); }); }));
        }
        else {
            return flatten(segments.map(function (v) { return v && v.getItemsExcept(self.id); }));
        }
    };
    Item.prototype.destroy = function () {
        if (this.segment)
            this.segment.removeItem(this);
        this.grid.destroyItem(this);
    };
    Item.prototype.plain = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id
        };
    };
    return Item;
}(events_1.EventEmitter));
exports.Item = Item;
//# sourceMappingURL=item.js.map