import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Settings, Play, Database, Target, Layers } from 'lucide-react';
import Loader from '../components/ui/Loader';

const ConfigPage = () => {
    const navigate = useNavigate();
    const [datasetName, setDatasetName] = useState('');
    const [columns, setColumns] = useState([]);

    // Form State
    const [taskType, setTaskType] = useState('Classification');
    const [modelName, setModelName] = useState('');
    const [targetColumn, setTargetColumn] = useState('');
    const [testSize, setTestSize] = useState(0.2);
    const [useScaling, setUseScaling] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Load
    useEffect(() => {
        try {
            const storedName = localStorage.getItem('dataset_name');
            const storedDetails = localStorage.getItem('dataset_details');

            if (!storedName || !storedDetails) {
                navigate('/upload');
                return;
            }

            setDatasetName(storedName);
            const details = JSON.parse(storedDetails);
            setColumns(details.columns || []);

            // Unset target column initially
            setTargetColumn('');
        } catch (e) {
            console.error("Failed to load dataset details:", e);
            localStorage.removeItem('dataset_name');
            localStorage.removeItem('dataset_details');
            navigate('/upload');
        }
    }, [navigate]);

    // Model Options
    const models = {
        'Classification': ['Logistic Regression', 'Random Forest', 'SVM', 'KNN'],
        'Regression': ['Linear Regression', 'Random Forest Regressor', 'Gradient Boosting'],
        'Clustering': ['KMeans', 'DBSCAN', 'Agglomerative Clustering']
    };

    // Auto-select first model when task type changes
    useEffect(() => {
        setModelName(models[taskType][0]);
    }, [taskType]);

    const handleTrain = async () => {
        if (taskType !== 'Clustering' && !targetColumn) {
            setError("Target column is required for supervised learning.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            dataset_name: datasetName,
            task_type: taskType,
            model_name: modelName,
            target_column: targetColumn || null,
            test_size: parseFloat(testSize),
            use_scaling: useScaling
        };

        try {
            console.log("Sending payload:", payload);
            const response = await client.post('/train', payload);
            console.log("Received response:", response.data);

            // The API returns the full experiment object. 
            // The actual training results (metrics, viz, explanation) are stored in the 'metrics' field.
            // We need to unpack this for the Results page.
            const trainingResults = response.data.metrics;
            console.log("Unpacked results:", trainingResults);

            localStorage.setItem('training_results', JSON.stringify(trainingResults));
            console.log("Saved to localStorage, navigating to results...");
            navigate('/results');
        } catch (err) {
            console.error("Training error:", err);
            setError(err.response?.data?.detail || "Training failed. Please check your configuration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                    Configure Experiment
                </h1>
                <p className="text-slate-400">
                    Customize your machine learning pipeline. Select the task, model, and parameters.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="md:col-span-2 space-y-6">
                    <Card title="Model Setup">
                        <div className="space-y-6">
                            {/* Task Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">ML Task</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Classification', 'Regression', 'Clustering'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setTaskType(type)}
                                            className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 border ${taskType === type
                                                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Model Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">Model Architecture</label>
                                <div className="relative">
                                    <select
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none"
                                    >
                                        {models[taskType].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Target Selection */}
                            {taskType !== 'Clustering' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-3">Target Column</label>
                                    <div className="relative">
                                        <select
                                            value={targetColumn}
                                            onChange={(e) => setTargetColumn(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors appearance-none"
                                        >
                                            <option value="">Select a target...</option>
                                            {columns.map(col => (
                                                <option key={col} value={col}>{col}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <Target className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Advanced Settings">
                        <div className="space-y-6">
                            {/* Scaling Toggle */}
                            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                <div>
                                    <h4 className="text-slate-200 font-medium mb-1">Feature Scaling</h4>
                                    <p className="text-xs text-slate-500">Standardize features (recommended)</p>
                                </div>
                                <button
                                    onClick={() => setUseScaling(!useScaling)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${useScaling ? 'bg-brand-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${useScaling ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {/* Test Split Slider */}
                            {taskType !== 'Clustering' && (
                                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-sm font-medium text-slate-200">Test Split Ratio</span>
                                        <span className="text-sm font-bold text-brand-400">{Math.round(testSize * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="0.5"
                                        step="0.05"
                                        value={testSize}
                                        onChange={(e) => setTestSize(e.target.value)}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-600">
                                        <span>10%</span>
                                        <span>50%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Summary Panel */}
                <div className="space-y-6">
                    <Card title="Experiment Summary" className="h-full border-brand-500/10">
                        <div className="space-y-4">
                            <SummaryItem icon={Database} label="Dataset" value={datasetName} />
                            <SummaryItem icon={Layers} label="Task" value={taskType} />
                            <SummaryItem icon={Settings} label="Model" value={modelName} />
                            {taskType !== 'Clustering' && (
                                <SummaryItem icon={Target} label="Target" value={targetColumn || "Not Selected"} warning={!targetColumn} />
                            )}
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start space-x-2">
                                <span className="mt-0.5">•</span>
                                <div>{error}</div>
                            </div>
                        )}

                        <div className="mt-8">
                            <Button
                                className="w-full py-4 text-lg shadow-xl shadow-brand-500/20"
                                onClick={handleTrain}
                                disabled={loading || (taskType !== 'Clustering' && !targetColumn)}
                            >
                                {loading ? (
                                    <>
                                        Training Model...
                                        <Loader className="w-5 h-5 ml-3 border-white/30 border-t-white" />
                                    </>
                                ) : (
                                    <>
                                        Start Experiment
                                        <Play className="w-5 h-5 ml-2 fill-current" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SummaryItem = ({ icon: Icon, label, value, warning }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-slate-700 transition-colors">
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${warning ? 'bg-red-500/10 text-red-400' : 'bg-brand-500/10 text-brand-400'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-sm font-medium">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${warning ? 'text-red-400' : 'text-slate-200'}`}>{value}</span>
    </div>
);

export default ConfigPage;
