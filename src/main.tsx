import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {CssBaseline, CssVarsProvider} from "@mui/joy";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CssVarsProvider>
        <CssBaseline/>
        <App/>
    </CssVarsProvider>
);
