const state = {
  isOn: false,
  volume: 45,
  isMuted: false,
  inputChannel: "Mic 1",
  output: "Speakers",
};

const elements = {
  hardware: document.querySelector("#hardware"),
  powerButton: document.querySelector("#powerButton"),
  powerLabel: document.querySelector("#powerLabel"),
  volumeSlider: document.querySelector("#volumeSlider"),
  volumeReadout: document.querySelector("#volumeReadout"),
  readoutUnit: document.querySelector("#readoutUnit"),
  muteButton: document.querySelector("#muteButton"),
  inputSelect: document.querySelector("#inputSelect"),
  outputRadios: document.querySelectorAll('input[name="output"]'),
  inputReadout: document.querySelector("#inputReadout"),
  outputReadout: document.querySelector("#outputReadout"),
  statePill: document.querySelector("#statePill"),
  logicMessage: document.querySelector("#logicMessage"),
  meterLeft: document.querySelector("#meterLeft"),
  meterRight: document.querySelector("#meterRight"),
  dialIndicator: document.querySelector(".dial-indicator"),
  eventLog: document.querySelector("#eventLog"),
};

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  elements.eventLog.prepend(item);

  if (elements.eventLog.children.length > 6) {
    elements.eventLog.lastElementChild.remove();
  }
}

function render() {
  elements.hardware.classList.toggle("is-on", state.isOn);
  elements.powerButton.setAttribute("aria-pressed", String(state.isOn));
  elements.powerLabel.textContent = state.isOn ? "ONLINE" : "OFFLINE";
  elements.muteButton.setAttribute("aria-pressed", String(state.isMuted));
  elements.volumeSlider.disabled = !state.isOn;
  elements.muteButton.disabled = !state.isOn;
  elements.inputSelect.disabled = !state.isOn;
  elements.outputRadios.forEach((radio) => {
    radio.disabled = !state.isOn;
  });

  elements.inputReadout.textContent = state.isOn ? `IN ${state.inputChannel.toUpperCase()}` : "IN —";
  elements.outputReadout.textContent = state.isOn ? `OUT ${state.output.toUpperCase()}` : "OUT —";

  const dialAngle = -135 + (state.volume / 100) * 270;
  elements.dialIndicator.style.transform = `rotate(${dialAngle}deg)`;

  if (!state.isOn) {
    elements.volumeReadout.textContent = "—";
    elements.readoutUnit.textContent = "OFF";
    elements.statePill.textContent = "Power off";
    elements.statePill.className = "state-pill";
    elements.logicMessage.textContent = "If power is off, no signal reaches the output.";
    elements.meterLeft.style.height = "0%";
    elements.meterRight.style.height = "0%";
  } else if (state.isMuted || state.volume === 0) {
    elements.volumeReadout.textContent = state.volume;
    elements.readoutUnit.textContent = "%";
    elements.statePill.textContent = "Muted";
    elements.statePill.className = "state-pill is-muted";
    elements.logicMessage.textContent = "If mute is on or volume is 0, the selected output is silent.";
    elements.meterLeft.style.height = "0%";
    elements.meterRight.style.height = "0%";
  } else {
    elements.volumeReadout.textContent = state.volume;
    elements.readoutUnit.textContent = "%";
    elements.statePill.textContent = "Signal live";
    elements.statePill.className = "state-pill is-live";
    elements.logicMessage.textContent = `Else, route ${state.inputChannel} to ${state.output} at ${state.volume}% volume.`;
    elements.meterLeft.style.height = `${Math.max(12, state.volume * 0.86)}%`;
    elements.meterRight.style.height = `${Math.max(9, state.volume * 0.72)}%`;
  }
}

elements.powerButton.addEventListener("click", () => {
  state.isOn = !state.isOn;
  addLog(`Power turned ${state.isOn ? "on" : "off"}.`);
  render();
});

elements.volumeSlider.addEventListener("input", (event) => {
  state.volume = Number(event.target.value);
  addLog(`Volume changed to ${state.volume}%.`);
  render();
});

elements.muteButton.addEventListener("click", () => {
  state.isMuted = !state.isMuted;
  addLog(`Mute ${state.isMuted ? "enabled" : "disabled"}.`);
  render();
});

elements.inputSelect.addEventListener("change", (event) => {
  state.inputChannel = event.target.value;
  addLog(`Input changed to ${state.inputChannel}.`);
  render();
});

elements.outputRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    if (event.target.checked) {
      state.output = event.target.value;
      addLog(`Output changed to ${state.output}.`);
      render();
    }
  });
});

render();
