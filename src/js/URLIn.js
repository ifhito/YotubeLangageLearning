import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
export default class URLIn extends React.Component{
  
    render(){
      return(
        <div>
            <label>
              URL:<input type="url" className="YoutubeID" value={this.props.value} onChange={()=>this.props.handlechange(event.target.value)} />
            </label>
          <Link to='/about' onClick={() => this.props.handleclick(this.props.value)}><button>送信</button></Link>
        </div>
      );
    }
  }