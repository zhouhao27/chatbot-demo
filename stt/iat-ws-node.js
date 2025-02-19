/**
 *
 * 运行前：请先填写Appid、APIKey、APISecret
 *
 * 语音听写流式 WebAPI 接口调用示例 接口文档（必看）：https://doc.xfyun.cn/rest_api/语音听写（流式版）.html
 * webapi 听写服务参考帖子（必看）：http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=38947&extra=
 * 语音听写流式WebAPI 服务，热词使用方式：登陆开放平台https://www.xfyun.cn/后，找到控制台--我的应用---语音听写---服务管理--上传热词
 * 注意：热词只能在识别的时候会增加热词的识别权重，需要注意的是增加相应词条的识别率，但并不是绝对的，具体效果以您测试为准。
 * 错误码链接：https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * @author iflytek
 */
const CryptoJS = require("crypto-js");
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { appid, apiSecret, apiKey } from '../constants';

// const inputFilePath = (Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) + '/16k_10.pcm';
const outPutFilePath = (Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) + '/ita_result.txt';
// For testing only
const inputFilePath = '/data/user/0/sg.com.ncs.chatpoc/files/16k_10.wav';
// const inputFilePath = (Platform.OS === 'ios' ? RNFS.MainBundlePath : '../assets/sounds') + '/16k_10.pcm';

var seq = 0;
var full_result = "";

// 系统配置
const config = {
  // 请求地址
  hostUrl: "wss://iat.cn-huabei-1.xf-yun.com/v1",
  host: "iat.cn-huabei-1.xf-yun.com",
  //在控制台-我的应用-语音听写（流式版）获取
  appid,
  //在控制台-我的应用-语音听写（流式版）获取
  apiSecret,
  //在控制台-我的应用-语音听写（流式版）获取
  apiKey,
  uri: "/v1",
};

// 帧定义
const FRAME = {
  STATUS_FIRST_FRAME: 0,
  STATUS_CONTINUE_FRAME: 1,
  STATUS_LAST_FRAME: 2,
};

// 设置当前临时状态为初始化
let status = FRAME.STATUS_FIRST_FRAME;
// 记录本次识别用sid
let currentSid = "";
let wsocket;
let onMessageCallback

export default function startiat(audioPath, callback) {
  console.log("startiat:", audioPath);
  onMessageCallback = callback
  seq = 0
  status = FRAME.STATUS_FIRST_FRAME
  // 获取当前时间 RFC1123格式
  let date = (new Date().toUTCString())
  // 设置当前临时状态为初始化
  let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
  wsocket = new WebSocket(encodeURI(wssUrl));

  // 连接建立完毕，读取数据进行识别
  wsocket.onopen = () => {
    console.log("websocket connect!");
    readFile(audioPath)
  };

  // 得到结果后进行处理，仅供参考，具体业务具体对待
  wsocket.onmessage = e => {
    if (e.err) {
      console.log(`onmessage->err:${e.err}`);
      return;
    }
    res = JSON.parse(e.data);

    // console.log(res)
    if (res.header.code != 0) {
      console.log(`onmessage->error code2 ${res.code}, reason ${res.message}`);
      return;
    }

    if (res.payload) {
      if (res.payload.result) {
        let text_encoded = Buffer.from(
          res.payload.result.text,
          "base64"
        ).toString("utf8");

        const { ws = [], sub_end, bg, ed, sn, pgs } = JSON.parse(text_encoded);

        if (pgs == "apd") {
          let str = "";
          for (let i = 0; i < ws.length; i++) {
            let wp = ws[i].cw[0].wp;
            if (wp != "s") {
              str += ws[i].cw[0].w;
            }
          }
          console.log("子句最终识别结果：" + str);
          // save("子句最终识别结果：" + str + "\n")
          full_result = full_result + str;
        }

        if (res.payload.result.status == 2) {
          currentSid = res.header.sid
          console.log("最终完整识别结果：" + full_result);
          // save(full_result)
          if (onMessageCallback) {
            onMessageCallback(full_result)
          }
          wsocket.close()
        }
      }
    }
  };

  // 资源释放
  wsocket.onclose = e => {
    full_result = ""
    console.log(`本次识别sid：${currentSid}`);
    console.log('connect close!' + e.code, e.reason);
  };

  // 连接错误
  wsocket.onerror = e => {
    console.log("websocket connect err: " + err);
  };
}

// 鉴权签名
function getAuthStr(date) {
  let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`;
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret);
  let signature = CryptoJS.enc.Base64.stringify(signatureSha);
  let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  let authStr = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(authorizationOrigin)
  );
  return authStr;
}

// 传输数据
function send(data) {
  let frame = "";
  let param = {
    iat: {
      domain: "slm",
      language: "mul_cn",
      accent: "mandarin",
      vinfo: 0,
      dwa: "wpgs",
      result: {
        encoding: "utf8",
        compress: "raw",
        format: "json",
      },
    },
  };

  let pyload = {
    audio: {
      encoding: "raw",
      sample_rate: 16000,
      channels: 1,
      bit_depth: 16,
      seq: seq,
      status: status,
      audio: data,
    },
  };

  switch (status) {
    case FRAME.STATUS_FIRST_FRAME:
      frame = {
        header: {
          app_id: config.appid,
          status: status,
        },
        parameter: param,
        payload: pyload,
      };
      wsocket.send(JSON.stringify(frame));
      seq = seq + 1;
      status = FRAME.STATUS_CONTINUE_FRAME;
      break;

    case FRAME.STATUS_CONTINUE_FRAME:
    case FRAME.STATUS_LAST_FRAME:
      frame = {
        header: {
          app_id: config.appid,
          status: status,
        },
        payload: pyload,
      };
      wsocket.send(JSON.stringify(frame));
      seq = seq + 1;
      break;
  }
}

async function readFile(audioPath) {
  try {
    const stream = await RNFetchBlob.fs.readStream(
      // inputFilePath,
      audioPath,
      'base64',  // 读取编码，可选 'base64', 'utf8', 'ascii'
      1024      // 缓冲区大小，控制读取数据的块大小
    );

    stream.open();
    stream.onData((chunk) => {
      //  console.log('Received chunk:', chunk);
      send(chunk)
    });

    stream.onError((err) => {
      console.error('Stream Error:', err);
    });

    stream.onEnd(() => {
      console.log('Stream finished',);
      status = FRAME.STATUS_LAST_FRAME;
      send("")
    });

  } catch (error) {
    console.error('Failed to open stream:', error);
  }
}

// 保存文件
// function save(data) {
//   if (onMessageCallback) {
//     onMessageCallback(data)
//   }
//   RNFS.appendFile(outPutFilePath, data, "utf8")
//     .then(() => {
//       // 写入成功
//       console.log('JSON data has been written to the file.');
//     })
//     .catch((error) => {
//       // 写入失败
//       console.error('Error writing to the JSON file:', error);
//     });
// }