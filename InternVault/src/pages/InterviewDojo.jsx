import { useState, useEffect, useRef } from "react";
import { GroqService } from "../services/groq";
import { BsMic, BsPlayCircle, BsStopCircle, BsTranslate, BsCheckCircle, BsChatQuote, BsKeyboard, BsSend, BsArrowCounterclockwise } from "react-icons/bs";
import toast from "react-hot-toast";

export function InterviewDojo() {
    const [isActive, setIsActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself.");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);

    // State for UI, Ref for Event Listeners to avoid stale closures
    const [isListening, setIsListening] = useState(false);
    const isListeningRef = useRef(false);

    const [language, setLanguage] = useState("English");
    const [translatedQuestion, setTranslatedQuestion] = useState("");

    const recognitionRef = useRef(null);

    const languages = ["English", "Hindi", "Spanish", "French", "German"];
    const languageCodes = {
        "English": "en-US",
        "Hindi": "hi-IN",
        "Spanish": "es-ES",
        "French": "fr-FR",
        "German": "de-DE"
    };

    // Helper to safely update listening state
    const setListeningState = (state) => {
        setIsListening(state);
        isListeningRef.current = state;
    };

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Browser does not support voice recognition. Please use Chrome Desktop.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = languageCodes[language];

            recognition.onstart = () => {
                setListeningState(true);
            };

            recognition.onend = () => {
                setListeningState(false);
            };

            recognition.onresult = (event) => {
                let transcript = "";
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setUserAnswer(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Speech Error:", event.error);
                if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                    toast.error("Microphone Blocked! Click the lock icon in URL bar.", { duration: 5000 });
                }
                setListeningState(false);
            };

            recognitionRef.current = recognition;

        } catch (e) {
            console.error("Init Error:", e);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort(); // Hard stop on unmount
            }
        };
    }, []);

    // Update Language
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = languageCodes[language];
        }
        if (isActive && language !== "English") {
            translateText(currentQuestion);
        } else {
            setTranslatedQuestion("");
        }
    }, [language, currentQuestion, isActive]);


    const translateText = async (text) => {
        try {
            const result = await GroqService.generateJSON(`Translate: "${text}" to ${language}. Return JSON: { "translation": "..." }`);
            setTranslatedQuestion(result.translation);
        } catch (error) {
            console.error("Translation Error:", error);
        }
    };

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageCodes[language];
        window.speechSynthesis.speak(utterance);
    };

    const startInterview = () => {
        setIsActive(true);
        speak(currentQuestion);
    };

    const handleToggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech Recognition not initialized. Try Chrome.");
            return;
        }

        if (isListeningRef.current) {
            recognitionRef.current.abort(); // Force hard stop
            setListeningState(false); // Immediate UI update
        } else {
            setUserAnswer("");
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start Error:", e);
                // Sometimes it throws if already started, so we force a restart
                if (e.message.includes('already started')) {
                    recognitionRef.current.stop();
                    setTimeout(() => recognitionRef.current.start(), 100);
                }
            }
        }
    };

    const handleResetMic = () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
            setListeningState(false);
            toast("Microphone Reset", { icon: '🔄' });
        }
    };

    const handleSubmitAnswer = async () => {
        if (isListeningRef.current) {
            recognitionRef.current.abort();
            setListeningState(false);
        }

        if (!userAnswer || userAnswer.trim().length === 0) {
            toast.error("Please provide an answer first!", { icon: '✍️' });
            return;
        }

        const loadingToast = toast.loading("Analyzing Answer...");

        try {
            const prompt = `
        User answered the interview question: "${currentQuestion}"
        User's Answer: "${userAnswer}"
        
        Provide JSON feedback:
        {
          "rating": "Excellent/Good/Needs Improvement",
          "critique": "Short feedback on content and clarity",
          "nextQuestion": "A follow-up question based on their answer"
        }
      `;

            const result = await GroqService.generateJSON(prompt);
            toast.dismiss(loadingToast);
            setFeedback(result);
            setCurrentQuestion(result.nextQuestion);

            toast.success("Feedback Received!", { icon: '🤖' });
            speak(`Here is my feedback. ${result.critique}. Next question: ${result.nextQuestion}`);
            setUserAnswer(""); // Clear for next Q
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error(`AI Error: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex flex-col items-center font-sans">
            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dojo</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Master your interview skills with AI-powered feedback.</p>
                </div>

                {!isActive ? (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div
                            onClick={startInterview}
                            className="group bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 w-80 h-80 flex flex-col items-center justify-center cursor-pointer border border-gray-100 hover:border-blue-100 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <BsPlayCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Start Session</h3>
                                <p className="text-gray-400 text-sm mt-2">Click to begin interview</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-500">

                        {/* Control Bar */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="text-xs font-mono text-gray-400 flex items-center gap-2 px-3">
                                    <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                    {isListening ? "MIC ACTIVE" : "MIC OFF"}
                                </div>
                                <button onClick={handleResetMic} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1" title="Hard Reset Microphone">
                                    <BsArrowCounterclockwise /> Reset Mic
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <BsTranslate className="text-gray-400" />
                                <span className="text-sm font-semibold text-gray-600 mr-2">Translator:</span>
                                <select
                                    className="bg-transparent text-sm font-bold text-blue-600 focus:outline-none cursor-pointer"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <BsChatQuote /> Current Question
                            </h2>
                            <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                                {currentQuestion}
                            </p>

                            {/* Translation */}
                            {translatedQuestion && (
                                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-lg text-indigo-600 italic font-medium">
                                        "{translatedQuestion}"
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase">Translated to {language}</p>
                                </div>
                            )}
                        </div>

                        {/* Interaction Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Recording Area */}
                            <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-md border border-gray-100 relative overflow-hidden">
                                <button
                                    onClick={handleToggleListening}
                                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 duration-200 ${isListening ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></span>
                                            <BsStopCircle size={32} />
                                        </>
                                    ) : (
                                        <BsMic size={32} />
                                    )}
                                </button>
                                <p className="mt-6 font-semibold text-gray-700">
                                    {isListening ? "Listening..." : "Tap to Speak"}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {isListening ? "Click to stop & submit" : "Ready when you are"}
                                </p>
                            </div>

                            {/* Transcript Area */}
                            <div className="bg-gray-50 rounded-3xl p-8 shadow-inner border border-gray-200 h-64 flex flex-col relative group">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Answer</p>
                                    <BsKeyboard className="text-gray-300" />
                                </div>
                                <textarea
                                    className="flex-grow bg-transparent border-none resize-none focus:ring-0 text-gray-700 text-lg leading-relaxed placeholder-gray-300"
                                    placeholder="Speak or type your answer here..."
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                />
                                {/* Submit Button */}
                                <div className="absolute bottom-4 right-4 animate-in zoom-in duration-300">
                                    <button
                                        onClick={handleSubmitAnswer}
                                        className={`${userAnswer ? 'bg-blue-600 hover:bg-blue-700 scale-100' : 'bg-gray-300 scale-90'
                                            } text-white p-3 rounded-full shadow-lg transition-all transform flex items-center gap-2`}
                                        title="Submit Answer"
                                    >
                                        <BsSend size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Area */}
                        {feedback && (
                            <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 animate-in fade-in slide-in-from-bottom-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-xl ${feedback.rating === 'Excellent' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        <BsCheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">AI Feedback</p>
                                        <h3 className="text-xl font-bold text-gray-900">{feedback.rating}</h3>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">{feedback.critique}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
