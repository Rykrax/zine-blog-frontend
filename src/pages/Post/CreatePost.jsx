import { Form, Input, Button, Card, Switch, Upload, message, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import axiosPublic from "../../utils/axiosPublic.jsx";
import { getCloudinarySignApi } from "../../routes/api.jsx";
import { postAPI } from "../../routes/post.api.jsx"
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreatePost = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const uploadToCloudinary = async (file) => {
        setUploading(true);
        setUploadPercent(0);

        const sign = await getCloudinarySignApi();
        // console.log(sign);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sign.apiKey);
        formData.append("timestamp", sign.timestamp);
        formData.append("signature", sign.signature);
        formData.append("folder", "upload-zine-blog");

        const res = await axiosPublic.post(
            `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
            formData,
            {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setUploadPercent(percent);
                }
            }
        );
        // console.log(res);
        setImageUrl(res.data.secure_url);
        setUploading(false);
    };

    const onFinish = async (values) => {
        if (!imageUrl) {
            message.warning("Ảnh chưa upload xong");
            return;
        }

        await postAPI.createPost({
            title: values.title,
            content: values.content,
            is_published: values.is_published,
            thumbnail: imageUrl
        });

        message.success("Đăng bài thành công!");
        navigate("/profile");
    };

    return (
        <Card title="Đăng bài viết mới" style={{ maxWidth: 800, margin: "auto" }}>
            <Form layout="vertical" onFinish={onFinish}>

                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: "Nhập tiêu đề" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Thumbnail"
                    name="thumbnail"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        const file = e?.fileList?.[0]?.originFileObj;
                        if (file) uploadToCloudinary(file);
                        return e?.fileList;
                    }}
                    rules={[{ required: true, message: "Chọn ảnh" }]}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>

                {uploading && <Progress percent={uploadPercent} />}

                <Form.Item
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: "Nhập nội dung" }]}
                >
                    <TextArea rows={6} />
                </Form.Item>

                <Form.Item
                    label="Công khai"
                    name="is_published"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={uploading || !imageUrl}
                >
                    Đăng bài
                </Button>
            </Form>
        </Card>
    );
};

export default CreatePost;
