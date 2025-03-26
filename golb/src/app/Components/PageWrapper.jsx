// components/ui/PageWrapper.jsx
export default function PageWrapper({ children }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
        {children}
      </div>
    );
  }
  