import React from "react";
import CameraView from '../camera_view/camera_view';
import WebClient from "./client_connection";

type CameraContainerProps = {
}

type CameraContainerState = {
  sockets_wanted: Array<string>
};

class CameraContainer extends React.Component<CameraContainerProps, CameraContainerState> {
  private web_client_: WebClient;

  constructor(props: CameraContainerProps) {
    super(props);

    this.state = {
      sockets_wanted: ["ws://localhost:8010"]
    };
  }

  componentDidMount(): void {
    const sockets_wanted: { [key: string]: number } = {};
    for (let i = 0; i < this.state.sockets_wanted.length; i++) {
      sockets_wanted[this.state.sockets_wanted[i]] = i;
    }

    this.web_client_ = new WebClient("ws://localhost:8080", "cookie", sockets_wanted, (frame, timestamp, motion, id) => {
      const event = new CustomEvent(this.state.sockets_wanted[id], {
        detail: {
          frame,
          timestamp,
          id
        }
      });
      window.dispatchEvent(event)
    });
  }

  componentWillUnmount(): void {
    this.web_client_.Stop();
  }

  render() {
    return (
      <div>
        <p>Container</p>
        {
          this.state.sockets_wanted.map((socket_name, key) => {
            return (<CameraView socket_name={socket_name} key={key}></CameraView>);
          })
        }
      </div>
    )
  }
}

export default CameraContainer;