import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css";

// import components
import Home from './Home';
import Qna from './Qna';
import Facemash from './Facemesh';
import Pose from './Pose';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/qna' component={Qna} />
          <Route path='/facemash' component={Facemash} />
          <Route path='/pose' component={Pose} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
