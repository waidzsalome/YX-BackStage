import React, { Component } from 'react'
import { Form, Input, Icon, Checkbox, Button } from 'antd'
import axios from 'axios'
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
export default class HomePage extends Component{

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values) => {
      if(!err){
        console.log('Received values of form',values);
      }
      else{
        const body = {
          ...values,
          password: values.password
        }
        axios({
          method: 'POST',
          url: '/',
          date: body
        }).then(data => {
          console.log('success')
          localStorage.setItem("token",data.data);
        }).catch(err => {
          console.log(err,'error message', err.message)
        })
      }
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className={styles['login-form']}>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className={styles['login-form-forgot']} href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className={styles['login-form-button']}>
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }

}
