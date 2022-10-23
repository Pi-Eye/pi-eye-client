import React from 'react';
import './camera_settings.scss';
import Cookies from "js-cookie";
import { AllSettings } from 'camera-interface';

type CameraSettingsProps = {
  address: string,
  settings: string,
  close_handler: () => void
}

type CameraSettingsState = {
  loading: boolean,
  has_settings: boolean,
  pwd: string,

  width?: number,
  height?: number,
  rotation?: number,
  flip?: string,
  bitRate?: number,
  fps?: number,
  codec?: string,
  sensorMode?: number,
  contrast?: number,
  brightness?: number,
  saturation?: number,
  sharpness?: number,
  shutter?: number,
  iso?: number,
  exposureCompensation?: number,
  exposureMode?: string,
  awbMode?: string,
  analogGain?: number,
  digitalGain?: number,
  quality?: number,
  format?: number,
  cam_name?: string,
  text_position?: number,
  show_date?: boolean,
  font_size?: number,
  font_path?: string,
  gaussian_size?: number,
  scale_denominator?: number,
  bg_stabil_length?: number,
  motion_stabil_length?: number,
  min_pixel_diff?: number,
  min_changed_pixels?: number,
  motion_fps_scale?: number,
  device_type?: number,
  device_selection?: number
}

class CameraSettings extends React.Component<CameraSettingsProps, CameraSettingsState> {
  constructor(props: CameraSettingsProps) {
    super(props);

    this.state = {
      loading: false,
      has_settings: false,
      pwd: ""
    }

    this.pwdHandler = this.pwdHandler.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);

    this.widthHandler = this.widthHandler.bind(this);
    this.heightHandler = this.heightHandler.bind(this);
    this.rotationHandler = this.rotationHandler.bind(this);
    this.flipHandler = this.flipHandler.bind(this);
    this.bitRateHandler = this.bitRateHandler.bind(this);
    this.fpsHandler = this.fpsHandler.bind(this);
    this.contrastHandler = this.contrastHandler.bind(this);
    this.brightnessHandler = this.brightnessHandler.bind(this);
    this.saturationHandler = this.saturationHandler.bind(this);
    this.sharpnessHandler = this.sharpnessHandler.bind(this);
    this.shutterHandler = this.shutterHandler.bind(this);
    this.isoHandler = this.isoHandler.bind(this);
    this.exposureCompensationHandler = this.exposureCompensationHandler.bind(this);
    this.exposureModeHandler = this.exposureModeHandler.bind(this);
    this.awbModeHandler = this.awbModeHandler.bind(this);
    this.analogGainHandler = this.analogGainHandler.bind(this);
    this.digitalGainHandler = this.digitalGainHandler.bind(this);
    this.qualityHandler = this.qualityHandler.bind(this);
    this.formatHandler = this.formatHandler.bind(this);
    this.cam_nameHandler = this.cam_nameHandler.bind(this);
    this.text_positionHandler = this.text_positionHandler.bind(this);
    this.font_sizeHandler = this.font_sizeHandler.bind(this);
    this.gaussian_sizeHandler = this.gaussian_sizeHandler.bind(this);
    this.scale_denominatorHandler = this.scale_denominatorHandler.bind(this);
    this.bg_stabil_lengthHandler = this.bg_stabil_lengthHandler.bind(this);
    this.motion_stabil_lengthHandler = this.motion_stabil_lengthHandler.bind(this);
    this.min_pixel_diffHandler = this.min_pixel_diffHandler.bind(this);
    this.min_changed_pixelsHandler = this.min_changed_pixelsHandler.bind(this);
    this.motion_fps_scaleHandler = this.motion_fps_scaleHandler.bind(this);
    this.device_typeHandler = this.device_typeHandler.bind(this);
    this.device_selectionHandler = this.device_selectionHandler.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(): void {
    fetch("/camera_settings", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.props.address
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          try {
            const settings = JSON.parse(data.settings);
            console.log(settings);
            this.setState({
              loading: false,
              has_settings: true,

              width: settings.camera.width,
              height: settings.camera.height,
              rotation: settings.camera.rotation,
              flip: settings.camera.flip,
              bitRate: (settings.camera.bitRate) ? settings.camera.bitRate / 1000000 : 1000000,
              fps: settings.camera.fps,
              codec: settings.camera.codec,
              sensorMode: settings.camera.sensorMode,
              contrast: settings.camera.contrast,
              brightness: settings.camera.brightness,
              saturation: settings.camera.saturation,
              sharpness: settings.camera.sharpness,
              shutter: settings.camera.shutter,
              iso: settings.camera.iso,
              exposureCompensation: settings.camera.exposureCompensation,
              exposureMode: settings.camera.exposureMode,
              awbMode: settings.camera.awbMode,
              analogGain: settings.camera.analogGain,
              digitalGain: settings.camera.digitalGain,
              quality: settings.camera.quality,
              format: settings.camera.format,
              cam_name: settings.text.cam_name,
              text_position: settings.text.text_position,
              show_date: settings.text.show_date,
              font_size: settings.text.font_size,
              font_path: settings.text.font_path,
              gaussian_size: settings.motion.gaussian_size,
              scale_denominator: settings.motion.scale_denominator,
              bg_stabil_length: settings.motion.bg_stabil_length,
              motion_stabil_length: settings.motion.motion_stabil_length,
              min_pixel_diff: settings.motion.min_pixel_diff,
              min_changed_pixels: settings.motion.min_changed_pixels,
              motion_fps_scale: settings.motion.motion_fps_scale,
              device_type: settings.device.device_type,
              device_selection: settings.device.device_choice
            });
          } catch (error) {
            console.log(error);
            return;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  pwdHandler(event: any) { this.setState({ pwd: event.target.value }); }

  widthHandler(event: any) { this.setState({ width: parseInt(event.target.value) }); }
  heightHandler(event: any) { this.setState({ height: parseInt(event.target.value) }); }
  rotationHandler(event: any) { this.setState({ rotation: parseInt(event.target.value) }); }
  flipHandler(event: any) { this.setState({ flip: event.target.value }); }
  bitRateHandler(event: any) { this.setState({ bitRate: parseInt(event.target.value) }); }
  fpsHandler(event: any) { this.setState({ fps: parseInt(event.target.value) }); }
  contrastHandler(event: any) { this.setState({ contrast: event.target.value }); }
  brightnessHandler(event: any) { this.setState({ brightness: parseInt(event.target.value) }); }
  saturationHandler(event: any) { this.setState({ saturation: event.target.value }); }
  sharpnessHandler(event: any) { this.setState({ sharpness: event.target.value }); }
  shutterHandler(event: any) { this.setState({ shutter: parseInt(event.target.value) }); }
  isoHandler(event: any) { this.setState({ iso: parseInt(event.target.value) }); }
  exposureCompensationHandler(event: any) { this.setState({ exposureCompensation: parseInt(event.target.value) }); }
  exposureModeHandler(event: any) { this.setState({ exposureMode: event.target.value }); }
  awbModeHandler(event: any) { this.setState({ awbMode: event.target.value }); }
  analogGainHandler(event: any) { this.setState({ analogGain: parseFloat(event.target.value) }); }
  digitalGainHandler(event: any) { this.setState({ digitalGain: parseFloat(event.target.value) }); }
  qualityHandler(event: any) { this.setState({ quality: parseInt(event.target.value) }); }
  formatHandler(event: any) { this.setState({ format: event.target.value }); }
  cam_nameHandler(event: any) { this.setState({ cam_name: event.target.value }); }
  text_positionHandler(event: any) { this.setState({ text_position: parseInt(event.target.value) }) };
  font_sizeHandler(event: any) { this.setState({ font_size: parseInt(event.target.value) }); }
  gaussian_sizeHandler(event: any) { this.setState({ gaussian_size: parseInt(event.target.value) }); }
  scale_denominatorHandler(event: any) { this.setState({ scale_denominator: parseInt(event.target.value) }); }
  bg_stabil_lengthHandler(event: any) { this.setState({ bg_stabil_length: parseInt(event.target.value) }); }
  motion_stabil_lengthHandler(event: any) { this.setState({ motion_stabil_length: parseInt(event.target.value) }); }
  min_pixel_diffHandler(event: any) { this.setState({ min_pixel_diff: parseInt(event.target.value) }); }
  min_changed_pixelsHandler(event: any) { this.setState({ min_changed_pixels: parseFloat(event.target.value) }); }
  motion_fps_scaleHandler(event: any) { this.setState({ motion_fps_scale: parseInt(event.target.value) }); }
  device_typeHandler(event: any) { this.setState({ device_type: parseInt(event.target.value) }); }
  device_selectionHandler(event: any) { this.setState({ device_selection: parseInt(event.target.value) }); }

  handleSubmitPassword(event: any) {
    event.preventDefault();

    this.setState({ loading: true })

    fetch("/new_camera_password", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.props.address,
        password: this.state.pwd
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const wait = () => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            window.removeEventListener(this.props.address, wait);
          }
          setTimeout(() => {
            window.addEventListener(this.props.address, wait)
          }, 1000);
        } else {
          this.setState({ loading: false })
          console.log("Error Setting New Settings");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false })
        console.log("Error Setting New Settings");
      });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    const settings: AllSettings = {
      camera: {
        width: parseInt(this.state.width as any),
        height: parseInt(this.state.height as any),
        rotation: parseInt(this.state.rotation as any),
        flip: this.state.flip as any,
        bitRate: parseInt(this.state.bitRate as any) * 1000000,
        fps: parseInt(this.state.fps as any),
        codec: this.state.codec as any,
        sensorMode: this.state.sensorMode,
        contrast: parseInt(this.state.contrast as any),
        brightness: parseInt(this.state.brightness as any),
        saturation: parseInt(this.state.saturation as any),
        sharpness: parseInt(this.state.sharpness as any),
        shutter: this.state.shutter,
        iso: parseInt(this.state.iso as any),
        exposureCompensation: parseInt(this.state.exposureCompensation as any),
        exposureMode: this.state.exposureMode as any,
        awbMode: this.state.awbMode as any,
        analogGain: parseFloat(this.state.analogGain as any),
        digitalGain: parseFloat(this.state.digitalGain as any),
        quality: parseInt(this.state.quality as any) as any,
        format: parseInt(this.state.format as any) as any,
      },
      text: {
        cam_name: this.state.cam_name,
        text_position: parseInt(this.state.text_position as any),
        show_date: this.state.show_date,
        font_size: parseInt(this.state.font_size as any),
        font_path: this.state.font_path,
      },
      motion: {
        gaussian_size: parseInt(this.state.gaussian_size as any),
        scale_denominator: parseInt(this.state.scale_denominator as any),
        bg_stabil_length: parseInt(this.state.bg_stabil_length as any),
        motion_stabil_length: parseInt(this.state.motion_stabil_length as any),
        min_pixel_diff: parseInt(this.state.min_pixel_diff as any),
        min_changed_pixels: parseFloat(this.state.min_changed_pixels as any),
        motion_fps_scale: parseFloat(this.state.motion_fps_scale as any),
      },
      device: {
        device_type: parseInt(this.state.device_type as any),
        device_choice: parseInt(this.state.device_selection as any)
      }
    }

    this.setState({ loading: true })

    fetch("/new_camera_settings", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.props.address,
        settings: JSON.stringify(settings)
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const wait = () => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            window.removeEventListener(this.props.address, wait);
          }
          setTimeout(() => {
            window.addEventListener(this.props.address, wait)
          }, 1000);
        } else {
          this.setState({ loading: false })
          console.log("Error Setting New Settings");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false })
        console.log("Error Setting New Settings");
      });
  }

  handleDelete() {
    this.setState({ loading: true })

    fetch("/delete_camera", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.props.address
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => window.location.reload(), 1000);
        } else {
          this.setState({ loading: false })
          console.log("Error Deleting Camera");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false })
        console.log("Error Deleting Camera");
      });
  }


  render(): React.ReactNode {
    let loading;
    if (this.state.loading) {
      loading = <div id="settings_loading"><p>Saving Settings...</p></div>
    }
    let form = <div><h3>Failed to Fetch Settings.</h3><p>Is the Camera connected?<br></br>Do you have permission to edit camera settings?</p></div>;
    if (this.state.has_settings) {
      form = <div>
        <form onSubmit={this.handleSubmitPassword}>
          <h3>Set Password</h3>
          <label>New Password: <input onChange={this.pwdHandler} className="text_input" type="password"></input></label>
          <br></br>
          <input type="submit" value="Set Password" id="camera_settings_submit_button"></input>
          <br></br>
        </form>
        <br></br>
        <br></br>
        <hr></hr>
        <form onSubmit={this.handleSubmit}>
          <h3>Basic Camera</h3>
          <label>Width: <input onChange={this.widthHandler} value={this.state.width} className="number_input" type="number" min="1"></input></label>
          <label>Height: <input onChange={this.heightHandler} value={this.state.height} className="number_input" type="number" min="1"></input></label>
          <label>FPS: <input onChange={this.fpsHandler} value={this.state.fps} className="number_input" type="number" min="1" max="60"></input></label>
          <br></br>
          <hr></hr>

          <h3>Text Settings</h3>
          <label>Camera Name: <input onChange={this.cam_nameHandler} value={this.state.cam_name} className="text_input" type="text"></input></label>
          <br></br>
          <label>Text Position: <select onChange={this.text_positionHandler} value={this.state.text_position} className="select_input">
            <option value="0">Top</option>
            <option value="1">Bottom</option>
          </select></label>
          <label> Font Size: <input onChange={this.font_sizeHandler} value={this.state.font_size} className="number_input" type="number" min="1"></input></label>
          <br></br>
          <hr></hr>

          <h3>Motion Detection Settings</h3>
          <label>Gaussian Size: <input onChange={this.gaussian_sizeHandler} value={this.state.gaussian_size} className="number_input" type="number" min="1"></input></label>
          <label>Scale Amount: <input onChange={this.scale_denominatorHandler} value={this.state.scale_denominator} className="number_input" type="number" min="1"></input></label>
          <br></br>
          <label>Background Stabilization Length: <input onChange={this.bg_stabil_lengthHandler} value={this.state.bg_stabil_length} className="number_input" type="number" min="1"></input></label>
          <br></br>
          <label>Movement Stabilization Length: <input onChange={this.motion_stabil_lengthHandler} value={this.state.motion_stabil_length} className="number_input" type="number" min="1"></input></label>
          <br></br>
          <label>Minimum Pixel Difference: <input onChange={this.min_pixel_diffHandler} value={this.state.min_pixel_diff} className="number_input" type="number" min="0" max="255"></input></label>
          <br></br>
          <label>Minimum Changed Pixels: <input onChange={this.min_changed_pixelsHandler} value={this.state.min_changed_pixels} className="number_input" type="number" min="0" max="1" step="0.001" id="min_changed_pixels"></input></label>
          <br></br>
          <hr></hr>

          <h3>Device Settings</h3>
          <label>Device Type: <select onChange={this.device_typeHandler} value={this.state.device_type} className="select_input">
            <option value="2">Specific</option>
            <option value="0">CPU</option>
            <option value="1">GPU</option>
          </select></label>
          <label>Device Id: <input onChange={this.device_selectionHandler} value={this.state.device_selection} className="number_input" type="number" min="0"></input></label>
          <br></br>
          <hr></hr>

          <h3>Advanced Camera Settings</h3>
          <label>Rotation: <select onChange={this.rotationHandler} value={this.state.rotation} className="select_input">
            <option value="0">0</option>
            <option value="90">90</option>
            <option value="180">180</option>
            <option value="270">270</option>
          </select></label>
          <label>Flip: <select onChange={this.flipHandler} value={this.state.flip} className="select_input">
            <option value="none">None</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="both">Both</option>
          </select></label>


          <br></br>
          <label>Quality: <input onChange={this.qualityHandler} value={this.state.quality} className="number_input" type="number" min="1" max="100"></input></label>
          <label>Bitrate (Mbps): <input onChange={this.bitRateHandler} value={this.state.bitRate} className="number_input" type="number" min="1" max="25"></input></label>
          <br></br>
          <label>Sharpness: <input onChange={this.sharpnessHandler} value={this.state.sharpness} className="number_input" type="number" min="-100" max="100"></input></label>
          <label>Contrast: <input onChange={this.contrastHandler} value={this.state.contrast} className="number_input" type="number" min="-100" max="100"></input></label>
          <br></br>
          <label>Brightness: <input onChange={this.brightnessHandler} value={this.state.brightness} className="number_input" type="number" min="0" max="100"></input></label>
          <label>Saturation: <input onChange={this.saturationHandler} value={this.state.saturation} className="number_input" type="number" min="-100" max="100"></input></label>
          <br></br>
          <label>ISO: <select onChange={this.isoHandler} value={this.state.iso} className="select_input">
            <option value="null">auto</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
          </select></label>
          <label>Exposure Compensation: <input onChange={this.exposureCompensationHandler} value={this.state.exposureCompensation} className="number_input" type="number" min="-10" max="10"></input></label>
          <br></br>
          <label>Exposure Mode: <select onChange={this.exposureModeHandler} value={this.state.exposureMode} className="select_input">
            <option value="off">Off</option>
            <option value="auto">Auto</option>
            <option value="night">Night</option>
            <option value="nightpreview">NightPreview</option>
            <option value="backlight">Backlight </option>
            <option value="spotlight">Spotlight</option>
            <option value="sports">Sports</option>
            <option value="snow">Snow</option>
            <option value="beach">Beach</option>
            <option value="verylong">Very Long</option>
            <option value="fixedfps">Fixed FPS</option>
            <option value="antishake">Antishake</option>
            <option value="fireworks">Fireworks</option>
          </select></label>
          <br></br>
          <label>Auto White Balance Mode: <select onChange={this.awbModeHandler} value={this.state.awbMode} className="select_input">
            <option value="off">Off</option>
            <option value="auto">Auto</option>
            <option value="sun">Sun</option>
            <option value="cloud">Cloud</option>
            <option value="shade">Shade </option>
            <option value="tungsten">Tungsten</option>
            <option value="fluorescent">Fluorescent</option>
            <option value="incandescent">Incandescent</option>
            <option value="flash">Flash</option>
            <option value="horizon">Horizon</option>
            <option value="greyworld">Greyworld</option>
          </select></label>
          <br></br>
          <label>Analog Gain: <input onChange={this.analogGainHandler} value={this.state.analogGain} className="number_input" type="number" min="0" max="12" step="0.1"></input></label>
          <label>Digital Gain: <input onChange={this.digitalGainHandler} value={this.state.digitalGain} className="number_input" type="number" min="0" max="64" step="0.1"></input></label>
          <br></br>

          <input type="submit" value="Save" id="camera_settings_submit_button"></input>
        </form>
      </div>
    }
    return (
      <div className="camera_settings_focus">
        {loading}
        <div className="camera_settings_container">
          <button id="camera_settings_close" onClick={this.props.close_handler}>Close</button>
          <h2 id="camera_settings_header">Settings for {this.props.address}</h2>
          {form}
          <button id="camera_settings_delete_button" onClick={this.handleDelete}>Delete Camera</button>
        </div>
      </div>
    );
  }
}

export default CameraSettings;
