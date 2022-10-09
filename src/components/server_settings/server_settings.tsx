import React from 'react';
import './camera_settings.scss';
import Cookies from "js-cookie";
import { AllSettings } from 'camera-interface';

type ServerSettingsProps = {
  address: string,
  settings: string,
  close_handler: () => void
}

type ServerSettingsState = {
  loading: boolean,
}

class ServerSettings extends React.Component<ServerSettingsProps, ServerSettingsState> {
  constructor(props: ServerSettingsProps) {
    super(props);

    const settings: AllSettings = JSON.parse(this.props.settings);
    console.log(settings);
    this.state = {
      loading: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: any) {
    event.preventDefault();

    this.setState({ loading: true })
    const settings = {};

    fetch("http://localhost:8000/new_server_settings", {
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
          window.location.reload();
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

  render(): React.ReactNode {
    let loading;
    if (this.state.loading) {
      loading = <div id="settings_loading"><p>Saving Settings...</p></div>
    }
    return (
      <div className="server_settings_focus">
        {loading}
        <div className="server_settings_container">
          <button id="server_settings_close" onClick={this.props.close_handler}>Close</button>
          <h2 id="server_settings_header">Settings for {this.props.address}</h2>
          <form onSubmit={this.handleSubmit}>
            <input type="submit" value="Save" id="server_settings_submit_button" onClick={this.handleSubmit}></input>
          </form>
        </div>
      </div>
    );
  }
}

export default ServerSettings;
