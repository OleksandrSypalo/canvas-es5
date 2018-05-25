var utils = {
    noop: function () {},
    now: function () {
        return Date.now();
    },
    mergeObjects: function (target) {
        var result = Object(target),
            nextSource;

        if (Object.assign) {
            result = Object.assign.apply(Object, arguments);
        } else {
            for (var i = 1; i < arguments.length; i++) {
                nextSource = arguments[i];

                Object
                    .keys(nextSource)
                    .forEach(function (key) {
                        result[key] = nextSource[key];
                    });
            }
        }

        return result;
    },
    mergeObjectsRecursive: function (target) {
        var result = Object(target),
            nextSource,
            self = this;

        for (var k = 1; k < arguments.length; k++) {
            nextSource = arguments[k];

            Object
                .keys(nextSource)
                .forEach(function (key) {
                    if (nextSource[key] && typeof nextSource[key] === 'object') {
                        self.mergeObjectsRecursive(result[key], nextSource[key]);
                    } else {
                        result[key] = nextSource[key];
                    }
                });
        }

        return result;
    },
    createMatrixArray: function (sizes, defaultValue) {
        var matrix = [],
            a = sizes[0],
            b = (sizes[1] || a);

        for (var i = 0; i < a; i++) {
            matrix[i] = this.createMonoArray(b, defaultValue);
        }

        return matrix;
    },
    createMonoArray: function (length, defaultValue) {
        var arr = [];

        for (var i = 0; i < length; i++) {
            arr[i] = defaultValue;
        }

        return arr;
    },
    readMatrix: function (matrix, callback) {
        matrix.forEach(function (matrixRow, x) {
            matrixRow.forEach(function (matrixItem, y) {
                callback(matrixItem, x, y);
            });
        })
    },
    rotateMatrix: function (matrix) {
        var matrixRotate = this.createMatrixArray([matrix.length]);

        matrix.forEach(function (matrixLine, x) {
            matrixLine.slice().reverse().forEach(function (matrixItem, y) {
                matrixRotate[y][x] = matrixItem;
            });
        });


        return matrixRotate;
    },
    searchMatrixEmptyLines: function (matrix) {
        var left = 0,
            right = 0,
            top = 0,
            bottom = 0;

        var searchLeft = true;
        var searchTop = true;

        matrix.forEach(function (matrixCol, x) {
            var isEmptyCol = true;
            var isEmptyRow = true;

            matrixCol.forEach(function (matrixCeil, y) {
                if(matrixCeil) {
                    isEmptyCol = false;
                    searchLeft = false;
                }
                if(matrix[y][x]) {
                    isEmptyRow = false;
                    searchTop = false;
                }
            });

            if(isEmptyCol){
                if(searchLeft) {
                    left++;
                } else {
                    right++;
                }
            }

            if(isEmptyRow){
                if(searchTop) {
                    top++;
                } else {
                    bottom++;
                }
            }
        });

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    },
    getRandomNumber: function (max) {
        return Math.floor(Math.random() * (max + 1));
    },
    getRandomItemFromArray: function (arr) {
        return arr[this.getRandomNumber(arr.length - 1)];
    },
    colorDarkened: function (color) {
        var colorsArr = color.split(''),
            colorsArrChange = colorsArr.map(function (colorValue) {
                return Math.max(0, parseInt(colorValue, 16) - 5).toString(16);
            });

        return colorsArrChange.join('');
    }
};