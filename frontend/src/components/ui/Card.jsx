import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', title, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl hover:shadow-brand-500/5 hover:border-brand-500/20 transition-all duration-300 ${className}`}
            {...props}
        >
            {title && (
                <h3 className="text-xl font-heading font-semibold text-slate-100 mb-4 flex items-center">
                    <span className="bg-brand-500/10 w-1 h-6 rounded-full mr-3 block"></span>
                    {title}
                </h3>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
