import React, {Component} from 'react'
import moment from 'moment'
import config from './config.defaults.json';
import Icon from 'react-icons-kit';
import Typist from 'react-typist';
import { iosPartlysunnyOutline, androidSunny,iosLightbulb,
    iosSnowy, waterdrop, arrowGraphUpRight, iosAnalytics, iosPulseStrong, iosCheckmarkOutline, androidHand} from 'react-icons-kit/ionicons';
import {ic_face} from 'react-icons-kit/md';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
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
        voiceComm:'undefined',
        gard:0,
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
    })
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

   componentWillReceiveProps()
  {
      if(this.state.gard ===1)
      { this.setState({voiceComm:1})}

  }
  componentWillUnmount() {
    awsIoTClient.disconnect();
  }

  handleSensorData(payload) {
    if (sensorDataTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('sensor data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = (payload.data);
        return newState;
      });
    }
  }

  handleVoiceRecognitionData(payload) {
    if (voiceRecognitionTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('voice recognition data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = JSON.stringify(payload.data);
        return newState;
      });
    }
  }

  handleVisualRecognitionData(payload) {
    if (visualRecognitionTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('visual recognition data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = JSON.stringify(payload.data);
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
      <div  className={"container"}>
          {/* Left Screen Container*/}
        <div className={"leftScreenContainer"}>
        {/*weather box container*/}
        <div className={"weatherBoxContainer"}>
          <div className={"temperatureContainer"}>
            <div>  <Icon icon={iosSnowy} size={70} /></div>
            <div className={"temperatureText"}>{String(Object.values(this.state['matrix-temperature'])[0]).substring(0,5) + "  °C"}</div>
          </div>
          <div className={"otherWeatherDataContainer"}>
            <div className={"HumidityContainer"}>
              <div className={"iconContainer"}>  <Icon icon={arrowGraphUpRight} size={25} /></div>
              <div className={"weatherBoxTextRight"}>{String(Object.values(this.state['matrix-pressure'])[0]).substring(0,5)}</div>
            </div>
            <div className={"HumidityContainer"}>
              <div>  <Icon icon={waterdrop} size={25} /></div>
              <div className={"weatherBoxTextRight"}>{String(Object.values(this.state['matrix-humidity'])[0]).substring(0,5)}</div>
            </div>
            <div className={"HumidityContainer"}>
              <div>  <LineChart width={40} height={30} data={data}>
                  <Line type='monotone' dataKey='pv' dot={""} stroke='lightgreen' strokeWidth={1.5} />
              </LineChart></div>
              <div className={"weatherBoxTextRight"}    >{String(Object.values(this.state['matrix-altitude'])[0]).substring(0,5)}</div>
            </div>
          </div>
        </div>
          {/*Uv container */}
          <div className={"uvLightContainer"}>
            <div>  <Icon icon={iosLightbulb} size={60} /></div>
            <div className={"uvLightSeparator"}/>
            <div className={"uvLightTextContainer"}>
            <div className={"uvLightText"}>Value: {String(Object.values(this.state['matrix-uv'])[0]).substring(0,5)}</div>
            <div className={"uvLightText"}>Risk: {String(Object.values(this.state['matrix-uv'])[1]).substring(0,5)}</div>

            </div>
            </div>
            {/* Fist Detected container */}
            <div className="recognitionRecognized">
                <div className="recognitionFistImage">
                </div>
                <div className={"uvLightSeparator"}/>
                <div className="recognitionTrainText">
                    Fist Detected: {String(Object.values(this.state['matrix-fist-detected'])[1])}
                </div>
            </div>
   {/*     <div className="sensorData grey">
          <table>
            <tbody>
            <tr>
              <th>Sensor Name</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Accelerometer</td>
              <td>{this.state['matrix-accelerometer'].toString()}</td>
            </tr>
            <tr>
              <td>Magnetometer</td>
              <td>{this.state['matrix-magnetometer'].toString()}</td>
            </tr>
            <tr>
              <td>Gyroscope</td>
              <td>{this.state['matrix-gyroscope'].toString()}</td>
              <LineChart width={300} height={100} data={data}>
                <Line type='monotone' dataKey='pv' stroke='lightgray' strokeWidth={2} />
              </LineChart>*
            </tr>

            <tr>
              <td>Face Detected</td>
              <td>{this.state['matrix-face-detected'].toString()}</td>
            </tr>
            <tr>
              <td>Face Demographics</td>
              <td>{this.state['matrix-face-demographics'].toString()}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="voiceRecogData grey">
          <span>Voice Command</span>
          <span>{this.state['matrix-voice-command']}</span>
        </div>

        <div className="visualRecogData grey">
          <table>
            <tbody>
            <tr>
              <th>Command</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Matrix recognition list tags</td>
              <td>{this.state['matrix-recognition-list-tags'].toString()}</td>
            </tr>
            <tr>
              <td>Matrix recognition reset tag</td>
              <td>{this.state['matrix-recognition-reset-tag'].toString()}</td>
            </tr>
            <tr>
              <td>Matrix recognition reset all</td>
              <td>{this.state['matrix-recognition-reset-all'].toString()}</td>
            </tr>
            <tr>
              <td>Matrix recognition train tag</td>
              <td>{this.state['matrix-recognition-train'].toString()}</td>
            </tr>
            <tr>
              <td>Matrix recognition recognize tag</td>
              <td>{this.state['matrix-recognition-recognize'].toString()}</td>
            </tr>
            </tbody>
          </table>

        </div>

        <div className="gesturesRecogData grey">
          <table>
            <tbody>
            <tr>
              <th>Gesture</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Palm Detected</td>
              <td>{this.state['matrix-palm-detected'].toString()}</td>
            </tr>
            <tr>
              <td>Fist Detected</td>
              <td>{this.state['matrix-fist-detected'].toString()}</td>
            </tr>
            </tbody>
          </table>
        </div>*/}
        </div>
          {/* Center Screen Container*/}
        <div className="centerScreenContainer">
            {/* face Demographics Container*/}
          <div className="faceDemographicsContainer">
              <div className="recognitionTrainIcon">
                  <Icon icon={ic_face} size={60} />
              </div>
              <div className={"uvLightSeparator"}/>
            <div className='faceDemographicsTextContainer'>

                <div className='faceDemographicsText'>Gender: {String(Object.values(this.state['matrix-face-demographics'])[3])}</div>
              <div className='faceDemographicsText'>Age: {String(Object.values(this.state['matrix-face-demographics'])[3])}</div>
              <div className='faceDemographicsText'>Emotion: {String(Object.values(this.state['matrix-face-demographics'])[3])}</div>
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
                ><Typist.Delay ms={1250} />
                    <span>{String(Object.values(this.state['matrix-voice-command'])[1])}</span>
                </Typist>
            </div>
          </div>
      </div>
          {/* Right Screen Container*/}
          <div className="rightScreenContainer">
            <div className="recognitionTrain">

                    <div class="signal"> </div>

                <div className={"uvLightSeparator"}/>
              <div className="recognitionTrainText">
                 Training: {this.state['matrix-recognition-train'].toString()}
              </div>
            </div>
              <div className="recognitionRecognized">
                  <div className="recognitionRecognizedImage">

                  </div>
                  <div className={"uvLightSeparator"}/>
                  <div className="recognitionTrainText">
                      Recognized: {this.state['matrix-recognition-recognize'].toString()}
                  </div>
              </div>

              <div className="recognitionRecognized">
                  <div className="recognitionTrainIcon"> <Icon icon={androidHand} size={60} /></div>
                  <div className={"uvLightSeparator"}/>
                  <div className="recognitionTrainText">
                      Palm Detected:{String(Object.values(this.state['matrix-palm-detected'])[1])}
                  </div>
              </div>
          </div>
      </div>
    )
  }
}


export default ASMDashboard;
