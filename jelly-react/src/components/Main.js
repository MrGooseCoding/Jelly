import React from 'react'
import styles from '../style.module.css'
import MessagesContainer from './MessagesContainer'
import MessageForm from './MessageForm'

class Main extends React.Component {
    messagesEndRef = React.createRef()

    scrollToBottom = () => {
        this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidUpdate () {
        this.scrollToBottom()
    }

    componentDidMount () {
        this.scrollToBottom()
    } 

    render () {
        let Chat = this.props.selectedChat
        return (
            <div className={styles.Main}>

                <div className={styles.Header}>
                    <p className={styles.ChatName}>{Chat.name}</p>
                    <div class={`fa-solid fa-compass ${styles.icon} ${styles.compassIcon}`} onClick={this.props.toggleChatInfo}></div>
                    <div class={`fa-solid fa-magnifying-glass ${styles.icon} `}></div>
                </div>

                <MessagesContainer Account={this.props.Account} Messages={this.props.Messages}/>
                
                <MessageForm onSubmitCallback={this.props.onMessageFormSubmit}/>
        
            </div>
        )
    } 
} 

export default Main;