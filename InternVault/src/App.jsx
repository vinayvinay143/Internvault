import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/home";
import { Internship } from "./pages/internship";
import { Prompts } from "./pages/prompt";
import { Skillvault } from "./pages/skillvault";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

import { Skillhome } from "./pages/skillhome";
import { Skills } from "./pages/skills";
import { Course } from "./pages/courses";
import { Resume } from "./pages/resume";
import { SkillPrompt } from "./pages/skillprompt";
import { Project } from "./pages/project";
import { Favorites } from "./pages/favourites";

import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Dashboard } from "./pages/dashboard";
import { InternChat } from "./pages/InternChat";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

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
    <section className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <ScrollToTop />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/internships" element={<Internship isLoggedIn={!!user} />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/login" element={<Login setIsLoggedIn={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
          <Route path="/intern-chat" element={<InternChat />} />

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
      </main>
      <Footer />
    </section>
  );
}

export default App;
