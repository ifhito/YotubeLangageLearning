import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
import URLIn from "./URLIn";
import YoutubeDisplay from "./YoutubeDisplay";
let player;
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};    
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleChange(content){
    this.setState({value: content});
  }
  handleClick(content){
    this.setState({value: content});
    event.preventDefault();
  }

  render() {
    return (
            <BrowserRouter>
              <script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>
              <script type="text/javascript" id="www-widgetapi-script" src="https://s.ytimg.com/yts/jsbin/www-widgetapi-vfl5fd9gV/www-widgetapi.js" async=""></script>
              <h2><p>Youtube語学勉強</p></h2>
              <Route exact path='/'  render={() => <URLIn handlechange={this.handleChange} handleclick={this.handleClick} value = {this.state.value} />} />
              <Route exact path='/about' render={() => <YoutubeDisplay value = {this.state.value} />} />
            </BrowserRouter>

    );
  }
}

ReactDOM.render(
  <Contents />, document.getElementById('root'));