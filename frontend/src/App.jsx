import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Preview from "./pages/Preview";
import Edit from "./pages/Edit";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          {/* <Route path="/upload" element={}></Route> */}
          <Route path="/dashboard">
            <Route path=":id">
              <Route index element={<Dashboard />}></Route>
              <Route path="preview" element={<Preview />}></Route>
              <Route path="edit" element={<Edit />}></Route>
              {/* <Route path="save" element={}></Route> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
