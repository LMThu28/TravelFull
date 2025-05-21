import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import orderApi from "../../services/reservationsApiService";
import "./orderList.css";
const { Option } = Select;

const OrderList = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const categoryList = {
                "status": values.status
            }
            await orderApi.updateReservation(id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await orderApi.getAllReservations().then((res) => {
                setOrder(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await orderApi.deleteReservation(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa lịch đặt thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa lịch đặt thành công',

                    });
                    setCurrentPage(1);
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditOrder = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await orderApi.getReservationById(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    status: response.status,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await orderApi.searchReservations(name.target.value);
            setOrder(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }
    const columns = [
        {
            title: 'Mã Đặt Chỗ',
            dataIndex: 'reservation_id',
            key: 'reservation_id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'ID Người Dùng',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'ID Phòng',
            dataIndex: 'room_id',
            key: 'room_id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tổng Giá',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (text) => <span>{Number(text)?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {status === "pending" ? <Tag color="blue">Đang chờ</Tag> : 
                     status === "confirmed" ? <Tag color="green">Đã xác nhận</Tag> : 
                     status === "cancelled" ? <Tag color="red">Đã hủy</Tag> : 
                     <Tag color="default">Không xác định</Tag>}
                </span>
            ),
        },
        {
            title: 'Ngày Nhận Phòng',
            dataIndex: 'check_in_date',
            key: 'check_in_date',
            render: (date) => <span>{new Date(date).toLocaleString()}</span>,
        },
        {
            title: 'Ngày Trả Phòng',
            dataIndex: 'check_out_date',
            key: 'check_out_date',
            render: (date) => <span>{new Date(date).toLocaleString()}</span>,
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditOrder(record.reservation_id)}
                            >
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa đơn hàng này?"
                                onConfirm={() => handleDeleteCategory(record.reservation_id)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >
                                    Xóa
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                await orderApi.getAllReservations().then((res) => {
                    console.log(res);
                    setOrder(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
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
                                <ShoppingCartOutlined />
                                <span>Quản lý đặt hotel</span>
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
                                    <Col span="18">
                                        {/* <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        /> */}
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {/* <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo đơn hàng</Button> */}
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }} />
                    </div>
                </div>

                <Modal
                    title="Cập nhật đơn hàng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select>
                                <Option value="pending"><Tag color="blue">Đang chờ</Tag></Option>
                                <Option value="confirmed"><Tag color="green">Đã xác nhận</Tag></Option>
                                <Option value="cancelled"><Tag color="red">Đã hủy</Tag></Option>
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default OrderList;