import { useState } from "react";
import "./shorten.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function Shorten() {
  const [url, setUrl] = useState("");
  const [nomePersonalizado, setNomePersonalizado] = useState("");
  const [urlFinal, setUrlFinal] = useState("");
  //https://cutt.ly/api/api.php?key=[API_KEY]&short=$url&name=[CUSTOM_URL_ALIAS]
  async function short() {
    if (url.includes("https://") || url.includes("http://")) {
      await fetch(
        `https://enigmatic-garden-34822.herokuapp.com/https://cutt.ly/api/api.php?key=b8137d9e869de98c4c0f58631ee732d169e40&short=${url}&name=${nomePersonalizado}`
      ).then(async (response) => {
        const data = await response.json();
        if (data.url.status === 3) {
          toast.error("OPS! Este nome ja está em uso!");
          return;
        }
        if (data.url.status === 2) {
          toast.error("OPS! Url invalida");
          return;
        }
        console.log(data);
        setUrlFinal(data.url.shortLink);
        toast.success("URL encurtada");
        setNomePersonalizado("");
        setUrl("");
      });
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          url<div>Shorten</div>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="https://google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome Personalizado"
            value={nomePersonalizado}
            onChange={(e) => setNomePersonalizado(e.target.value)}
          />
          <button onClick={short}>Gerar URL</button>
          <a href={urlFinal} target="_blank">
            <h3>{urlFinal}</h3>
          </a>
        </div>

        <Link to="/register">Criar uma conta!</Link>
        <Link to="/signin">Já possui uma conta? Entre</Link>
      </div>
    </div>
  );
}

export default Shorten;
