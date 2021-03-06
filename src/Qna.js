import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import Loader from "react-loader-spinner";
// import recorder
import Recorder from "./Recorder";

const Qna = () => {
  // set Refs
  const passageRef = useRef(null);
  const questionRef = useRef(null);

  // set States
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);
  const [searching, setSearching] = useState(false);
  const [answerText, setAnswerText] = useState();

  // Load TF Model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model loaded.");
  };

  // Question logic
  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("Question submitted.");
      setSearching(true);
      // const passage = passageRef.current.value; // For submnitting questions based on what has been typed input. Change param line 35 to passage
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, answerText);
      setSearching(false);
      setAnswer(answers);
      console.log(answers);
    }
  };

  // Text callback
  const handleCallback = (childData) => {
    setAnswerText(childData)
  };

  // load model
  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
  setAnswerText(answerText)
}, [answerText]);

  return (
    <div className="Qna-App">
      <header className="Qna-App-header">
        {model == null ? (
          <div>
            <div>Model Loading</div>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          <React.Fragment>
            <Recorder parentCallback={handleCallback} />
            <div>
            Information
            </div>
            <textarea ref={passageRef} value={answerText} rows="30" cols="100"></textarea>
            Ask a Question
            <input
              ref={questionRef}
              onKeyPress={answerQuestion}
              size="80"
            ></input>
            <br />
            {searching ? <div>Searching, please wait...</div> : ""}
            {answer === undefined ? (
              ""
            ) : answer && !answer.length ? (
              <div>Nothing found</div>
            ) : (
              <div>
                Answer <br />
                {answer[0].text} ({Math.floor(answer[0].score * 100) / 100})
              </div>
            )}
          </React.Fragment>
        )}
      </header>
    </div>
  );
};

export default Qna;