import React from "react";
import CameraView from '../camera_view/camera_view';
import WebClient from "./client_connection";
import "./camera_container.scss";
import Cookies from "js-cookie";

type CameraContainerProps = {
}

type CameraContainerState = {
  sockets_wanted: Array<string>
};

class CameraContainer extends React.Component<CameraContainerProps, CameraContainerState> {
  private web_client_: WebClient;
  private socket_address_: string;

  constructor(props: CameraContainerProps) {
    super(props);

    this.state = {
      sockets_wanted: []
    };
  }

  StartSocket() {
    const sockets_wanted: { [key: string]: number } = {};
    for (let i = 0; i < this.state.sockets_wanted.length; i++) {
      sockets_wanted[this.state.sockets_wanted[i]] = i;
    }

    fetch("http://10.195.189.222:8000/socket_address")
      .then((res) => res.json())
      .then((data) => {
        this.socket_address_ = data.socket_address;
        this.web_client_ = new WebClient(this.socket_address_, Cookies.get("auth") as string, sockets_wanted, (frame, timestamp, motion, id) => {
          const event = new CustomEvent(this.state.sockets_wanted[id], {
            detail: {
              frame,
              timestamp,
              motion
            }
          });
          window.dispatchEvent(event)
        });
      })
      .catch((error) => {
        console.log(error.message);
      })


  }

  componentDidMount(): void {
    fetch("http://localhost:8000/list_cameras", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth")
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            sockets_wanted: JSON.parse(data.addresses)
          });
          this.StartSocket();
        } else {
          console.log("Error Fetching Cameras");
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Error Fetching Cameras");
      });
  }

  componentWillUnmount(): void {
    if (this.web_client_) { this.web_client_.Stop(); }
  }

  render() {
    return (
      <div id="camera_container">
        {
          this.state.sockets_wanted.map((socket_name, key) => {
            return (
              <CameraView show_latency={true} socket_name={socket_name} key="1232334"></CameraView>
            );
          })
        }
      </div>
    )
  }
}

export default CameraContainer;