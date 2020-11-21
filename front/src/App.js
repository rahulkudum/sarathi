
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Switch } from 'react-router-dom';

import Navbar from "./Components/navbar";
import ExcercisesList from "./Components/exercise-list";
import EditExercise from "./Components/edit-exercise";
import CreateExcercise from "./Components/create-exercise";
import CreateUser from "./Components/create-user";
 





function App() {
  return (
    <div className="container">
    <Navbar />
    <br />
    <Switch>
    <Route>
    <Route path="/" exact>
      <ExcercisesList />
    </Route>
    <Route path="/edit:id" exact>
      <EditExercise />
    </Route>
    <Route path="/create" exact>
      <CreateExcercise />
    </Route>
    <Route path="/user" exact>
      <CreateUser  />
    </Route>

    </Route>
    </Switch>

    </div>
  );
}

export default App;
