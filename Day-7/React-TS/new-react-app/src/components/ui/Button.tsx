import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'default',
    size = 'default',
    className,
    children,
    ...props
}) => {
    const baseClasses = clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        props.disabled && 'opacity-50 cursor-not-allowed',
        {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'text-primary hover:underline': variant === 'link',
            'px-4 py-2': size === 'default',
            'px-3 py-1.5': size === 'sm',
            'px-5 py-3': size === 'lg',
            'p-2': size === 'icon',
            'rounded-full': size === 'icon',
        },
        className
    );

    return (
        <button className={twMerge(baseClasses)} {...props}>
            {children}
        </button>
    );
};

export default Button;
