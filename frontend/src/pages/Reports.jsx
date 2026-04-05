import { Download, FileSpreadsheet, Calendar, ChevronRight } from 'lucide-react';
import api from '../lib/api';

const Reports = () => {

    const handleDownload = async (module, period) => {
        try {
            // Using axios we get blob and create object url to download
            const res = await api.get(`/reports/excel/${module}?period=${period}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `paytrackr_${module}_${period}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed', error);
            alert("Failed to download report.");
        }
    };

    return (
        <div className="p-4 sm:p-6 pb-24 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Reports & Export</h2>
                <p className="text-foreground/60 text-sm mt-1">Download your data in Excel format</p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-primary/10 text-primary">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Pending Dues Reports</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleDownload('dues', 'all')}
                        className="card flex items-center justify-between p-4 hover:border-primary/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-foreground/5 text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">All Dues</h4>
                                <p className="text-xs text-foreground/50">Complete record of every due payment</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                    </button>

                    <button 
                         onClick={() => handleDownload('dues', 'pending')}
                        className="card flex items-center justify-between p-4 hover:border-primary/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Pending Only</h4>
                                <p className="text-xs text-foreground/50">Records where status is not paid</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                    </button>
                    
                    <button 
                        onClick={() => handleDownload('dues', 'weekly')}
                        className="card flex items-center justify-between p-4 hover:border-primary/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">This Week</h4>
                                <p className="text-xs text-foreground/50">Dues added in the last 7 days</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                    </button>
                    
                    <button 
                        onClick={() => handleDownload('dues', 'monthly')}
                        className="card flex items-center justify-between p-4 hover:border-primary/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">This Month</h4>
                                <p className="text-xs text-foreground/50">Dues added this calendar month</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </section>


            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pt-2">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-500">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Stitching Reports</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleDownload('stitching', 'all')}
                        className="card flex items-center justify-between p-4 hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-foreground/5 text-foreground/70 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">All Stitching</h4>
                                <p className="text-xs text-foreground/50">Complete record of every order</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-blue-500 transition-colors" />
                    </button>

                    <button 
                         onClick={() => handleDownload('stitching', 'weekly')}
                        className="card flex items-center justify-between p-4 hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Weekly Report</h4>
                                <p className="text-xs text-foreground/50">Stitching orders from last 7 days</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-blue-500 transition-colors" />
                    </button>
                    
                    <button 
                         onClick={() => handleDownload('stitching', 'monthly')}
                        className="card flex items-center justify-between p-4 hover:border-blue-500/50 transition-colors group sm:col-span-2"
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Monthly Report</h4>
                                <p className="text-xs text-foreground/50">Stitching orders from this month</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-blue-500 transition-colors" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Reports;
