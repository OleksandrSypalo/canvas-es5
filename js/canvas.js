'use strict';

function RenderMatrix(customConfigs) {
    var self = this,
        configs = utils.mergeObjects({
            canvasAutoSize: true,
            cols: 12,
            rows: 24,
            canvasWidth: null,
            canvasHeight: null,
            borderColors: [],
            colors: []
        }, customConfigs);

    utils.mergeObjects(self, {
        canvas: null,
        contex: null,
        contexRotate: 0,
        width: 0,
        height: 0,
        blockSizes: {},
        nodeScore: null,

        init: function () {
            self.nodeScore = document.createElement('div');
            self.nodeScore.className = 'score lg';

            document.body.appendChild(self.nodeScore);

            self.canvas = document.createElement('canvas');
            self.contex = self.canvas.getContext('2d');

            document.body.appendChild(self.canvas);
            self.canvasSetSize();

            return self;
        },
        canvasSetSize: function () {
            var defaultWidth = self.canvas.width,
                defaultHeight = self.canvas.height,
                blockSize;

            if (configs.canvasAutoSize) {
                blockSize = Math.min(
                    window.innerWidth / configs.cols,
                    (window.innerHeight - 54) / configs.rows
                );
                blockSize = Math.max(Math.floor(blockSize), 16);

                self.width = blockSize * configs.cols;
                self.height = blockSize * configs.rows;
            } else {
                self.width = (configs.canvasWidth || defaultWidth);
                self.height = (configs.canvasHeight || defaultHeight);
            }

            self.canvas.width = self.width;
            self.canvas.height = self.height;
            self.blockSizes.width = self.width / configs.cols;
            self.blockSizes.height = self.height / configs.rows;
        },
        addBlock: function (data) {
            var args = [
                self.blockSizes.width * data.x,
                self.blockSizes.height * data.y,
                self.blockSizes.width - 1,
                self.blockSizes.height - 1
            ];

            self.contex.strokeStyle = data.borderColor;
            self.contex.fillStyle = data.color;
            self.contex.fillRect.apply(self.contex, args);
            self.contex.strokeRect.apply(self.contex, args);
        },
        update: function (groundData, tetrominoData) {
            self.contex.clearRect(0, 0, self.width, self.height);

            utils.readMatrix(groundData, function (groundBlock, x, y) {
                if (typeof groundBlock !== 'undefined') {
                    self.addBlock({
                        x: x,
                        y: y,
                        color: ('#' + configs.colors[groundBlock]),
                        borderColor: ('#' + configs.borderColors[groundBlock])
                    });
                }
            });

            utils.readMatrix(tetrominoData.matrix, function (tetrominoBlock, x, y) {
                if (typeof tetrominoBlock !== 'undefined') {
                    self.addBlock({
                        x: tetrominoData.positionX + x,
                        y: tetrominoData.positionY + y,
                        color: ('#' + configs.colors[tetrominoData.color]),
                        borderColor: ('#' + configs.borderColors[tetrominoData.color])
                    });
                }
            });
        },

        setScore: function (score) {
            self.nodeScore.innerHTML = score;
        },
        showShadow: function () {
            self.nodeScore.classList.add('lg');
        }
    });

    return self;
}