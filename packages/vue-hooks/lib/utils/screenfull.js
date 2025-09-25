"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventListeners = {};
const screenfull = {
    get isEnabled() {
        return !!(document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled);
    },
    get element() {
        return (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null);
    },
    async request(element = document.documentElement) {
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        }
        else if (element.webkitRequestFullscreen) {
            return element.webkitRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        }
        else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        }
        return Promise.reject(new Error('Fullscreen not supported'));
    },
    async exit() {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        }
        else if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            return document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            return document.msExitFullscreen();
        }
        return Promise.reject(new Error('Fullscreen exit not supported'));
    },
    on(event, callback) {
        if (!eventListeners[event]) {
            eventListeners[event] = [];
        }
        eventListeners[event].push(callback);
        if (event === 'change') {
            const events = [
                'fullscreenchange',
                'webkitfullscreenchange',
                'mozfullscreenchange',
                'MSFullscreenChange'
            ];
            events.forEach(eventName => {
                document.addEventListener(eventName, callback);
            });
        }
    },
    off(event, callback) {
        if (eventListeners[event]) {
            const index = eventListeners[event].indexOf(callback);
            if (index > -1) {
                eventListeners[event].splice(index, 1);
            }
        }
        if (event === 'change') {
            const events = [
                'fullscreenchange',
                'webkitfullscreenchange',
                'mozfullscreenchange',
                'MSFullscreenChange'
            ];
            events.forEach(eventName => {
                document.removeEventListener(eventName, callback);
            });
        }
    }
};
exports.default = screenfull;
