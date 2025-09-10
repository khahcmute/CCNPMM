import React from "react";
import { Result, Button } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Result
            status="500"
            title="Oops! Có lỗi xảy ra"
            subTitle="Xin lỗi, ứng dụng gặp sự cố. Vui lòng tải lại trang."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Tải lại trang
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
