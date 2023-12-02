import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { LockFilled, } from '@ant-design/icons';
import "./style.css"
import { changePasswordAPI } from '../../../services/account';
const ChangePassword = () => {
	const [form] = Form.useForm();

    //change password success
    const handleSubmit = async (value) => {
        const result = await changePasswordAPI(value.passwordOld, value.passwordNew);
        if (!result) {
            message.error("your old password is not correct");
            return;
        }
        message.success("Change passworđ success!");
        form.resetFields();
    };
    //btn cancle
    const handleCancle = () => {
        form.resetFields();
    }
    //Check password new and pass old
    const validatePassword = (_, value) => {
        const passwordFieldValue = form.getFieldValue('passwordOld');
        if (!value || passwordFieldValue !== value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("New password must be different from old password"));
    }
    //Check paswordnew and paswoedconfirm
    const validateConfirmPassword = (_, value) => {
        const password = form.getFieldValue('passwordNew');
        if (!value || password === value) {
            return Promise.resolve();
        }
        return Promise.reject('The two passwords that you entered does not match.');
    }
    return (
        <div className="flex flex-col justify-center items-start h-auto change-password">
            <Typography.Title className="my-5 text-center">Change Password</Typography.Title>
            <Form className="shadow-md p-8 rounded-lg mb-100 password-form" form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="passwordOld"
                    label="Old Password"
                    rules={[{ required: true, message: "Please enter old password" },
                    {
                        min: 6,
                        message: 'Password must be at least 6 characters',
                    },
                    {
                        max: 50,
                        message: 'Password cannot be longer than 50 characters',
                    },
                    ]}
                >
                    <Input.Password prefix={<LockFilled className="site-form-item-icon" />} />
                </Form.Item>

				<Form.Item
					name="passwordNew"
					label="New Password"
					rules={[
						{ required: true, message: "Please enter new password" },
						{
							min: 6,
							message: 'Password must be at least 6 characters',
						},
						{
							max: 50,
							message: 'Password cannot be longer than 50 characters',
						},
						{ validator: validatePassword }
					]}

				>
					<Input.Password
						prefix={<LockFilled className="site-form-item-icon" />} />
				</Form.Item>
				<Form.Item
					name="confirmPassword"
					label="Confirm Password"
					rules={[
						{ required: true, message: "Please enter confirm password" },
						{
							min: 6,
							message: 'Password must be at least 6 characters',
						},
						{
							max: 50,
							message: 'Password cannot be longer than 50 characters',
						},
						{ validator: validateConfirmPassword }]}
				>
					<Input.Password prefix={<LockFilled className="site-form-item-icon" />} />
				</Form.Item>
				<div className="wrap-btn actions">
					<Button className='edit-submit'
						// className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
						htmlType='submit' >
						Change Password
					</Button>
					<Button className='edit-submit'
						// className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" 
						onClick={handleCancle}>
						Cancel
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default ChangePassword;