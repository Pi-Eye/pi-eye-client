import React from "react";
import "./footer.scss";

class Footer extends React.Component {
  componentDidMount(): void {
  }

  componentWillUnmount(): void {
  }

  render() {
    return (
      <footer className="footer_container">
        <div className="footer_right">
          <h3>About</h3>
          <a href="mailto:bwu1324@gmail.com">Contact</a> <br></br>
          <a target="_blank" rel="noreferrer" href="https://github.com/Pi-Eye">Github</a>
          <p>© 2022 Bennett Wu</p>
        </div>
        <div className="footer_left">
          <h3>Icons Credits</h3>
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/364/settings">Settings</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
          <br></br>
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/5386/no-camera">No Camera</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
          <br></br>
          <a target="_blank" rel="noreferrer" href="https://icons8.com/icon/2445/logout">Logout</a> icon by < a target="_blank" rel="noreferrer" href="https://icons8.com" > Icons8</a>
        </div>
      </footer>
    )
  }
}

export default Footer;