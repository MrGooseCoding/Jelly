import React from 'react'
import styles from '../style.module.css'

class Sidebar extends React.Component {
    render () {
        var active = (this.props.active)?styles.active:''
        var top = (this.props.top)?styles.TopSidebar:''
        console.log(this.props.className)
        return (
            <div className={`${styles.Sidebar} ${top} ${active} ${this.props.className}`}>
                {this.props.children}
            </div>
        )
    } 
} 

export default Sidebar;