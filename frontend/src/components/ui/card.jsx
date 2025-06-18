export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  );
};
export const CardContent = ({ children, className = "" }) => {
  return <div className={`px-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return <div className={`px-6 pb-6 pt-4 ${className}`}>{children}</div>;
};

