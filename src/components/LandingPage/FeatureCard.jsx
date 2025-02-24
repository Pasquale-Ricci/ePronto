import cardIcon from '../assets/cardIcon.png'
import styles from '../modules/FeatureCard.module.css'

function FeatureCard (props) {
    return(
        <div className = {styles.featureCard}>
            <img className = {styles.cardIcon} src= {cardIcon}/>
            <div className = {styles.cardText}>
                <h3> {props.title} </h3>
                <p> {props.description} </p>
            </div>
        </div>
    )
}

export default FeatureCard