import { useEffect, useState } from "react";
import { api } from "../api/axios";

export function HealthCheckPage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function checkHealth() {
            try {
                const response = await api.get("/health")
                setMessage(response.data.message);
            }
            catch {
                setError('Error');
            }
        }
        checkHealth();
    }, []);

    return (
        <>
            <h1>Secure Event System</h1>
            <h2>Backend Health Check</h2>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </>

    )
};