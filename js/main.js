'use strict';

function Tetromino(customConfigs, animation) {
    var self = this,
        configs = utils.mergeObjects({
            groundWidth: 12,
            groundHeight: 20,

            colors: []
        }, customConfigs);

    utils.mergeObjects(self, {
        translateInterval: null,
        interval: null,
        tetromino: {},

        create: function (matrix) {
            var matrixSize = matrix.length;

            self.tetromino = {
                matrix: matrix,
                size: matrixSize,
                positionX: Math.floor((configs.groundWidth - matrixSize) / 2),
                positionY: -matrixSize,
                color: utils.getRandomNumber(configs.colors.length - 1)
            };
            self.tetromino.empty = utils.searchMatrixEmptyLines(matrix);
            self.addGravity();

            return self.tetromino;
        },
        addGravity: function () {
            self.interval = animation.setInterval({
                interval: 500,
                fn: function () {
                    if (self) {
                        self.transformTranslate('positionY', 1);
                    }
                }
            });
        },
        remove: function () {
            animation.clearInterval(self.interval);
            animation.clearInterval(self.translateInterval);
            animation.cleaningBuffer();

            self = null;
        },

        checkPosition: {
            'positionX': function (futurePosition) {
                var actualPosition = (futurePosition || self.tetromino.positionX),
                    tetrominoRightBorder = (actualPosition + self.tetromino.size - self.tetromino.empty.right);

                return !(
                    (actualPosition + self.tetromino.empty.left) < 0
                    || tetrominoRightBorder > configs.groundWidth
                    || self.checkPosition.hasConflict(
                        gameTetris.ground,
                        actualPosition,
                        Math.ceil(self.tetromino.positionY)
                    )
                )
            },
            'positionY': function (futurePosition) {
                var actualPosition = (futurePosition || self.tetromino.positionY),
                    tetrominoBottomBorder = (actualPosition + self.tetromino.size - self.tetromino.empty.bottom);

                if (
                    tetrominoBottomBorder > configs.groundHeight
                    || self.checkPosition.hasConflict(
                        gameTetris.ground,
                        Math.ceil(self.tetromino.positionX),
                        actualPosition
                    )
                ) {
                    if (self) {
                        gameTetris.pushToGround(self.tetromino);
                        gameTetris.createTetromino();
                    }

                    return false;
                }

                return true;
            },
            hasConflict: function (ground, positionX, positionY) {
                var result = false;

                utils.readMatrix(self.tetromino.matrix, function (value, x, y) {
                    var coordX = positionX + x,
                        coordY = positionY + y;

                    if (
                        value
                        && coordX >= 0
                        && coordY >= 0
                        && coordX < configs.groundWidth
                        && coordY < configs.groundHeight
                    ) {
                        if (ground[coordX] && typeof ground[coordX][coordY] !== 'undefined') {
                            result = true;
                        }
                    }
                });

                return result;
            }
        },
        transformTranslate: function (property, delta) {
            if (self.translateInterval !== null) {
                animation.clearInterval(self.translateInterval, true);
            }

            var futurePosition = (self.tetromino[property] + delta);

            if (self.checkPosition[property](futurePosition)) {
                self.translateInterval = animation.setInterval({
                    interval: 10,
                    maxCall: 10,
                    fn: function () {
                        if (self) {
                            self.tetromino[property] += (delta / 20);
                        }
                    },
                    callback: function () {
                        if (self) {
                            self.tetromino[property] = futurePosition;
                            self.translateInterval = null;
                        }
                    }
                });
            }
        },
        transformRotate: function () {
            var copyMatrix = [].concat(self.tetromino.matrix);

            self.tetromino.matrix = utils.rotateMatrix(copyMatrix);
            self.tetromino.empty = utils.searchMatrixEmptyLines(self.tetromino.matrix);

            if (!(self.checkPosition.positionX() && self.checkPosition.positionY())) {
                self.tetromino.matrix = copyMatrix;
                self.tetromino.empty = utils.searchMatrixEmptyLines(self.tetromino.matrix);
            }
        }
    });

    return self;
}
function GameConstructor(customConfigs) {
    var self = this,
        configs = utils.mergeObjects({
            groundWidth: 12,
            groundHeight: 20,
            ftp: 30,
            canvasAutoSize: true,
            canvasWidth: null,
            canvasHeight: null,
            colors: [],
            commandsCode: {}
        }, customConfigs),

        tetrominoesMatrix = [],
        activeTetromino = null,
        renderMatrix = null,
        animation = null,

        played = false,
        score = 0;

    utils.mergeObjects(self, {
        ground: [],
        init: function () {
            self.refreshData();
            tetrominoesMatrix = self.getTetrominoes();
            self.createRenderMatrix();
            self.createAnimation();

            return self;
        },
        reset: function () {
            played = true;
            self.refreshData();
            animation.cleaningBuffer(true);
            renderMatrix.setScore(score);
            self.createTetromino();
        },
        refreshData: function () {
            self.ground = utils.createMatrixArray([
                configs.groundWidth,
                configs.groundHeight
            ]);
            activeTetromino = null;
            score = 0;
        },
        getTetrominoes: function () {
            return configs.tetrominoes.map(function (tetrominoData) {
                var matrixSize = Math.max(tetrominoData[0].length, tetrominoData.length), // 2, 3 or 4
                    matrix = utils.createMatrixArray([matrixSize]),
                    tetrominoDataReplaced = tetrominoData.map(function (tetrominoLine) {
                        return tetrominoLine.map(function (pixed) {
                            return (pixed || undefined); // replace 0 -> undefined
                        });
                    });

                utils.mergeObjectsRecursive(matrix, tetrominoDataReplaced);
                return matrix;
            });
        },
        createAnimation: function () {
            animation = new Animation({
                ftp: configs.ftp
            });
            animation.run(self.render);

            self._animation = animation; // buffer
        },
        createRenderMatrix: function () {
            renderMatrix = new RenderMatrix({
                canvasWidth: configs.canvasWidth,
                canvasHeight: configs.canvasHeight,
                canvasAutoSize: configs.canvasAutoSize,
                cols: configs.groundWidth,
                rows: configs.groundHeight,
                colors: configs.colors,
                borderColors: configs.colors.map(function (color) {
                    return utils.colorDarkened(color);
                })
            });
            renderMatrix.init();
            renderMatrix.setScore(score);
            self._renderMatrix = renderMatrix; // buffer
        },
        createTetromino: function () {
            if (activeTetromino) {
                activeTetromino.remove();
            }

            activeTetromino = new Tetromino(configs, animation);
            activeTetromino.create(utils.getRandomItemFromArray(tetrominoesMatrix));
            self._activeTetromino = activeTetromino;
        },
        pushToGround: function (tetromino) {
            utils.readMatrix(tetromino.matrix, function (matrixItem, x, y) {
                var itemX = x + tetromino.positionX,
                    itemY = y + tetromino.positionY;

                if (
                    matrixItem
                    && itemX >= 0
                    && itemX < configs.groundWidth
                    && itemY < configs.groundHeight
                ) {
                    if (itemY >= 0) {
                        self.ground[itemX][itemY] = tetromino.color;
                        self.checkGround();
                        renderMatrix.setScore(score);
                    } else {
                        played = false;
                    }
                }
            });
        },
        checkGround: function () {
            var lines = utils.createMonoArray(configs.groundHeight, true),
                groundCopy = self.ground.slice(); // copy

            utils.readMatrix(self.ground, function (ceil, x, y) {
                if (lines[y] && typeof ceil === 'undefined') {
                    lines[y] = false;
                }
            });

            lines.forEach(function (isFull, index) {
                if (isFull) {
                    score += configs.groundWidth;
                    self.ground.forEach(function (groundCol, x) {
                        groundCopy[x] = groundCol.slice();
                        groundCopy[x].splice(index, 1);
                        groundCopy[x].unshift(undefined);
                    });
                }
            });

            self.ground = groundCopy;

            return 1;
        },
        keyEvent: function (command) {
            if (activeTetromino && played) {
                switch (command) {
                    case configs.commandsCode.moveTetrominoToLeft:
                        activeTetromino.transformTranslate('positionX', -1);
                        break;
                    case configs.commandsCode.moveTetrominoToRight:
                        activeTetromino.transformTranslate('positionX', 1);
                        break;
                    case configs.commandsCode.moveTetrominoFastDown:
                        activeTetromino.transformTranslate('positionY', 1);
                        break;
                    case configs.commandsCode.rotateTetromino:
                        activeTetromino.transformRotate();
                        break;
                    default:
                        break;
                }
            }
        },
        render: function () {
            if (played) {
                renderMatrix.update(self.ground, activeTetromino.tetromino);
            } else {
                self.finished();
            }
        },
        finished: function () {
            animation.cleaningBuffer(true);
            renderMatrix.showShadow();
        }
    });

    self.init();

    return self;
}

window.gameTetris = new GameConstructor({
    ftp: FTP,
    commandsCode: CHANGE_TETROMINO_COMMANDS,
    groundWidth: GROUND_SIZES.width,
    groundHeight: GROUND_SIZES.height,
    groundOverflow: GROUND_SIZES.overflow,
    tetrominoes: TETROMINOES,
    colors: TETROMINOCOLORS,

    canvasSizes: CANVAS_SIZES.width,
    canvasHeight: CANVAS_SIZES.height,
    canvasAutoSize: CANVAS_SIZES.autoSize
});


