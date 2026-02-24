import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ className = 'w-6 h-6' }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.span
                className="absolute w-full h-full border-2 border-brand-500/30 rounded-full"
            />
            <motion.span
                className="absolute w-full h-full border-t-2 border-brand-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default Loader;
