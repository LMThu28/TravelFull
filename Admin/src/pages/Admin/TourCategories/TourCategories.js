import {
    DeleteOutlined,
    EditOutlined,
    CompassOutlined,
    PlusOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import tourApi from "../../../apis/tourApi";
import "./tourCategories.css";

const TourCategories = () => {
    const [categories, setCategories] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [searchTerm, setSearchTerm] = useState('');

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkCategory = async (values) => {
        setLoading(true);
        try {
            const response = await tourApi.createTourCategory(values);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Tạo danh mục tour thành công',
                });
                setOpenModalCreate(false);
                handleCategoryList();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Tạo danh mục tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Tạo danh mục tour thất bại',
            });
        }
        setLoading(false);
    };

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const response = await tourApi.updateTourCategory(id, values);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Cập nhật danh mục tour thành công',
                });
                setOpenModalUpdate(false);
                handleCategoryList();
                form2.resetFields();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Cập nhật danh mục tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Cập nhật danh mục tour thất bại',
            });
        }
        setLoading(false);
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
        form.resetFields();
        form2.resetFields();
    };

    const handleCategoryList = async () => {
        try {
            const response = await tourApi.getAllTourCategories();
            if (response.success) {
                setCategories(response.data);
            }
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy danh sách danh mục tour thất bại',
            });
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            setLoading(true);
            const response = await tourApi.deleteTourCategory(id);
            if (response.success) {
                notification["success"]({
                    message: 'Thông báo',
                    description: 'Xóa danh mục tour thành công',
                });
                handleCategoryList();
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Xóa danh mục tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Xóa danh mục tour thất bại',
            });
        }
        setLoading(false);
    };

    const handleEditCategory = async (id) => {
        try {
            setLoading(true);
            const response = await tourApi.getTourCategoryById(id);
            if (response.success) {
                setId(id);
                form2.setFieldsValue({
                    name: response.data.name,
                    description: response.data.description
                });
                setOpenModalUpdate(true);
            } else {
                notification["error"]({
                    message: 'Thông báo',
                    description: response.message || 'Lấy thông tin danh mục tour thất bại',
                });
            }
        } catch (error) {
            notification["error"]({
                message: 'Thông báo',
                description: 'Lấy thông tin danh mục tour thất bại',
            });
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Số lượng tour',
            dataIndex: 'tour_count',
            key: 'tour_count',
            width: 120
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditCategory(record.id)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDeleteCategory(record.id)}
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
        handleCategoryList();
    }, []);

    const categoryForm = (
        <Form.Provider>
            <Form.Item
                name="name"
                label="Tên danh mục"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
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
        </Form.Provider>
    );

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <span>Quản lý Danh mục Tours</span>
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
                                        Thêm danh mục mới
                                    </Button>,
                                ]}
                            >
                                <Row>
                                    <Col span="24">
                                        <Input.Search
                                            placeholder="Tìm kiếm theo tên danh mục"
                                            style={{ width: 300 }}
                                            onSearch={(value) => setSearchTerm(value)}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            value={searchTerm}
                                            allowClear
                                        />
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table
                            columns={columns}
                            dataSource={filteredCategories}
                            pagination={{
                                position: ['bottomCenter']
                            }}
                        />
                    </div>
                </div>

                <Modal
                    title="Thêm danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                handleOkCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_in_modal"
                    >
                        {categoryForm}
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa danh mục"
                    visible={openModalUpdate}
                    style={{ top: 20 }}
                    onOk={() => {
                        form2.validateFields()
                            .then((values) => {
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("update")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        layout="vertical"
                        name="form_in_modal_update"
                    >
                        {categoryForm}
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default TourCategories; 