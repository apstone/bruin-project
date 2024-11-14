'use client';

import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Spinner } from './Spinner';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'blue' | 'green' | 'red' | 'gray';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'solid',
  color = 'blue',
  isLoading = false,
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out focus:outline-none flex items-center justify-center';

  const variantClasses = {
    solid: 'text-white',
    outline: 'border-2',
    ghost: 'bg-transparent',
  };

  const colorClasses = {
    blue: variant === 'solid' ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-100',
    green: variant === 'solid' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600 hover:bg-green-100',
    red: variant === 'solid' ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 hover:bg-red-100',
    gray: variant === 'solid' ? 'bg-gray-600 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classNames(
        baseClasses,
        variantClasses[variant],
        colorClasses[color],
        fullWidth ? 'w-full' : 'inline-flex',
        { 'cursor-not-allowed opacity-70': disabled || isLoading }
      )}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;

