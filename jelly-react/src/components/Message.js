import React from 'react'
import styles from '../style.module.css'
import TextFormatter from './TextFormatter'
import Banner from './Banner'

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
                    <img src={image || 'data:image/gif;' } alt='I told you this could happen!' className={`${styles.ProfilePicture}`} 
                        onClick={this.onProfilePictureClick}
                        onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>
                    
                    <Banner
                        active={this.state.activeBanner}
                        object={object}>
                        <div></div>
                    </Banner>

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

                    <img src={image || 'data:image/gif;'} 
                        alt='I told you this could happen!' 
                        className={styles.ProfilePicture}
                        onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>
                </div>
            )
        }
    } 
} 

export default Message;