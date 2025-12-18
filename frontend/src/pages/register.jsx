import { useState } from 'react';
import API from '../api';
import './auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/auth/register', { name, email, password });
            alert('Cuenta creada. Ya puedes iniciar sesión.');
            window.location.href = '/login';
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Error'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Registrarse</button>
                </form>
                <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
        </div>
    );
}

export default Register;