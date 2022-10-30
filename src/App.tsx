import React from 'react';
import './App.scss';
import CameraContainer from './components/camera_container/camera_container';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Login from "./components/login/login";

const view_names = ["Camera Streams", "Recordings"];

type AppState = {
  logged_in: boolean,
  view_index: number
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      logged_in: false,
      view_index: 0
    }
    this.loginSuccess = this.loginSuccess.bind(this);
    this.SwitchView = this.SwitchView.bind(this);
  }

  loginSuccess() {
    this.setState({ logged_in: true });
  }

  SwitchView() {
    if (this.state.view_index === 0) {
      this.setState({ view_index: 1 });
    }
    else {
      this.setState({ view_index: 0 });
    }
  }

  render(): React.ReactNode {
    let app = (
      <div className="App">
        <Header other_view_name={view_names[this.state.view_index]} SwitchView={this.SwitchView}></Header>
        <Login login_success={this.loginSuccess}></Login>
        <Footer></Footer>
      </div>
    );

    if (this.state.logged_in) {
      app = (<div className="App">
        <Header other_view_name={view_names[this.state.view_index]} SwitchView={this.SwitchView}></Header>
        <CameraContainer></CameraContainer>
        <Footer></Footer>
      </div>);
    }
    return app;
  }
}

export default App;
