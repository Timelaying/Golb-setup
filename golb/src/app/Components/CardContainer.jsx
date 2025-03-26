// components/ui/CardContainer.jsx
export default function CardContainer({ children, className = "" }) {
    return (
      <div className={`max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-md ${className}`}>
        {children}
      </div>
    );
  }
  
