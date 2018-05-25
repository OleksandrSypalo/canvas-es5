'use strict';

!function () {
    var touchStart = [0, 0],
        deltaTouch = window.innerWidth / 4;

    document.body.addEventListener('keydown', function (e) {
        if (KEYCODES[e.keyCode]) {
            window.gameTetris.keyEvent(KEYCODES[e.keyCode]);
            return false;
        }
    });

    document.querySelector('.score').addEventListener('click', function () {
        window.gameTetris.reset();
        this.classList.remove('lg');
    });

    window.addEventListener('resize', function () {
        window.gameTetris._renderMatrix.canvasSetSize();
        deltaTouch = window.innerWidth / 4;
    });

    document.querySelector('canvas').addEventListener('click', function (event) {
        window.gameTetris._activeTetromino.transformRotate();
        event.preventDefault();
    });

    document.body.addEventListener('touchstart', function (event) {
        touchStart = event.changedTouches[0];
        event.preventDefault();
    }, false);

    document.body.addEventListener('touchmove', function (event) {
        var touchEnd = event.changedTouches[0],
            diffX = touchStart.pageX - touchEnd.pageX;

        if (Math.abs(diffX) > deltaTouch) {
            window.gameTetris._activeTetromino.transformTranslate('positionX', (diffX < 0) ? 1 : -1);
        }
        event.preventDefault();
    }, false);
}();
