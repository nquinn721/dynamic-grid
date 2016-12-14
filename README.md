# Dynamic Grid

This is a dynamic grid for gaming.


```javascript
var Grid = require('dynamicgrid');
var grid = new Grid(w, h, segment); // Segment is {w : w, h : h}

var item = grid.createItem(110, 110); // Returns Item

// Update items position
item.update(x, y) // Defaults to current x and y

// Listen when items show up in segment
item.segment.on('update', cb);

// Listen to item changing segment
item.on('segment change', cb);

// Get plain object to pass to client 
item.plain();

// Destroy item
item.destroy();

// Listen to destroyed items
grid.on('destroyed item', cb); // Gets passed item

// Listen to all segment changes in grid
grid.on('update', cb);

// With socket.io
io.emit('item', item.plain());

// Get all other items in segment 
item.getOtherItemsInSegment(true); // True passes as param returns all of the other items plain object
                                      // otherwise you get the full item

// Get items in surrounding segments
item.getItemsInSurroundingSegments(true); // True gets items in plain object
```
