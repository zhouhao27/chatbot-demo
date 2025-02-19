/* Created by iflytek on 2020/03/01.
 *
 * 运行前：请先填写 appid、apiSecret、apiKey
 * 
 * 在线语音合成调用demo
 * 此demo只是一个简单的调用示例，不适合用到实际生产环境中
 *
 * 在线语音合成 WebAPI 接口调用示例 接口文档（必看）：https://www.xfyun.cn/doc/tts/online_tts/API.html
 * 错误码链接：
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * 
 */
const CryptoJS = require('crypto-js')
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { outPutFilePath } from '../constants';
import { playSound } from './index';

let onMessageCallback
// 系统配置 
const config = {
    // 请求地址
    hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
    host: "tts-api.xfyun.cn",
    //在控制台-我的应用-在线语音合成（流式版）获取
    appid: "bbf547d6",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiSecret: "MmIwZGQ1YmEyZDMxYzI1ZTRmMjljOGY5",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiKey: "07b5abadd308a3f6490da1b70fa1d41a",
    text: "这是一个例子，请输入您要合成的文本",
    uri: "/v2/tts",
}

export default async function starttts(content, callback) {
    console.log('starttts:', content);

    onMessageCallback = callback
    // 获取当前时间 RFC1123格式
    let date = (new Date().toUTCString())
    // 设置当前临时状态为初始化
    let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host

    const ws = new WebSocket(encodeURI(wssUrl));
    // 连接建立完毕，读取数据进行识别
    ws.onopen = () => {
        console.log("websocket connect!")
        isFilexit()
        send(content, ws)
    };

    // 得到结果后进行处理，仅供参考，具体业务具体对待
    ws.onmessage = e => {
        if (e.err) {
            console.log('message error: ' + e.err)
            return
        }
        // console.log(e.data);
        let res = JSON.parse(e.data)

        if (res.code != 0) {
            console.log(`${res.code}: ${res.message}`)
            ws.close()
            return
        }

        let audio = res.data.audio
        save(audio)

        if (res.code == 0 && res.data.status == 2) {
            ws.close()
            if (onMessageCallback) {
                onMessageCallback("生成音频文件位置:" + outPutFilePath)
            }
        }
    };

    // 资源释放
    ws.onclose = e => {
        console.log('connect close!' + e.code, e.reason);
        console.log('outPutFilePath:', outPutFilePath);
        playSound(outPutFilePath, () => {
            console.log('playSound end');
        });
    };

    // 连接错误
    ws.onerror = e => {
        console.log("websocket connect err: " + e.message);
    };
}


// 鉴权签名
function getAuthStr(date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
}

// 传输数据
function send(text, ws) {
    console.log('send:', text);
    let frame = {
        "common": {
            "app_id": config.appid
        },
        "business": {
            "aue": "lame",
            "sfl": 1,
            "vcn": "xiaoyan",
            "tte": "UTF8"
        },
        "data": {
            // "text": Buffer.from(config.text).toString('base64'),
            "text": Buffer.from(text).toString('base64'),
            "status": 2
        }
    }
    ws.send(JSON.stringify(frame))
}

// 保存文件
function save(data) {
    console.log('save:', outPutFilePath);
    RNFS.appendFile(outPutFilePath, data, "base64")
        .then(() => {
            // 写入成功
            console.log('JSON data has been written to the file.');
        })
        .catch((error) => {
            // 写入失败
            console.error('Error writing to the JSON file:', error);
        });
}

//检测文件是否存在，存在即删除
async function isFilexit() {
    const exists = await RNFS.exists(outPutFilePath)
    if (exists) {
        console.log('文件存在，删除文件')
        await RNFS.unlink(outPutFilePath);
    }
}

async function getOutputFilePath() {
    try {
        const dir = (Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.ExternalDirectoryPath);
        if (!await RNFS.exists(dir)) {
            await RNFS.mkdir(dir);
        }
        await isFilexit();
        return dir + '/tts_result.pcm';
    } catch (error) {
        console.log('Error creating directory:', error);
        return null;
    }
}

