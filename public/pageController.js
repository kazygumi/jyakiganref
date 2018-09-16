(() => {
    'use strict';

    /******** page controll ********/

    const pageBody = document.getElementById('body_home');

    function pageControll() {

        switch (location.hash) {
            case '#home':
                pageBody.id = 'body_home';
                break;
            case '#camera':
                pageBody.id = 'body_camera';
                break;
            case '#edit':
                pageBody.id = 'body_edit';
                break;
            case '#wishform':
                pageBody.id = 'body_wishform';
                break;
            case '#license':
                pageBody.id = 'body_license';
                break;
            default:
                pageBody.id = 'body_home';
        }
    }

    window.addEventListener('hashchange', pageControll, false);

    pageControll();

    /******** history back ********/

    document.getElementById('history_back').addEventListener('click', function (event) {
        console.log('history.back');
        window.history.back(-1);
        return false;
    }, false);

    /******** stats ********/
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('main').appendChild(stats.domElement);
    setInterval(function () {
        stats.update();
    }, 1000 / 60);

})();
