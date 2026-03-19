import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Monitor, Smartphone } from 'lucide-react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [plataforma, setPlataforma] = useState('web');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Llamada a tu API real en el puerto 3000
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario, password: password })
            });

            const data = await res.json();

            if (res.ok) {
                // Pasamos el rol a minúsculas para manejarlo más fácil
                const rol = data.usuario.rol.toLowerCase();

                if (plataforma === 'movil') {
                    // Validamos que solo los meseros usen la vista móvil
                    if (rol === 'mesero') {
                        // Enviamos el token seguro por la URL al puerto de React Native
                        window.location.href = `http://localhost:8081/?token=${data.token}`;
                    } else {
                        setError('La plataforma móvil es exclusiva para meseros.');
                    }
                } else {
                    // Guardamos el token en la web para seguridad
                    localStorage.setItem('token', data.token);

                    // Ajustamos el nombre del rol para que App.jsx lo entienda bien
                    const rolWeb = rol === 'cocinero' ? 'cocina' : rol;
                    onLogin(rolWeb, plataforma);
                }
            } else {
                setError(data.error || 'Credenciales incorrectas. Intenta de nuevo.');
            }
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError('No hay conexión con el servidor. Verifica que esté encendido.');
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
                                placeholder="Usuario (Email)"
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