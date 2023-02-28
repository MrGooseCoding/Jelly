import React from 'react'
import styles from '../style.module.css'
import ChatPreview from './ChatPreview';


class Sidebar extends React.Component {
    constructor (props) {
        super(props)

        console.log(this.props.selectedChat)
        this.state = {selected: this.props.selectedChat}
        console.log(this.props.Chats)
    } 

    changeState = (chat) => {
        this.setState({selected:chat},
            ()=>{this.props.appCallback(chat)})
    } 

    shouldComponentUpdate (){
        return true
    } 

    onAddChatButtonClick = () => {
        console.log('AddChatButtonClick')
        this.props.toggleCreateChatModal()
    } 

    render () {
        return (
            <div className={styles.Sidebar}>
                <div className={styles.title}>Jelly</div>
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
            </div>
        )
    } 
} 

export default Sidebar;