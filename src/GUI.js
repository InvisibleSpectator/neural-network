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

import test from "./sample.json";

class GUI extends React.Component {
  constructor() {
    super();
    this.state = { errors: [], network: new Network([2, 2, 4], 4, 3) };
    console.log(this.state.network)
  }

  updateErrors = (iter, error) => {
    this.setState((state) => ({
      errors: state.errors.concat([{ x: iter, y: error }]),
    }));
  };

  render = () => (
    <>
      <button
        onClick={() => {
          this.state.network.train(test, 0.3, 1000, this.updateErrors);
          console.log(this.state.network.getResponse([6.7, 3.1, 4.7, 1.5]))
        }}
      >
        Учить
      </button>
      <LineChart width={400} height={400} data={this.state.errors}>
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
}

export default GUI;
