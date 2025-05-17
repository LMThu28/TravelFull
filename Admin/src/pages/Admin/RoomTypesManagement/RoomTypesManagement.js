import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    BankFilled
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
    Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import roomTypesApiService from "../../../services/roomTypesApiService";
import hotelsApiService from "../../../services/hotelsApiService";
import "./roomTypesManagement.css";

const { Option } = Select;

const RoomTypesManagement = () => {

    const [roomTypes, setRoomTypes] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkRoomType = async (values) => {
        setLoading(true);
        try {
            // Chuyển đổi chuỗi thành số
            const formattedValues = {
                ...values,
                occupancy: parseInt(values.occupancy, 10),
                price_per_night: parseFloat(values.price_per_night),
            };

            const response = await roomTypesApiService.createRoomType(formattedValues);
            if (response.message === "Room type already exists") {
                setLoading(false);
                return notification["error"]({
                    message: `Thông báo`,
                    description: 'Loại phòng đã tồn tại.',
                });
            }

            if (response.error) {
                notification["error"]({
                    message: `Thông báo`,
                    description: response.error || 'Tạo loại phòng thất bại',
                });
            } else {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Tạo loại phòng thành công',
                });
                form.resetFields();
                setOpenModalCreate(false);
                handleRoomTypeList();
            }
        } catch (error) {
            console.error('Lỗi khi tạo loại phòng:', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Có lỗi xảy ra khi tạo loại phòng.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRoomType = async (values) => {
        setLoading(true);
        try {
            // Chuyển đổi chuỗi thành số
            const formattedValues = {
                ...values,
                occupancy: parseInt(values.occupancy, 10),
                price_per_night: parseFloat(values.price_per_night),
            };

            const response = await roomTypesApiService.updateRoomType(id, formattedValues);
            if (response.message === "Room type already exists") {
                setLoading(false);
                return notification["error"]({
                    message: `Thông báo`,
                    description: 'Loại phòng đã tồn tại.',
                });
            }
            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Chỉnh sửa loại phòng thất bại',
                });
            } else {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Chỉnh sửa loại phòng thành công',
                });
                handleRoomTypeList();
                setOpenModalUpdate(false);
            }
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa loại phòng:', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Có lỗi xảy ra khi chỉnh sửa loại phòng.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleRoomTypeList = async () => {
        try {
            const res = await roomTypesApiService.getAllRoomTypes();
            setRoomTypes(res);
            setLoading(false);
        } catch (error) {
            console.error('Không thể lấy danh sách loại phòng:', error);
        }
    };

    const handleHotelList = async () => {
        try {
            const res = await hotelsApiService.getAllHotels();
            setHotels(res);
        } catch (error) {
            console.error('Không thể lấy danh sách khách sạn:', error);
        }
    };

    const handleDeleteRoomType = async (id) => {
        setLoading(true);
        try {
            const response = await roomTypesApiService.deleteRoomType(id);
            if (response.message === "Cannot delete this room type because it is linked to other items.") {
                notification["error"]({
                    message: `Thông báo`,
                    description: "Không thể xóa loại phòng này vì đã có liên kết đến các mục khác.",
                });
                setLoading(false);
                return;
            }
            if (response === undefined) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Xóa loại phòng thất bại',
                });
                setLoading(false);
            } else {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Xóa loại phòng thành công',
                });
                handleRoomTypeList();
                setLoading(false);
            }
        } catch (error) {
            console.error('Lỗi khi xóa loại phòng:', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Có lỗi xảy ra khi xóa loại phòng.',
            });
            setLoading(false);
        }
    };

    const handleEditRoomType = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await roomTypesApiService.getRoomTypeById(id);
                setId(id);
                form2.setFieldsValue({
                    hotel_id: response.hotel_id,
                    type_name: response.type_name,
                    description: response.description,
                    bed_type: response.bed_type,
                    occupancy: response.occupancy,
                    price_per_night: response.price_per_night,
                    amenities: response.amenities,
                });
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin loại phòng:', error);
            }
        })();
    };

    const handleFilter = async (name) => {
        try {
            const res = await roomTypesApiService.searchRoomTypes(name.target.value);
            setRoomTypes(res);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm loại phòng:', error);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Khách sạn',
            dataIndex: 'hotel_id',
            key: 'hotel_id',
            render: (id) => hotels.find(hotel => hotel.hotel_id === id)?.name || 'N/A',
        },
        {
            title: 'Tên loại',
            dataIndex: 'type_name',
            key: 'type_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Loại giường',
            dataIndex: 'bed_type',
            key: 'bed_type',
        },
        {
            title: 'Số người',
            dataIndex: 'occupancy',
            key: 'occupancy',
        },
        {
            title: 'Giá mỗi đêm',
            dataIndex: 'price_per_night',
            key: 'price_per_night',
            render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        },
        {
            title: 'Tiện nghi',
            dataIndex: 'amenities',
            key: 'amenities',
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
                            onClick={() => handleEditRoomType(record.room_type_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa loại phòng này?"
                                onConfirm={() => handleDeleteRoomType(record.room_type_id)}
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
        handleRoomTypeList();
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
                                <BankFilled />
                                <span>Quản lý loại phòng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên loại"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    récente
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }}>Tạo loại phòng</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }} pagination={{ position: ['bottomCenter'] }} dataSource={roomTypes} />
                    </div>
                </div>

                <Modal
                    title="Tạo loại phòng mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                handleOkRoomType(values);
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
                        name="roomTypeCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="hotel_id"
                            label="Khách sạn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn khách sạn!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn khách sạn">
                                {hotels.map(hotel => (
                                    <Option key={hotel.hotel_id} value={hotel.hotel_id}>
                                        {hotel.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="type_name"
                            label="Tên loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên loại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên loại" />
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
                            name="bed_type"
                            label="Loại giường"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại giường!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Loại giường" />
                        </Form.Item>
                        <Form.Item
                            name="occupancy"
                            label="Số người"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số người!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value || isNaN(value) || Number(value) < 0) {
                                            return Promise.reject('Số người phải là số không âm!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số người" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="price_per_night"
                            label="Giá mỗi đêm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá mỗi đêm!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value || isNaN(value) || Number(value) < 0) {
                                            return Promise.reject('Giá mỗi đêm phải là số không âm!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá mỗi đêm" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="amenities"
                            label="Tiện nghi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiện nghi!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiện nghi" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa loại phòng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                handleUpdateRoomType(values);
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
                        name="roomTypeUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="hotel_id"
                            label="Khách sạn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn khách sạn!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn khách sạn">
                                {hotels.map(hotel => (
                                    <Option key={hotel.hotel_id} value={hotel.hotel_id}>
                                        {hotel.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="type_name"
                            label="Tên loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên loại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên loại" />
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
                            name="bed_type"
                            label="Loại giường"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại giường!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Loại giường" />
                        </Form.Item>
                        <Form.Item
                            name="occupancy"
                            label="Số người"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số người!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value || isNaN(value) || Number(value) < 0) {
                                            return Promise.reject('Số người phải là số không âm!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số người" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="price_per_night"
                            label="Giá mỗi đêm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá mỗi đêm!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value || isNaN(value) || Number(value) < 0) {
                                            return Promise.reject('Giá mỗi đêm phải là số không âm!');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá mỗi đêm" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="amenities"
                            label="Tiện nghi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiện nghi!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiện nghi" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default RoomTypesManagement;