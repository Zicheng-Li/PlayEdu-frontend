import { useEffect, useState } from "react";
import { Row, Col, Spin, Image, Progress } from "antd";
import styles from "./index.module.scss";
import { useParams } from "react-router-dom";
import { course as Course } from "../../api/index";
import mediaIcon from "../../assets/images/commen/icon-medal.png";
import { HourCompenent } from "./compenents/hour";
import { Empty } from "../../compenents";

const CoursePage = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<any>({});
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>({});
  const [learnRecord, setLearnRecord] = useState<any>({});
  const [learnHourRecord, setLearnHourRecord] = useState<any>({});

  useEffect(() => {
    getDetail();
  }, [params.courseId]);

  const getDetail = () => {
    setLoading(true);
    Course.detail(Number(params.courseId))
      .then((res: any) => {
        document.title = res.data.course.title;
        setCourse(res.data.course);
        setChapters(res.data.chapters);
        setHours(res.data.hours);
        if (res.data.learn_record) {
          setLearnRecord(res.data.learn_record);
        }
        if (res.data.learn_hour_records) {
          setLearnHourRecord(res.data.learn_hour_records);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      {loading && (
        <Row
          style={{
            width: 1200,
            margin: "0 auto",
            paddingTop: 14,
            minHeight: 301,
          }}
        >
          <div className="float-left d-j-flex mt-50">
            <Spin size="large" />
          </div>
        </Row>
      )}
      {!loading && (
        <>
          <div className={styles["top-cont"]}>
            <div className="j-b-flex">
              <div className="d-flex">
                <Image
                  width={120}
                  height={90}
                  style={{ borderRadius: 10 }}
                  preview={false}
                  src={course.thumb}
                />
                <div className={styles["info"]}>
                  <div className={styles["title"]}>{course.title}</div>
                  <div className={styles["status"]}>
                    {course.is_required === 1 && (
                      <div className={styles["type"]}>Mandatory</div>
                    )}
                    {course.is_required === 0 && (
                      <div className={styles["active-type"]}>Electives</div>
                    )}
                    {learnRecord.progress / 100 >= 100 && (
                      <div className={styles["success"]}>
                        <Image
                          width={24}
                          height={24}
                          src={mediaIcon}
                          preview={false}
                        />
                        <span className="ml-8">Congratulations on completing this course!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {JSON.stringify(learnRecord) === "{}" &&
                JSON.stringify(learnHourRecord) === "{}" && (
                  <Progress
                    type="circle"
                    strokeColor="#FF4D4F"
                    trailColor="#F6F6F6"
                    size={90}
                    strokeWidth={8}
                    percent={0}
                    format={(percent) => `${percent}%`}
                  />
                )}
              {JSON.stringify(learnRecord) === "{}" &&
                JSON.stringify(learnHourRecord) !== "{}" && (
                  <Progress
                    type="circle"
                    strokeColor="#FF4D4F"
                    trailColor="#F6F6F6"
                    size={90}
                    strokeWidth={8}
                    percent={1}
                    format={(percent) => `${percent}%`}
                  />
                )}
              {JSON.stringify(learnRecord) !== "{}" &&
                JSON.stringify(learnHourRecord) !== "{}" && (
                  <Progress
                    type="circle"
                    strokeColor="#FF4D4F"
                    trailColor="#F6F6F6"
                    size={90}
                    strokeWidth={8}
                    percent={Math.floor(learnRecord.progress / 100)}
                    format={(percent) => `${percent}%`}
                  />
                )}
            </div>
            {course.short_desc && (
              <div className={styles["desc"]}>{course.short_desc}</div>
            )}
          </div>
          <div className={styles["chapters-hours-cont"]}>
            {chapters.length === 0 && JSON.stringify(hours) === "{}" && (
              <Empty />
            )}
            {chapters.length === 0 && JSON.stringify(hours) !== "{}" && (
              <div className={styles["hours-list-box"]}>
                {hours[0].map((item: any, index: number) => (
                  <div key={item.id} className={styles["hours-it"]}>
                    {learnHourRecord[item.id] && (
                      <HourCompenent
                        id={item.id}
                        cid={item.course_id}
                        title={item.title}
                        record={learnHourRecord[item.id]}
                        duration={item.duration}
                        progress={
                          (learnHourRecord[item.id].finished_duration * 100) /
                          learnHourRecord[item.id].total_duration
                        }
                      ></HourCompenent>
                    )}
                    {!learnHourRecord[item.id] && (
                      <HourCompenent
                        id={item.id}
                        cid={item.course_id}
                        title={item.title}
                        record={null}
                        duration={item.duration}
                        progress={0}
                      ></HourCompenent>
                    )}
                  </div>
                ))}
              </div>
            )}
            {chapters.length > 0 && JSON.stringify(hours) !== "{}" && (
              <div className={styles["hours-list-box"]}>
                {chapters.map((item: any, index: number) => (
                  <div key={item.id} className={styles["chapter-it"]}>
                    <div className={styles["chapter-name"]}>{item.name}</div>
                    {hours[item.id].map((it: any, int: number) => (
                      <div key={it.id} className={styles["hours-it"]}>
                        {learnHourRecord[it.id] && (
                          <HourCompenent
                            id={it.id}
                            cid={item.course_id}
                            title={it.title}
                            record={learnHourRecord[it.id]}
                            duration={it.duration}
                            progress={
                              (learnHourRecord[it.id].finished_duration * 100) /
                              learnHourRecord[it.id].total_duration
                            }
                          ></HourCompenent>
                        )}
                        {!learnHourRecord[it.id] && (
                          <HourCompenent
                            id={it.id}
                            cid={item.course_id}
                            title={it.title}
                            record={null}
                            duration={it.duration}
                            progress={0}
                          ></HourCompenent>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePage;
