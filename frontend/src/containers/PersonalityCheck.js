import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Space, Button, Modal, Alert } from 'antd';
import PersonalityQuestion from '../components/PersonalityQuestion';
import { history } from '../store/store';
import axios from 'axios';
import './PersonalityCheck.css';
import { connect } from 'react-redux';

class PersonalityCheck extends Component {
  state = {
    page: 1,
    maxPage: 1,
    questions: [],
    popUpVisible: false,
  }

  componentDidMount() {
    axios.get('api/user/personality_check/')
      .then((res) => {
        this.setState({
          questions: res.data.questions,
          answer: res.data.answer,
          maxPage: Math.ceil(res.data.questions.length / 5),
        });
      })
      .catch((err) => console.log(err));
  }

  onChangePage(diff) {
    const newPage = this.state.page + diff;
    this.setState({
      page: newPage,
    });
  };

  onClickSubmit() {
    const ans = Object.keys(this.props.answer);
    if (ans.length !== this.state.questions.length) {
      Modal.warning({ title: '모든 문항에 답해주세요.' });
    } else {
      this.setState({
        popUpVisible: true,
      });
    }
  };

  onClickYes() {
    axios.post('api/user/personality_check/', this.props.answer)
      .then((res) => {
        history.push('/');
      })
      .catch((err) => console.log(err));
  };

  onClickNo(diff) {
    this.setState({
      popUpVisible: false,
    });
  };

  onClose() {
    this.props.history.push('/');
  }
  render() {
    const questions = this.state.questions
      .slice(this.state.page * 5 - 5, this.state.page * 5)
      .map((item, idx) => {
        return (
          <div key={ idx }>
            <PersonalityQuestion idx={ item.id } question={ item.question }/>
          </div>
        );
      });
    if (this.state.answer) {
      return (
        <div>
          <Alert
            message="이미 답변을 하였습니다."
            description="답변을 수정하지 못합니다."
            type="error"
            closable
            onClose={()=>this.onClose()}
          />
        </div>
      );
    }
    return (
      <div className="personality-check-page">
        { questions }
        <Space className="page-button-wrapper" size={ 20 }>
          {
            this.state.page !== 1 &&
            <Button className="page-button prev-button" onClick={ () => this.onChangePage(-1) }>Prev</Button>
          }
          {
            this.state.page !== this.state.maxPage &&
            <Button type="primary" className="page-button next-button"
              onClick={ () => this.onChangePage(+1) }>Next</Button>
          }
          {
            this.state.page === this.state.maxPage &&
            <Button type="primary" className="page-button submit-button"
              onClick={ () => this.onClickSubmit() }>Submit</Button>
          }
        </Space>
        <Modal
          title="Do you want submit?"
          visible={ this.state.popUpVisible }
          closable={ true }
          okText="Yes"
          onOk={ () => this.onClickYes() }
          cancelText="No"
          onCancel={ () => this.onClickNo() }
        >
          <p>If you submit, you cant modify ever</p>
        </Modal>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    answer: state.account.personalityAnswer,
  };
};

export default connect(mapStateToProps, null)(withRouter(PersonalityCheck));
