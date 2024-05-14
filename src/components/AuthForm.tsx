import React, {useState} from 'react';
import styles from "./AuthForm.module.css";
import Button from "./Button";
import {AuthDTO} from "../types/AuthDto";

interface AuthFormProps {
    handleAuth: (authDto: AuthDTO) => void;
    title: string;
    buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ handleAuth, title, buttonText }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAuth({ username, password });
    }

    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button>{buttonText}</Button>
                </div>
            </form>
        </div>
    )
}

export default AuthForm;