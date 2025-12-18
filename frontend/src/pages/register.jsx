import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './auth.css';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/api/auth/register', formData);
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Error al registrarse'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Crea tu cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nombre" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Contraseña" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    <button type="submit">Registrarse</button>
                </form>
                <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
        </div>
    );
}

export default Register;