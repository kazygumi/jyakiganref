(() => {
    'use strict';

    function textDecorate(collection, num) {
        for (let i = 0; i < collection.length; i++) {
            const h1Elm = collection.item(i);
            const h1Text = h1Elm.textContent;
            h1Elm.innerHTML = null;
            let count = 0;
            h1Text.split('').forEach(function (c) {
                let classNum = 0;
                if ((count % 2) == 0) {
                    classNum = Math.floor(Math.random() * Math.floor(num / 2)) * 2;
                } else {
                    classNum = Math.floor(Math.random() * Math.floor(num / 2)) * 2 + 1;
                }
                
                h1Elm.innerHTML += '<span class="deco' + classNum + '">' + c + '</span>';
                count++;
            });
        }
    }

    textDecorate(document.getElementsByClassName('deco'), 4);

})();
