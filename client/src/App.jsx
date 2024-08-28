import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import TextEditor from "./components/TextEditor"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
