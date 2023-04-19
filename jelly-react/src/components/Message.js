import React from 'react'
import styles from '../style.module.css'
import TextFormatter from './TextFormatter'
import Banner from './Banner'
import Image from './Image'

class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activeBanner: false}
    }

    onProfilePictureClick = () => {
        console.log('Click')
        this.setState({activeBanner: (this.state.activeBanner)?false:true})
    }

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
        var Author = this.props.MessageData.author
        var image = Author.image
        var object = {
            image: Author.image,
            name: Author.user.first_name,
            subname: '@'+Author.user.username,
            description: Author.description
        }

        console.log(Author.image)
        if (!SelfMessage) {
            return (
                <div className={`${styles.Message} ${(LastMessage)?styles.LastMessage:null} ${(FirstMessage)?styles.FirstMessage:null}`}>
                    <Image src={image} classNames={styles.ProfilePicture} onClick={this.onProfilePictureClick} user/>
                    <Banner
                        active={this.state.activeBanner}
                        object={object}>
                        <div></div>
                    </Banner>

                    <div>
                        {Check(FirstMessage, <div className={styles.MessageAuthor}>{this.props.MessageData.author.user.first_name}</div>)} 

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
                    
                    <Image src={image} classNames={styles.ProfilePicture} onClick={this.onProfilePictureClick} user/>
                </div>
            )
        }
    } 
} 

export default Message;