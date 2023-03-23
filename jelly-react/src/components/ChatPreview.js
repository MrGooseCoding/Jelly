import React from 'react'
import styles from '../style.module.css'

class ChatPreview extends React.Component {
    clickHandler = () => {
        this.props.changeState(this.props.Chat)
    } 

    render () {
        var image = null
        if (!this.props.Chat.image) {
            image = '/media/Chat/chat.png'
        } else {
            image = this.props.Chat.image
        } 
        return (
            <div className={`${styles.ChatPreview} ${(this.props.selected.id===this.props.Chat.id)?styles.selected:null}`} key={this.props.Chat.id} onClick={this.clickHandler}>
                <img src={image} alt="We all knew this could happen" className={styles.ChatPreviewImage}/>
                <div className={styles.ChatPreviewName}>{this.props.Chat.name}</div>
            </div>
        )
    } 
} 

export default ChatPreview;