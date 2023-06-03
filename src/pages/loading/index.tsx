import { Spin } from "antd";
import styles from "./index.module.scss";

const LoadingPage = () => {
  return (
    <div className={styles.loadingBox}>
      <Spin />
    </div>
  );
};

export default LoadingPage;
