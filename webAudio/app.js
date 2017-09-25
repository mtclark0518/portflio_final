var playButton = $('#playbtn');
var input = $('#audioFile');
var muteButton = $('#mutebtn');
var stopButton = $('#stopbtn');



var audioContext = new (window.AudioContext || window.webKitAudioContext)(); // Our audio context
var source = null; // This is the BufferSource containing the buffered audio

//create our mixer

// the 'outgoing' signal
var masterGain = audioContext.createGain();
//compressing sound for quality
var compressorNode = audioContext.createDynamicsCompressor();
//analyzes audio context
var analyserNode = audioContext.createAnalyser();

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
mid.frequency.value = 1350.0;
mid.Q.value = 0.5;
mid.gain.value = 0.0;


var high = audioContext.createBiquadFilter();
high.type = "highshelf";
high.frequency.value = 4000.0;
high.gain.value = 0.0;

var filter = audioContext.createBiquadFilter();
filter.frequency.value = 20000.0;
filter.type = "lowpass";



function connectMixer(){
    source.connect(low).connect(mid).connect(high).connect(mainGain).connect(compressorNode).connect(masterGain).connect(audioContext.destination);
    source.connect(effect1Gain).connect(delayNode).connect(effectSend1).connect(compressorNode);
    source.connect(effect2Gain).connect(reverbNode).connect(effectSend2).connect(compressorNode);
    analyserNode.connect(compressorNode);
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
        console.log('test ine');
        console.log(source.playbackRate.value)
        connectMixer();

    }); 
}


function stopPlayback(){
  if (source !== null) {
    source.disconnect(delayNode);
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
    console.log(fileInput); 
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
