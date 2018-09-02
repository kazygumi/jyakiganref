(function () {
    'use strict';

    /**
     * page build
     */
    const PAGE_HOME_ELM = document.getElementById('home');
    const PAGE_CAMERA_ELM = document.getElementById('camera');

    function pageBuild() {
        PAGE_HOME_ELM.style.left = document.body.clientWidth + 'px';
        PAGE_CAMERA_ELM.style.left = document.body.clientWidth + 'px';

        switch (location.hash) {
            case "#home":
                PAGE_HOME_ELM.style.left = '0px';
                PAGE_CAMERA_ELM.style.left = document.body.clientWidth + 'px';
                cameraStop();

                break;
            case "#camera":
                PAGE_HOME_ELM.style.left = '-' + document.body.clientWidth + 'px';
                PAGE_CAMERA_ELM.style.left = '0px';
                cameraStart();

                break;
            default:
                console.log("#");
                PAGE_HOME_ELM.style.left = '0px';
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
