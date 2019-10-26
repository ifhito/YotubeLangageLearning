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
    componentDidMount() {
        gapi.client.load('youtube', 'v3',  () => {this.GetCaption();});
      }
    // componentDidCatch(error) {
    //   const element = <h1>Hello, world</h1>;
    //   ReactDOM.render(element, document.getElementById('root'));
    // }

    //コンストラクタ
    constructor(props){
      //React御約束
      super(props);
      this.MovieID = this.props.value.toString().split("v=")[1].substr(0, 11);
      //のちにstateを書き変えるための数値
      this.val = 0;
      this.startTextAll=[];
      this.endTextAll= [];
      this.answerAll = [];
      this.userAnswerAll = [];
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
        try{
        request = await gapi.client.youtube.captions.list({
          part: "snippet", 
          videoId: this.MovieID,
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
        //console.log(en_caption);
        //上記のidを用いて字幕の取得を行う
        caption = await gapi.client.youtube.captions.download({
          id: en_caption
        });
        }catch(e){//エラーの取得
          const element = <h1>OOPS!!!すいません。この動画は対応していません。おそらくこの動画は字幕に対しての権限がありません。字幕の編集がオンになっているか確認してください。字幕の編集が可能な動画なら使うことができます。</h1>;
          ReactDOM.render(element, document.getElementById('root'));
          return null;
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
          //undifinedの削除
          TextDataAll = TextDataAll.filter(v => v);
          //末尾の!,?,.,,を分離
          TextDataAll = TextDataAll.map(sentence => {
            let check=false;
            let endword="";
            console.log(i);
            ["!","?",".",","].forEach(end => {
              check = sentence.includes(end);
              endword = end;
            });
            if(check==true){
              return sentence.split(endword)[0]+" "+endword+sentence.split(endword)[1];
            }
            return sentence;
          });
          //時間データを動画開始からの時間に変更
          TimeData = TimeData.map(item => {
            console.log(item[0]);
            let item0=item.split(",")[0].toString().split(".")[0].split(":");
            let item1=item.split(",")[1].toString().split(".")[0].split(":");
            return [parseInt(item0[0]*360)+parseInt(item0[1],10)*60+parseInt(item0[2],10),parseInt(item1[0]*360)+parseInt(item1[1],10)*60+parseInt(item1[2],10)+1];
          });
          //区切ったデータを入れるための配列
          let TextDataSplit = [];
          //空白で区切り単語単位にする
          TextDataSplit = TextDataAll.map((item) => {
            if(item != undefined){
              return item.split(" ");
            }
          });
          TextData = [];
          let i = 0;
          //console.log(TextDataSplit[0]);
          //答えと問題の分離
          for(let i = 0;i<TextDataAll.length;i++){
            let answer ="";
            for(let j = 0; j<TextDataSplit[i].length;j++){
              do{
              let random = Math.floor(Math.random() * Math.floor(TextDataSplit[i].length));
              answer = TextDataSplit[i][random];
              //下記の項目が含まれている限り、繰り返し続ける
              }while(answer.includes(":") || answer.includes(",") || answer.includes(".") || answer.includes("?") || answer.includes("!"))
            }
            //undefinedの排除
            if(TextDataAll[i] != undefined){
              TextData.push([TextDataAll[i].split(answer),answer]);
            }
          }
          //console.log(TextData);
          //全データをsetStateする
          this.setState({
            play: 1,
            start: TimeData[0][0],
            start: TimeData[0][0],
            end: TimeData[0][1],
            startText: TextData[0][0][0],
            endText: TextData[0][0][1],
            answer: TextData[0][1],
          });
          //return [TextData,TimeData];
    }

    //input内のデータが変わったらstateのuserAnswerを更新する
    Change(content){
        this.setState({userAnswer: content})
    }

    //inputが押されたら発火
    async Changedata(){
        //valを+1する
      
      //答えがあっているかの確認
      if(this.state.userAnswer == this.state.answer){
        console.log(this.state.correct);
          await this.setState({correct: this.state.correct+1})
          alert("正解です");
      }else{
          alert("正解は"+this.state.answer+"です");
      }
      this.val=this.val + 1;
      this.startTextAll.push(this.state.startText);
      this.endTextAll.push(this.state.endText);
      this.answerAll.push(this.state.answer);
      this.userAnswerAll.push(this.state.userAnswer);
      //this.setState({EndFlag: (TimeData.length -1) - this.val});
      //console.log(this.state.EndFlag);
      //EndFlagで終わりの確認
      if(this.val == TimeData.length){
        //終わったら結果画面へ
        console.log(this.state.correct);
        console.log(TimeData.length);
        this.props.ResultChange(this.state.correct/TimeData.length*100,this.startTextAll, this.endTextAll, this.answerAll, this.userAnswerAll);
        this.props.history.push("/result");
        return true;
      }

      //次の状態にsetStateする
      this.setState({
        start: TimeData[this.val][0],
        end: TimeData[this.val][1],
        startText: TextData[this.val][0][0],
        endText: TextData[this.val][0][1],
        answer: TextData[this.val][1],
        userAnswer: "",
      });
    }


    //HTMLのレンダリングをする
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
            <div className = "title2">LearningTube</div>
            <YouTube 
              className = "youtube"
              videoId={this.MovieID}
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
