import styles from './Input.module.css';
import { IconType } from 'react-icons';

interface InputProps {
    placeholder?: string;
    type?: string;
    icon: IconType;
}

const Input: React.FC<InputProps> = ({ placeholder, type, icon: Icon }) => {
    return (
        <div className={styles.searchBar}>
            <input
                type={type || 'text'}
                placeholder={placeholder || 'Search'}
                className={styles.input}
            />
            <div className={styles.icon}>
                <Icon />
            </div>
        </div>
    )
}

export default Input;