var socket = io("/");
const videodiv = document.getElementById("video-grid");
const myvid = document.createElement("video");
myvid.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myvideostream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myvideostream = stream;
    addVideoStream(myvid, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit("message", text.val());
        text.val("");
      }
    });

    socket.on("createMessage", (message) => {
      console.log("from create",message);
      $(".messages").append(
        `<li class="message"><b>User</b><br />${message}</li>`
      );
      scrollToBottom()
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videodiv.append(video);
};


const scrollToBottom = () => {
  let d = $('.main_chat_window')
  d.scrollTop(d.prop('scrollHeight'))
}

const muteUnmute = () => {
  const enabled = myvideostream.getAudioTracks()[0].enabled;
  if(enabled){
    myvideostream.getAudioTracks()[0].enabled = false;
    setUnMuteButton();
  }else{
    setMuteButton();
    myvideostream.getAudioTracks()[0].enabled=true
  }
}

const setMuteButton = () =>{
  const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnMuteButton = () =>{
  const html = `<i class="fas fa-microphone-slash unmute"></i><span>UnMute</span>`
  document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
  const enabled = myvideostream.getVideoTracks()[0].enabled
  if(enabled){
    myvideostream.getVideoTracks()[0].enabled=false
    setPlayVideo();
  }else{
    myvideostream.getVideoTracks()[0].enabled=true
    setStopVideo();
  }
}

const setStopVideo = () =>{
  const html = `<i class="fas fa-video"></i><span>Mute</span>`
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () =>{
  const html = `<i class="fas fa-video-slash unmute"></i><span>UnMute</span>`
  document.querySelector('.main_video_button').innerHTML = html;
}