import React, { useRef } from "react"
import { socket } from "../../../hooks/useSocket";

type MediaStreamRef = React.MutableRefObject<MediaStream | null>;

const Video: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef: MediaStreamRef  = useRef(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const remoteStreamRef: MediaStreamRef = useRef(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const startLocalStream = async() => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
            localStreamRef.current = stream

            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }

            initializePeerConnection();
        } catch (error) {
            console.error(error)
        }
    };

    const initializePeerConnection = () => {
        const iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                // { urls: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username: 'muazkh' },
            ],
        };

        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnectionRef.current = peerConnection

        // console.log('added track', localStreamRef.current?.getTracks())
        localStreamRef.current?.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStreamRef.current!);
            
        })

        peerConnection.onicecandidate = (event) => {
            // console.log(event)
            if(event.candidate){
                socket.emit('ice-candidate', event.candidate)
                // console.log(event.candidate)
            }
        };

        peerConnection.ontrack = (event) => {
            remoteStreamRef.current = event.streams[0];
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          setUpSocketListener()

    };

    const setUpSocketListener = () => {
        if(!socket) return;

        socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
              const answer = await peerConnectionRef.current.createAnswer();
              await peerConnectionRef.current.setLocalDescription(answer);
              socket.emit('answer', answer); // Send answer back to the caller
            }
          });

          socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
            console.log('answer', answer);
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
          });
      
          // Handle incoming ICE candidates
          socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          });
        
    }

    const startCall = async() => {
        if(!peerConnectionRef.current || !socket) return;
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log('Offer', offer);
        socket.emit('offer', offer);
    };


    const endCall = () => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
    
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
    
        if (remoteStreamRef.current) {
          remoteStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };
  return (
    <div className="absolute top-0 right-0 ">
        <h2>Video call</h2>
        <video ref={localVideoRef} muted autoPlay playsInline className="w-44"></video>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-44"></video>

        <div>
            <button onClick={startLocalStream}>Start video</button>
            <button onClick={startCall}>Start call</button>
            <button onClick={endCall}>End call</button>
        </div>
    </div>
  )
}

export default Video