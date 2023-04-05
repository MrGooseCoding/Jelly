import styles from './style.module.css'
import Main from './components/Main'
import CreateChatModal from './components/CreateChatModal'
import React from 'react'
import $ from 'jquery';
import Cookie from 'js-cookie'
import SidebarsContainer from './components/SidebarsContainer'
import Notification from './components/Notification';

class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      //userToken: '32eddfbc63bbae81017917e5d2a9ddc87bdeadf5',
      userToken: Cookie.get('userToken'),
      selectedChat: {
        "id": 1,
        "members": [{
          "id": 1,
          "user": {
            "id": 1,
            "username": "Loading...",
            "first_name": "Loading... ",
            "email": "Loading...",
            "is_active": true,
            "date_joined": "Loading..."
          },
          "image": null
        }],
        "name": "Select a chat to interact with messages",
        "description": "Loading..",
        "image": null
        },
      Account: {
        "id": 1,
        "user": {
            "id": 1,
            "username": "Loading...",
            "first_name": "Loading...",
            "email": "Loading...",
            "is_active": true,
            "date_joined": "Loading..."
        },
        "image": null
      },
      Chats: [{
        "id": 1,
        "members": [{
          "id": 1,
          "user": {
            "id": 1,
            "username": "Loading...",
            "first_name": "Loading... ",
            "email": "Loading...",
            "is_active": true,
            "date_joined": "Loading..."
          },
          "image": null
        }],
        "name": "Loading...",
        "description": "Loading..",
        "image": null
      },],
      Messages: [
        {id: 1, author: {id:1, user:{username:'Loading...'}, image:null}, content:'Loading...'},
      ],
      NotificationData: {
        message: {id: 1, author: {id:1, user:{username:'Loading...'}, image:null}, content:'Loading...'},
        chat: {id: 1,
        members: [{
          id: 1,
          user: {
            id: 1,
            username: "Loading...",
            first_name: "Loading... ",
            email: "Loading...",
            is_active: true,
            date_joined: "Loading..."
          },
          image: null
        }],
        name: "Loading...",
        description: "Loading..",
        image: null}
      },
      
      chatSocket: null,
      activeCreateChatModal: false,
      activeChatInfo: false,
      activeNotification: false,
    }
  }  

  componentDidMount() {
    this.getAccount();
    this.getChats();
    this.connectWebsocket();
  } 
  
  getAccount = async function () {
    $.ajax({ 
      method:'POST',
      url:'/api/account/get/',
      headers: {
        Authorization: `Token ${this.state.userToken}`, 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        crossDomain: true
      },
    }).done((data)=>{
      this.setState({Account:data})
    }
    )
  } 

  getChats = async function () {
    $.ajax({
      method:'POST',
      url:'/api/chat/get/',
      headers:{
        Authorization: `Token ${this.state.userToken}`, 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        crossDomain: true
      } 
    }).done((data)=>{
      this.setState({Chats:data}) 
    })
  }

  connectWebsocket = async function (){
    let url = `wss://${window.location.host}/ws/${this.state.userToken}/`

    let self = this

    let chatSocket = new WebSocket(url)

    chatSocket.onmessage = function(e) {
      let data = JSON.parse(e.data)
      console.log('Data:',data)
      var message = data['message']

      if (data['type'] === 'recent_messages') {
        self.setState({Messages: data['message']})
      }
      if (data['type'] === 'message') {
        console.log(message)
        console.log('Chat:',self.state.selectedChat.id, message['chat'])

        if (self.state.selectedChat.id != message['chat']) {
          var chat = self.state.Chats.filter((value, index) => value.id == message['chat'])[0]
          self.setState({NotificationData:{message:message, chat:chat}, activeNotification:true})
        } else {
          self.setState({Messages: [...self.state.Messages, message]})
        }
      }
    } 

    this.setState({chatSocket: chatSocket})
  } 

  changeSelectedChatCallback = (childData) => {
    this.setState({selectedChat: childData})
    this.state.chatSocket.send(JSON.stringify({
      "type":"recent_messages",
      "chat_id":childData.id
    }))
  }

  onMessageFormSubmit = (message) => {
    this.state.chatSocket.send(JSON.stringify({
      "type":"message",
      "message":message,
      "chat_id":this.state.selectedChat.id
    }))
  } 

  onChatCreate = (chatData) => {
    this.setState({Chats: [...this.state.Chats, chatData]})
    this.toggleCreateChatModal()
  }  

  toggleCreateChatModal = () => {
    this.setState({activeCreateChatModal: (this.state.activeCreateChatModal)?false:true})
  } 

  toggleChatInfo = () => {
    this.setState({activeChatInfo: (this.state.activeChatInfo)?false:true})
  } 

  onAppClickEvent = (e) => {
    var toggleCreateChatModal = this.toggleCreateChatModal
    var active = this.state.activeCreateChatModal
    if (!document.getElementById('CreateChatModal').contains(e.target) && active){
      toggleCreateChatModal()
    }
    if (!document.getElementById('notification').contains(e.target) && this.state.activeNotification) {
      this.setState({activeNotification:false})
    }
  } 

  render () { 

    document.title="Jelly"
    return (
      <div className={`${styles.AppContainer}`} onClick={this.onAppClickEvent}>
        <Notification message={this.state.NotificationData.message} chat={this.state.NotificationData.chat} active={this.state.activeNotification}></Notification>
        <SidebarsContainer
          Account={this.state.Account}
          Chats={this.state.Chats} 
          selectedChat={this.state.selectedChat} 
          appCallback={this.changeSelectedChatCallback} 
          toggleCreateChatModal={this.toggleCreateChatModal}
          activeChatInfo={this.state.activeChatInfo}
        />
        <Main 
          Chats={this.state.Chats} 
          selectedChat={this.state.selectedChat} 
          Account={this.state.Account} 
          Messages={this.state.Messages} 
          onMessageFormSubmit={this.onMessageFormSubmit}
          toggleChatInfo={this.toggleChatInfo}
        />
        <CreateChatModal 
          userToken={this.state.userToken} 
          Account={this.state.Account} 
          onChatCreate={this.onChatCreate} 
          active={this.state.activeCreateChatModal} 
          toggleCreateChatModal={this.toggleCreateChatModal}
        />
      </div>
    );
  }

}

export default App;