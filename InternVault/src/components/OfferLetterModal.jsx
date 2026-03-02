import { useState, useEffect } from "react";
import { BsX, BsDownload, BsUpload, BsEye, BsSend, BsExclamationTriangle } from "react-icons/bs";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

// Helper function to capitalize words
const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

// Helper function to detect image format from base64
const getImageFormat = (dataUrl) => {
    if (!dataUrl) return 'PNG';
    const match = dataUrl.match(/^data:image\/(\w+);base64,/);
    if (match) {
        const format = match[1].toUpperCase();
        return format === 'JPG' ? 'JPEG' : format;
    }
    return 'PNG';
};

export function OfferLetterModal({
    isOpen,
    onClose,
    applicant,
    internship,
    internshipId,
    tpoOrg,
    submissionId,
    mode = "tpo" // Default to TPO, can be "recruiter"
}) {
    // Form state
    const [formData, setFormData] = useState({
        instituteName: mode === "recruiter" ? (internship?.tpoId?.organization || "Company Name") : (tpoOrg || internship?.tpoId?.organization || ""),
        supervisorName: "",
        supervisorDesignation: "",
        supervisorContact: "",
        projectTitle: internship?.title || "",
        departmentName: "",
        instituteAddress: "",
        institutePIN: "",
        ugcApproval: "",
        aicteApproval: "",
        naacAccreditation: "",
        startDate: "",
        endDate: "",
        stipend: internship?.stipend || "",
        accommodation: "No",
        internshipType: "Internship Offer",
        mode: "Onsite",
        // Recruiter specific fields
        refNo: "REF: " + (mode === "recruiter" ? "CORP/" : "TPO/") + Math.random().toString(36).substring(2, 9).toUpperCase(),
        hrContact: "",
        registeredOffice: mode === "recruiter" ? "Registered Office: Nirmal Building, 9th Floor, Nariman Point, Mumbai 400 021" : "",
        companyWebsite: "www.company.com",
        hrEmail: "",
    });

    // File state
    const [files, setFiles] = useState({
        logo: null,
        principalSignature: null,
        vicePrincipalSignature: null,
        supervisorSignature: null,
        hrSignature: null, // New for recruiter
    });

    const [isSending, setIsSending] = useState(false);

    // Load saved data for this internship from localStorage
    useEffect(() => {
        if (internshipId && isOpen) {
            console.log("OfferLetterModal: Syncing data for internship", internshipId);
            console.log("Current TPO Org (from User):", tpoOrg);
            console.log("Current Internship Prop:", internship);

            const savedData = localStorage.getItem(`offerLetterData_${internshipId}`);
            const profileOrg = tpoOrg || internship?.tpoId?.organization;

            if (savedData) {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({
                    ...prev,
                    ...parsed.formData,
                    // PRIORITY: Use the latest organization name from the profile (prop) 
                    // if it exists, otherwise fallback to saved data.
                    instituteName: profileOrg || parsed.formData?.instituteName || prev.instituteName
                }));
                setFiles(prev => ({ ...prev, ...parsed.files }));
            } else if (profileOrg) {
                // If no saved data, use current prop organization
                setFormData(prev => ({
                    ...prev,
                    instituteName: profileOrg
                }));
            }
        }
    }, [internshipId, isOpen, tpoOrg, internship?.tpoId?.organization]);

    // Save data to localStorage when form changes
    const saveToLocalStorage = (newFormData, newFiles) => {
        if (internshipId) {
            localStorage.setItem(`offerLetterData_${internshipId}`, JSON.stringify({
                formData: newFormData,
                files: newFiles
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        saveToLocalStorage(newFormData, files);
    };

    const handleFileChange = async (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        const loadingToast = toast.loading(`Processing ${fileType}...`);
        try {
            // Convert to PNG via canvas to ensure jsPDF compatibility (Fixes AVIF/WEBP errors)
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            // Export as PNG which is universally supported by jsPDF
                            resolve(canvas.toDataURL('image/png'));
                        } catch (err) {
                            reject(new Error("Failed to process image on canvas"));
                        }
                    };
                    img.onerror = () => reject(new Error("Browser cannot render this image format. Try a different image."));
                    img.src = event.target.result;
                };
                reader.onerror = () => reject(new Error("Failed to read file"));
                reader.readAsDataURL(file);
            });

            const newFiles = { ...files, [fileType]: dataUrl };
            setFiles(newFiles);
            saveToLocalStorage(formData, newFiles);
            toast.success(`${fileType} uploaded and optimized`);
        } catch (error) {
            console.error("Image processing error:", error);
            toast.error(error.message || "Failed to process image");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const createPDFDoc = () => {
        if (!applicant || !internship) {
            toast.error("Missing applicant or internship data");
            return null;
        }

        // Validate required fields based on mode
        const requiredFields = mode === "recruiter"
            ? ['instituteName', 'registeredOffice']
            : ['supervisorName', 'departmentName', 'instituteAddress'];

        const missingFields = requiredFields.filter(f => !formData[f]);
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return null;
        }

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const footerY = pageHeight - 35;

            if (mode === "recruiter") {
                // --- CORPORATE (TCS STYLE) LAYOUT ---

                const addHeaderAndWatermark = () => {
                    // Add watermark
                    if (files.logo) {
                        doc.saveGraphicsState();
                        doc.setGState(new doc.GState({ opacity: 0.05 }));
                        doc.addImage(files.logo, getImageFormat(files.logo), pageWidth / 2 - 35, pageHeight / 2 - 35, 70, 70);
                        doc.restoreGraphicsState();
                    }

                    // Header - Logo (Centered)
                    if (files.logo) {
                        doc.addImage(files.logo, getImageFormat(files.logo), pageWidth / 2 - 15, 8, 30, 30);
                    }
                };

                const addFooter = () => {
                    // Footer Section
                    doc.setFontSize(14);
                    doc.setTextColor(0, 0, 255); // Blue color for company name
                    doc.setFont("helvetica", "bold");
                    doc.text(formData.instituteName.toUpperCase(), pageWidth / 2, footerY - 10, { align: 'center' });

                    doc.setFontSize(8);
                    doc.setTextColor(60, 60, 60);
                    doc.setFont("helvetica", "normal");
                    doc.text(formData.registeredOffice || "", pageWidth / 2, footerY, { align: 'center' });
                    doc.text(`Website: ${formData.companyWebsite}`, pageWidth / 2, footerY + 5, { align: 'center' });
                };

                addHeaderAndWatermark();

                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("Internship Offer Letter", pageWidth / 2, 52, { align: 'center' });

                doc.setFontSize(10.5);
                doc.setFont("helvetica", "bold");
                doc.text(`Ref: ${formData.refNo}`, 20, 68);
                doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`, 20, 74);

                // Candidate Info
                doc.setFontSize(10.5);
                doc.setFont("helvetica", "bold");
                const candidateName = toTitleCase(applicant.name);
                doc.text(candidateName, 20, 88);
                doc.text(toTitleCase(applicant.college || "University"), 20, 93);
                doc.text(applicant.email, 20, 98);

                doc.setFont("helvetica", "normal");
                doc.text(`Dear ${candidateName.split(' ')[0]},`, 20, 110);

                doc.setFont("helvetica", "bold");
                doc.text("Sub: Internship Offer", 20, 118);

                doc.setFont("helvetica", "normal");
                const intro = `We are pleased to offer you internship in ${formData.instituteName} with the following terms and conditions:`;
                doc.text(intro, 20, 126);

                // Standard Corporate Terms
                const terms = [
                    `1. The tentative start date is ${formData.startDate || "TBD"} and end date is ${formData.endDate || "TBD"}.`,
                    `2. You will be assigned a Mentor/Manager under whose supervision you will work on the project assigned to you.`,
                    `3. You shall complete your project in accordance with the requirements and guidance of the company, and maintain qualitative standards as required. You will maintain the discipline, dignity, honor and goodwill of ${formData.instituteName}.`,
                    `4. The arrangement is not that of an employer and an employee and as such you shall not be eligible to any allowances or other benefits available to employees.`,
                    `5. You will observe the rules & regulations of ${formData.instituteName}, and maintain complete confidentiality of the matters pertaining to the company and/or any data provided to you.`,
                    `6. On completion of your internship you will be required to submit a copy of your project report, which will be the sole property of ${formData.instituteName}.`,
                    `7. You shall not undertake any internship in parallel with this internship.`,
                    `8. In the event of misconduct or breach of terms, ${formData.instituteName} reserves the right to terminate internship without notice.`,
                    `9. This offer of Internship will be governed as per the Laws of India.`
                ];

                let termY = 136;
                doc.setFontSize(9.5);
                const sigSectionHeight = 35;

                terms.forEach((term, index) => {
                    const splitTerm = doc.splitTextToSize(term, pageWidth - 40);
                    const termHeight = (splitTerm.length * 4.5) + 1;

                    // Emergency page break (shouldn't happen with these settings)
                    if (termY + termHeight > footerY - sigSectionHeight - 5) {
                        addFooter();
                        doc.addPage();
                        addHeaderAndWatermark();
                        termY = 55;
                    }

                    doc.text(splitTerm, 20, termY);
                    termY += termHeight;
                });

                // Positioning Signature always after terms or at bottom
                let sigY = Math.max(termY + 10, footerY - 38);

                // Final single page safety
                if (sigY + 22 > footerY) {
                    sigY = footerY - 26;
                }

                if (files.hrSignature) {
                    doc.addImage(files.hrSignature, getImageFormat(files.hrSignature), 20, sigY, 28, 12);
                }
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0, 0, 0);
                doc.text("HR / Hiring Manager", 20, sigY + 16);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                if (formData.hrContact) doc.text(`Contact: ${formData.hrContact}`, 20, sigY + 21);
                if (formData.hrEmail) doc.text(`Email: ${formData.hrEmail}`, 20, sigY + 25);

                addFooter();

            } else {
                // --- EXISTING TPO LAYOUT ---
                // Add watermark (college logo with transparency)
                if (files.logo) {
                    doc.saveGraphicsState();
                    doc.setGState(new doc.GState({ opacity: 0.08 }));
                    doc.addImage(files.logo, getImageFormat(files.logo), pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
                    doc.restoreGraphicsState();
                }

                // Header - Institute Logo (top left)
                if (files.logo) {
                    doc.addImage(files.logo, getImageFormat(files.logo), 15, 8, 30, 30);
                }

                // Header - Institute Details
                doc.setFontSize(16);
                doc.setFont(undefined, 'bold');
                doc.text(toTitleCase(formData.instituteName) || "Institute Name", pageWidth / 2, 15, { align: 'center' });

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(toTitleCase(formData.departmentName), pageWidth / 2, 22, { align: 'center' });
                doc.text(`${toTitleCase(formData.instituteAddress)}, PIN: ${formData.institutePIN}`, pageWidth / 2, 28, { align: 'center' });

                // Accreditation Header
                const accreditations = [
                    formData.aicteApproval ? `AICTE: ${formData.aicteApproval}` : null,
                    formData.ugcApproval ? `UGC: ${formData.ugcApproval}` : null,
                    formData.naacAccreditation ? `NAAC: ${formData.naacAccreditation}` : null
                ].filter(Boolean).join(" | ");

                if (accreditations) {
                    doc.setFontSize(8);
                    doc.setFont(undefined, 'italic');
                    doc.text(accreditations, pageWidth / 2, 34, { align: 'center' });
                }

                // Horizontal line
                doc.setLineWidth(0.5);
                doc.line(15, 42, pageWidth - 15, 42);

                // Date
                const currentY = 52;
                doc.setFontSize(10);
                doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 15, currentY);

                // To section
                doc.text("To,", 15, currentY + 10);
                doc.text(toTitleCase(applicant.name) || "Student Name", 15, currentY + 15);
                doc.text(`${applicant.rollNo ? `Roll No.: ${applicant.rollNo}` : `Email ID: ${applicant.email}`}`, 15, currentY + 20);
                doc.text(`${toTitleCase(applicant.college) || "College Name"}`, 15, currentY + 25);
                doc.text(`${toTitleCase(applicant.location) || ""}`, 15, currentY + 30);

                // Subject
                doc.setFont(undefined, 'bold');
                doc.text(`Subject: Offer of ${formData.internshipType || "Internship"} ${new Date().getFullYear()}`, 15, currentY + 40);

                // Body
                doc.setFont(undefined, 'normal');
                doc.text(`Dear ${toTitleCase(applicant.name?.split(' ')[0]) || "Student"},`, 15, currentY + 50);

                const bodyText = `We are pleased to offer you a ${formData.internshipType || "Internship"} in the ${toTitleCase(formData.departmentName)} at ${toTitleCase(internship?.tpoId?.organization) || "our institute"} under the supervision of ${toTitleCase(formData.supervisorDesignation)} ${toTitleCase(formData.supervisorName)} for the project titled "${toTitleCase(formData.projectTitle)}".`;
                const splitBody = doc.splitTextToSize(bodyText, pageWidth - 30);
                doc.text(splitBody, 15, currentY + 60);

                // Internship Details
                let yPos = currentY + 60 + (splitBody.length * 5) + 5;
                doc.setFont(undefined, 'bold');
                doc.text("Internship Details:", 15, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 5;
                doc.text(`• Duration: ${formData.startDate} to ${formData.endDate}`, 20, yPos);
                yPos += 5;
                doc.text(`• Project Area: ${toTitleCase(formData.projectTitle)}`, 20, yPos);

                // Research Focus (Conditional for MTech)
                if (applicant.researchInterests && applicant.researchInterests.length > 0) {
                    yPos += 5;
                    const researchText = `• Research Focus: ${applicant.researchInterests.join(', ')}`;
                    const splitResearch = doc.splitTextToSize(researchText, pageWidth - 40);
                    doc.text(splitResearch, 20, yPos);
                    yPos += (splitResearch.length - 1) * 5;
                }

                yPos += 5;
                doc.text(`• Stipend: Rs. ${formData.stipend?.toLocaleString()} per month`, 20, yPos);
                yPos += 5;
                doc.text(`• Accommodation: ${formData.accommodation}`, 20, yPos);
                yPos += 5;
                doc.text(`• Lab Access: Full access to departmental facilities`, 20, yPos);
                yPos += 5;
                doc.text(`• Certificate: Completion certificate with project report evaluation`, 20, yPos);

                // Terms & Conditions
                yPos += 8;
                doc.setFont(undefined, 'bold');
                doc.text("Terms & Conditions:", 15, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 5;

                // CONDITIONAL T&C
                if (formData.mode === "Remote") {
                    doc.text("1. Full-time commitment required (Flexible Hours)", 20, yPos);
                } else {
                    doc.text("1. Full-time commitment required (9 AM - 6 PM, Monday-Friday)", 20, yPos);
                }
                yPos += 5;
                doc.text("2. Submit weekly progress reports to supervisor", 20, yPos);
                yPos += 5;
                doc.text("3. Adhere to institute safety and conduct policies", 20, yPos);
                yPos += 5;
                doc.text("4. Complete formal project report by end date", 20, yPos);

                // Closing
                yPos += 10;
                doc.text("We look forward to your contribution to our research group.", 15, yPos);

                // Sincerely
                yPos += 10;
                doc.text("Sincerely,", 15, yPos);

                // Supervisor Signature Block
                const supervisorY = yPos + 5;

                if (files.supervisorSignature) {
                    // Image height strict 15
                    doc.addImage(files.supervisorSignature, getImageFormat(files.supervisorSignature), 15, supervisorY, 30, 15);
                }
                // Text starts after image space
                const supervisorTextY = supervisorY + 18;

                doc.setFont(undefined, 'bold');
                doc.text(toTitleCase(formData.supervisorName), 15, supervisorTextY);
                doc.setFont(undefined, 'normal');
                doc.text(toTitleCase(formData.supervisorDesignation), 15, supervisorTextY + 5);
                doc.text(`Contact: ${formData.supervisorContact}`, 15, supervisorTextY + 10);


                // Principal & Vice Principal Signatures (Footer)
                // Principal
                if (files.principalSignature) {
                    doc.addImage(files.principalSignature, getImageFormat(files.principalSignature), 15, footerY, 30, 15);
                }
                doc.setFont(undefined, 'bold');
                doc.text("Principal", 15, footerY + 20);

                // Vice Principal
                if (files.vicePrincipalSignature) {
                    doc.addImage(files.vicePrincipalSignature, getImageFormat(files.vicePrincipalSignature), pageWidth - 45, footerY, 30, 15);
                }
                doc.setFont(undefined, 'bold');
                doc.text("Vice Principal", pageWidth - 45, footerY + 20);
            }

            return doc;
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
            return null;
        }
    }

    const handlePreview = () => {
        const doc = createPDFDoc();
        if (doc) {
            window.open(doc.output('bloburl'), '_blank');
        }
    };

    const handleSend = async () => {
        const doc = createPDFDoc();
        if (!doc) return;

        setIsSending(true);
        const loadingToast = toast.loading("Sending offer letter...");

        try {
            const pdfBlob = doc.output('blob');
            const formDataPayload = new FormData();
            formDataPayload.append('offerLetter', pdfBlob, `Offer_Letter_${applicant.name?.replace(/\s+/g, '_')}.pdf`);
            formDataPayload.append('internshipId', internshipId);

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            // Select endpoint based on mode and presence of submissionId
            let endpoint = `${API_URL}/tpo/applicants/${applicant._id}/send-offer`;
            if (mode === "recruiter" && submissionId) {
                endpoint = `${API_URL}/recruiter/submissions/${submissionId}/send-offer`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formDataPayload
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Server error response:", errorData);
                throw new Error(errorData || `Failed to send offer letter: ${response.status}`);
            }

            toast.success("Offer Letter Sent Successfully!");
            onClose();
        } catch (error) {
            console.error("Error sending offer:", error);
            toast.error(error.message || "Failed to send offer letter");
        } finally {
            toast.dismiss(loadingToast);
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Generate Offer Letter</h2>
                        <p className="text-sm text-gray-600 mt-1">For: {applicant?.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                        <BsX size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Corporate specific info banner */}
                        {mode === "recruiter" && (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                                    <BsExclamationTriangle size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-amber-900">Corporate Offer Template</p>
                                    <p className="text-amber-700">This will generate a professional company offer letter with standardized legal clauses.</p>
                                </div>
                            </div>
                        )}

                        {/* Configuration Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                                {mode === "recruiter" ? "Company & Reference Details" : "Internship Configuration"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Internship Title/Type</label>
                                    <input
                                        type="text"
                                        name="internshipType"
                                        value={formData.internshipType}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={mode === "recruiter" ? "e.g. Internship Offer" : "e.g. Summer Research Internship"}
                                    />
                                    {mode !== "recruiter" && <p className="text-xs text-gray-500 mt-1">Appears in Subject and Body</p>}
                                </div>
                                {mode === "recruiter" ? (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Reference Number</label>
                                        <input
                                            type="text"
                                            name="refNo"
                                            value={formData.refNo}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="TCSL/AIP/2021-22/..."
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Internship Mode</label>
                                        <select
                                            name="mode"
                                            value={formData.mode}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="Onsite">Onsite (9 AM - 6 PM)</option>
                                            <option value="Remote">Remote (Flexible Hours)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Adjusts Terms & Conditions</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Institute/Company Details */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                {mode === "recruiter" ? "Company Branding" : "Institute Details"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            {mode === "recruiter" ? "Company Legal Name *" : "Institute Name *"}
                                        </label>
                                        {mode !== "recruiter" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFormData = { ...formData, instituteName: tpoOrg || internship?.tpoId?.organization || "" };
                                                    setFormData(newFormData);
                                                    saveToLocalStorage(newFormData, files);
                                                    toast.success("Synced with dashboard name");
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                            >
                                                <BsSend size={10} className="rotate-[-45deg]" /> Sync with Profile
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        name="instituteName"
                                        value={formData.instituteName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                        placeholder={mode === "recruiter" ? "e.g. Tata Consultancy Services Limited" : "e.g., BVC Engineering College"}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This will appear as the main heading in the PDF</p>
                                </div>

                                {mode === "recruiter" ? (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Registered Office Address (Footer)</label>
                                            <textarea
                                                name="registeredOffice"
                                                value={formData.registeredOffice}
                                                onChange={handleInputChange}
                                                rows="2"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Full registered address for footer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Website</label>
                                            <input
                                                type="text"
                                                name="companyWebsite"
                                                value={formData.companyWebsite}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="www.tcs.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">HR Contact Phone</label>
                                            <input
                                                type="text"
                                                name="hrContact"
                                                value={formData.hrContact}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="+91-..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">HR Email</label>
                                            <input
                                                type="email"
                                                name="hrEmail"
                                                value={formData.hrEmail}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="hr@company.com"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Department Name *</label>
                                            <input
                                                type="text"
                                                name="departmentName"
                                                value={formData.departmentName}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="e.g., Computer Science & Engineering"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Institute Address *</label>
                                            <input
                                                type="text"
                                                name="instituteAddress"
                                                value={formData.instituteAddress}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Full address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="institutePIN"
                                                value={formData.institutePIN}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="6-digit PIN"
                                            />
                                        </div>

                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Accreditations & Approvals (Optional)</label>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">AICTE Approval</label>
                                                <input
                                                    type="text"
                                                    name="aicteApproval"
                                                    value={formData.aicteApproval}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="e.g. Approved"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">UGC Approval</label>
                                                <input
                                                    type="text"
                                                    name="ugcApproval"
                                                    value={formData.ugcApproval}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="e.g. Listed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">NAAC Grade</label>
                                                <input
                                                    type="text"
                                                    name="naacAccreditation"
                                                    value={formData.naacAccreditation}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="e.g. A++"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Supervisor Details */}
                        {mode !== "recruiter" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Supervisor Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Supervisor Name *</label>
                                        <input
                                            type="text"
                                            name="supervisorName"
                                            value={formData.supervisorName}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Dr. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Designation *</label>
                                        <input
                                            type="text"
                                            name="supervisorDesignation"
                                            value={formData.supervisorDesignation}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Professor / Associate Professor"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact (Email | Phone) *</label>
                                        <input
                                            type="text"
                                            name="supervisorContact"
                                            value={formData.supervisorContact}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="email@example.com | +91-1234567890"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Project Details */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Project Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
                                    <input
                                        type="text"
                                        name="projectTitle"
                                        value={formData.projectTitle}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stipend (Rs./month)</label>
                                    <input
                                        type="number"
                                        name="stipend"
                                        value={formData.stipend}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Accommodation</label>
                                    <select
                                        name="accommodation"
                                        value={formData.accommodation}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Yes">Yes - Provided</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Upload Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'logo', label: mode === "recruiter" ? "Company Logo" : 'Institute Logo' },
                                    ...(mode === "recruiter" ? [
                                        { key: 'hrSignature', label: 'HR / Manager Signature' }
                                    ] : [
                                        { key: 'principalSignature', label: 'Principal Signature' },
                                        { key: 'vicePrincipalSignature', label: 'Vice Principal Signature' },
                                        { key: 'supervisorSignature', label: 'Supervisor Signature' }
                                    ]),
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, key)}
                                                className="hidden"
                                                id={`file-${key}`}
                                            />
                                            <label
                                                htmlFor={`file-${key}`}
                                                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                                            >
                                                <BsUpload />
                                                <span className="text-sm">{files[key] ? '✓ Uploaded' : 'Choose File'}</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePreview}
                        className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-semibold flex items-center gap-2 shadow-sm"
                        disabled={isSending}
                    >
                        <BsEye /> Preview PDF
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? 'Sending...' : <><BsSend /> Send Offer Letter</>}
                    </button>
                </div>
            </div >
        </div >
    );
}
