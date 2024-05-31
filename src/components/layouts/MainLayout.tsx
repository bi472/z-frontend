import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import styles from './MainLayout.module.css';
import { FaSearch } from 'react-icons/fa';
import Input from '../global/Input';
import {UserPresenter} from '../../presenters/UserPresenter';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const userPresenter = new UserPresenter();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            userPresenter.getAllUsers().then((users) => {
                const filteredUsers = users
                    .map(user => user.username)
                    .filter(username => username.toLowerCase().includes(searchTerm.toLowerCase()));
                setSearchResults(filteredUsers);
            });
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleUserClick = (username: string) => {
        setSearchTerm('');
        navigate(`/profile/${username}`);
    };

    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.centerSection}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.searchBar}>
                    <Input icon={FaSearch} value={searchTerm} onChange={handleSearchChange} />
                    {searchResults.length > 0 && (
                        <ul className={styles.searchResults}>
                            {searchResults.map((username) => (
                                <li
                                    key={username}
                                    onClick={() => handleUserClick(username)}
                                    className={styles.searchResultItem}
                                >
                                    {username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
