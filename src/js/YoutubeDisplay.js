//importとglobal変数の定義
import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link} from 'react-router-dom';
import YouTube from 'react-youtube';
let caption = "";
let TimeData = [];
let TextData;
let start;
//YoutubeDisplayのclass (動画の表示と字幕情報を取ってきて編集し表示)
export default class YoutubeDisplay extends React.Component {
    //非同期処理(Youtube字幕取得)
    componentWillMount() {
        gapi.client.load('youtube', 'v3',  () => {this.GetCaption();});
      }
    //コンストラクタ
    constructor(props){
        //React御約束
      super(props);
      //のちにstateを書き変えるための数値
      this.val = 0;
      //state
      //startは動画をスタートする時間
      //endは動画を終わらせる時間
      //startTextは問題の前の文章=>{ここ}<input/>{end}
      //endTextは問題の後の文章=>{}<input/>{ここ}
      //answerは答え
      //userAnswerは入力者の答え
      //playは動画を始めるか始めないかを決める数値(0 or 1)
      this.state = {
        start: 0,
        end: 0,
        startText:"",
        endText: "",
        answer: "",
        userAnswer: "",
        play:0,
      }
      start = this.state.start;
      //setStateを用いるメソッドをbindしておく
      this.Changedata = this.Changedata.bind(this);
      this.Change = this.Change.bind(this);
    }
    //字幕を手に入れるためのメソッド
    async GetCaption() {
        //字幕を入れる変数
        let en_caption ="";
        //字幕のinfoリストを取得
        let request;
        request = await gapi.client.youtube.captions.list({
          part:"snippet", 
          videoId:this.props.value.toString().split("v=")[1],
        });
        //確認
        //console.log(request.result.items[0].snippet.language);
        //上記で手に入れた情報のresult.items.snippet.languageがenの場合、en_captionにそのidを代入し、ループから抜け出す
        Object.keys(request.result.items).forEach(i =>{
          //console.log(i);
          if(request.result.items[i].snippet.language == "en"){
            en_caption = request.result.items[i].id;
            return true;
          }
        });
        //上記のidを用いて字幕の取得を行う
        try{ 
        caption = await gapi.client.youtube.captions.download({
          id: en_caption
        });}catch(e){
            console.log(e);
        }
        //caption.bodyをcaptionに入れる(これが字幕の内容)
        caption =caption.body;
        //captionを\n\nで区切る(これで一つの字幕の本文と時間を取得できる)
        TextData = caption.split("\n\n").map(item => {
            //console.log("item----"+item);
            //\nで区切る（これにより始まる時間、終わりの時間、文章というように分割できる）
            return item.split("\n").map(item2 => {
              //console.log("item2--------" + item2);
              return item2.split(",");
            });
          });
          //一時的にTextを保持する変数
          let TextDataAll = [];
          //TextData分繰り返す(これにより、全テキストデータにたいし処理を行う)<=ここ上記のmap内に入れられん？
          for(let i = 0;i<TextData.length;i++){
              //TextDataの時間要素が空白ではない場合
            if(TextData[i][0][0] != ""){
                //時間をTimeDataに保持(["starttime","endtime"])
              TimeData.push(TextData[i][0]);
            }
            //文章データをTextDataAllに入れる(["content"])
              TextDataAll.push(TextData[i][1]);
          }
          //undifinedを削除
          TextDataAll = TextDataAll.filter(v => v);
          //TimeDataを秒数の整数に変換する。
          TimeData = TimeData.map(item => {
            //console.log(item[0]);
            //時間データStart => [hour,minutes,second]
            let item0=item[0].toString().split(".")[0].split(":");
            //時間データEnd => [hour,minutes,second]
            let item1=item[1].toString().split(".")[0].split(":");
            //[StartHour*360+StartMinutu*60+StartSeconds,EndHour*360+EndMinutu*60+EndSeconds+2]
            return [parseInt(item0[0]*360)+parseInt(item0[1],10)*60+parseInt(item0[2],10),parseInt(item1[0]*360)+parseInt(item1[1],10)*60+parseInt(item1[2],10)+2];
          });
          //console.log(TimeData);
          //console.log(TextDataAll);
          //TextDataを単語ごとにSplitする
          let TextDataSplit = TextDataAll.map((item) => {
            if(item != undefined){
              //console.log(item[0]);
              return item[0].split(" ");
            }
          });
          //console.log(TextDataSplit);
          //TextDataの初期化
          TextData = [];
          
          //console.log("=>"+TextDataSplit[0]);
          //console.log("==>"+TextDataAll[0]);
          //Randamな単語で文章をsplitし、answerとQuestionに分割する
          for(let i = 0;i<TextDataAll.length;i++){
            let answer ="";
            for(let j = 0; j<TextDataSplit[i].length;j++){
              let random = Math.floor(Math.random() * Math.floor(TextDataSplit[i].length));
              answer = TextDataSplit[i][random];
            }
            TextData.push([TextDataAll[i][0].split(answer),answer]);
          }
          //console.log(TextData);
          //setStateする(同時にできるんでない？)
          this.setState({play: 1});
          this.setState({start: TimeData[0][0]});
          this.setState({end: TimeData[0][1]});
          this.setState({startText: TextData[0][0][0]});
          this.setState({endText: TextData[0][0][1]});
          this.setState({answer: TextData[0][1]});
          //return [TextData,TimeData];
    }
    //input内のデータが変わったらstateのuserAnswerを更新する
    Change(content){
        this.setState({userAnswer: content})
    }
    //inputが押されたら発火
    Changedata(){
        //valを+1する
      this.val=this.val + 1;
      //答えがあっているかの確認
      if(this.state.userAnswer == this.state.answer){
          alert("正解です");
      }else{
          alert("正解は"+this.state.answer+"です");
      }
      //次の状態にsetStateする
      this.setState({start: TimeData[this.val][0]});
      this.setState({end: TimeData[this.val][1]});
      this.setState({startText: TextData[this.val][0][0]});
      this.setState({endText: TextData[this.val][0][1]});
      this.setState({answer: TextData[this.val][1]});
      this.setState({userAnswer: ""});

      //console.log(this.state.start);
    }
    //renderをする
    render() {
        const opts = {
          height: '390',
          width: '640',
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: this.state.play,
            start: this.state.start,
            end : this.state.end,
          }
        };
      
        return (
          <div>
          <YouTube
            videoId={this.props.value.toString().split("v=")[1]}
            opts={opts}
            //onEnd={this._onEnd}
          />
          {this.state.startText}<input value = {this.state.userAnswer} onChange={()=>this.Change(event.target.value)}/>{this.state.endText}
          <button onClick={() => this.Changedata()}>OK</button>
          </div>
        );
    }
    //動画がEndした際の処理
    _onEnd(event) {
      // access to player in all event handlers via event.target
      event.target.seekTo(start,true);
      event.target.stopVideo();
    }

  }
