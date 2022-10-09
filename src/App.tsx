import React from 'react';
import './App.scss';
import CameraContainer from './components/camera_container/camera_container';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Login from "./components/login/login";


type AppState = {
  logged_in: boolean
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      logged_in: false
    }
    this.loginSuccess = this.loginSuccess.bind(this);
  }

  loginSuccess() {
    this.setState({ logged_in: true });
  }

  render(): React.ReactNode {
    let app = (
      <div className="App">
        <Header></Header>
        <Login login_success={this.loginSuccess}></Login>
        <Footer></Footer>
      </div>
    );

    if (this.state.logged_in) {
      app = (<div className="App">
        <Header></Header>
        <CameraContainer></CameraContainer>
        <Footer></Footer>
      </div>);
    }
    return app;
  }
}

export default App;
