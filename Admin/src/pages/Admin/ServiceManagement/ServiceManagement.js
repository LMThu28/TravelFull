import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    HomeOutlined,
    ContainerOutlined
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
    Select,
    Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import serviceApi from "../../../apis/serviceApi";
import categoriesApiService from "../../../services/categoriesApiService";
import uploadFileApi from '../../../apis/uploadFileApi';
import "./serviceManagement.css";

const { Option } = Select;

const ServiceManagement = () => {

    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();
    const [cities, setCities] = useState([]);

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

    const handleOkService = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            }

            await serviceApi.createService(updatedValues).then(response => {
                if (response.message === "Service already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Dịch vụ đã tồn tại.',
                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo dịch vụ thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo dịch vụ thành công',
                    });
                    setOpenModalCreate(false);
                    setUploadFile(undefined);
                    handleServiceList();
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo dịch vụ:', error);
        }
    };

    const handleUpdateService = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            }

            await serviceApi.updateService(id, updatedValues).then(response => {
                if (response.message === "Service already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Dịch vụ đã tồn tại.',
                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa dịch vụ thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa dịch vụ thành công',
                    });
                    setUploadFile(undefined);
                    handleServiceList();
                    setOpenModalUpdate(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa dịch vụ:', error);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleServiceList = async () => {
        try {
            const res = await serviceApi.getAllServices();
            setServices(res);
            setLoading(false);
        } catch (error) {
            console.error('Không thể lấy danh sách dịch vụ:', error);
        }
    };

    const handleCategoryList = async () => {
        try {
            const res = await categoriesApiService.getAllCategories();
            setCategories(res);
        } catch (error) {
            console.error('Không thể lấy danh sách danh mục:', error);
        }
    };

    const handleDeleteService = async (id) => {
        setLoading(true);
        try {
            await serviceApi.deleteService(id).then(response => {
                if (response.message === "Cannot delete this service because it is linked to other items.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: "Không thể xóa dịch vụ này vì đã có liên kết đến các mục khác.",
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa dịch vụ thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa dịch vụ thành công',
                    });
                    handleServiceList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi xóa dịch vụ:', error);
        }
    };

    const handleEditService = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await serviceApi.getServiceById(id);
                setId(id);
                form2.setFieldsValue({
                    categories_id: response.categories_id,
                    name: response.name,
                    description: response.description,
                    city: response.city
                });
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin dịch vụ:', error);
            }
        })();
    };

    const handleFilter = async (name) => {
        try {
            const res = await serviceApi.searchServices(name.target.value);
            setServices(res);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm dịch vụ:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/');
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Danh mục',
            dataIndex: 'categories_id',
            key: 'categories_id',
            render: (id) => categories.find(category => category.id === id)?.name || 'N/A',
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} alt="Service" style={{ width: 50, height: 50 }} />,
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
                            onClick={() => handleEditService(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa dịch vụ này?"
                                onConfirm={() => handleDeleteService(record.id)}
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
        handleServiceList();
        handleCategoryList();
        fetchCities();
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
                                <ContainerOutlined />
                                <span>Quản lý dịch vụ</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên dịch vụ"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }}>Tạo dịch vụ</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }} pagination={{ position: ['bottomCenter'] }} dataSource={services} />
                    </div>
                </div>

                <Modal
                    title="Tạo dịch vụ mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkService(values);
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
                        name="serviceCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="categories_id"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Tên dịch vụ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên dịch vụ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên dịch vụ" />
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
                        <Form.Item
                            name="image"
                            label="Chọn ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChangeImage}
                                id="image"
                                name="image"
                            />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thành phố">
                                {cities.map(city => (
                                    <Option key={city.code} value={city.name}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa dịch vụ"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateService(values);
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
                        name="serviceUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="categories_id"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Tên dịch vụ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên dịch vụ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên dịch vụ" />
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
                        <Form.Item
                            name="image"
                            label="Chọn ảnh"
                            style={{ marginBottom: 10 }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChangeImage}
                                id="image"
                                name="image"
                            />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thành phố">
                                {cities.map(city => (
                                    <Option key={city.code} value={city.name}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default ServiceManagement; 