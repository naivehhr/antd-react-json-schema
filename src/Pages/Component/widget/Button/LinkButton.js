import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';

class LinkButton extends Component {
  render() {
    return <Link to={ this.props.href }>
    			<Button type="primary">{ this.props.label }</Button>
    		</Link>;
  }
}

export default LinkButton;