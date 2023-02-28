import React from 'react'
import styles from '../style.module.css'
import '../style.module.css'

class MessageForm extends React.Component {
    onSubmit = (e) => {
        e.preventDefault()
        if (document.getElementById('MessageContentInput').value.trim() !== '') {
            this.props.onSubmitCallback(document.getElementById('MessageContentInput').value)
            document.getElementById('MessageForm').reset()
        }   
    } 

    render() {
        return (
            <form onSubmit={this.onSubmit} className={styles.Bottom} id="MessageForm">
                <div className={styles.MessageInput}>
                    <div className={`fa-solid fa-image ${styles.UploadImageIcon}`}></div>
                    <input type='text' id="MessageContentInput" placeholder='Type something...'/>
                </div>
                <div className={`fa-solid fa-paper-plane ${styles.SendMessageIcon}`}/>
            </form>
        )
    } 
} 

export default MessageForm;