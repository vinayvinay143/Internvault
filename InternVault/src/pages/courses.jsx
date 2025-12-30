import { useState, useEffect } from "react";
import axios from "axios"; // Assuming axios is installed/used
import { FaYoutube, FaGoogle } from "react-icons/fa";
import { SiUdemy, SiCoursera } from "react-icons/si";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom"; // Assuming user might be passed via context if not strict props, but we'll try to get it from props or localstorage if needed. 


const API_URL = "http://localhost:5000/api";

export function Course() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${user._id}`);
      const favoriteIds = response.data.map((fav) => fav.projectId);
      setFavorites(favoriteIds);
    } catch (error) {
      // Silently handle error - user may not have any favorites yet
      setFavorites([]);
    }
  };

  const toggleFavorite = async (course) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    setLoading(true);
    const uniqueId = `course_${course.id}`;
    const isFavorited = favorites.includes(uniqueId);

    try {
      if (isFavorited) {
        await axios.delete(`${API_URL}/favorites/remove/${user._id}/${uniqueId}`);
        setFavorites((prev) => prev.filter((id) => id !== uniqueId));
      } else {
        const sourcesData = course.sources.map(src => ({
          name: src.name,
          link: src.link
        }));

        const favoriteData = {
          userId: user._id,
          projectId: uniqueId,
          title: `${course.name} Course`,
          domain: "Learning",
          level: "Course",
          description: course.description,
          image: course.image,
          sources: sourcesData,
        };

        console.log('Adding course to favorites:', favoriteData);

        await axios.post(`${API_URL}/favorites/add`, favoriteData);
        setFavorites((prev) => [...prev, uniqueId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response?.status === 400 && !isFavorited) {
        setFavorites((prev) => [...prev, uniqueId]);
      } else {
        // If 404 on remove? ignore
      }
    } finally {
      setLoading(false);
    }
  };


  const courses = [
    {
      id: 1,
      name: "Python",
      description: "High-level programming language known for simplicity and versatility.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=QXeEoD0pB3E&list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3" },

        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/ai-python-development-megaclass-300-hands-on-projects/?couponCode=DEC_FREE_AA03" },

        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/python" }
      ],
    },
    {
      id: 2,
      name: "java",
      description: "A set of specifications for building enterprise Java applications.",
      image: "/java.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/eIrMbAQSU34?si=1YHhKbeGXJHfD7m9" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/java-oop-iter-academy/?couponCode=OOP-DECEMBER25-2" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/java-core-in-practice-iter-academy/?couponCode=CORE-DECEMBER25-2" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/java-programming-fundamental" },
      ],
    },
    {
      id: 3,
      name: "C",
      description: "Procedural programming language used for system and embedded development.",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/irqbmMNs2Bo?si=NWS399nCfB1GPnTY" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/c-programming/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/c-programming-for-everybody" },
      ],
    },
    {
      id: 4,
      name: "ruby",
      description: "Testing applications using Ruby-based tools to ensure functionality, reliability, and quality.",
      image: "/ruby.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/fmyvWz5TUWg?si=CQBhwd1-Oknb398U" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/ruby-tutorial-for-beginners/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/packt-ruby-fundamentals-and-basic-programming-concepts-oiwfl" },
      ],
    },
    {
      id: 5,
      name: "C#",
      description: "A modern object-oriented programming language developed by Microsoft.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLEiEAq2VkUULDJ9tZd3lc0rcH4W5SNSoW&si=Saodl8tRgvWoLHZq" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/c-sharp/" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/c-sharp-mastering-course-for-beginners/?couponCode=0F68B75B1FDDFF040D42" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-programming-with-c-sharp" },
      ],
    },
    {
      id: 6,
      name: "Go",
      description: "A fast, statically typed programming language developed by Google.",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/un6ZyFkqFKo?si=zLg0wqMlHJCAxWz4" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/go-programming-language/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/golang-getting-started" },
      ],
    },
    {
      id: 7,
      name: "Rust",
      description: "Modern systems programming language focused on safety and performance.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/BpPEoZW5IiY?si=ppOcLHCIp5QaJDtn" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/rust-programming-bootcamp/?couponCode=DEC_FREE_AA03" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-rust-programming-masterclass-from-beginner-to-expert" },
      ],
    },
    {
      id: 8,
      name: "JavaScript",
      description: "A versatile programming language used to create dynamic and interactive web applications.",
      image: "/js.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/PkZNo7MFNFg?si=fzPWt-fgfEN7WLBq" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.discudemy.com/javascript/javascript-for-beginners-complete-course" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/javascript-beginner" },
      ],
    },
    {
      id: 9,
      name: "TypeScript",
      description: "A strongly typed superset of JavaScript that enhances code quality, scalability, and maintainability.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/SpwzRDUQ1GI?si=nrTZhYqMVgnxjt4P" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.discudemy.com/javascript/typescript" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-typescript" },
      ],
    },
    {
      id: 10,
      name: "SQL Server",
      description: "Microsoft’s relational database management system for enterprise applications.",
      image: "/ss.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/7GVFYt6_ZFM?si=wQzlxgVm56XTQvis" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/sql-server/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/professional-certificates/microsoft-sql-server" },
      ],
    },
    {
      id: 11,
      name: "R",
      description: "A programming language used for statistical computing and data analysis.",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/R_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/KlsYCECWEWE?si=ycqQ6yrLdEEEdA7K" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/r-programming/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/r-programming" },
      ],
    },
    {
      id: 12,
      name: "Swift",
      description: "Apple’s programming language for building iOS and macOS applications.",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/PwXgg9adkdM?si=Jh1Cje1pu1YmTUD9" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/swift/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/programming-fundamentals-swift" },
      ],
    },
    {
      id: 13,
      name: "Kotlin",
      description: "A modern programming language for Android and cross-platform development.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/xT8oP0wy-A0?si=n4C-CM-Q8KwnAE8F" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/kotlin/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/meta-programming-fundamentals-kotlin" },
      ],
    },
    {
      id: 87,
      name: "HTML",
      description: "Standard markup language for creating web pages and web applications.",
      image: "https://cdn-icons-png.flaticon.com/512/732/732212.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/pQN-pnXPaVg" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/html5/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/html" },
      ],
    },
    {
      id: 88,
      name: "CSS",
      description: "Style sheet language used to design and layout web pages.",
      image: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/OXGznpKZ_sA" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/css/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/css" },
      ],
    },
    {
      id: 89,
      name: "MySQL",
      description: "Open-source relational database management system.",
      image: "/sql.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/7S_tz1z_5bA" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/mysql/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/database-structures-and-management-with-mysql" },
      ],
    },
    {
      id: 90,
      name: "MongoDB",
      description: "NoSQL document-oriented database for scalable applications.",
      image: "/mdb.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ofme2o29ngU" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/mongodb/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/packt-mastering-mongodb-7" },
      ],
    },
    {
      id: 91,
      name: "PostgreSQL",
      description: "Advanced open-source relational database system.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968342.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/qw--VYLpxG4" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/postgresql/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/intermediate-postgresql" },
      ],
    },
    {
      id: 92,
      name: "Firebase",
      description: "Backend-as-a-Service platform for building web and mobile apps.",
      image: "/fire.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/fgdpvwEWJ9M" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/firebase/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-firebase" },
      ],
    },
    {
      id: 27,
      name: "Express.js",
      description: "A minimal Node.js framework for building web and API applications.",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/nH9E25nkk3I?si=iWbA7rm_OXgqN1yT" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/nodejs-the-complete-guide/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/programming-with-javascript" },
      ],
    },
    {
      id: 214,
      name: "Material UI",
      description: "React component library implementing Google's Material Design for modern web applications.",
      image: "/mui.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/BHEPVdfBAqE?si=dpxPEs5gV3gqr7Kh" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/mastering-mui-component-customization/?couponCode=CM251226G1" },

      ],
    },
    {
      id: 215,
      name: "Supabase",
      description: "Open-source Firebase alternative providing authentication, database, and storage services.",
      image: "/sbase.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ldYcgPKEZC8" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/supabase/" },
        { name: "Google", icon: <FaGoogle />, link: "https://supabase.com/docs" },
      ],
    },
    {
      id: 14,
      name: "Docker",
      description: "A platform for containerizing applications and services.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/pg19Z8LL06w?si=5mpG_BZQYdMP3Q4T" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/zero-to-docker/?couponCode=DEC_FREE_AA03" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/docker-crash-course/?couponCode=D533E9E130580F1ED29D" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/docker-certified-associate-dca-course" },
      ],
    },
    {
      id: 15,
      name: "React Native",
      description: "A framework for building native mobile applications using React.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/eiK56u_9Jo8?si=YqwC5z1VNj_hTksb" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/react-native/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/react-native-course" },
      ],
    },
    {
      id: 16,
      name: "Angular",
      description: "A TypeScript-based front-end framework for building scalable web applications.",
      image: "https://angular.io/assets/images/logos/angular/angular.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/xAT0lHYhHMY?si=7qUUuxk6m89EjtPQ" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/angular/" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/signals-in-angular-v19/?couponCode=6005A7CAFAE291C9735F" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/mastering-angular-development" },
      ],
    },
    {
      id: 17,
      name: "Postman",
      description: "A collaboration platform for API development and testing.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/VywxIQ2ZXw4?si=VCBUDCVK3y2FKnLF" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/postman/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/projects/start-your-api-testing-journey-with-postman-tool" },
      ],
    },

    {
      id: 19,
      name: "Google Cloud",
      description: "Google’s cloud platform for computing, storage, and AI services.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/live/IUU6OR8yHCc?si=utN6qP_JvoGbaXZp" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/google-cloud/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/gcp-fundamentals" },
      ],
    },
    {
      id: 20,
      name: "AWS DevOps",
      description: "DevOps practices using AWS tools for CI/CD, automation, and cloud deployment.",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/GkKNxyLp_V0?si=tVNGIzt0DNTl9hvg" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/aws-devops-bootcamp/?couponCode=DEC_FREE_AA03" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/aws-devops-bootcamp/?couponCode=DEC_FREE_AA03" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-devops-complete-course" },
      ],
    },
    {
      id: 21,
      name: "AWS",
      description: "Amazon’s cloud computing platform offering scalable services.",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/_rnR0LaLkIU?si=R-sozbD1w2OBDV3G" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/aws-certification/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/professional-certificates/aws-generative-ai-applications" },
      ],
    },
    {
      id: 22,
      name: "Oracle",
      description: "Enterprise-grade database system used for large-scale and mission-critical applications.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ObbNGhcxXJA?si=TfZPiFsDe7UIFPnL" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/oracle-database/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/oraclecloud-infrastructure-foundations" },
      ],
    },
    {
      id: 23,
      name: "Flutter",
      description: "An open-source UI toolkit for building natively compiled mobile, web, and desktop apps.",
      image: "/flutter.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/IfUjHNODRoM?si=MhvR3FgOByNas-se" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/flutter-bootcamp-with-dart/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/flutter-and-dart-developing-ios-android-mobile-apps" },
      ],
    },

    {
      id: 25,
      name: "Kubernetes",
      description: "An orchestration system for managing containerized applications.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/X48VuDVv0do?si=FEasGMsZ2peob957" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/kubernetes-certified-administrator/?couponCode=DEC_FREE_AA03" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/pearson-kubernetes-from-basics-to-guru" },
      ],
    },
    {
      id: 26,
      name: "Ethical Hacking",
      description: "The practice of identifying and fixing security vulnerabilities legally.",
      image: "/eh.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/3Kq1MIfTWCE?si=ae58fZjjesIsH2Pc" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/ethical-hacking/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-the-complete-ethical-hacking-course" },
      ],
    },
    {
      id: 28,
      name: "Metasploit",
      description: "A penetration testing framework for identifying system vulnerabilities.",
      image: "/meta.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/xuYZNJCvHgQ?si=6jdkh5kbvTivbEfu" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/metasploit/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/projects/metasploit-for-beginners-ethical-penetration-testing" },
      ],
    },
    {
      id: 30,
      name: "Figma",
      description: "A collaborative UI/UX design and prototyping tool.",
      image: "/figma.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/kbZejnPXyLM?si=a8gSDQa0QuFemNNB" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/figma/" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/figma-for-user-interface-and-user-experience-uiux-design/?couponCode=5C033862B3E8D11DE2C1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/beginnerfigmauiuxdesignessentials" },
      ],
    },
    {
      id: 31,
      name: "Blazor",
      description: "A Microsoft framework for building interactive web UIs using C# instead of JavaScript.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Blazor.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/CpbRAWgFBRQ?si=gukkprSJFTK69BHX" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/blazor/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-the-complete-blazor-bootcamp-net-6-wasm-and-server" },
      ],
    },
    {
      id: 32,
      name: "Tableau",
      description: "A powerful data visualization and business intelligence tool.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Tableau_Logo.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/aHaOIvR00So?si=OEEkx8ZESnnivHY-" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/tableau/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-tableau" },
      ],
    },
    {
      id: 33,
      name: "Machine Learning",
      description: "A field of AI that enables systems to learn and improve from data.",
      image: "/ml.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/i_LwzRVP7bg?si=7-RMOMYxZZpZvDGr" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/machine-learning/" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/machine-learning-and-deep-learning-projects-in-python/?couponCode=205F92FF744F44ED8DB4" },

        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/machine-learning" },
      ],
    },
    {
      id: 34,
      name: "TensorFlow",
      description: "An open-source framework for machine learning and deep learning.",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/tPYj3fFJGjk?si=RRLT47BC9KdikZDd" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/tensorflow/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/tensorflow-advanced-techniques" },
      ],
    },
    {
      id: 35,
      name: "PyTorch",
      description: "A deep learning framework optimized for research and production.",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Pytorch_logo.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/V_xro1bcAuA?si=0fJt-P3NFp93xZ3C" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/pytorch/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/pytorch-fundamentals" },
      ],
    },
    {
      id: 36,
      name: "MLOps",
      description: "Practices for deploying, monitoring, and maintaining machine learning models.",
      image: "/mlops.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/-dJPoLm_gtE?si=OTB1pZi2KragRcOL" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/mlops/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/mlops-machine-learning-duke" },
      ],
    },
    {
      id: 37,
      name: "BeautifulSoup",
      description: "A Python library for parsing HTML and XML documents, commonly used for web scraping.",
      image: "/bs.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=XVv6mJpFOb0" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/web-scraping-course-in-python-bs4-selenium-and-scrapy/?couponCode=CM251224G1" },
      ],
    },
    {
      id: 38,
      name: "Selenium",
      description: "A powerful tool for automating web browsers, commonly used for testing and web scraping.",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=mOJiWrjFVKY&list=PLEsT37dHeGbQqI7bwtUxbUNbmJIzOj19D" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/learn-selenium-automation-in-easy-python-language/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/intro-to-selenium" },
      ],
    },
    {
      id: 39,
      name: "NumPy",
      description: "A fundamental Python library for numerical computing, providing support for arrays, matrices, and mathematical functions.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=1qz7qUM6yUI" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/master-numpy-foundation-and-practice-challenging-exercises/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/packt-intro-to-numpy-ftdg2" },
      ],
    },
    {
      id: 40,
      name: "Pandas",
      description: "A powerful Python library for data manipulation and analysis, providing data structures like DataFrame and Series.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Pandas_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=vtgDGrUiUKk" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/the-ultimate-pandas-bootcamp-advanced-python-data-analysis/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-data-analysis-with-pandas-and-python" },
      ],
    },
    {
      id: 41,
      name: "Matplotlib",
      description: "A popular Python library for creating static, animated, and interactive visualizations in Python.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=xXibS9832FM" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/matplotlib-complete-python-data-visualization-course/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/matplotlib-python-data-visualization-wrangling" },
      ],
    },
    {
      id: 42,
      name: "Seaborn",
      description: "A Python library built on top of Matplotlib for statistical data visualization, providing high-level interface for drawing attractive and informative graphics.",
      image: "/sea.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=39cge_JhVjI" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/data-visualization-made-easy-with-seaborn-and-python/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/seaborn-visualizing-basics-to-advanced-statistical-plots" },
      ],
    },
    {
      id: 43,
      name: "OpenCV",
      description: "An open-source computer vision and image processing library used for real-time image and video analysis.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/53/OpenCV_Logo_with_text.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=RKE_w0F16ZA&list=PLaHodugB5x-Ddy_H951h0VHjOjfzZNCBh" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/learn-opencv-for-computer-vision/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/computer-vision-cu" },
      ],
    },
    {
      id: 44,
      name: "SQLAlchemy",
      description: "A Python SQL toolkit and Object Relational Mapper (ORM) that provides efficient and flexible database interaction.",
      image: "/sqla.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=Z2zD3EdjpNo&list=PLKm_OLZcymWhtiM-0oQE2ABrrbgsndsn0" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/sqlalchemy-orm-fundamentals/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/sql-data-science" },
      ],
    },
    {
      id: 45,
      name: "FastAPI",
      description: "A modern, fast (high-performance) Python web framework for building APIs with automatic interactive documentation.",
      image: "/fast.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=WJKsPchji0Q&list=PLKnIA16_RmvZ41tjbKB2ZnwchfniNsMuQ" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/completefastapi/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-ultimate-guide-to-fast-api-and-backend-development" },
      ],
    },
    {
      id: 46,
      name: "Artificial Intelligence",
      description: "The field of computer science focused on building systems that can perform tasks requiring human intelligence such as learning, reasoning, and decision-making.",
      image: "/ai.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=uB3i-qV6VdM&list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/the-ai-engineer-course-complete-ai-engineer-bootcamp/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-ai" },
      ],
    },
    {
      id: 47,
      name: "Generative AI",
      description: "A branch of artificial intelligence focused on creating new content such as text, images, audio, and code using machine learning models.",
      image: "/gena.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=pSVk-5WemQ0&list=PLKnIA16_RmvaTbihpo4MtzVm4XOQa0ER0" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/generative-ai-for-beginners-b/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/generative-ai-introduction-and-applications" },
      ],
    },
    {
      id: 48,
      name: "Agentic AI",
      description: "An AI paradigm where autonomous agents can plan, reason, make decisions, and take actions to achieve goals with minimal human intervention.",
      image: "/aa.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=yC36gN-rqjo&list=PLKnIA16_RmvYsvB8qkUQuJmJNuiCUJFPL" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/complete-agentic-ai-bootcamp-with-langgraph-and-langchain/?couponCode=CM251224G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/ai-agents-for-leaders" },
      ],
    },
    {
      id: 49,
      name: "Data Science",
      description: "An interdisciplinary field that uses scientific methods, statistics, programming, and machine learning to extract insights and knowledge from data.",
      image: "/ds.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=xPh5ihBWang" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/data-analytics-data-science-machine-learning-all-in-1/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/data-science-ethical-decision-making-in-practice" },
      ],
    },
    {
      id: 50,
      name: "Scikit-learn",
      description: "A Python library for machine learning and data mining.",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/MwNLCyCyS-M?si=sDYxtbthNJld6hMk" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/scikit-learn/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/projects/scikit-learn-for-machine-learning-classification-problems" },
      ],
    },
    {
      id: 51,
      name: "Deep Learning",
      description: "A subset of machine learning based on neural networks.",
      image: "/dl.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/VyWAvY2CF9c?si=M9HJH53qTdZEhhzG" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/deep-learning/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/deep-learning" },
      ],
    },
    {
      id: 52,
      name: "Statistics",
      description: "The science of collecting, analyzing, and interpreting data.",
      image: "/statics.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/AN3UkzE3HMg?si=e4lRYr4Dn7_S6ifQ" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/statistics/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/basic-statistics" },
      ],
    },
    {
      id: 53,
      name: "VPNs",
      description: "Virtual Private Networks used to securely connect networks over the internet.",
      image: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLmgyxPj-5jn7knP3rq1k2UiDRSJNh7bU1&si=Z_jK6ePpeoEzk-m6" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/vpn/" },
      ],
    },

    {
      id: 55,
      name: "Shell Scripting",
      description: "Writing scripts to automate tasks in Unix/Linux environments.",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bash_Logo_Colored.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/FL7K2A2KH7g?si=tXFnhiiNIiYI__FL" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/shell-scripting/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/hands-on-introduction-to-linux-commands-and-shell-scripting" },
      ],
    },
    {
      id: 56,
      name: "Virtualization",
      description: "Creating virtual versions of hardware, servers, or operating systems.",
      image: "https://cdn-icons-png.flaticon.com/512/2881/2881329.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLf7QeYWBebsdlJguAzRR8I1bUIxCHujNo&si=bPlTnDUYJZKtQ2Uu" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/virtualization/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/illinois-tech-operating-system-virtualization-bit" },
      ],
    },
    {
      id: 57,
      name: "Blender",
      description: "An open-source tool for 3D creation including modeling and animation.",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/QXhLQJME2p8?si=zMT0ZviHsX4inKvs" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/blender/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/blenderforbeginners" },
      ],
    },
    {
      id: 58,
      name: "3D Modeling",
      description: "The process of creating three-dimensional digital objects.",
      image: "https://cdn-icons-png.flaticon.com/512/2590/2590436.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/N-HFQeZvaP0?si=PPzz4EffWOwY_Ywn" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/3d-modeling/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/packt-foundations-of-3d-modelling-in-blender-ugmas" },
      ],
    },
    {
      id: 59,
      name: "Unity",
      description: "A game development engine for creating 2D, 3D, AR, and VR experiences.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/gB1F9G0JXOo?si=DXJU0UrzPY-rCkck" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/unity/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/game-design-and-development" },
      ],
    },
    {
      id: 60,
      name: "ARCore",
      description: "Google’s platform for building augmented reality experiences.",
      image: "/arc.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/1whLL4XJlh4?si=euC57E3kqAkmGxag" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/arcore-and-sceneform-masterclass-for-android-q/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/gcp-fundamentals" },
      ],
    },
    {
      id: 61,
      name: "Material Design",
      description: "Google’s design system for creating intuitive and consistent user interfaces.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Material_Design_Logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/m1diVY4Uzjc?si=7uFYyHurBv-lIxKY" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/material-design/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/projects/ui-design-using-material-design-3-designing-a-reminder-app" },
      ],
    },
    {
      id: 62,
      name: "AJAX",
      description: "A technique for creating dynamic web applications without page reloads.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/AJAX_logo_by_gengns.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PL_euSNU_eLbf1QIz2azmUKb3g19lkvfkv&si=d1_PMBC49jZ8IhmU" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/ajax/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/ajax-basics" },
      ],
    },
    {
      id: 63,
      name: "Google Sheets",
      description: "A cloud-based spreadsheet tool for data analysis and collaboration.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/N2opj8XzYBY?si=k4uzeXHHQys7vG1r" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/google-sheets/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/google-sheets" },
      ],
    },
    {
      id: 64,
      name: "Looker",
      description: "A business intelligence platform for data exploration and visualization.",
      image: "/lml.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLb1Ovsa8zsbUMrH0stNeGKAG5fPFL5MbM&si=u7gXnTrJ-6Ou-yXl" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/looker-learning-tutorial-for-beginners/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-looker" },
      ],
    },
    {
      id: 65,
      name: "Hadoop",
      description: "An open-source framework for distributed storage and processing of big data.",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Hadoop_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLlgLmuG_KgbasW0lpInSAIxYd2vqAEPit&si=bvNpVzSPlxWD6mEg" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/the-ultimate-hands-on-hadoop-tame-your-big-data/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/big-data-processing-using-hadoop" },
      ],
    },
    {
      id: 66,
      name: "Spark (Big Data)",
      description: "A fast analytics engine for large-scale data processing.",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/watch?v=wNRjR6Cds5s&list=PL2IsFZBGM_IHCl9zhRVC1EXTomkEp_1zm" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/apache-spark/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-big-data-with-spark-hadoop" },
      ],
    },
    {
      id: 67,
      name: "NLP",
      description: "Natural Language Processing enables machines to understand human language.",
      image: "https://cdn-icons-png.flaticon.com/512/2620/2620986.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/live/Rj-OtK2n5jU?si=VwTfyvBbSxWb2JnC" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/natural-language-processing/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/fundamentals-natural-language-processing" },
      ],
    },
    {
      id: 68,
      name: "CNN",
      description: "Convolutional Neural Networks used mainly for image recognition tasks.",
      image: "https://cdn-icons-png.flaticon.com/512/1792/1792131.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/nVhau51w6dM?si=AQCA33NYLZoXRLxt" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/convolutional-neural-networks/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/convolutional-neural-networks" },
      ],
    },
    {
      id: 69,
      name: "Keras",
      description: "A high-level deep learning API running on top of TensorFlow.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/live/0skIU_Icwdw?si=BXvpTZlsMLY4puTb" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/keras/" },
      ],
    },
    {
      id: 70,
      name: "Salesforce",
      description: "Cloud-based CRM platform for sales, service, and application development.",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/f1AMkMQw-p4?si=6-M0xs_iyYZlOhQg" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/learn-salesforce-admin-developer-with-lwc-live-project/?couponCode=C102BBA714F3B3573938" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/professional-certificates/salesforce-sales-operations" },
      ],
    },
    {
      id: 71,
      name: "Jenkins",
      description: "Automation server used to build, test, and deploy software.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/FX322RVNGj4?si=-nhwAk-dzNVTPqEK" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/ultimate-jenkins-bootcamp-by-school-of-devops/?couponCode=DEC_FREE_AA03" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/jenkins-for-beginners" },
      ],
    },
    {
      id: 72,
      name: "Quantum Computing",
      description: "Computing paradigm using quantum mechanics to solve complex problems.",
      image: "https://cdn-icons-png.flaticon.com/512/3207/3207593.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/tsbCSkvHhMo?si=i-Pa_O0AjmdCcuZZ" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/quantum-computing/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/quantum-computing-for-everyone-an-introduction" },
      ],
    },
    {
      id: 73,
      name: "DevSecOps",
      description: "Integrating security practices into the DevOps lifecycle.",
      image: "https://cdn-icons-png.flaticon.com/512/2312/2312214.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/gLJdrXPn0ns?si=Nh67eT4rx2iVraMw" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/ultimate_devsecops_bootcamp/?couponCode=DEC_FREE_AA03" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/application-security-for-developers-devops" },
      ],
    },
    {
      id: 74,
      name: "Automation Testing",
      description: "Using tools and scripts to automatically test software applications.",
      image: "https://cdn-icons-png.flaticon.com/512/3246/3246104.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/live/HmQv8Z4om4I?si=VbhfHUcQs4HmwpRb" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-learn-automation-testing-with-java-and-selenium-webdriver" },

      ],
    },
    {
      id: 75,
      name: "Manual Testing",
      description: "Testing software manually to identify bugs and usability issues.",
      image: "https://cdn-icons-png.flaticon.com/512/4053/4053023.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtube.com/playlist?list=PLUDwpEzHYYLseflPNg0bUKfLmAbO2JnE9&si=yLELQw7Di-Hti9Ja" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/manual-software-testing-h/?couponCode=CM251226G1" },

      ],
    },
    {
      id: 76,
      name: "Cisco",
      description: "Networking technologies and certifications for enterprise networking solutions.",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/cisco-ccna/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.cisco.com/site/us/en/learn/index.html" },
      ],
    },
    {
      id: 77,
      name: "Adobe",
      description: "A suite of creative tools for design, video, and digital media.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/Ib8UBwu3yGA?si=GOSDqRYgPiaudxMR" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/adobe/" },
        { name: "Google", icon: <FaGoogle />, link: "https://helpx.adobe.com/" },
      ],
    },
    {
      id: 78,
      name: "Wireframing",
      description: "Creating basic layouts to visualize application structure and flow.",
      image: "https://cdn-icons-png.flaticon.com/512/3131/3131614.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/iyrEStiTZh0?si=w-dk_ZXiiJQi4LbG" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/wireframing/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.interaction-design.org/literature/topics/wireframing" },
      ],
    },
    {
      id: 79,
      name: "Prototyping",
      description: "Building interactive models to test and validate design ideas.",
      image: "https://cdn-icons-png.flaticon.com/512/7228/7228394.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/L22lDu3QX2c?si=XHCcNKOWttt-RJzK" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/prototyping/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.interaction-design.org/literature/topics/prototyping" },
      ],
    },
    {
      id: 81,
      name: "Agile",
      description: "An iterative project management methodology focused on flexibility and collaboration.",
      image: "https://cdn-icons-png.flaticon.com/512/10056/10056093.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/VFQtSqChlsk?si=iKSuUxXnk8f4xnqH" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/agile/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.atlassian.com/agile" },
      ],
    },
    {
      id: 82,
      name: "Scrum",
      description: "An Agile framework for managing and delivering complex projects iteratively.",
      image: "https://cdn-icons-png.flaticon.com/512/9119/9119046.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/SyIN_YMfoQs?si=vh5mpI1PIfFz87Sd" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/scrum/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.scrum.org/resources/what-is-scrum" },
      ],
    },
    {
      id: 83,
      name: "Kanban",
      description: "A visual workflow management method for improving efficiency and flow.",
      image: "https://cdn-icons-png.flaticon.com/512/5650/5650892.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/o4sNKMazeas?si=XhK5DbK4tUQNKwbb" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/kanban/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.atlassian.com/agile/kanban" },
      ],
    },
    {
      id: 84,
      name: "Jira",
      description: "A project management and issue tracking tool widely used in Agile teams.",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/NDVSMlVYxm8?si=UT2sxXWORRWWqyMK" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/jira/" },
        { name: "Google", icon: <FaGoogle />, link: "https://support.atlassian.com/jira-software/" },
      ],
    },
    {
      id: 85,
      name: "Data Warehousing",
      description: "The process of collecting and managing data from multiple sources for analytics.",
      image: "https://cdn-icons-png.flaticon.com/512/2906/2906206.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/xfvdxQJj7Vw?si=yf7OahmmUtq8L4_D" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/warehouse-management-best-practice/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/data-warehouse-fundamentals" },
      ],
    },
    {
      id: 86,
      name: "CI/CD",
      description: "Continuous Integration and Continuous Deployment for faster software delivery.",
      image: "https://cdn-icons-png.flaticon.com/512/4148/4148677.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/scEDHsr3APg?si=kR0wZRNeIs9cB6gd" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/gitlab-ci-pipelines-ci-cd-and-devops-for-beginners/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/continuous-integration-and-continuous-delivery-ci-cd" },
      ],
    },
    {
      id: 93,
      name: "Power BI",
      description: "Business analytics tool for data visualization and insights.",
      image: "/power.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/AGrl-H87pRU" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/microsoft-power-bi/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst" },
      ],
    },
    {
      id: 94,
      name: "Alteryx",
      description: "Data analytics and automation platform.",
      image: "/alt.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/nytgVtMOh9o?si=d_ZJt0ZeclmqwTzU" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/alteryx/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/packt-alteryx-for-beginners-3trz1" },
      ],
    },
    {
      id: 95,
      name: "Node.js",
      description: "JavaScript runtime built on Chrome's V8 engine.",
      image: "/njs.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/TlB_eWDSMt4" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/nodejs/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-nodejs" },
      ],
    },
    {
      id: 96,
      name: "React.js",
      description: "JavaScript library for building user interfaces.",
      image: "/react.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/bMknfKXIFA8" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/react/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-react-js-masterclass-go-from-zero-to-job-ready" },
      ],
    },
    {
      id: 97,
      name: "Flask",
      description: "Lightweight Python web framework.",
      image: "/flask.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/Z1RJmh_OqeA" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/flask/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/projects/flask-for-beginners-creating-an-application" },
      ],
    },
    {
      id: 98,
      name: "Django",
      description: "High-level Python web framework for rapid development.",
      image: "/dj.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/F5mRW0jo-U4" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/django/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/developing-applications-with-sql-databases-and-django" },
      ],
    },
    {
      id: 99,
      name: "AWS Redshift",
      description: "Cloud data warehouse for big data analytics.",
      image: "https://cdn-icons-png.flaticon.com/512/873/873120.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ojE4RUYZl1E?si=3HT_cgycqpgmT7i4" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/amazon-redshift/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/aws-amazon-redshift-service-primer" },
      ],
    },
    {
      id: 100,
      name: "Microsoft Azure",
      description: "Cloud computing platform by Microsoft.",
      image: "https://cdn-icons-png.flaticon.com/512/873/873107.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/NKEFWyqJ5XA" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/microsoft-azure/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/microsoft-azure-cloud-services" },
      ],
    },
    {
      id: 101,
      name: "Bootstrap",
      description: "CSS framework for responsive web design.",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/-qfEOE4vtxE" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/bootstrap/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-bootstrap" },
      ],
    },
    {
      id: 102,
      name: "PHP",
      description: "Server-side scripting language for web development.",
      image: "https://cdn-icons-png.flaticon.com/512/919/919830.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/OK_JCtrrv-c" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/php/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/database-applications-php" },
      ],
    },
    {
      id: 103,
      name: "Computer Vision",
      description: "Field of AI that enables computers to interpret visual data.",
      image: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/01sAkU_NvOY" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/computer-vision/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/advanced-computer-vision-with-tensorflow" },
      ],
    },
    {
      id: 104,
      name: "Spring Boot",
      description: "Java framework for building production-ready applications.",
      image: "/sb.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/9SGDpanrc8U" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/spring-boot/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/google-cloud-java-spring" },
      ],
    },
    {
      id: 105,
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for rapidly building custom user interfaces.",
      image: "/tw.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ft30zcMlFao" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/tailwind-css/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-tailwind-css" },
      ],
    },
    {
      id: 106,
      name: "Next.js",
      description: "React framework for building fast, SEO-friendly web applications.",
      image: "/next.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ZVnjOPwW4ZA" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/nextjs/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/learn-nextjs" },
      ],
    },
    {
      id: 107,
      name: "Nuxt.js",
      description: "Vue.js framework for creating server-rendered and static web applications.",
      image: "/nuxt.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/ltzlhAxJr74" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/nuxtjs/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/fundamentals-of-nuxtjs" },
      ],
    },
    {
      id: 108,
      name: "Vue.js",
      description: "Progressive JavaScript framework for building user interfaces.",
      image: "/vue.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/qZXt1Aom3Cs" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/topic/vue-js/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/fundamentals-of-vuejs" },
      ],
    },
    {
      id: 109,
      name: "Microsoft Excel",
      description: "Spreadsheet software used for data analysis, visualization, and reporting.",
      image: "https://cdn-icons-png.flaticon.com/512/732/732220.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/rwbho0CgEAE" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/professional-certificates/microsoft-excel-skills" },
      ],
    },
    {
      id: 201,
      name: "Linux",
      description: "Open-source operating system widely used for servers, development, and cybersecurity.",
      image: "/linux.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/YHFzr-akOas?si=7f1Ok2DjGeQ8VI4p" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/complete-linux-training-course-to-get-your-dream-it-job/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/linux-fundamentals" },
      ],
    },
    {
      id: 202,
      name: "MATLAB",
      description: "Numerical computing environment for matrix operations, simulations, and engineering applications.",
      image: "/mat.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/0x4JhS1YpzI?si=ci9kU0CjVbDHSixj" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/matlab-essentials-for-engineering-and-science-students/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/matlab-programming-engineers-scientists" },
      ],
    },
    {
      id: 203,
      name: "Dart",
      description: "Programming language optimized for building mobile, desktop, and web applications.",
      image: "/dart.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/CzRQ9mnmh44?si=xkwzTfLi1NxSwUvy" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-flutter-dart-complete-app-development-course" },
      ],
    },
    {
      id: 204,
      name: "jQuery",
      description: "JavaScript library for DOM manipulation, event handling, and animations.",
      image: "/j.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/QhQ4m5g2fhA?si=rNL7qr-lGKxkwRNH" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/stunning-excel-dashboards-with-powerpivot-and-power-view/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/packt-the-complete-jquery-course-beginner-to-professional" },
      ],
    },
    {
      id: 205,
      name: "ASP.NET",
      description: "Microsoft framework for building dynamic web applications and services.",
      image: "/asp.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/4IgC2Q5-yDE?si=i2WHwahB2aTV-syI" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/build-an-app-with-aspnet-core-and-angular-from-scratch/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-aspdotnet-core-framework" },
      ],
    },
    {
      id: 206,
      name: "SQLite",
      description: "Lightweight, serverless database engine widely used in embedded systems and applications.",
      image: "/sqlit.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/312RhjfetP8?si=3Y-m0lWtgj_cbDWD" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/sqlite-for-beginners/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/sql-data-science" },
      ],
    },
    // {
    //   id: 207,
    //   name: "Cassandra",
    //   description: "Highly scalable NoSQL database designed for handling large amounts of data across servers.",
    //   image: "https://cdn-icons-png.flaticon.com/512/919/919830.png",
    //   sources: [
    //     { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/7nK1VVtLzXU" },
    //     { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/apache-cassandra/" },
    //     { name: "Google", icon: <FaGoogle />, link: "https://cassandra.apache.org/_/index.html" },
    //   ],
    // },
    {
      id: 208,
      name: "DynamoDB",
      description: "AWS-managed NoSQL database service offering fast and flexible performance.",
      image: "/ddb.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/2k2GINpO308?si=DRl8WZiUt9oRUkXv" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/dynamodb/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/aws-dynamodb-fundamentals" },
      ],
    },
    {
      id: 209,
      name: "DSA",
      description: "Data Structures and Algorithms, foundational concepts for efficient programming and problem-solving.",
      image: "https://cdn-icons-png.flaticon.com/512/2721/2721292.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/wDgQL8sOgjM?si=b69b_eGyTdLFHFxg" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/data-structures-and-algorithm-dsa-for-tech-interviews/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/specializations/boulder-data-structures-algorithms" },
      ],
    },
    {
      id: 210,
      name: "Data Analysis",
      description: "Process of inspecting, cleaning, and modeling data to discover useful insights.",
      image: "/da.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/rGx1QNdYzvs?si=ZqyloSyls5mud0Tu" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/data-analysis-projects-using-sql-power-bi-tableau-excel/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/introduction-to-data-analytics" },
      ],
    },
    {
      id: 211,
      name: "Cryptography",
      description: "Study of secure communication techniques including encryption and decryption.",
      image: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://www.youtube.com/live/C7vmouDOJYM?si=5jU2KlPIxgxu-xxv" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/du-cryptography/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/crypto" },
      ],
    },
    {
      id: 212,
      name: "Penetration Testing",
      description: "Security practice of simulating cyberattacks to identify vulnerabilities in systems.",
      image: "https://cdn-icons-png.flaticon.com/512/3064/3064198.png",
      sources: [
        { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/3Kq1MIfTWCE?si=m9p3roHHR5zjkNZh" },
        { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/hands-on-complete-penetration-testing-and-ethical-hacking/?couponCode=CM251226G1" },
        { name: "Google", icon: <FaGoogle />, link: "https://www.coursera.org/learn/ibm-penetration-testing-threat-hunting-cryptography" },
      ],
    },
    // {
    //   id: 213,
    //   name: "Kali Linux",
    //   description: "Debian-based Linux distribution designed for penetration testing and cybersecurity.",
    //   image: "https://cdn-icons-png.flaticon.com/512/518/518713.png",
    //   sources: [
    //     { name: "YouTube", icon: <FaYoutube />, link: "https://youtu.be/3Kq1MIfTWCE" },
    //     { name: "Udemy", icon: <SiUdemy />, link: "https://www.udemy.com/course/kali-linux/" },
    //     { name: "Google", icon: <FaGoogle />, link: "https://www.kali.org/docs/" },
    //   ],
    // },

  ];

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Learning <span className="text-blue-600">Resources</span></h1>
        <p className="text-gray-500 mt-2">Curated lists from top platforms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const uniqueId = `course_${course.id}`;

          return (
            <div
              key={course.id}
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative mb-4">
                <div className="absolute top-0 right-0 z-10">
                  <button
                    onClick={() => toggleFavorite(course)}
                    disabled={loading}
                    className="bg-white/90 p-2 rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 transition"
                  >
                    {favorites.includes(uniqueId) ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                  </button>
                </div>
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-16 h-16 object-contain rounded-xl mb-2"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">{course.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-2">
                {course.sources.map((src, index) => (
                  <a
                    key={index}
                    href={src.link}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 font-medium text-xs hover:bg-blue-600 hover:text-white transition"
                  >
                    {src.icon}
                    {src.name}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
