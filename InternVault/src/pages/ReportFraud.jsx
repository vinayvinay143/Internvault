import React from 'react';
import { BsShieldExclamation, BsBuilding, BsFileEarmarkText, BsTelephone, BsGlobe, BsCheckCircleFill, BsArrowRight } from "react-icons/bs";
import { AIComplaintGenerator } from '../components/AIComplaintGenerator';

export function ReportFraud() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                        Report Fake Internships
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        If you've encountered a fake internship or scam, here is how you can file a formal complaint with the authorities.
                    </p>
                </div>

                {/* Option 1: MCA / RoC */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    <div className="bg-blue-600 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BsBuilding className="text-2xl" /> Option 1: Complain to MCA / RoC (General Case)
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm">Use this for scams found on WhatsApp, LinkedIn, or other portals.</p>
                    </div>
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">STEP 1</span>
                                Visit the MCA Portal
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Go to the National Government Services link <a href="https://services.india.gov.in/service/detail/register-your-complaint-with-ministry-of-corporate-affairs-1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Register your complaint with Ministry of Corporate Affairs</a>.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                                <strong>Navigation:</strong> <a href="https://services.india.gov.in/service/ministry_services?cmd_id=670&ln=en" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">MCA Services</a> → Complaints → Create Investor Complaint
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">STEP 2</span>
                                Fill the Investor Complaint Form
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                                <li><strong>Company Details:</strong> Name, CIN, Registered Office (use MCA search).</li>
                                <li><strong>Your Details:</strong> Name, Email, City.</li>
                                <li><strong>Description:</strong> Clearly describe the issue (fee demands, false promises, no payment).</li>
                            </ul>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <BsCheckCircleFill className="text-blue-600 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                                <strong>Tip:</strong> After submitting, you will get a <strong>Service Request Number (SRN)</strong> to track your complaint status.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Option 2: PM Internship Scheme */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                    <div className="bg-emerald-600 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BsGlobe className="text-2xl" /> Option 2: PM Internship Scheme Portal
                        </h2>
                        <p className="text-emerald-100 mt-1 text-sm">For internships listed specifically on pminternship.mca.gov.in</p>
                    </div>
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Online Method</h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Use the dedicated grievance redressal mechanism on the <a href="https://pminternship.mca.gov.in/login" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-800 font-medium">PM Internship Portal</a>.
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                    <strong>Path:</strong> Home → Support → Raise Request
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    <a href="https://www.myscheme.gov.in/schemes/pmis" target="_blank" rel="noopener noreferrer" className="text-gray-500 underline hover:text-emerald-600">View Scheme Info</a>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Helpline Method</h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Call the scheme helpline for guidance on reporting misuse.
                                </p>
                                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-100 font-bold flex items-center gap-2">
                                    <BsTelephone /> 1800-116-090
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Required Evidence */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                    <div className="bg-gray-800 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BsFileEarmarkText className="text-2xl" /> Evidence Checklist
                        </h2>
                        <p className="text-gray-300 mt-1 text-sm">Gather these documents before filing your complaint.</p>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Documents Needed</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Screenshots of WhatsApp/Telegram/Email chats",
                                        "Copy of the Job Description (JD)",
                                        "Offer Letter / Joining Letter / NDA",
                                        "Fake 'Certificates' used to lure students"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <BsArrowRight className="text-blue-500 mt-1 flex-shrink-0" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Payment Proofs</h3>
                                <ul className="space-y-3">
                                    {[
                                        "UPI/Bank Transfer Screenshots",
                                        "Payment Receipts / Confirmations",
                                        "Invoices from company",
                                        "Refusal of Refund (Chats/Emails)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <BsArrowRight className="text-red-500 mt-1 flex-shrink-0" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 italic">
                                * Ideally, attach your ID proof as many investor-complaint explainers recommend adding identity proof.
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Generator Tool */}
                <AIComplaintGenerator />
            </div>
        </div>
    );
}
