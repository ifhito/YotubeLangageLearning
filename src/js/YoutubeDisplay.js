import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
export default class YoutubeDisplay extends React.Component {
    constructor(props){
      super(props);
      [this.TextData,this.TimeData] = TextEdit();
      this.val = 0;
      this.NextVal = 1;
    //   this.times = {
    //     time:[0,10,20,30],
    //     val: 0,
    //   }
      this.state = {
        start: this.TimeData[this.val][0],
        end: this.TimeData[this.val][1],
        startText: this.TextData[this.val][0][0],
        endText: this.TextData[this.val][0][1],
        answer: this.TextData[this.val][1],
        userAnswer: "",
      }
      this.Changedata = this.Changedata.bind(this);
      this.Change = this.Change.bind(this);
    }
    Change(content){
        this.setState({userAnswer: content})
    }
    Changedata(){
      this.val=this.val + 1;
      this.NextVal = this.NextVal + 1; 
      if(this.state.userAnswer == this.state.answer){
          alert("正解です");
      }else{
          alert("正解は"+this.state.answer+"です");
      }
      this.setState({start: this.TimeData[this.val][0]});
      this.setState({end: this.TimeData[this.val][1]});
      this.setState({startText: this.TextData[this.val][0][0]});
      this.setState({endText: this.TextData[this.val][0][1]});
      this.setState({answer: this.TextData[this.val][1]});
      this.setState({userAnswer: ""});

      console.log(this.state.start);
    }
    render() {
        const opts = {
          height: '390',
          width: '640',
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            start: this.state.start,
            end : this.state.end,
          }
        };
      
        return (
          <div>
          <YouTube
            videoId={this.props.value.toString().split("v=")[1]}
            opts={opts}
          />
          <div>{this.state.startText}<input value = {this.state.userAnswer} onChange={()=>this.Change(event.target.value)}/>{this.state.endText}</div>
          <button onClick={() => this.Changedata()}>OK</button>
          </div>
        );
    }

  }

  function TextEdit(data){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cdn.glitch.com/579cd11b-4462-4d1e-804c-e0a3419e5be3%2Ftest.txt?v=1567936880285', false); // GETでローカルファイルを開く
    xhr.onload = () => {
        data = xhr.responseText;
    };
    xhr.onerror = () => {
       console.log("error!");
    };
  
    
    xhr.send();
    console.log(data);
    data = data.toString();
    console.log(data);
    let TextData = data.split("\n\n").map(item => {
      //console.log("item----"+item);
      return item.split("\n").map(item2 => {
        //console.log("item2--------" + item2);
        return item2.split(",");
      });
    });
    let TimeData = [];
    let TextDataAll = [];
    for(let i = 0;i<TextData.length;i++){
      if(TextData[i][0][0] != ""){
        TimeData.push(TextData[i][0]);
      }
        TextDataAll.push(TextData[i][1]);
    }
    TextDataAll = TextDataAll.filter(v => v);
    TimeData = TimeData.map(item => {
      //console.log(item[0]);
      let item0=item[0].toString().split(".")[0].split(":");
      let item1=item[1].toString().split(".")[0].split(":");
      return [parseInt(item0[0]*360)+parseInt(item0[1],10)*60+parseInt(item0[2],10),parseInt(item1[0]*360)+parseInt(item1[1],10)*60+parseInt(item1[2],10)];
    });
    //console.log(TimeData);
    //console.log(TextDataAll);
    let TextDataSplit = TextDataAll.map((item) => {
      if(item != undefined){
        //console.log(item[0]);
        return item[0].split(" ");
      }
    });
    //console.log(TextDataSplit);
    TextData = [];
    let i = 0;
    
    console.log("=>"+TextDataSplit[0]);
    console.log("==>"+TextDataAll[0]);
    
    for(let i = 0;i<TextDataAll.length;i++){
      let answer ="";
      for(let j = 0; j<TextDataSplit[i].length;j++){
        let random = Math.floor(Math.random() * Math.floor(TextDataSplit[i].length));
        answer = TextDataSplit[i][random];
      }
      TextData.push([TextDataAll[i][0].split(answer),answer]);
    }
    console.log(TextData);
    
    return [TextData,TimeData];
  }
  