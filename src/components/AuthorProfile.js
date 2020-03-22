import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Icon, Button } from 'antd';
import './AuthorProfile.css'
import axios from 'axios';
import cookie from 'react-cookies';
import validateCookie from '../utils/validate.js';
import {FRIEND_BOOL,FRIEND_REQUEST_API} from '../utils/constants.js';

class AuthorProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            email: this.props.email,
            displayName: this.props.displayName,
            github: this.props.github,
            bio: this.props.bio,
            isSelf: this.props.isSelf,
            isFriend: false,
            isPending: false,
        };
    }

    componentDidMount() {
        validateCookie();
        const token = cookie.load('token');
        const headers = {'Authorization': 'Token '.concat(token)};

        if (!this.props.isSelf) {
            axios.get(FRIEND_BOOL.concat(this.props.username).concat("/"), 
            { headers: headers}).then(res => {
                var status = res.data.status;
                if (status === "friend") {
                    this.setState({
                        isFriend: true,
                    })
                } else if (status === "pending") {
                    this.setState({
                        isPending: true,
                    })
                }
            }).catch((error) => {
                  console.log(error);
            });
        }
    };

    sendFriendRequest(username) {
        const token = cookie.load('token');
        const headers = {
          'Authorization': 'Token '.concat(token)
        }
        axios.post(FRIEND_REQUEST_API,
        {
            f2Id: username,
        },{headers: headers}
        ).then(res => {
            this.setState({
                isPending: true,
            })
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {
        const {username, isSelf, isFriend, isPending} = this.state;
        return (           
            <div className="user">
                <span className="tag">User Name: <span className="info">{this.state.username}</span></span>
                <span className="secondtag">Email: <span className="info">{this.state.email}</span></span>
                <br/>
                <span className="tag">Display Name: <span className="info">{this.state.displayName}</span></span>
                <span className="secondtag">Github: <span className="info">{this.state.github}</span></span>
                <br/>
                <span className="tag">Bio: <span className="info">{this.state.bio}</span></span>
                {isSelf ? <a className="self-edit" href="/settings"><Icon type="edit" /></a> : null}
                {isFriend || isPending || isSelf ? null : <Button type="primary" shape="round" className="status" onClick={() => this.sendFriendRequest(username)}><Icon type="user-add"/><span>Add Friend</span></Button>}
                {isPending ? <Button type="dashed" shape="round" disabled className="status"><Icon type="clock-circle"/><span>Pending...</span></Button> : null}
                {isFriend ? <Button shape="round" ghost disabled className="status"><Icon type="check"/><span>Friends</span></Button> : null}
                <hr/>
            </div>
        );
    }
}

export default AuthorProfile
