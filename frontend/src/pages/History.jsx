import React, { useEffect, useState } from 'react';
import client from '../api/client';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await client.get('/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const formatMetric = (taskType, metrics) => {
        if (!metrics) return 'N/A';

        if (taskType === 'Classification') {
            const acc = metrics.accuracy || metrics.Accuracy;
            if (acc === undefined || acc === null) return 'Acc: N/A';
            return `Acc: ${(Number(acc) * 100).toFixed(1)}%`;
        }
        if (taskType === 'Regression') {
            const r2 = metrics.r2 || metrics.R2 || metrics.r2_score;
            if (r2 === undefined || r2 === null) return 'R²: N/A';
            return `R²: ${Number(r2).toFixed(2)}`;
        }
        if (taskType === 'Clustering') {
            const sil = metrics.silhouette || metrics.Silhouette;
            if (sil === undefined || sil === null) return 'Silhouette: N/A';
            return `Silhouette: ${Number(sil).toFixed(2)}`;
        }
        return '';
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-400 mb-2">
                    Experiment History
                </h1>
                <p className="text-slate-400">
                    Track your past model training sessions and their performance.
                </p>
            </motion.div>

            <div className="grid gap-4">
                {history.length === 0 && <p className="text-slate-400">No experiments found.</p>}
                {history.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer border-slate-800/50 hover:border-brand-500/30 group">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center space-x-3 mb-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">{exp.model_name}</h3>
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                        {exp.task_type}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-slate-600 mr-2" />
                                    {exp.dataset_name}
                                </p>
                            </div>
                            <div className="flex items-center justify-between w-full md:w-auto md:block text-right">
                                <div className="font-mono text-xl font-bold text-brand-400 mb-1 group-hover:scale-105 transition-transform origin-right">
                                    {formatMetric(exp.task_type, exp.metrics)}
                                </div>
                                <div className="text-xs text-slate-500">{new Date(exp.created_at).toLocaleDateString()}</div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
