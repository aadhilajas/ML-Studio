import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Config from './pages/Config'
import Results from './pages/Results'
import History from './pages/History'
import PageTransition from './components/PageTransition'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
    const location = useLocation();

    return (
        <Layout>
            <ErrorBoundary>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                        <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
                        <Route path="/config" element={<PageTransition><Config /></PageTransition>} />
                        <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
                        <Route path="/history" element={<PageTransition><History /></PageTransition>} />
                    </Routes>
                </AnimatePresence>
            </ErrorBoundary>
        </Layout>
    )
}

export default App
