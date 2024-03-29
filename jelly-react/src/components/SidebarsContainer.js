import React from "react";
import Sidebar from "./Sidebar";
import ChatPreview from "./ChatPreview";
import Banner from "./Banner";
import styles from '../style.module.css'

class SidebarsContainer extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            selected: this.props.selectedChat,
            activeBanner: 0
        }
    } 

    changeState = (chat) => {
        this.setState({selected:chat},
            ()=>{this.props.appCallback(chat)})
    } 

    shouldComponentUpdate (){
        return true
    } 

    onMemberImageClick = (e) => {
        console.log(e)
        this.setState({activeBanner: (this.state.activeBanner==e.target.id)?0:String(e.target.id)})
    }

    onAddChatButtonClick = () => {
        console.log('AddChatButtonClick')
        this.props.toggleCreateChatModal()
    } 
    render () {
        function onImageError (target, url) {
            console.log(target.src, url)
            target.onerror=null
            target.src=url
        }
        return (<div className={styles.SidebarsContainer}>
            <Sidebar className={styles.ChatInfo} active={this.props.activeChatInfo} top={true}>
                <div className={styles.ChatImage}>
                    <img src={this.props.selectedChat.image || 'data:image/gif;'} className={styles.Image} 
                        onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>

                </div>
                <div className={styles.ChatName}>
                    <strong>{this.props.selectedChat.name}</strong>
                </div>
                <div className={styles.ChatDescription}>
                    {this.props.selectedChat.description}
                </div>
                <div className={styles.ChatMembers}>
                   {this.props.selectedChat.members.map(((member) =>{
                       return (<div className={styles.member}>
                            <img id={member.id} src={`${member.image}`}
                                onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}
                                onClick={this.onMemberImageClick} />
                            <div>{member.user.username}</div>
                            <Banner active={this.state.activeBanner==member.id}
                                object={{
                                    image:member.image,
                                    name:member.user.first_name,
                                    subname:'@'+member.user.username,
                                    description:member.description
                                }}>
                            </Banner>
                        </div>)
                   }))}
                </div>
            </Sidebar>
            <Sidebar className={styles.ChatsSidebar}>
                <div className={styles.top}>
                    <div className={styles.title}>Jelly</div>
                    <img src={`${this.props.Account.image}`}
                        onError={({currentTarget})=>currentTarget.src='/media/Account/user.png'}/>

                </div>
                <div className={styles.SidebarInputContainer}>
                    <input type="text" placeholder='Search chats...'/>
                    <div className='fa-solid fa-plus' onClick={this.onAddChatButtonClick}></div>
                </div>
                <div className={styles.ChatsContainer}>
                    {this.props.Chats.map((Chat) => {
                        return (
                            <ChatPreview Chat={Chat} key={Chat.id} appCallback={this.props.parentCallback} changeState={this.changeState} selected={this.state.selected}/>
                            )
                    })}
                </div>
            </Sidebar>
        </div>)
    }
}

export default SidebarsContainer