import React from 'react';
import 'antd/dist/antd.css';
import { Form, Comment, Avatar, List, Radio, Input, Button } from 'antd';
import cookie from 'react-cookies';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { BE_COMMENT_API_URL, HOST, BE_CURRENT_USER_API_URL, FE_USERPROFILE_URL } from "./utils/constants.js";
import convertTime from "./utils/isoFormat.js";
import { reactLocalStorage } from 'reactjs-localstorage';
import uuidv4 from "./utils/getUUID.js";
const { TextArea } = Input;
var id = '';

class Comments extends React.Component {

  state = {
    commentInput: '',
    commentData: [],
    commentsCount: '',
    commentId: String(uuidv4()),

    id: "",
    host: "",
    displayName: "",
    url: "",
    github: "",

    currentTime: convertTime(new Date()),
  }

  componentDidMount() {
    id = this.props.postId;
    axios.get(BE_COMMENT_API_URL(HOST, id), { headers: { 'Authorization': 'Token ' + cookie.load('token') } })
      .then(res => {
        this.setState({
          commentData: res.data.comments,
          commentsCount: res.data.count,
        });
      })

      .catch(function (error) {
        console.log(error);
      });

    axios.get(BE_CURRENT_USER_API_URL, { headers: { 'Authorization': 'Token ' + cookie.load('token') } })
      .then(res => {
        this.setState({
          id: res.data.id,
          host: res.data.host,
          displayName: res.data.displayName,
          url: res.data.url,
          github: res.data.github,
        });
      })

      .catch(function (error) {
        console.log(error);
      });

  };

  handleProfile = (authorId) => {
    reactLocalStorage.set("currentUserId", authorId);
    document.location.replace(FE_USERPROFILE_URL);
  }

  handleSubmit = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post(BE_COMMENT_API_URL(HOST, id),
          {
            query: "addComment",
            post: HOST + "/posts/".concat(id),
            comment: {
              author: {
                id: this.state.id,
                host: this.state.host,
                displayName: this.state.displayName,
                url: this.state.url,
                github: this.state.github,
              },

              comment: values.commentContent,
              contentType: values.commentType,
              published: this.state.currentTime,
              id: this.state.commentId,
            }
          }, { headers: { 'Authorization': 'Token ' + cookie.load('token') } }
        )
          .then(function (response) {
            window.location.reload(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <div>
        <div className={'comment'} style={{ justifyContent: 'center', padding: '2%', width: '100%' }} >
          <Form >
            <Form.Item>
              <List
                className="comment-list"
                header={`${this.state.commentsCount} comment(s)`}
                itemLayout="horizontal"
                dataSource={this.state.commentData}
                locale={{ emptyText: "No comment yet" }}
                renderItem={item => (
                  <li>
                    <Comment
                      author={
                        <span style={{fontSize : "15px"}}>{item.author.displayName}</span>
                      }
                      avatar={
                      <Avatar 
                        size="large" 
                        style={{
                            color: '#3992f7',
                            backgroundColor: '#ccebff',
                            fontSize : "20pt",
                        }}
                      >
                        {item.author.displayName[0].toUpperCase()}
                      </Avatar>}  
                      content={
                        <span style={{fontSize : "18px"}}>{item.contentType === "text/markdown" ?
                          (<ReactMarkdown source={item.comment} />) :
                            item.comment}
                        </span>
                      }
                      datetime={
                        <span style={{fontSize : "15px"}}>{item.published}</span>
                      }
                    />
                  </li>
                )}
              />
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("commentContent", {
                rules: [
                  {
                    required: false,
                    whitespace: true
                  }
                ],
              })(<TextArea rows={2} placeholder="Enter your comment here" />)}
            </Form.Item>


            <Form.Item>
              {getFieldDecorator("commentType", {
                rules: [
                  {
                    required: true,
                    message:"Please select a comment type",
                  },
                ],
              })(<Radio.Group>
                <Radio.Button value="text/plain">Plain Text</Radio.Button>
                <Radio.Button value="text/markdown">Markdown</Radio.Button>
              </Radio.Group>
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" size = "large" style = {{marginLeft : "20%"}} htmlType="button" onClick={this.handleSubmit}>
                Comment
                  </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

    )


  }

}


const WrappedComments = Form.create({ name: 'Comment' })(Comments)

export default WrappedComments;

