import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 border border-transparent",
        secondary: "bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700/50 hover:border-slate-600 backdrop-blur-sm",
        outline: "bg-transparent border border-slate-700 text-slate-400 hover:border-brand-500 hover:text-brand-400",
        ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-brand-300"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10 flex items-center">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
        </motion.button>
    );
};

export default Button;
