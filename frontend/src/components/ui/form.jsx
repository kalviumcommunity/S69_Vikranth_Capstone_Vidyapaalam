// import React, { createContext, useContext } from 'react';
// import { Controller, useFormContext } from 'react-hook-form';
// import { cn } from '@/lib/utils';

// const Form = ({ children, className, ...props }) => (
//   <form className={cn('space-y-6', className)} {...props}>
//     {children}
//   </form>
// );

// const FormItem = React.forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn('space-y-2', className)} {...props} />
// ));

// const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
//   <label ref={ref} className={cn('text-sm font-medium text-gray-700', className)} {...props} />
// ));

// const FormControl = React.forwardRef(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn('mt-2', className)} {...props} />
// ));

// const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
//   <p ref={ref} className={cn('text-sm font-medium text-red-500', className)} {...props}>
//     {children}
//   </p>
// ));

// const FormFieldContext = createContext();

// const FormField = ({ ...props }) => (
//   <FormFieldContext.Provider value={{ name: props.name }}>
//     <Controller {...props} />
//   </FormFieldContext.Provider>
// );

// export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField };


import React, { createContext, useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const Form = ({ children, className, ...props }) => (
  <form className={`space-y-6 ${className || ''}`} {...props}>
    {children}
  </form>
);

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`space-y-2 ${className || ''}`} {...props} />
));

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={`text-sm font-medium text-gray-700 ${className || ''}`} {...props} />
));

const FormControl = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`mt-2 ${className || ''}`} {...props} />
));

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={`text-sm font-medium text-red-500 ${className || ''}`} {...props}>
    {children}
  </p>
));

const FormFieldContext = createContext();

const FormField = ({ ...props }) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField };