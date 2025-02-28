import Header from "../components/LandingPage/Header";
import style from "../modules/ManagerPage.module.css";
import AlertSection from "../components/ManagerPage/AlertSection";
import StaffSection from "../components/ManagerPage/StaffSection";
import MenuSection from "../components/ManagerPage/MenuSection";
import ReportSection from "../components/ManagerPage/ReportSection";
import MenuEditorSection from "../components/ManagerPage/MenuEditorSection"; // Importa il nuovo componente
import { useState } from "react";

function ManagerPage() {
  const [view, setView] = useState(false);
  const [showMenuEditor, setShowMenuEditor] = useState(false); // Stato per gestire la visualizzazione del form

  function changeView() {
    setView((v) => !v);
  }

  function toggleMenuEditor() {
    setShowMenuEditor((prev) => !prev); // Alterna la visualizzazione del form
  }

  if (!view) {
    return (
      <>
        <Header />
        <div className={style.sectionsContainer}>
          <div className={style.sectionColumn}>
            <MenuSection />
            <div>
              <h2>Accedi ai tuoi reports</h2>
              <button onClick={changeView}>Reports</button>
            </div>
            <div>
              <h2>Gestisci il menu</h2>
              <button onClick={toggleMenuEditor}>
                {showMenuEditor ? "Nascondi Editor" : "Crea Nuovo Menu"}
              </button>
              {showMenuEditor && <MenuEditorSection />}{" "}
              {/* Mostra il form solo se showMenuEditor è true */}
            </div>
          </div>

          <div className={style.sectionColumn}>
            <AlertSection />
            <StaffSection />
          </div>
        </div>
      </>
    );
  }
  return <ReportSection changeView={changeView} />;
}

export default ManagerPage;
