import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, DatePicker, Popconfirm, notification, Spin, InputNumber, Space, Breadcrumb, Row, Col
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, RocketOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import tourApi from "../../../apis/tourApi";
import moment from 'moment';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TourSchedulesManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [id, setId] = useState();
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // --- Fetch Data ---
    const handleScheduleList = async (page = pagination.current, limit = pagination.pageSize) => {
        setLoading(true);
        try {
            const response = await tourApi.getAllTourSchedules({ page, limit });
            if (response.success) {
                setSchedules(response.data.schedules);
                setPagination({
                    current: response.data.pagination.page,
                    pageSize: response.data.pagination.limit,
                    total: response.data.pagination.total
                });
            } else {
                 notification.error({ message: 'Lỗi', description: response.message || 'Lấy danh sách lịch trình thất bại' });
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
             notification.error({ message: 'Lỗi', description: 'Lấy danh sách lịch trình thất bại' });
        } finally {
            setLoading(false);
        }
    };

     const fetchToursForSelect = async () => {
        try {
            const response = await tourApi.getAllTours(1, 10000);
            if (response.success) {
                setTours(response.data.tours);
            }
        } catch (error) {
            console.error("Error fetching tours for select:", error);
        }
    };


    useEffect(() => {
        handleScheduleList();
        fetchToursForSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers ---
    const handleTableChange = (pagination) => {
        handleScheduleList(pagination.current, pagination.pageSize);
    };

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOk = async (values) => {
        setLoading(true);
        try {
            const [startDate, endDate] = values.dateRange;
            const dataToSend = {
                ...values,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            };
            delete dataToSend.dateRange;

            await tourApi.createTourSchedule(dataToSend).then(response => {
                if (!response.success) {
                    setLoading(false);
                    return notification.error({ message: 'Lỗi', description: response.message || 'Tạo lịch trình thất bại' });
                }
                notification.success({ message: 'Thành công', description: 'Tạo lịch trình thành công' });
                setOpenModalCreate(false);
                form.resetFields();
                handleScheduleList(1);
            });
        } catch (error) {
             console.error("Error creating schedule:", error);
             notification.error({ message: 'Lỗi', description: 'Tạo lịch trình thất bại' });
             setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        if (!id) return;
        setLoading(true);
         try {
            const dataToSend = { ...values };
            if (values.dateRange) {
                const [startDate, endDate] = values.dateRange;
                dataToSend.start_date = startDate.format('YYYY-MM-DD');
                dataToSend.end_date = endDate.format('YYYY-MM-DD');
                delete dataToSend.dateRange;
            }
            delete dataToSend.tour_id;

            await tourApi.updateTourSchedule(id, dataToSend).then(response => {
                 if (!response.success) {
                     return notification.error({ message: 'Lỗi', description: response.message || 'Cập nhật lịch trình thất bại' });
                 }
                notification.success({ message: 'Thành công', description: 'Cập nhật lịch trình thành công' });
                setOpenModalUpdate(false);
                form2.resetFields();
                setId(undefined);
                handleScheduleList(); 
            });
        } catch (error) {
             console.error("Error updating schedule:", error);
             notification.error({ message: 'Lỗi', description: 'Cập nhật lịch trình thất bại' });
        } finally {
             setLoading(false);
        }
    };

    const handleDelete = async (scheduleId) => {
        setLoading(true);
         try {
            await tourApi.deleteTourSchedule(scheduleId).then(response => {
                 if (!response.success) {
                     setLoading(false);
                     return notification.error({ message: 'Lỗi', description: response.message || 'Xóa lịch trình thất bại' });
                 }
                notification.success({ message: 'Thành công', description: 'Xóa lịch trình thành công' });
                if(schedules.length === 1 && pagination.current > 1) {
                    handleScheduleList(pagination.current - 1);
                } else {
                    handleScheduleList();
                }
            });
        } catch (error) {
             console.error("Error deleting schedule:", error);
             notification.error({ message: 'Lỗi', description: 'Xóa lịch trình thất bại' });
             setLoading(false);
        }
    };

    const handleEdit = (scheduleId) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                setLoading(true);
                const response = await tourApi.getTourScheduleById(scheduleId);
                if (response.success) {
                    setId(scheduleId);
                    form2.setFieldsValue({
                        ...response.data,
                        tour_id: response.data.tour_id,
                        dateRange: [moment(response.data.start_date), moment(response.data.end_date)],
                    });
                } else {
                    notification.error({ message: 'Lỗi', description: response.message || 'Lấy thông tin lịch trình thất bại' });
                    setOpenModalUpdate(false);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin lịch trình:', error);
                notification.error({ message: 'Lỗi', description: 'Lấy thông tin lịch trình thất bại' });
                setOpenModalUpdate(false);
            } finally {
                setLoading(false);
            }
        })();
    };

    const handleCancel = (type) => {
        if (type === 'create') {
            setOpenModalCreate(false);
            form.resetFields();
        } else {
            setOpenModalUpdate(false);
            form2.resetFields();
             setId(undefined);
        }
    };

    useEffect(() => {
        console.log("openModalUpdate state changed to:", openModalUpdate);
    }, [openModalUpdate]);

    // --- Columns ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
        { title: 'Tên Tour', dataIndex: 'tour_name', key: 'tour_name', width: 250 },
        {
            title: 'Ngày Bắt Đầu', dataIndex: 'start_date', key: 'start_date', width: 130, align: 'center',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'Ngày Kết Thúc', dataIndex: 'end_date', key: 'end_date', width: 130, align: 'center',
             render: (text) => moment(text).format('DD/MM/YYYY')
        },
        { title: 'Số chỗ', dataIndex: 'max_participants', key: 'max_participants', width: 80, align: 'center' },
        { title: 'Đã đặt', dataIndex: 'current_participants', key: 'current_participants', width: 80, align: 'center' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space>
                    {/* <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{ borderRadius: 15, height: 30 }}
                        onClick={() => handleEdit(record.id)}
                    > Sửa
                    </Button> */}
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa lịch trình này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Không"
                        disabled={record.current_participants > 0}
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            style={{ borderRadius: 15, height: 30 }}
                            disabled={record.current_participants > 0}
                        > Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // --- Form Items ---
    const scheduleForm = (
        <Form.Provider>
            <Form.Item
                name="tour_id"
                label="Chọn Tour"
                rules={[{ required: true, message: 'Vui lòng chọn tour!' }]}
                style={{ marginBottom: 10 }}
            >
                <Select 
                    showSearch 
                    placeholder="Tìm và chọn tour" 
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    disabled={!!id} 
                >
                    {tours.map(tour => (
                        <Option key={tour.id} value={tour.id}>{tour.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="dateRange"
                label="Ngày bắt đầu - Ngày kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn khoảng ngày!' }]}
                style={{ marginBottom: 10 }}
            >
                <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="max_participants"
                label="Số chỗ tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số chỗ!' }]}
                style={{ marginBottom: 10 }}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            {id && (
                 <Form.Item name="status" label="Trạng thái" style={{ marginBottom: 10 }}>
                     <Select>
                         <Option value="available">Available</Option>
                         <Option value="fully_booked">Fully Booked</Option>
                         <Option value="cancelled">Cancelled</Option>
                     </Select>
                 </Form.Item>
            )}
        </Form.Provider>
    );


    // --- Render ---
    return (
        <Spin spinning={loading}>
             <div className='container' style={{ padding: 20 }}>
                <div style={{ marginBottom: 16 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                             <RocketOutlined />
                            <span>Quản lý Lịch trình Tours</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                 <div style={{ marginBottom: 16 }}>
                    <PageHeader
                        title="Danh sách Lịch trình"
                        style={{ fontSize: 14, padding: '0 0 16px 0' }}
                        extra={[
                            <Button key="1" type="primary" icon={<PlusOutlined />} onClick={showModal}>
                                Thêm Lịch trình
                            </Button>,
                        ]}
                    >
                    </PageHeader>
                </div>
                <Table
                    columns={columns}
                    dataSource={schedules}
                    rowKey="id"
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />

                <Modal
                    title="Thêm Lịch trình mới"
                    visible={openModalCreate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                handleOk(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel('create')}
                    okText="Tạo"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="scheduleCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                         {scheduleForm}
                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật Lịch trình"
                    visible={openModalUpdate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                handleUpdate(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel('update')}
                    okText="Cập nhật"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="scheduleUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        {scheduleForm}
                    </Form>
                </Modal>

            </div>
        </Spin>
    );
};

export default TourSchedulesManagement; 