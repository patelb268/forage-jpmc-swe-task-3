import { ServerRespond } from './DataStreamer';

export interface Row {
  abc_price: number,
  def_price: number,
  stock_ratio: number,
  timestamp: Date,
  stock_upper_bound: number,
  stock_lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const abc_price = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const def_price = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const stock_ratio = abc_price / def_price;
    const stock_upper_bound = 1 + 0.05;
    const stock_lower_bound = 1 - 0.05;
    return {
      abc_price,
      def_price,
      stock_ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      stock_upper_bound,
      stock_lower_bound,
      trigger_alert: (stock_ratio > stock_upper_bound || stock_ratio < stock_lower_bound) ? stock_ratio : undefined,
    };
  }
}
