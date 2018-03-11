import React, {Component} from 'react'
import moment from 'moment'
import config from './config.defaults.json';
import Icon from 'react-icons-kit';
import { iosPartlysunnyOutline, androidSunny, iosSnowy } from 'react-icons-kit/ionicons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
import ('./style.css');
const AWSIoTClient = require('./utils/AWSIoTClient');
const uuid = require('uuid/v1');
const appConfig = require('./config.defaults');

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

const data = [
    { name: 'Page A', uv: 1000, pv: 2400, amt: 2400, uvError: [75, 20] },
    { name: 'Page B', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40] },
    { name: 'Page C', uv: 280, pv: 1398, amt: 2400, uvError: 40 },
    { name: 'Page D', uv: 200, pv: 9800, amt: 2400, uvError: 20 },
    { name: 'Page E', uv: 278, pv: null, amt: 2400, uvError: 28 },
    { name: 'Page F', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20] },
    { name: 'Page G', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40] },
    { name: 'Page H', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page I', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page J', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60] },
];

class ASMDashboard extends Component {
  constructor(props) {
    super(props);
    moment.locale(config.language);
    this.state = {};
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

  componentWillUnmount() {
    awsIoTClient.disconnect();
  }

  handleSensorData(payload) {
    if (sensorDataTypes.indexOf(payload.dataType) > -1 && payload.status !== 'failed') {
      console.log('sensor data received');
      this.setState((prevState) => {
        const newState = prevState;
        newState[payload.dataType] = JSON.stringify(payload.data);
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
        newState[payload.dataType] = JSON.stringify(payload.data);
        return newState;
      });
    }
  }

  render() {
    return (
      <div>
          {/*weather box container*/}
          <div className={"weatherBoxContainer"}>
              <div className={"temperatureContainer"}>
                <div>  <Icon icon={iosSnowy} size={50} /></div>
              <div>{this.state['matrix-temperature'].toString()}</div>
              </div>

          </div>
          {/*end of weather box container*/}
        <div className="sensorData grey">
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
              <td>Temperature</td>
              <td>{this.state['matrix-temperature'].toString()}</td>
            </tr>
            <tr>
              <td>Pressure</td>
              <td>{this.state['matrix-pressure'].toString()}</td>
            </tr>
            <tr>
              <td>Gyroscope</td>
              <td>{this.state['matrix-gyroscope'].toString()}</td>
            </tr>
            <tr>
              <td>UV</td>
              <td>{this.state['matrix-uv'].toString()}</td>
            </tr>
            <tr>
              <td>Altitude</td>
              <td>{this.state['matrix-altitude'].toString()}</td>
            </tr>
            <tr>
              <td>Humidity</td>
              <td>{this.state['matrix-humidity'].toString()}</td>
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
        </div>
      </div>
    )
  }
}


export default ASMDashboard;
