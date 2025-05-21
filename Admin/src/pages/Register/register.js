import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, notification, Modal, Checkbox } from 'antd';
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";
import "./register.css";

const RegisterCustomer = () => {

    let history = useHistory();

    const onFinish = async (values) => {

        try {
            const formatData = {
                "username": values.username,
                "email": values.email,
                "phone": values.phone,
                "password": values.password,
                "role": "isPartner",
                "status": "noactive"
            }
            await axiosClient.post("/auth/register", formatData)
                .then(response => {
                    console.log(response);
                    if (response === "Email is exist") {
                        return notification["error"]({
                            message: "Thông báo",
                            description: "Email đã tồn tại!",

                        });
                    }
                    if (response === undefined) {
                        notification["error"]({
                            message: "Thông báo",
                            description: "Đăng ký thất bại",

                        });
                    }
                    else {
                        notification["success"]({
                            message: "Thông báo",
                            description: "Đăng ký thành công",
                        });
                        setTimeout(function () {
                            history.push("/login");
                        }, 1000);
                    }
                }
                );
        } catch (error) {
            throw error;
        }
    }

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    // Xử lý khi checkbox được chọn
    const handleCheckboxChange = (e) => {
        setAcceptedTerms(e.target.checked);
    }

    // Xử lý khi nút chấp nhận được nhấn
    const handleAcceptTerms = () => {
        setAcceptedTerms(true);
    }

    // Xử lý khi nút "Xem Điều Khoản và Điều Kiện" được nhấn
    const showTermsPopup = () => {
        setShowTermsModal(true);
    }

    // Xử lý khi đóng popup điều khoản
    const handleCancel = () => {
        setShowTermsModal(false);
    }

    return (
        <div>
            <div className="imageBackground">
                <div id="wrapper">
                    <Card id="dialog" bordered={false} >
                        <Form
                            style={{ width: 370, marginBottom: 8 }}
                            name="normal_login"
                            className="loginform"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item style={{ marginBottom: 3 }}>

                                <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">Travelfull!</Divider>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 16 }}>
                                <p className="text">Đăng ký tài khoản đối tác</p>
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên!',
                                    },
                                    { min: 5, message: 'Mật khẩu ít nhất 5 ký tự' },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="siteformitemicon" />} placeholder="Tên" />
                            </Form.Item >

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu!',
                                    },
                                    { max: 20, message: 'Mật khẩu tối đa 20 ký tự' },
                                    { min: 5, message: 'Mật khẩu ít nhất 5 ký tự' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="siteformitemicon" />}
                                    type="password"
                                    placeholder="Mật khẩu"
                                    style={{ height: 34, borderRadius: 5 }}
                                />
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập e-mail!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input prefix={<MailOutlined className="siteformitemicon" />} placeholder="e-mail!" />
                            </Form.Item >

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input prefix={<PhoneOutlined className="siteformitemicon" />} placeholder="Số điện thoại" />
                            </Form.Item >
                            <Form.Item style={{ marginBottom: 10 }}>
                                <div>
                                    <Checkbox checked={acceptedTerms} onChange={handleCheckboxChange}>
                                    </Checkbox>
                                    <span style={{ marginLeft: 10 }} onClick={showTermsPopup} className="terms-link">Xem Điều Khoản và Điều Kiện</span>
                                </div>
                            </Form.Item>

                            {acceptedTerms && (
                                <Form.Item style={{ marginBottom: 18 }}>
                                    <Button className="loginformbutton" type="primary" htmlType="submit">
                                        Đăng Ký
                                    </Button>
                                </Form.Item>
                            )}
                        </Form>
                    </Card>
                </div>
            </div>
            {/* Modal hiển thị popup điều khoản */}
            <Modal
                title="Điều Khoản và Điều Kiện"
                visible={showTermsModal}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                ]}
            >
                {/* Nội dung điều khoản */}
                <div>
                    <ol>
                        <li>
                            <h2>Quyền Sở Hữu và Sử Dụng</h2>
                            <ul>
                                <li>Ứng dụng và tất cả các thành phần của nó, bao gồm nhưng không giới hạn các tính năng, chức năng, dữ liệu và nội dung, đều là tài sản của chủ sở hữu và được bảo vệ bởi luật bản quyền và các quyền sở hữu trí tuệ khác.</li>
                                <li>Người sử dụng được cấp quyền sử dụng ứng dụng và tài liệu liên quan theo các điều kiện và hạn chế được quy định trong điều khoản này.</li>
                            </ul>
                        </li>
                        <li>
                            <h2>Phạm Vi Sử Dụng</h2>
                            <ul>
                                <li>Người sử dụng đồng ý sử dụng ứng dụng chỉ cho mục đích cá nhân và không thương mại.</li>
                                <li>Không được sao chép, sửa đổi, phân phối, tái tạo, hoặc bán lại bất kỳ phần nào của ứng dụng hoặc nội dung của nó mà không có sự cho phép bằng văn bản từ chủ sở hữu.</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </Modal>
        </div>
    )
}

export default RegisterCustomer;
