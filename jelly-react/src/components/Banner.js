import React from 'react'
import styles from '../style.module.css'
import TextFormatter from './TextFormatter'

class Banner extends React.Component{
    render() {
        return <div className={`${styles.Banner} ${(this.props.active)?styles.active:''}`}>
            {this.props.children}
        </div>
    }
}
export default Banner