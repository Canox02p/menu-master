import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // 🚦 Lógica temporal de inicio de sesión
        const userLower = usuario.toLowerCase();

        if (userLower === 'admin' && password === '1234') {
            onLogin('admin');
        } else if (userLower === 'cocinero' && password === '1234') {
            onLogin('cocina');
        } else if (userLower === 'mesero' && password === '1234') {
            onLogin('mesero');
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="login-wrapper">

            {/* --- LOGO Y TÍTULO --- */}
            <div className="brand-header">
                {/* Asegúrate de que tu logo coincida con el de la imagen */}
                <img src="/logo_sin_letras.png" alt="Logo" className="brand-logo" onError={(e) => e.target.style.display = 'none'} />
                <h1 className="brand-title">Menu <span>Master</span></h1>
            </div>

            <div className="login-container">
                {/* --- LA TARJETA DE LOGIN --- */}
                <div className="login-card">
                    <h3>Iniciar Sesión</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Usuario / Correo electrónico"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn-eye"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                            >
                                {mostrarPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {error && <p className="error-msg">{error}</p>}

                        <button type="submit" className="btn-submit">
                            INICIAR SESIÓN
                        </button>
                    </form>

                    <div className="login-links">
                        <a href="#olvide">¿Olvidé mi contraseña?</a>
                        <a href="#soporte">Soporte técnico</a>
                    </div>
                </div>
            </div>
        </div>
    );
}