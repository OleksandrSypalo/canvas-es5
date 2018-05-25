'use strict';

var Animation = function (customConfigs) {
    var self = this,
        configs = utils.mergeObjects({
            ftp: 30,
            useInterval: false
        }, customConfigs);

    utils.mergeObjects(self, {
        supportAnimationFrame: true,
        intervalTimer: null,
        bufferCallbacks: [],

        init: function () {
            self.supportAnimationFrame = !!(window.requestAnimationFrame);
            self.run = (self.supportAnimationFrame || !!configs.useInterval)
                ? self.runTypeAnimationFrame
                : self.runTypeInterval;

            return self;
        },
        process: function (callback) {
            var timeNow = utils.now();

            self.bufferCallbacks
                .forEach(function (data) {
                    var callLength;

                    if(!data.success) {
                        callLength = Math.floor((timeNow - data.timeStart) / data.interval);

                        if (callLength > data.callLength) {
                            while (data.maxCall > data.callLength && callLength > data.callLength) {
                                data.callLength++;
                                data.fn();
                            }

                            if (data.maxCall <= data.callLength) {
                                data.callback();
                                data.success = true;
                            }
                        }
                    }

                });

            callback();
        },
        run: utils.noop,
        runTypeAnimationFrame: function (callback) {
            self.intervalTimer = window.requestAnimationFrame(function () {
                self.process(callback);
                self.runTypeAnimationFrame(callback);
            });

        },
        runTypeInterval: function (callback) {
            self.intervalTimer = window.setInterval(function () {
                self.process(callback);
            }, configs.ftp);
        },
        setInterval: function (settings) {
            var id = self.bufferCallbacks.length;

            self.bufferCallbacks.push(utils.mergeObjects({
                id: id,
                interval: configs.ftp,
                callLength: 0,
                maxCall: Infinity,
                timeStart: utils.now(),

                fn: utils.noop,
                callback: utils.noop
            }, settings));

            return id;
        },
        clearInterval: function(id, callResult){
            if(self.bufferCallbacks[id]) {
                self.bufferCallbacks[id].success = true;
                if(callResult) {
                    self.bufferCallbacks[id].callback();
                }
            }
        },
        cleaningBuffer: function(clearAll){
            var lastIndex = 0,
                searchStoped = false;

            if(clearAll) {
                self.bufferCallbacks = [];
            } else {
                self.bufferCallbacks.forEach(function (item) {
                    if(!searchStoped && item.success) {
                        lastIndex++;
                    } else {
                        searchStoped = true;
                    }
                });

                self.bufferCallbacks.splice(0, lastIndex);
            }
        },
        stop: function () {
            return self.supportAnimationFrame
                ? window.cancelAnimationFrame(self.intervalTimer)
                : window.clearInterval(self.intervalTimer);
        }
    });

    return self.init();
};
