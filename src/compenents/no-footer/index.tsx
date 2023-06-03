import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

export const NoFooter: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        height: 130,
        textAlign: "center",
        paddingBottom: 100,
      }}
    >
      <Link to="https://playedu.xyz/" target="_blank">
        <i
          style={{ fontSize: 30, color: "#cccccc" }}
          className="iconfont icon-waterprint"
        ></i>
      </Link>
    </Layout.Footer>
  );
};
