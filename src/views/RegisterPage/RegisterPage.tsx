import React from 'react';
import { UserPresenter } from '../../presenters/UserPresenter';
import AuthForm from "../../components/auth/AuthForm";
import {AuthDTO} from "../../types/AuthDto";

const RegisterPage: React.FC = () => {

    const userPresenter = new UserPresenter();
    const handleRegister = async (authDto: AuthDTO) => {
        try {
            const username = authDto.username;
            const password = authDto.password;
            await userPresenter.register({ username, password });
            alert('User registered successfully. You will be automatically logged in.');
            await userPresenter.login({ username, password });
            window.location.href = '/';
        } catch (error: Error | any) {
            console.log(error);
            if (error.response && error.response.status === 409) {
                alert('Username already exists. Please choose another username.');
            } else {
                alert('An error occurred');
            }
        }
    };

    return (
        <AuthForm handleAuth={handleRegister} title={"Register page"} buttonText={"Register"}></AuthForm>
    );
};

export default RegisterPage;