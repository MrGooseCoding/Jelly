import React from "react"; 

class Image extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            default: (this.props.user)
                ?'/media/Account/user.png'
                :'/media/Chat/chat.png',
            src: this.props.src,
            firstTime: true,
        }
    }

    onError = (currentTarget) => {
        if (this.state.firstTime) {
            currentTarget.src=this.state.default
            this.setState({firstTime:false})
        }
    }

    render () {
        return <img src={this.state.src || 'data:image/gif;'} alt='>:(' className={this.props.classNames} 
            onError={({ currentTarget }) => this.onError(currentTarget)}
            onClick={this.props.onClick}
            id={this.props.id}/>
    }
}

export default Image;