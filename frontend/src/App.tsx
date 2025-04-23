import { Router } from "./routes/Router";
import ReduxProvider from "./redux/Provider";

import "@/css/global.css";
import "@/css/app.css";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <ReduxProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router />
    </ReduxProvider>
  );
}
