import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
import {Form,FormGroup,FormControl,Button, ButtonToolbar,InputGroup} from 'react-bootstrap';
import "../css/Content.css";
export default class URLIn extends React.Component{
  
    render(){
      return(
        
          <Form inline >
          <p>https://www.youtube.com/watch?v=TdcegUsjYbc</p>
            <FormGroup>
              <FormControl
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                type="url" className="YoutubeID" 
                value={this.props.value} 
                onChange={()=>this.props.handlechange(event.target.value)} 
                placeholder="Enter YoutubeURL"
              />
              <Link to='/YoutubeDisplay' onClick={() => this.props.handleclick(this.props.value)}><Button>Enter</Button></Link>
              </FormGroup>
            </Form>
      );
    }
  }