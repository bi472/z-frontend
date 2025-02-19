import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserPresenter } from "../../presenters/UserPresenter";
import Input from "../global/Input";
import styles from "./SearchUserBar.module.css";

const SearchUserBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
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
        setSearchTerm("");
        navigate(`/profile/${username}`);
    };

    return (
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
    );
};

export default SearchUserBar;
