import Grid from "../dist/grid";
import assert from 'assert';

describe("Grid", function() {
    "use strict";

    beforeEach(function () {
        this.grid = new Grid.Grid;
        this.grid.init(2000, 2000, {w: 100, h: 100});
        this.item = this.grid.createItem(10, 10);
        this.item1 = this.grid.createItem(100, 100);
    });

    it("Should create an item", function () {
        assert.equal(this.item.x, 10);
        assert.equal(this.item.y, 10);
        assert.equal(this.item.id, 0);
        assert.equal(this.item.segment.id, 0);
        assert.equal(this.item.segment.x, 0);
        assert.equal(this.item.segment.y, 0);
        assert.equal(this.item.segment.xw, 100);
        assert.equal(this.item.segment.yh, 100);
    });

    it("Should have specific segments", function () {
       var segment = this.grid.getSegmentByXY(10 , 10);
        assert.equal(segment.id, 0);
        assert.equal(segment.w, 100);
        assert.equal(segment.h, 100);
    });

    it("Should update the segment on move of item", function () {
        this.item.update(100);
        assert.equal(this.item.x, 100);
        assert.equal(this.item.y, 10);
        assert.equal(this.item.segment.id, 20);
        assert.equal(this.item.segment.x, 100);
    });

    it("Should get other items in segment", function () {
        var otherItem = this.item.getOtherItemsInSegment();
        assert.equal(otherItem, this.item1);
    });
});
