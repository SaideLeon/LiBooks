import React, { useState, useEffect, useCallback } from 'react';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="px-4 pb-2 text-sm font-semibold uppercase text-text-muted-light dark:text-text-muted-dark tracking-wider">
    {title}
  </h2>
);

const SettingsItem: React.FC<{ icon: string; title: string; children?: React.ReactNode; isButton?: boolean; onClick?: () => void, isDestructive?: boolean }> = ({ icon, title, children, isButton, onClick, isDestructive }) => {
    const content = (
        <div className="flex items-center justify-between gap-4 p-4 min-h-[68px]">
            <div className="flex items-center gap-4">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <p className={`text-base font-normal ${isDestructive ? 'text-red-500' : 'text-text-light dark:text-text-dark'}`}>{title}</p>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
    
    if (isButton) {
        return <button onClick={onClick} className="w-full text-left transition-colors hover:bg-zinc-500/5">{content}</button>
    }
    return content;
};

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark ${checked ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-600'}`}
    role="switch"
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    ></span>
  </button>
);

type Theme = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');

    const applyTheme = useCallback((selectedTheme: Theme) => {
        if (selectedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else if (selectedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);


    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = storedTheme || 'system';
        setTheme(initialTheme);
        applyTheme(initialTheme);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [applyTheme]);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    const getButtonClass = (buttonTheme: Theme) => {
        return `rounded-md px-3 py-1 text-sm font-medium transition-colors flex-1 ${
            theme === buttonTheme
                ? 'bg-card-light dark:bg-zinc-700 text-secondary shadow-sm font-semibold'
                : 'text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10'
        }`;
    };

    return (
        <div className="flex items-center rounded-lg bg-background-light p-1 dark:bg-background-dark ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700">
            <button onClick={() => handleThemeChange('light')} className={getButtonClass('light')}>Claro</button>
            <button onClick={() => handleThemeChange('dark')} className={getButtonClass('dark')}>Escuro</button>
            <button onClick={() => handleThemeChange('system')} className={getButtonClass('system')}>Sistema</button>
        </div>
    );
};

interface SettingsScreenProps {
    onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
    const [dailyReminder, setDailyReminder] = useState(true);
    const [newsUpdates, setNewsUpdates] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-full">
            <header className="sticky top-0 z-10 flex h-16 items-center border-b border-card-light/50 bg-background-light/80 px-4 backdrop-blur-sm dark:border-card-dark/50 dark:bg-background-dark/80">
                <h1 className="w-full text-center text-xl font-bold text-text-light dark:text-text-dark">Ajustes</h1>
            </header>
            <main className="flex-1 pb-24">
                <div className="p-4 space-y-6">
                    <section>
                        <SectionHeader title="Aparência" />
                        <div className="overflow-hidden rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
                            <SettingsItem icon="contrast" title="Tema">
                                <ThemeSwitcher />
                            </SettingsItem>
                        </div>
                    </section>
                    
                    <section>
                        <SectionHeader title="Notificações" />
                        <div className="overflow-hidden rounded-xl bg-card-light dark:bg-card-dark shadow-sm divide-y divide-zinc-200 dark:divide-zinc-800">
                            <SettingsItem icon="schedule" title="Lembrete Diário de Leitura">
                                <Switch checked={dailyReminder} onChange={setDailyReminder} />
                            </SettingsItem>
                            <SettingsItem icon="campaign" title="Notícias e Atualizações">
                                <Switch checked={newsUpdates} onChange={setNewsUpdates} />
                            </SettingsItem>
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Conta" />
                        <div className="overflow-hidden rounded-xl bg-card-light dark:bg-card-dark shadow-sm divide-y divide-zinc-200 dark:divide-zinc-800">
                            <SettingsItem icon="person" title="Meu Perfil" isButton>
                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">chevron_right</span>
                            </SettingsItem>
                            <SettingsItem icon="cloud_sync" title="Sincronização">
                                <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Ativada</span>
                            </SettingsItem>
                            <SettingsItem icon="logout" title="Sair" isButton isDestructive onClick={onLogout} />
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Sobre" />
                        <div className="overflow-hidden rounded-xl bg-card-light dark:bg-card-dark shadow-sm divide-y divide-zinc-200 dark:divide-zinc-800">
                            <SettingsItem icon="star" title="Avaliar o App" isButton>
                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">chevron_right</span>
                            </SettingsItem>
                            <SettingsItem icon="shield" title="Política de Privacidade" isButton>
                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">chevron_right</span>
                            </SettingsItem>
                            <SettingsItem icon="info" title="Versão do App">
                                <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">1.0.0</span>
                            </SettingsItem>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;
