import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Internship } from "./pages/internship";
import { Prompts } from "./pages/prompt";
import { Skillvault } from "./pages/skillvault";
import { Navbar } from "./components/navbar";


import { Skillhome } from "./pages/skillhome";
import { Skills } from "./pages/skills";
import { Course } from "./pages/courses";
import { Resume } from "./pages/resume";
import { SkillPrompt } from "./pages/skillprompt";
import { Project } from "./pages/project";
import { Favorites } from "./pages/favourites";

import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";

function App() {
  const [user, setUser] = useState(null);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <section>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internships" element={<Internship isLoggedIn={!!user} />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/login" element={<Login setIsLoggedIn={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />


        <Route path="/skillvault" element={<Skillvault />}>
          <Route index element={<Skillhome />} />
          <Route path="skills" element={<Skills />} />
          <Route path="courses" element={<Course />} />
          <Route path="resume" element={<Resume />} />
          <Route path="skillprompt" element={<SkillPrompt />} />
          <Route path="project" element={<Project user={user} />} />
          <Route path="favorites" element={<Favorites user={user} />} />
        </Route>
      </Routes>
    </section>
  );
}

export default App;
