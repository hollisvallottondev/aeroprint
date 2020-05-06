import React from "react";
import Header from "./components/Header";
// import Upload from "./components/Upload";
import Preview from "./components/Preview";
import { Input } from "@material-ui/core";
import { Button } from "@material-ui/core";

import {
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import { blue, green } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green
  }
});

const messages = {
  dropHere: "Drop it motherfucker",
  drop: "Draaaaaaaapp!!",
  fileDetected: "This da file!˜",
  done: "Done bitch!"
};

const fileTypesSupported = ["image/jpeg", "image/png"];

const onLoadCompleted = () => window.scrollBy(0, 100000);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        {/* <Upload
          uploadUrl={"http://localhost:5000/upload"}
          inputComponent={Input}
          buttonComponent={Button}
          messages={messages}
          fileTypesSupported={fileTypesSupported}
          onLoadCompleted={onLoadCompleted}
          buttonMessage={'Pick a file'}
          showInput={true}
        /> */}
        <Preview />
      </div>
    </ThemeProvider>
  );
};

export default App;
