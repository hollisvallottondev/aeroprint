import React from "react";

const InputFile = (props) => {
  const {
    file,
    onFileSelected,
    inputComponent: InputComponent,
    buttonComponent: ButtonComponent,
    buttonMessage,
    clickHandler,
    fileInputRef,
    setFileInputRef,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <input
        style={{ display: "none" }}
        type="file"
        label="Browse"
        onChange={onFileSelected}
        ref={(fileInput) => {
          setFileInputRef(fileInput);
        }}
        inputRef={fileInputRef}
        inputref={fileInputRef}
      />
      {ButtonComponent ? (
        <ButtonComponent
          variant="contained"
          color="primary"
          onClick={clickHandler}
          style={{ margin: 5 }}
        >
          {buttonMessage}
        </ButtonComponent>
      ) : (
        <div style={{ paddingTop: 4 }}>
          <button onClick={clickHandler}>
            {buttonMessage}
          </button>
        </div>
      )}
      {InputComponent ? (
        <InputComponent
          type="text"
          label="Browse"
          value={file ? file.name : ""}
          style={{ margin: 5 }}
        />
      ) : (
        <input
          value={file ? file.name : ""}
          label="Browse"
          style={{ margin: 5 }}
          disabled
        />
      )}
    </div>
  );
};

export default InputFile;
