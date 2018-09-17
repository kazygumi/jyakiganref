(() => {
    'use strict';

    function textDecorate(collection) {
        for (let i = 0; i < collection.length; i++) {
            const h1Elm = collection.item(i);
            const h1Text = h1Elm.textContent;
            h1Elm.innerHTML = null;

            h1Text.split('').forEach(function (c) {
                const classNum = Math.floor(Math.random() * 4);
                h1Elm.innerHTML += '<span class="deco' + classNum + '">' + c + '</span>';
            });
        }
    }
   textDecorate(document.getElementsByTagName('h1'));

})();
