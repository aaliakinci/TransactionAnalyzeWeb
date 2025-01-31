import { createContext, useContext, useState, ReactNode } from 'react';


// Create the context with a default value
const UploadContext = createContext(undefined);

// Provider component
export const UploadProvider = ({ children }) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(null);

    return (
        <UploadContext.Provider value={{ response, setResponse, loading, setLoading }}>
            {children}
        </UploadContext.Provider>
    );
};

// Hook to use context in components
export const useUploadContext = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUploadContext must be used within an UploadProvider');
    }
    return context;
};
