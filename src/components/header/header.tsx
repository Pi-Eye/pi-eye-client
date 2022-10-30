import React from "react";
import "./header.scss";
import Cookies from "js-cookie";
import ServerSettings from "../server_settings/server_settings"

type HeaderProps = {
  SwitchView: () => void;
  other_view_name: string;
}

type HeaderState = {
  settings_open: boolean
};

class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      settings_open: false
    };

    this.OpenSettings = this.OpenSettings.bind(this);
    this.CloseSettings = this.CloseSettings.bind(this);
  }

  componentDidMount(): void {
  }

  componentWillUnmount(): void {
  }

  LogoutButton(): void {
    Cookies.remove("auth");
    window.location.reload();
  }

  OpenSettings(): void {
    this.setState({ settings_open: true });
  }

  CloseSettings(): void {
    this.setState({ settings_open: false });
  }

  render() {
    let settings;
    if (this.state.settings_open) {
      settings = (<ServerSettings close_handler={this.CloseSettings}></ServerSettings>)
    }
    return (
      <header className="header_container">
        {settings}
        <div id="header_logo_container">
          <img id="header_logo" src="/Pi-Eye_logo.svg" alt="logo"></img>
        </div>
        <p id="header-logo-text">Pi-Eye</p>

        <nav id="nav_bar">
          <button className="nav_button" onClick={this.OpenSettings}>
            <img className="nav_button_icon" id="nav_settings_icon" src="/icons/settings-icon.png" alt="Pi Eye Settings"></img>
          </button>
          <button className="nav_button" onClick={this.LogoutButton}>
            <img className="nav_button_icon" id="logout-icon" src="/icons/logout-icon.png" alt="Logout"></img>
          </button>
        </nav>
      </header>
    )
  }
}

export default Header;