import React from 'react';
import { PlusOutlined } from '@ant-design/icons';

import { Space, message, Button, Input, Modal, Upload, Form, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import Geocode from 'react-geocode';
import './SuggestionCreate.css';
import axios from 'axios';
import * as actionCreators from '../store/actions';
import { endsWithAny } from '../utils/strUtils';

Geocode.setApiKey(process.env.REACT_APP_API_KEY);

const { TextArea } = Input;

const formItemLayout = {};
const tailFormItemLayout = {};


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class SuggestionCreate extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    isModalVisible: false,
    isAddressSet: false,
    addressValidateState: false,
  };

  componentDidMount() {
    if (this.props.suggestDetail.hashedImageKey !== '') {
      const file = {
        uid: '1',
        name: this.props.suggestDetail.hashedImageKey,
        status: 'done',
        url: process.env.REACT_APP_S3_BUCKET_URL + this.props.suggestDetail.hashedImageKey,
      };
      this.setState({ ...this.state, fileList: [file], isAddressSet: true, addressValidateState: true });
    }
  }

  showModal() {
    this.setState({ ...this.state, isModalVisible: true });
  };

  handleCancelAddress() {
    this.setState({ ...this.state, isModalVisible: false });
  };

  handleCancelImagePreview() {
    this.setState({ ...this.state, previewVisible: false });
  };

  async handleUpload({ onSuccess, onError, file }) {
    if (file.size > 500000) {
      message.error('image size is too big. only under 50MB is allowed');
      onError();
      return;
    }
    if ( !endsWithAny(['.jpg', '.png', '.jpeg'], file.name)) {
      message.error('image type is not valid. only .jpg, .jpeg, .png is allowed');
      onError();
      return;
    }
    // const xhr = new XMLHttpRequest();
    axios.post('/api/suggest/image_upload_presigned_url/', { 'filename': file.name, 'file': file })
      .then((res) => {
        const { fields, url } = res.data;
        const formData = new FormData();
        const newImageKey = fields.key;
        Object.keys(fields).forEach((key) => {
          formData.append(key, fields[key]);
        });
        formData.append('file', file);
        axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((response) => {
            this.props.onChangeSuggest('hashedImageKey', newImageKey);
            onSuccess();
          })
          .catch((error) => {
            console.log(error);
            onError();
          });
      })
      .catch((err) => {
        console.log(err);
        onError();
      });
  };

  async handleComplete(data) {
    // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
    return Geocode.fromAddress(data.roadAddress)
      .then((res) => {
        this.setState({ ...this.state, isModalVisible: false, addressValidateState: true });
        this.props.onChangeSuggest('roadAddress', data.roadAddress);
        this.props.onChangeSuggest('location', res.results[0].geometry.location);
      });
  }

  async handlePreview(file) {
    if ( !file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange({ fileList }) {
    this.setState({ ...this.state, fileList: fileList });
  }

  handleSubmit(e) {
    this.setState({ ...this.state, isAddressSet: true });
    if (this.state.fileList.length === 0 ||
      this.state.fileList[0].status !== 'done') {
      message.error('please set proper image');
      return;
    }
    if (this.props.suggestDetail.roadAddress === '' ||
      this.props.suggestDetail.extraAddress === '' ||
      this.props.suggestDetail.tags === '' ||
      this.props.suggestDetail.name === '' ||
      this.props.suggestDetail.explanation === '') {
      return;
    }
    if (this.props.suggestDetail.id) {
      this.props.onPutSuggest(this.props.suggestDetail);
    } else {
      this.props.onCreateSuggest(this.props.suggestDetail);
    }
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div style={ { marginTop: 8 } }>Upload</div>
      </div>
    );
    return (
      <>
        <Row className="suggest-wrapper" align='top' justify='center' direction='horizontal'>
          <Col>
            <Upload
              className="uploadImage"
              listType="picture-card"
              fileList={ fileList }
              customRequest={ (e) => this.handleUpload(e) }
              onPreview={ (file) => this.handlePreview(file) }
              onChange={ (e) => this.handleChange(e) }
            >
              { fileList.length === 0 ? uploadButton : null }
            </Upload>
            <Modal
              className="preview-image-modal"
              visible={ previewVisible }
              title={ previewTitle }
              footer={ null }
              onCancel={ () => this.handleCancelImagePreview() }
            >
              <img alt="example" style={ { width: '100%' } } src={ previewImage }/>
            </Modal>
          </Col>
          <Col>
            <Form
              { ...formItemLayout }
              name="suggest-place"
              className="suggest-place-form"
              scrollToFirstError
            >
              <Form.Item
                { ...tailFormItemLayout }
                name="address"
                initialValue={ this.props.suggestDetail.roadAddress }
                validateStatus={ ( !this.state.isAddressSet || this.state.addressValidateState) ? 'success' : 'error' }
                help={ ( !this.state.isAddressSet || this.state.addressValidateState) ? null : 'Please set address!' }
              >
                <Space>
                  <Input
                    className="road-address"
                    placeholder="도로명 주소"
                    value={ this.props.suggestDetail.roadAddress }
                  />
                  <Button
                    className="road-address-button"
                    type="primary"
                    onClick={ () => this.showModal() }
                  >
                    우편번호 찾기
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item
                { ...tailFormItemLayout }
                name="addressDetail"
                initialValue={ this.props.suggestDetail.extraAddress }
                rules={ [{ required: true, message: 'Please set detail address!' }] }
              >
                <Input
                  className="extra-address"
                  placeholde="상세주소"
                  onChange={ (e) => this.props.onChangeSuggest('extraAddress', e.target.value) }
                  value={ this.props.suggestDetail.extraAddress }
                />
              </Form.Item>
              <Form.Item
                { ...tailFormItemLayout }
                name="name"
                initialValue={ this.props.suggestDetail.name }
                rules={ [{ required: true, message: 'Please write name!' }] }
              >
                <Input
                  className="name"
                  placeholder="이름"
                  onChange={ (e) => this.props.onChangeSuggest('name', e.target.value) }
                  value={ this.props.suggestDetail.name }
                />
              </Form.Item>
              <Form.Item
                { ...tailFormItemLayout }
                name="tags"
                initialValue={ this.props.suggestDetail.tags }
                rules={ [{ required: true, message: 'Please write tag at least one!' }] }
              >
                <Input
                  className="tags"
                  placeholder="태그 (하나 이상) ex) 조용한, 경치 좋은"
                  onChange={ (e) => this.props.onChangeSuggest('tags', e.target.value) }
                  value={ this.props.suggestDetail.tags }
                />
              </Form.Item>
              <Form.Item
                { ...tailFormItemLayout }
                name="explanation"
                initialValue={ this.props.suggestDetail.explanation }
                rules={ [{ required: true, message: 'Please write why this place is amazing' }] }
              >
                <TextArea
                  className="explanation"
                  placeholder="설명"
                  onChange={ (e) => this.props.onChangeSuggest('explanation', e.target.value) }
                  value={ this.props.suggestDetail.explanation }
                />
              </Form.Item>
              <Form.Item { ...tailFormItemLayout }>
                <Button
                  type="primary"
                  className="create-form-button"
                  htmlType="submit"
                  onClick={ (e) => this.handleSubmit(e) }
                >
                  제출하기
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Modal
          className='road-address-modal'
          visible={ this.state.isModalVisible }
          onCancel={ () => this.handleCancelAddress() }
          footer={ <></> }
        >
          <DaumPostcode
            onComplete={ (data) => this.handleComplete(data) }
          />
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    suggestDetail: state.suggest.suggestDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeSuggest: (key, value) => dispatch(actionCreators.changeSuggestionDetail(key, value)),
    onCreateSuggest: (data) => dispatch(actionCreators.createSuggestionDetail(data)),
    onPutSuggest: (data) => dispatch(actionCreators.putSuggestionDetail(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SuggestionCreate));
