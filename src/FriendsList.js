import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { List, Avatar, Button, Skeleton, Modal } from 'antd';
import './components/Header.css';
import AuthorHeader from './components/AuthorHeader';
import axios from 'axios';
import cookie from 'react-cookies';
import validateCookie from './utils/utils.js';
import {FRIEND_API, CURRENT_USER_API} from "./utils/constants.js";
const { confirm } = Modal;

class FriendsList extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    current_user : "",
    isloading : true
  };

  componentWillMount() {
    validateCookie();
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.data,
        list: res.data,
        size: res.data.length
      });
    });
    this.getUser();
  }

  getUser = () => {
    const token = cookie.load('token');
    const headers = {
      'Authorization': 'Token '.concat(token)
    }
    axios.get(CURRENT_USER_API,{headers : headers})
    .then(res => {
      this.setState({
        current_user:res.data['username'],
        isloading:false
       })
    } )
    .catch(function (error) {
      console.log(error)
    });
  }

  showDeleteConfirm(friend_request_id, f1Id) {
    const that = this;
    const token = cookie.load('token');
    const headers = {
      'Authorization': 'Token '.concat(token)
    }
    const data = {
      "f1Id" : f1Id,
      "status" : "R"
    }
    confirm({
      title: 'Are you sure you want to unfriend this friend?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.patch(FRIEND_API.concat(friend_request_id).concat('/'), data, {headers : headers})
        .then(res => {
          that.fetchData();
        }).catch(function (error) {
          console.log(error)
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  getData = callback => {

    const token = cookie.load('token');
    const headers = {
      'Authorization': 'Token '.concat(token)
    }
    axios.get(FRIEND_API,{headers : headers})
    .then(res => {
      callback(res)
    } )
    .catch(function (error) {
      console.log(error)
    });
  };

  render() {
    const liststyle = {
        backgroundColor: "white",
        padding: "1%",
    }  

    const unfriendstyle={
      height: "3%",
      width: "10%",
      right: "1%",
    }

    const titlestyle={
      fontSize : 18 
    }

    const { initLoading, list, current_user } = this.state;

    return (!this.state.isloading ? 
        <div>
        <AuthorHeader/>
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={list}
            style={liststyle}
            locale={{ emptyText: "Friend list is currently empty"}}
            renderItem={item => (
            <List.Item>
                <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                    avatar={
                      <Avatar
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#3991F7',
                      }}
                    >
                      {item.f1Id !== current_user ? item.f1Id[0].toUpperCase() : item.f2Id[0].toUpperCase()}
                    </Avatar>
                    }
                    title={<a style={titlestyle} href={"/author/".concat(item.f1Id !== current_user ? item.f1Id : item.f2Id).concat("/posts")}>{item.f1Id !== current_user ? item.f1Id : item.f2Id}</a>}
                />
                </Skeleton>
                <div style={unfriendstyle} onClick={() => this.showDeleteConfirm(item.id,item.f1Id !== current_user ? item.f1Id : item.f2Id)}>
                <Button type="danger" shape="round" size={'default'} >Unfriend</Button>
                </div>
            </List.Item>
            )}
        />
      </div> : null
    );
  }
}

export default FriendsList;
