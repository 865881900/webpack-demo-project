import React from 'react';
import ReactDOM from "react-dom";
import './index.css'
import('./index2.css')

import add from 'my-add-test';


class ReactDemo extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      DynamicComponent: null
    }
    console.log('add', add);
  }

  getDynamicComponent() {
    import('./DynamicComponent.js').then((DynamicComponent) => {

      console.log('DynamicComponent', DynamicComponent.default);
      this.setState({
        'DynamicComponent': DynamicComponent.default
      })
    })
  }

  render() {
    const {DynamicComponent} = this.state;
    return <div className={'react-class'}>
      <span >这是react Demo</span>
      <button onClick={this.getDynamicComponent.bind(this)}  className="dynamic">按钮2</button>
      {
        DynamicComponent ? <DynamicComponent/> : null
      }
    </div>
  }
}

ReactDOM.render(<ReactDemo/>, document.getElementById('root'))

