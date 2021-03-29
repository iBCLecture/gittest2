import React, { Component } from 'react';
import { animateScroll as scroll } from "react-scroll";
import {
  MDBContainer, 
  MDBBtn,
  MDBRow,
  MDBCol
} from "mdbreact";
import { Link } from 'react-router-dom';


var typeflag = true;
class Todo extends Component {
    
    handleflag(){
        const type = this.props.type;
        if(type==="USER"){
            typeflag = true;
        }else{
            typeflag = false;
        }
    }
    render() {
        var className = 'USER';
        this.handleflag();
        if(typeflag){
            return(
            <div className={className}>
                <div className="bms_message bms_right">
                    <div className="bms_message_box">
                        <div className="bms_message_content">
                            <div className="bms_message_text">{this.props.title}</div>
                        </div>
                    </div>
                </div>
                <div className="bms_clear"></div>
            </div>
            );
        }else{
            className = 'API';
            return(
            <div className={className}>
                <div className="bms_message bms_left">
                    <div className="bms_message_box">
                        <div className="bms_message_content">
                            <div className="bms_message_text">{this.props.title}</div>
                        </div>
                    </div>
                </div>
                <div className="bms_clear"></div>
            </div>
                
            );
        }
    }
}

class TodoList extends Component {

    render() {
      const messages = this.props.messages.map( todo =>
        <Todo
          key={todo.id}
          {...todo}
        />
      )
  
      return(
        <div>
          {messages}
        </div>
      );
    }
  }

class Form extends Component {

    render() {
      return (
        
        <MDBRow className="fixed-bottom m-0 p-0">
          <MDBCol className="p-0 m-0">
          <div className="shadow-box-example hoverable p-0 m-0">
  
          <form onSubmit={this.props.onSubmit}　autoComplete="off">       
             <MDBCol className="p-0 m-0" size="9" lg="11">
               
             <input type="text" name="title" className="form-control" id="msg_form"　autoComplete="off"/>
             
             </MDBCol>
             <MDBCol size="3">
             <button id="send_btn"></button> 
            </MDBCol>    
          </form>
          </div>
      </MDBCol>
      </MDBRow>
      
      );
    }
}


class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          id: 1,
          title: "ご質問内容を入力ください",
          type: "API"
        }
      ],
      countmsg: 2
    }
  }
  scrollToBottom = () => {
    scroll.scrollToBottom();
  };
  handleSubmit(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const type = "USER";
    if (!title) {
      alert("メッセージを入力してください");
      return;
    }
    const messages = this.state.messages.slice();
    
    
    messages.push({
      title: title,
      type: type,
      id: this.state.countmsg,
    });
    const countmsg = this.state.countmsg+1;
    this.setState({ messages });
    this.setState({countmsg});
    
    e.target.title.value = '';//入力欄をクリアする.
    
    //以下、API接続
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"userId":"hoge","input":title, "language":"ja"});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("https://ibchiro.tk/api/response/toyota factory guide", requestOptions)//ここのurlを変えると接続するAPIが変わる
      .then(response => response.json())
      .then(json => {
        console.log(json);
        var oUtput = json;
        console.log(oUtput.textToSpeech);
        messages.push({
          title: oUtput.displayText,
          type: "API",
          id: this.state.countmsg,
        });
        const countmsg = this.state.countmsg+1;
        this.setState({ messages });
        this.setState({countmsg});
      })
    
      .catch(error => console.log('error', error));
      this.scrollToBottom()
  }

  render() {
    return(
      
      <MDBContainer fluid className="m-0 pt-0 px-0 min-vh-100">
      
        <div id="message_container">
          <TodoList messages={this.state.messages} />
       </div>
       
       <Form onSubmit={this.handleSubmit.bind(this)} />
       
      
      </MDBContainer>
      
       )
  }
  
}

export default Chat;