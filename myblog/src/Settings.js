import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import './components/Settings.css';
import './components/Header.css';
import AuthorHeader from './components/AuthorHeader';
import cookie from 'react-cookies';
import validateCookie from './utils/utils.js';
import {TOKEN_API,AUTHOR_API} from "./utils/constants.js";
var authorid='';

class ProfileContent extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userName: null,
            email: null,
            displayName: null,
            github: null,
            bio: null,
        }
    }

    componentWillMount() {
      validateCookie();
    }

    componentDidMount() {
       validateCookie();
        axios.get(TOKEN_API, 
        { headers: { 'Authorization': 'Token ' + cookie.load('token') } }).then(res => {
            var userInfo = res.data;
            this.setState({
              userName: userInfo.username,
              email: userInfo.email,
              displayName: userInfo.displayName,
              github: userInfo.github,
              bio: userInfo.bio
            });
            authorid = res.data.username;
          }).catch((error) => {
            console.log(error);
          });
      };
    
    handleSubmit = e => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          var { userName } = this.state;
          axios.patch(AUTHOR_API + userName + '/',
            {
                "github": values.github,
                "displayName": values.displayName,
                "bio": values.bio,
            },{ headers: { 'Authorization': 'Token ' + cookie.load('token') } }
            )
            .then(function (response) {
              document.location.replace("/author/".concat(authorid).concat("/posts"));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    };  

    render(){
        const { getFieldDecorator } = this.props.form;
        const { displayName, github, bio } = this.state;
        const layout = {   
            // labelCol: {
            //     span: 20,
            //   },
            // wrapperCol: {
            //     span: 16,
            // },
          };
        return(
            <div>
              <AuthorHeader/>

              {/* <div className={'postInput'} style={{display: 'flex',  justifyContent:'center'}}> */}
              <div className="user-info">
                <span>User Name: {this.state.userName}</span><br/>
                <span>Email: {this.state.email}</span>
                <Form {...layout}>

                    <Form.Item label="Display Name">
                        {getFieldDecorator('displayName', {
                            initialValue: displayName,
                        })(<Input />)}
                    </Form.Item>
                    
                    <Form.Item label="GitHub">
                        {getFieldDecorator('github', {
                            initialValue: github,
                        })(<Input />)}
                    </Form.Item>

                    <Form.Item label="Bio">
                        {getFieldDecorator('bio', {
                            initialValue: bio,
                        })(<Input.TextArea autoSize={true}/>)}
                    </Form.Item>
            
                    <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                        <Button type="primary" htmlType="button" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
              </div>
            </div>

        )

    }
}

const WrappedProfileContent = Form.create({ name: 'ProfileContent' })(ProfileContent)


export default WrappedProfileContent