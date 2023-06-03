import { Suspense, useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation, useRoutes } from "react-router-dom";
import routes from "./routes";
import "./App.scss";
import LoadingPage from "./pages/loading";
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';

const G_ID = import.meta.env.VITE_G_ID || "";
if (G_ID) {
  ReactGA.initialize(G_ID);
}

const App = () => {
  const Views = () => useRoutes(routes);

  const location = useLocation();
  useEffect(() => {
    if (!G_ID) {
      return;
    }
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <ConfigProvider locale={enUS}>
      <Suspense fallback={<LoadingPage />}>
        <Views />
      </Suspense>
    </ConfigProvider>
  );
};

export default App;
