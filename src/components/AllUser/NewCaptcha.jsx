import React, {Component} from "react";
import {CAPTCHA_LENGTH} from "../Util/AppConstant.jsx";
import reloadSvg from "../../assets/refresh.svg";

class NewCaptcha extends Component {
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
      captcha += this.generateRandomChar(65, 89);
      captcha += this.generateRandomChar(97, 122);
      captcha += this.generateRandomChar(49, 57);
    }
    const extra = this.generateRandomChar(65, 90);
    captcha += extra;
    return captcha
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
  };

  drawCaptchaOnCanvas = (ctx, captcha) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Add background noise with random lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
      ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Add random dots for noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.5)`;
      ctx.fillRect(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height, 2, 2);
    }

    // Text style variations
    const letterSpace = 100 / captcha.length;
    for (let i = 0; i < captcha.length; i++) {
      const randomFontSize = Math.floor(Math.random() * 10) + 20; // Random font size between 20-30px
      const randomRotation = (Math.random() - 0.5) * 0.2; // Slight random rotation (-0.1 to 0.1 radians)

      // Set the font and fill style
      ctx.font = `${randomFontSize}px Roboto Mono`;
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)})`;

      // Save the current context state
      ctx.save();

      // Apply rotation and translate to position
      ctx.translate(i * letterSpace + 10, Math.floor(Math.random() * 16 + 25));
      ctx.rotate(randomRotation);

      // Draw the text
      ctx.fillText(captcha[i], 0, 0, 100);

      // Restore the context state
      ctx.restore();
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
        <div className="row">
          <div className="col-7">
            <div className="input-area pr-3">
              <input
                  className="form-control"
                  type="text"
                  id="user-input"
                  placeholder="Enter Captcha"
                  maxLength="6"
                  value={this.state.userInput}
                  onChange={this.handleUserInputChange}
              />
            </div>
          </div>
          <div className="col-5 d-flex align-items-center">
            <canvas
                ref={this.canvasRef}
                width="110"
                height="42"
                className="captcha_canvas_new"
            ></canvas>
            <button
                id="reload-button"
                className="reload_captcha_new"
                onClick={() =>
                    this.initializeCaptcha(this.canvasRef.current.getContext("2d"))
                }
            >
              <img
                  src={reloadSvg}
                  style={{
                    transform: `rotate(${this.state.rotationAngle}deg)`,
                    transition: "transform 0.5s ease-in-out",
                    width: "25px"
                  }}
                  alt="Rotate"
              />
            </button>
          </div>
          {!this.state.captchaVerified && (
              <p className="captcha_missMatch">Captcha Miss Match</p>
          )}
        </div>
    )
  }
}

export default NewCaptcha