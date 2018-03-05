const config = require('../config.defaults');
const AWSIoTClient = require('../utils/AWSIoTClient');
const uuid = require('uuid/v1');

const awsIoTClient = new AWSIoTClient();

describe('App', function () {
  beforeAll(() => {
    return awsIoTClient.connect(config.awsIoTConfigs, uuid());
  });

  describe('Sensor Data Test', function () {
    it("send test accelerometer sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-accelerometer',
        data: {
          "x": -0.0260009765625,
          "y": -0.93707275390625,
          "z": 0.37823486328125,
          "type": "accelerometer"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test magnetometer sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-magnetometer',
        data: {
          "x": -0.001820000004954636,
          "y": 0.4118800163269043,
          "z": -0.2692199945449829,
          "type": "magnetometer"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test temperature sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-temperature',
        data: {
          "value": -2.5122909545898438,
          "type": "temperature"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test pressure sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-pressure',
        data: {
          "value": 95160.5,
          "type": "pressure"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test gyroscope sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-gyroscope',
        data: {
          "yaw": 89.37448120117188,
          "pitch": 1.3995394706726074,
          "roll": -67.83077239990234,
          "x": 2.071075439453125,
          "y": -0.43365478515625,
          "z": -0.530853271484375,
          "type": "gyroscope"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test uv sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-uv',
        data: {
          "value": 0,
          "risk": "Low",
          "type": "uv"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test altitude sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-altitude',
        data: {
          "value": 526.25,
          "type": "altitude"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test humidity sensor data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-humidity',
        data: {
          "value": 29.052505493164062,
          "type": "humidity"
        }
      }, {}, () => {
        done();
      });
    });

    it("send test face detected data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-face-detected',
        data: {
          "location": {
            "x": 284,
            "y": 153,
            "width": 110,
            "height": 110
          },
          "tag": "FACE",
          "image": {},
          "trackId": 2,
          "demographics": {}
        }
      }, {}, () => {
        done();
      });
    });

    it("send test face demographics data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-face-demographics',
        data: {
          "location":
            {"x": 213, "y": 221, "width": 55, "height": 55},
          "tag": "FACE",
          "trackId": 2,
          "demographics":
            {
              "gender": "MALE",
              "emotion": "CALM",
              "age": 25,
              "pose":
                {
                  "yaw": -0.24303536117076874,
                  "roll": 0.04344254732131958,
                  "pitch": -0.10279278457164764
                },
              "face_id": "4"
            }
        }
      }, {}, () => {
        done();
      });
    });
  });

  describe('Visual recognition Data Test', function () {
    it("send test recognize data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-recognition-recognize',
        data: 'user-face-test-tag'
      }, {}, () => {
        done();
      });
    });

    it("send test reset all data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-recognition-reset-all',
        data: {}
      }, {}, () => {
        done();
      });
    });

    it("send test reset tag data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-recognition-reset-tag',
        data: {}
      }, {}, () => {
        done();
      });
    });

    it("send test train tag data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-recognition-train',
        data: {tags: ['user-face-test-tag']}
      }, {}, () => {
        done();
      });
    });

    it("send test list tags data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-recognition-list-tags',
        data: ['user-face-test-tag']
      }, {}, () => {
        done();
      });
    });

  });

  describe('Voice recognition Data Test', function () {
    it("send test voice command data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-voice-command',
        data: 'alya hi'
      }, {}, () => {
        done();
      });
    });

  });

  describe('Gestures recognition Data Test', function () {
    it("send test gesture palm detected data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-palm-detected',
        data: {"location": {"x": 228, "y": 79, "width": 133, "height": 133}, "tag": "HAND_PALM"}
      }, {}, () => {
        done();
      });
    });

    it("send test gesture fist detected data", (done) => {
      return awsIoTClient.publish('alya-data', {
        dataType: 'matrix-fist-detected',
        data: {"location": {"x": 228, "y": 79, "width": 133, "height": 133}, "tag": "HAND_PALM"}
      }, {}, () => {
        done();
      });
    });

  });
});
