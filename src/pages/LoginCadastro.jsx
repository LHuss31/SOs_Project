import React, { useState } from 'react';
import './LoginCadastro.css';
import { useNavigate } from 'react-router-dom';

function Conta() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');
    const navigate = useNavigate();

    const handleCriarConta = async (e) => {
        e.preventDefault();
        if (senha !== confirmacaoSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        try {
            const response = await fetch('/api/auth/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/welcome');
            } else {
                alert(data.message || 'Erro ao criar conta');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/homepage');
            } else {
                alert(data.message || 'Erro ao fazer login');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor');
        }
    };

    return (
        <div className="container">
            <div className="Header">
                <h1>FINANCE</h1>
            </div>
            <div className="Login-container">
                <div className="criar_conta">
                    <h2>Crie sua conta</h2>
                    <form onSubmit={handleCriarConta}>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirmação de senha"
                            value={confirmacaoSenha}
                            onChange={(e) => setConfirmacaoSenha(e.target.value)}
                        />
                        <button type="submit">Criar conta</button>
                    </form>
                </div>
                <div className="login">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={loginSenha}
                            onChange={(e) => setLoginSenha(e.target.value)}
                        />
                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Conta;