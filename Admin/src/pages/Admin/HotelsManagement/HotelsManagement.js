import {
    DeleteOutlined,
    EditOutlined,
    AuditOutlined,
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
    Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import hotelsApiService from "../../../services/hotelsApiService";
import "./hotelsManagement.css";
import uploadFileApi from '../../../apis/uploadFileApi';

const HotelsManagement = () => {

    const [hotels, setHotels] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

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


    const handleOkHotel = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            }

            updatedValues.rating = 0;

            // Check for duplicate phone number and email
            const existingHotel = hotels.find(hotel => hotel.phone_number === updatedValues.phone_number || hotel.email === updatedValues.email);
            if (existingHotel) {
                setLoading(false);
                return notification["error"]({
                    message: `Thông báo`,
                    description: 'Số điện thoại hoặc email đã tồn tại.',
                });
            }

            await hotelsApiService.createHotel(updatedValues).then(response => {
                if (response.message === "Hotel already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên khách sạn đã tồn tại.',
                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo khách sạn thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo khách sạn thành công',
                    });
                    setOpenModalCreate(false);
                    handleHotelList();
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo khách sạn:', error);
        }
    };

    const handleUpdateHotel = async (values) => {
        setLoading(true);
        try {
            const updatedValues = { ...values };
            if (file) {
                updatedValues.image = file;
            }

            await hotelsApiService.updateHotel(id, updatedValues).then(response => {
                if (response.message === "Hotel already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên khách sạn đã tồn tại.',
                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa khách sạn thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa khách sạn thành công',
                    });
                    handleHotelList();
                    setOpenModalUpdate(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa khách sạn:', error);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleHotelList = async () => {
        try {
            const res = await hotelsApiService.getAllHotels();
            setHotels(res);
            setLoading(false);
        } catch (error) {
            console.error('Không thể lấy danh sách khách sạn:', error);
        }
    };

    const handleDeleteHotel = async (id) => {
        setLoading(true);
        try {
            await hotelsApiService.deleteHotel(id).then(response => {
                if (response.message === "Cannot delete this hotel because it is linked to other items.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: "Không thể xóa khách sạn này vì đã có liên kết đến các mục khác.",
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa khách sạn thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa khách sạn thành công',
                    });
                    handleHotelList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi xóa khách sạn:', error);
        }
    };

    const handleEditHotel = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await hotelsApiService.getHotelById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    address: response.address,
                    city: response.city,
                    description: response.description,
                    amenities: response.amenities,
                    phone_number: response.phone_number,
                    email: response.email,
                    website: response.website,
                });
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin khách sạn:', error);
            }
        })();
    };

    const handleFilter = async (name) => {
        try {
            const res = await hotelsApiService.searchHotels(name.target.value);
            setHotels(res);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm khách sạn:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'hotel_id',
            key: 'hotel_id',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} alt="Hotel" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
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
            title: 'Tiện nghi',
            dataIndex: 'amenities',
            key: 'amenities',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
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
                            onClick={() => handleEditHotel(record.hotel_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa khách sạn này?"
                                onConfirm={() => handleDeleteHotel(record.hotel_id)}
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
        handleHotelList();
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
                                <AuditOutlined />
                                <span>Quản lý khách sạn</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }}>Tạo khách sạn</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }} pagination={{ position: ['bottomCenter'] }} dataSource={hotels} />
                    </div>
                </div>

                <Modal
                    title="Tạo khách sạn mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkHotel(values);
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
                        name="hotelCreate"
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
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Thành phố" />
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
                            name="amenities"
                            label="Tiện nghi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiện nghi!',
                                },
                                {
                                    pattern: /^[^!@#$%^&*(),.?":{}|<>]*$/,
                                    message: 'Tiện nghi không được chứa ký tự đặc biệt!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiện nghi" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="website"
                            label="Website"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập website!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Website" />
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
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa khách sạn"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateHotel(values);
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
                        name="hotelUpdate"
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
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Thành phố" />
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
                            name="amenities"
                            label="Tiện nghi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiện nghi!',
                                },
                                {
                                    pattern: /^[^!@#$%^&*(),.?":{}|<>]*$/,
                                    message: 'Tiện nghi không được chứa ký tự đặc biệt!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiện nghi" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="website"
                            label="Website"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập website!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Website" />
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
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default HotelsManagement; 