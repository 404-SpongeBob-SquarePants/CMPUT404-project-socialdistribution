import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import ReactMarkdown from 'react-markdown';
import { reactLocalStorage } from 'reactjs-localstorage';
import WrappedComments from './Comment';
import validateCookie from './utils/validate.js';
import AuthorHeader from './components/AuthorHeader';
import './components/Post.css';
import 'antd/dist/antd.css';
import { List, Avatar, Icon, Drawer, Spin, Tag} from 'antd';
import { BE_VISIBLE_POST_API_URL, HOST, FE_USERPROFILE_URL} from "./utils/constants.js";

var publicPost = [];

class User extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        size: 'large',
        PublicPostData: [],
        authorid: '',
        isloading: true,
        drawerVisible: false,
        }
    }

    componentDidMount() {
        validateCookie();
        this.fetchData();
    };

    fetchData = () => {
        axios.get(BE_VISIBLE_POST_API_URL(HOST), { headers: { 'Authorization': 'Token ' + cookie.load('token') } })
        .then(res => {
            publicPost = res.data.posts;
            this.setState({
                isloading: false,
            })
            this.setState({
                PublicPostData: res.data.posts,
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleProfile = (authorId) => {
        reactLocalStorage.set("currentUserId", authorId);
        document.location.replace(FE_USERPROFILE_URL);
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
        return (
            <div>
                <AuthorHeader defaultSelectedKeys="Home"/>
                {!this.state.isloading ?
                <div className="mystyle">
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
                        dataSource={publicPost}
                        locale={{ emptyText: "Currently no visible post" }}
                        renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <span>
                                    <a href="#!" onClick={this.handleComment.bind(this, item.id)} style={{ marginRight: 8 }}>
                                        <Icon type="message"/>
                                    </a>
                                    {String(item.comments.length).concat(" comment(s)")}
                                </span>
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
                                <a href={"#!"} onClick={this.handleProfile.bind(this, item.author.id)} 
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
                        {item.contentType === "text/plain" ? 
                            <div className="plain-content">{item.content}</div> 
                        : 
                            <div className="markdown-content">
                                <ReactMarkdown source={item.content} />
                            </div>
                        }
                        </List.Item>
                        )}
                    />
                </div> 
                : 
                <div style={{marginTop : "25%", marginLeft : "50%"}}>
                    <Spin size="large" />
                </div>}
            </div> 
        );
    }
}

export default User;
