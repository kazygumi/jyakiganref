(() => {
    'use strict';
    const pageBody = document.getElementById('body_home');

    function pageController() {

        switch (location.hash) {
            case "#home":
                pageBody.id = 'body_home';
                break;
            case "#camera":
                pageBody.id = 'body_camera';
                break;
            case "#edit":
                pageBody.id = 'body_edit';
                break;
            case "#wishform":
                pageBody.id = 'body_wishform';
                break;
            case "#license":
                pageBody.id = 'body_license';
                break;
            default:
                pageBody.id = 'body_home';
        }
    }

    function locationHashChanged() {
        pageController();
    }

    function resize(event) {
        pageController();
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
        window.addEventListener("hashchange", locationHashChanged, false);
        window.addEventListener('resize', resize, false);

        locationHashChanged();

    }, false);
})();
