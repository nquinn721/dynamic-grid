# Dynamic Grid

This is a dynamic grid for gaming.

    var Grid = require('dynamicgrid').Grid;
    var grid = new Grid;
    
    // initialize grid 
    grid.init(w, h, segment); // Segment is {w : w, h : h}
    
    var item = grid.createItem(110, 110); // Returns Item
    
    // Update items position
    item.update(x, y) // Defaults to current x and y
    
    // Listen when items segment changes
    item.segment.on('update', cb);
    
    // Listen to all segment changes in grid
    grid.on('update', cb);

