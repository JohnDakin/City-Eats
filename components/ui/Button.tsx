import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-orange-600 focus:ring-brand-orange",
    secondary: "bg-brand-green text-white hover:bg-green-600 focus:ring-brand-green",
    outline: "border-2 border-brand-orange text-brand-orange hover:bg-orange-50 focus:ring-brand-orange",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-11 px-4 text-base", // 44px minimum touch target height for accessibility
    lg: "h-14 px-6 text-lg"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
