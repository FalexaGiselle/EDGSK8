// M: Miri
// L: Lely
// B: Snowhite
// P: Pooh
// Q&A: Adri 


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

// .player-button are the first two buttons
// [ 1 Player Mode ]
// [ 2 Player Mode ]
// so, just get which one was clicked and set singlePlayer mode
