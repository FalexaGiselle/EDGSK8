// M: Miriam
// L: Falexa
// B: Blanca
// P: Pooh
// Q&A: Ask Adrián

// L: Cada vez que SE haga una sección escribe un comentario que ponga al principio "inicio seccion X" y al final "inicio seccion X"

// M: Menú desplegable
function openMenu() {
    "use strict";
    document.getElementById("menu").style.left = "0";
}

function closeMenu() {
    "use strict";
    document.getElementById("menu").style.left = "-100%";
};


// M: Menú desplegable
// SLIDE

var speedX = 5;
var speedY = 5;

var singlePlayer = null;

if (Math.sign == undefined) {
	Math.sign = function(value) {
		return value == 0 ? 0 : (value < 0 ? -1 : 1);
	}
}

// Nyan Cat (Juego)
$( document ).ready(function() {
    
    var speedX = 5;
    var speedY = 5;
    var speedLevel = 1;

    var singlePlayer = null;

    if(Math.sign == undefined){
        Math.sign = function(value){
            return value == 0 ? 0 : (value < 0 ? -1 : 1);
        }
    }

    $(".player-button").on("click",function(){
        var button = $(this);
        var html = button.html();

        if(html == "1 JUGADOR"){
            singlePlayer = true;
            $(".levels").show();
            $(".player-button").hide();
            
        }
        else if(html == "2 JUGADORES"){
            singlePlayer = false;
            $(".controls").show();
            $(".player-button").hide();
        }
    });

    $(".player-level").on("click",function(){
        var lvl = $(this).html().replace("NIVEL ","");

        AI.level = parseInt(lvl);

        $(".start-menu").hide();

        Cat.start();
    });

    $(".exit").on("click",function(){
        Cat.reset();
        Scores.reset();
        GoalKeepers.reset();
        $("#awesome-background-music")[0].pause();
        $("#awesome-background-music")[0].currentTime = 0;
    });

    $(".player-got-it").on("click",function(){
        $(".controls").hide();
        Cat.start();
    })

    $("#awesome-background-music")[0].loop = true;

    var AI = {
        goalkeeperClass: null,
        level: 1,
        setAIGoalKeeper: function(goalkeeperClass){
            this.goalkeeperClass = goalkeeperClass;
        },
        getCatY: function(){
            return $(".cat").position().top;
        },
        getMyY: function(){
            return this.getGoalKeeperNode().position().top;
        },
        getMySpeed: function(){
            return Math.abs(speedY * this.level * 0.7);
        },
        getGoalKeeperNode: function(){
            return $("." + this.goalkeeperClass.toLowerCase() + "-goalkeeper");
        },  
        doYourJob: function(){
            var catY = this.getCatY();
            var myY = this.getMyY();

            var func = "update" + this.goalkeeperClass;
            var speed = this.getMySpeed();

            if(catY > myY){
                GoalKeepers[func](myY + speed);
            }
            if(catY < myY){
                GoalKeepers[func](myY - speed);
            }
        }
    }

    AI.setAIGoalKeeper("Right");

    var Cat = {
        chooseRandomDirection: function(){
            var random = Math.round(Math.random());
            if(random == 0){
                random = -1;
            }
            return random;
        },
        acceleration: 0.001,
        moveInterval: 0,
        createRainbow: true,
        reset: function(){
            clearInterval(Cat.moveInterval);

            speedX = 5;
            speedY = 5;
            speedLevel = 1;

            $(".rainbow").remove();

            setTimeout(function(){
                $('.cat').css({
                    "top": $(window).height() / 2 - 25,
                    "left": $(window).width() / 2 - 25,
                    "transform": "none"
                })[0].className = "cat";
                $(".pause-menu").hide();
                $(".start-menu").show();
                $(".player-button").show();
                $(".levels").hide();
                $(".controls").hide();
            },1);
        },
        pause: function(){
            Cat.reset();

            setTimeout(function(){
                $(".start-menu").hide();
                $(".pause-menu").show();
            },2);
        },
        start: function(){
 
            $(".start-menu").hide();
            $(".pause-menu").hide();

            speedX *= this.chooseRandomDirection();
            speedY *= this.chooseRandomDirection();

            $("#awesome-background-music")[0].play();

            Cat.moveInterval = setInterval(Cat.update,10);
        },
        changeImageDirection: function(x,y){
            var cat = $(".cat");

            var className = "";

            if(x > 0 && y > 0){
                className = "right-down";
            }
            if(x > 0 && y < 0){
                className = "right-up";
            }
            if(x < 0 && y > 0){
                className = "left-down";
            }
            if(x < 0 && y < 0){
                className = "left-up";
            }

            cat[0].className = "cat" + " " + className;
        },
        update: function(){
            var realX = parseInt($(".cat").css("left"));
            var realY = parseInt($(".cat").css("top"));

            var rainbow = document.createElement("div");
            var height = 40;

            var currLeft = $(".left-goalkeeper").position().top;
            var currRight = $(".right-goalkeeper").position().top;

            var speed = Math.abs(speedY);

            if(pressedKeys[keys.w]){
                GoalKeepers.updateLeft(currLeft - speed);
            }
            if(pressedKeys[keys.s]){
                GoalKeepers.updateLeft(currLeft + speed);
            }
            if(!singlePlayer){
                if(pressedKeys[keys.up]){
                    GoalKeepers.updateRight(currRight - speed);
                }
                if(pressedKeys[keys.down]){
                    GoalKeepers.updateRight(currRight + speed);
                }
            }

            if(Cat.createRainbow){
                $(rainbow).css({
                    "top": realY + (50 - height) / 2,
                    "left": realX + 22.5,
                    "width": Math.abs(speedX) * 2,
                    "height": height
                }).addClass("rainbow").appendTo(document.body);

                setTimeout(function(){
                    $(rainbow).animate({
                        opacity: 0
                    },250);
                    setTimeout(function(){
                        $(rainbow).remove();
                    },250);
                },1000);
            }

            var newX = realX + speedX;
            var newY = realY + speedY;

            var leftHit = document.elementFromPoint(newX, newY + 25);
            var rightHit = document.elementFromPoint(newX + 50, newY + 25);

            if(singlePlayer){
                AI.doYourJob();
            }

            if(newY >= $(window).height() - $(".cat").height() || newY <= 0){
                speedY *= -1;
            }
            if($(leftHit).hasClass("goalkeeper")){
                speedX *= -1;
                var value = Math.abs(speedX);
                newX += value;

                var speed = $(".left-goalkeeper")[0].speed;

                if(Math.sign(speedY) == Math.sign(speed)){
                    speedY += speed / 60;
                }
                else {
                    speedY -= speed / 60;
                }
            }
            if($(rightHit).hasClass("goalkeeper")){
                speedX *= -1;
                newX -= Math.abs(speedX);

                var speed = $(".right-goalkeeper")[0].speed;

                if(Math.sign(speedY) == Math.sign(speed)){
                    speedY += speed / 60;
                }
                else {
                    speedY -= speed / 60;
                }
            }
            if(newX >= $(window).width() - $(".cat").width()){
                Scores.setLeft(Scores.getLeft() + 1);
                Scores.play();
                Cat.pause();
                GoalKeepers.reset();
            }
            if(newX <= 0){
                Scores.setRight(Scores.getRight() + 1);
                Scores.play();
                Cat.pause();
                GoalKeepers.reset();
            }

            function accelerate(val){

                var tmpVal = Math.abs(val);
                var acc = Cat.acceleration;

                var tmpLevel = speedLevel;
                while(tmpVal > 10){
                    acc /= 10;
                    tmpLevel++;
                    tmpVal -= 5;
                }

                if(tmpLevel > speedLevel){
                    console.log("Speed Level: " + tmpLevel);
                    speedLevel = tmpLevel;
                }

                if(acc != 0.001 && window.log) console.log(acc);

                return Math.sign(val) * (Math.abs(val) + acc);
            }

            speedX = accelerate(speedX);
            speedY = accelerate(speedY);

            Cat.changeImageDirection(speedX, speedY);

            $(".cat").css({
                "top": newY,
                "left": newX
            });

            var heightReduce = 0.001;

            var goalkeepers = $(".goalkeeper");
            var height = goalkeepers.height();

            if(height <= 100){
                heightReduce = 0;
            }

            var string = (height - heightReduce).toString() + "px";

            goalkeepers[0].style.height = string;
            goalkeepers[1].style.height = string;
        }
    }

    var GoalKeepers = {
        updateLeft: function(position){
            var height = $(".left-goalkeeper").outerHeight();
            var windowHeight = $(window).height();
            var topMax = windowHeight - height - 5;

            if(position < 5) position = 5;
            if(position > topMax) position = topMax;

            var speed = position - $(".left-goalkeeper").position().top;

            $(".left-goalkeeper").css("top",position)[0].speed = speed;
        },
        updateRight: function(position){
            var height = $(".right-goalkeeper").outerHeight();
            var windowHeight = $(window).height();
            var topMax = windowHeight - height - 5;

            if(position < 5) position = 5;
            if(position > topMax) position = topMax;

            var speed = position - $(".right-goalkeeper").position().top;

            $(".right-goalkeeper").css("top",position)[0].speed = speed;
        },
        reset: function(){
            $(".goalkeeper").css({
                "top": "35%",
                "height": "30%"
            });
        }
    }

    var Scores = {
        setLeft: function(n){
            n = n || 0;

            if($(".left-score span").text() == n) return;

            $(".left-score-overflow").fadeIn(200);

            setTimeout(function(){
                $(".left-score span").text(n);
                $(".left-score-overflow").fadeOut(200);
            },200);

        },
        setRight: function(n){
            n = n || 0;

            if($(".right-score span").text() == n) return;

            $(".right-score-overflow").fadeIn(200);

            setTimeout(function(){
                $(".right-score span").text(n);
                $(".right-score-overflow").fadeOut(200);
            },200);

        },
        getLeft: function(){
            return parseInt($(".left-score span").text());
        },
        getRight: function(){
            return parseInt($(".right-score span").text());
        },
        reset: function(){
            $(".left-score span").text(0);
            $(".right-score span").text(0);
        },
        play: function(){
            $("#score")[0].play();
        }
    }

    Cat.reset();

    $(window).resize(function(){
        Cat.reset();
        GoalKeepers.reset();
    });

    var pressedKeys = {};
    var keys = {
        "w": 87,
        "s": 83,
        "up": 38,
        "down": 40,
        "space": 32,
        "r": 82,
        "f": 70
    };

    $(document).keydown(function(e){
        var key = e.which || e.keyCode;

        pressedKeys[key] = true;

        var currLeft = $(".left-goalkeeper").position().top;
        var currRight = $(".right-goalkeeper").position().top;

        if(pressedKeys[keys.space]){
            var catPos = $(".cat").position();
            var top = catPos.top;
            var left = catPos.left;

            if(top == $(window).height() / 2 - 25 && left == $(window).width() / 2 - 25 && $(".start-menu").css("display") == "none") Cat.start();
        }
        if(pressedKeys[keys.r]){
            Cat.reset();
            Scores.reset();
            GoalKeepers.reset();
        }
    });

    $(document).keypress(function(e){
        var pressedKey = e.keyCode || e.which;
        var currentFullScreenElement = document.webkitCurrentFullScreenElement || document.mozCurrentFullscreenElement || document.msCurrentFullScreenElement || document.currentFullScreenElement;
        var html = $("html")[0];

        if(pressedKey == 102){
            if(currentFullScreenElement == null){
                if(html.webkitRequestFullScreen){
                    html.webkitRequestFullScreen();
                }
                else if(html.mozRequestFullScreen){
                    html.mozRequestFullscreen();
                }
                else if(html.msRequestFullScreen){
                    html.msRequestFullScreen();
                }
                else if(html.requestFullScreen){
                    html.requestFullScreen();
                }
            }
            else {
                if(document.webkitExitFullscreen){
                    document.webkitExitFullscreen();
                }
                else if(document.mozExitFullscreen){
                    document.mozExitFullscreen();
                }
                else if(document.msExitFullscreen){
                    document.msExitFullscreen();
                }
                else if(document.exitFullscreen){
                    document.exitFullscreen();
                }
            }
        }
    });

    $(document).keyup(function(e){
        var keyUp = e.which || e.keyCode;
        pressedKeys[keyUp] = false;
        $(".left-goalkeeper")[0].speed = 0;
        $(".right-goalkeeper")[0].speed = 0;
    });

    $("#music-checkbox").on("change",function(){
        $("#awesome-background-music")[0].volume = $(this)[0].checked;
    });

    $("#rainbow-checkbox").on("change",function(){
        Cat.createRainbow = $(this)[0].checked;
    });
    
});

