import React from "react";
import { Spin } from "antd";

const Loading = ({ size = "large", tip = "Đang tải..." }) => {
  return (
    <div className="flex justify-center items-center min-h-64">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;
