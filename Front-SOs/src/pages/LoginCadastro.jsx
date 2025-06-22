import React, { useState } from 'react'; // Importa o React e o hook useState para manipulação de estados locais
import './LoginCadastro.css'; // Importa o CSS da página de login e cadastro
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para redirecionamento de páginas

function Conta() {
    // Estados para o formulário de cadastro
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');

    // Estados para o formulário de login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');

    const navigate = useNavigate(); // Hook para redirecionamento de rota

    // Função para lidar com o envio do formulário de criação de conta
    const handleCriarConta = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página

        // Verifica se as senhas são iguais
        if (senha !== confirmacaoSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            // Envia requisição POST para endpoint de cadastro
            const response = await fetch('/api/auth/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            // Se o cadastro foi bem-sucedido
            if (response.ok) {
                localStorage.setItem('token', data.token); // Armazena o token no localStorage
                navigate('/Dashboard'); // Redireciona para a dashboard
            } else {
                alert(data.message || 'Erro ao criar conta'); // Exibe erro retornado pelo servidor
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor'); // Exibe erro de rede
        }
    };

    // Função para lidar com o envio do formulário de login
    const handleLogin = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão

        try {
            // Envia requisição POST para endpoint de login
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
            });

            const data = await response.json();

            // Se o login foi bem-sucedido
            if (response.ok) {
                localStorage.setItem('token', data.token); // Armazena o token no localStorage
                navigate('/Dashboard'); // Redireciona para a dashboard
            } else {
                alert(data.message || 'Erro ao fazer login'); // Exibe mensagem de erro
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor'); // Erro de conexão
        }
    };

    // JSX da página com formulários de cadastro e login
    return (
        <div className="containerL">
            <div className="HeaderL">
                <h1>OS LEARNING LAB</h1> {/* Título da página */}
            </div>
            <div className="Login-containerL">
                <div className="criar_contaL">
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
                <div className="loginL">
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

export default Conta; // Exporta o componente para ser utilizado em outras partes da aplicação
