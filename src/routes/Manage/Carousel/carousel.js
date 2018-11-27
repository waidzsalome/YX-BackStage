import React, { Component } from 'react'
import { Upload, Icon, Modal, Button, Form, InputNumber, Input, Popconfirm, Table } from 'antd'
import styles from '../../../routes/Manage/Carousel/carousel.less'

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

@Form.create()

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  render () {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props
    return (
      <EditableContext.Consumer>
        {(form) => {
          const {getFieldDecorator} = form
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{margin: 0}}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}
@Form.create()
class Carousel extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      data: [{
        key: '0',
        title: 'Edward King 0',
        // img_url: '32',
        cmd: 'London, Park Lane no. 0',
      }, {
        key: '1',
        title: 'Edward King 1',
        // img_url: '32',
        cmd: 'London, Park Lane no. 1',
      }],
      editingKey: '',
      count: 2,
      num: 2
    }

    this.columns = [
      {
        title: 'title',
        dataIndex: 'title',
        width: '20%',
        editable: true,
      },
      {
        title: 'img_url',
        dataIndex: 'img_url',
        width: '25%',
        editable: false,
        render: (text, record) => {
          const editable = this.isEditing(record)
          return(
            <Upload
              name="logo"
              action="/upload.do"
              listType="picture"
              onPreview={this.handlePreview}
            >
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )
        }
      },
      {
        title: 'cmd',
        dataIndex: 'cmd',
        width: '35%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record)
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)}>Edit</a>
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;
              {this.state.data.length >= 1
              ? (
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <a href="javascript:;">Delete</a>
                  </Popconfirm>
                ) : null
              }
            </div>
          )
        },
      },
    ]
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey
  }

  edit (key) {
    this.setState({editingKey: key})
  }

  save (form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...this.state.data]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        this.setState({data: newData, editingKey: ''})
      } else {
        newData.push(row)
        this.setState({data: newData, editingKey: ''})
      }
    })
  }

  cancel = () => {
    this.setState({editingKey: ''})
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({fileList}) => this.setState({fileList})

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleMCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleDelete = (key) => {
    const { num } = this.state;
    const dataSource = [...this.state.data];
    this.setState({
      data: dataSource.filter(item => item.key !== key),
      num: num - 1
    });
    console.log('count', this.state.count)
  }

  handleAdd = () => {
    const { count, data, num } = this.state;
    const newData = {
      key: count,
      title: `Edward King ${count}`,
      img_url: 32,
      cmd: `London, Park Lane no. ${count}`,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
      num: num + 1
    });
    console.log('data',count)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  handleSelectChange = (value) => {
    console.log(value)
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  }

  render () {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const {previewVisible, previewImage, fileList} = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    )

    const addButton =(
      <div className={styles.addButton}>
      <Button onClick={this.handleAdd} type="primary" className={styles.addButton}>
        Add a row
      </Button>
      </div>
    )

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const {getFieldDecorator} = this.props.form

    return (
      <div className="clearfix">
        <div className={styles.settings}>
          <Button type="primary" onClick={this.showModal}>
            <Icon type="setting" />
          </Button>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleMCancel}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label="Note"
                labelCol={{span: 5}}
                wrapperCol={{span: 12}}
              >
                {getFieldDecorator('note', {
                  rules: [{required: true, message: 'Please input your note!'}],
                })(
                  <InputNumber />
                )}
              </FormItem>
              <FormItem
                wrapperCol={{span: 12, offset: 5}}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormItem>
            </Form>

          </Modal>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage} />
        </Modal>
        <br/>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />

        {this.state.num >= 5 ? null : addButton}

      </div>
    )
  }
}

export default Carousel
