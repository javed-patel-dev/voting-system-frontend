import { FC, ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="p-4 text-center text-red-600">
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={resetErrorBoundary}
            >
                Try Again
            </button>
        </div>
    );
};

interface GlobalErrorBoundaryProps {
    children: ReactNode;
}

export const GlobalErrorBoundary: FC<GlobalErrorBoundaryProps> = ({ children }) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Optional: reset global state, redux store, etc.
                window.location.reload();
            }}
        >
            {children}
        </ErrorBoundary>
    );
};
