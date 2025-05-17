import {
    DeleteOutlined,
    EditOutlined,
    CompassOutlined,
    PlusOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    InputNumber,
    Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import tourApi from "../../../apis/tourApi";
import "./toursManagement.css";
import uploadFileApi from '../../../apis/uploadFileApi';

const { Option } = Select;

const ToursManagement = () => {
    const [tours, setTours] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const handleOkTour = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            }

            const response = await tourApi.createTour(updatedValues);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Tạo tour thành công',
                });
                setOpenModalCreate(false);
                handleTourList();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Tạo tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Tạo tour thất bại',
            });
        }
        setLoading(false);
    };

    const handleUpdateTour = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            } else {
                delete updatedValues.image;
            }

            const response = await tourApi.updateTour(id, updatedValues);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Cập nhật tour thành công',
                });
                setOpenModalUpdate(false);
                handleTourList();
                form2.resetFields();
                setUploadFile(null);
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Cập nhật tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Cập nhật tour thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
            form.resetFields();
        } else {
            setOpenModalUpdate(false);
            form2.resetFields();
        }
        setUploadFile(null);
    };

    const handleTourList = async (page = 1, limit = 10) => {
        try {
            const response = await tourApi.getAllTours(page, limit);
            if (response.success) {
                setTours(response.data.tours);
                setPagination({
                    current: response.data.pagination.page,
                    pageSize: response.data.pagination.limit,
                    total: response.data.pagination.total
                });
            }
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy danh sách tour thất bại',
            });
            setLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        handleTourList(pagination.current, pagination.pageSize);
    };

    const handleDeleteTour = async (id) => {
        try {
            const response = await tourApi.deleteTour(id);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Xóa tour thành công',
                });
                handleTourList();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Xóa tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Xóa tour thất bại',
            });
        }
    };

    const handleEditTour = async (id) => {
        try {
            setLoading(true);
            const response = await tourApi.getTourById(id);
            if (response.success) {
                setId(id);
                setUploadFile(null);
                form2.setFieldsValue({
                    name: response.data.name,
                    category_id: response.data.category_id,
                    description: response.data.description,
                    duration: response.data.duration,
                    start_location: response.data.start_location,
                    end_location: response.data.end_location,
                    included_services: response.data.included_services,
                    excluded_services: response.data.excluded_services,
                    notes: response.data.notes,
                    price: response.data.price,
                });
                setOpenModalUpdate(true);
            }
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy thông tin tour thất bại',
            });
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await tourApi.getAllTourCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy danh sách danh mục thất bại',
            });
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
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 120,
            render: (image) => <img src={image} alt="Tour" style={{ width: 100, height: 60, objectFit: 'cover' }} />
        },
        {
            title: 'Tên tour',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Danh mục',
            dataIndex: 'category_name',
            key: 'category_name',
            width: 150
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            render: (price) => new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price)
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            key: 'duration',
            width: 120,
            render: (duration) => `${duration} ngày`
        },
        {
            title: 'Điểm khởi hành',
            dataIndex: 'start_location',
            key: 'start_location',
            width: 150
        },
        {
            title: 'Điểm kết thúc',
            dataIndex: 'end_location',
            key: 'end_location',
            width: 150
        },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditTour(record.id)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDeleteTour(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    useEffect(() => {
        handleTourList();
        fetchCategories();
    }, []);

    const tourForm = (
        <Form.Provider>
            <Form.Item
                name="name"
                label="Tên tour"
                rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="category_id"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
                <Select>
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>{category.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="price"
                label="Giá tour"
                rules={[{ required: true, message: 'Vui lòng nhập giá tour!' }]}
            >
                <InputNumber
                    min={0}
                    step={100000}
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            </Form.Item>

            <Form.Item
                name="duration"
                label="Thời gian (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item
                name="start_location"
                label="Điểm khởi hành"
                rules={[{ required: true, message: 'Vui lòng nhập điểm khởi hành!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="end_location"
                label="Điểm kết thúc"
                rules={[{ required: true, message: 'Vui lòng nhập điểm kết thúc!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="included_services"
                label="Dịch vụ bao gồm"
                rules={[{ required: true, message: 'Vui lòng nhập dịch vụ bao gồm!' }]}
            >
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="excluded_services"
                label="Dịch vụ không bao gồm"
                rules={[{ required: true, message: 'Vui lòng nhập dịch vụ không bao gồm!' }]}
            >
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="notes"
                label="Ghi chú"
            >
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="image"
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                />
            </Form.Item>
        </Form.Provider>
    );

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
                                <span>Quản lý Tours</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                                extra={[
                                    <Button
                                        key="1"
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={showModal}
                                    >
                                        Thêm Tour mới
                                    </Button>,
                                ]}
                            >
                                <Row>
                                    <Col span="24">
                                        <Input.Search
                                            placeholder="Tìm kiếm theo tên tour"
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
                            dataSource={tours}
                            scroll={{ x: 1500 }}
                            pagination={pagination}
                            onChange={handleTableChange}
                        />
                    </div>
                </div>

                <Modal
                    title="Thêm Tour mới"
                    visible={openModalCreate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                if (!file) {
                                    notification["error"]({
                                        message: 'Thông báo',
                                        description: 'Vui lòng chọn hình ảnh cho tour!',
                                    });
                                    return;
                                }
                                handleOkTour(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_in_modal"
                    >
                        {tourForm}
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa Tour"
                    visible={openModalUpdate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                handleUpdateTour(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("update")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={800}
                >
                    <Form
                        form={form2}
                        layout="vertical"
                        name="form_in_modal_update"
                    >
                        {tourForm}
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default ToursManagement; 