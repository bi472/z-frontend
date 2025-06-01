import React from 'react';

interface InputProps {
    icon: React.ElementType;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({ icon: Icon, value, onChange, placeholder }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: "none" }}>
            <Icon />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ marginLeft: '10px', padding: '5px', width: '100%' }}
            />
        </div>
    );
};

export default Input;
