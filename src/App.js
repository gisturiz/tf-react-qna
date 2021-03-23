import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import Loader from "react-loader-spinner";

const App = () => {
  // set Refs
  const passageRef = useRef(null);
  const questionRef = useRef(null);

  // set States
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);
  const [searching, setSearching] = useState(false);

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
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, passage);
      setSearching(false);
      setAnswer(answers);
      console.log(answers);
    }
  };

  // load model
  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {model == null ? (
          <div>
            <div>Model Loading</div>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          <React.Fragment>
            Information
            <textarea ref={passageRef} rows="30" cols="100"></textarea>
            Ask a Question
            <input
              ref={questionRef}
              onKeyPress={answerQuestion}
              size="80"
            ></input>
            <br />
            {searching ? <div>Searching, please wait...</div> : ""}
            {answer === undefined ? ("")
              : answer && !answer.length ? (
                <div>Nothing found</div>
              ) : (
                <div>
                  Answer <br />
                  {answer[0].text} ({Math.floor(answer[0].score * 100) / 100})
              </div>)}
          </React.Fragment>
        )}
      </header>
    </div>
  );
};

export default App;
