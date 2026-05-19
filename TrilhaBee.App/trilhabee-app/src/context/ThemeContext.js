import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const TEMAS = {
    creme: {
        label: 'Creme (Padrão)',
        vars: {
            '--bg-pagina':      '#fefaf6',
            '--bg-card':        '#ffffff',
            '--bg-sidebar':     '#1a1a2e',
            '--bg-topbar':      '#1a1a2e',
            '--text-primario':  '#1a1a2e',
            '--text-secundario':'#8a8fa8',
            '--border-color':   '#f0ede8',
            '--stripe-a':       'rgba(251,188,5,0.06)',
            '--stripe-b':       'rgba(0,0,0,0.04)',
        }
    },
    escuro: {
        label: 'Escuro',
        vars: {
            '--bg-pagina':      '#121212',
            '--bg-card':        '#1e1e1e',
            '--bg-sidebar':     '#161616',
            '--bg-topbar':      '#161616',
            '--text-primario':  '#f0f0f5',
            '--text-secundario':'#8a8fa8',
            '--border-color':   '#2a2a3e',
            '--stripe-a':       'rgba(251,188,5,0.04)',
            '--stripe-b':       'rgba(255,255,255,0.02)',
        }
    },
    claro: {
        label: 'Claro',
        vars: {
            '--bg-pagina':      '#f4f6fa',
            '--bg-card':        '#ffffff',
            '--bg-sidebar':     '#ffffff',
            '--bg-topbar':      '#ffffff',
            '--text-primario':  '#111827',
            '--text-secundario':'#6b7280',
            '--border-color':   '#e5e7eb',
            '--stripe-a':       'rgba(251,188,5,0.03)',
            '--stripe-b':       'rgba(0,0,0,0.02)',
        }
    },
};

export const ThemeProvider = ({ children }) => {
    const [tema, setTema] = useState(() => {
        return localStorage.getItem('trilhabee_tema') || 'creme';
    });

    useEffect(() => {
        const config = TEMAS[tema] || TEMAS.creme;
        const root = document.documentElement;
        Object.entries(config.vars).forEach(([prop, val]) => {
            root.style.setProperty(prop, val);
        });
        document.body.setAttribute('data-tema', tema);
        localStorage.setItem('trilhabee_tema', tema);
    }, [tema]);

    return (
        <ThemeContext.Provider value={{ tema, setTema, temas: TEMAS }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTema = () => useContext(ThemeContext);
