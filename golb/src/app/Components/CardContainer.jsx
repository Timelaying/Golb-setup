// components/ui/CardContainer.jsx
export default function CardContainer({ children, width = "max-w-2xl" }) {
    return (
      <div className={`${width} w-full bg-gray-800 p-6 rounded-lg shadow-md`}>
        {children}
      </div>
    );
  }