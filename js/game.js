var score = 0;

Crafty.init();

Crafty.scene("loading", function(){

    //Crafty.background("#000");
    Crafty.e("2D, DOM, Text")
        .attr({ w: 1000, h: 20, x: Crafty.DOM.window.width/2-500, y: Crafty.DOM.window.height/2-200 })
        .text("Flappy Crab")
        .css({ "text-align": "center"})
        .textFont({size: "100px", weight: "bold"})
        .textColor("#f63d21");

    Crafty.e("2D, DOM, Text")
        .attr({ w: 1000, h: 20, x: Crafty.DOM.window.width/2-500, y: Crafty.DOM.window.height/2-50 })
        .text("Press any key to begin")
        .css({ "text-align": "center"})
        .textFont({size: "30px", weight: "bold"})
        .textColor("#ffffff");

    Crafty.e("2D, DOM")
        .bind("KeyDown", function(e) {
            Crafty.scene("game");
        });
});


Crafty.scene("game", function() {

    Crafty.init();

    Crafty.audio.add("clickSound", "res/click.mp3");

    var width = 1270;
    var height = 900;

    var platformPair = 0;

    Crafty.sprite(60, "res/spritesheet.png", { crab: [0, 0]});

    Crafty.c("Box", {
    init: function() {
        this.addComponent("2D, Canvas, Mouse, Tween, crab");

        this.w = 60;    // width
        this.h = 60;    // height
        //this.color("#DB4300");

        this.xpos = 400;     // x position

        this.bind("EnterFrame", function(e) {

            this.xpos = this.xpos-8;

            if (this.x < 0){
                endGame();
            }

            this.tween({x: this.xpos}, 15);
        });

        this.bind("Click", function(e) {
            console.log("Click");
            Crafty.audio.play("clickSound");
      		this.xpos = this.xpos+100;
      		this.tween({x: this.xpos}, 10);
        });
    },

    clickBox: function() {
    	this.xpos = this.xpos+150;
      	this.tween({x: this.xpos}, 5);
    },

    makeBox: function(y, color) {
    	this.attr({x: this.xpos, y: y});
    }
    });


    Crafty.c("Platform", {
    init: function() {
    	this.addComponent("2D, Canvas, Color, Mouse, Tween, Collision, Gravity");

    	this.h = 60;
    	this.w = 100;
    	this.color("#00FF00");

    	//this.ypos = 500;

    	this.bind("EnterFrame", function(e){
    		//this.ypos = this.ypos - 5;
    		this.tween({y: this.y-5}, 1);

            //console.log(this.y);

            if(this.y <= 0){
                //Create new rectangle
                //score++;
                //console.log(score);
                //updateScore();
                //createNewPlatform();
                this.destroy();
                platformPair++;

                if(platformPair == 2){
                    score++;
                    console.log(score);
                    updateScore();
                    createNewPlatform();
                    platformPair = 0;
                }
            }
    	});

        this.onHit("Box", 
            function(e){
                /*console.log("Box hit Platform");
                crab.cancelTween();
                Crafty.scene("end");*/
                endGame();
            }
        );
    },

    makePlatform: function(xi, wi) {
    	this.attr({x: xi, y: height, w: wi});
    }

    });


    var scoreDisplay = Crafty.e("2D, DOM, Text")
    scoreDisplay.attr({ x: Crafty.DOM.window.width - 100, y: 0 }).text("0").textColor('#F3FDFB').textFont({size: '20px'}).unselectable;


    function createNewPlatform(){
    /*Make random configurations of platforms
    Each set of platforms comes in pairs*/


    //Get the width of window for calculations
    var width = Crafty.DOM.window.width;

    console.log(width);

    //Pick random number for first platform width and create the platform
    var widthAllowed = width-300
    var w1 = Math.floor(Math.random()*(widthAllowed)+10);
    Crafty.e("Platform").makePlatform(0, w1);          

    //Now create the second platform factoring in the gap required
    var padding = 135;
    var xshift = w1+padding;
    var w2 = width-xshift;
    Crafty.e("Platform").makePlatform(xshift, w2);

    console.log(widthAllowed + " " + w1 + " " + xshift + " "+ w2);
    }

    function updateScore(){
    scoreDisplay.text(score);
    }

    var crab = Crafty.e("Box");
    crab.makeBox(0);
    createNewPlatform();

    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    crab.clickBox();
    });
});

Crafty.scene("end", function(){
    Crafty.audio.add("sea", "res/underthesea.mp3");

    Crafty.audio.play("sea");

    Crafty.e("2D, DOM, Text")
        .attr({ w: 1000, h: 20, x: Crafty.DOM.window.width/2-500, y: Crafty.DOM.window.height/2-80 })
        .text("GAME OVER")
        .css({ "text-align": "center"})
        .textFont({size: "50px", weight: "bold"})
        .textColor("#ffffff");

    Crafty.e("2D, DOM, Text")
        .attr({ w: 1000, h: 20, x: Crafty.DOM.window.width/2-500, y: Crafty.DOM.window.height/2-30 })
        .text("Score: " + score)
        .css({ "text-align": "center"})
        .textFont({size: "50px", weight: "bold"})
        .textColor("#ffffff");

    Crafty.e("2D, DOM, Text")
        .attr({ w: 1000, h: 20, x: Crafty.DOM.window.width/2-500, y: 500 })
        .text("Made by Visrut Sudhakar - Press any key to restart.")
        .css({ "text-align": "center"})
        .textFont({size: "20px", weight: "bold"})
        .textColor("#ffffff");


    Crafty.e("2D, DOM")
        .bind("KeyDown", function(e) {
            document.location.reload(true);
        });
});

function endGame(){
    Crafty.scene("end");
}


Crafty.scene("loading");
//Crafty.scene("game");