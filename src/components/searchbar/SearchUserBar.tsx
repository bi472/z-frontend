import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserPresenter } from "../../presenters/UserPresenter";
import Input from "../global/Input";
import styles from "./SearchUserBar.module.css";

const SearchUserBar: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const userPresenter = new UserPresenter();
    const navigate = useNavigate();

    // Update state when language changes
    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

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
        setSearchTerm("");
        navigate(`/profile/${username}`);
    };

    return (
        <div className={styles.searchBar} key={`search-bar-${currentLanguage}`}>
            <Input 
                icon={FaSearch} 
                value={searchTerm} 
                onChange={handleSearchChange} 
                placeholder={t('search.searchUsers')}
                aria-label={t('search.searchUsers')}
            />
            {searchResults.length > 0 && (
                <ul className={styles.searchResults}>
                    {searchResults.map((username) => (
                        <li
                            key={username}
                            onClick={() => handleUserClick(username)}
                            className={styles.searchResultItem}
                            role="button"
                            tabIndex={0}
                            aria-label={`${username} ${t('profile.profile')}`}
                        >
                            {username}
                        </li>
                    ))}
                </ul>
            )}
            {searchTerm && searchResults.length === 0 && (
                <div className={styles.noResults}>{t('search.noResults')}</div>
            )}
        </div>
    );
};

export default SearchUserBar;
