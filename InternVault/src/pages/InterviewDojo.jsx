import { useState, useEffect, useRef } from "react";
import { GroqService } from "../services/groq";
import { BsMic, BsStopCircle, BsPlayCircle, BsStars, BsLightningCharge } from "react-icons/bs";
import toast from "react-hot-toast";

export function InterviewDojo() {
    const [isActive, setIsActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("Tell me about yourself.");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let transcript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setUserAnswer(transcript);
            };
        } else {
            toast.error("Voice recognition is not supported in this browser. Please use Chrome.");
        }
    }, []);

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const startInterview = () => {
        setIsActive(true);
        speak(currentQuestion);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            analyzeAnswer();
        } else {
            setUserAnswer("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const analyzeAnswer = async () => {
        if (!userAnswer) return;

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
            setFeedback(result);
            setCurrentQuestion(result.nextQuestion);

            // Auto-speak feedback after a delay
            setTimeout(() => speak(`Here is my feedback. ${result.critique}. Next question: ${result.nextQuestion}`), 1000);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Interview <span className="text-blue-600">Dojo</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Practice with AI-powered voice interviews and get instant feedback
                    </p>
                </div>

                {!isActive ? (
                    /* Start Screen */
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                <BsPlayCircle size={64} className="text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to Practice?</h2>
                            <p className="text-slate-600 mb-8">
                                Click below to start your AI-powered interview session. Speak naturally and get instant feedback.
                            </p>
                            <button
                                onClick={startInterview}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 inline-flex items-center gap-2"
                            >
                                <BsPlayCircle size={20} />
                                Start Interview
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Active Interview */
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        {/* AI Question Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
                            <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                <BsLightningCharge size={14} />
                                AI Interviewer
                            </div>
                            <div className="mt-2">
                                <p className="text-xl font-medium text-slate-800 leading-relaxed">
                                    "{currentQuestion}"
                                </p>
                            </div>
                        </div>

                        {/* Mic Control */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex flex-col items-center gap-6">
                                <button
                                    onClick={toggleListening}
                                    className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 ${isListening
                                        ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse'
                                        : 'bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black'
                                        }`}
                                >
                                    {isListening ? (
                                        <BsStopCircle size={48} className="text-white" />
                                    ) : (
                                        <BsMic size={48} className="text-white" />
                                    )}
                                </button>
                                <div className="text-center">
                                    <p className="text-slate-700 font-semibold mb-1">
                                        {isListening ? "Recording your answer..." : "Click to start answering"}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                        {isListening ? "Click again to stop & submit" : "Speak clearly into your microphone"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Live Transcript */}
                        {userAnswer && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Live Transcript
                                    </p>
                                </div>
                                <p className="text-slate-700 leading-relaxed">{userAnswer}</p>
                            </div>
                        )}

                        {/* Feedback Card */}
                        {feedback && !isListening && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-500 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BsStars size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                            Feedback: <span className="text-green-700">{feedback.rating}</span>
                                        </h3>
                                        <p className="text-green-800 leading-relaxed">{feedback.critique}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
