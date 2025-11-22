'use client';
import React, { useState } from 'react';
import { User } from '@/lib/prisma/definitions';
import { login, register } from '@/lib/actions';
import { Eye, EyeOff, BookOpen, Loader2 } from 'lucide-react';

interface LandingScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isLoginView && !formData.name) {
        newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
        let user: User | null;
        if (isLoginView) {
            user = await login(formData.email, formData.password);
            if (!user) {
                throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
            }
        } else {
            user = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                avatarUrl: `https://i.pravatar.cc/150?u=${formData.email}`
            });
        }
        onLoginSuccess(user);
    } catch (error: any) {
        setErrors({ form: error.message || "Ocorreu um erro. Tente novamente." });
    } finally {
        setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
     if (errors.form) {
      setErrors({});
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-zinc-100 dark:border-zinc-700">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                LitBook
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Sua biblioteca digital pessoal
              </p>
            </div>
            
            <div className="pt-2">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {isLoginView ? 'Entre para continuar sua jornada literária' : 'Comece a explorar o mundo da leitura.'}
              </p>
            </div>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
                 <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Nome
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                            errors.name 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500'
                        } bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`}
                        placeholder="Seu nome completo"
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.name}
                        </p>
                    )}
                </div>
            )}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500'
                } bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>
            
            {errors.form && (
                <p className="text-sm text-red-500 text-center flex items-center gap-1 justify-center">
                  <span>⚠</span> {errors.form}
                </p>
            )}

            {isLoginView && <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Esqueceu sua senha?
              </button>
            </div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLoginView ? 'Entrando...' : 'Registrando...'}
                </>
              ) : (
                isLoginView ? 'Entrar' : 'Criar Conta'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                ou
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                type="button"
                onClick={toggleView}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {isLoginView ? 'Registre-se gratuitamente' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          Ao entrar, você concorda com nossos{' '}
          <button className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            Termos de Uso
          </button>{' '}
          e{' '}
          <button className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            Política de Privacidade
          </button>
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
