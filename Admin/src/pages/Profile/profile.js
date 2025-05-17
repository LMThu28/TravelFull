import {
    FormOutlined,
    HomeOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form, Input,
    Modal,
    Row,
    Spin,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import uploadFileApi from '../../apis/uploadFileApi';
import userApi from "../../apis/userApi";
import "./profile.css";
import localStorageService from '../../services/localStorageService';


const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [file, setUploadFile] = useState();
    const [image_qr, setImageQR] = useState();

    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '03b81b9c18944e6495d890b189357388',
        lat: '16.060094749570567',
        lon: '108.2097695823264',
        lang: 'en',
        unit: 'metric',
    });

    // Hàm để fetch dữ liệu và cập nhật state
    const fetchData = async () => {
        try {
            const user = localStorageService.getUser();
            const profileData = await userApi.getProfileById(user.id);
            localStorageService.setUser(profileData.data)
            setUserData(profileData.data);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch profile user:' + error);
        }
    };

    useEffect(() => {

        fetchData();
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            const formatData = {
                "email": values.email,
                "phone": values.phone,
                "username": values.username,
                "image": file,
            };
            console.log(userData);
            await userApi.updateProfile(formatData, userData.id)
                .then(response => {
                    console.log(response);
                    if (response === '' || response === undefined) {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thất bại',
                        });
                    } else {
                        notification.success({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thành công',
                        });
                        setVisibleModal(false)
                        setUploadFile();

                    }
                });
            fetchData();
        } catch (error) {
            throw error;
        }
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ marginTop: 20, marginLeft: 24 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <FormOutlined />
                            <span>Trang cá nhân</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div>
                    <div>
                        <Row justify="center">
                            <Col span="9" style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                <Card hoverable={true} className="profile-card" style={{ padding: 0, margin: 0 }}>
                                    <Row justify="center">
                                        <img
                                            src={userData?.image}
                                            style={{
                                                width: 150,
                                                height: 150,
                                                borderRadius: '50%',
                                            }}
                                        />
                                    </Row>
                                    <Row justify="center">
                                        <Col span="24">
                                            <Row justify="center">
                                                <strong style={{ fontSize: 18 }}>{userData?.username}</strong>
                                            </Row>
                                            <Row justify="center">
                                                <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>{userData?.email}</p>
                                            </Row>
                                            <Row justify="center">
                                                <p style={{ padding: 0, margin: 0, marginBottom: 0 }}>{userData?.birthday}</p>
                                            </Row>
                                            <Row justify="center">
                                                <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>{userData?.phone}</p>
                                            </Row>
                                            <Divider style={{ padding: 0, margin: 0 }} ></Divider>
                                        </Col>
                                        <Button type="primary" style={{ marginTop: 15, marginBottom: 15 }} onClick={() => setVisibleModal(true)}>Cập nhật Profile</Button>

                                    </Row>
                                </Card>


                            </Col>


                            <Col span="6" style={{ marginTop: 20 }}>
                                <ReactWeather
                                    isLoading={isLoading}
                                    errorMessage={errorMessage}
                                    data={data}
                                    lang="en"
                                    locationLabel="Đà Nẵng"
                                    unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                                    showForecast
                                />
                            </Col>
                        </Row>
                    </div>
                </div>

                <div>
                    <Modal
                        title="Cập nhật thông tin cá nhân"
                        visible={isVisibleModal}
                        onCancel={() => setVisibleModal(false)}
                        footer={null}
                    >
                        <Form
                            initialValues={{
                                username: userData?.username,
                                email: userData?.email,
                                phone: userData?.phone,
                            }}
                            onFinish={handleFormSubmit}
                        >
                            <Spin spinning={loading}>
                                <Form.Item
                                    label="Tên"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập username!',
                                        },
                                        {
                                            min: 2,
                                            max: 30,
                                            message: 'Tên phải có từ 2 đến 30 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Email" name="email" rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lệ!',
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Số điện thoại" name="phone" rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                    {
                                        pattern: /^[0-9]{10}$/,
                                        message: "Số điện thoại phải có 10 chữ số và chỉ chứa số",
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="image"
                                    label="Chọn ảnh"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                        id="avatar"
                                        name="file"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Cập nhật
                                    </Button>
                                </Form.Item>
                            </Spin>
                        </Form>
                    </Modal>
                </div>
            </Spin>
        </div >
    )
}

export default Profile;