'use strict';

var GROUND_SIZES = {
        width: 12,
        height: 22,
        overflow: 5
    },
    FTP = 30, // only for setInterval
    TETROMINOCOLORS = [
        'f00', // red
        'ff0', // yellow
        'f0f', //magenta
        '00f', // blue
        '0ff', // cyan
        '0f0', // green
        'fa0' //orange
    ],
    TETROMINOES = [
        // I
        [
            [0, 0, 0, 0], // □□□□
            [1, 1, 1, 1]  // ■■■■
        ],
        // O
        [
            [1, 1], // ■■
            [1, 1]  // ■■
        ],
        // T
        [
            [0, 1, 0], // □■□
            [1, 1, 1]  // ■■■
        ],
        // J
        [
            [1, 0, 0], // ■□□
            [1, 1, 1]  // ■■■
        ],
        // L
        [
            [0, 0, 1], // □□■
            [1, 1, 1]  // ■■■
        ],
        // S
        [
            [0, 1, 1], // □■■
            [1, 1, 0]  // ■■□
        ],
        // Z
        [
            [1, 1, 0], // ■■□
            [0, 1, 1]  // □■■
        ]
    ],
    CHANGE_TETROMINO_COMMANDS = {
        'moveTetrominoToLeft': 'toLeft',
        'moveTetrominoToRight': 'toRight',
        'moveTetrominoFastDown': 'toDown',
        'rotateTetromino': 'rotate'
    },
    KEYCODES = {
        37: CHANGE_TETROMINO_COMMANDS.moveTetrominoToLeft, // <left>
        65: CHANGE_TETROMINO_COMMANDS.moveTetrominoToLeft, // A
        39: CHANGE_TETROMINO_COMMANDS.moveTetrominoToRight, // <right>
        68: CHANGE_TETROMINO_COMMANDS.moveTetrominoToRight, // D
        40: CHANGE_TETROMINO_COMMANDS.moveTetrominoFastDown, // <down>
        83: CHANGE_TETROMINO_COMMANDS.moveTetrominoFastDown, // D
        32: CHANGE_TETROMINO_COMMANDS.rotateTetromino, // <space>
        38: CHANGE_TETROMINO_COMMANDS.rotateTetromino, // <up>
        87: CHANGE_TETROMINO_COMMANDS.rotateTetromino // W
    },
    CANVAS_SIZES = {
        width: 300,
        height: 600,
        autoSize: true
    };