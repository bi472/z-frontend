import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { UserPresenter } from '../../presenters/UserPresenter';
import AuthForm from "../../components/auth/AuthForm";
import { AuthDTO } from "../../types/AuthDto";

const LoginPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const userPresenter = new UserPresenter();
    const navigate = useNavigate();

    // Update title when component mounts
    useEffect(() => {
        document.title = `${t('auth.login')} | Z Social`;
        
        return () => {
            document.title = 'Z Social';
        };
    }, [t]);

    // Listen for language changes
    useEffect(() => {
        // This effect will run whenever i18n.language changes
        // and will update any dynamic content that depends on translations
    }, [i18n.language]);

    const handleLogin = async (authDto: AuthDTO) => {
        const username = authDto.username;
        const password = authDto.password;
        
        userPresenter.login({ username, password })
            .then(() => {
                alert(t('auth.loginSuccess'));
                navigate('/');
            }).catch((error) => {
                if (error.response && error.response.status === 401) {
                    alert(t('auth.invalidCredentials'));
                } else {
                    alert(t('auth.error'));
                }
            });
    };

    return (
        <div key={`login-${i18n.language}`}>
            <AuthForm 
                handleAuth={handleLogin} 
                title={t('auth.login')} 
                buttonText={t('auth.login')} 
                showRegisterLink={true}
            />
        </div>
    );
};

export default LoginPage;
