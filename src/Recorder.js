import React, { useState, useMemo } from "react";
import AWS from "aws-sdk";
import MicRecorder from "mic-recorder-to-mp3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export default function Recorder(props) {
  // Post ID
  const [postId, setPostID] = useState();
  // Audio recording
  const [audio, setAudio] = useState();
  // Sent audio
  const [sentAudio, setSentAudio] = useState(false);
  // Text return
  const [text, setText] = useState();
  // Is button recording state
  const [buttonState, setButtonState] = useState(false);

  // New mic recorder
  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  // Send MP3 to S3
  const sendAudio = async () => {
    const presignedURL = await axios
      .get("https://1rhna2u79a.execute-api.us-east-1.amazonaws.com/Dev", {
        params: { name: `audio-${postId}.mp3` },
      })
      .then((res) => {
        setSentAudio(true);
        return res.data.signed_url;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .put(presignedURL, audio, { headers: { ContentType: "audio/mpeg" } })
      .then((res) => {
        setText(res.body);
      })
      .catch((error) => console.log(error));
  };

  // Axios to get Text from API
  const getText = () => {
    axios
      .get("https://qkik78toke.execute-api.us-east-1.amazonaws.com/Dev", {
        params: { name: `audio-${postId}.mp3.json` },
      })
      .then((res) => {
        setText(res.data.results.transcripts[0].transcript);
      })
      .catch((error) => console.log(error));
  };

  // Record Audio logic
  const recordAudio = () => {
    if (buttonState === false) {
      recorder
        .start()
        .then(() => {
          var id = uuidv4();
          setPostID(id);
          setButtonState(true);
        })
        .catch((e) => {
          console.error(e);
        });
      console.log("started");
    } else {
      recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          setButtonState(false);
          const audioFile = `audio-${postId}.mp3`;
          const file = new File(buffer, audioFile, {
            type: blob.type,
            lastModified: Date.now(),
          });
          setAudio(file);
        })
        .catch((e) => {
          console.error(e);
        });
      console.log("stopped");
    }
  };

  // Pass text state to parent callback trigger
  const onTrigger = () => {
    props.parentCallback(text);
  };

  return (
    <div>
      <button className="mic-button" onClick={recordAudio}>
        {!buttonState ? "Start" : "Stop"}
      </button>
      {audio ? <button onClick={sendAudio}>Send Audio</button> : null}
      {sentAudio ? <button onClick={getText}>Get Text</button> : null}
      {text ? onTrigger(text) : null}
    </div>
  );
}
