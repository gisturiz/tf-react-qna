import React, { useState, useMemo } from "react";
import AWS from "aws-sdk";
import MicRecorder from "mic-recorder-to-mp3";
import axios from "axios";

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

export default function Recorder(props) {
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

  const postId = Date.now();

  // Send MP3 to S3
  const s3 = new AWS.S3();
  const sendAudio = async () => {
    const params = {
      ACL: "public-read",
      ContentType: "audio/mpeg",
      Bucket: "transcribeposts-gustavo",
      Body: audio,
      Key: `audio-${postId}`,
    };

    return await new Promise((resolve, reject) => {
      s3.putObject(params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };

  // Axios to get Text from API
  const getText = () => {
    axios
      .get("https://qkik78toke.execute-api.us-east-1.amazonaws.com/Dev")
      .then((res) => {
        setText(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const recordAudio = () => {
    if (buttonState === false) {
      recorder
        .start()
        .then(() => {
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
          console.log(buffer, blob);
          const file = new File(buffer, "recording.mp3", {
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

  return (
    <div>
      <button className="mic-button" onClick={recordAudio}>
        {!buttonState ? "Start" : "Stop"}
      </button>
      {audio ? <button onClick={sendAudio}>Send Audio</button> : null}
      {sentAudio ? <button onClick={getText}>Get Text</button> : null}
      {text ? props.setAnswerText(text) : null}
    </div>
  );
}
