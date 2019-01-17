import React, { Component } from 'react';
import { typingData } from './TypingDataArray'

interface Myprops {
  a?: string
}

interface Mystate {
  // タイピングを行っている問題の全入力パターンの配列、ひらがな読み、漢字読み
  question: [string[], string, string, boolean[]]
  // 何文字目までタイピングしたかを保存
  countLength: number
  // ミスタイピング数
  countMissTyping: number
  // 合計正解タイピング数
  countSuccessTyping: number
  // 入力文字
  nowTypingString: [string, string, string]
  // ゲーム開始フラグ
  gameStart: boolean
  // 開始時間
  startTime: Date
  // 経過時間
  elapsedTime: number
  // 現在入力可能なタイピングパターンのnumber
  truePatern: number
}

class App extends Component<Myprops, Mystate> {
  constructor(props: Myprops) {
    super(props)
    this.state = {
      question: typingData(),
      countLength: 0,
      countMissTyping: 0,
      countSuccessTyping: 0,
      nowTypingString: ["", "", ""],
      gameStart: false,
      startTime: new Date(),
      elapsedTime: 0,
      truePatern: 0
    }
  }

  // truePatern set
  public setTruePatern = (trueNo: number) => {
    this.setState({
      truePatern: trueNo
    })
  }

  // 経過時間取得
  public getTimer = () => {
    const nowTime: number = new Date().getTime()
    let elapsedTime: number = this.state.elapsedTime
    elapsedTime = (nowTime - this.state.startTime.getTime()) / 1000
    this.setState({
      elapsedTime: elapsedTime
    })
  }

  // state.question reset
  public resetQuestion = () => {
    this.setState({
      question: typingData()
    })
  }

  // state.countLength ++
  public incrementCountLength = () => {
    this.setState({
      countLength: this.state.countLength + 1
    })
  }

  // state.countLength 0
  public resetCountLength = () => {
    this.setState({
      countLength: 0
    })
  }

  // state.countMissTyping ++
  public incrementCountMissTyping = () => {
    this.setState({
      countMissTyping: this.state.countMissTyping + 1
    })
  }

  // state.countSuccessTyping ++
  public incrementCountSuccessTyping = () => {
    this.setState({
      countSuccessTyping: this.state.countSuccessTyping + 1
    })
  }

  // 入力不可能になったパターンを保存
  public questionSetFalse = (falseArray: boolean[]) => {
    const a: [string[], string, string, boolean[]] = this.state.question
    a[3] = falseArray
    this.setState({
      question: a
    })
  }

  // 入力中の文字を分解[入力済、入力中、末入力]
  public nowTyping = () => {
    this.state.question[3].forEach((value, index) => {
      if (this.state.question[3][index]) {
        const nowTypingString: string = this.state.question[0][index]
        const alreadyTyping: string = nowTypingString.slice(0, this.state.countLength)
        const nowTypingChar: string = nowTypingString.substr(this.state.countLength, 1)
        const notYetTyping: string = nowTypingString.slice(this.state.countLength + 1, nowTypingString.length)
        const arrayString: [string, string, string] = [alreadyTyping, nowTypingChar, notYetTyping]
        this.setNowTypingString(arrayString)
      }
    })
  }

  // 今どの文字を入力しているのか
  public setNowTypingString = (a: [string, string, string]) => {
    let b: [string, string, string] = this.state.nowTypingString
    b = a
    this.setState({
      nowTypingString: b
    })
  }

  // gameStartStop
  public gameStartStop = () => {
    let a: boolean = this.state.gameStart
    if (a) {
      a = false
    } else {
      a = true
      this.setState({
        question: typingData(),
        countLength: 0,
        countMissTyping: 0,
        countSuccessTyping: 0,
        startTime: new Date(),
        elapsedTime: 0,
        truePatern: 0,
      })
    }
    this.setState({
      gameStart: a
    })
  }

  // state. 今の問題が終われば初期化
  public b = () => {
    this.state.question[0].forEach((value, index) => {
      if (this.state.question[3][index]) {
        if (this.state.question[0][index].length <= this.state.countLength) {
          this.resetCountLength()
          this.resetQuestion()
          this.setTruePatern(0)
        }
      }
    })
  }

  // 問題と答えを比較
  public a = (eventKey: string) => {
    // タイピングが成功したものが一つでもあるか
    let trueAnswer: boolean = false
    // （タイピングが失敗||パターンが一致しない）ものは以降入力不可としたいため配列
    const questionAliveSave: boolean[] = []
    this.state.question[3].forEach((value, index) => {
      // valueを使うとエラーが起きる
      questionAliveSave[index] = this.state.question[3][index]
    })
    this.state.question[0].forEach((value, index) => {
      // valueを使うとエラーが起きる
      if (this.state.question[3][index]) {
        // タイピングが成功したか
        if (this.state.question[0][index].charAt(this.state.countLength) == eventKey) {
          // 一つでも成功すればよい
          trueAnswer = true
          this.setTruePatern(index)
        } else {
          // 成功しなかったものは、それ以降入力できない扱いにしたい
          questionAliveSave[index] = false
        }
      }
    })
    // タイピングが1文字でも成功していれば
    if (trueAnswer) {
      this.incrementCountSuccessTyping()
      this.incrementCountLength()
      this.questionSetFalse(questionAliveSave)
      this.b()
    } else {
      this.incrementCountMissTyping()
    }
  }

  public componentDidMount = () => {
    window.addEventListener("keydown", (event) => {
      this.a(event.key)
      this.nowTyping()
      // console.log(event.key)
      if (event.key == 'Escape' || event.key == ' ') {
        this.gameStartStop()
      }
    })
    setInterval(() => {
      this.getTimer()
    }, 60)
  }

  public render = () => {
    return (
      <div>
        <div>
          もんだい:{this.state.gameStart ? this.state.question[2] : ""}
        </div>
        <div>
          よみ:{this.state.gameStart ? this.state.question[1] : ""}
        </div>
        <div>
          あるふぁべっと:{this.state.gameStart ? this.state.question[0][this.state.truePatern] : ""}
        </div>
        <div>
          入力可能パターン:{this.state.gameStart ? this.state.question[0].length : ""}
        </div>
        <div>
          今何文字目:{this.state.gameStart ? this.state.countLength : ""}
        </div>
        <div>
          成功タイピング数:{this.state.gameStart ? this.state.countSuccessTyping : ""}
        </div>
        <div>
          ミスタイピング数:{this.state.gameStart ? this.state.countMissTyping : ""}
        </div>
        <div>
          キー/秒:{this.state.gameStart ? Math.round((this.state.countSuccessTyping / this.state.elapsedTime) * 1000) / 1000 : ""}
        </div>
        <div>
          経過時間:{this.state.gameStart ? this.state.elapsedTime : ""}
        </div>
        <div>
          <button onClick={this.gameStartStop}>{this.state.gameStart ? "STOP" : "START"}</button>
          Escape or Space
        </div>
      </div>
    )
  }
}

export default App
