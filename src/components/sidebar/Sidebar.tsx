import styles from "./Sidebar.module.css";
import { FaHome, FaBell, FaBookmark, FaUser } from 'react-icons/fa';
import logo from '../../assets/logo.png'
import SidebarItem from "./sidebarItem/SidebarItem";


const Sidebar = () => {

    const sidebarItems = [
        { name: 'Home', icon: FaHome },
        { name: 'Notifications', icon: FaBell },
        { name: 'Bookmarks', icon: FaBookmark },
        { name: 'Profile', icon: FaUser },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" className={styles.logo}/>
            </div>
            <div className={styles.sidebar}>
                {sidebarItems.map((item, index) => (
                    <SidebarItem key={index} name={item.name} icon={item.icon} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;