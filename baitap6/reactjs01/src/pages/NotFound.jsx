import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm kiếm không tồn tại."
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
