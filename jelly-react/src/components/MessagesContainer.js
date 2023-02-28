import React from 'react'
import Message from './Message'
import styles from '../style.module.css'

class MessagesContainer extends React.Component {

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
        return (
            <div className={styles.MessagesContainer}>
                <div style={{height: '55px',}}></div>
                {this.props.Messages.map((MessageData, index, elements)=>{
                        return (<Message key={MessageData.id} MessageData={MessageData} User={this.props.Account} LastMessageData={elements[index-1]} NextMessageData={elements[index + 1]}/>)
                })}
                <div ref={this.messagesEndRef} />
            </div>
        )
    } 


} 

export default MessagesContainer