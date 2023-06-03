import { useEffect, useState } from "react";
import { Row, Col, Spin, Tree, Popover, Space, Image } from "antd";
import type { MenuProps } from "antd";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { CoursesModel } from "./compenents/courses-model";
import { Empty } from "../../compenents";
import myLesoon from "../../assets/images/commen/icon-mylesoon.png";
import studyTime from "../../assets/images/commen/icon-studytime.png";
import iconRoute from "../../assets/images/commen/icon-route.png";
import { studyTimeFormat } from "../../utils/index";

const IndexPage = () => {
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState(0);
  const [coursesList, setCoursesList] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryText, setCategoryText] = useState<string>("All Categories");
  const [selectKey, setSelectKey] = useState<any>([0]);
  const [learnCourseRecords, setLearnCourseRecords] = useState<any>({});
  const [learnCourseHourCount, setLearnCourseHourCount] = useState<any>({});
  const [stats, setStats] = useState<any>({});

  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );
  const currentDepId = useSelector(
    (state: any) => state.loginUser.value.currentDepId
  );

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    if (currentDepId === 0) {
      return;
    }
    getData();
  }, [tabKey, currentDepId, categoryId]);

  useEffect(() => {
    document.title = systemConfig.systemName || "Home";
  }, [systemConfig]);

  const hide = () => {
    setOpen(false);
  };

  const getData = () => {
    setLoading(true);
    user.courses(currentDepId, categoryId).then((res: any) => {
      const records = res.data.learn_course_records;
      setStats(res.data.stats);
      setLearnCourseRecords(records);
      setLearnCourseHourCount(res.data.user_course_hour_count);
      if (tabKey === 0) {
        setCoursesList(res.data.courses);
      } else if (tabKey === 1) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 1) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 2) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 0) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 3) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (records[item.id] && records[item.id].progress >= 10000) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 4) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (
            !records[item.id] ||
            (records[item.id] && records[item.id].progress < 10000)
          ) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      }
      setLoading(false);
    });
  };

  const getParams = () => {
    user.coursesCategories().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: any[] = checkArr(categories, 0);
        new_arr.unshift({
          key: 0,
          title: "All Categories",
        });
        setCategories(new_arr);
      }
    });
  };

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          title: (
            <span style={{ marginRight: 20 }}>{categories[id][i].name}</span>
          ),
          key: categories[id][i].id,
        });
      } else {
        const new_arr: any[] = checkArr(categories, categories[id][i].id);
        arr.push({
          title: (
            <span style={{ marginRight: 20 }}>{categories[id][i].name}</span>
          ),
          key: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const items = [
    {
      key: 0,
      label: `All`,
    },
    {
      key: 1,
      label: `Mandatory`,
    },
    {
      key: 2,
      label: `Electives`,
    },
    {
      key: 3,
      label: `Finished`,
    },
    {
      key: 4,
      label: `Unfinished`,
    },
  ];

  const onChange = (key: number) => {
    setTabKey(key);
  };

  const onSelect = (selectedKeys: any, info: any) => {
    setCategoryId(selectedKeys[0]);
    if (info.node.key === 0) {
      setCategoryText(info.node.title);
    } else {
      setCategoryText(info.node.title.props.children);
    }
    setSelectKey(selectedKeys);
    hide();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const dropItem = (
    <div
      style={{
        maxHeight: 600,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Tree
        selectedKeys={selectKey}
        switcherIcon={null}
        onSelect={onSelect}
        treeData={categories}
        blockNode
        defaultExpandAll={true}
      />
    </div>
  );

  return (
    <div className="main-body">
      <div className="content">
        <div className={styles["top-cont"]}>
          <div className={styles["top-item"]}>
            <div className={styles["title"]}>
              <img className={styles["icon"]} src={myLesoon} />
              <span>Course Progress</span>
            </div>
            <div className={styles["info"]}>
              <div className={styles["info-item"]}>
                <span>Mandatory: Completed Courses </span>
                <strong> {stats.required_finished_course_count || 0} </strong>
                <span>/ {stats.required_course_count || 0}</span>
              </div>
              {stats.nun_required_course_count > 0 && (
                <div className={styles["info-item"]}>
                  <span>Electives: Completed Courses </span>
                  <strong>
                    {" "}
                    {stats.nun_required_finished_course_count || 0}{" "}
                  </strong>
                  <span>/ {stats.nun_required_course_count || 0}</span>
                </div>
              )}
            </div>
          </div>
          <div className={styles["top-item"]}>
            <div className={styles["title"]}>
              <img className={styles["icon"]} src={studyTime} />
              <span>Learning duration</span>
            </div>
            <div className={styles["info"]}>
              <div className={styles["info-item"]}>
                Today:
                {studyTimeFormat(stats.today_learn_duration)[0] !== 0 && (
                  <>
                    <strong>
                      {" "}
                      {studyTimeFormat(stats.today_learn_duration)[0] || 0}{" "}
                    </strong>
                    days
                  </>
                )}
                {studyTimeFormat(stats.today_learn_duration)[1] !== 0 && (
                  <>
                    <strong>
                      {" "}
                      {studyTimeFormat(stats.today_learn_duration)[1] || 0}{" "}
                    </strong>
                    hours
                  </>
                )}
                <strong>
                  {" "}
                  {studyTimeFormat(stats.today_learn_duration)[2] || 0}{" "}
                </strong>
                minutes
                <strong>
                  {" "}
                  {studyTimeFormat(stats.today_learn_duration)[3] || 0}{" "}
                </strong>
                seconds
              </div>
              <div className={styles["info-item"]}>
              Cumulative:
                {studyTimeFormat(stats.learn_duration || 0)[0] !== 0 && (
                  <>
                    <strong>
                      {" "}
                      {studyTimeFormat(stats.learn_duration || 0)[0] || 0}{" "}
                    </strong>
                    days
                  </>
                )}
                {studyTimeFormat(stats.learn_duration || 0)[1] !== 0 && (
                  <>
                    <strong>
                      {" "}
                      {studyTimeFormat(stats.learn_duration || 0)[1] || 0}{" "}
                    </strong>
                    hours
                  </>
                )}
                <strong>
                  {" "}
                  {studyTimeFormat(stats.learn_duration || 0)[2] || 0}{" "}
                </strong>
                minutes
                <strong>
                  {" "}
                  {studyTimeFormat(stats.learn_duration || 0)[3] || 0}{" "}
                </strong>
                seconds
              </div>
            </div>
          </div>
        </div>
        <div className={styles["tabs"]}>
          {items.map((item: any) => (
            <div
              key={item.key}
              className={
                item.key === tabKey
                  ? styles["tab-active-item"]
                  : styles["tab-item"]
              }
              onClick={() => {
                onChange(item.key);
              }}
            >
              <div className={styles["tit"]}>{item.label}</div>
              {item.key === tabKey && (
                <Image
                  className={styles["banner"]}
                  width={40}
                  height={8}
                  preview={false}
                  src={iconRoute}
                  style={{ marginTop: -16 }}
                />
              )}
            </div>
          ))}
          <Popover
            content={dropItem}
            placement="bottomRight"
            open={open}
            trigger="click"
            onOpenChange={handleOpenChange}
          >
            <Space className={styles["dropButton"]}>
              {categoryText}
              <i
                className="iconfont icon-icon-xiala"
                style={{ fontSize: 16 }}
              />
            </Space>
          </Popover>
        </div>
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

        {!loading && coursesList.length === 0 && (
          <Row
            style={{
              width: 1200,
              margin: "0 auto",
              paddingTop: 14,
              minHeight: 301,
            }}
          >
            <Col span={24}>
              <Empty />
            </Col>
          </Row>
        )}
        {!loading && coursesList.length > 0 && (
          <div className={styles["courses-list"]}>
            {coursesList.map((item: any) => (
              <div key={item.id}>
                {learnCourseRecords[item.id] && (
                  <CoursesModel
                    id={item.id}
                    title={item.title}
                    thumb={item.thumb}
                    isRequired={item.is_required}
                    progress={Math.floor(
                      learnCourseRecords[item.id].progress / 100
                    )}
                  ></CoursesModel>
                )}

                {!learnCourseRecords[item.id] &&
                  learnCourseHourCount[item.id] &&
                  learnCourseHourCount[item.id] > 0 && (
                    <CoursesModel
                      id={item.id}
                      title={item.title}
                      thumb={item.thumb}
                      isRequired={item.is_required}
                      progress={1}
                    ></CoursesModel>
                  )}
                {!learnCourseRecords[item.id] &&
                  !learnCourseHourCount[item.id] && (
                    <CoursesModel
                      id={item.id}
                      title={item.title}
                      thumb={item.thumb}
                      isRequired={item.is_required}
                      progress={0}
                    ></CoursesModel>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles["extra"]}>{systemConfig.pcIndexFooterMsg}</div>
    </div>
  );
};

export default IndexPage;
