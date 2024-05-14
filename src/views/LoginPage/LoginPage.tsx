import React from 'react';
import  styles from './LoginPage.module.css';

import { UserPresenter } from '../../presenters/UserPresenter';
import AuthForm from "../../components/AuthForm";
import {AuthDTO} from "../../types/AuthDto";

const LoginPage: React.FC = () => {

    const userPresenter = new UserPresenter();
    const handleLogin = async (authDto: AuthDTO) => {

        const username = authDto.username;
        const password = authDto.password;

        userPresenter.login({ username, password })
            .then(() => {
                alert('Login successful');
                window.location.href = '/';
            }).catch((error) => {
            if (error.response.status === 401) {
                alert('Invalid Credentials');
            } else {
                alert('An error occurred');
            }
        });
    };

    return (
        <div>
            <AuthForm handleAuth={handleLogin} title={"Login"} buttonText={"Login"}></AuthForm>
            <p className={styles.register_label} onClick={() => window.location.href = '/register'}>Don't have an account? Register here.</p>
        </div>
    );
};

export default LoginPage;