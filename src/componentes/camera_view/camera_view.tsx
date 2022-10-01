import React from "react";

const NO_SIGNAL_IMG = "https://picsum.photos/200/300";

type CameraViewProps = {
  socket_name: string
};

type CameraViewState = {
  motion: boolean,
  last_peak_latency: number,
  latency: number,
  last_img_src: string,
  img_src: string
}

class CameraView extends React.Component<CameraViewProps, CameraViewState> {
  private last_timestamp_ = 0;
  private update_latency_: NodeJS.Timer;
  private handle_frame = (event: Event) => {
    const motion = (event as unknown as { detail: { motion: boolean } }).detail.motion;
    const timestamp = (event as unknown as { detail: { timestamp: number } }).detail.timestamp;
    const frame = (event as unknown as { detail: { frame: Uint8Array } }).detail.frame;

    if (timestamp < this.last_timestamp_) return;
    this.last_timestamp_ = timestamp;
    const latency = Date.now() - timestamp

    window.URL.revokeObjectURL(this.state.last_img_src)
    this.setState({
      motion,
      last_peak_latency: (latency > this.state.last_peak_latency) ? latency : this.state.last_peak_latency,
      last_img_src: this.state.img_src,
      img_src: window.URL.createObjectURL(new Blob([frame]))
    });
  }

  constructor(props: CameraViewProps) {
    super(props);

    this.state = {
      motion: false,
      latency: 0,
      last_peak_latency: 0,
      img_src: NO_SIGNAL_IMG,
      last_img_src: ""
    };
  }

  componentDidMount(): void {
    window.addEventListener(this.props.socket_name, this.handle_frame);
    this.update_latency_ = setInterval(() => {
      this.setState({
        last_peak_latency: 0,
        latency: this.state.last_peak_latency
      });
    }, 1000);
  }

  componentWillUnmount(): void {
    window.URL.revokeObjectURL(this.state.img_src);
    window.URL.revokeObjectURL(this.state.last_img_src);
    window.removeEventListener(this.props.socket_name, this.handle_frame);
    clearInterval(this.update_latency_);
  }

  render() {
    return (
      <div>
        <p>{Math.round(this.state.latency)} ms</p>
        <img src={this.state.img_src} alt="Camera Video"></img>
      </div >
    );
  }
}

export default CameraView;