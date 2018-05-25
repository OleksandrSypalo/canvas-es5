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
    window.gameTetris._renderMatrix.canvasSetSize()
});