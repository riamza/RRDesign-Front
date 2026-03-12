import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./NotFound.css";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>{t("notfound.title", "Oops! Pagina negăsită")}</h2>
      <p>
        {t(
          "notfound.description",
          "Ne pare rău, dar pagina pe care ai căutat-o nu există, a fost ștearsă sau este temporar indisponibilă.",
        )}
      </p>
      <Link to="/" className="btn-primary">
        <Home size={20} />
        {t("notfound.backHome", "Înapoi Acasă")}
      </Link>
    </div>
  );
};

export default NotFound;
