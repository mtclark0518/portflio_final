var playButton = $('#playbtn');
var input = $('#audioFile');

var audioContext = new (window.AudioContext || window.webKitAudioContext)(); // Our audio context
var source = null; // This is the BufferSource containing the buffered audio
  
// Used the File API in order to asynchronously obtain the bytes of the file that the user selected in the 
// file input box. The bytes are returned using a callback method that passes the resulting ArrayBuffer. 
function createArrayBuffer(selectedFile, callback) {

    var reader = new FileReader(); 
    reader.onload = function (ev) {
        // The FileReader returns us the bytes from the computer's file system as an ArrayBuffer  
        var mp3ArrayBuffer = reader.result; 
        callback(mp3ArrayBuffer); 
    }
    reader.readAsArrayBuffer(selectedFile);
}
 
function decodeArrayBufferAndPlay(mp3ArrayBuffer) {
      
    // The AudioContext will asynchronously decode the bytes in the ArrayBuffer for us and return us
    // the decoded samples in an AudioBuffer object.  
    audioContext.decodeAudioData(mp3ArrayBuffer, function (decodedAudioData) {
              
        // Clear any existing audio source that we might be using
        if (source != null) {
            source.disconnect(audioContext.destination);
            source = null; // Leave existing source to garbage collection
        } 
          
        // In order to play the decoded samples contained in the audio buffer we need to wrap them in  
        // an AudioBufferSourceNode object. This object will stream the audio samples to any other 
        // AudioNode or AudioDestinationNode object. 
        source = audioContext.createBufferSource();
        source.buffer = decodedAudioData; // set the buffer to play to our audio buffer
        source.connect(audioContext.destination); // connect the source to the output destinarion 
        source.start(0); // tell the audio buffer to play from the beginning
    }); 
}

// Assign event handler for when the 'Play' button is clicked
$(playButton).click(function(event) {
    event.stopPropagation();
      
    // I've added two basic validation checks here, but in a real world use case you'd probably be a little more stringient. 
    // Be aware that Firefox uses 'audio/mpeg' as the MP3 MIME type, Chrome uses 'audio/mp3'. 
    var fileInput = input[0];
    console.log(fileInput); 
    if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3"].includes(fileInput.files[0].type)) {
          
        // We're using the File API to obtain the MP3 bytes, here but they could also come from an XMLHttpRequest 
        // object that has downloaded an MP3 file from the internet, or any other ArrayBuffer containing MP3 data. 
        createArrayBuffer(fileInput.files[0], function (mp3ArrayBuffer) {
            
            // Pass the ArrayBuffer to the decode method
            decodeArrayBufferAndPlay(mp3ArrayBuffer);              
        });  
    } 
    else alert("Error! No attached file or attached file was of the wrong type!");
});


// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// var source = audioCtx.createBufferSource();
// var request = new XMLHttpRequest();
// request.open('GET', 'file://assets/bb.mp3', true);
// request.responseType = 'arraybuffer';
// request.onload = function() {
//   audioCtx.decodeAudioData(request.response, function(buffer) {
//     source.buffer = buffer;
//     source.connect(audioCtx.destination);
//     source.loop = true;
//     source.start(0);
//   }, function(error) {
//       console.log('error: ' + error);
//   });
// };
// request.send();




// var testAudio = document.querySelector('audio');
// const fileReader = new FileReader();
// console.log(fileReader);
// let blob = new Blob([testAudio],{type: 'audio/mp3'});
// console.log(blob)

// let testFR = fileReader.readAsArrayBuffer(blob);
// console.log(testFR)


// console.log(testAudio);

// var testDecode = audioCtx.decodeAudioData(testAudio).then(function(newData) {
//   console.log(newData);
// });
// console.log(testDecode)
// var mute = document.getElementsByClassName('mute');

// var buffer = audioCtx.createBuffer
// // var source = audioCtx.createMediaElementSource(testAudio)
// var gainNode = audioCtx.createGain();

// source.connect(gainNode);
// gainNode.connect(audioCtx.destination);

// $('.mute').click(function(e) {
//   e.preventDefault();
//   toggleMute();
// });

// function toggleMute(){
//   gainNode.gain.value = 0;
//   console.log('toggleMute bitch');
// }

// function random(number1,number2) {
//   var randomNo = number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
//   return randomNo;
// }

// var canvas = document.querySelector('.canvas');
// canvas.width = WIDTH;
// canvas.height = HEIGHT;

// var canvasCtx = canvas.getContext('2d');

// function canvasDraw() {
//   rX = CurX;
//   rY = CurY;
//   rC = Math.floor((gainNode.gain.value/maxVol)*30);
 
//   canvasCtx.globalAlpha = 0.2;
 
//   for(i=1;i<=15;i=i+2) {
//     canvasCtx.beginPath();
//     canvasCtx.fillStyle = 'rgb(' + 100+(i*10) + ',' + Math.floor((gainNode.gain.value/maxVol)*255) + ',' + Math.floor((oscillator.frequency.value/maxFreq)*255) + ')';
//     canvasCtx.arc(rX+random(0,50),rY+random(0,50),rC/2+i,(Math.PI/180)*0,(Math.PI/180)*360,false);
//     canvasCtx.fill();
//     canvasCtx.closePath();     
//   }    
// }


// // Create the source.
// var source = context.createBufferSource();
// // Create the gain node.
// var gain = context.createGain();
// // Connect source to filter, filter to destination.
// source.connect(gain);
// gain.connect(context.destination);

// source.disconnect(0);
// gain.disconnect(0);
// source.connect(context.destination);

// // to load an audio sample
// var request = new XMLHttpRequest();
// request.open('GET', url, true);
// request.responseType = 'arraybuffer';

// // Decode asynchronously
// request.onload = function() {
//   context.decodeAudioData(request.response, function(theBuffer) {
//     buffer = theBuffer;
//   }, onError);
// }
// request.send();

// // create an audio buffer source node
// function playSound(buffer) {
//   var source = context.createBufferSource();
//   source.buffer = buffer;
//   source.connect(context.destination);
//   source.start(0);
// }

// (function () {
//   'use strict';

//   const URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3';
    
//   const context = new AudioContext();
//   const playButton = document.querySelector('#play');
    
//   let yodelBuffer;

//   window.fetch(URL)
//     .then(response => response.arrayBuffer())
//     .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
//     .then(audioBuffer => {
//       playButton.disabled = false;
//       yodelBuffer = audioBuffer;
//     });
    
//     playButton.onclick = () => play(yodelBuffer);

//   function play(audioBuffer) {
//     const source = context.createBufferSource();
//     source.buffer = audioBuffer;
//     source.connect(context.destination);
//     source.start();
//   }
// }());