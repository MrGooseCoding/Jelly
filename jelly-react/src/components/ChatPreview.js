import React from 'react'
import styles from '../style.module.css'
import Image from './Image'

class ChatPreview extends React.Component {
    clickHandler = () => {
        this.props.changeState(this.props.Chat)
    } 

    render () {
        var image = this.props.Chat.image

        return (
            <div className={`${styles.ChatPreview} ${(this.props.selected.id===this.props.Chat.id)?styles.selected:null}`} key={this.props.Chat.id} onClick={this.clickHandler}>
                <Image src={image} classNames={styles.ChatPreviewImage}/>
                <div className={styles.ChatPreviewName}>{this.props.Chat.name}</div>
            </div>
        )
    } 
} 

export default ChatPreview;