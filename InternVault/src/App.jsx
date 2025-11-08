import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import {Internship } from "./pages/internship";
import { Prompts } from "./pages/prompt";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <div>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/internships" element={<Internship/>} />
      <Route path="/prompts" element={<Prompts/>} />
    </Routes> 
    </div>
  );
}

export default App;
