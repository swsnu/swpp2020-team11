import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { withRouter } from 'react-router-dom';
import { Button, Pagination } from 'antd';
import SuggestItem from '../components/suggest/SuggestItem';

class Suggest extends Component {
  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.onGetSuggests();
  }

  onPageHandler(pageNumber) {
    this.setState({ ...this.state, page: pageNumber });
  }

  render() {
    const suggests = this.props.suggests.map((suggest) => {
      return (
        <div key={ suggest.id }>
          <SuggestItem suggest={ suggest }/>
          <br/>
        </div>
      );
    });
    return (
      <>
        <Button>New Suggestion</Button>
        { suggests.length === 0 ?
          <div className='empty'>No suggests</div> :
          <div className='suggest'>
            <h2>Suggests</h2>
            { suggests }
            <Pagination
              total={ this.props.suggests.length }
              defaultPageSize={ 3 }
              onChange={ (pageNumber) => this.onPageHandler(pageNumber) }
            />
          </div>
        }

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    suggests: state.plan.suggests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetSuggests: () =>
      dispatch(actionCreators.getSuggests()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Suggest));
