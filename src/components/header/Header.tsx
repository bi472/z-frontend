import styles from './Header.module.css';

interface HeaderProps {
    onFollowingTweet: () => void;
    onForYouTweet: () => void;
}

const Header: React.FC<HeaderProps> = ({onFollowingTweet, onForYouTweet}) => {
    return (
        <div className={styles.header}>
                <div className={styles.headerItem} onClick={onForYouTweet}>For you</div>
                <div className={styles.headerItem} onClick={onFollowingTweet}>Following</div>
        </div>
    );
}

export default Header;