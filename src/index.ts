export default class LiveClock extends HTMLElement {
  config = {
    twelveHours: false,
    secondsVisible: false,
    blinking: false,
    separator: ":",
  };

  private currentFrameSeperatorVisible = true;
  private timeoutHandler: number | null = null;
  private lastText = "";

  static get observedAttributes() {
    return ["twelve-hours", "seconds-visible", "blinking", "separator"];
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
    if (
      this.getAttribute("twelve-hours") === "" ||
      this.getAttribute("twelve-hours") === "true"
    ) {
      this.config.twelveHours = true;
    } else {
      this.config.twelveHours = false;
      if (this.getAttribute("twelve-hours") !== "false") {
        this.setAttribute("twelve-hours", "false");
      }
    }

    if (
      this.getAttribute("seconds-visible") === "" ||
      this.getAttribute("seconds-visible") === "true"
    ) {
      this.config.secondsVisible = true;
    } else {
      this.config.secondsVisible = false;
      if (this.getAttribute("seconds-visible") !== "false") {
        this.setAttribute("seconds-visible", "false");
      }
    }

    if (
      this.getAttribute("blinking") === "" ||
      this.getAttribute("blinking") === "true"
    ) {
      this.config.blinking = true;
    } else {
      this.config.blinking = false;
      if (this.getAttribute("blinking") !== "false") {
        this.setAttribute("blinking", "false");
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
      this.config.secondsVisible,
      this.config.separator,
      this.config.blinking ? this.currentFrameSeperatorVisible : true,
      this.config.twelveHours
    );

    if (newText !== this.lastText) {
      this.innerText = newText;
      this.lastText = newText;
    }

    if (this.config.blinking || this.config.secondsVisible) {
      if (this.config.blinking) {
        this.currentFrameSeperatorVisible = !this.currentFrameSeperatorVisible;
      }
      this.timeoutHandler = setTimeout(
        this.updateContent.bind(this),
        1000 - currentTime.getMilliseconds()
      );
    } else {
      this.timeoutHandler = setTimeout(
        this.updateContent.bind(this),
        (60 - currentTime.getSeconds()) * 1000 +
          1000 -
          currentTime.getMilliseconds()
      );
    }
  }

  private generateText(
    hours: number,
    minues: number,
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

    timeString += `${separatorFormatted}${minues.toString().padStart(2, "0")}`;

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
