import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowRight, Brain, BarChart2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8">
            {/* Hero Section */}
            <div className="mx-auto max-w-3xl py-24 sm:py-32 lg:py-40 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="mb-8 flex justify-center">
                        <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-sm font-medium border border-brand-500/20">
                            v1.0 is now live
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-white mb-8">
                        No-Code AI <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 animate-gradient-x">
                            for Everyone
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                        Upload your data, select a model, and train state-of-the-art machine learning models in minutes.
                        Visualize results, analyze metrics, and export models - all without writing a single line of code.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/upload">
                            <Button className="pl-8 pr-8 text-lg h-14 bg-brand-600 hover:bg-brand-500 shadow-brand-500/25">
                                Get Started <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <a href="#" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors">
                            View Documentation <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Feature Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 relative z-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <FeatureCard
                        icon={Brain}
                        title="Advanced Models"
                        description="Use Classification, Regression, and Clustering algorithms like Random Forest, SVM, and K-Means."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={BarChart2}
                        title="Rich Visualizations"
                        description="Interactive charts, Confusion Matrices, and ROC curves generated automatically."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Instant Explanations"
                        description="Get plain-English explanations of your model's performance and metrics."
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-brand-500/30 hover:bg-slate-900/80 transition-all duration-300 group"
    >
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-500/20">
            <Icon className="w-6 h-6 text-brand-400 group-hover:text-brand-300 transition-colors" />
        </div>
        <h3 className="text-xl font-bold font-heading text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
);

export default Landing;
