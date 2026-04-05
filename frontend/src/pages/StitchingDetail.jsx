import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Phone, Calendar, FileText, Image as ImageIcon, MessageCircle, Scissors, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const StitchingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecord();
    }, [id]);

    const fetchRecord = async () => {
        try {
            const res = await api.get(`/stitching/${id}`);
            setRecord(res.data.data);
        } catch (error) {
            console.error('Failed to fetch', error);
            navigate('/dashboard/stitching');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (!record) return;
        const text = `Hello ${record.customerName}, your ${record.clothType} is ready and scheduled for delivery.`;
        const url = `https://wa.me/${record.phoneNumber.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const formData = new FormData();
            formData.append('status', newStatus);
            await api.put(`/stitching/${id}`, formData);
            fetchRecord();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    if (isLoading) {
        return <div className="flex h-[80vh] items-center justify-center text-foreground/50">Loading details...</div>;
    }

    if (!record) return null;

    return (
        <div className="p-4 sm:p-6 pb-24">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard/stitching')} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        Order Details
                    </h2>
                </div>
                <Link to={`/dashboard/stitching/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors">
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                </Link>
            </div>

            <div className="space-y-4">
                {/* Header Card */}
                <div className="card p-5 relative overflow-hidden">
                    <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-1.5",
                        record.status === 'delivered' ? 'bg-green-500' : 
                        record.status === 'completed' ? 'bg-blue-500' :
                        'bg-primary'
                    )} />
                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{record.customerName}</h1>
                            <p className="text-foreground/70 font-medium mt-1 flex items-center gap-1.5">
                                <Scissors className="w-3.5 h-3.5" />
                                {record.clothType || 'Stitching Order'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-primary">₹{record.amount}</span>
                            <div className="mt-2">
                                <span className={clsx(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border inline-block",
                                    record.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                    record.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    'bg-primary/10 text-primary border-primary/20'
                                )}>
                                    {record.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 pl-2">
                        <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors font-semibold text-sm">
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                        
                        {record.status === 'pending' && (
                            <button onClick={() => handleUpdateStatus('completed')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 rounded-xl font-semibold text-sm transition-all">
                                Mark Completed
                            </button>
                        )}
                        {record.status === 'completed' && (
                            <button onClick={() => handleUpdateStatus('delivered')} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 rounded-xl font-semibold text-sm transition-all focus:ring-2 ring-green-500/50">
                                <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Timeline UI */}
                <div className="card p-4 mx-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold max-w-sm mx-auto relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/50 -z-10 -translate-y-1/2"></div>
                        
                        <div className="flex flex-col items-center gap-1.5 bg-card/80 p-1 rounded-lg backdrop-blur-sm">
                            <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white z-10 box-content outline outline-4 outline-card", record.status === 'pending' || record.status === 'completed' || record.status === 'delivered' ? 'bg-primary' : 'bg-border')}>1</div>
                            <span className={clsx(record.status === 'pending' ? 'text-primary' : 'text-foreground/50')}>Pending</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 bg-card/80 p-1 rounded-lg backdrop-blur-sm">
                            <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white z-10 box-content outline outline-4 outline-card", record.status === 'completed' || record.status === 'delivered' ? 'bg-blue-500' : 'bg-border')}>2</div>
                            <span className={clsx(record.status === 'completed' ? 'text-blue-500' : 'text-foreground/50')}>Completed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 bg-card/80 p-1 rounded-lg backdrop-blur-sm">
                            <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white z-10 box-content outline outline-4 outline-card", record.status === 'delivered' ? 'bg-green-500' : 'bg-border')}>3</div>
                            <span className={clsx(record.status === 'delivered' ? 'text-green-500' : 'text-foreground/50')}>Delivered</span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="card p-4 space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone Number</p>
                            <p className="text-foreground font-medium">{record.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Order Date</p>
                            <p className="text-foreground font-medium">{format(new Date(record.orderDate), 'do MMMM, yyyy')}</p>
                        </div>
                        {record.deliveryDate && (
                            <div>
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Delivery Date</p>
                                <p className="text-foreground font-medium">{format(new Date(record.deliveryDate), 'do MMMM, yyyy')}</p>
                            </div>
                        )}
                        {record.billNumber && (
                            <div>
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1 flex items-center gap-1"><FileText className="w-3 h-3"/> Bill Number</p>
                                <p className="text-foreground font-medium">#{record.billNumber}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {record.imageUrl ? (
                            <div className="card p-2 overflow-hidden bg-card/50">
                                <a href={record.imageUrl} target="_blank" rel="noreferrer" className="block w-full h-48 rounded-xl overflow-hidden relative group">
                                    <img src={record.imageUrl} alt="Cloth type" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
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
                    </div>
                </div>

                {/* Measurements & Remarks */}
                {record.measurements && record.measurements.length > 0 && (
                    <div className="card p-5 border-primary/20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-primary" /> Measurements
                            </h3>
                            <span className="text-xs font-bold bg-foreground/5 px-2 py-1 rounded-md text-foreground/50 uppercase">{record.measurementsGlobalUnit}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {record.measurements.map((m, idx) => (
                                <div key={idx} className="flex justify-between items-end border-b border-border/40 pb-1">
                                    <span className="text-sm font-medium text-foreground/60 capitalize">{m.name}</span>
                                    <span className="text-base font-bold text-foreground">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {record.remark && (
                    <div className="card p-4">
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Remarks / Notes</p>
                        <p className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">{record.remark}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StitchingDetail;
