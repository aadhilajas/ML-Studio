import React from 'react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                    <h1 className="text-3xl font-bold mb-4 text-red-500">Something went wrong.</h1>
                    <p className="mb-4 text-slate-300">
                        {this.state.error && this.state.error.toString()}
                    </p>
                    <Button onClick={() => window.location.reload()} variant="secondary">
                        Reload Page
                    </Button>
                    <Button onClick={() => window.location.href = '/'} className="mt-2">
                        Go Home
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
