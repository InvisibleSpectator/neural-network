import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Network from "./Network";

import test from "./digits.json";

class GUI extends React.Component {
  constructor() {
    super();
    this.state = { errors: [], network: new Network([133], 256, 10) };
    console.log(this.state.network);
  }

  updateErrors = (graph) => {
    this.setState({
      errors: graph,
    });
  };

  render = () => (
    <>
      <button
        onClick={() => {
          this.state.network.train(test, 0.9, 10000, this.updateErrors, 0.5);
        }}
      >
        Учить
      </button>
      <LineChart width={400} height={400} data={this.state.errors}>
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={false}
        />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
}

export default GUI;
