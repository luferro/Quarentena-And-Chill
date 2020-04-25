document.getElementById('videoForm').addEventListener('submit', e => {
  e.preventDefault();
  const queryString = document.getElementById('url_video').value;
  const urlParams = new URLSearchParams(queryString);
  const urlYTVideo = urlParams.get('https://www.youtube.com/watch?v');
  setVideo(urlYTVideo);
  socket.emit('chosen-video', urlYTVideo);
})

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: 550,
    videoId: '',
    playerVars: { 'autoplay': 1, 'controls': 2},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

socket.on('chosen-video', urlYTVideo => {
  setVideo(urlYTVideo);
}) 

socket.on('play', () => {
  player.playVideo();
}) 

socket.on('pause', () => {
  player.pauseVideo();
}) 

socket.on('video_time', time => {
  setTimer(time);
}) 

//Função usada para receber o novo tempo do video para iniciar nesse novo tempo
function setTimer(time){
    player.seekTo(time);
}

function setVideo(urlYTVideo) {
  player.loadVideoById(urlYTVideo);
}

function onPlayerReady(event) {
    player.mute();
    event.target.playVideo();
    console.log("Ready!");
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      done = true;
    }
    if(event.data == YT.PlayerState.PLAYING)
      socket.emit('play');
    if (event.data == YT.PlayerState.BUFFERING)
      var time = player.getCurrentTime();
    if(event.data == YT.PlayerState.PAUSED)
      socket.emit('pause');
    console.log("C: "+ event.data);
    //Garantir que o tempo de video está definido e emitir para o servidor
    if(time != undefined){
      socket.emit('video_time', time);
      console.log("T: "+ time);
    }
}

function stopVideo() {
  player.stopVideo();
  console.log("Parei!");
}
