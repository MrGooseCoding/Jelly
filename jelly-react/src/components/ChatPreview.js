import React from 'react'
import styles from '../style.module.css'

class ChatPreview extends React.Component {
    clickHandler = () => {
        this.props.changeState(this.props.Chat)
    } 

    render () {
        function onImageError (target, url) {
            target.onerror=null
            target.src=url
        }

        var image = this.props.Chat.image

        return (
            <div className={`${styles.ChatPreview} ${(this.props.selected.id===this.props.Chat.id)?styles.selected:null}`} key={this.props.Chat.id} onClick={this.clickHandler}>
                <img src={image || 'data:image/gif;'} className={styles.ChatPreviewImage}
                    onError={({currentTarget})=>currentTarget.src='/media/Chat/chat.png'}/>
                <div className={styles.ChatPreviewName}>{this.props.Chat.name}</div>
            </div>
        )
    } 
} 

export default ChatPreview;