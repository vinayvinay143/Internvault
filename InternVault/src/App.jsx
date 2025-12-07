import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Internship } from "./pages/internship";
import { Prompts } from "./pages/prompt";
import { Skillvault } from "./pages/skillvault";
import { Navbar } from "./components/navbar";


import { Skillhome } from "./pages/skillhome";
import { Skills } from "./pages/skills";
import { Course } from "./pages/courses";
import { Resume } from "./pages/resume";
import { SkillPrompt } from "./pages/skillprompt";

import { Login } from "./pages/login";

function App() {

  return (
    <section>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internships" element={<Internship />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/login" element={<Login />} />


        <Route path="/skillvault" element={<Skillvault />}>
          <Route index element={<Skillhome />} />
          <Route path="skills" element={<Skills />} />
          <Route path="courses" element={<Course />} />
          <Route path="resume" element={<Resume />} />
          <Route path="skillprompt" element={<SkillPrompt />} />
        </Route>
      </Routes>
    </section>
  );
}

export default App;
