import React, { useState, useReducer } from "react";
import InputFile from "./InputFile";

const DRAG_ENTER = "DRAG_ENTER";
const DRAG_LEAVE = "DRAG_LEAVE";
const DRAG_OVER = "DRAG_OVER";
const DRAGABLE = "DRAGABLE";
const UNDRAGABLE = "UNDRAGABLE";
const REQUEST_STARTED = "REQUEST_STARTED";
const REQUEST_ENDED = "REQUEST_ENDED";
const DISPLAY_PERCENTAGE = "DISPLAY_PERCENTAGE";
const DISPLAY_PREVIEW = "DISPLAY_PREVIEW";
const LOAD_FINISHED = "LOAD_FINISHED";
const LOADING = "LOADING";
const ABORT = "ABORT";

const initialState = {
  enableDragDrop: true,
  status: "Drop Here",
};

const reducer = (state, action) => {
  return {
    [DRAGABLE]: {
      ...state,
      enableDragDrop: true,
    },
    [UNDRAGABLE]: {
      ...state,
      enableDragDrop: false,
    },
    [ABORT]: {
      ...state,
      preview: null,
      status: action.payload,
      percentage: 0,
      enableDragDrop: true,
    },
    [DRAG_ENTER]: {
      ...state,
      over: true,
      status: action.payload,
    },
    [DRAG_OVER]: {
      ...state,
      status: action.payload,
    },
    [DRAG_LEAVE]: {
      ...state,
      status: action.payload,
    },
    [REQUEST_STARTED]: {
      ...state,
      xhr: action.payload.xhr,
      file: action.payload.file,
      enableDragDrop: false,
    },
    [REQUEST_ENDED]: {
      ...state,
      file: null,
      preview: null,
      percentage: 0,
      enableDragDrop: true,
    },
    [LOADING]: {
      ...state,
      percentage: action.payload,
    },
    [LOAD_FINISHED]: {
      ...state,
      status: action.payload,
    },
    [DISPLAY_PERCENTAGE]: {
      ...state,
      status: action.payload,
    },
    [DISPLAY_PREVIEW]: {
      ...state,
      preview: action.payload,
    },
  }[action.type];
};

const Upload = (props) => {
  const {
    uploadUrl,
    inputComponent,
    buttonComponent,
    fileTypesSupported,
    messages = {},
    classes = {},
    buttonMessage,
    onLoadCompleted,
    showInput
  } = props;
  const {
    container,
    imagePreview,
    show,
    dropArea,
    uploadControls,
    imageProgress,
    imageProgressImage,
    imageProgressUploaded,
    statusContainer,
    browse,
    abort,
  } = classes;

  const { dropHere, drop, fileDetected, done } = messages;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, preview, percentage, enableDragDrop, stateXhr, file, over, uploading } = state;

  const doNothing = (event) => event.preventDefault();

  const onDragEnter = (event) => {
    if (enableDragDrop) {
      dispatch({ type: DRAG_ENTER, payload: fileDetected || "File Detected" });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragLeave = (event) => {
    if (enableDragDrop) {
      dispatch({ type: DRAG_LEAVE, payload: dropHere || "Drop Here" });
    }
    event.preventDefault();
  };

  const onDragOver = (event) => {
    if (enableDragDrop) {
      dispatch({ type: DRAG_OVER, payload: drop || "Drop" });
    }
    event.preventDefault();
  };

  const onAbortClick = () => {
    stateXhr.abort();
    dispatch({ type: ABORT, payload: dropHere || "Drop Here" });
  };

  const onDrop = (event) => {
    const [file] = event.dataTransfer.files;
    if (file) upLoad(file);
    event.preventDefault();
  };

  const onFileSelected = (event) => {
    const [file] = event.target.files;
    if (file) upLoad(file);
    event.preventDefault();
  };

  const clickHandler = (event) => {
    fileInputRef.click();
  };

  let [fileInputRef, setFileInputRef] = useState(null);



  const upLoad = (file) => {
    const { type } = file;
    const supportedFilesTypes = [...fileTypesSupported];
    if (supportedFilesTypes.indexOf(type) > -1 && enableDragDrop) {
      // Begin Reading File
      const reader = new FileReader();
      reader.onload = (e) =>
        dispatch({ type: DISPLAY_PREVIEW, payload: e.target.result });
      reader.readAsDataURL(file);
      // Create Form Data
      const payload = new FormData();
      payload.append("file", file);
      // XHR - New XHR Request
      const xhr = new XMLHttpRequest();
      // XHR - Upload Progress
      xhr.upload.onprogress = (e) => {
        const loaded = e.position || e.loaded;
        const total = e.totalSize || e.total;
        const perc = Math.floor((loaded / total) * 1000) / 10;
        if (perc >= 100) {
          dispatch({ type: LOAD_FINISHED, payload: done || "Done" });
          // Delayed reset
          setTimeout(() => {
            dispatch({ type: REQUEST_ENDED, payload: dropHere || "Drop Here" });
            if (onLoadCompleted) {
              onLoadCompleted();
            }
          }, 750); // To match the transition 500 / 250
        } else {
          dispatch({ type: DISPLAY_PERCENTAGE, payload: `${perc}%` });
        }
        dispatch({ type: LOADING, payload: perc });
      };
      // XHR - Make Request
      xhr.open("POST", uploadUrl);
      xhr.send(payload);
      dispatch({ type: REQUEST_STARTED, payload: { xhr, file } });
    } else {
      alert("File format not supported");
    }
  };

  return (
    <div
      className={classes.container || "Section"}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={doNothing}
      onDrop={onDragLeave}
    >
      <div
        className={
          classes.imagePreview || "ImagePreview" + ` ${preview ? "Show" : ""}`
        }
      >
        <div style={{ backgroundImage: `url(${preview})` }}></div>
      </div>
      <div
        className={
          classes.dropArea ||
          "DropArea" +
            ` ${status === "Drop" ? over || "Over" : ""} ${
              status.indexOf("%") > -1 || status === "Done"
                ? classes.uploading || "Uploading"
                : ""
            }`
        }
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragEnter}
      >
        <div
          className={
            imageProgress ||
            "ImageProgress" + ` ${preview ? show || "Show" : ""}`
          }
        >
          <div
            className={imageProgressImage || "ImageProgressImage"}
            style={{ backgroundImage: `url(${preview})` }}
          ></div>
          <div
            className={imageProgressUploaded || "ImageProgressUploaded"}
            style={{
              backgroundImage: `url(${preview})`,
              clipPath: `inset(${100 - Number(percentage)}% 0 0 0)`,
            }}
          ></div>
        </div>
        <div className={uploadControls || "UploadControls"}>
          <div
            className={
              statusContainer ||
              "Status" +
                ` ${
                  status.indexOf("%") > -1 || status === "Done"
                    ? uploading || "Uploading"
                    : ""
                }`
            }
          >
            {status}
          </div>
          {showInput && (
            <div className={browse || "Browse"}>
              <p>Or</p>
              <InputFile
                file={file}
                onFileSelected={onFileSelected}
                inputComponent={inputComponent}
                buttonComponent={buttonComponent}
                buttonMessage={buttonMessage}
                clickHandler={clickHandler}
                fileInputRef={fileInputRef}
                setFileInputRef={setFileInputRef}
              />
            </div>
          )}
        </div>
        {status.indexOf("%") > -1 && (
          <div className={abort || "Abort"} onClick={onAbortClick}>
            <span>&times;</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
