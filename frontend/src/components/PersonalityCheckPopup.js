import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Popconfirm, Button } from 'antd';

class PersonalityCheckPopup extends Component {
  state = {
    visible: false,
  };

  render() {
    return (
      <div className="PersonalityCheckPopup">
        <Popconfirm
          title="Personality check for better recommendation."
          visible={this.state.visible}
          onConfirm={() => this.props.history.push('/')}
          onCancel={() => this.props.history.push('/')}
        >
          <Button type="primary" onClick={() => this.setState({ visible: true })}>
            Next Step!
          </Button>
        </Popconfirm>
      </div>
    );
  };
};

export default withRouter(PersonalityCheckPopup);
