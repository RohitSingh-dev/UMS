import React, { Component } from "react";
import reloadSvg from "../../assets/refresh.svg";

import {CAPTCHA_LENGTH} from "../../Util/AppConstant.jsx";

class Captcha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captchaText: "",
      userInput: "",
      captchaVerified: true,
      rotationAngle: 0,
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    this.initializeCaptcha(ctx);
  }

  generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

  generateCaptchaText = () => {
    let captcha = "";
    for (let i = 0; i < CAPTCHA_LENGTH; i++) {
      captcha += this.generateRandomChar(65, 90);
      captcha += this.generateRandomChar(97, 122);
      captcha += this.generateRandomChar(48, 57);
    }
    return captcha
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
    const letterSpace = 150 / captcha.length;
    for (let i = 0; i < captcha.length; i++) {
      const xInitialSpace = 25;
      ctx.font = "20px Roboto Mono";
      ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
      ctx.fillText(
        captcha[i],
        xInitialSpace + i * letterSpace,
        Math.floor(Math.random() * 16 + 25),
        100
      );
    }
  };

  initializeCaptcha = (ctx) => {
    this.setState((prevState) => ({
      rotationAngle: prevState.rotationAngle - 180,
    }));
    this.setState({ userInput: "" });
    const newCaptcha = this.generateCaptchaText();
    this.setState({ captchaText: newCaptcha }, () => {
      this.drawCaptchaOnCanvas(ctx, newCaptcha);
    });
  };

  handleUserInputChange = (e) => {
    if (!this.state.captchaVerified) {
      this.setState({ captchaVerified: true });
    }
    this.setState({ userInput: e.target.value });
  };

  handleCaptchaSubmit = () => {
    if (this.state.userInput === this.state.captchaText) {
      return true;
    } else {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");
      this.initializeCaptcha(ctx);
      this.setState({ captchaVerified: false });
      return false;
    }
  };

  render() {
    return (
      <>
        <div className="wrapper_captcha">
          <canvas
            ref={this.canvasRef}
            width="250"
            height="50"
            className="canvas_captcha"
          ></canvas>
          <button
            id="reload-button"
            className="reload_captcha"
            onClick={() =>
              this.initializeCaptcha(this.canvasRef.current.getContext("2d"))
            }
          >
            <img
              src={reloadSvg}
              style={{
                transform: `rotate(${this.state.rotationAngle}deg)`,
                transition: "transform 0.5s ease-in-out",
              }}
            />
          </button>
        </div>
        <div className="form-group">
          <div className="input-area">
            <input
              className="input_captcha"
              type="text"
              id="user-input"
              placeholder="Enter the text in the image"
              maxLength="6"
              value={this.state.userInput}
              onChange={this.handleUserInputChange}
            />
          </div>
        </div>
        {!this.state.captchaVerified && (
          <p className="captcha_missMatch">Captcha Miss Match</p>
        )}
      </>
    );
  }
}

export default Captcha;
