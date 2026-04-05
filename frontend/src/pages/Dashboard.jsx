import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, Scissors, Bell, PlusCircle, FileBox } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                <p className="text-foreground/70 mb-4">Failed to load dashboard statistics. Please try refreshing or logging in again.</p>
                <button onClick={() => window.location.reload()} className="btn-primary shadow-sm hover:opacity-90">
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 pb-24 space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Hey! Sandhya Paridhan</h2>
                    <p className="text-foreground/60 text-sm">Welcome back to PayTrackr</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/dashboard/dues/add" className="card bg-primary text-primary-foreground border-none p-4 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <PlusCircle className="w-6 h-6" />
                    <span className="font-semibold text-sm">Add Due</span>
                </Link>
                <Link to="/dashboard/stitching/add" className="card bg-card p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-sm">Add Stitching</span>
                </Link>
            </div>

            {/* Upcoming Deliveries Notification Panel */}
            {stats?.upcomingDeliveries?.length > 0 && (
                <div className="card p-0 overflow-hidden border-orange-500/30">
                    <div className="bg-orange-500/10 px-4 py-3 flex items-center gap-2 border-b border-orange-500/20">
                        <Bell className="w-5 h-5 text-orange-500" />
                        <h3 className="font-bold text-orange-600 dark:text-orange-400">Upcoming Deliveries</h3>
                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {stats?.upcomingDeliveries?.length || 0}
                        </span>
                    </div>
                    <div className="divide-y divide-border/50">
                        {stats?.upcomingDeliveries?.map((delivery) => (
                            <Link key={delivery._id} to={`/dashboard/stitching/${delivery._id}`} className="px-4 py-3 flex items-center justify-between hover:bg-foreground/5 transition-colors">
                                <div>
                                    <p className="font-semibold text-foreground line-clamp-1">{delivery.customerName}</p>
                                    <p className="text-xs text-foreground/60 line-clamp-1">{delivery.clothType}</p>
                                </div>
                                <div className={`text-xs font-bold px-2.5 py-1 rounded-md border shrink-0 ml-3 ${delivery.isToday ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-orange-500/10 text-orange-500 border-orange-500/30'}`}>
                                    {delivery.isToday ? 'Due Today' : 'Tomorrow'}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="card p-4">
                    <TrendingUp className="w-5 h-5 text-red-500 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Total Pending</p>
                    <h3 className="text-2xl font-bold text-foreground">₹{(stats?.totalPendingDueAmt || 0).toLocaleString()}</h3>
                </div>
                <div className="card p-4">
                    <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Paid This Wk</p>
                    <h3 className="text-2xl font-bold text-foreground">₹{(stats?.totalPaidThisWeekAmt || 0).toLocaleString()}</h3>
                </div>
                <div className="card p-4">
                    <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Paid This Mo</p>
                    <h3 className="text-2xl font-bold text-foreground">₹{(stats?.totalPaidThisMonthAmt || 0).toLocaleString()}</h3>
                </div>

                <div className="card p-4">
                    <Users className="w-5 h-5 text-orange-500 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Pending Due Records</p>
                    <h3 className="text-2xl font-bold text-foreground">{stats?.totalPendingDueRecords || 0}</h3>
                </div>
                <div className="card p-4">
                    <Scissors className="w-5 h-5 text-purple-500 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Pending Deliveries</p>
                    <h3 className="text-2xl font-bold text-foreground">{stats?.totalStitchingPendingDeliveries || 0}</h3>
                </div>
                <div className="card p-4 col-span-2 sm:col-span-1 bg-foreground/5 border-none">
                    <Bell className="w-5 h-5 text-foreground/70 mb-2" />
                    <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider mb-1">Today's Activity</p>
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-sm font-semibold">{stats?.todaysDueEntries || 0} new dues</span>
                        <span className="text-sm font-semibold">{stats?.todaysStitchingOrders || 0} new orders</span>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-3 text-primary">
                    <FileBox className="w-5 h-5" />
                    <h3 className="font-semibold">Reports & Exports</h3>
                </div>
                <p className="text-sm text-foreground/70 mb-4">Generate Excel spreadsheets for your Due Payments and Stitching Records.</p>
                <Link to="/dashboard/reports" className="btn-primary w-full text-center">View Reports</Link>
            </div>

        </div>
    );
};

export default DashboardHome;
