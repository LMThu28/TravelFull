import {
    CompassOutlined,
    HomeOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Input,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Tag,
    Modal,
    Descriptions,
    Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import tourApi from "../../../apis/tourApi";
import "./tourBookings.css";

const { Option } = Select;

const TourBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const handleBookingList = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await tourApi.getAllTourBookings(page, limit);

            let bookingsArray = [];

            if (response.success && response.data) {
                if (Array.isArray(response.data.bookings)) {
                    bookingsArray = response.data.bookings;
                } else if (response.data.bookings) {
                    console.warn("API returned a single booking object instead of an array. Wrapping it.");
                    bookingsArray = [response.data.bookings];
                }
                
                if (response.data.pagination) {
                    setPagination({
                        current: response.data.pagination.page,
                        pageSize: response.data.pagination.limit,
                        total: response.data.pagination.total
                    });
                }

            } else {
                console.warn("Failed to fetch bookings or response data structure is incorrect:", response);
                notification["error"]({
                    message: 'Thông báo',
                    description: response?.message || 'Lỗi khi lấy danh sách đặt tour hoặc không có dữ liệu.',
                });
            }

            setBookings(bookingsArray);

        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy danh sách đặt tour thất bại.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            setLoading(true);
            const response = await tourApi.updateTourBookingStatus(bookingId, { status: newStatus });
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái thành công',
                });
                handleBookingList();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Cập nhật trạng thái thất bại',
                });
            }
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Cập nhật trạng thái thất bại',
            });
            setLoading(false);
        }
    };

    const showViewModal = (record) => {
        setSelectedBooking(record);
        setViewModalVisible(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'gold';
            case 'confirmed':
                return 'green';
            case 'cancelled':
                return 'red';
            case 'completed':
                return 'blue';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            case 'completed':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Tour',
            dataIndex: 'tour_name',
            key: 'tour_name',
            width: 200
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user_name',
            key: 'user_name',
            width: 150
        },
        {
            title: 'Số người lớn',
            dataIndex: 'number_of_adults',
            key: 'number_of_adults',
            width: 120
        },
        {
            title: 'Số trẻ em',
            dataIndex: 'number_of_children',
            key: 'number_of_children',
            width: 120
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            width: 150,
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`
        },
        {
            title: 'Trạng thái',
            dataIndex: 'booking_status',
            key: 'booking_status',
            width: 150,
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 140 }}
                    onChange={(value) => handleStatusChange(record.booking_id, value)}
                >
                    <Option value="pending">Chờ xác nhận</Option>
                    <Option value="confirmed">Đã xác nhận</Option>
                    <Option value="cancelled">Đã hủy</Option>
                    <Option value="completed">Hoàn thành</Option>
                </Select>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => showViewModal(record)}
                >
                    Chi tiết
                </Button>
            )
        }
    ];

    useEffect(() => {
        handleBookingList();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <CompassOutlined />
                                <span>Quản lý đặt Tours</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="24">
                                        <Input.Search
                                            placeholder="Tìm kiếm theo tên khách hàng"
                                            style={{ width: 300 }}
                                            onSearch={(value) => console.log(value)}
                                        />
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table
                            columns={columns}
                            dataSource={bookings}
                            scroll={{ x: 1500 }}
                            pagination={pagination}
                        />
                    </div>
                </div>

                <Modal
                    title="Chi tiết đặt tour"
                    visible={viewModalVisible}
                    onCancel={() => setViewModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setViewModalVisible(false)}>
                            Đóng
                        </Button>
                    ]}
                    width={800}
                >
                    {selectedBooking && (
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Tên tour" span={2}>
                                {selectedBooking.tour_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Khách hàng" span={2}>
                                {selectedBooking.user_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedBooking.user_email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {selectedBooking.user_phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số người lớn">
                                {selectedBooking.number_of_adults}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số trẻ em">
                                {selectedBooking.number_of_children}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền" span={2}>
                                {selectedBooking.total_price.toLocaleString('vi-VN')} VNĐ
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Tag color={getStatusColor(selectedBooking.status)}>
                                    {getStatusText(selectedBooking.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Yêu cầu đặc biệt" span={2}>
                                {selectedBooking.special_requests || 'Không có'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt" span={2}>
                                {new Date(selectedBooking.created_at).toLocaleString('vi-VN')}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default TourBookings; 