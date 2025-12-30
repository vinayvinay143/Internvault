import { useState, useRef } from "react";
import { GroqService } from "../services/groq";
import { BsCloudUpload, BsX, BsLightningCharge, BsListCheck, BsImage, BsFileEarmarkPdf, BsCheckCircle, BsExclamationTriangle, BsPencilSquare, BsDownload, BsMagic } from "react-icons/bs";
import * as pdfjsLib from 'pdfjs-dist';
import toast from "react-hot-toast";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export function ResumeAnalyzer() {
    const [mode, setMode] = useState("analyze"); // 'analyze' or 'create'
    const [resumeImage, setResumeImage] = useState(null);
    const [fileName, setFileName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    // Builder State
    const [builderData, setBuilderData] = useState({
        fullName: "",
        email: "",
        phone: "",
        summary: "",
        experience: "",
        education: "",
        skills: ""
    });
    const [generatedResume, setGeneratedResume] = useState("");

    const fileInputRef = useRef(null);

    // --- Analyze Mode Handlers ---

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setAnalysis(null);
        setStatus("Processing file...");

        if (file.type === "application/pdf") {
            try {
                const image = await convertPdfToImage(file);
                setResumeImage(image);
                setStatus("");
            } catch (error) {
                console.error("PDF Conversion Error:", error);
                toast.error("Failed to process PDF. Please try an image file instead.");
                setStatus("Error processing PDF");
            }
        } else if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeImage(reader.result);
                setStatus("");
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please upload a PDF or Image file.");
        }
    }

    const convertPdfToImage = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1); // Render first page only

        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        return canvas.toDataURL("image/png");
    };

    const analyzeResume = async () => {
        if (!resumeImage) return;

        setLoading(true);
        setAnalysis(null);
        setStatus("Analyzing resume content...");

        try {
            const prompt = `
        Act as a strict hiring manager. Analyze this image of a resume against the job description (if provided).
        
        Job Description:
        "${jobDescription.substring(0, 1000)}"

        Provide the output ONLY as valid JSON with this structure:
        {
          "score": (number 0-100),
          "summary": "Brief 1-sentence summary of the candidate's profile level",
          "missingKeywords": ["List of 3-5 critical missing skills/keywords"],
          "designFeedback": "Specific feedback on layout, fonts, and readability",
          "bulletPointFixes": [
            {"original": "Weak bullet point found in resume", "improved": "Rewritten result-oriented version"}
          ],
          "strengths": ["List 2 strong points"]
        }
      `;

            const resultText = await GroqService.generateFromImage(prompt, resumeImage);
            const jsonString = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
            const result = JSON.parse(jsonString);

            setAnalysis(result);
            setStatus("Analysis Complete");
        } catch (err) {
            console.error(err);
            toast.error("Analysis failed. Try a clear image or PDF.");
            setStatus("Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Builder Mode Handlers ---

    const handleBuilderChange = (e) => {
        setBuilderData({ ...builderData, [e.target.name]: e.target.value });
    };

    const generateResume = async () => {
        setLoading(true);
        setStatus("Generating professional resume...");
        setGeneratedResume("");

        try {
            const prompt = `
            You are an expert Resume Writer. Create a professional, ATS-friendly resume based on this data:
            
            Name: ${builderData.fullName}
            Email: ${builderData.email}
            Phone: ${builderData.phone}
            Summary: ${builderData.summary}
            Experience: ${builderData.experience}
            Education: ${builderData.education}
            Skills: ${builderData.skills}

            Output Format: Markdown. Use clean headings, bullet points, and professional tone. 
            Highlight key achievements. Optimize for clarity and impact.
            `;

            const response = await GroqService.generateText(prompt);
            setGeneratedResume(response);
            setStatus("Resume Generated!");
        } catch (error) {
            console.error(error);
            toast.error("Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* Header - Minimalist */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                        Resume <span className="text-blue-600">Studio</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm">
                        Analyze your existing resume or create a high-impact one from scratch with AI.
                    </p>
                </div>

                {/* Mode Toggles */}
                <div className="flex justify-center mb-10">
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                        <button
                            onClick={() => setMode("analyze")}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "analyze" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Analyze Existing
                        </button>
                        <button
                            onClick={() => setMode("create")}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "create" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Create New
                        </button>
                    </div>
                </div>

                {/* ANALYZE MODE */}
                {mode === "analyze" && (
                    <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Left: Upload */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                        <BsCloudUpload className="text-blue-500" /> Upload Resume
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {!resumeImage ? (
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="border-2 border-dashed border-slate-200 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
                                        >
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <BsFileEarmarkPdf size={24} />
                                            </div>
                                            <p className="text-slate-700 font-medium">Drop PDF or Image</p>
                                            <p className="text-slate-400 text-xs mt-1">Click to browse</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                                            <img src={resumeImage} alt="Preview" className="w-full h-auto object-cover max-h-[400px]" />
                                            <button
                                                onClick={() => { setResumeImage(null); setAnalysis(null); }}
                                                className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                                            >
                                                <BsX size={20} />
                                            </button>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,image/*" />
                                </div>
                            </div>

                            <button
                                onClick={analyzeResume}
                                disabled={loading || !resumeImage}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                {loading ? (
                                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> {status}</>
                                ) : (
                                    <><BsLightningCharge /> Analyze Now</>
                                )}
                            </button>
                        </div>

                        {/* Right: Results */}
                        <div className="lg:col-span-7">
                            {!analysis ? (
                                <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
                                    <BsImage size={48} className="mb-3 opacity-20" />
                                    <p className="text-sm">Analysis results will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Score</h2>
                                            <p className="text-slate-500 text-sm mt-1">ATS Compatibility</p>
                                        </div>
                                        <span className={`text-3xl font-bold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {analysis.score}/100
                                        </span>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BsListCheck className="text-blue-500" /> Improvements</h3>
                                        <div className="space-y-4">
                                            {analysis.bulletPointFixes.map((fix, i) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="text-red-500 text-xs font-bold uppercase mb-1">Weak</div>
                                                    <p className="text-slate-500 text-sm mb-3 line-through">{fix.original}</p>
                                                    <div className="text-green-600 text-xs font-bold uppercase mb-1">Better</div>
                                                    <p className="text-slate-900 text-sm font-medium">{fix.improved}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CREATE MODE */}
                {mode === "create" && (
                    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Form */}
                        <div className="lg:col-span-5 space-y-5">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <BsPencilSquare className="text-blue-500" /> Enter Your Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="fullName"
                                            placeholder="Full Name"
                                            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            onChange={handleBuilderChange}
                                        />
                                        <input
                                            name="phone"
                                            placeholder="Phone"
                                            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            onChange={handleBuilderChange}
                                        />
                                    </div>
                                    <input
                                        name="email"
                                        placeholder="Email Address"
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={handleBuilderChange}
                                    />
                                    <textarea
                                        name="summary"
                                        placeholder="Professional Summary (Briefly describe yourself)"
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        onChange={handleBuilderChange}
                                    />
                                    <textarea
                                        name="skills"
                                        placeholder="Skills (Comma separated: React, Node.js, Design...)"
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        onChange={handleBuilderChange}
                                    />
                                    <textarea
                                        name="experience"
                                        placeholder="Experience (Job Title at Company: details...)"
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                        onChange={handleBuilderChange}
                                    />
                                    <textarea
                                        name="education"
                                        placeholder="Education (Degree, University, Year)"
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        onChange={handleBuilderChange}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={generateResume}
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                {loading ? (
                                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Generating...</>
                                ) : (
                                    <><BsMagic /> Generate AI Resume</>
                                )}
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="lg:col-span-7">
                            {!generatedResume ? (
                                <div className="h-full min-h-[600px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/30">
                                    <BsFileEarmarkPdf size={48} className="mb-3 opacity-20" />
                                    <p className="text-sm">Your AI-generated resume will appear here.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800">Preview</h3>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(generatedResume)}
                                            className="text-blue-600 text-xs font-bold hover:underline"
                                        >
                                            Copy Markdown
                                        </button>
                                    </div>
                                    <div className="p-8 overflow-y-auto max-h-[700px] prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                                            {generatedResume}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
