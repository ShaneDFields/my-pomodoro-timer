import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import "./pomodoro.css";

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [aria, setAria] = useState(0);
  const [breakLeft, setBreakLeft] = useState(0);

  useInterval(
    () => {
      setBreakLeft(breakLeft + 1);
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        setSession(nextSession(focusDuration, breakDuration));
      }
      setSession(nextTick);
      const left = session.timeRemaining;
      if (session.label === "Focusing") {
        setAria((100 * (focusDuration * 60 - left)) / (focusDuration * 60));
      } else {
        setAria((100 * (breakDuration * 60 - left)) / (breakDuration * 60));
      }
    },
    isTimerRunning ? 1000 : null
  );

  useInterval(() => {
    if (session && session.timeRemaining) {
      return setElapsed(elapsed + 1);
    }
  }, 1000);

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  return (
    <div className="pomodoro">
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
        crossorigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.min.css"
        integrity="sha512-UyNhw5RNpQaCai2EdC+Js0QL4RlVmiq41DkmCJsRV3ZxipG2L0HhTqIf/H9Hp8ez2EnFlkBnjRGJU2stW3Lj+w=="
        crossorigin="anonymous"
      />

      <div className="row timers">
        <div className="col">
          <div className="input-group input-group-lg mb-2 ">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {("0" + focusDuration).substr(-2)}:00
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={() => {
                  if (focusDuration > 5) setFocusDuration(focusDuration - 5);
                }}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={() => {
                  if (focusDuration < 60) setFocusDuration(focusDuration + 5);
                }}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="right-set">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {("0" + breakDuration).substr(-2)}:00
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={() => {
                    if (breakDuration > 1) {
                      setBreakDuration(breakDuration - 1);
                    }
                  }}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={() => {
                    if (breakDuration < 15) {
                      setBreakDuration(breakDuration + 1);
                    }
                  }}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row controls">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2 timer-controls"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              disabled={!isTimerRunning}
              onClick={() => {
                setSession(null);
                setIsTimerRunning(false);
                setElapsed(0);
              }}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div className="message">
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        {session && (
          <div className="row mb-2">
            <div className="col">
              {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
              <h2 className="session-text" data-testid="session-title">
                {session && session.label} for{" "}
                {(
                  "0" +
                  (session.label.toLowerCase().indexOf("ocus") > 0
                    ? focusDuration
                    : breakDuration)
                ).substr(-2)}
                :00 minutes
              </h2>
              {/* TODO: Update message below correctly format the time remaining in the current session */}
              <p
                className="lead session-text-sub"
                data-testid="session-sub-title"
              >
                {session && fmtMSS(session.timeRemaining)} remaining
              </p>
            </div>
          </div>
        )}
        {session && (
          <div className="row mb-2">
            <div className="col">
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={aria} // TODO: Increase aria-valuenow as elapsed time increases
                  style={{ width: `${aria}%` }} // TODO: Increase width % as elapsed time increases
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pomodoro;
