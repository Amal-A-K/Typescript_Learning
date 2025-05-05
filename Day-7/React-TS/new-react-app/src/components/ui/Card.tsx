import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
// import { clsx } from 'clsx';

interface CardProps {
    className?: string;
    children?: ReactNode;
}

interface CardHeaderProps {
    className?: string;
    children?: ReactNode;
}

interface CardTitleProps {
    className?: string;
    children?: ReactNode;
}

interface CardDescriptionProps {
    className?: string;
    children?: ReactNode;
}

interface CardContentProps {
    className?: string;
    children?: ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={twMerge(
                'rounded-lg border bg-card text-card-foreground shadow-sm',
                className
            )}
        >
            {children}
        </div>
    );
};

const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
    return <div className={twMerge('flex flex-col space-y-1.5 p-6', className)}>{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
    return (
        <h3
            className={twMerge(
                'text-2xl font-semibold leading-none tracking-tight text-center',
                className
            )}
        >
            {children}
        </h3>
    );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ className, children }) => {
    return (
        <p className={twMerge('text-sm text-muted-foreground', className)}>{children}</p>
    );
};

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
    return <div className={twMerge('p-6 pt-0', className)}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
