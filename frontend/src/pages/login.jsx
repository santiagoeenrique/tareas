import { useState } from 'react';
import API from '../api';
import './auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Error de conexión'));
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>¡Hola de nuevo!</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
            </div>
        </div>
    );
}

export default Login;