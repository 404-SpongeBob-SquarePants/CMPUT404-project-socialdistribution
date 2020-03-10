import React from 'react';
import 'antd/dist/antd.css';
import { List, Button, Modal, Avatar} from 'antd';
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox"; 
import axios from 'axios';
import AuthorHeader from './components/AuthorHeader'
import AuthorProfile from './components/AuthorProfile'
import {reactLocalStorage} from 'reactjs-localstorage';
import './UserSelf.css';
import cookie from 'react-cookies';
import validateCookie from './utils/utils.js';
import {post_api,author_api,fetch_post_api} from "./utils/utils.js";

const { confirm } = Modal;

class UserSelf extends React.Component {
  state = {
    MyPostData:[],
    username : "",
    isloading : true,
    isSelf: true
  };

  showDeleteConfirm = (postId) => {
    confirm({
      title: 'Are you sure you want to delete this post?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.delete(post_api + String(postId) + '/', { headers: { 'Authorization': 'Token ' + cookie.load('token') } })
        .then(function () {
          document.location.replace("/author/profile")
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentDidMount() {
    validateCookie();
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (username) {
        this.fetchOtherPost(username);
    } else {
        this.fetchPost();
    }
  };

  fetchOtherPost(username) {
    const token = cookie.load('token');
    const headers = {
      'Authorization': 'Token '.concat(token)
    }

    axios.get(author_api.concat(username).concat("/user_posts/"), 
    {headers : headers}).then(res => {
        this.setState({
            username: username,
            MyPostData: res.data,
            isloading: false,
            isSelf: false,
        });
      }).catch((error) => {
          console.log(error);
      });
  }

  fetchPost = () => {
    const token = cookie.load('token');
    const headers = {
      'Authorization': 'Token '.concat(token)
    }

    axios.get(fetch_post_api,{headers : headers}).then(
      responseA =>
        Promise.all([
          responseA,
          axios.get(author_api.concat(responseA.data['username']).concat('/user_posts/'),{headers : headers})
        ])   
      ).then(
        ([responseA,responseB]) => {
        this.setState({
          username : responseA.data['username'],
          MyPostData : responseB.data,
          isloading: false,
        })
      }).catch((err) => {
        console.log(err.message);
    });
  }

  handleEdit = (postId) => {
    reactLocalStorage.set("postid", postId);
    document.location.replace("/postedit");
  }

  handleComment = (postId) => {
    reactLocalStorage.set("postid", postId);
    document.location.replace("/posts/postid/comments");
  }


  render() {
      
      const {username, isloading, MyPostData, isSelf} = this.state;
      return(!isloading ? 
        <view>
          <AuthorHeader/>
          <div className="mystyle">
              <AuthorProfile 
                username={username}
                isSelf={isSelf}
              />
              <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{pageSize: 5, hideOnSinglePage:true}}
                  dataSource={MyPostData}
                  renderItem={item => (
                      <List.Item
                          key={item.title}
                          actions={[
                          <span>
                            <Button onClick={this.handleComment.bind(this, item.id)} icon="message" style={{width: "28px", height: "28px", backgroundColor: "white"}}></Button>
                            {0}
                            <Button onClick={this.handleEdit.bind(this, item.id)} icon="edit" style={{left: "30%", width: "28px", height: "28px", backgroundColor: "white"}}></Button>
                            <Button onClick={this.showDeleteConfirm.bind(this, item.id)} icon="delete" style={{left: "50%", width: "28px", height: "28px", backgroundColor: "white"}}></Button>
                          </span>
                          ]}
                          extra={
                            <SimpleReactLightbox>
                              <SRLWrapper>
                                <img
                                  width={250}
                                  alt=""
                                  src="https://wallpaperaccess.com/full/628286.jpg"/>
                                <img
                                width={250}
                                alt=""
                                src="https://i.pinimg.com/originals/1f/53/25/1f53250c9035c9d657971712f6b38a99.jpg"/> 

                              </SRLWrapper> 
                            </SimpleReactLightbox>
                          }
                      >
                      <List.Item.Meta
                        avatar={<Avatar src={'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png'} />}
                        title={item.author}
                      />
                      {item.published}<br/><br/>
                      {item.content}                      
                      </List.Item>
                  )}
              />
          </div>
        </view> : null

      );
    }
}


export default UserSelf;
