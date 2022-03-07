import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";

import "./profile.css";
import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from "../../assets/avatar.png";

import { FiSettings, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, signOut, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);


  

  async function handleSave(e) {
    e.preventDefault();

      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          nome: nome,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };
          setUser(data);
          storageUser(data);
          toast.success("Nome alterado com sucesso");
        });
    }
  

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            

            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
