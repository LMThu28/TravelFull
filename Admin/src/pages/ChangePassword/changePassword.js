import React, { useState, useEffect } from 'react';
import "./changePassword.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Divider, Alert, notification } from 'antd';
import backgroundLogin from "../../assets/image/background-login.png";
import { useParams } from "react-router-dom";
import axiosClient from '../../apis/axiosClient';

const ChangePassWord = () => {

    const [isLogin, setLogin] = useState(false);

    let history = useHistory();
    let { id } = useParams();

    const onFinish = async (values) => {
        const resetPassWord = {
            currentPassword: values.currentPassword,
            newPassword: values.password
        }
        const currentUser = JSON.parse(localStorage.getItem("user"));
        axiosClient.put("/user/changePassword/" + currentUser.id, resetPassWord)
            .then(function (response) {
                console.log(response);
                if (response.message == "Current password is incorrect") {
                    return notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Mật khẩu hiện tại không đúng!',

                    });
                }
                if (response === undefined) {
                    setLogin(true);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Thay đổi mật khẩu thành công',

                    });
                    history.push("/login");
                }
            })
            .catch(error => {
                console.log("password error" + error)
            });
    }
    useEffect(() => {

    }, [])

    return (
        <div className="imageBackground">
            <div id="formContainer" >
                <div id="form-Login">
                    <div className="formContentLeft"
                    >
                        <img className="formImg" src={backgroundLogin} alt='spaceship' />
                    </div>
                    <Form
                        style={{ width: 340, marginBottom: 8 }}
                        name="normal_login"
                        className="loginform"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
                            <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">Travelfull</Divider>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
                            <p className="text">Thay đổi mật khẩu</p>
                        </Form.Item>
                        <>
                            {isLogin === true ?
                                <Form.Item style={{ marginBottom: 16 }}>
                                    <Alert
                                        message="Error changing password"
                                        type="error"
                                        showIcon
                                    />

                                </Form.Item>
                                : ""}
                        </>
                        <Form.Item
                            name="currentPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mật khẩu cũ!',
                                },
                                { max: 100, message: 'Tên tối đa 100 ký tự' },
                                { min: 5, message: 'Tên ít nhất 5 ký tự' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Mật khẩu cũ" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mật khẩu!',
                                },
                                { max: 100, message: 'Tên tối đa 100 ký tự' },
                                { min: 5, message: 'Tên ít nhất 5 ký tự' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" />
                        </Form.Item>

                        <Form.Item style={{ width: '100%', marginTop: 20 }}>
                            <Button className="button" type="primary" htmlType="submit"  >
                                Hoàn thành
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassWord;



