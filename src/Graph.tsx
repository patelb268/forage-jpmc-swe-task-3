import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      abc_price: 'float',
      def_price: 'float',
      stock_ratio: 'float',
      timestamp: 'date',
      stock_upper_bound: 'float',
      stock_lower_bound: 'float',
      trigger_alert: 'float',

    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock_ratio"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '[abc_price, def_price, stock_upper_bound, stock_lower_bound, trigger_alert]');
      elem.setAttribute('aggregates', JSON.stringify({
        abc_price: 'avg',
        def_price: 'avg',
        stock_ratio: 'avg',
        timestamp: 'distinct count',
        stock_upper_bound: 'avg',
        stock_lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
