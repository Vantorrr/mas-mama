'use client';

import { useState } from 'react';
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    relative overflow-hidden font-medium transition-all duration-300 
    transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-amber-500 to-yellow-500 text-white
      hover:from-amber-600 hover:to-yellow-600 hover:scale-105
      focus:ring-amber-400 shadow-lg hover:shadow-xl
      before:absolute before:inset-0 before:bg-white before:opacity-0 
      before:transition-opacity before:duration-300 hover:before:opacity-20
    `,
    secondary: `
      border-2 border-[#8b7355] text-[#8b7355] bg-transparent
      hover:bg-[#8b7355] hover:text-white hover:scale-105
      focus:ring-[#8b7355] shadow-md hover:shadow-lg
    `,
    ghost: `
      text-[#6b4e3d] bg-transparent hover:bg-[#f8f3ed] 
      hover:scale-105 focus:ring-[#8b7355]
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {/* Анимированный фон */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                   transform -skew-x-12 -translate-x-full transition-transform duration-700 
                   ${isHovered && !disabled ? 'translate-x-full' : ''}`}
      />
      
      {/* Контент */}
      <div className="relative flex items-center gap-2 z-10">
        {icon && (
          <div className={`transition-transform duration-300 ${
            isHovered ? 'scale-110 rotate-12' : ''
          }`}>
            {icon}
          </div>
        )}
        <span className={`transition-all duration-300 ${isPressed ? 'scale-95' : ''}`}>
          {children}
        </span>
      </div>
      
      {/* Пульсирующий эффект */}
      <div 
        className={`absolute inset-0 rounded-full bg-white/30 scale-0 
                   transition-transform duration-300 ${
                     isPressed ? 'scale-150' : ''
                   }`}
      />
    </>
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {content}
    </button>
  );
}
