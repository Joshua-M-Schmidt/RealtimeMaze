
function getDirection(possibleDirections){
    var x = Math.sin(seed++) * 10000;
    return possibleDirections[Math.floor((x - Math.floor(x)) * possibleDirections.length)]
    //return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
}

function isValidPosition(x,y,w,h,direction){
    switch(direction){
        case 0: // left
            if((x-1) < 0){
                return false;
            }
            break;
        case 1: // right
            if((x+1) >= w){
                return false;
            }
            break;
        case 2: // bottom
            if((y+1) >= h){
                return false;
            }
            break;
        case 3: // top
            
            if((y-1) < 0){
                return false;
            }
            break;
    }
    return true;
}

function hasFreeNeighbour(cX,cY){

    var retArr = []

    if(cX-1 >= 0){ // left
        if(cells[cX-1][cY].visited == false){
            retArr.push(0);
        }
    }
    if(cX+1 < gridSize){ // right
        if(cells[cX+1][cY].visited == false){
            retArr.push(1);
        }
    }

    if(cY+1 < gridSize){ // bottom
        if(cells[cX][cY+1].visited == false){
            retArr.push(2);
        }
    }

    if(cY-1 >= 0){ // top
        if(cells[cX][cY-1].visited == false){
            retArr.push(3);
        }
    }

    return retArr;
}

function getPossiblePosition(){
    for (var i = 0; i < cells.length; i++) { 
        for (var j = 0; j < cells.length; j++) { 
            if(hasFreeNeighbour(i,j).length > 0){
                return {
                    "cX":i,
                    "cY":j
                }
            }
        } 
    } 
}

var gridSize = 30;
var cells = new Array(gridSize);

var players = [];
var self;

function s( p) { // p could be any variable name
    var sketchWidth;
    var sketchHeight;

    var elementSize = 0;

    p.setup = function() {
        sketchWidth = document.getElementById("maze").offsetWidth;
        sketchHeight = document.getElementById("maze").offsetHeight;
        p.createCanvas(sketchWidth, sketchHeight);


        self = {
            "x": 0,
            "y": 0,
            "color": "black",
        }

        elementSize = sketchWidth/30;

        // Loop to create 2D array using 1D array
        for (var i = 0; i < cells.length; i++) { 
            cells[i] = []; 
        } 

        // Loop to initilize 2D array elements. 
        for (var i = 0; i < cells.length; i++) { 
            for (var j = 0; j < cells.length; j++) { 
                cells[i][j] = {
                    "x" : i* (sketchWidth/gridSize),
                    "y": j* (sketchHeight/gridSize),
                    "l": true,
                    "r": true,
                    "t": true,
                    "b": true,
                    "visited": false,
                }; 
            } 
        } 

        // generate path

        var cX = 0;
        var cY = 0

        for(var i = 0; i < 30*30; i++){

            // is advancing possible?

            var possibleDirections = hasFreeNeighbour(cX,cY);
            var direction;

        
            if(possibleDirections.length == 0){
                var position = getPossiblePosition();
                
                if(position){
                    possibleDirections = hasFreeNeighbour(position.cX,position.cY);
                    direction = getDirection(possibleDirections);
    
                    cX = position.cX;
                    cY = position.cY;
                }
                
            }else{
                direction = getDirection(possibleDirections);
            }

        
            switch(direction){
                case 0: // left
                    if(isValidPosition(cX,cY,gridSize,gridSize,0)){
                        if(cells[cX-1][cY].visited == false){
                            cells[cX][cY].visited = true;
                            cells[cX][cY].l = false;
                            cells[cX-1][cY].visited = true;
                            cells[cX-1][cY].r = false;
                            cX--;
                        }
                    }
                    break;
                case 1: // right
                    if(isValidPosition(cX,cY,gridSize,gridSize,1)){
                        if(cells[cX+1][cY].visited == false){
                            cells[cX][cY].visited = true;
                            cells[cX][cY].r = false;
                            cells[cX+1][cY].visited = true;
                            cells[cX+1][cY].l = false;
                            cX++;
                        }
                        
                    }
                    break;
                case 2: // bottom
                if(isValidPosition(cX,cY,gridSize,gridSize,2)){
                    if(cells[cX][cY+1].visited == false){
                        cells[cX][cY].visited = true;
                        cells[cX][cY].b = false;
                        cells[cX][cY+1].visited = true;
                        cells[cX][cY+1].t = false;
                        cY++;
                    }
                    
                }
                break;
                case 3: // top
                    if(isValidPosition(cX,cY,gridSize,gridSize,3)){
                        if(cells[cX][cY-1].visited == false){
                            cells[cX][cY].visited = true;
                            cells[cX][cY].t = false;
                            cells[cX][cY-1].visited = true;
                            cells[cX][cY-1].b = false;
                            cY--;
                        }
                        
                    }
                    break;
            }
        }
    };

    p.draw = function() {
        p.background(245);
        for(var n = 0; n < players.length; n++){
            p.fill(p.color("magenta"));
            p.circle(cells[players[n].x][players[n].y].x+ (elementSize/2), cells[players[n].x][players[n].y].y+(elementSize/2), elementSize*0.8);
        }
        
    
        // Loop to initilize 2D array elements. 
        for (var i = 0; i < cells.length; i++) { 
            for (var j = 0; j < cells.length; j++) { 
                if(cells[i][j].visited){
                    p.strokeWeight(0);
                    
                }

                p.strokeWeight(1);
                // top line
                if(cells[i][j].t)
                    p.line(cells[i][j].x, cells[i][j].y, cells[i][j].x + elementSize, cells[i][j].y);
                // bottom line
                if(cells[i][j].b)
                    p.line(cells[i][j].x, cells[i][j].y+ elementSize, cells[i][j].x + elementSize, cells[i][j].y+ elementSize);
                // left line
                if(cells[i][j].l)
                    p.line(cells[i][j].x, cells[i][j].y, cells[i][j].x , cells[i][j].y + elementSize);
                // right line
                if(cells[i][j].r)
                    p.line(cells[i][j].x + elementSize, cells[i][j].y, cells[i][j].x + elementSize, cells[i][j].y + elementSize);

                
            } 
        } 

        p.fill(p.color("tomato"));
        p.strokeWeight(0);
        p.square(cells[0][0].x, cells[0][0].y, elementSize);
        p.fill(p.color("limegreen"));
        p.square(cells[gridSize-1][gridSize-1].x, cells[gridSize-1][gridSize-1].y, elementSize);


        p.fill(p.color(self.color));
        p.circle(cells[self.x][self.y].x+ (elementSize/2), cells[self.x][self.y].y+(elementSize/2), elementSize*0.8);
    };

    p.windowResized = function() {
        sketchWidth = document.getElementById("maze").offsetWidth;
        sketchHeight = document.getElementById("maze").offsetHeight;
        p.resizeCanvas(sketchWidth, sketchHeight);
    };

    p.keyPressed = function() {
        switch(p.key){
            case 'a':
                if(self.x-1 >= 0 && (cells[self.x][self.y].l == false)){
                    self.x--;
                }
                break;
            case 's':
                if(self.y+1 < gridSize  && (cells[self.x][self.y].b == false)){
                    self.y++;
                }
                break;
            case 'd':
                if(self.x+1 < gridSize  && (cells[self.x][self.y].r == false)){
                    self.x++;
                }
                break;
            case 'w':
                if(self.y-1 >= 0  && (cells[self.x][self.y].t == false)){
                    self.y--;
                }
                break;
            default:
                break;
        }

        var sfDocRef = db.collection("player").doc(id);

        // Uncomment to initialize the doc.
        // sfDocRef.set({ population: 0 });

        db.runTransaction(function(transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(sfDocRef).then(function(sfDoc) {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }

                // Add one person to the city population.
                // Note: this could be done without a transaction
                //       by updating the population using FieldValue.increment()
                transaction.update(sfDocRef, { x: self.x, y:self.y });
            });
        }).then(function() {
            console.log("Transaction successfully committed!");
        }).catch(function(error) {
            console.log("Transaction failed: ", error);
        });

        if(self.y == gridSize-1 && self.x == gridSize-1){
            alert("you won");

            var mazeDoc = db.collection("maze").doc("yd5zLMtR7G63N14DkA6U");

            // Uncomment to initialize the doc.
            // sfDocRef.set({ population: 0 });

            return db.runTransaction(function (transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(mazeDoc).then(function (mDoc) {
                if (!mDoc.exists) {
                    throw "Document does not exist!";
                }

                // Add one person to the city population.
                // Note: this could be done without a transaction
                //       by updating the population using FieldValue.increment()
                var newSeed = Math.floor(Math.random() * 10000);
                transaction.update(mazeDoc, { seed: newSeed });
                location.reload();
                });
            })
            .then(function () {
                console.log("Transaction successfully committed!");
            })
            .catch(function (error) {
                console.log("Transaction failed: ", error);
            });
        }
    };
}
