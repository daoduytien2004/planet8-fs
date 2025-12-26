import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const variants = {
        success: {
            bg: 'bg-green-500/20',
            border: 'border-green-500/50',
            text: 'text-green-400',
            icon: '✓'
        },
        error: {
            bg: 'bg-red-500/20',
            border: 'border-red-500/50',
            text: 'text-red-400',
            icon: '✕'
        },
        warning: {
            bg: 'bg-yellow-500/20',
            border: 'border-yellow-500/50',
            text: 'text-yellow-400',
            icon: '⚠'
        },
        info: {
            bg: 'bg-indigo-500/20',
            border: 'border-indigo-500/50',
            text: 'text-indigo-400',
            icon: 'ℹ'
        }
    };

    const variant = variants[type] || variants.info;

    const toastContent = (
        <div
            className={`fixed top-20 right-6 z-[99999] transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
        >
            <div
                className={`${variant.bg} ${variant.border} ${variant.text} backdrop-blur-xl border rounded-xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.4)] min-w-[300px] max-w-[500px] flex items-center gap-4`}
            >
                <span className="text-2xl flex-shrink-0">{variant.icon}</span>
                <p className="flex-1 m-0 font-medium">{message}</p>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer border-none text-current"
                >
                    ×
                </button>
            </div>
        </div>
    );

    return createPortal(toastContent, document.body);
}

// Toast Container to manage multiple toasts
export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Subscribe to toast events
        const handleToast = (event) => {
            const { message, type } = event.detail;
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
        };

        window.addEventListener('showToast', handleToast);
        return () => window.removeEventListener('showToast', handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <>
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ top: `${80 + index * 90}px` }}
                    className="fixed right-6 z-[99999]"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </>
    );
}

// Helper function to show toast
export function showToast(message, type = 'info') {
    const event = new CustomEvent('showToast', {
        detail: { message, type }
    });
    window.dispatchEvent(event);
}

export default Toast;
