import React from 'react';
import './index.scss';

class SsrHome extends React.Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div className="class1">
        <div>home页面</div>
      </div>
    );
  }
}

export const SSRHome = <SsrHome />;
