import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../store/actions/index';
import { withRouter } from 'react-router-dom';
import { Button, Pagination } from 'antd';
import SuggestItem from '../components/suggest/SuggestItem';

import './Suggestion.css';

class Suggestion extends Component {
  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.onGetSuggest();
  }

  onPageHandler(pageNumber) {
    this.setState({ ...this.state, page: pageNumber });
  }

  render() {
    const suggests = this.props.suggest.map((suggest) => {
      return (
        <div key={ suggest.id }>
          <SuggestItem suggest={ suggest }/>
          <br/>
        </div>
      );
    });

    return (
      <>
        <h2 className="suggestTitle">Suggestion</h2>
        <div className="suggestList">
          <Button
            className="newSuggestButton"
            onClick={() => this.props.history.push('/suggest/create')}
          >
            New Suggestion
          </Button>
          { suggests.length === 0 ?
            <div className='empty'>No suggests</div> :
            <div className='suggest'>
              { suggests }
              <Pagination
                total={ this.props.suggest.length }
                defaultPageSize={ 3 }
                onChange={ (pageNumber) => this.onPageHandler(pageNumber) }
              />
            </div>
          }
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    suggest: state.suggest.suggest,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetSuggest: () =>
      dispatch(actionCreators.getSuggest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Suggestion));
