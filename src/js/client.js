import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
import URLIn from "./URLIn";
import YoutubeDisplay from "./YoutubeDisplay";
import Result from "./Result";
import "../css/Content.css";
let player;
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      result: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.ResultChange = this.ResultChange.bind(this);
  }
  
  handleChange(content){
    this.setState({value: content});
  }
  handleClick(content){
    this.setState({value: content});
    event.preventDefault();
  }
  ResultChange(content){
    this.setState({result: Math.floor(content)});

  }

  render() {
    return (
          <div>
            <BrowserRouter>
            <div className = "all">
              <div  className = "Content">
                <Route exact path='/'  render={() => <URLIn handlechange={this.handleChange} handleclick={this.handleClick} value = {this.state.value} />} />
                <Route exact path='/YoutubeDisplay' render={() => <YoutubeDisplay ResultChange={this.ResultChange} value = {this.state.value} />} />
                <Route path='/result' render={() => <Result result = {this.state.result} />}/>
              </div>
            </div>
            </BrowserRouter>
          </div>

    );
  }
}
ReactDOM.render(
  <Contents />, document.getElementById('root'));