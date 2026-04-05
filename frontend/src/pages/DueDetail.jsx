import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Phone, Calendar, IndianRupee, FileText, Image as ImageIcon, CheckCircle2, MessageCircle } from 'lucide-react';
import api from '../lib/api';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const DueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [due, setDue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDue();
    }, [id]);

    const fetchDue = async () => {
        try {
            const res = await api.get(`/dues/${id}`);
            setDue(res.data.data);
        } catch (error) {
            console.error('Failed to fetch due', error);
            navigate('/dashboard/dues');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (!due) return;
        const text = `Hello ${due.name}, this is a reminder for your pending due of ₹${due.amount} for ${due.item} from the shop. Please clear it at the earliest.`;
        const url = `https://wa.me/${due.phoneNumber.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleMarkPaid = async () => {
        if (!window.confirm("Mark this due as paid?")) return;
        try {
            const formData = new FormData();
            formData.append('status', 'paid');
            await api.put(`/dues/${id}`, formData);
            fetchDue();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    if (isLoading) {
        return <div className="flex h-[80vh] items-center justify-center text-foreground/50">Loading details...</div>;
    }

    if (!due) return null;

    return (
        <div className="p-4 sm:p-6 pb-24">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard/dues')} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        Due Details
                    </h2>
                </div>
                <Link to={`/dashboard/dues/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                </Link>
            </div>

            <div className="space-y-4">
                {/* Header Card */}
                <div className="card p-5 relative overflow-hidden">
                    <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-1.5",
                        due.status === 'paid' ? "bg-green-500" : "bg-primary"
                    )} />
                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{due.name}</h1>
                            <p className="text-foreground/70 font-medium mt-1">{due.item || 'No Item Specified'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-primary">₹{due.amount}</span>
                            <div className="mt-2">
                                <span className={clsx(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border inline-block",
                                    due.status === 'paid' 
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                        : 'bg-primary/10 text-primary border-primary/20'
                                )}>
                                    {due.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 pl-2">
                        <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors font-semibold text-sm">
                            <MessageCircle className="w-4 h-4" /> WhatsApp Message
                        </button>
                        {due.status === 'pending' && (
                            <button onClick={handleMarkPaid} className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-green-500 hover:text-white rounded-xl font-semibold text-sm transition-all focus:ring-2 ring-green-500/50">
                                <CheckCircle2 className="w-4 h-4" /> Mark as Paid
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="card p-4 space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone Number</p>
                            <p className="text-foreground font-medium">{due.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Due Date</p>
                            <p className="text-foreground font-medium">{format(new Date(due.dueDate), 'do MMMM, yyyy')}</p>
                        </div>
                        {due.expectedReturnDate && (
                            <div>
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Expected Return</p>
                                <p className="text-foreground font-medium">{format(new Date(due.expectedReturnDate), 'do MMMM, yyyy')}</p>
                            </div>
                        )}
                        {due.billNumber && (
                            <div>
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><FileText className="w-3 h-3"/> Bill Number</p>
                                <p className="text-foreground font-medium">#{due.billNumber}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {due.imageUrl ? (
                            <div className="card p-2 overflow-hidden bg-card/50">
                                <a href={due.imageUrl} target="_blank" rel="noreferrer" className="block w-full h-48 rounded-xl overflow-hidden relative group">
                                    <img src={due.imageUrl} alt="Bill or Item" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm">View Full Screen</span>
                                    </div>
                                </a>
                            </div>
                        ) : (
                            <div className="card p-8 border-dashed border-border/50 flex flex-col items-center justify-center text-foreground/40 bg-card/30 h-48">
                                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                <p className="text-sm font-medium">No photo attached</p>
                            </div>
                        )}

                        {due.remark && (
                            <div className="card p-4">
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Remarks / Notes</p>
                                <p className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">{due.remark}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DueDetail;
