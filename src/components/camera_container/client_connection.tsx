import crypto from "crypto";
import { Buffer } from "buffer/";
import { AllSettings } from "camera-interface";

window.Buffer = Buffer as unknown as typeof window.Buffer;

const CURVE_NAME = "secp521r1";
// Outgoing messages from the clients's perspective
export enum ClientMsgType { unknown = 0, ack = 1, auth0 = 2, auth1 = 3 }
// Incoming message from the clients's perspective
export enum ServerMsgType { unknown = 255, auth0 = 254, auth1 = 253, frame = 252 }

export type ClientMsg = {
  type: ClientMsgType;
  msg: Uint8Array;
}

export type ServerParsedMsg = {
  type: ServerMsgType;
  msg: Uint8Array;
}

/**
 * ParseServerMsgType() - Parses the type of incoming server message
 * @param msg message to parse type from
 * @returns type of message
 */
export function ParseServerMsgType(msg: ArrayBuffer): ServerParsedMsg {
  switch (new Uint8Array(msg, 0, 1)[0]) {
    case (ServerMsgType.auth0): {
      return {
        type: ServerMsgType.auth0,
        msg: new Uint8Array(msg, 1)
      };
    } case (ServerMsgType.auth1): {
      return {
        type: ServerMsgType.auth1,
        msg: new Uint8Array(msg, 1)
      };
    }
    case (ServerMsgType.frame): {
      return {
        type: ServerMsgType.frame,
        msg: new Uint8Array(msg, 1)
      };
    }
    default: {
      return {
        type: ServerMsgType.unknown,
        msg: new Uint8Array(msg, 1)
      };
    }
  }
}

/**
 * AesEncrypt() - Decrypts aes encrypted data
 * @param data buffer of data to encrypt
 * @param key buffer of key to decrypt data
 * @returns encrypted buffer in format: <Initialization Vector [16 Bytes] | aes-128-gcm Encrypted Data... | Authentication Tag [16 Bytes]>
 */
function AesEncrypt(data: Uint8Array, key: Buffer): Buffer {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-128-gcm", key, iv);

  let encrypted = cipher.update(data) as unknown as Buffer;
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, encrypted, authTag]);
}

/**
 * AesDecrypt() - Decrypts aes encrypted data
 * @param encrypted encrypted buffer in format: <Initialization Vector [16 Bytes] | aes-128-gcm Encrypted Data... | Authentication Tag [16 Bytes] >
 * @param key buffer of key to decrypt data
 * @returns buffer of unencrypted data
 */
async function AesDecrypt(encrypted: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = encrypted.slice(0, 16);
  const data = encrypted.slice(16);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      length: 128,
      iv: iv,
      tagLength: 128
    },
    key,
    data
  );

  return new Uint8Array(decrypted);
}

class WebClient {
  private frame_handler_: (frame: Uint8Array, timestamp: number, motion: boolean, id: number) => void;

  private restart_ = true;
  private address_: string;

  private cookie_: string;
  private ecdh_: crypto.ECDH;
  private secret_: CryptoKey;

  private socket_: WebSocket;

  private frame_timeout_: NodeJS.Timeout;

  private sockets_wanted_: {
    [key: string]: number
  }

  private all_settings_: AllSettings;
  get all_settings() { return this.all_settings_; }

  constructor(address: string, cookie: string, sockets_wanted: { [key: string]: number }, frame_handler: (frame: Uint8Array, timestamp: number, motion: boolean, id: number) => void) {
    this.address_ = address;
    this.cookie_ = cookie;
    this.sockets_wanted_ = sockets_wanted;
    this.frame_handler_ = frame_handler;
    this.Connect();
  }

  Stop() {
    this.restart_ = false;
    this.socket_.close();
  }

  private Connect() {
    if (!this.restart_) return;
    this.socket_ = new WebSocket(this.address_);
    this.socket_.binaryType = "arraybuffer";

    this.socket_.onopen = async () => {
      console.log(`Opened socket with: ${this.address_}`);

      // Begin ECDH key exchange once connected
      this.ecdh_ = crypto.createECDH(CURVE_NAME);
      const keys: Uint8Array = this.ecdh_.generateKeys();
      this.Send(this.GenMsg(ClientMsgType.auth0, keys));
    }

    this.socket_.onmessage = (event: { data: ArrayBuffer }) => {
      this.MessageHandler(event.data);
    }

    this.socket_.onclose = (event) => {
      console.log(`Websocket was closed with code: ${event.code}`);
      setTimeout(() => { this.Connect(); }, 2000 + Math.random() * 1000);
    }

    this.socket_.onerror = (error) => {
      console.log("Error on websocket, closing connection. Error:", error);
      this.socket_.close();
    }
  }

  /**
   * SendAck() - Send an acknowledgement
   */
  private SendAck() {
    const ack = new Uint8Array(1);
    ack[0] = ClientMsgType.ack;
    try {
      this.socket_.send(ack);
    } catch { /* */ }
  }

  /**
   * Auth0Handler() - Handles responding to auth0 message
   * @param auth0 auth0 message
   */
  private async Auth0Handler(auth0: ServerParsedMsg) {
    try {
      let key = this.ecdh_.computeSecret(auth0.msg);
      let digest = (await window.crypto.subtle.digest({ name: "SHA-256" }, key)).slice(0, 16);
      this.secret_ = await window.crypto.subtle.importKey(
        "raw",
        digest,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
      );
    }
    catch (error) {
      console.warn(`Failed to compute secret key, terminating connection ${this.address_}. Error: ${error}`);
      this.socket_.close();
      return;
    }

    let encrypted;
    try {
      const auth1_info = {
        sockets_wanted: this.sockets_wanted_,
        cookie: this.cookie_
      };
      const key = await window.crypto.subtle.exportKey("raw", this.secret_);
      encrypted = AesEncrypt(new TextEncoder().encode(JSON.stringify(auth1_info)), Buffer.from(new Uint8Array(key)));
    }
    catch (error) {
      console.warn(`Failed to encrypt message, terminating connection with ${this.address_}. Error: ${error}`);
      this.socket_.close();
      return;
    }

    this.Send(this.GenMsg(ClientMsgType.auth1, encrypted));
  }

  /**
   * Auth1Handler() - Handles responding to auth1 message
   * @param auth1 auth1 message
   */
  private async Auth1Handler(auth1: ServerParsedMsg) {
    try {
      this.all_settings_ = JSON.parse(new TextDecoder().decode(await AesDecrypt(auth1.msg, this.secret_)));
    }
    catch (error) {
      console.warn(`Failed to decrypt and parse camera settings from camera message, terminating connection with ${this.address_}. Error: ${error}`);
      this.socket_.close();
      return;
    }
  }

  /**
   * FrameHandler() - Handles responding to frame message
   * @param frame_msg frame message
   */
  private async FrameHandler(frame_msg: ServerParsedMsg) {
    clearInterval(this.frame_timeout_);
    this.frame_timeout_ = setTimeout(() => {
      console.warn(`Did not recieve frames for 10 seconds, terminating connection with ${this.address_}`);
      this.socket_.close();
    }, 10000);

    this.SendAck();

    let data;
    try {
      data = await AesDecrypt(frame_msg.msg, this.secret_);
    } catch (error) {
      console.warn(`Failed to decrypt and parse frame from camera, terminating connection with ${this.address_}. Error: ${error}`);
      this.socket_.close();
      return;
    }

    let id;
    let motion;
    let timestamp;
    let frame;
    try {
      id = data[0];
      motion = data[1] === 1;
      timestamp = Number(Buffer.from(data.slice(2, 10)).readBigInt64BE(0));
      frame = data.slice(10);
    }
    catch (error) {
      console.warn(`Error while parsing frame, terminating connection with ${this.address_}. Error: ${error}`);
      this.socket_.close();
      return;
    }
    this.frame_handler_(frame, timestamp, motion, id);
  }
  private MessageHandler(message: ArrayBuffer) {
    const msg = ParseServerMsgType(message);
    switch (msg.type) {
      case (ServerMsgType.auth0): {
        this.Auth0Handler(msg);
        break;
      }
      case (ServerMsgType.auth1): {
        this.Auth1Handler(msg);
        break;
      }
      case (ServerMsgType.frame): {
        this.FrameHandler(msg);
        break;
      }
      default: {
        console.log(`Recieved unknown message type from ${this.address_}, terminating connection`);
        this.socket_.close();
      }
    }
  }

  private GenMsg(type: ClientMsgType, data: Uint8Array): ClientMsg {
    const msg = new Uint8Array(1 + data.length);
    msg[0] = type;
    msg.set(data, 1);
    return { type, msg };
  }

  private Send(msg: ClientMsg) {
    try {
      this.socket_.send(msg.msg);
    } catch { /* */ }
  }
}

export default WebClient;