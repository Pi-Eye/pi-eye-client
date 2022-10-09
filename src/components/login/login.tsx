import React from 'react';
import './login.scss';
import Cookies from "js-cookie";

type LoginProps = {
  login_success: () => void;
}

type LoginState = {
  user: string
  pwd: string
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      user: "",
      pwd: ""
    }

    this.handleUser = this.handleUser.bind(this);
    this.handlePwd = this.handlePwd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(): void {
    const auth_cookie = Cookies.get("auth");
    if (auth_cookie) {
      fetch("http://localhost:8000/cookie", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_cookie: Cookies.get("auth")
        })
      }).then((res) => res.json())
        .then((data) => {
          if (data.success) {
            this.props.login_success();
          } else {
            console.log("Could not authenticate with cookie. Session expired?");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleUser(event: any) {
    this.setState({ user: event.target.value })
  }

  handlePwd(event: any) {
    this.setState({ pwd: event.target.value })
  }

  handleSubmit(event: any) {
    event.preventDefault();

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: this.state.user,
        pwd: this.state.pwd
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Cookies.set("auth", data.cookie);
          this.props.login_success();
        }
        else {
          alert("Invalid Login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render(): React.ReactNode {
    return (
      <div className="login_focus">
        <div className="login_container">
          <h2 id="login_header">Login</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Username<br></br>
              <input type="text" onChange={this.handleUser}></input>
            </label>
            <br></br><br></br>
            <label>
              Password<br></br>
              <input type="password" onChange={this.handlePwd}></input>
            </label>
            <br></br>
            <br></br>
            <input id="login_submit_button" type="submit" value="Login" ></input>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
