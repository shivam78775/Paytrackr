import { Calendar, Phone, CheckCircle2, MessageCircle, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const StitchingCard = ({ record, onUpdateStatus }) => {

    const handleWhatsApp = (e) => {
        e.preventDefault();
        const text = `Hello ${record.customerName}, your  ${record.clothType} has been stitched. You can now pick it up from the Sandhya Paridhan, Thank you.`;
        const url = `https://wa.me/${record.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const statusColors = {
        pending: 'bg-primary',
        completed: 'bg-blue-500',
        delivered: 'bg-green-500'
    };

    return (
        <Link to={`/dashboard/stitching/${record._id}`} className="block card p-4 hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", statusColors[record.status])} />

            <div className="flex justify-between items-start pl-2">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-1">{record.customerName}</h3>
                        <span className="font-bold text-lg text-foreground">₹{record.amount}</span>
                    </div>

                    <p className="text-foreground/70 text-sm mb-3 font-medium">{record.clothType} {record.billNumber && `• #${record.billNumber}`}</p>

                    <div className="flex flex-col gap-1 text-xs text-foreground/50 mb-1">
                        <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{record.phoneNumber}</span>
                        </div>
                        {record.deliveryDate && (
                            <div className="flex items-center gap-1 text-orange-500 font-medium">
                                <Truck className="w-3.5 h-3.5" />
                                <span>Delivery: {format(new Date(record.deliveryDate), 'dd MMM yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {record.imageUrl && (
                    <div className="ml-4 w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                        <img src={record.imageUrl} alt="Cloth" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between pl-2">
                <span className={clsx(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border",
                    record.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        record.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-primary/10 text-primary border-primary/20'
                )}>
                    {record.status}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleWhatsApp}
                        className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
                        title="Remind on WhatsApp"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>

                    {record.status === 'pending' && (
                        <button
                            onClick={(e) => { e.preventDefault(); onUpdateStatus(record._id, 'completed'); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 rounded-xl text-xs font-semibold transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Ready
                        </button>
                    )}

                    {record.status === 'completed' && (
                        <button
                            onClick={(e) => { e.preventDefault(); onUpdateStatus(record._id, 'delivered'); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 rounded-xl text-xs font-semibold transition-all"
                        >
                            <Truck className="w-4 h-4" /> Deliver
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default StitchingCard;
