import Profile from "../../components/Profile";


const ProfilePage: React.FC = () => {
    return (
        <div>
            <Profile username="username" bio="bio" profileImageUrl="https://via.placeholder.com/150" />
        </div>
    );
}

export default ProfilePage;