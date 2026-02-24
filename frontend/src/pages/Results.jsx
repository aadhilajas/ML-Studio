import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Download, BarChart2, PieChart, Activity } from 'lucide-react';

const ResultsPage = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        try {
            const storedResults = localStorage.getItem('training_results');
            if (storedResults) {
                setResults(JSON.parse(storedResults));
            }
        } catch (e) {
            console.error("Failed to load results:", e);
            // Optionally clear bad data
            localStorage.removeItem('training_results');
        }
    }, []);

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="mb-4 p-4 rounded-full bg-slate-800">
                    <BarChart2 className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
                <p className="text-slate-400 mb-6 max-w-md">
                    It looks like you haven't trained a model yet, or your previous session expired.
                </p>
                <Button onClick={() => navigate('/config')}>
                    Start New Experiment
                </Button>
            </div>
        );
    }

    const { metrics = {}, explanation = "No explanation available.", visualizations = {}, model_id } = results || {};

    const formatKey = (key) => key.replace(/_/g, ' ').toUpperCase();

    return (
        <div className="max-w-7xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400 mb-2">
                        Training Results
                    </h1>
                    <p className="text-slate-400">
                        Performance metrics and visualizations for your <span className="text-brand-300 font-semibold">{results.model_name}</span> model.
                    </p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <Button variant="secondary" onClick={() => navigate('/config')} className="flex-1 md:flex-none">
                        <RefreshCw className="w-4 h-4 mr-2" /> Train Another
                    </Button>
                    {/* Download Button */}
                    {model_id && (
                        <Button onClick={() => window.open(`${client.defaults.baseURL}/download/${model_id}`, '_blank')} className="flex-1 md:flex-none shadow-brand-500/20">
                            <Download className="w-4 h-4 mr-2" /> Download Model
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metrics && Object.entries(metrics).map(([key, value], index) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-500/30 transition-colors"
                    >
                        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-slate-400 text-sm font-medium mb-3 relative z-10">{formatKey(key)}</span>
                        <span className="text-3xl md:text-4xl font-bold text-white relative z-10 font-heading">
                            {typeof value === 'number'
                                ? (value % 1 !== 0 && Math.abs(value) < 1000 ? value.toFixed(4) : value)
                                : value}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Explanation */}
                <div className="lg:col-span-1">
                    <Card title="Analysis & Explanation" className="h-full border-l-4 border-l-brand-500 bg-slate-900/40">
                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-200">
                            <div className="text-slate-300 leading-relaxed text-sm md:text-base">
                                {explanation}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Visualizations */}
                <div className="lg:col-span-2 space-y-8">
                    {visualizations && visualizations.confusion_matrix && (
                        <Card title="Confusion Matrix">
                            <div className="bg-white/5 rounded-xl p-4">
                                <img src={`data:image/png;base64,${visualizations.confusion_matrix}`} alt="Confusion Matrix" className="w-full rounded-lg" />
                            </div>
                        </Card>
                    )}

                    {visualizations && visualizations.feature_importance && (
                        <Card title="Feature Importance">
                            <div className="bg-white/5 rounded-xl p-4">
                                <img src={`data:image/png;base64,${visualizations.feature_importance}`} alt="Feature Importance" className="w-full rounded-lg" />
                            </div>
                        </Card>
                    )}

                    {visualizations && visualizations.residual_plot && (
                        <Card title="Residuals">
                            <div className="bg-white/5 rounded-xl p-4">
                                <img src={`data:image/png;base64,${visualizations.residual_plot}`} alt="Residual Plot" className="w-full rounded-lg" />
                            </div>
                        </Card>
                    )}

                    {visualizations && visualizations.cluster_plot && (
                        <Card title="Cluster Visualization">
                            <div className="bg-white/5 rounded-xl p-4">
                                <img src={`data:image/png;base64,${visualizations.cluster_plot}`} alt="Clusters" className="w-full rounded-lg" />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
