import React, {Component} from 'react'
import moment from 'moment'
import config from './config.defaults.json';
import Icon from 'react-icons-kit';
import Typist from 'react-typist';
import {
  iosLightbulb, iosSnowy, waterdrop, arrowGraphUpRight, androidHand
} from 'react-icons-kit/ionicons';
import {ic_face} from 'react-icons-kit/md';
import {
  LineChart, Line
} from 'recharts';

import ('./style.css');
import  ('./animate.css');
const AWSIoTClient = require('./utils/AWSIoTClient');
const uuid = require('uuid/v1');
const appConfig = require('./config.defaults');
const data = [
  {name: '1', uv: 8000, pv: 2400, amt: 2400},
  {name: '2', uv: 3000, pv: 1398, amt: 2210},
  {name: '3', uv: 2000, pv: 9800, amt: 2290},
  {name: '4', uv: 2780, pv: 3908, amt: 2000},
  {name: '5', uv: 1890, pv: 4800, amt: 2181},
  {name: '6', uv: 2390, pv: 3800, amt: 2500},
  {name: '7', uv: 0, pv: 4300, amt: 2100},
];
const awsIoTClient = new AWSIoTClient();
const sensorDataTypes = [
  'matrix-accelerometer',
  'matrix-magnetometer',
  'matrix-temperature',
  'matrix-pressure',
  'matrix-gyroscope',
  'matrix-uv',
  'matrix-altitude',
  'matrix-humidity',
  'matrix-face-detected',
  'matrix-face-demographics'
];
const voiceRecognitionTypes = ['matrix-voice-command'];
const visualRecognitionTypes = [
  'matrix-recognition-list-tags',
  'matrix-recognition-reset-tag',
  'matrix-recognition-reset-all',
  'matrix-recognition-train',
  'matrix-recognition-recognize'
];
const gesturesRecognitionTypes = [
  'matrix-palm-detected',
  'matrix-fist-detected'
];

class ASMDashboard extends Component {
  constructor(props) {
    super(props);
    moment.locale(config.language);
    this.state = {
      voiceComm: 'undefined',
      gard: 0,
    };
    this.initState();
  }

  initState() {
    sensorDataTypes.forEach((item) => {
      this.state[item] = {}
    });

    gesturesRecognitionTypes.forEach((item) => {
      this.state[item] = {}
    });

    voiceRecognitionTypes.forEach((item) => {
      this.state[item] = ''
    });

    visualRecognitionTypes.forEach((item) => {
      this.state[item] = {};
    });

    this.state['matrix-recognition-recognize'] = '';

    // custom init
    this.state['matrix-face-demographics'].demographics = {
      gender: '',
      emotion: '',
      age: 0
    };
    this.state['matrix-temperature'].value = '';
    this.state['matrix-pressure'].value = '';
    this.state['matrix-uv'].value = '';
    this.state['matrix-uv'].risk = '';
    this.state['matrix-humidity'].value = '';
    this.state['matrix-altitude'].value = '';
    this.state['matrix-fist-detected'].location = {};
    this.state['matrix-fist-detected'].location.x = '';
    this.state['matrix-fist-detected'].location.y = '';
    this.state['matrix-fist-detected'].location.width = '';
    this.state['matrix-fist-detected'].location.height = '';
    this.state['matrix-palm-detected'].location = {};
    this.state['matrix-palm-detected'].location.x = '';
    this.state['matrix-palm-detected'].location.y = '';
    this.state['matrix-palm-detected'].location.width = '';
    this.state['matrix-palm-detected'].location.height = '';
    this.state['matrix-recognition-train'].tags = []
  }

  componentDidMount() {
    awsIoTClient.connect(appConfig.awsIoTConfigs, uuid())
      .then(() => {
        awsIoTClient.subscribe('alya-data');
        awsIoTClient.onMessage((topic, payload) => {
          payload = JSON.parse(payload.toString());
          console.log('start - message received', topic, payload);
          if (topic === 'alya-data') {
            this.handleSensorData(payload);
            this.handleVoiceRecognitionData(payload);
            this.handleVisualRecognitionData(payload);
            this.handleGesturesRecognitionData(payload);
          }
        });
      })
      .catch((error) => {
        console.log('Something went wrong: ' + error);
      })
  }

  componentWillReceiveProps() {
    if (this.state.gard === 1) {
      this.setState({voiceComm: 1})
    }

  }

  componentWillUnmount() {
    awsIoTClient.disconnect();
  }

  handleSensorData(payload) {
    if (sensorDataTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('sensor data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = payload.data;
        return newState;
      });
    }
  }

  handleVoiceRecognitionData(payload) {
    if (voiceRecognitionTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('voice recognition data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = payload.data;
        return newState;
      });
    }
  }

  handleVisualRecognitionData(payload) {
    if (visualRecognitionTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = payload.data;
        return newState;
      });
    }
  }

  handleGesturesRecognitionData(payload) {
    if (gesturesRecognitionTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('gestures recognition data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = payload.data;
        return newState;
      });
    }
  }

  render() {
    // const dataSet = Array.from();
    return (
      <div className={"container"}>
        {/* Left Screen Container*/}
        <div className={"leftScreenContainer"}>
          {/*weather box container*/}
          <div className={"weatherBoxContainer"}>
            <div className={"temperatureContainer"}>
              <div><Icon icon={iosSnowy} size={70}/></div>
              <div
                className={"temperatureText"}>{this.state['matrix-temperature'].value.toString().substring(0, 5) + "  °C"}</div>
            </div>
            <div className={"otherWeatherDataContainer"}>
              <div className={"HumidityContainer"}>
                <div className={"iconContainer"}><Icon icon={arrowGraphUpRight} size={25}/></div>
                <div
                  className={"weatherBoxTextRight"}>{this.state['matrix-pressure'].value.toString().substring(0, 5)}</div>
              </div>
              <div className={"HumidityContainer"}>
                <div><Icon icon={waterdrop} size={25}/></div>
                <div
                  className={"weatherBoxTextRight"}>{this.state['matrix-humidity'].value.toString().substring(0, 5)}</div>
              </div>
              <div className={"HumidityContainer"}>
                <div><LineChart width={40} height={30} data={data}>
                  <Line type='monotone' dataKey='pv' dot={""} stroke='lightgreen' strokeWidth={1.5}/>
                </LineChart></div>
                <div
                  className={"weatherBoxTextRight"}>{this.state['matrix-altitude'].value.toString().substring(0, 5)}</div>
              </div>
            </div>
          </div>
          {/*Uv container */}
          <div className={"uvLightContainer"}>
            <div><Icon icon={iosLightbulb} size={60}/></div>
            <div className={"uvLightSeparator"}/>
            <div className={"uvLightTextContainer"}>
              <div
                className={"uvLightText"}>Value: {this.state['matrix-uv'].value.toString().substring(0, 5)}</div>
              <div
                className={"uvLightText"}>Risk: {this.state['matrix-uv'].risk.toString().substring(0, 5)}</div>

            </div>
          </div>
          {/* Fist Detected container */}
          <div className="recognitionRecognized">
            <div className="recognitionFistImage">
            </div>
            <div className={"uvLightSeparator"}/>
            <div className="recognitionTrainText">
              X: {this.state['matrix-fist-detected'].location.x.toString()}
              <br/>
              Y:{this.state['matrix-fist-detected'].location.y.toString()}
              <br/>
              Width:{this.state['matrix-fist-detected'].location.width.toString()}
              <br/>
              Height:{this.state['matrix-fist-detected'].location.height.toString()}
            </div>
          </div>
        </div>
        {/* Center Screen Container*/}
        <div className="centerScreenContainer">
          {/* face Demographics Container*/}
          <div className="faceDemographicsContainer">
            <div className="recognitionTrainIcon">
              <Icon icon={ic_face} size={60}/>
            </div>
            <div className={"uvLightSeparator"}/>
            <div className='faceDemographicsTextContainer'>

              <div
                className='faceDemographicsText'>Gender: {this.state['matrix-face-demographics'].demographics.gender.toString()}</div>
              <div
                className='faceDemographicsText'>Age: {this.state['matrix-face-demographics'].demographics.age.toString()}</div>
              <div
                className='faceDemographicsText'>Emotion: {this.state['matrix-face-demographics'].demographics.emotion.toString()}</div>
            </div>
          </div>

          {/* Voice Recognition Container*/}
          <div className="voiceRecognitionContainer">
            <div className="soundImage">
            </div>
            <div>
              <Typist
                className="TypistExample-message"
                cursor={{
                  show: true,
                  blink: true,
                  element: '|',
                  hideWhenDone: false,
                  hideWhenDoneDelay: 1000,
                }}
              ><Typist.Delay ms={1250}/>
                <span>{this.state['matrix-voice-command']}</span>
              </Typist>
            </div>
          </div>
        </div>
        {/* Right Screen Container*/}
        <div className="rightScreenContainer">
          <div className="recognitionTrain">

            <div class="signal"></div>

            <div className={"uvLightSeparator"}/>
            <div className="recognitionTrainText">
              {this.state['matrix-recognition-train'].tags.toString()}
            </div>
          </div>
          <div className="recognitionRecognized">
            <div className="recognitionRecognizedImage">

            </div>
            <div className={"uvLightSeparator"}/>
            <div className="recognitionTrainText">
              {this.state['matrix-recognition-recognize'].toString()}
            </div>
          </div>

          <div className="recognitionRecognized">
            <div className="recognitionTrainIcon"><Icon icon={androidHand} size={60}/></div>
            <div className={"uvLightSeparator"}/>
            <div className="recognitionTrainText">
              X: {this.state['matrix-palm-detected'].location.x.toString()}
              <br/>
              Y:{this.state['matrix-palm-detected'].location.y.toString()}
              <br/>
              Width:{this.state['matrix-palm-detected'].location.width.toString()}
              <br/>
              Height:{this.state['matrix-palm-detected'].location.height.toString()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default ASMDashboard;
