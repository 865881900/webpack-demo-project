import React from 'react';
import './index.scss';


class SsrSearch extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div className="class1">
        <div>search页面</div>
      </div>
    );
  }
}

export const SSRSearch = <SsrSearch/>
