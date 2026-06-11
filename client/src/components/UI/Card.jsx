import React from 'react'

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card card-hover w-full max-w-md ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-5 flex flex-col gap-1 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h2 className={`text-xl font-800 text-gray-900 tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`flex-1 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`mt-5 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  )
}
