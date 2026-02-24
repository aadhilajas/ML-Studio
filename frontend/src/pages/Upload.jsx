import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError("Please upload a valid CSV file.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await client.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Save state to local storage or context for next steps
            // Ideally we use a global state manager (Context/Redux/Zustand), but simplify with localStorage for now
            localStorage.setItem('dataset_name', response.data.filename);
            localStorage.setItem('dataset_details', JSON.stringify(response.data.details));

            navigate('/config');
        } catch (err) {
            console.error(err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                    Upload Your Dataset
                </h1>
                <p className="text-slate-400">
                    Start by uploading your CSV file. We'll automatically detect columns and data types.
                </p>
            </motion.div>

            <Card className="max-w-2xl mx-auto overflow-hidden">
                <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/50'
                        }`}
                >
                    <input {...getInputProps()} />

                    {/* Background glow integration */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center space-y-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragActive ? 'bg-brand-500/20 scale-110' : 'bg-slate-800 group-hover:bg-slate-800/80 group-hover:shadow-xl group-hover:shadow-brand-500/10'
                            }`}>
                            {file ? (
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            ) : (
                                <UploadIcon className={`w-10 h-10 transition-colors ${isDragActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-brand-400'}`} />
                            )}
                        </div>
                        <div className="space-y-2">
                            {file ? (
                                <div className="space-y-1">
                                    <p className="text-xl font-semibold text-white">{file.name}</p>
                                    <p className="text-sm text-slate-400">Ready to upload</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-white">Drag & Drop your CSV file</p>
                                    <p className="text-sm text-slate-400">or click to browse your files</p>
                                </>
                            )}
                        </div>
                        {!file && (
                            <div className="text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1">
                                Max size: 10MB • .csv format
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-400"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={!file ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        {uploading ? 'Uploading...' : 'Continue'}
                        {!uploading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default UploadPage;
