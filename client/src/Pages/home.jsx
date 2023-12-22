import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";

export default function Home() {
    
    const {auth, setAuth} = useAuth();
    
    return (
        <div>
            <pre>{JSON.stringify(auth, null, 4)}</pre>
        </div>
    );
}
