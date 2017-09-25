var playButton = $('#playbtn');
var input = $('#audioFile');
var muteButton = $('#mutebtn');
var stopButton = $('#stopbtn');


var audioContext = new (window.AudioContext || window.webKitAudioContext)(); // Our audio context
var source = null; // This is the BufferSource containing the buffered audio





// the 'outgoing' signal
var masterGain = audioContext.createGain();
//compressing sound for quality
var compressorNode = audioContext.createDynamicsCompressor();
//analyzes audio context
var analyserNode = audioContext.createAnalyser();
analyserNode.minDecibels = -90;
analyserNode.maxDecibels = -10;
analyserNode.smoothingTimeConstant = 0.85;
// source gains
// main gain
var mainGain = audioContext.createGain();
var effect1Gain = audioContext.createGain();
var effect2Gain = audioContext.createGain();
// send effects for the source
var effectSend1 = audioContext.createGain();
var effectSend2 = audioContext.createGain();

var delayNode = audioContext.createDelay(); //s1
var reverbNode = audioContext.createConvolver(); //s2

// creating the equalizer filters
var low = audioContext.createBiquadFilter();
low.type = "lowshelf";
low.frequency.value = 300.0;
low.gain.value = 0.0;

var mid = audioContext.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000.0;
mid.Q.value = 0.5;
mid.gain.value = 0.0;

var high = audioContext.createBiquadFilter();
high.type = "highshelf";
high.frequency.value = 1800.0;
high.gain.value = 0.0;

var canvas = $('#visualizer')[0];
console.log(canvas);
var canvasContext = canvas.getContext("2d");
// var intendedWidth = $('.wrapper').clientWidth;
// console.log(intendedWidth)
// canvas.setAttribute('width', intendedWidth);
//create our mixer
function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    console.log('height = ' +  HEIGHT);
    console.log('width = ' +  WIDTH);
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    analyserNode.fftSize =512;
    var bufferLength = analyserNode.frequencyBinCount;
    console.log(analyserNode.fftSize);
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);
    

    function draw() {
        drawVisual = requestAnimationFrame(draw);
        analyserNode.getByteTimeDomainData(dataArray);

        // analyserNode.getByteFrequencyData(dataArray);
        // console.log(analyserNode.getByteFrequencyData(dataArray));
        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'rgb(255,0,0)';
            canvasContext.beginPath();
        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] /128.0;
            let y = v * HEIGHT / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
        // var barWidth = (WIDTH / bufferLength) * 2.5;
        // var barHeight;
        // var x = 0;

        // for(var i = 0; i < bufferLength; i++) {
        //     barHeight = dataArray[i];

        //     canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        //     canvasContext.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

        //     x += barWidth + 1;
        // }
    }
    draw();
}
function connectMixer(){
    source.connect(analyserNode).connect(low).connect(mid).connect(high).connect(mainGain).connect(compressorNode).connect(masterGain).connect(audioContext.destination);
    source.connect(effect1Gain).connect(delayNode).connect(effectSend1).connect(compressorNode);
    source.connect(effect2Gain).connect(reverbNode).connect(effectSend2).connect(compressorNode);
    
    source.start(0); // tell the audio buffer to play from the beginning
}
// Used the File API in order to asynchronously obtain the bytes of the file that the user selected in the 
// file input box. The bytes are returned using a callback method that passes the resulting ArrayBuffer. 
function createArrayBuffer(selectedFile, callback) {
    var reader = new FileReader(); 
    reader.onload = function (event) {
        // The FileReader returns us the bytes from the computer's file system as an ArrayBuffer  
        var mp3ArrayBuffer = reader.result; 
        callback(mp3ArrayBuffer); 
    };
    reader.readAsArrayBuffer(selectedFile);
}
 
function decodeArrayBuffer(mp3ArrayBuffer) {
      
    // The AudioContext will asynchronously decode the bytes in the ArrayBuffer for us and return us
    // the decoded samples in an AudioBuffer object.  
    audioContext.decodeAudioData(mp3ArrayBuffer, function (decodedAudioData) {
              
        // Clear any existing audio source that we might be using
        if (source !== null) {
            source.disconnect(masterGain);
            source = null; 
        } 
        source = audioContext.createBufferSource();
        source.buffer = decodedAudioData;
        console.log(source.playbackRate.value)
        connectMixer();
        visualize();

    }); 
}


function stopPlayback(){
  if (source !== null) {
    source.disconnect(analyserNode);
    source.disconnect(effect1Gain);
    source.disconnect(effect2Gain);
    console.log('disconnected');
    source = null;
  }
}

function toggleMute(){

  // masterGain.gain.value = 0;
  console.log('toggleMute bitch');
}
function createEQSlider(name, type, input){
    let mySlider = $(name).slider({
        range: 'min',
        min: -12,
        max: 12,
        value: 0,
        slide: function(event, ui) {
            let eq = $(name).slider('value');
            type.gain.value = eq;
        }
    });
    return mySlider;
}
$(document).ready(function(){

    // volume slider
    $("#master-gain" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 50,
        slide: function( event, ui ) {
            let volume = $("#amount").val( ui.value );
            let gain = volume[0].value/100;
            masterGain.gain.value = gain;
        }
    });
    $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
    
    $("#tempo-slider" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 2,
        value: 1,
        step: 0.01,
        slide: function( event, ui ) {
            let tempo = $("#tempo-slider").slider("value");
            console.log(tempo);
            source.playbackRate.value = tempo;
            }
    });
    $( "#tempo-input" ).val( $( "#tempo-slider" ).slider( "value" ) );
    
    //eq sliders
    createEQSlider('#low-slider', low, '#low-input');
    createEQSlider('#mid-slider', mid, '#mid-input');
    createEQSlider('#high-slider', high, '#high-input');


// Assign event handler for when the 'Play' button is clicked
    $(playButton).click(function(event) {
        event.stopPropagation();
        // I've added two basic validation checks here, but in a real world use case you'd probably be a little more stringient. 
        // Be aware that Firefox uses 'audio/mpeg' as the MP3 MIME type, Chrome uses 'audio/mp3'. 
        var fileInput = input[0];
        console.log(fileInput[0]); 
        if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3"].includes(fileInput.files[0].type)) {
            
            // object that has downloaded an MP3 file from the internet, or any other ArrayBuffer containing MP3 data. 
            createArrayBuffer(fileInput.files[0], function (mp3ArrayBuffer) {
                
                // Pass the ArrayBuffer to the decode method
                decodeArrayBuffer(mp3ArrayBuffer);              
            });  
        } 
        else alert("Error! No attached file or attached file was of the wrong type!");
    });

    // mute function to store value and set new value;
    $(muteButton).click(function(event) {
        event.preventDefault();
        toggleMute();
     });

    $(stopButton).click(function(event) {
        stopPlayback();
    });

});
