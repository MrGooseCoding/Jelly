import React from 'react'
import styles from '../style.module.css'
import TextFormatter from './TextFormatter'

class Message extends React.Component {

    render() {
        const FirstMessage = (this.props.LastMessageData)?this.props.LastMessageData.author.id!==this.props.MessageData.author.id:true
        const LastMessage = (this.props.NextMessageData)?this.props.NextMessageData.author.id!==this.props.MessageData.author.id:true
        const SelfMessage = (this.props.User.id===this.props.MessageData.author.id)
        var MessageContent = this.props.MessageData.content
        
        function Check(variable, html) {
            if (variable) {
                return (html)
            } 
        } 

        if (!this.props.MessageData.author.image) {
            var image = 'http://trevor.leal.me:8080/media/Account/user.png'
        } else {
            var image = "http://trevor.leal.me:8080"+this.props.MessageData.author.image
        } 

        if (!SelfMessage) {
            return (
                <div className={`${styles.Message} ${(LastMessage)?styles.LastMessage:null} ${(FirstMessage)?styles.FirstMessage:null}`}>
                    <img src={image} alt='I told you this could happen!' className={`${styles.ProfilePicture}`}/>
                    <div>
                        {Check(FirstMessage, <div className={styles.MessageAuthor}>{this.props.MessageData.author.user.username}</div>)} 

                        <div>
                            <TextFormatter className={styles.MessageContent} text={MessageContent} />
                        </div>
                    </div>
                </div>
            )
        } 

        else {
            return(
                <div className={`${styles.SelfMessage} ${(LastMessage)?styles.LastMessage:null} ${(FirstMessage)?styles.FirstMessage:null}`}>

                    <button className={`fa-solid fa-trash ${styles.DeleteMessage}`}></button>
                    <TextFormatter className={styles.MessageContent} text={MessageContent}/>

                    <img src={image} alt='I told you this could happen!'  className={styles.ProfilePicture}></img>

                </div>
            )
        }
    } 
} 

export default Message;