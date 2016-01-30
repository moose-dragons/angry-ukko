var minimum = 1;
var maximum = 20;

var blocks = [10];
var assignedBlocks = [];

var randomnumber = function() {
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

var i = 0;

for (i = 0; i < blocks.length; i++) {

    do {
        var x = randomnumber();
        var y = randomnumber();
    }
    while (!isPlaceReserved(x, y, assignedBlocks));
            
    block.x = x;
    block.y = y;
            
    assignedBlocks.push(block);   
}
    

function isPlaceReserved() {
    for (j = 0; j < assignedBlocks.length; j++) {
        
        if (x == assignedBlocks[j].x && y == assignedBlocks[j].y) {
        
            return true;
        }
    }
    return false;
}