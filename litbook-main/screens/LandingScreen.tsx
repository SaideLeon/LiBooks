import React, { useState } from 'react';
import { User } from '@prisma/client';
import { login, register } from '../api';

const Logo: React.FC = () => (
    <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-primary">import_contacts</span>
        <span className="text-2xl font-bold text-text-light dark:text-text-dark">LitBook</span>
    </div>
);

interface LandingScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result: User | null = null;
      if (isLoginView) {
        result = await login(email, password);
        if (!result) {
            throw new Error("E-mail ou senha inválidos.");
        }
      } else {
        result = await register({ name, email, password });
      }
      
      onLoginSuccess(result);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh w-screen text-text-light dark:text-text-dark flex flex-col max-w-lg mx-auto bg-background-light dark:bg-background-dark">
      <main className="flex-grow overflow-y-auto p-6 flex flex-col justify-center">
        <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="text-2xl font-bold mt-6">
              {isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
              {isLoginView ? 'Entre para continuar sua jornada.' : 'Comece a explorar o mundo da leitura.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {!isLoginView && (
            <div>
              <label className="text-sm font-medium" htmlFor="name">Nome</label>
              <input 
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-zinc-300 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:border-primary focus:ring-primary"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border-zinc-300 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border-zinc-300 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:border-primary focus:ring-primary"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isLoading ? 'Carregando...' : (isLoginView ? 'Entrar' : 'Registrar')}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-primary hover:underline">
                {isLoginView ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre'}
            </button>
        </div>
      </main>
    </div>
  );
};

export default LandingScreen;
