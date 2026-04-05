import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Info, Settings, Shield, BookOpen, SunMoon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const More = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="p-4 sm:p-6 pb-24 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">More</h2>
                <p className="text-foreground/60 text-sm mt-1">App settings and info</p>
            </div>

            <div className="card divide-y divide-border border-none p-0 overflow-hidden">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors group">
                    <div className="flex items-center gap-3">
                        <SunMoon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                        <span className="font-medium text-foreground">Dark Mode</span>
                    </div>
                    {/* Toggle Switch */}
                    <div className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-foreground/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${theme === 'dark' ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </button>
                
                <button onClick={() => navigate('/dashboard/more/help')} className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-foreground/70" />
                        <span className="font-medium text-foreground">Help Guide</span>
                    </div>
                </button>
                
                <button onClick={() => navigate('/dashboard/more/about')} className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-foreground/70" />
                        <span className="font-medium text-foreground">About PayTrackr</span>
                    </div>
                </button>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full card border-red-200 bg-red-50 text-red-600 flex items-center justify-center gap-2 p-4 font-bold tracking-wide hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:border-red-900/50"
            >
                <LogOut className="w-5 h-5" />
                Lock App
            </button>
        </div>
    );
};

export default More;
