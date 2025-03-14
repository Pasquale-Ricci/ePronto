import Header from "../components/LandingPage/Header";
import style from "../modules/ManagerPage.module.css";
import AlertSection from "../components/ManagerPage/AlertSection";
import StaffSection from "../components/ManagerPage/StaffSection";
import MenuSection from "../components/ManagerPage/MenuSection";
import ReportSection from "../components/ManagerPage/ReportSection";
import MenuEditorSection from "../components/ManagerPage/MenuEditorSection";
import ManagerTable from "../components/ManagerPage/ManagerTable";
import BeverageSection from "../components/ManagerPage/BeverageSection"; // Importa il componente BeverageSection
import { useState } from "react";

function ManagerPage() {
  const [view, setView] = useState("main");
  const [showMenuEditor, setShowMenuEditor] = useState(false);

  function changeView(newView) {
    setView(newView);
  }

  if (view === "main") {
    return (
      <>
        <Header />
        <div className={style.sectionsContainer}>
          <div className={style.sectionColumn}>
            <MenuSection />
            <div>
              <h2>Accedi ai tuoi reports</h2>
              <button
                className={style.managerBtn}
                onClick={() => changeView("reports")}
              >
                Reports
              </button>
            </div>
            <div>
              <h2>Gestisci il menu</h2>
              <button
                className={style.managerBtn}
                onClick={() => changeView("menuEditor")}
              >
                {showMenuEditor ? "Nascondi Editor" : "Crea Nuovo Menu"}
              </button>
              {showMenuEditor && <MenuEditorSection />}
            </div>
            <div>
              <h2>Gestisci i tavoli</h2>
              <button
                className={style.managerBtn}
                onClick={() => changeView("tables")}
              >
                Gestisci Tavoli
              </button>
            </div>
            <div>
              <h2>Gestisci le bevande</h2>
              <button
                className={style.managerBtn}
                onClick={() => changeView("beverages")}
              >
                Gestisci Bevande
              </button>
            </div>
          </div>

          <div className={style.sectionColumn}>
            <AlertSection />
            <StaffSection />
          </div>
        </div>
      </>
    );
  } else if (view === "reports") {
    return <ReportSection changeView={() => changeView("main")} />;
  } else if (view === "menuEditor") {
    return <MenuEditorSection changeView={() => changeView("main")} />;
  } else if (view === "tables") {
    return <ManagerTable changeView={() => changeView("main")} />;
  } else if (view === "beverages") {
    return <BeverageSection changeView={() => changeView("main")} />;
  }
}

export default ManagerPage;
