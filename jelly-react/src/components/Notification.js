import React from 'react'
import styles from '../style.module.css'

class Notification extends React.Component {
    render () {
        var author = this.props.message.author
        return <div className={`${styles.Notification} ${(this.props.active)?styles.active:''}`} id="notification">
            <img src={author.image || 'data:image/gif;'} className={styles.Image} 
                onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>
            
            <div>
                <strong>{author.user.first_name} in #{this.props.chat.name}</strong>
                <div>{this.props.message.content}</div>
            </div>
        </div>
    }
}

export default Notification;