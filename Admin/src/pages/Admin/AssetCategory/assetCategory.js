import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
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
    notification
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import categoriesApiService from "../../../services/categoriesApiService";
import "./assetCategory.css";

const AssetCategory = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            await categoriesApiService.createCategory(values).then(response => {
                if (response.message === "Category already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên danh mục đã tồn tại.',
                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo danh mục thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo danh mục thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error);
        }
    };

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            await categoriesApiService.updateCategory(id, values).then(response => {
                if (response.message === "Category already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên danh mục đã tồn tại.',
                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa danh mục thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa danh mục thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa danh mục:', error);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleCategoryList = async () => {
        try {
            const res = await categoriesApiService.getAllCategories();
            setCategory(res);
            setLoading(false);
        } catch (error) {
            console.error('Không thể lấy danh sách danh mục:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await categoriesApiService.deleteCategory(id).then(response => {
                if (response.message === "Cannot delete this category because it is linked to other items.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: "Không thể xóa danh mục này vì đã có liên kết đến các mục khác.",
                    });
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa danh mục thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa danh mục thành công',
                    });
                    handleCategoryList();
                    setLoading(false);
                }
                setLoading(false);

            });
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
        }
    };

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await categoriesApiService.getCategoryById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    description: response.description,
                });
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin danh mục:', error);
            }
        })();
    };

    const handleFilter = async (name) => {
        try {
            const res = await categoriesApiService.searchCategories(name.target.value);
            setCategory(res);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm danh mục:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa danh mục này?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    useEffect(() => {
        handleCategoryList();
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
                                <ShoppingOutlined />
                                <span>Quản lý danh mục</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }}>Tạo danh mục</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Xác thực thất bại:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="categoryCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                                {
                                    max: 30,
                                    message: 'Tên tối đa 30 ký tự!',
                                },
                                {
                                    min: 2,
                                    message: 'Tên ít nhất 2 ký tự!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa danh mục"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Xác thực thất bại:', info);
                            });
                    }}
                    onCancel={() => handleCancel("update")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="categoryUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default AssetCategory;