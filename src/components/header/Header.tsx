import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
                <div className={styles.headerItem}>For you</div>
                <div className={styles.headerItem}>Following</div>
        </div>
    );
}

export default Header;