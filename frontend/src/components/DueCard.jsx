import { Calendar, Phone, CheckCircle2, MessageCircle, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const DueCard = ({ due, onUpdateStatus }) => {

    const handleWhatsApp = (e) => {
        e.preventDefault();
        const text = `Hello ${due.name}, this is a reminder for your pending due of ₹${due.amount} for ${due.item} from Sandhya Paridhan. Please clear it at the earliest.`;
        const url = `https://wa.me/${due.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <Link to={`/dashboard/dues/${due._id}`} className="block card p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
            {/* Status indicator line */}
            <div className={clsx(
                "absolute left-0 top-0 bottom-0 w-1.5",
                due.status === 'paid' ? "bg-green-500" : "bg-primary"
            )} />

            <div className="flex justify-between items-start pl-2">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-1">{due.name}</h3>
                        <span className="font-bold text-lg text-foreground">₹{due.amount}</span>
                    </div>

                    <p className="text-foreground/70 text-sm mb-3 line-clamp-1">{due.item}</p>

                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(new Date(due.dueDate), 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{due.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                {due.imageUrl && (
                    <div className="ml-4 w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                        <img src={due.imageUrl} alt="Bill/Item" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between pl-2">
                <span className={clsx(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border",
                    due.status === 'paid'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                )}>
                    {due.status}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleWhatsApp}
                        className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
                        title="Remind on WhatsApp"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>

                    {due.status === 'pending' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onUpdateStatus(due._id, 'paid');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-foreground/5 hover:bg-green-500 hover:text-white rounded-xl text-xs font-semibold transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Paid
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default DueCard;
