import styles from './style.module.css'
import Main from './components/Main'
import CreateChatModal from './components/CreateChatModal'
import React from 'react'
import $ from 'jquery';
import Cookie from 'js-cookie'
import SidebarsContainer from './components/SidebarsContainer'

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
      
      chatSocket: null,
      activeCreateChatModal: false,
      activeChatInfo: false,
    }
  }  

  componentDidMount() {
    this.getAccount();
    this.getChats();
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
    //console.log(user)
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

  connectWebsocket = async function (chat_id){
    if (this.state.chatSocket){
      this.state.chatSocket.close();
    } 

    let url = `wss://${window.location.host}/ws/${chat_id}/${this.state.userToken}/`

    let self = this

    let chatSocket = new WebSocket(url)

    chatSocket.onmessage = function(e) {
      let data = JSON.parse(e.data)
      if (data['type'] === 'recent_messages') {
        self.setState({Messages: data['message']})
      }
      if (data['type'] === 'message') {
        self.setState({Messages: [...self.state.Messages, data['message']]})
      }
    } 

    this.setState({chatSocket: chatSocket})
  } 

  changeSelectedChatCallback = (childData) => {
    this.setState({selectedChat: childData})
    this.connectWebsocket(childData.id)
  }

  onMessageFormSubmit = (message) => {
    this.state.chatSocket.send(JSON.stringify({
      "message": message
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
  } 

  render () { 

    document.title="Jelly"
    return (
      <div className={`${styles.AppContainer}`} onClick={this.onAppClickEvent}>
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