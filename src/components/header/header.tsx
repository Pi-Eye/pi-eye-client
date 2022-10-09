import React from "react";
import "./header.scss";
import Cookies from "js-cookie";

type HeaderProps = {}

type HeaderState = {
  sockets_wanted: Array<string>
};

class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      sockets_wanted: ["ws://10.194.158.90:8080"]
    };
  }

  componentDidMount(): void {
  }

  componentWillUnmount(): void {
  }

  LogoutButton(): void {
    Cookies.remove("auth");
    console.log("logout");
    window.location.reload();
  }

  SettingsButton(): void {
    console.log("settings");
  }

  render() {
    return (
      <header className="header_container">
        <div id="header_logo_container">
          <img id="header_logo" src="/Pi-Eye_logo.svg" alt="logo"></img>
        </div>
        <p id="header-logo-text">Pi-Eye</p>

        <nav id="nav_bar">
          <button className="nav_button" onClick={this.SettingsButton}>
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