import { useState, useEffect, useContext } from "react";
import firebase from "../../services/firebaseConnection";
import { useHistory, useParams } from "react-router-dom";

import { FiPlusCircle } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";

import "./new.css";
import { toast } from "react-toastify";

export default function New() {
  const history = useHistory();

  const [url, setUrl] = useState("");
  const [nomePersonalizado, setNomePersonalizado] = useState("");
  const [urlFinal, setUrlFinal] = useState("");
  const [load, setLoad] = useState(false);

  const { user } = useContext(AuthContext);

  async function handleRegister(e) {
    e.preventDefault();

    if (url.includes("https://") || url.includes("http://")) {
      setLoad(true);
      await fetch(
        `https://enigmatic-garden-34822.herokuapp.com/https://cutt.ly/api/api.php?key=b8137d9e869de98c4c0f58631ee732d169e40&short=${url}&name=${nomePersonalizado}`
      ).then(async (response) => {
        const data = await response.json();
        if (data.url.status === 3) {
          toast.error("OPS! Este nome ja está em uso!");
          setLoad(false);
          return;
        }
        if (data.url.status === 2) {
          toast.error("OPS! Url invalida");
          setLoad(false);
          return;
        }

        await firebase
          .firestore()
          .collection("urls")
          .add({
            userId: user.uid,
            shortLink: data.url.shortLink,
            fullLink: data.url.fullLink,
            nomePersonalizado: nomePersonalizado,
            title: data.url.title,
            created: new Date(),
          })
          .then(() => {
            setUrlFinal(data.url.shortLink);
            toast.success("URL encurtada");
            setNomePersonalizado("");
            setUrl("");
            setLoad(false);
          })
          .catch((error) => {
            toast.error("Ops! Erro ao gerar! Tente mais tarde!");
            console.log(error);
            setLoad(false);
          });
      });
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Nova Url">
          <FiPlusCircle size={25} />
        </Title>

        <div className="contaier">
          <form className="form-profile">
            <label>Url</label>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <label>Nome Personalizado</label>

            <input
              type="text"
              value={nomePersonalizado}
              onChange={(e) => setNomePersonalizado(e.target.value)}
            />
            {load ? (
              <button type="button" onClick={handleRegister} disabled>Gerando...</button>
            ) : (
              <button type="button" onClick={handleRegister} >Gerar Url</button>
            )}
            
            <a href={urlFinal} target="_blank">
              <h3>{urlFinal}</h3>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
