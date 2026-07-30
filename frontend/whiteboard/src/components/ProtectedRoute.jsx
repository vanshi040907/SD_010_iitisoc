import react, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import conf from '../conf/conf';

export default function ProtectedRoute({ children }) {
    const [authState, setAuthState] = useState('checking');

    useEffect(() => {
        fetch(`${conf.path}/user/me`, {
            credentials: 'include',
            cache: 'no-store'
        })
            .then((res) => {
                if (res.ok) {
                    setAuthState('authed');
                } else {
                    setAuthState('unauthed');
                }
            })
            .catch(() => setAuthState('unauthed'));
    }, []);

    if (authState === 'checking') {
        return <div className="text-white text-center mt-20">Loading...</div>;
    }

    if (authState === 'unauthed') {
        return <Navigate to="/login" replace />;
    }

    return children;
}