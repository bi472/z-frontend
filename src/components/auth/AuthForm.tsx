import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from "./AuthForm.module.css";
import Button from "../global/Button";
import { AuthDTO } from "../../types/AuthDto";
import LanguageSwitcher from "../global/LanguageSwitcher";

interface AuthFormProps {
    handleAuth: (authDto: AuthDTO) => void;
    title: string;
    buttonText: string;
    showRegisterLink?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ handleAuth, title, buttonText, showRegisterLink }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Effect to re-render when language changes
    useEffect(() => {
        // This will cause the component to re-render when language changes
    }, [i18n.language]);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAuth({ username, password });
    };
    
    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className={styles.container} key={`auth-form-${i18n.language}`}>
            <div className={styles.languageSwitcherContainer}>
                <LanguageSwitcher />
            </div>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <label htmlFor="username">{t('auth.username')}:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder={t('auth.username')}
                        required
                        aria-label={t('auth.username')}
                    />
                    <label htmlFor="password">{t('auth.password')}:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={t('auth.password')}
                        required
                        aria-label={t('auth.password')}
                    />
                    <Button type="submit">{buttonText}</Button>
                </div>
            </form>
            {
                showRegisterLink && (
                    <p 
                        className={styles.register_label} 
                        onClick={handleRegisterClick}
                        role="button"
                        tabIndex={0}
                    >
                        {t('auth.registerLink')}
                    </p>
                )
            }
        </div>
    );
};

export default AuthForm;
