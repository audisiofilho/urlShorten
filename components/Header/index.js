import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import avatar from "../../assets/avatar.png";
import "./header.css";

import { Link } from "react-router-dom";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="logo">
        url<h2>Shorten</h2>
      </div>
      
      <Link to="/dashboard">
        <FiHome color="#fff" size={24} />
        Ver Urls
      </Link>

      <Link to="/profile">
        <FiSettings color="#fff" size={24} />
        Configurações
      </Link>
    </div>
  );
}
