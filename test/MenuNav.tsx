"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
// import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuItem {
    id: string;
    name: string;
    path: string;
    icon?: string;
};


export default function MenuNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [menu, setMenu] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const res = await fetch("http://localhost:4000/menu");
            const data = await res.json();
            // console.log(data);
            if (Array.isArray(data)) {
                setMenu(data);
            }
            else if (data && Array.isArray(data.menu)) {
                setMenu(data.menu);
            }
            else {
                setMenu([]);
            }
        };
        fetchMenu();
        return () => {
            console.log("unmount");
            setMenu([]);
        }
    }, []);

    function handleMenuClick(e : React.MouseEvent<HTMLDivElement>, item : MenuItem){
        console.log(item.path);
        router.push(item.path);
    }

    return (

        <>
            {menu.map((m) => (
                <ListItem key={m.id} disablePadding>
                    <ListItemButton selected={pathname === m.path} onClick={(e) => handleMenuClick(e, m)}>
                        <ListItemText primary={m.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </>
    );
}







