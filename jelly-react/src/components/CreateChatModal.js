import $ from "jquery";
import React from "react";
import styles from '../style.module.css'

class CreateChatModal extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            Modal: {
                currentSlide: 1,
                slides: 3,
                nextSlide: function () {
                    $(`.${styles.slide}.${this.currentSlide}`).addClass(styles.left).removeClass(styles.active);
                    this.currentSlide += 1
                    $(`.${styles.slide}.${this.currentSlide}`).addClass(styles.active);
                    $('#BackBtn').removeClass(styles.disabled)
                },
                lastSlide: function () {
                    $(`.${styles.slide}.${this.currentSlide}`).removeClass(styles.active);
                    this.currentSlide -= 1
                    $(`.${styles.slide}.${this.currentSlide}`).removeClass(styles.left).addClass(styles.active);
                    $('#NextBtn').removeClass(styles.disabled)
                    if (this.currentSlide === 1) {
                        $('#BackBtn').addClass(styles.disabled)
                    } 
                }
            },
            addedUsers: [],
            users: [],
            image: "http://trevor.leal.me:8080/media/Account/user.png", 
        } 
    }  

    onAddUserFormSubmit = (e) => {
        e.preventDefault();
        var form = document.getElementById('AddUserForm')
        var username = e.target.Username.value
        if (!this.state.addedUsers.includes(username)) { 
            if (username !== this.props.Account.user.username) {
                $.ajax({
                    method:'POST',
                    url:'http://trevor.leal.me:8080/api/account/exists/',
                    headers:{
                        Authorization: `Token ${this.props.userToken}`, 
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        crossDomain: true
                    },
                    data: {
                        username:username,
                    } 
                }).done((data)=>{
                    if (data['data']) {
                        this.setState({addedUsers: [...this.state.addedUsers, username]})
                        form.reset()
                    } 
                })
            } 
        } 
    }

    onCheckUsersFormSubmit = (e) => {
        e.preventDefault()
    } 

    onBackBtnClick = () => {
        this.state.Modal.lastSlide()
    }

    onNextBtnClick = () => {
        let users = [] 
        const updateUsersList = (index, item) => {
            users.push(item.value)
        }

        if (this.state.Modal.currentSlide === 1) {
            const checkboxes = $('input[name=userCheckbox]:checked');
            checkboxes.each(updateUsersList)
            this.setState({users:users})
            if (!(checkboxes.length === 0)) {
                this.state.Modal.nextSlide()
            } 
        }
        
        else if (this.state.Modal.currentSlide === 2) {
            const name = $('#NameInput').val().trim()
            const description = $('#DescriptionInput').val().trim()
            if (name !== '' && description !== '') {
                this.state.Modal.nextSlide()
                this.setState({name:name, description:description})
            } 
        } 

        else if (this.state.Modal.currentSlide === 3) { 
            $.ajax({ 
                method:'POST',
                url:'http://trevor.leal.me:8080/api/chat/create/',
                headers: {
                    "Accept": "application/json",
                    Authorization: `Token ${this.props.userToken}`, 
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    crossDomain: true
                },
                data: {
                    chat: JSON.stringify({
                        name : this.state.name,
                        description: this.state.description,
                        members:this.state.users,
                        image: null,})
                    }
            }).done((data)=>{
                var onChatCreate = this.props.onChatCreate
                var imageInput = document.getElementById('ImageInput')
                var image = imageInput.files[0]
                var formdata = new FormData()
                formdata.append('image', image)
                formdata.append('chat_id', data['data']['id'])
                if (image !== undefined) {
                    $.ajax({
                        url: 'http://trevor.leal.me:8080/api/chat/update_image/',
                        type:'POST',
                        headers: {Authorization: `Token ${this.props.userToken}`},
                        data: formdata,
                        contentType: false, 
                        processData: false,
                        success: (data) => {
                            onChatCreate(data)
                        } 
                    })
                } else {
                    console.log("Data", data)
                    data["image"]=""
                    onChatCreate(data)
                }
                this.reset()
            })
        } 
    }

    readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $(`.${styles.Image}`).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    reset = () => {
        this.setState({addedUsers: [], name: '', description: '', users:[]})
        document.getElementById('AddUserForm').reset()
        document.getElementById('CheckUsersForm').reset()
        document.getElementById('ChatDisplayForm').reset()
        $(`.${styles.slide}.3`).removeClass(styles.active);
        $(`.${styles.slide}.2`).removeClass(styles.left);
        $(`.${styles.slide}.1`).removeClass(styles.left).addClass(styles.active)
        $('#BackBtn').addClass(styles.disabled)
    }

    onImageClick = () => {
        $(`.${styles.ImageInput}`).trigger('click');
    } 

    onImageInputChange = (e) =>{
        this.readURL(e.target)
    } 

    render () {
        var active = this.props.active

        return (
            <div className={`${styles.modal} ${(active)?styles.active:''}`} id="CreateChatModal">
                <div className={styles.title}>Create new Chat</div>
                <div className={styles.container}>
                    <div className= {`${styles.slide} 1 ${styles.active}`}>
                        
                        Choose at least one user:
                        <form id="AddUserForm" onSubmit={this.onAddUserFormSubmit}>
                            <div className={styles.UsernameInput}>
                                <div>@</div>
                                <input type="text" name="Username" tabindex="-1" placeholder="Username" required/>
                            </div>
                        </form>

                        <form id="CheckUsersForm" class={styles.CheckUsersForm} onSubmit={this.onCheckUsersFormSubmit}>
                            {this.state.addedUsers.map((username, index, elements) => {
                                return (
                                    <div key={username}>
                                        <input type="checkbox" name="userCheckbox" tabindex="-1" value={username} defaultChecked/>
                                        <label for={username}>{username}</label>
                                    </div>
                                )
                            })}
                        </form>
                    </div>
                    <div className= {`${styles.slide} 2`}>
                        <form action="" className={styles.ChatDisplayForm} id="ChatDisplayForm">
                            <div className={styles.ChatImage}>
                                <img src={this.state.image} alt="" className={styles.Image} onClick={this.onImageClick}/>
                                <input onChange={this.onImageInputChange} tabindex="-1" className={styles.ImageInput} id="ImageInput" type="file" name="Image" accept="image/x-png,image/gif,image/jpeg"/>
                            </div>
                            <div className={styles.NameAndDescription}>
                                <input type="text" name="Name" tabindex="-1" placeholder="Name" max-length="20" id='NameInput' maxLength={42} required/>
                                <input type="text" name="Description" tabindex="-1" placeholder="Description" id='DescriptionInput' maxLength={100} required/>
                            </div>
                        </form>
                    </div>
                    <div className= {`${styles.slide} 3`}>
                        <p>All ready?</p>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    <input type="button" onClick={this.onBackBtnClick} className={`${styles.btn} ${styles.btnPurple} ${styles.disabled}`} id="BackBtn" value="Back"/>
                    <input type="button" onClick={this.onNextBtnClick} className={`${styles.btn} ${styles.btnPurple}`} id="NextBtn" value="Next"/>
                </div>
            </div>
        )
    } 
} 

export default CreateChatModal