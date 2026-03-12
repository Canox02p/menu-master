import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Monitor, Smartphone } from 'lucide-react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [plataforma, setPlataforma] = useState('web'); // 'web' o 'movil'
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const userLower = usuario.toLowerCase();

        // Enviamos el rol y la plataforma seleccionada
        if (userLower === 'admin' && password === '1234') {
            onLogin('admin', plataforma);
        } else if (userLower === 'cocinero' && password === '1234') {
            onLogin('cocina', plataforma);
        } else if (userLower === 'mesero' && password === '1234') {
            onLogin('mesero', plataforma);
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="brand-header">
                <img src="/logo_sin_letras.png" alt="Logo" className="brand-logo" />
                <h1 className="brand-title">Menu <span>Master</span></h1>
            </div>

            <div className="login-container">
                <div className="login-card">
                    {/* --- SELECTOR DE PLATAFORMA --- */}
                    <div className="platform-selector">
                        <button
                            type="button"
                            className={plataforma === 'web' ? 'active' : ''}
                            onClick={() => setPlataforma('web')}
                        >
                            <Monitor size={18} /> Web
                        </button>
                        <button
                            type="button"
                            className={plataforma === 'movil' ? 'active' : ''}
                            onClick={() => setPlataforma('movil')}
                        >
                            <Smartphone size={18} /> Móvil
                        </button>
                    </div>

                    <h3>Iniciar Sesión</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Usuario"
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
                            INGRESAR ({plataforma.toUpperCase()})
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