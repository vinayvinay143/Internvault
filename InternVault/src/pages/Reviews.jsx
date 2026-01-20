import { useState, useEffect } from "react";
import { BsStarFill, BsBuilding, BsPlusLg, BsPersonCircle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function Reviews() {
    const [showForm, setShowForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [newReview, setNewReview] = useState({
        company: "",
        role: "",
        rating: 5,
        stipend: "",
        review: ""
    });

    // Check auth and fetch reviews on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must be logged in to post a review!");
            return;
        }

        try {
            const payload = {
                ...newReview,
                userId: user._id,
                username: user.username
            };

            const res = await axios.post(`${API_URL}/reviews`, payload);
            setReviews([res.data, ...reviews]); // Add new review to top
            setShowForm(false);
            setNewReview({ company: "", role: "", rating: 5, stipend: "", review: "" }); // Reset form
        } catch (err) {
            console.error("Failed to post review", err);
            toast.error("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Company <span className="text-yellow-500">Reviews</span></h1>
                        <p className="text-gray-500">Anonymous experiences from real interns.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (!user) return toast.error("Please Login to add a review.");
                            setShowForm(!showForm)
                        }}
                        className="bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
                    >
                        <BsPlusLg /> Add Review
                    </button>
                </div>

                {/* Add Review Form Overlay */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-bold mb-6">Rate your Internship</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input required placeholder="Company Name" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={newReview.company} onChange={e => setNewReview({ ...newReview, company: e.target.value })} />
                                <input required placeholder="Role (e.g. SDE Intern)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={newReview.role} onChange={e => setNewReview({ ...newReview, role: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="number" max="5" min="1" placeholder="Rating (1-5)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: e.target.value })} />
                                    <input required placeholder="Stipend (e.g. 20k/mo)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={newReview.stipend} onChange={e => setNewReview({ ...newReview, stipend: e.target.value })} />
                                </div>
                                <textarea required placeholder="Share your experience..." className="w-full p-3 bg-gray-50 rounded-xl h-24 border border-gray-200" value={newReview.review} onChange={e => setNewReview({ ...newReview, review: e.target.value })} />

                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400">Post Review</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {reviews.length === 0 && (
                            <div className="col-span-2 text-center py-12 text-gray-400">
                                <BsBuilding size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No reviews yet. Be the first to add one!</p>
                            </div>
                        )}

                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl text-gray-500">
                                            <BsBuilding />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{review.company}</h3>
                                            <p className="text-sm text-gray-500">{review.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                        <span className="font-bold text-yellow-700">{review.rating}</span>
                                        <BsStarFill className="text-yellow-500 text-xs" />
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4 leading-relaxed">"{review.review}"</p>

                                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400 pt-4 border-t border-gray-100">
                                    <span className="flex items-center gap-1"><BsPersonCircle /> {review.username || "Anonymous"}</span>
                                    <span>💰 {review.stipend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
