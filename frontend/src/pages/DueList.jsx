import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, ArrowUpDown } from 'lucide-react';
import api from '../lib/api';
import DueCard from '../components/DueCard';

const DueList = () => {
    const [dues, setDues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, paid
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest

    useEffect(() => {
        fetchDues();
    }, []);

    const fetchDues = async () => {
        try {
            const res = await api.get('/dues');
            setDues(res.data.data);
        } catch (error) {
            console.error('Error fetching dues', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/dues/${id}`, { status });
            setDues(dues.map(d => d._id === id ? { ...d, status } : d));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    let processedDues = dues.filter(due => {
        const matchesSearch = due.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              due.phoneNumber.includes(searchQuery) ||
                              (due.billNumber && due.billNumber.includes(searchQuery));
        const matchesFilter = filterStatus === 'all' || due.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    processedDues.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'highest') return b.amount - a.amount;
        return 0;
    });

    return (
        <div className="p-4 sm:p-6 pb-24">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Due Payments</h2>

            <div className="flex flex-col gap-3 mb-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                    <input 
                        type="text" 
                        placeholder="Search name, phone, bill no..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <div className="flex bg-card border border-border rounded-xl p-1">
                        {['all', 'pending', 'paid'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                    filterStatus === f 
                                    ? 'bg-primary text-primary-foreground shadow-sm' 
                                    : 'text-foreground/70 hover:text-foreground'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center bg-card border border-border rounded-xl px-3 py-1 text-sm font-medium text-foreground/70">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer appearance-none pr-4"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : processedDues.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-2xl border-border bg-card/30">
                    <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Filter className="w-6 h-6 text-foreground/40" />
                    </div>
                    <p className="text-foreground/60 mb-1">No due records found.</p>
                    {searchQuery || filterStatus !== 'all' ? (
                        <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="text-primary text-sm font-semibold">Clear Filters</button>
                    ) : null}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processedDues.map(due => (
                        <DueCard key={due._id} due={due} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DueList;
