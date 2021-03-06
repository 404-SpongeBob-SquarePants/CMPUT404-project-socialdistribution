import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { reactLocalStorage } from 'reactjs-localstorage';
import cookie from 'react-cookies';
import WrappedComments from './Comment';
import validateCookie from './utils/validate.js';
import getUserId from './utils/getUserId.js';
import AuthorHeader from './components/AuthorHeader'
import AuthorProfile from './components/AuthorProfile'
import './components/Post.css';
import 'antd/dist/antd.css';
import { List, Icon, Modal, Avatar, Drawer, Spin, Tag } from 'antd';
import { 
    HOST, 
    BE_CURRENT_USER_API_URL, 
    BE_AUTHOR_POST_API_URL, 
    BE_SINGLE_POST_API_URL, 
    BE_AUTHOR_PROFILE_API_URL,
    FE_USERPROFILE_URL,
    FE_POST_EDIT_URL,
} from "./utils/constants.js";

const { confirm } = Modal;

class UserSelf extends React.Component {
    state = {
        postData: [],
        userId: "",
        userHost: "",
        username: "",
        userDisplayName: "",
        userUrl: "",
        userGithub: "",
        userEmail: "",
        userBio: "",
        currentUserId: "",
        currentUserHost: "",
        currentUserDisplayName: "",
        currentUserUrl: "",
        isloading: true,
        isSelf: true,
        drawerVisible: false,
    };

    showDeleteConfirm = (postId, author) => {
        confirm({
            title: 'Are you sure you want to delete this post?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(BE_SINGLE_POST_API_URL(HOST, postId), { headers: { 'Authorization': 'Token ' + cookie.load('token') } })
                    .then(function () {
                        document.location.replace(FE_USERPROFILE_URL);
                    })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentDidMount() {
        validateCookie();
        const token = cookie.load('token');
        const headers = { 'Authorization': 'Token '.concat(token) }
        let userId = reactLocalStorage.get("currentUserId");
        axios.get(BE_CURRENT_USER_API_URL, { headers: headers }).then(res => {
            var currentUserId = res.data.id
            if (userId) {
                if (userId !== currentUserId) {
                    this.setState({
                        isSelf: false,
                        currentUserId: currentUserId,
                        currentUserHost: res.data.host,
                        currentUserDisplayName: res.data.displayName,
                        currentUserUrl: res.data.url,
                    });
                    this.setState({
                        currentUserId: res.data.id,
                    });
                }
            } else {
                userId = currentUserId;
            }
            this.getProfile(headers, userId);
            this.fetchPost(headers, userId);
        }).catch((error) => {
            console.log(error);
        });
    };

    getProfile(headers, userId) {
        var parsedId = getUserId(userId);
        axios.get(BE_AUTHOR_PROFILE_API_URL(parsedId),
        { headers: headers }).then(res => {
            var userInfo = res.data;
            this.setState({
                userId: userId,
                userHost: userInfo.host,
                username: userInfo.username,
                userDisplayName: userInfo.displayName,
                userUrl: userInfo.url,
                userGithub: userInfo.github,
                userEmail: userInfo.email,
                userBio: userInfo.bio,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    fetchPost(headers, userId) {
        var parsedId = getUserId(userId);
        axios.get(BE_AUTHOR_POST_API_URL(HOST, parsedId), { headers: headers })
        .then(res => {
            this.setState({
                postData: res.data.posts,
                isloading: false,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    handleEdit = (postId) => {
        reactLocalStorage.set("postid", postId);
        document.location.replace(FE_POST_EDIT_URL(postId));
    }

    handleComment = (postId) => {
        this.setState({
          drawerVisible: true,
          postId: postId,
        });
      
      }
    
    onClose = () => {
        this.setState({drawerVisible: false,});
    }

    render() {
        const { postData, userId, userHost, username, userDisplayName, userUrl, userGithub, userEmail, userBio,
            currentUserId, currentUserHost, currentUserDisplayName, currentUserUrl, isloading, isSelf } = this.state;
        var sortedData = postData.slice().sort((a, b) => Date.parse(b.published) - Date.parse(a.published));

        return (
            <div>
                <AuthorHeader defaultSelectedKeys="MyPost"/>
                {!isloading ? 
                <div className="mystyle">
                    <AuthorProfile
                        userId={userId}
                        userHost={userHost}
                        username={username}
                        userDisplayName={userDisplayName}
                        userUrl={userUrl}
                        userGithub={userGithub}
                        userEmail={userEmail}
                        userBio={userBio}
                        currentUserId={currentUserId}
                        currentUserHost={currentUserHost}
                        currentUserDisplayName={currentUserDisplayName}
                        currentUserUrl={currentUserUrl}
                        isSelf={isSelf}
                    />
                    <Drawer
                        width={600}
                        height={700}
                        visible={this.state.drawerVisible}
                        onClose={this.onClose}
                        destroyOnClose={true}
                        bodyStyle={{ paddingBottom: 80 }}
                    >
                        <WrappedComments postId={this.state.postId}/>
                    </Drawer>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{ pageSize: 5, hideOnSinglePage: true }}
                        dataSource={sortedData}
                        locale={{ emptyText: "You currently do not have any post" }}
                        renderItem={item => (
                            <List.Item
                                key={item.title}
                                actions={[
                                    <span>
                                        <a href="#!" onClick={this.handleComment.bind(this, item.id)} style={{ marginRight: 8 }}><Icon type="message" /></a>
                                        {String(item.comments.length).concat(" comment(s)")}
                                    </span>,
                                    <span>
                                        {isSelf ?
                                            <a href="#!" onClick={this.handleEdit.bind(this, item.id)} style={{ marginRight: 8 }}><Icon type="edit" /></a>
                                            : null}
                                    </span>,
                                    <span>
                                        {isSelf ?
                                            <a href="#!" onClick={this.showDeleteConfirm.bind(this, item.id, item.author.displayName)} style={{ marginRight: 8 }}><Icon type="delete" /></a>
                                            : null}
                                    </span>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar size={50}
                                            style={{
                                                color: '#3992f7',
                                                backgroundColor: '#ccebff',
                                                marginTop: 1,
                                                fontSize : "25pt",
                                            }}
                                        >
                                            {item.author.displayName[0].toUpperCase()}
                                        </Avatar>
                                    }
                                    title={
                                        <a href={FE_USERPROFILE_URL} 
                                            style={{ 
                                                color: "#7f553b",
                                                fontSize: "14pt",
                                            }}
                                        >
                                            {item.author.displayName}
                                        </a>
                                        }
                                    description={
                                        <div 
                                            style={{
                                                marginBottom : "-10pt",
                                                marginTop : "-12pt",
                                            }}
                                        >
                                            <span>{item.published.split(".")[0] + "-" + item.published.split("-", 4)[3]}</span>
                                            <span>{` @ ${item.author.host ? item.author.host : null}`}</span>
                                            <br/>
                                            {item.categories.map((cate) =>
                                                <Tag key="Category-tag" color="blue">{cate}</Tag>
                                            )}
                                        </div>
                                    }
                                />
                                <h2>{item.title}</h2>
                                {item.contentType === "text/plain" ? item.content : (
                                    <div className="markdown-content">
                                        <ReactMarkdown source={item.content} />
                                    </div>
                                )}
                            </List.Item>
                        )}
                    />
                </div> 
                : 
                <div style={{marginTop : "25%", marginLeft : "50%"}}>
                    <Spin size="large" />
                </div>
                }
            </div> 
        );
    }
}

export default UserSelf;