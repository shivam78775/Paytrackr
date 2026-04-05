import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Banknote, Scissors, FileBox, Menu } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: Home, end: true },
    { label: 'Dues', to: '/dashboard/dues', icon: Banknote },
    { label: 'Stitching', to: '/dashboard/stitching', icon: Scissors },
    { label: 'Reports', to: '/dashboard/reports', icon: FileBox },
    { label: 'More', to: '/dashboard/more', icon: Menu },
];

const DashboardLayout = () => {

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 sm:pb-0 sm:pt-16 sm:pl-64">
            
            {/* Desktop Side Navigation */}
            <nav className="hidden sm:flex flex-col w-64 border-r border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 bottom-0 z-40 p-4">
                <h1 className="text-2xl font-bold text-primary mb-8 px-4">PayTrackr.</h1>
                
                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.label} 
                            to={item.to} 
                            end={item.end}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                                isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-foreground/70 hover:bg-foreground/5"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Mobile Header (Shown only on small screens) */}
            <header className="sm:hidden bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 h-16 flex items-center px-4">
                <h1 className="text-xl font-bold text-primary">PayTrackr</h1>
            </header>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)] w-full flex flex-col">
                <div className="flex-1 shrink-0">
                    <Outlet />
                </div>
                
                {/* Global Footer (shows below all content) */}
                <footer className="w-full py-6 mt-auto shrink-0 border-t border-border/50 text-center">
                    <p className="text-xs font-semibold text-foreground/40 pb-safe">
                        &copy; 2026 Vertex Dev Labs. All rights reserved.
                    </p>
                </footer>
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border z-40 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between px-2 h-16">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.label} 
                            to={item.to} 
                            end={item.end}
                            className={({ isActive }) => clsx(
                                "flex flex-col items-center justify-center flex-1 h-full space-y-1 relative transition-colors",
                                isActive ? "text-primary" : "text-foreground/50 hover:text-foreground/80 cursor-pointer"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"></div>}
                                    <div className={clsx("p-1.5 rounded-full transition-transform", isActive ? "-translate-y-1 bg-primary/10" : "")}>
                                        <item.icon className={clsx("w-5 h-5", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default DashboardLayout;
