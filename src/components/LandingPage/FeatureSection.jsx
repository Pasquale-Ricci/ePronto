import styles from '../../modules/FeatureSection.module.css'

function FeatureSection (props) {
    return (
        <div className = {styles.feature}>
            <img className = {styles.fimg} src = {props.img}/>
            <div className = {styles.textContent}>
                <h3>{props.title}</h3>
                <p> {props.description}
                </p>
            </div>
        </div>
    )
}

export default FeatureSection;