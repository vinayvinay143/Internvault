import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Home } from "./pages/home";
import { Internship } from "./pages/internship";
import { Prompts } from "./pages/prompt";
import { Skillvault } from "./pages/skillvault";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Skillhome } from "./pages/skillhome";
import { Skills } from "./pages/skills";
import { Course } from "./pages/courses";
// Resume route removed
import { SkillPrompt } from "./pages/skillprompt";
import { Project } from "./pages/project";
import { Favorites } from "./pages/favourites";
import { SkillRadar, CoffeeDetector, InternshipSwiper } from "./pages/Tools";
import { ComparisonTool, NewsFeed, CompanyIntelligence, AICareerCoach, PodcastPlayer, AIInterviewBuddy, MatchingAlgorithm, InternshipHeatmap } from "./pages/AdditionalTools";

import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Dashboard } from "./pages/dashboard";
import { InternChat } from "./pages/InternChat";
import { ColdEmail } from "./pages/ColdEmail";
import { ResumeAnalyzer } from "./pages/ResumeAnalyzer";
import { InterviewDojo } from "./pages/InterviewDojo";

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
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/internships" element={<Internship isLoggedIn={!!user} />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/login" element={<Login setIsLoggedIn={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/internchat" element={<InternChat user={user} />} />


          {/* Protected Tools Routes */}
          <Route path="/tools/interview-dojo" element={<ProtectedRoute user={user}><InterviewDojo /></ProtectedRoute>} />
          <Route path="/tools/cold-email" element={<ProtectedRoute user={user}><ColdEmail /></ProtectedRoute>} />
          <Route path="/tools/resume-analyzer" element={<ProtectedRoute user={user}><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/tools/internship-swiper" element={<ProtectedRoute user={user}><div className="pt-24"><InternshipSwiper /></div></ProtectedRoute>} />
          <Route path="/tools/skill-radar" element={<ProtectedRoute user={user}><div className="pt-24"><SkillRadar /></div></ProtectedRoute>} />
          <Route path="/tools/coffee-detector" element={<ProtectedRoute user={user}><div className="pt-24"><CoffeeDetector /></div></ProtectedRoute>} />

          {/* New Tools */}
          <Route path="/tools/comparison" element={<ProtectedRoute user={user}><div className="pt-24"><ComparisonTool /></div></ProtectedRoute>} />
          <Route path="/tools/news-feed" element={<ProtectedRoute user={user}><div className="pt-24"><NewsFeed /></div></ProtectedRoute>} />
          <Route path="/tools/company-intelligence" element={<ProtectedRoute user={user}><div className="pt-24"><CompanyIntelligence /></div></ProtectedRoute>} />
          <Route path="/tools/career-coach" element={<ProtectedRoute user={user}><div className="pt-24"><AICareerCoach /></div></ProtectedRoute>} />
          <Route path="/tools/podcast" element={<ProtectedRoute user={user}><div className="pt-24"><PodcastPlayer /></div></ProtectedRoute>} />
          <Route path="/tools/interview-buddy" element={<ProtectedRoute user={user}><div className="pt-24"><AIInterviewBuddy /></div></ProtectedRoute>} />
          <Route path="/tools/matching" element={<ProtectedRoute user={user}><div className="pt-24"><MatchingAlgorithm /></div></ProtectedRoute>} />
          <Route path="/tools/heatmap" element={<ProtectedRoute user={user}><div className="pt-24"><InternshipHeatmap /></div></ProtectedRoute>} />

          {/* Protected Individual Routes */}
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} setUser={setUser} /></ProtectedRoute>} />
          <Route path="/skillhome" element={<ProtectedRoute user={user}><Skillhome /></ProtectedRoute>} />
          {/* Resume route removed */}
          <Route path="/host" element={<ProtectedRoute user={user}><Dashboard user={user} setUser={setUser} /></ProtectedRoute>} />


          {/* Protected SkillVault Routes */}
          <Route path="/skillvault" element={<ProtectedRoute user={user}><Skillvault /></ProtectedRoute>}>
            <Route index element={<Skillhome />} />
            <Route path="skills" element={<Skills />} />
            <Route path="courses" element={<Course />} />
            {/* Resume route removed */}
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
