/**
 * Created by vladimir on 06.08.2015.
 */

var context, audioSource, audioBuffer, url, fileName, song, singer;

fileName = "";
song = "";
singer = "";
url = 'http://static.kevvv.in/sounds/callmemaybe.mp3';

/* supporting WebAudio Api */
window.addEventListener('load', function(){
    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Opps.. Your browser do not support audio API');
    }
}, false);

/*file open, drag and drop*/
if('ondrop' in document.createElement('div') && window.File && window.FileReader && window.FileList && window.Blob) {
    onload = function () {

        //wait then cursor would be on area
        document.getElementById('dropZone').addEventListener('dragover', function (e) {
            // Останавливаем всплытие события
            e.stopPropagation();
            // останавливаем действие по умолчанию, связанное с эти событием.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);

        //wait for dropping
        document.getElementById('dropZone').addEventListener('drop', function (e) {

            e.stopPropagation();
            e.preventDefault();

            var files = e.dataTransfer.files;

            if (isSupportedFormat(files[0].type)) {
                alert([files[0].name, '(', files[0].type, ')', '-', files[0].size, 'байт'].join(' ') + '\n');
                loadFile(files[0]);
            }

        }, false);

        //wait for open file
        document.getElementById("fileOpen").addEventListener('change', function(e) {

            e.stopPropagation();
            e.preventDefault();

            var files = e.target.files;

            if (isSupportedFormat(files[0].type)) {
                alert([files[0].name, '(', files[0].type, ')', '-', files[0].size, 'байт'].join(' ') + '\n');
                loadFile(files[0]);
            }

        }, false);
    };

}
else {
    alert("Opps.. Your browser do not support drag&drop of file api");
}

/* example */
function loadSound(url) {

    document.getElementById("load").textContent = "LOADING URL...";
    document.getElementById("play").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "hidden";

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {

        //test msg
        alert("sound loaded");
        document.getElementById("load").textContent = "DECODING URL...";
        context.decodeAudioData(request.response, function(buffer) {
            audioBuffer = buffer;

            //test msg
            alert("sound decoded");

            fileName = url.substr(url.lastIndexOf('/')+1, url.length);

            document.getElementById("load").textContent = "LOAD URL";
            document.getElementById("play").style.visibility = "visible";
            document.getElementById("play").textContent = "PLAY " + fileName;
        });
    };
    request.send();
}

function loadFile(file) {

    document.getElementById("fileName").textContent = "LOADING FILE...";
    document.getElementById("play").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "hidden";

    var fileReader = new FileReader();

    fileReader.onload = function(fileEvent) {
        var data = fileEvent.target.result;

        alert("sound loaded");
        document.getElementById("fileName").textContent = "DECODING FILE...";

        context.decodeAudioData(data, function(buffer) {
            audioBuffer = buffer;
            //test msg
            alert("sound decoded");

            fileName = file.name;

            document.getElementById("play").style.visibility = "visible";
            document.getElementById("play").textContent = "PLAY " + fileName;
        });
    };

    fileReader.readAsArrayBuffer(file);

}

function playSound(anybuffer) {

    document.getElementById("play").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "visible";

    document.getElementById("fileName").textContent = "Now play: " + fileName;
    document.getElementById("song").textContent = song;
    document.getElementById("singer").textContent = singer;

    audioSource = context.createBufferSource();
    audioSource.buffer = anybuffer;
    audioSource.connect(context.destination);
    audioSource.start();
    //source.noteOn(0); //see note in Step 6
}

function stopSound() {
    if (audioSource) {
        audioSource.stop();

        document.getElementById("stop").style.visibility = "hidden";
        document.getElementById("play").style.visibility = "visible";

        document.getElementById("fileName").textContent = "";
        document.getElementById("song").textContent = "";
        document.getElementById("singer").textContent = "";


        //source.noteOff(0); //see note below
    }
}

function isSupportedFormat(type) {
    return type.indexOf('audio') > -1;
}
/*
function getSongInfo(file) {

    ID3.loadTags(file, function() {
        var tags = ID3.getAllTags(file);
        song = tags.artist;
        singer = tags.title;
        alert(tags.artist);
    });
}
*/