import { useState, useEffect, useRef } from "react";
import { GroqService } from "../services/groq";
import { BsMic, BsMicMute, BsPlayCircle, BsStopCircle } from "react-icons/bs";
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex flex-col items-center">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">🎙️ Voice <span className="text-blue-600">Dojo</span></h1>

                {!isActive ? (
                    <div className="bg-white p-10 rounded-full shadow-xl w-64 h-64 mx-auto flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={startInterview}>
                        <div className="text-center">
                            <BsPlayCircle size={64} className="text-blue-500 mx-auto mb-2" />
                            <p className="font-bold text-gray-700">Start Interview</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">

                        {/* AI Avatar / Question */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                AI Interviewer
                            </div>
                            <p className="text-xl font-medium text-gray-800">"{currentQuestion}"</p>
                        </div>

                        {/* User Controls */}
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={toggleListening}
                                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-black'}`}
                            >
                                {isListening ? <BsStopCircle size={40} className="text-white" /> : <BsMic size={40} className="text-white" />}
                            </button>
                            <p className="text-gray-500 text-sm font-medium">
                                {isListening ? "Listening... click to stop & submit" : "Click mic to answer"}
                            </p>
                        </div>

                        {/* Transcript Preview */}
                        {userAnswer && (
                            <div className="bg-gray-100 p-6 rounded-2xl text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Live Transcript</p>
                                <p className="text-gray-700">{userAnswer}</p>
                            </div>
                        )}

                        {/* Feedback Card */}
                        {feedback && !isListening && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl text-left">
                                <h3 className="font-bold text-blue-900 mb-1">Feedback: {feedback.rating}</h3>
                                <p className="text-blue-800 text-sm">{feedback.critique}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
