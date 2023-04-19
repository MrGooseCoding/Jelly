import React from 'react'
import styles from '../style.module.css'
import Image from './Image'
import $ from 'jquery'

class UserSettingsBanner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedOption: 1,
        }
    }

    changeSelected = (n) => {
        this.setState({selectedOption:n})
    }

    onFirstNameChange = (e) => {
        if (e.target.value.length < 1 || e.target.value.length > 30) {
            this.setState({first_nameError: 'Invalid display name'})
            return
        } else {
            this.setState({first_nameError: null})
        }
    }

    onUsernameInputChange = (e) => {
        if (e.target.value.length < 1 || e.target.value.length > 150) {
            this.setState({usernameError: 'Invalid username'})
            return
        }

        if (e.target.value === this.props.Account.user.username) {
            this.setState({usernameError:null})
            return
        }

        $.ajax({
            type: 'POST',
            url:'/api/account/exists/',
            data: {
                username:e.target.value,
            },
            success: (data)=>{
                if (data['data']) {
                    this.setState({usernameError:'There is already an user with this username'})
                } else {
                    this.setState({usernameError:null})
                }
            }
        })
    }

    onDescriptionChange = (e) => {
        if (e.target.value.length > 200) {
            this.setState({descriptionError: 'The description\'s length is too big'})
            return
        } else {
            this.setState({descriptionError: null})
        }
    }

    onSaveButtonPress = (e) => {
        if (this.state.first_nameError || this.state.usernameError || this.state.descriptionError) {
            return
        }
        
        $.ajax({
            type:'POST',
            url:'/api/account/edit/',
            headers:{
                Authorization: `Token ${this.props.userToken}`, 
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                crossDomain: true
            },
            data: {
                username:document.getElementById('usernameInput').value,
                first_name:document.getElementById('first_nameInput').value,
                description:document.getElementById('descriptionInput').value
            },
            success: (data)=>{
                console.log(data)
                this.props.updateAccount(data['account'])
            }
        })
    }

    copyToClipBoard = (e) => {
        var clipboardDataEvt = e.clipboardData;
        clipboardDataEvt.setData('text/plain', `${window.location.origin}/account/@${this.props.Account.user.username}/`);
    }

    render() {
        var first_name = this.props.Account.user.first_name
        var username = this.props.Account.user.username
        return <div className={`${styles.userSettingsBanner} ${(this.props.active)&&styles.active}`} id="userSettingsBanner">
        <div className={styles.sidebar}>
            <div className={styles.userDisplay}>
                <div className={styles.data}>
                    <Image src={this.props.Account.image} classNames={styles.userPicture} user/>

                    <div className={styles.text}>
                        <strong>{first_name}</strong>
                        <div>@{username}</div>
                    </div>
                </div>
            </div>

            <div className={`${styles.SettingsOption} ${(this.state.selectedOption===1)?styles.active:''}`}
                onClick={()=>this.changeSelected(1)}>
                <div className={styles.selectionBar}></div>
                <div className={styles.option}>Account</div>
            </div>
            <div className={`${styles.SettingsOption} ${(this.state.selectedOption===2)?styles.active:''}`}
                onClick={()=>this.changeSelected(2)}>
                <div className={styles.selectionBar}></div>
                <div className={styles.option}>Friends</div>
            </div>

            <div className={styles.userLink}>
                Share your account with your friends using this link!
                <div style={{display:'flex'}}>
                    <input type={'text'} value={`https://${window.location.host}/account/@${this.props.Account.user.username}/`} readOnly/>
                    <input type={'button'} value="Copy!"
                    onClick={(e) =>this.copyToClipBoard(e)}/>
                </div>
            </div>
        </div>
        <div className={styles.settings} key={this.props.Account.user.username}>
            {
                (this.state.selectedOption === 1)?
                    <div className={styles.userDisplay}>
                        <div className={styles.data}>
                            <Image src={this.props.Account.image} classNames={styles.userPicture} user/>

                            <div className={styles.text}>
                                <input type={'text'} 
                                    id="first_nameInput"
                                    defaultValue={this.props.Account.user.first_name} 
                                    className={styles.first_name}
                                    onChange={e =>this.onFirstNameChange(e)}
                                />
                                <div className={styles.username}>
                                    @<input type={'text'} 
                                        id="usernameInput"
                                        onChange={e =>this.onUsernameInputChange(e)}
                                        defaultValue={this.props.Account.user.username}/>
                                </div>
                            </div>
                        </div>
                        <textarea defaultValue={this.props.Account.description} id="descriptionInput"
                            onChange={e=>this.onDescriptionChange(e)}>
                        </textarea>
                        <div className={styles.error}>{this.state.first_nameError}</div>
                        <div className={styles.error}>{this.state.usernameError}</div>
                        <div className={styles.error}>{this.state.descriptionError}</div>
                        <input type={'button'} className={styles.btnPurple} value="Save" onClick={this.onSaveButtonPress}/>
                    </div>
                :<div>
                    Comming soon
                </div>
            }
        </div>
    </div>    
    }
}

export default UserSettingsBanner