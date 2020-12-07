window.onload = function () {
    var audio = $('#audio_box');
    var range = $('input');
    // Create a new instance of an audio object and adjust some of its properties
    var canvas,classifier, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

    function frameLooper() {
        window.requestAnimationFrame(frameLooper);
        fbc_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.
        ctx.fillStyle = "rgb(200,200, 200)"; // Color of the bars
        bars = 350;
        for (var i = 0; i < bars; i++) {
            bar_x = i * 2;
            bar_width = 1;
            bar_height = -(fbc_array[i] / 2);
            //  fillRect( x, y, width, height ) // Explanation of the parameters below
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
    }


    $("#start-btn").click(() => {
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function (stream) {
            var stream = stream;
            audio.srcObject = stream;
            context = new AudioContext();
            source = context.createMediaStreamSource(stream);
            analyser = context.createAnalyser();
            canvas = document.getElementById('analyser_render'); //  
            ctx = canvas.getContext('2d');

            var gainNode = context.createGain();
            gainNode.gain.setValueAtTime(0, context.currentTime);
            source.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(context.destination);
            frameLooper();
            // console.log(.noiseSuppression)
            $("#stop-btn").click(() => {
                stream.getAudioTracks()[0].stop();
            })
        })
    })
}

// for collapsable settings bar.
let settings = $(".settings-btn.collapsible")
let isDown = false;
settings.click(function () {
    isDown = !isDown
    if (isDown) {
        $(".isOpen").html("-")
        $(".settings-btn.collapsible").css({ "border-bottom-left-radius": "0px", "border-bottom-right-radius": "0px" });
        $("#settings-content").slideDown("100")
    } else {
        $(".isOpen").html("+")
        $(".settings-btn.collapsible").css({ "border-radius": "10px"});
        $("#settings-content").slideUp("100")
    }
});

