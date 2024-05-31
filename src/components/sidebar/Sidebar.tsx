import styles from "./Sidebar.module.css";
import { FaHome, FaBell, FaBookmark, FaUser } from 'react-icons/fa';
import logo from '../../assets/logo.png'
import SidebarItem from "./sidebarItem/SidebarItem";
import { isLoggedIn } from "../../utils/loginCheck";
import Button from "../global/Button";
import { UserPresenter } from "../../presenters/UserPresenter";
import { error } from "console";
import { get } from "http";
import { getUUIDFromToken } from "../../utils/getUUIDFromToken";


const Sidebar = () => {

    const userPresenter = new UserPresenter()

    const handleHome = () => {
        window.location.href = '/'
    };

    const handleNotifications = () => {
        window.location.href = '/notifications'
    };

    const handleBookmarks = () => {
        window.location.href = '/bookmarks'
    };

    const handleProfile = () => {
        userPresenter.me().then((user) => {
            window.location.href = `/profile/${user.username}`
        }).catch((error) => {
            console.log(error)
            alert('An error occurred')
        })
    };
    
    const handleLogout = () => {
        userPresenter.logout()
            .then(() => {
                alert('You have been logged out!');
                window.location.href = '/';
            })
            .catch(
                (error) => {
                    console.log(error)
                    alert('Your login session is expired you will be redirected to login page.')
                    window.location.href = '/login'
            });

    };

    const handleLogin = () => {
        window.location.href = '/login'
    }

    const handleSignUp = () => {
        window.location.href = '/register'
    }

    const sidebarItems = [
        { name: 'Home', icon: FaHome, onClick: handleHome },
        ...(isLoggedIn() ? [
            { name: 'Notifications', icon: FaBell, onClick: handleNotifications },
            { name: 'Bookmarks', icon: FaBookmark, onClick: handleBookmarks },
            { name: 'Profile', icon: FaUser, onClick: handleProfile }
        ] : [])
    ];

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" className={styles.logo}/>
            </div>
            <div className={styles.sidebar}>
                {sidebarItems.map((item, index) => (
                    <SidebarItem key={index} name={item.name} icon={item.icon} onClick={item.onClick}/>
                ))}
            </div>
            <div className={styles.authButtons}>
                    {isLoggedIn() ? 
                        <Button onClick={handleLogout}>
                            Logout
                        </Button>
                        :
                        <div className={styles.loginAndSignUpButtons}>
                            <Button onClick={handleLogin}>
                                Login
                            </Button>
                            <Button onClick={handleSignUp}>
                                Sign Up
                            </Button>
                        </div>
                        }
                </div>
        </div>
    );
};

export default Sidebar;