import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsRobot, BsClock, BsCode, BsCheckCircle, BsXCircle, BsExclamationTriangle, BsPlayFill, BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import toast from "react-hot-toast";

// Import Ace Editor
import AceEditor from "react-ace";
import ace from "ace-builds";

// Use webpack-resolver or manual path setting for Vite
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

// Fix for Ace Editor path
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-noconflict/");
ace.config.setModuleUrl("ace/mode/javascript_worker", "https://cdn.jsdelivr.net/npm/ace-builds@1.32.2/src-noconflict/worker-javascript.js");

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function StudentCodeSubmission({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [existingSubmission, setExistingSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [timeLeft, setTimeLeft] = useState(null); // in seconds
    const [hasStarted, setHasStarted] = useState(false);

    // IDE state
    const [editorTheme, setEditorTheme] = useState("monokai");
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);

    // Camera State
    const videoRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // Derived State
    const isExpired = challenge ? new Date(challenge.deadline) < new Date() : false;
    const hasSubmitted = !!existingSubmission;

    // Proctoring State
    const [proctoringData, setProctoringData] = useState({
        tabSwitchCount: 0,
        pasteCount: 0,
        maxPasteLength: 0,
        startTime: Date.now(),
        keystrokes: 0,
        suspiciousEvents: []
    });

    // 1. Data Fetching
    useEffect(() => {
        if (user) {
            fetchChallenge();
            checkExistingSubmission();
        }
    }, [id, user]);

    // 2. Persistent Timer Logic
    useEffect(() => {
        if (!challenge || !user || !hasStarted || hasSubmitted) return;

        const sessionKey = `test_session_${id}_${user._id}`;
        let sessionData = JSON.parse(localStorage.getItem(sessionKey));

        if (!sessionData) {
            // First start
            sessionData = { startTime: Date.now() };
            localStorage.setItem(sessionKey, JSON.stringify(sessionData));
            if (challenge.timeLimit) {
                setTimeLeft(challenge.timeLimit * 60);
            }
        } else {
            // Resume session
            if (challenge.timeLimit) {
                const elapsedSeconds = Math.floor((Date.now() - sessionData.startTime) / 1000);
                const remaining = (challenge.timeLimit * 60) - elapsedSeconds;
                setTimeLeft(remaining > 0 ? remaining : 0);
            }
            // Restore proctoring start time
            setProctoringData(prev => ({ ...prev, startTime: sessionData.startTime }));
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [challenge, user, hasStarted, hasSubmitted, id]);

    // Auto-submit when time hits 0
    useEffect(() => {
        if (timeLeft === 0 && !hasSubmitted && !submitting && hasStarted) {
            toast.error("Time's up! Auto-submitting your code...", { duration: 4000, icon: '⏰' });
            submitCode(true);
        }
    }, [timeLeft, hasSubmitted, submitting, hasStarted]);

    // 3. Exit Warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasStarted && !hasSubmitted) {
                e.preventDefault();
                e.returnValue = "You have an active test. Are you sure you want to leave?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasStarted, hasSubmitted]);

    // 4. Check for active session on load
    useEffect(() => {
        if (user && id) {
            const sessionKey = `test_session_${id}_${user._id}`;
            const sessionData = localStorage.getItem(sessionKey);
            if (sessionData && !existingSubmission) {
                setHasStarted(true);
            }
        }
    }, [user, id, existingSubmission]);

    // 5. Camera Activation (Proctoring)
    useEffect(() => {
        let stream = null;
        if (hasStarted && !hasSubmitted) {
            const startCamera = async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setCameraActive(true);
                    setCameraError(null);
                } catch (err) {
                    console.error("Camera access denied:", err);
                    setCameraError("Camera access required for proctoring.");
                    setCameraActive(false);
                    // Optionally force stop the test or warn
                    toast.error("Camera access denied! Proctoring integrity compromised.", { icon: '📷' });
                    setProctoringData(prev => ({
                        ...prev,
                        suspiciousEvents: [...prev.suspiciousEvents, { type: 'camera_denied', timestamp: new Date(), details: 'User denied camera access' }]
                    }));
                }
            };
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [hasStarted, hasSubmitted]);


    const fetchChallenge = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/code-challenges/${id}`);
            setChallenge(response.data);
            setLanguage(response.data.programmingLanguage === "Any" ? "JavaScript" : response.data.programmingLanguage);
        } catch (error) {
            console.error("Error fetching challenge:", error);
            toast.error("Failed to load challenge");
            navigate("/code-challenges");
        } finally {
            setLoading(false);
        }
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.error("Please write some code first");
            return;
        }

        setIsRunning(true);
        setExecutionResult(null);

        // Language mapping for Judge0 proxy
        const langMap = {
            'JavaScript': { language: 'javascript' },
            'Python': { language: 'python' },
            'Java': { language: 'java' },
            'C++': { language: 'cpp' },
            'C': { language: 'c' }
        };

        const config = langMap[language] || langMap['JavaScript'];

        try {
            const token = localStorage.getItem("token");
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.post(`${API_URL}/student/execute`, {
                language: config.language,
                files: [{ content: code }]
            }, { headers });

            if (response.data && response.data.run) {
                setExecutionResult(response.data.run);
            } else {
                throw new Error("Invalid response from execution API");
            }
        } catch (error) {
            console.error("Execution Detailed Error:", error);
            const errorMsg = error.response?.data?.details?.message || error.response?.data?.error || error.message || "Unknown execution error";
            toast.error(`Execution failed: ${errorMsg}`);
            setExecutionResult({
                stderr: `Error: ${errorMsg}\n\nOur server could not process the execution request or the external service is down.`,
                code: 1
            });
        } finally {
            setIsRunning(false);
        }
    };

    const checkExistingSubmission = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/my-code-submissions`, {
                params: { studentId: user._id, challengeId: id }
            });
            if (response.data.length > 0) {
                setExistingSubmission(response.data[0]);
                setCode(response.data[0].code);
                setLanguage(response.data[0].programmingLanguage);
                // Clear session if submitted
                localStorage.removeItem(`test_session_${id}_${user._id}`);
            }
        } catch (error) {
            console.error("Error checking submission:", error);
        }
    };

    // 6. Tab Switch Monitor
    const lastSwitchTime = useRef(0);
    const hasWarnedRef = useRef(false);

    useEffect(() => {
        if (!hasStarted || hasSubmitted) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const now = Date.now();
                // Debounce: Ignore if updated less than 500ms ago (prevents double triggers)
                if (now - lastSwitchTime.current < 500) return;
                lastSwitchTime.current = now;

                setProctoringData(prev => {
                    const newCount = prev.tabSwitchCount + 1;
                    const newEvent = { type: 'tab_switch', timestamp: new Date(), details: `Tab switch #${newCount}` };
                    return {
                        ...prev,
                        tabSwitchCount: newCount,
                        suspiciousEvents: [...prev.suspiciousEvents, newEvent]
                    };
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [hasStarted, hasSubmitted]);

    // Toast Effect for Tab Switching
    useEffect(() => {
        if (proctoringData.tabSwitchCount > 0) {
            toast((t) => (
                <span className="flex items-center gap-2">
                    <BsExclamationTriangle className="text-yellow-500" />
                    Warning: Tab switching is monitored! ({proctoringData.tabSwitchCount})
                </span>
            ), { icon: '⚠️', id: `tab-warning-${proctoringData.tabSwitchCount}` }); // Unique ID prevents duplicates
        }
    }, [proctoringData.tabSwitchCount]);

    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Event Handlers
    const handlePaste = (e) => {
        e.preventDefault();
        toast.error("Pasting is disabled! Please type your solution.", { icon: '🚫' });

        setProctoringData(prev => ({
            ...prev,
            pasteCount: prev.pasteCount + 1,
            suspiciousEvents: [...prev.suspiciousEvents, { type: 'paste_attempt', timestamp: new Date(), details: 'Blocked paste attempt' }]
        }));
    };

    const handleCopyCut = (e) => {
        e.preventDefault();
        toast.error("Copy/Cut is disabled!", { icon: '🚫' });
    };

    const handleKeyDown = () => {
        setProctoringData(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
    };

    const submitCode = async (isAutoSubmit = false, isForcedExit = false) => {
        // Handling Empty Code
        if (!code.trim()) {
            if (isAutoSubmit) {
                toast("Time's up! No code written.", { icon: '⌛' });
                localStorage.removeItem(`test_session_${id}_${user._id}`);
                navigate("/code-challenges");
                return;
            } else if (isForcedExit) {
                // Manual Exit with Empty Code
                toast("Test forfeited. No code submitted.", { icon: '🚪' });
                localStorage.removeItem(`test_session_${id}_${user._id}`);
                navigate("/code-challenges");
                return;
            } else {
                // Normal Submit with Empty Code
                toast.error("Please write some code before submitting");
                return;
            }
        }

        setSubmitting(true);

        const timeSpentMinutes = (Date.now() - proctoringData.startTime) / 60000;
        const wpm = timeSpentMinutes > 0 ? Math.round((proctoringData.keystrokes / 5) / timeSpentMinutes) : 0;

        const finalProctoringData = {
            ...proctoringData,
            typingSpeedWPM: wpm,
            suspiciousEvents: isAutoSubmit
                ? [...proctoringData.suspiciousEvents, { type: 'timer_expired', timestamp: new Date(), details: 'Auto-submitted due to timeout' }]
                : proctoringData.suspiciousEvents
        };

        try {
            await axios.post(`${API_URL}/student/submit-code`, {
                challengeId: id,
                studentId: user._id,
                studentName: user.username,
                studentEmail: user.email,
                code: code,
                programmingLanguage: language,
                proctoringData: finalProctoringData
            });

            if (isAutoSubmit) {
                toast("Test submitted automatically.", { icon: '🏁' });
            } else {
                toast.success("Code submitted successfully!");
            }

            // Clear session data
            localStorage.removeItem(`test_session_${id}_${user._id}`);

            checkExistingSubmission();

            setTimeout(() => {
                navigate("/code-challenges");
            }, 3000);

        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to submit code");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to submit your solution?")) {
            submitCode(false);
        }
    };

    // Render Logic
    if (!user) return <div className="min-h-screen flex items-center justify-center pt-24"><p>Please login.</p></div>;
    if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
    if (!challenge) return null;

    // Start Test Overlay
    if (!hasStarted && !hasSubmitted && !isExpired) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 flex items-center justify-center">
                <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-purple-600 px-8 py-6 text-white text-center">
                        <BsCode className="text-5xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">{challenge.title}</h1>
                        <p className="opacity-90">by {challenge.companyName}</p>
                    </div>
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Instructions & Rules</h3>
                        <ul className="space-y-3 mb-8 text-gray-600">
                            <li className="flex items-start gap-3">
                                <BsClock className="text-purple-600 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900">Time Limit:</span> You have <span className="font-bold text-purple-600">{challenge.timeLimit} minutes</span> to complete this challenge.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <BsRobot className="text-purple-600 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900">Proctoring Active:</span> Full-screen monitoring, tab switching detection, and <strong>Video/Audio Recording</strong> are enabled.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <BsExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900">Warning:</span> Do not refresh or close the tab once started. The timer will continue running.
                                </div>
                            </li>
                        </ul>

                        <div className="flex justify-center flex-col items-center gap-4">
                            <button
                                onClick={() => setHasStarted(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition shadow-lg"
                            >
                                <BsPlayFill className="text-2xl" />
                                Start Test
                            </button>
                            <p className="text-xs text-gray-500">By starting, you consent to video/audio proctoring.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const timerColor = timeLeft !== null && timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-600";

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            if (hasStarted && !hasSubmitted) {
                                if (window.confirm("⚠️ END TEST WARNING ⚠️\n\nLeaving this page will SUBMIT your current code and END the test.\n\nYou will NOT be able to return and write more.\n\nAre you sure you want to submit and exit?")) {
                                    submitCode(false, true); // Force submit on exit (Manual)
                                }
                            } else {
                                navigate("/code-challenges");
                            }
                        }}
                        className="text-purple-600 hover:text-purple-700 font-semibold mb-4"
                    >
                        ← Back to Challenges (Ends Test)
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
                            <p className="text-gray-600">by {challenge.companyName}</p>
                        </div>

                        {!hasSubmitted && !isExpired && (
                            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                                <BsClock className={`text-xl ${timeLeft !== null && timeLeft < 60 ? "text-red-500" : "text-purple-500"}`} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Time Remaining</p>
                                    <p className={`text-2xl font-mono font-bold ${timerColor}`}>
                                        {formatTime(timeLeft)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Problem Statement & Camera Feed */}
                    <div className="space-y-6">
                        {/* Camera Feed */}
                        {!hasSubmitted && hasStarted && (
                            <div className="bg-black rounded-2xl overflow-hidden relative shadow-lg aspect-video max-h-[200px] w-[300px]">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded text-red-500 font-bold text-xs animate-pulse">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    REC
                                </div>
                                <div className="absolute bottom-2 right-2 text-white text-[10px] bg-black/50 px-2 py-0.5 rounded">
                                    {cameraActive ? "Proctoring Active" : "Camera Access Pending..."}
                                </div>
                                {!cameraActive && cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
                                        <BsCameraVideoOff className="text-3xl mb-2 text-red-500" />
                                        <p className="text-xs">{cameraError}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Problem Statement</h2>

                            <div className="flex items-center gap-3 mb-6 flex-wrap">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                    {challenge.programmingLanguage}
                                </span>
                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                    <BsClock /> {challenge.timeLimit} minutes total
                                </span>
                            </div>

                            <div className="prose prose-sm max-w-none mb-6">
                                <p className="text-gray-700 whitespace-pre-wrap">{challenge.problemStatement}</p>
                            </div>

                            {(challenge.sampleInput || challenge.sampleOutput) && (
                                <div className="space-y-4">
                                    {challenge.sampleInput && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sample Input:</h3>
                                            <pre className="bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-x-auto">{challenge.sampleInput}</pre>
                                        </div>
                                    )}
                                    {challenge.sampleOutput && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sample Output:</h3>
                                            <pre className="bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-x-auto">{challenge.sampleOutput}</pre>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isExpired ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                                <BsClock className={`text-xl mt-0.5 ${isExpired ? 'text-red-600' : 'text-blue-600'}`} />
                                <div>
                                    <p className={`font-semibold ${isExpired ? 'text-red-800' : 'text-blue-800'}`}>
                                        {isExpired ? 'Deadline Passed' : 'Deadline'}
                                    </p>
                                    <p className={`text-sm ${isExpired ? 'text-red-600' : 'text-blue-600'}`}>
                                        {new Date(challenge.deadline).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Code Editor */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <BsCode /> Editor
                            </h2>
                            <div className="flex items-center gap-3">
                                <select
                                    value={editorTheme}
                                    onChange={(e) => setEditorTheme(e.target.value)}
                                    className="px-3 py-1 text-sm border rounded-lg bg-white outline-none"
                                >
                                    <option value="monokai">Monokai (Dark)</option>
                                    <option value="github">Github (Light)</option>
                                </select>
                                {challenge.programmingLanguage === "Any" && (
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        disabled={hasSubmitted}
                                        className="px-3 py-1 text-sm border rounded-lg bg-white outline-none disabled:bg-gray-100"
                                    >
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="Python">Python</option>
                                        <option value="Java">Java</option>
                                        <option value="C++">C++</option>
                                        <option value="C">C</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Proctoring Notice */}
                        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                            <BsRobot className="text-xl text-purple-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-purple-800 text-xs">Behavioral Proctoring Active</p>
                                <p className="text-[10px] text-purple-600">
                                    Anti-cheat enabled: Camera, tab switching, and copy-pasting are monitored.
                                </p>
                            </div>
                        </div>

                        {/* Existing Submission Status */}
                        {hasSubmitted && existingSubmission.proctoringData && (
                            <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${existingSubmission.proctoringData.isSuspicious
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-green-50 border border-green-200'
                                }`}>
                                {existingSubmission.proctoringData.isSuspicious ? (
                                    <BsExclamationTriangle className="text-xl text-red-600 mt-0.5" />
                                ) : (
                                    <BsCheckCircle className="text-xl text-green-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className={`font-semibold text-sm ${existingSubmission.proctoringData.isSuspicious ? 'text-red-800' : 'text-green-800'}`}>
                                        Verdict: {existingSubmission.proctoringData.verdict}
                                    </p>
                                    <p className="text-xs mt-1 text-gray-600">
                                        WPM: {existingSubmission.proctoringData.typingSpeedWPM} | Tab Switches: {existingSubmission.proctoringData.tabSwitchCount}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-mono">
                                        {language.toLowerCase()}.{language === 'Python' ? 'py' : language === 'Java' ? 'java' : 'js'}
                                    </span>
                                </div>
                                <AceEditor
                                    mode={language === 'C++' || language === 'C' ? 'c_cpp' : language.toLowerCase()}
                                    theme={editorTheme}
                                    value={code}
                                    onChange={(newValue) => setCode(newValue)}
                                    name="challenge-editor"
                                    editorProps={{ $blockScrolling: true }}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 4,
                                        useWorker: false,
                                        wrap: true
                                    }}
                                    width="100%"
                                    height="500px"
                                    fontSize={14}
                                    disabled={hasSubmitted || isExpired || (timeLeft !== null && timeLeft <= 0)}
                                    onPaste={handlePaste}
                                />
                                <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500 border-t">
                                    <span>{code.length} characters written</span>
                                    <span>UTF-8 | {language}</span>
                                </div>
                            </div>

                            {/* Terminal / Output Area */}
                            {(executionResult || isRunning) && (
                                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="bg-black/90 px-4 py-2 flex items-center justify-between border-b border-white/10">
                                        <span className="text-white text-xs font-bold font-mono flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            TERMINAL
                                        </span>
                                        {executionResult && (
                                            <span className={`text-xs font-mono ${executionResult.code === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {executionResult.status || (executionResult.code === 0 ? 'SUCCESS' : 'EXITED')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-black/95 p-4 font-mono text-xs h-40 overflow-y-auto custom-scrollbar">
                                        {isRunning ? (
                                            <div className="flex flex-col items-center justify-center h-full gap-3">
                                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-purple-400 animate-pulse">Running compilation & tests...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {executionResult.stdout && (
                                                    <div className="text-green-400">
                                                        <p className="text-white/50 mb-1 border-b border-white/5 pb-1">Output:</p>
                                                        <pre className="whitespace-pre-wrap">{executionResult.stdout}</pre>
                                                    </div>
                                                )}
                                                {executionResult.stderr && (
                                                    <div className="text-red-400 mt-2">
                                                        <p className="text-white/50 mb-1 border-b border-white/5 pb-1">Error Stream:</p>
                                                        <pre className="whitespace-pre-wrap">{executionResult.stderr}</pre>
                                                    </div>
                                                )}
                                                {!executionResult.stdout && !executionResult.stderr && (
                                                    <p className="text-gray-500 italic">Program executed with no output.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={handleRunCode}
                                    disabled={isRunning || submitting || hasSubmitted || isExpired || (timeLeft !== null && timeLeft <= 0)}
                                    className="flex-1 bg-gray-800 text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isRunning ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <BsPlayFill className="text-xl" />
                                            Run Code
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || hasSubmitted || isExpired || (timeLeft !== null && timeLeft <= 0)}
                                    className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-200"
                                >
                                    {submitting ? "Submitting..." : hasSubmitted ? "Already Submitted" : isExpired ? "Deadline Passed" : (timeLeft !== null && timeLeft <= 0) ? "Time's Up" : "Submit Final Solution"}
                                </button>
                            </div>

                            {hasSubmitted && (
                                <p className="text-sm text-center text-gray-600 mt-4">
                                    You have successfully submitted your solution.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentCodeSubmission;
