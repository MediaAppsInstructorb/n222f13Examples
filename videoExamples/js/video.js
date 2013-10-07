// Our global variables
var vid;

function play() {
    //seek to 2 seconds
    vid.currentTime = 2;
    vid.play();
}

function pause() {
    vid.pause();
}

function registerEvents() {
  // Event for clicking the play button
  document.getElementById('play-control').onclick=function(){
    play();
  };
  // Event for clicking the pause button
  document.getElementById('pause-control').onclick=function(){
    pause();
  };
}

function init() {
  vid = document.getElementsByTagName("video")[0];
  registerEvents();
}

window.onload = init;