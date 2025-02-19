import SearchBar from "../../components/searchbar/SearchUserBar"; // Подключаем существующий компонент поиска
import styles from "./SearchPage.module.css";

const SearchPage = () => {
    return (
        <div className={styles.searchContainer}>
            <SearchBar />
        </div>
    );
};

export default SearchPage;
