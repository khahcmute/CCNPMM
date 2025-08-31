import React, { useState, useEffect } from "react";
import { User, Trash2, Calendar, Mail } from "lucide-react";
import { useAuth } from "../components/context/AuthContext";
import { callAPI, API_ENDPOINTS } from "../util/api";
import { notification, Modal } from "antd";
import Header from "../components/layout/Header";

const { confirm } = Modal;

const HomePage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await callAPI(API_ENDPOINTS.GET_USERS, "GET");

      if (response.success) {
        setUsers(response.data.users || []);
      } else {
        notification.error({
          message: "Lỗi tải dữ liệu",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể tải danh sách người dùng",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    confirm({
      title: "Xác nhận xóa người dùng",
      content: `Bạn có chắc chắn muốn xóa người dùng "${userName}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteUser(userId),
    });
  };

  const deleteUser = async (userId) => {
    setDeleteLoading(userId);

    try {
      const response = await callAPI(
        `${API_ENDPOINTS.DELETE_USER}/${userId}`,
        "DELETE"
      );

      if (response.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        notification.success({
          message: "Xóa thành công",
          description: "Người dùng đã được xóa khỏi hệ thống",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Xóa thất bại",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể xóa người dùng",
        placement: "topRight",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Chào mừng trở lại, {user?.name}! 👋
            </h1>
            <p className="text-blue-100">Quản lý hệ thống người dùng của bạn</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng người dùng
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Email của bạn
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ngày tham gia
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách người dùng
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>

          <div className="overflow-x-auto">
            {users.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {userItem._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {userItem.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(userItem.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDeleteUser(userItem._id, userItem.name)
                          }
                          disabled={deleteLoading === userItem._id}
                          className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {deleteLoading === userItem._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có người dùng nào
                </h3>
                <p className="text-gray-500">
                  Hãy đăng ký tài khoản mới để bắt đầu sử dụng hệ thống.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
