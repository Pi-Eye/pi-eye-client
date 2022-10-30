import React from 'react';
import './server_settings.scss';
import Cookies from "js-cookie";

type ServerSettingsProps = {
  close_handler: () => void
}

type ServerSettingsState = {
  loading: boolean,
  has_settings: boolean,
  address: string,
  password: string,
  user: string,
  pwd: string,
  privilage: number,

  accounts: Array<{
    user: string,
    privilage: number
  }>
}

function GetPrivilageName(num: number) {
  if (num >= 2) {
    return "View Streams, Edit Server and Camera Settings"
  }
  if (num >= 1) {
    return "View Streams, Edit Camera Settings"
  }
  if (num >= 0) {
    return "View Streams"
  }
  return "Unknown Permissions"
}
class ServerSettings extends React.Component<ServerSettingsProps, ServerSettingsState> {
  constructor(props: ServerSettingsProps) {
    super(props);

    this.state = {
      loading: false,
      has_settings: false,
      address: "",
      password: "",
      user: "",
      pwd: "",
      privilage: 0,

      accounts: []
    }

    this.handleAddCamera = this.handleAddCamera.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);

    this.handleAddress = this.handleAddress.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handlePwd = this.handlePwd.bind(this);
    this.handlePermissions = this.handlePermissions.bind(this);
  }

  componentDidMount(): void {
    fetch("/server_settings", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({
            has_settings: true,
            accounts: data.accounts
          })
        } else {
          console.log("Error Fetching Server Settings");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleAddress(event: any) { this.setState({ address: event.target.value }); }
  handlePassword(event: any) { this.setState({ password: event.target.value }); }
  handleUser(event: any) { this.setState({ user: event.target.value }); }
  handlePwd(event: any) { this.setState({ pwd: event.target.value }); }
  handlePermissions(event: any) { this.setState({ privilage: event.target.value }); }

  handleAddCamera(event: any) {
    event.preventDefault();

    this.setState({ loading: true })

    fetch("/add_camera", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        address: this.state.address,
        password: this.state.password
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => {
            window.location.reload();
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

  handleAddUser(event: any) {
    event.preventDefault();

    this.setState({ loading: true })

    fetch("/add_user", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        user: this.state.user,
        pwd: this.state.pwd,
        privilage: parseInt(this.state.privilage as any)
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

  handleDeleteUser(event: any) {
    this.setState({ loading: true })

    fetch("/remove_user", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_cookie: Cookies.get("auth"),
        user: event.target.id
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.reload();
        } else {
          this.setState({ loading: false })
          console.log("Error Deleting User");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false })
        console.log("Error Deleting User");
      });
  }

  render(): React.ReactNode {
    let loading;
    if (this.state.loading) {
      loading = <div id="settings_loading"><p>Saving Settings...</p></div>
    }
    let settings = <div><h3>Failed to Fetch Settings.</h3><p>Do you have permission to edit server settings?</p></div>;
    if (this.state.has_settings) {
      settings = <div>
        <form onSubmit={this.handleAddCamera}>
          <hr></hr>
          <h3>Add Camera</h3>
          <label>Address:<br></br>
            <input onChange={this.handleAddress} type="text" className="text_input" placeholder="ex: ws://127.0.0.1:8080"></input>
          </label>
          <br></br>
          <label>Password:<br></br>
            <input onChange={this.handlePassword} type="password" className="text_input"></input>
          </label>
          <br></br>
          <input type="submit" value="Add Camera" id="server_settings_submit_button"></input>
          <br></br>
        </form>
        <br></br>
        <br></br>
        <hr></hr>
        <h3>Manage Accounts</h3>
        {this.state.accounts.map((account, key) => {
          return <div key={key}>
            <div className="user_container">
              <div className="user_display">
                <p><b>User:</b> {account.user}</p>
                <p><b>Permissions:</b><br></br>{GetPrivilageName(account.privilage)}</p>
              </div>
              <button id={account.user} className="delete_user_button" onClick={this.handleDeleteUser}>Delete</button>
            </div>
            <hr></hr>
          </div>
        })
        }
        <h3>Add Account</h3>
        <form onSubmit={this.handleAddUser}>
          <label>Username:<br></br>
            <input onChange={this.handleUser} type="text" className="text_input"></input>
          </label>
          <br></br>
          <label>Password:<br></br>
            <input onChange={this.handlePwd} type="password" className="text_input"></input>
          </label>
          <br></br>
          <label>Account Permissions: <select onChange={this.handlePermissions} className="select_input">
            <option value="0">View Streams</option>
            <option value="1">View Streams, Edit Camera Settings</option>
            <option value="2">View Streams, Edit Server and Camera Settings</option>
          </select></label>
          <br></br>
          <input type="submit" value="Add Account" id="server_settings_submit_button"></input>
        </form>
        <br></br>
        <br></br>
      </div>
    }
    return (
      <div className="server_settings_focus">
        {loading}
        <div className="server_settings_container">
          <button id="server_settings_close" onClick={this.props.close_handler}>Close</button>
          <h2 id="server_settings_header">Server Settings</h2>
          {settings}
        </div>
      </div>
    );
  }
}

export default ServerSettings;
