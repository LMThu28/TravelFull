import {
    BarsOutlined,
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Empty,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axiosClient from '../../apis/axiosClient';
import newsApiService from "../../services/newsApiService";
import "./news.css";
import uploadFileApi from '../../apis/uploadFileApi';
import userApi from '../../apis/userApi';
import localStorageService from '../../services/localStorageService';

const NewsList = () => {

    const [newsList, setNewsList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();
    const [image, setImage] = useState();
    const [description, setDescription] = useState();

    const [file, setUploadFile] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };


    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            var formData = new FormData();
            formData.append("image", image);
            await axiosClient.post("/uploadFile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                const categoryList = {
                    "name": values.name,
                    "description": description,
                    "image": file,
                }
                return axiosClient.post("/news", categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description:
                                'Tạo tin tức thất bại',
                        });
                    }
                    else {
                        notification["success"]({
                            message: `Thông báo`,
                            description:
                                'Tạo tin tức thành công',
                        });
                        setOpenModalCreate(false);
                        setUploadFile();
                        handleCategoryList();
                    }
                })
            })

            setLoading(false);
        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": description,
                "image": file,
            }
            await axiosClient.put("/news/" + id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tin tức thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa tin tức thành công',
                    });
                    setUploadFile();
                    handleCategoryList();
                    setOpenModalUpdate(false);
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
            await newsApiService.getAllNews({ page: 1, limit: 10 }).then((res) => {
                console.log(res);
                setTotalList(res.totalDocs)
                setNewsList(res);
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
            await newsApiService.deleteNews(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tin tức thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tin tức thành công',

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

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await newsApiService.getNewsById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    description: setDescription(response.description),
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
            const res = await newsApiService.searchNews(name.target.value);
            setTotalList(res.totalDocs)
            setNewsList(res);
        } catch (error) {
            console.log('search to fetch news list:' + error);
        }
    }


    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '20%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <div className='box_detail_description' dangerouslySetInnerHTML={{ __html: text }}></div>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {userData.role == "isAdmin" ?
                            <>
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditCategory(record.id)}
                                >{"Chỉnh sửa"}
                                </Button>
                                <div
                                    style={{ marginLeft: 10 }}>
                                    <Popconfirm
                                        title="Bạn có chắc chắn xóa tin tức này?"
                                        onConfirm={() => handleDeleteCategory(record.id)}
                                        okText="Có"
                                        cancelText="không"
                                    >
                                        <Button
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            style={{ width: 150, borderRadius: 15, height: 30 }}
                                        >{"Xóa"}
                                        </Button>
                                    </Popconfirm>
                                </div></>
                            :
                            <Button
                                size="small"
                                onClick={() => {
                                    Modal.info({
                                        title: record.name,
                                        content: (
                                            <div dangerouslySetInnerHTML={{ __html: record.description }}></div>
                                        ),
                                        width: 800
                                    });
                                }}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                            >
                                {"Xem"}
                            </Button>
                        }
                    </Row>
                </div >
            ),
        },
    ];

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setUserData(localStorageService.getUser());

                await newsApiService.getAllNews().then((res) => {
                    console.log(res);
                    setNewsList(res);
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
                                <BarsOutlined />
                                <span>Tin tức</span>
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
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {userData.role == "isAdmin" ?
                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo tin tức</Button> : null}
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table scroll={{ x: true }}
                            columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={newsList} />
                    </div>
                </div>

                <Modal
                    title="Tạo tin tức mới"
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
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={800}
                >
                    <Spin spinning={loading}>
                        <Form
                            form={form}
                            name="eventCreate"
                            layout="vertical"
                            initialValues={{
                                residence: ['zhejiang', 'hangzhou', 'xihu'],
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your sender name!',
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

                                <SunEditor
                                    lang="en"
                                    placeholder="Content"
                                    onChange={handleChange}
                                    setContents={description}
                                    setOptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],

                                            ["table", "horizontalRule", "link", "image", "video"],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            ["preview", "print"],
                                            ["removeFormat"]

                                            // ['save', 'template'],
                                            // '/', Line break
                                        ],
                                        fontSize: [
                                            8, 10, 14, 18, 24,
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        defaultTag: "div",
                                        minHeight: "300px",
                                        showPathLabel: false,
                                        attributesWhitelist: {
                                            all: "style",
                                            table: "cellpadding|width|cellspacing|height|style",
                                            tr: "valign|style",
                                            td: "styleinsert|height|style",
                                            img: "title|alt|src|style"
                                        }
                                    }}
                                />
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

                        </Form>

                    </Spin>
                </Modal>


                <Modal
                    title="Ch���nh sửa tin tức"
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
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Spin spinning={loading}>
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
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your sender name!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                style={{ marginBottom: 10 }}
                            >

                                <SunEditor
                                    lang="en"
                                    placeholder="Content"
                                    onChange={handleChange}
                                    setContents={description}
                                    setOptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],

                                            ["table", "horizontalRule", "link", "image", "video"],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            ["preview", "print"],
                                            ["removeFormat"]

                                            // ['save', 'template'],
                                            // '/', Line break
                                        ],
                                        fontSize: [
                                            8, 10, 14, 18, 24,
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        defaultTag: "div",
                                        minHeight: "300px",
                                        showPathLabel: false,
                                        attributesWhitelist: {
                                            all: "style",
                                            table: "cellpadding|width|cellspacing|height|style",
                                            tr: "valign|style",
                                            td: "styleinsert|height|style",
                                            img: "title|alt|src|style"
                                        }
                                    }}
                                />
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
                        </Form>

                    </Spin>
                </Modal>

                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={total} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default NewsList;