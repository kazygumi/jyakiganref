(function () {
    'use strict';

    /**
     * page build
     */
    const pageHomeElm = document.getElementById('home');
    const pageCameraElm = document.getElementById('camera');
    const pageEditElm = document.getElementById('edit');
    const pageShareElm = document.getElementById('share');

    function pageBuild() {

        switch (location.hash) {
            case "#home":
                setPagePosition(pageHomeElm, 1);
                setPagePosition(pageCameraElm, 2);
                setPagePosition(pageEditElm, 2);
                setPagePosition(pageShareElm, 2);
                cameraStop();
                break;
            case "#camera":
                setPagePosition(pageHomeElm, 0);
                setPagePosition(pageCameraElm, 1);
                setPagePosition(pageEditElm, 2);
                setPagePosition(pageShareElm, 2);
                cameraStart();
                break;
            case "#edit":
                setPagePosition(pageHomeElm, 0);
                setPagePosition(pageCameraElm, 0);
                setPagePosition(pageEditElm, 1);
                setPagePosition(pageShareElm, 2);
                cameraStop();
                break;
            case "#share":
                setPagePosition(pageHomeElm, 0);
                setPagePosition(pageCameraElm, 0);
                setPagePosition(pageEditElm, 0);
                setPagePosition(pageShareElm, 1);
                cameraStop();
                break;
            default:
                setPagePosition(pageHomeElm, 1);
                setPagePosition(pageCameraElm, 2);
                setPagePosition(pageEditElm, 2);
                setPagePosition(pageShareElm, 2);
                cameraStop();
        }
    }

    function setPagePosition(_element, _position) {
        var element = _element;
        var position = _position;
        switch (position) {
            case 0:
                element.style.left = '-' + document.body.clientWidth + 'px';
                break;
            case 1:
                element.style.left = '0px';
                break;
            case 2:
                element.style.left = document.body.clientWidth + 'px';
                break;
            default:
                element.style.left = document.body.clientWidth + 'px';
        }
    }

    function locationHashChanged() {
        pageBuild();
    }

    function resize(event) {
        pageBuild();
    }

    /******** stats ********/
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('main').appendChild(stats.domElement);
    setInterval(function () {
        stats.update();
    }, 1000 / 60);


    window.addEventListener('DOMContentLoaded', function (event) {
        window.onhashchange = locationHashChanged;
        window.addEventListener('resize', resize, false);

        locationHashChanged();

    }, false);
}());
