import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';


interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: () => Promise<void> | void;
    children: React.ReactNode;
}

const LoadingButton = ({ onClick, children, className = '', ...props }: LoadingButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default behavior if used inside a form
        e.preventDefault();

        setIsLoading(true);

        try {
            await onClick();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            disabled={isLoading || props.disabled}
            className={`btn-queue relative overflow-hidden ${className}`}
        >
            <span className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-slow-spin" />
                </div>
            )}
        </button>
    );
};

export default LoadingButton;