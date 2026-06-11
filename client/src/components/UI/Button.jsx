import React from 'react'

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'py-2.5 px-4.5 text-sm',
    md: 'py-3.5 px-6 text-base',
    lg: 'py-4.5 px-9 text-lg'
  }

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-orange',
    outline: 'btn-outline',
    ghost: 'inline-flex items-center justify-center font-semibold text-base text-gray-500 hover:text-gray-800 hover:bg-black/5 rounded-xl px-5 py-3 transition-all cursor-pointer'
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Spinner />
          Processing...
        </span>
      ) : children}
    </button>
  )
}

export default Button
