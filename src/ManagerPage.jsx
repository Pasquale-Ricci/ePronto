import Header from "./components/LandingPage/Header"
import style from './modules/ManagerPage.module.css'
import AlertSection from './components/ManagerPage/AlertSection'
import StaffSection from './components/ManagerPage/StaffSection'
import MenuSection from './components/ManagerPage/MenuSection'
import ReportSection from './components/ManagerPage/ReportSection'
import { useState } from "react"

function ManagerPage() {

    const [view, setView] = useState(false)

    function changeView() {
        setView(v => !view)
    }

    if (!view) {

        return (
            <>
                <Header />

                <div className={style.sectionsContainer}>

                    <div className={style.sectionColumn}>
                      <MenuSection></MenuSection>
                        <div>
                            <h2>Accedi ai tuoi reports</h2>
                            <button onClick={changeView}>Reports</button>
                        </div>

                    </div>

                    <div className={style.sectionColumn}>

                        <AlertSection></AlertSection>
                        <StaffSection></StaffSection>
                    </div>
                </div>
            </>
        )
    }
    return (<ReportSection changeView={changeView} />)
}

export default ManagerPage