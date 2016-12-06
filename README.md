# Dynamic Grid

This is a dynamic grid for gaming.


```javascript
var Grid = require('dynamicgrid');
var grid = new Grid;

// initialize grid 
grid.init(w, h, segment); // Segment is {w : w, h : h}

var item = grid.createItem(110, 110); // Returns Item

// Update items position
item.update(x, y) // Defaults to current x and y

// Listen when items show up in segment
item.segment.on('update', cb);

// Listen to item changing segment
item.on('segment change', cb);

// Get plain object to pass to client 
item.plain()

// Listen to all segment changes in grid
grid.on('update', cb);

// Get all other items in segment
item.getOtherItemsInSegment('plain'); // Plain passes as param returns all of the other items plain object
                                      // otherwise you get the full item
```
