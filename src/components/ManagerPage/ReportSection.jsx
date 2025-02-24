import Header from "../LandingPage/Header"
import styles from '../../modules/ManagerPage.module.css'
import GraphReport from "./GraphReport"

function ReportSection({changeView}){
    return(
        <>
        <Header></Header>
        <button className={styles.backButton} onClick={changeView}>Indietro</button>
        <GraphReport></GraphReport>
        </>
    )
}

export default ReportSection;