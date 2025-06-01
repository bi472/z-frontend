import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserPresenter } from '../../presenters/UserPresenter';
import AuthForm from "../../components/auth/AuthForm";
import { AuthDTO } from "../../types/AuthDto";

const RegisterPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const userPresenter = new UserPresenter();
    const navigate = useNavigate();

    // Update title when component mounts
    useEffect(() => {
        document.title = `${t('auth.register')} | Z Social`;
        
        return () => {
            document.title = 'Z Social';
        };
    }, [t]);

    // Listen for language changes
    useEffect(() => {
        // This effect will run whenever i18n.language changes
        // and will update any dynamic content that depends on translations
    }, [i18n.language]);

    const handleRegister = async (authDto: AuthDTO) => {
        try {
            const username = authDto.username;
            const password = authDto.password;
            await userPresenter.register({ username, password });
            alert(t('auth.registerSuccess'));
            await userPresenter.login({ username, password });
            navigate('/');
        } catch (error: Error | any) {
            console.log(error);
            if (error.response && error.response.status === 409) {
                alert(t('auth.usernameExists'));
            } else {
                alert(t('auth.error'));
            }
        }
    };

    return (
        <div key={`register-${i18n.language}`}>
            <AuthForm 
                handleAuth={handleRegister} 
                title={t('auth.register')} 
                buttonText={t('auth.register')} 
            />
        </div>
    );
};

export default RegisterPage;
