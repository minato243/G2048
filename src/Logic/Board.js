/*
 * Created by thaod on 7/24/2018.
 */

var Board = cc.Class.extend({

    matrix:[],
    size: 4,
    emptyList:[],

    ctor: function(size){
        this.size = size;
        for (var i = 0; i < size; i ++){
            this.matrix.push([]);
        }
        this.initRandom();
    },

    initRandom: function(){
        var pos = this.createRandomPos();
        cc.log("initRandom ["+pos.x+" "+pos.y+"]");
        this.matrix[pos.x][pos.y] = 2;
        this.addNewNumber();
    },

    addNewNumber: function(){
        var pos = this.getEmptyPos();
        cc.log("addNewNumber ["+pos.x+" "+pos.y+"]");
        if(pos.x == -1 && pos.y == -1) return false;
        this.matrix[pos.x][pos.y] = 2;
        return true;
    },

    createRandomPos: function(){
        var x = Math.floor(Math.random() * this.size);
        var y = Math.floor(Math.random() * this.size);

        return cc.p(x,y);
    },

    getEmptyPos: function(){
        var size = this.size;

        this.emptyList = [];
        for (var i =0; i < size; i ++){
           for (var j = 0; j < size; j ++){
               if(this.matrix[i][j] == 0 || this.matrix[i][j] === undefined){
                   var pos = cc.p(i,j);
                   this.emptyList.push(pos);
               }
           }
        }

        var n = this.emptyList.length;
        if(n == size *size) return cc.p(-1, -1);
        var r = Math.floor(Math.random() * n);

        return this.emptyList[r];
    },

    moveLeftAndAddNewNumber: function(){
        if(this.moveLeft())
            this.addNewNumber();
    },

    moveRightAndAddNewNumber: function(){
        if(this.moveRight())
            this.addNewNumber();
    },

    moveUpAndAddNewNumber: function(){
        if(this.moveUp())
            this.addNewNumber();
    },

    moveDownAndAddNewNumber: function(){
        if(this.moveDown())
            this.addNewNumber();
    },

    moveLeft: function(){
        cc.log("moveLeft");
        var size = this.size;

        var hasMoved = false;
        for (var i = 0; i < size; i++){
            for (var j = 0; j < size; j++){
                if(this.matrix[i][j] == 0 || this.matrix[i][j] == undefined){
                    for(var k = j +1; k < size; k ++){
                        if(this.matrix[i][k] != undefined && this.matrix[i][k] != 0){
                            this.matrix[i][j] = this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if(this.matrix[i][j] != undefined && this.matrix[i][j] != 0){
                    for(k = j +1; k < size; k ++){
                        if(this.matrix[i][k] != undefined && this.matrix[i][k] == this.matrix[i][j]){
                            this.matrix[i][j] += this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }

            }
        }
    },

    moveRight: function(){
        cc.log("moveRight");
        var size = this.size;

        var hasMoved = false;
        for (var i = 0; i < size; i++){
            for (var j = size -1; j >= 0; j--){
                if(this.matrix[i][j] == 0 || this.matrix[i][j] == undefined){
                    for(var k = j -1; k >= 0; k --){
                        if(this.matrix[i][k] != undefined && this.matrix[i][k] != 0){
                            this.matrix[i][j] = this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if(this.matrix[i][j] != undefined && this.matrix[i][j] != 0){
                    for(k = j -1; k >= 0; k --){
                        if(this.matrix[i][k] != undefined && this.matrix[i][k] == this.matrix[i][j]){
                            this.matrix[i][j] += this.matrix[i][k];
                            this.matrix[i][k] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }

            }
        }

        return hasMoved;
    },

    moveUp: function(){
        cc.log("moveUp");
        var size = this.size;

        var hasMoved = false;
        for (var j = 0; j < size; j++){
            for (var i = 0; i < size; i++){
                if(this.matrix[i][j] == 0 || this.matrix[i][j] == undefined){
                    for(var k = i +1; k < size; k ++){
                        if(this.matrix[k][j] != undefined && this.matrix[k][j] != 0){
                            this.matrix[i][j] = this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if(this.matrix[i][j] != undefined && this.matrix[i][j] != 0){
                    for(k = i +1; k < size; k ++){
                        if(this.matrix[k][j] != undefined && this.matrix[k][j] == this.matrix[i][j]){
                            this.matrix[i][j] += this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }

            }
        }
        return hasMoved;
    },

    moveDown: function(){
        cc.log("moveDown");
        var size = this.size;

        var hasMoved = false;
        for (var j = 0; j < size; j++){
            for (var i = 0; i < size; i++){
                if(this.matrix[i][j] == 0 || this.matrix[i][j] == undefined){
                    for(var k = i -1; k >= 0; k --){
                        if(this.matrix[k][j] != undefined && this.matrix[k][j] != 0){
                            this.matrix[i][j] = this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }
                if(this.matrix[i][j] != undefined && this.matrix[i][j] != 0){
                    for(k = i - 1; k >= 0; k --){
                        if(this.matrix[k][j] != undefined && this.matrix[k][j] == this.matrix[i][j]){
                            this.matrix[i][j] += this.matrix[k][j];
                            this.matrix[k][j] = 0;
                            hasMoved = true;
                            break;
                        }
                    }
                }

            }
        }
        return hasMoved;
    },

    getMatrixString: function(){
        var size = this.size;

        var result = "";
        for (var i = 0; i < size; i ++){
            for (var j = 0; j < size; j ++){
                if(this.matrix[i][j] != undefined){
                    result += this.matrix[i][j]+", ";
                } else result +="0, ";
            }
            result += "\n";
        }
        return result;
    }

});
