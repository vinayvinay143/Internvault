import { BsExclamationTriangle, BsX } from "react-icons/bs";

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {isDangerous && (
                                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                    <BsExclamationTriangle size={20} />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <BsX size={24} />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex items-center gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-5 py-2.5 text-white font-medium rounded-xl shadow-lg shadow-gray-200 transition-all transform active:scale-95 ${isDangerous
                                ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
