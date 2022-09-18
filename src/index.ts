function isEmptyOrTrue(value: string | null) {
  return value === "" || value === "true";
}

export default class LiveClock extends HTMLElement {
  private config = {
    twelvehours: false,
    secondsvisible: false,
    blinking: false,
    separator: ":",
  };

  private timeoutHandler: number | null = null;
  private lastText = "";

  static get observedAttributes() {
    return ["twelvehours", "secondsvisible", "blinking", "separator"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateConfig();
    if (this.isConnected) {
      this.updateContent();
    }
  }

  disconnectedCallback() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }
  }

  private updateConfig() {
    const boolAttributes = [
      "twelvehours",
      "secondsvisible",
      "blinking",
    ] as const;

    for (const attr of boolAttributes) {
      if (isEmptyOrTrue(this.getAttribute(attr))) {
        this.config[attr] = true;
        if (this.getAttribute(attr) !== "true") {
          this.setAttribute(attr, "true");
        }
      } else {
        this.config[attr] = false;
        if (this.getAttribute(attr) !== "false") {
          this.setAttribute(attr, "false");
        }
      }
    }

    if (this.hasAttribute("separator")) {
      this.config.separator = this.getAttribute("separator")!;
    } else {
      this.config.separator = ":";
      this.setAttribute("separator", ":");
    }
  }

  attributeChangedCallback() {
    this.updateConfig();
    this.updateContent();
  }

  private updateContent(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }

    const currentTime = new Date();

    const newText = this.generateText(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds(),
      this.config.secondsvisible,
      this.config.separator,
      this.config.blinking ? currentTime.getSeconds() % 2 === 0 : true,
      this.config.twelvehours
    );

    if (newText !== this.lastText) {
      this.innerText = newText;
      this.lastText = newText;
    }

    if (this.config.blinking || this.config.secondsvisible) {
      this.timeoutHandler = setTimeout(
        this.updateContent.bind(this),
        1000 - currentTime.getMilliseconds()
      );
    } else {
      let delta =
        (60 - currentTime.getSeconds()) * 1000 - currentTime.getMilliseconds();
      // console.log(delta);
      if (delta > 1000) {
        delta -= 1000;
      }
      this.timeoutHandler = setTimeout(this.updateContent.bind(this), delta);
    }
  }

  private generateText(
    hours: number,
    minutes: number,
    seconds: number,
    secondsVisible: boolean,
    separator: string,
    separatorVisible: Boolean,
    twelveHour: Boolean
  ): string {
    let timeString = "";
    let suffix = "";
    let separatorFormatted = separatorVisible ? separator : " ";

    if (twelveHour) {
      timeString += (((hours + 11) % 12) + 1).toString().padStart(2, "0");
      if (hours >= 12) {
        suffix = " PM";
      } else {
        suffix = " AM";
      }
    } else {
      timeString += hours.toString().padStart(2, "0");
    }

    timeString += `${separatorFormatted}${minutes.toString().padStart(2, "0")}`;

    if (secondsVisible) {
      timeString += `${separatorFormatted}${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    timeString += suffix;

    return timeString;
  }
}

window.customElements.define("live-clock", LiveClock);
