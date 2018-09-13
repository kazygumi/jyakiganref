class Camera {

    constructor() {
        this.camPreviewElm = document.getElementById('camera_preview');
        this.camPreviewWidth = this.camPreviewElm.width;
        this.camPreviewHeight = this.camPreviewElm.height;
        this.camOverlayElm = document.getElementById('camera_overlay');
        this.overlayCC = this.camOverlayElm.getContext('2d');
        this.camMaskElm = document.getElementById('camera_mask');
        this.stampEyepatch = new Image();
        this.stampEyepatch.src = 'images/eyepatch.png';

        // check whether browser supports webGL
        this.webGLContext = null;
        if (window.WebGLRenderingContext) {
            this.webGLContext = this.camMaskElm.getContext('webgl') || this.camMaskElm.getContext('experimental-webgl');
            if (!this.webGLContext || !this.webGLContext.getExtension('OES_texture_float')) {
                this.webGLContext = null;
            }
        }
        if (this.webGLContext == null) {
            alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

        this.ctrack = new clm.tracker({
            useWebGL: true
        });
        this.ctrack.init(pModel);
        this.trackingStarted = false;

        this.positions;
        this.fd = new faceDeformer();

        this.masks = {
            'stampEyepatch': [[54.132994582809886, 330.2447406482356], [53.94983737338171, 411.6786947731232], [59.50117090734213, 485.54290769879117], [69.05631570910228, 577.6685769791815], [80.73400747239302, 669.2047081882876], [156.52267192878207, 721.5706883991684], [224.03761978834723, 739.1269072358452], [301.4803537679236, 738.2366874355024], [373.4196207112528, 736.6185556997145], [445.4373067968218, 720.1452812831552], [517.3056114476371, 670.5474614197833], [531.7799053755264, 574.1779931382804], [540.681172219442, 487.967223266098], [542.4032150608897, 399.64595333584305], [541.5099369565868, 318.2177239885218], [484.00763535360403, 311.3318445452918], [436.57616449858205, 326.12885038303966], [386.214847801106, 333.2043197182652], [344.39911403378784, 336.7706741289662], [115.84864343665006, 313.35525243241443], [152.60840318917894, 322.7145050535586], [201.39783835228144, 332.29526724516336], [249.58724826191298, 336.53976562323317], [116.48023640991207, 348.8633768136441], [167.9642886955806, 350.9962302246727], [231.6749647028165, 359.48349174177827], [168.11831577303042, 375.4865728177492], [170.07462103025938, 361.76575290725043], [480.7831200700384, 348.57719399476593], [423.78106882269736, 353.08381522791285], [369.5853199174605, 360.3348770905004], [429.2517105029677, 374.978498189726], [428.4672557696136, 361.0310278167258], [298, 363], [253.70821429640165, 456.1515630753871], [232.81854206254127, 493.52915431030885], [250.27449264190767, 519.2760705851281], [294.9905749783811, 522.6580485667231], [340.00710866420684, 520.8077271147647], [357.28424845402884, 493.1349774295837], [336.03221275387335, 457.7253897416814], [296, 407], [270.69780042635847, 507.2277260957476], [320.8265507066314, 506.90809731554305], [219.49207600124322, 603.6108989555861], [236.4148918469843, 589.8509195222699], [267.0123175575189, 590.2653879517876], [302.37639394449644, 589.4456339021824], [337.18338067155105, 591.0755705685021], [366.9537080661368, 591.1696362146871], [383.17030058050824, 601.5027761622135], [366.07822563380967, 614.8268645173376], [336.20759244137867, 615.427540755917], [304.12597029775543, 615.4777558918809], [270.01910167830954, 615.9331065732697], [240.4271869365151, 614.9063722445486], [255.5183417994636, 603.9175341052295], [302.81892822034536, 605.4895650711086], [350.74058301633727, 604.2225054756758], [350.6655959742464, 603.528118265738], [303.78446463916174, 604.3090513544694], [256.409865954666, 603.8790201634539], [298.25175247557996, 482.7822436696597], [141.22182216936852, 346.4270057321846], [206.31948949078424, 356.7387529836485], [202.39427275621864, 368.9872676086593], [136.2964448024117, 368.67555898584044], [454.78000220898934, 348.3276075895992], [398.6821272555564, 355.2080431875895], [398.9194910642594, 369.6579535284187], [466.01878775359233, 368.7792910743897]]
        };
        this.currentMask = 0;
        this.animationRequest;

        // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
        pModel.shapeModel.nonRegularizedVectors.push(9);
        pModel.shapeModel.nonRegularizedVectors.push(11);

        delete emotionModel['disgusted'];
        delete emotionModel['fear'];
        this.ec = new emotionClassifier();
        this.ec.init(emotionModel);
        const emotionData = this.ec.getBlank();

        const margin = {
            top: 20,
            right: 20,
            bottom: 10,
            left: 40
        }
        const width = 400 - margin.left - margin.right;
        const height = 100 - margin.top - margin.bottom;
        this.height = height;
        const barWidth = 30;

        const formatPercent = d3.format('.0%');

        const x = d3.scale.linear()
            .domain([0, this.ec.getEmotions().length])
            .range([margin.left, width + margin.left]);

        const y = d3.scale.linear()
            .domain([0, 1])
            .range([0, this.height]);

        this.y = y;

        this.svg = d3.select('#emotion_chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', this.height + margin.top + margin.bottom);

        this.svg.selectAll('rect')
            .data(emotionData)
            .enter()
            .append('svg:rect')
            .attr('x', function (datum, index) {
                return x(index);
            })
            .attr('y', function (datum) {
                return height - y(datum.value);
            })
            .attr('height', function (datum) {
                return y(datum.value);
            })
            .attr('width', barWidth)
            .attr('fill', '#2d578b');

        this.svg.selectAll('text.labels')
            .data(emotionData)
            .enter()
            .append('svg:text')
            .attr('x', function (datum, index) {
                return x(index) + barWidth;
            })
            .attr('y', function (datum) {
                return height - y(datum.value);
            })
            .attr('dx', -barWidth / 2)
            .attr('dy', '1.2em')
            .attr('text-anchor', 'middle')
            .text(function (datum) {
                return datum.value;
            })
            .attr('fill', 'white')
            .attr('class', 'labels');

        this.svg.selectAll('text.yAxis')
            .data(emotionData)
            .enter().append('svg:text').
        attr('x', function (datum, index) {
                return x(index) + barWidth;
            })
            .attr('y', this.height)
            .attr('dx', -barWidth / 2)
            .attr('text-anchor', 'middle')
            .attr('style', 'font-size: 12')
            .text(function (datum) {
                return datum.emotion;
            })
            .attr('transform', 'translate(0, 18)')
            .attr('class', 'yAxis');
    }

    cameraStart() {
        // check for camerasupport
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(this.gumSuccess).catch(this.gumFail);
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            }, this.gumSuccess, this.gumFail);
        } else {
            alert('This demo depends on getUserMedia, which your browser does not seem to support. :(');
        }

        this.startVideo();
    }

    cameraStop() {
        let stream = this.camPreviewElm.srcObject;

        if (stream) {
            let tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });

            this.camPreviewElm.srcObject = null;

            this.ctrack.stop();
            cancelRequestAnimFrame(drawLoop);
        }
    }

    /********** check and set up video/webcam **********/

    adjustVideoProportions() {
        // resize overlay and video if proportions are different
        // keep same height, just change width
        let proportion = this.camPreviewElm.videoWidth / this.camPreviewElm.videoHeight;
        this.camPreviewWidth = Math.round(this.camPreviewHeight * proportion);
        this.camPreviewElm.width = this.camPreviewWidth;
        this.camOverlayElm.width = this.camPreviewWidth;
        this.camMaskElm.width = this.camPreviewWidth;
        this.webGLContext.viewport(0, 0, this.webGLContext.canvas.width, this.webGLContext.canvas.height);
    }



    gumSuccess(stream) {
        // add camera stream if getUserMedia succeeded
        if ('srcObject' in this.camPreviewElm) {
            this.camPreviewElm.srcObject = stream;
        } else {
            this.camPreviewElm.src = (window.URL && window.URL.createObjectURL(stream));
        }
        this.camPreviewElm.onloadedmetadata = function () {
            adjustVideoProportions();
            this.fd.init(this.camMaskElm);
        }
        this.camPreviewElm.onresize = function () {
            adjustVideoProportions();
            this.fd.init(this.camMaskElm);
            if (this.trackingStarted) {
                this.ctrack.stop();
                this.ctrack.reset();
                this.ctrack.start(this.camPreviewElm);
            }
        }
    }

    gumFail() {
        alert('There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.');
    }



    startVideo() {
        // start video
        this.camPreviewElm.play();
        // start tracking
        this.ctrack.start(this.camPreviewElm);
        this.trackingStarted = true;
        // start loop to draw face
        this.drawLoop();
        // start drawing face grid
        this.drawGridLoop();
    }

    /*********** Code for face tracking and face masking *********/

    updateMask(el) {
        this.currentMask = parseInt(el.target.value, 10);
        switchMasks();
    }

    drawGridLoop() {
        // get position of face
        this.positions = this.ctrack.getCurrentPosition();
        if (this.positions) {
            // draw current grid
            this.ctrack.draw(this.camOverlayElm);
        }
        // check whether mask has converged
        const pn = this.ctrack.getConvergence();
        if (pn < 0.4) {
            switchMasks();
            requestAnimFrame(this.drawMaskLoop);
        } else {
            requestAnimFrame(this.drawGridLoop);
        }
    }

    switchMasks() {
        // get mask
        const maskname = 'stampEyepatch';
        this.fd.load(this.stampEyepatch, this.masks[maskname], pModel);
    }

    drawMaskLoop() {
        // get position of face
        this.positions = this.ctrack.getCurrentPosition();
        if (this.positions) {
            // draw mask on top of face
            this.fd.draw(this.positions);
        }
        this.animationRequest = requestAnimFrame(drawMaskLoop);
    }


    /*********** setup of emotion detection *************/


    drawLoop() {
        console.log(this.drawLoop);
        requestAnimFrame(this.drawLoop);
        this.overlayCC.clearRect(0, 0, this.camPreviewWidth, this.camPreviewHeight);
        //psrElement.innerHTML = 'score :' + this.ctrack.getScore().toFixed(4);

        if (this.ctrack.getCurrentPosition()) {
            this.ctrack.draw(this.camOverlayElm);
        }
        const cp = this.ctrack.getCurrentParameters();
        const er = this.ec.meanPredict(cp);
        if (er) {
            this.updateData(er);
            for (let i = 0; i < er.length; i++) {
                if (er[i].value > 0.4) {
                    document.getElementById('icon' + (i + 1)).style.visibility = 'visible';
                } else {
                    document.getElementById('icon' + (i + 1)).style.visibility = 'hidden';
                }
            }
        }
    }



    /************ d3 code for barchart *****************/



    updateData(data) {
        // update
        const rects = this.svg.selectAll('rect')
            .data(data)
            .attr('y', function (datum) {
                return this.height - this.y(datum.value);
            })
            .attr('height', function (datum) {
                return this.y(datum.value);
            });

        const texts = this.svg.selectAll('text.labels')
            .data(data)
            .attr('y', function (datum) {
                return this.height - this.y(datum.value);
            })
            .text(function (datum) {
                return datum.value.toFixed(1);
            });

        // enter
        rects.enter().append('svg:rect');
        texts.enter().append('svg:text');

        // exit
        rects.exit().remove();
        texts.exit().remove();
    }

}
