import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hour.module.scss";
import { durationFormat } from "../../../utils/index";

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  duration,
  record,
  progress,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles["item"]}
        onClick={() => {
          navigate(`/course/${cid}/hour/${id}`);
        }}
      >
        <div className={styles["left-item"]}>
          <i className="iconfont icon-icon-video"></i>
          <div className={styles["title"]}>
            {title}({durationFormat(Number(duration))})
          </div>
        </div>
        <div className="d-flex">
          {progress >= 0 && progress < 100 && (
            <>
              {progress === 0 && <div className={styles["link"]}>Start Studying</div>}
              {progress !== 0 && (
                <>
                  <div className={styles["record"]}>
                  Last time I learned
                    {durationFormat(Number(record.finished_duration || 0))}
                  </div>
                  <div className={styles["link"]}>Continue Studying</div>
                </>
              )}
            </>
          )}
          {progress >= 100 && <div className={styles["complete"]}>Studied</div>}
        </div>
      </div>
    </>
  );
};
