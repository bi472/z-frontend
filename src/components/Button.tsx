import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
    return (
            <button className={styles.button} type="submit">
                {children}
            </button>
    );
};

export default Button;