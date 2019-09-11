import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link,withRouter} from 'react-router-dom';
import "../css/Content.css";
class Result extends React.Component {
    render(){
        return(
            <div><p className="result">あなたの正解率は{this.props.result}%です</p></div>
        );
    }
}

export default Result;