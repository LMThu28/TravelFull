import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ApartmentOutlined
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
    Switch
} from 'antd';
import React, { useEffect, useState } from 'react';
import roomsApiService from "../../../services/roomsApiService";
import hotelsApiService from "../../../services/hotelsApiService";
import roomTypesApiService from "../../../services/roomTypesApiService";
import "./roomsManagement.css";

const { Option } = Select;

const RoomsManagement = () => {

    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkRoom = async (values) => {
        setLoading(true);
        try {
            await roomsApiService.createRoom(values).then(response => {
                if (response.message === "Room already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Phòng đã tồn tại.',
                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo phòng thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo phòng thành công',
                    });
                    setOpenModalCreate(false);
                    handleRoomList();
                }
            });
        } catch (error) {
            console.error('Lỗi khi tạo phòng:', error);
        }
    };

    const handleUpdateRoom = async (values) => {
        setLoading(true);
        try {
            await roomsApiService.updateRoom(id, values).then(response => {
                if (response.message === "Room already exists") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description: 'Phòng đã tồn tại.',
                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa phòng thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa phòng thành công',
                    });
                    handleRoomList();
                    setOpenModalUpdate(false);
                }
            });
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa phòng:', error);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleRoomList = async () => {
        try {
            const res = await roomsApiService.getAllRooms();
            setRooms(res);
            setLoading(false);
        } catch (error) {
            console.error('Không thể lấy danh sách phòng:', error);
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

    const handleRoomTypeList = async () => {
        try {
            const res = await roomTypesApiService.getAllRoomTypes();
            setRoomTypes(res);
        } catch (error) {
            console.error('Không thể lấy danh sách loại phòng:', error);
        }
    };

    const handleDeleteRoom = async (id) => {
        setLoading(true);
        try {
            await roomsApiService.deleteRoom(id).then(response => {
                if (response?.message === "Cannot delete this room because it is linked to other items.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: "Không thể xóa phòng này vì đã có liên kết đến các mục khác.",
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa phòng thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa phòng thành công',
                    });
                    handleRoomList();
                    setLoading(false);
                }
                setLoading(false);

            });
        } catch (error) {
            console.error('Lỗi khi xóa phòng:', error);
        }
    };

    const handleEditRoom = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await roomsApiService.getRoomById(id);
                setId(id);
                form2.setFieldsValue({
                    hotel_id: response.hotel_id,
                    room_type_id: response.room_type_id,
                    room_number: response.room_number,
                    floor: response.floor,
                    is_available: response.is_available,
                });
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin phòng:', error);
            }
        })();
    };

    const handleFilter = async (name) => {
        try {
            const res = await roomsApiService.searchRooms(name.target.value);
            setRooms(res);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm phòng:', error);
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
            title: 'Loại phòng',
            dataIndex: 'room_type_id',
            key: 'room_type_id',
            render: (id) => roomTypes.find(roomType => roomType.room_type_id === id)?.type_name || 'N/A',
        },
        {
            title: 'Số phòng',
            dataIndex: 'room_number',
            key: 'room_number',
        },
        {
            title: 'Tầng',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Có sẵn',
            dataIndex: 'is_available',
            key: 'is_available',
            render: (isAvailable) => isAvailable ? 'Có' : 'Không',
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
                            onClick={() => handleEditRoom(record.room_id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa phòng này?"
                                onConfirm={() => handleDeleteRoom(record.room_id)}
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
        handleRoomList();
        handleHotelList();
        handleRoomTypeList();
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
                                <ApartmentOutlined />
                                <span>Quản lý phòng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo số phòng"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }}>Tạo phòng</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} scroll={{ x: true }} pagination={{ position: ['bottomCenter'] }} dataSource={rooms} />
                    </div>
                </div>

                <Modal
                    title="Tạo phòng mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkRoom(values);
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
                        name="roomCreate"
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
                            name="room_type_id"
                            label="Loại phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại phòng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn loại phòng">
                                {roomTypes.map(roomType => (
                                    <Option key={roomType.room_type_id} value={roomType.room_type_id}>
                                        {roomType.type_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="room_number"
                            label="Số phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số phòng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số phòng" />
                        </Form.Item>
                        <Form.Item
                            name="floor"
                            label="Tầng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tầng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tầng" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="is_available"
                            label="Có sẵn"
                            valuePropName="checked"
                            style={{ marginBottom: 10 }}
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa phòng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateRoom(values);
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
                        name="roomUpdate"
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
                            name="room_type_id"
                            label="Loại phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại phòng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn loại phòng">
                                {roomTypes.map(roomType => (
                                    <Option key={roomType.room_type_id} value={roomType.room_type_id}>
                                        {roomType.type_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="room_number"
                            label="Số phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số phòng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số phòng" />
                        </Form.Item>
                        <Form.Item
                            name="floor"
                            label="Tầng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tầng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tầng" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="is_available"
                            label="Có sẵn"
                            valuePropName="checked"
                            style={{ marginBottom: 10 }}
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default RoomsManagement; 