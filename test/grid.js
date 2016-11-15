var Grid = require('../dist/grid').Grid;
var assert = require('assert');

describe("Grid", function() {
    "use strict";

    beforeEach(function () {
        this.grid = new Grid;
        this.grid.init(2000, 2000, {w: 100, h: 100});

    });

    it("Should create an item", function () {
        var item = this.grid.createItem(10, 10);
        assert.equal(item.x, 10);
        assert.equal(item.y, 10);
        assert.equal(item.id, 0);
        assert.equal(item.segment.id, 0);
        assert.equal(item.segment.x, 0);
        assert.equal(item.segment.y, 0);
        assert.equal(item.segment.xw, 100);
        assert.equal(item.segment.yh, 100);
    });
});
