let time_slider = $("input[name=timer]")
let acc_slider = $("input[name=accuracy]")
let wait_slider = $("input[name=wait]")
let time_val = $("label[for=timer-val]")
let acc_val = $("label[for=accuracy-val]")
let wait_val = $("label[for=wait-val]")
let classifier, timer, sound, waiting_for;
let class1, class2;
let alarm = new Audio("Sounds/alarm.mp3")
let soundModelURL = "https://teachablemachine.withgoogle.com/models/TOqnlHhqQ/";
let options = {
    probabilityThreshold: 0.7
}

function modelReady() {
    console.log("Ready to go!!")
    console.log(classifier.model.model);
    classifier.classify(gotResult);
}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
    if (error) {
        console.log("something went wrong")
        console.error(error);
    } else {
        class1 = results[0].label;
        class2 = results[1].label;
        $("#noise-type").text(class1);
    }
}

$("#start-btn").click(() => {
    $("#start-btn").addClass("disabled");
    $("#stop-btn").removeClass("disabled");
    classifier = ml5.soundClassifier(soundModelURL + 'model.json', options, modelReady);
    sound = $("#noise-type").text();
    timer = new Date().getTime();
})

$("#stop-btn").click(() => {
    $("#start-btn").removeClass("disabled");
    $("#stop-btn").addClass("disabled");
    alarm.pause()
    console.log(classifier.model.model)
})

setInterval(() => {
    if (class1 && class2 && sound) {
        
        sound = $("#noise-type").text();
        waiting_for = (new Date().getTime() - timer) / 1000;
    
        if (sound === "Background Noise") {
            timer = new Date().getTime();
        } else if (sound === "Humming/Singing" && (waiting_for) >= wait_slider[0].value) {
            console.log($("#alarm-sound"));
            // alarm.play()

            timer = new Date().getTime();
        }
    }

}, 900)


time_slider.change(() => {
    time_val.html(`<strong>${String(time_slider[0].value)}<strong>`);
});
acc_slider.change(() => {
    acc_val.html(`<strong>${String(acc_slider[0].value)}<strong>`);
    options.probabilityThreshold = acc_slider[0].value;
});
wait_slider.change(() => {
    wait_val.html(`<strong>${String(wait_slider[0].value)}<strong>`);
});
    


// Options for the SpeechCommands18w model, the default probabilityThreshold is 0