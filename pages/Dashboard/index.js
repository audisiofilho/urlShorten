import { useState, useEffect, useContext } from "react";
import "./dashboard.css";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiLink, FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { AuthContext } from "../../contexts/auth";

import firebase from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const { user } = useContext(AuthContext);

  const listRef = firebase
    .firestore()
    .collection("urls")
    .where("userId", "==", user?.uid)
    .orderBy("created", "desc");

  const listRefDelete = firebase.firestore().collection("urls");

  useEffect(() => {
    async function loadUrls() {
      await listRef
        .limit(100)
        .get()
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((err) => {
          console.log(err);
          setLoadingMore(false);
        });

      setLoading(false);
    }

    loadUrls();

    return () => {};
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          title: doc.data().title,
          fullLink: doc.data().fullLink,
          nomePersonalizado: doc.data().nomePersonalizado,
          shortLink: doc.data().shortLink,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      setUrls((urls) => [...urls, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    await listRef
      .startAfter(lastDocs)
      .limit(100)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      });
  }

  async function handleDelete(item) {
    console.log(item.id);
    await listRefDelete
      .doc(item.id)
      .delete()
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        toast.error("algo deu errado");
      });
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Links">
            <FiLink size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando Urls...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Urls">
          <FiLink size={25} />
        </Title>
        {urls.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhuma url registrada...</span>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Nova Url
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Nova Url
            </Link>
            <table>
              <thead>
                <tr>
                  <th scope="col">Titulo</th>
                  <th scope="col">Link</th>
                  <th scope="col">Link Original</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Cadastrado">{item.title}</td>
                      <td data-label="Link">
                        <a
                          href={item.shortLink}
                          target="_blank"
                          style={{ color: "#000", fontWeight: "bold" }}
                        >
                          {item.shortLink}
                        </a>
                      </td>
                      <td data-label="Original">
                        <a
                          href={item.fullLink}
                          target="_blank"
                          style={{ color: "#000", fontWeight: "bold" }}
                        >
                          {item.fullLink}
                        </a>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button
                          className="action"
                          style={{ backgroundColor: "red" }}
                          onClick={() => handleDelete(item)}
                        >
                          <FiTrash color="#fff" size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loadingMore && (
              <h3 style={{ textAlign: "center", marginTop: 15 }}>
                Buscando mais dados...
              </h3>
            )}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
                Buscar mais
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
