//importとglobal変数の定義
import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter,Link,withRouter} from 'react-router-dom';
import {Form,FormGroup,FormControl,Button, ButtonToolbar,InputGroup,Row,Col} from 'react-bootstrap';
import YouTube from 'react-youtube';
import "../css/Content.css";
let caption = "";
let TimeData = [];
let TextData;
//let start;
//YoutubeDisplayのclass (動画の表示と字幕情報を取ってきて編集し表示)
class YoutubeDisplay extends React.Component {
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
        EndFlag: 0,
        correct: 0,
      }
      //start = this.state.start;
      //setStateを用いるメソッドをbindしておく
      this.Changedata = this.Changedata.bind(this);
      this.Change = this.Change.bind(this);
    }
    //字幕を手に入れるためのメソッド
    async GetCaption() {
        //字幕を入れる変数
        let en_caption ="";
        TimeData = [];
        TextData = [];
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
        console.log(caption);
        //一時的にTextを保持する変数
        let TextDataAll = [];
        //captionを\n\nで区切る(これで一つの字幕の本文と時間を取得できる)
        TextData = caption.split("\n\n").map(item => {
            //console.log("item----"+item);
            //\nで区切る（これにより始まる時間、終わりの時間、文章というように分割できる）
            return item.split("\n");
          });
          //TextData分繰り返す(これにより、全テキストデータにたいし処理を行う)<=ここ上記のmap内に入れられん？
          for(let i = 0;i<TextData.length;i++){
            if(TextData[i][0] != ""){
              TimeData.push(TextData[i][0]);
            }
            TextDataAll.push(TextData[i][1]);
          }
          console.log(TimeData);
          TextDataAll = TextDataAll.filter(v => v);
          TimeData = TimeData.map(item => {
            console.log(item[0]);
            let item0=item.split(",")[0].toString().split(".")[0].split(":");
            let item1=item.split(",")[1].toString().split(".")[0].split(":");
            return [parseInt(item0[0]*360)+parseInt(item0[1],10)*60+parseInt(item0[2],10),parseInt(item1[0]*360)+parseInt(item1[1],10)*60+parseInt(item1[2],10)+1];
          });
          //console.log(TimeData);
          //console.log(TextDataAll);
          let TextDataSplit = [];
          TextDataSplit = TextDataAll.map((item) => {
            if(item != undefined){
              return item.split(" ");
            }
          });
          TextData = [];
          let i = 0;
          //console.log(TextDataSplit[0]);
          for(let i = 0;i<TextDataAll.length;i++){
            let answer ="";
            for(let j = 0; j<TextDataSplit[i].length;j++){
              let random = Math.floor(Math.random() * Math.floor(TextDataSplit[i].length));
              answer = TextDataSplit[i][random];
              //console.log(answer);
            }
            //console.log(TextDataAll[i][0]);
            if(TextDataAll[i] != undefined){
              TextData.push([TextDataAll[i].split(answer),answer]);
            }
          }
          //console.log(TextData);
          //setStateする(同時にできるんでない？)
          this.setState({play: 1});
          this.setState({start: TimeData[0][0]});
          this.setState({end: TimeData[0][1]});
          this.setState({startText: TextData[0][0][0]});
          this.setState({endText: TextData[0][0][1]});
          this.setState({answer: TextData[0][1]});
          this.setState({EndFlag: TimeData.length});
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
     
      this.setState({EndFlag: (TimeData.length -1) - this.val});
      console.log(this.state.EndFlag);
      //答えがあっているかの確認
      if(this.state.userAnswer == this.state.answer){
          this.setState({correct: this.state.correct+1})
          alert("正解です");
      }else{
          alert("正解は"+this.state.answer+"です");
      }
      //EndFlagで終わりの確認
      if(this.state.EndFlag == 0){
        //終わったら結果画面へ
        this.props.ResultChange((this.state.correct/TimeData.length)*100)
        this.props.history.push("/result");
        return true;
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

        if(!this.props.value.toString().match("v=")){
          //URLが間違えである場合の処理
          return(
            <div>
            <p>URLが適切ではありません。YoutubeのURLを入力してください。</p>
            </div>
          );
        }
        //正常な場合のリターン
        return (
          <div>
            <YouTube
              videoId={this.props.value.toString().split("v=")[1]}
              opts={opts}
              onEnd={this._onEnd}
            />
            <Form inline>
              <FormGroup>
                    {this.state.startText}

                    <FormControl 
                      value = {this.state.userAnswer} 
                      onChange={()=>this.Change(event.target.value)}
                      aria-describedby="basic-addon2"
                      className="form-group"
                    />
                    {this.state.endText}
                <Button onClick={() => this.Changedata()}>Enter</Button>
              </FormGroup>
            </Form>
          </div>
        );
    }
    //動画がEndした際の処理
    _onEnd(event) {
      // access to player in all event handlers via event.target
      event.target.seekTo(0,false);
      event.target.stopVideo();
    }

  }

  export default withRouter(YoutubeDisplay);
