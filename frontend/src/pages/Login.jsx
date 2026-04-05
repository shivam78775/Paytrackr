import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const Login = () => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(passcode);
            if (success) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid passcode');
        } finally {
            setIsLoading(false);
        }
    };

    // A simple beautiful keypad could be implemented later, for now we will use a password input box
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-card/50">
            
            <div className="mb-10 text-center relative">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_30px_rgba(var(--color-primary),0.3)]">
                    <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">PayTrackr</h1>
                <p className="text-foreground/60 mt-2">Manage your shop dues securely.</p>
            </div>

            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="card p-6 shadow-xl shadow-black/5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="passcode" className="block text-sm font-medium mb-1.5 text-foreground/80">Passcode</label>
                            <input
                                id="passcode"
                                type="password"
                                inputMode="numeric"
                                pattern="\d*"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className={clsx(
                                    "input-field text-center text-2xl tracking-[0.5em] font-mono",
                                    error && "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="••••"
                                disabled={isLoading}
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || passcode.length < 4}
                            className="btn-primary w-full group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
