import Grid from "../dist/grid";
import assert from 'assert';

describe("Grid", function() {
    "use strict";

    beforeEach(function () {
        this.grid = new Grid(2000, 2000, {w: 100, h: 100});
        this.item = this.grid.createItem(10, 10);
        this.item1 = this.grid.createItem(99, 99);
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
        assert.equal(otherItem[0].id, this.item1.id);
    });

    it("Should listen to segment group", function () {
        this.item.listenToSegmentGroup(function (event, item) {
            assert.equal(event, 'move item');
            assert.equal(item.id, 1);
            assert.equal(item.x, 88);
        });
        this.item1.update(88);
    });

    it("Should see when item moves", function () {
        this.item.listenToSegmentGroup(function (event, item) {
            assert.equal(event, 'move item');
            assert.equal(item.id, 1);
            assert.equal(item.x, 88);
        });
        this.item1.update(88);


    });

    it("Should show a leave segment event", function (done) {
        this.item.listenToSegmentGroup(function (event, item) {
            assert.equal(event, 'remove item');
            assert.equal(item.id, 1);
            assert.equal(item.x, 300);
        });

        // Item leaves segment group
        setTimeout(function () {
            this.item1.update(300);
            done();
        }.bind(this), 100);
    })

    it("Player should be able to move to a new segment group and see item again", function (done) {
        var self = this;

        this.item1.update(301);
        this.item.listenToSegmentGroup(function (event, item) {
            if(item.id !== self.item.id){
                assert.equal(event, 'move item');
                assert.equal(item.id, 1);
                assert.equal(item.x, 302);

            }
        });

        // Item leaves segment group
        setTimeout(function () {
            this.item.update(200);
            this.item1.update(302);
            done();
        }.bind(this), 100);
    });

    it("After player moving should not be able to listen to old segments", function (done) {
        this.item.listenToSegmentGroup(function (event, item) {
            if(item.id === 1){
                assert.equal(event,'move item');
                assert.equal(item.id, 1);
            }
        });
        this.item1.update(88);

        setTimeout(function () {
            this.item.update(200);
            this.item1.update(77);
            done();
        }.bind(this), 100);
    });
});
