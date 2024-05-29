import React from "react";
import styles from "./SidebarItem.module.css";
import { IconType } from "react-icons";

interface SidebarItemProps {
    icon : IconType;
    name: string;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({icon: Icon, name, onClick}) => {
    return (
        <div className={styles.item} onClick={onClick}>
            <Icon className={styles.icon}/>
            <div className={styles.name}>{name}</div>
        </div>
    );
}

export default SidebarItem;