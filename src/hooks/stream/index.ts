function useVideoStream() {
  let localStream: MediaStream;
  let peerConnection: RTCPeerConnection;
  let remoteStream: MediaStream;
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };
  return async function () {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const createOffer = async () => {
      console.log('EXECUTING 2');
      peerConnection = new RTCPeerConnection(servers);
      remoteStream = new MediaStream();

      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log("ice candidates", event.candidate);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      return remoteStream;
    };

    return { localStream, createOffer };
  };
}

export default useVideoStream;
