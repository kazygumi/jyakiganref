(() => {
    'use strict';

    function savePhoto(e) {

        const hiddenCanvas = document.getElementById('save_image');
        const context = hiddenCanvas.getContext('2d');
        const video = document.getElementById('camera_preview');
        const maskCanvas = document.getElementById('camera_mask');
        const overlayCanvas = document.getElementById('camera_overlay');
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width && height) {

            hiddenCanvas.width = width;
            hiddenCanvas.height = height;

            context.drawImage(video, 0, 0, width, height);
            context.drawImage(overlayCanvas, 0, 0, width, height);
            context.drawImage(maskCanvas, 0, 0, width, height);

            e.target.href = hiddenCanvas.toDataURL();
        }
    }
     document.getElementById('camera_release').addEventListener('click', savePhoto, false);

})();
