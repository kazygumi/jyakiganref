(() => {
    'use strict';

    function savePhoto(e) {
        // Here we're using a trick that involves a hidden canvas element.  
        const hiddenCanvas = document.getElementById('save_image');
        const context = hiddenCanvas.getContext('2d');
        
        const video = document.getElementById('camera_preview');
        const maskCanvas = document.getElementById('camera_mask');
        const overlayCanvas = document.getElementById('camera_overlay');
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hiddenCanvas.width = width;
            hiddenCanvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            console.log(maskCanvas);
            console.log(maskCanvas.width);
            console.log(maskCanvas.height);
            console.dir(maskCanvas);
            context.drawImage(video, 0, 0, width, height);
            context.drawImage(overlayCanvas, 0, 0, width, height);
            context.drawImage(maskCanvas, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            
            //location.href = hiddenCanvas.toDataURL();
            e.target.href = hiddenCanvas.toDataURL();
        }
    }

    document.getElementById('camera_shutter').addEventListener('click', savePhoto, false);

})();
