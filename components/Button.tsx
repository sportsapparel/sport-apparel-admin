import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean; // Add loading state
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false, // Default loading state is false
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading} // Disable button when loading
      className={`
        px-4 py-2 
        font-thin 
        bg-btnColor text-white 
        hover:bg-btnHoverColor  
        transition-colors 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-btnColor 
        focus:ring-offset-2 
        disabled:bg-btnColor/70 
        disabled:cursor-not-allowed 
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          {/* Loading Spinner */}
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
