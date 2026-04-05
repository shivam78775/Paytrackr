import { ArrowLeft, BookOpen, Banknote, Scissors, FileSpreadsheet, Bell, SunMoon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: <BookOpen className="w-6 h-6 text-primary" />,
            title: "Getting Started",
            content: "PayTrackr was designed to help streamline shop management. It consists of two main modules: Due Payments and Stitching Orders."
        },
        {
            icon: <Banknote className="w-6 h-6 text-green-500" />,
            title: "Managing Due Payments",
            content: "Use the 'Dues' tab to record udhaar. You can log customer names, phone numbers, items, amounts, and expected return dates. Tapping the 'Mark Paid' button instantly updates their status. You can also upload a photo of the bill or person."
        },
        {
            icon: <Scissors className="w-6 h-6 text-purple-500" />,
            title: "Stitching Orders",
            content: "Manage tailoring jobs via the 'Stitching' tab. Add cloth types, measurements (in remarks), and delivery dates. Workflow statuses go from Pending -> Completed (Ready) -> Delivered."
        },
        {
            icon: <FileSpreadsheet className="w-6 h-6 text-blue-500" />,
            title: "Excel Reports",
            content: "Need to audit your accounts? Go to the 'Reports' tab to generate Excel (.xlsx) spreadsheets instantly. You can download weekly, monthly, or all-time records."
        },
        {
            icon: <Bell className="w-6 h-6 text-[#25D366]" />,
            title: "WhatsApp Reminders",
            content: "Next to any pending due or completed stitching order, tap the green WhatsApp icon. It will open your WhatsApp with a pre-typed friendly reminder to the customer!"
        },
        {
            icon: <SunMoon className="w-6 h-6 text-orange-500" />,
            title: "Dark Mode",
            content: "Toggle Dark Mode from the 'More' tab under General Settings to reduce eye strain when managing your shop at night."
        }
    ];

    return (
        <div className="p-4 sm:p-6 pb-24 space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Help Guide</h2>
                    <p className="text-foreground/60 text-sm">Learn how to use PayTrackr</p>
                </div>
            </div>

            <div className="grid gap-4">
                {sections.map((sec, idx) => (
                    <div key={idx} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-foreground/5 rounded-xl">
                                {sec.icon}
                            </div>
                            <h3 className="font-semibold text-lg text-foreground">{sec.title}</h3>
                        </div>
                        <p className="text-foreground/70 text-sm leading-relaxed">
                            {sec.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;
