import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link,withRouter} from 'react-router-dom';
import "../css/Content.css";
class Result extends React.Component {
    render(){
        let list = [];
        for(let i =0; i<this.props.allAnswer.length; i++){
            list.push(<p>{i+1}問目</p>);
            list.push(<p>答え: {this.props.allStartText[i]} <span className = "answer">{this.props.allAnswer[i]}</span>{this.props.allEndText[i]}</p>);
            list.push(<p>あなたの答え: {this.props.allUserAnswer[i]}</p>);
        }
        return(
            <div>
                <div className = "title3">LearningTube</div>
                <p className="result">あなたの正解率は{this.props.result}%です</p>
                <div className = "scroll">
                    {list}
                </div>
            </div>
        );
    }
}

export default Result;