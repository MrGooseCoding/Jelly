import React from 'react'
import styles from '../style.module.css'
import TextFormatter from './TextFormatter'

class Banner extends React.Component{
    render() {
        /* Props are:
            active: defines whether its visible or not
            object: {
                image: an image url
                name: str
                subname: str
                description: str
            }
            children: like a button, a large image, ...
        */

        var object = this.props.object
        return <div className={`${styles.Banner} ${(this.props.active)?styles.active:''}`}>
            <div className={styles.bannerTop}>
                <img src={`${object.image}`} alt='I told you this could happen!' className={`${styles.Picture}`}
                    onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>

                <div className={styles.data}>
                    <div><strong>{object.name}</strong></div>
                    <div>{object.subname}</div>
                </div>
            </div>
            <div className={styles.description}>
                {String(object.description)}
            </div>
            {this.props.children}
        </div>
    }
}
export default Banner