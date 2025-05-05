import React, { LabelHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
    const baseClasses = twMerge(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
    );
    return (
        <label
            ref={ref}
            className={baseClasses}
            {...props}
        />
    );
});
Label.displayName = 'Label';

export default Label;
