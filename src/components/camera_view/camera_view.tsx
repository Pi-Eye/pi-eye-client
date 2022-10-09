import { AllSettings } from "camera-interface";
import Cookies from "js-cookie";
import React from "react";
import CameraSettings from "../camera_settings/camera_settings";
import './camera_view.scss';

const NO_SIGNAL_IMG = "/icons/no-camera-icon.png";

type CameraViewProps = {
  socket_name: string,
  show_latency: boolean
};

type CameraViewState = {
  motion: boolean,
  latency: number,
  last_img_src: string,
  img_src: string
  cam_name: string,
  show_settings: boolean
}

class CameraView extends React.Component<CameraViewProps, CameraViewState> {
  private settings_: AllSettings;
  private last_timestamp_ = 0;
  private last_peak_latency_ = 0;
  private next_frame_: {
    frame: Uint8Array;
    motion: boolean;
    timestamp: number;
  };

  private update_latency_: NodeJS.Timer;
  private refresh_frame_: NodeJS.Timer;

  private handle_frame = (event: Event) => {
    const motion = (event as unknown as { detail: { motion: boolean } }).detail.motion;
    const timestamp = (event as unknown as { detail: { timestamp: number } }).detail.timestamp;
    const frame = (event as unknown as { detail: { frame: Uint8Array } }).detail.frame;

    if (timestamp < this.last_timestamp_) return;
    this.last_timestamp_ = timestamp;

    this.next_frame_ = {
      frame,
      motion,
      timestamp
    };
  }

  constructor(props: CameraViewProps) {
    super(props);

    this.state = {
      motion: false,
      latency: 0,
      img_src: NO_SIGNAL_IMG,
      last_img_src: "",
      cam_name: "Camera",
      show_settings: false
    };

    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  StartStream() {
    window.addEventListener(this.props.socket_name, this.handle_frame);

    this.update_latency_ = setInterval(() => {
      this.setState({
        latency: this.last_peak_latency_
      });
      this.last_peak_latency_ = 0;
    }, 1000);

    let last_shown_frame_timestamp = 0;
    let same_count = 0;
    this.refresh_frame_ = setInterval(() => {
      if (!this.next_frame_) return;
      if (last_shown_frame_timestamp === this.next_frame_.timestamp) {
        same_count++;

        if (same_count > 30) {
          this.setState({
            img_src: NO_SIGNAL_IMG,
            motion: false
          });
          return;
        }
        return;
      }
      else {
        same_count = 0;
      }
      last_shown_frame_timestamp = this.next_frame_.timestamp;


      const latency = Date.now() - this.next_frame_.timestamp;
      this.last_peak_latency_ = (latency > this.last_peak_latency_) ? latency : this.last_peak_latency_;
      this.last_timestamp_ = this.next_frame_.timestamp;

      window.URL.revokeObjectURL(this.state.last_img_src);

      this.setState({
        last_img_src: this.state.img_src,
        img_src: window.URL.createObjectURL(new Blob([this.next_frame_.frame])),
        motion: this.next_frame_.motion
      });
    }, 16); /////////////////////////////////////////////////// temp (use calculation later)
  }

  openSettings() {
    this.setState({
      show_settings: true
    })
  }

  closeSettings() {
    this.setState({
      show_settings: false
    })
  }

  componentDidMount(): void {
    fetch("http://10.195.189.222:8000/camera_settings", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.props.socket_name
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          try {
            this.settings_ = JSON.parse(data.settings);

            if (this.settings_.text) {
              this.setState({
                cam_name: this.settings_.text.cam_name as string
              });
            }
          } catch (error) {
            console.log(error);
            alert(`Failed to fetch camera data for: ${this.props.socket_name}`);
            return;
          }
          this.StartStream();
        }
        else {
          alert(`Failed to fetch camera data for: ${this.props.socket_name}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount(): void {
    window.URL.revokeObjectURL(this.state.img_src);
    window.URL.revokeObjectURL(this.state.last_img_src);
    window.removeEventListener(this.props.socket_name, this.handle_frame);
    clearInterval(this.update_latency_);
    clearInterval(this.refresh_frame_)
  }

  render() {
    let settings;
    if (this.state.show_settings) settings = <CameraSettings address={this.props.socket_name} settings={JSON.stringify(this.settings_)} close_handler={this.closeSettings}></CameraSettings>
    const video_class = (this.state.motion && this.props.show_latency) ? "camera_stream motion" : "camera_stream";
    let latency_view;
    if (this.props.show_latency) latency_view = <p className="latency_view">{Math.round(this.state.latency)} ms</p>;
    return (
      <div className="camera_view_container">
        {settings}
        <div className="camera_view_buttons">
          <p className="camera_view_cam_name">{this.state.cam_name}</p>
          <button className="camera_view_settings_button" onClick={this.openSettings}>
            <img className="camera_view_settings_icon" src="/icons/settings-icon.png" alt="Camera Settings"></img>
          </button>
        </div>
        {latency_view}
        <img className={video_class} src={this.state.img_src} alt="Camera Video"></img>
      </div >
    );
  }
}

export default CameraView;