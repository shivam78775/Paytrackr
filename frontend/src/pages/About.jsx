import { ArrowLeft, Code, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4 sm:p-6 pb-24 space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">About PayTrackr</h2>
            </div>

            <div className="card p-8 text-center space-y-6 flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-3">
                    <Code className="w-10 h-10" />
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">PayTrackr</h1>
                    <p className="text-foreground/50 text-sm mt-1 font-semibold tracking-widest uppercase">Version 2.0.0</p>
                </div>

                <div className="w-full h-px bg-border my-2"></div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-foreground/80 font-medium text-lg text-center">
                            Developed by the <span className="text-primary font-bold">Vertex Dev Labs</span> <br />
                            by <span className="font-bold">Shivam Rathore</span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-xl inline-flex w-fit mx-auto mt-4">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">Made with Passion</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
