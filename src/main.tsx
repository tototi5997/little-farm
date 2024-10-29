import ReactDOM from "react-dom/client";
import { RouterComponent } from "./router.tsx";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./states";
import "./index.css";
import "virtual:svg-icons-register";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterComponent>
      <App />
    </RouterComponent>
  </Provider>
);
