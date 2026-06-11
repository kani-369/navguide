import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id}
          className="text-sm font-700 text-gray-500 uppercase tracking-wider pl-0.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`
            input-base
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-10' : 'pr-4'}
            ${error ? '!border-orange-400 !ring-2 !ring-orange-100' : ''}
          `}
          {...props}
        />

        {isPassword && (
          <button type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-orange-600 font-medium pl-0.5">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
