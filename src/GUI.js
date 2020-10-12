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

import train from "./seeds.json";
import test from "./test.json";

class GUI extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      speed: 0.5,
      momentum: 0,
      iterations: 1000,
      inputs: 1,
      outputs: 1,
      layers: [],
    };
    this.state.network = new Network(
      this.state.layers,
      this.state.inputs,
      this.state.outputs
    );
  }

  updateErrors = (graph) => {
    this.setState({
      errors: graph,
    });
  };

  setSpeed = (e) => {
    this.setState({ speed: e.target.value });
  };

  setMomentum = (e) => {
    this.setState({ momentum: +e.target.value });
  };

  setIterations = (e) => {
    this.setState({ iterations: e.target.value });
  };

  setInputs = (e) => {
    this.setState({ inputs: e.target.value });
  };

  setOutputs = (e) => {
    this.setState({ outputs: e.target.value });
  };

  generateNetwork = () => {
    this.setState({
      network: new Network(
        this.state.layers,
        this.state.inputs,
        this.state.outputs
      ),
    });
  };

  render = () => {
    let answer = [];
    let correctCount = test.reduce((acc, e, i) => {
      let response = this.state.network.getResponse(e[0]);
      answer.push(
        response.indexOf(Math.max.apply(null, response)) + " " + e[1].indexOf(1)
      );
      return acc + e[1][response.indexOf(Math.max.apply(null, response))];
    }, 0);
    return (
      <div style={{ display: "flex" }}>
        <div>
          <div>
            <label>
              Коэффициент обучения
              <input
                type="number"
                min="0.00000001"
                max="0.99999999"
                step="0.001"
                defaultValue={this.state.speed}
                onChange={this.setSpeed}
              />
            </label>
            <label>
              Момент
              <input
                type="number"
                min="0"
                max="1"
                step="0.001"
                defaultValue={this.state.momentum}
                onChange={this.setMomentum}
              />
            </label>
            <label>
              Итерации
              <input
                type="number"
                min="1"
                max="100000"
                step="1"
                defaultValue={this.state.iterations}
                onChange={this.setIterations}
              />
            </label>
            <button
              onClick={() => {
                this.state.network.train(
                  train,
                  this.state.speed,
                  this.state.iterations,
                  this.updateErrors,
                  this.state.momentum
                );
              }}
            >
              Учить
            </button>
          </div>
          <button onClick={this.generateNetwork}>Создать</button>
          <a
            href={URL.createObjectURL(
              new Blob(
                [
                  JSON.stringify({
                    inputs: this.state.inputs,
                    outputs: this.state.outputs,
                    layers: this.state.layers,
                    network: this.state.network.network,
                  }),
                ],
                {
                  type: "application/json",
                }
              )
            )}
            download="сеть.json"
          >
            <button>Отдай сеть</button>
          </a>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              let reader = new FileReader();
              reader.onload = () => {
                let text = JSON.parse(reader.result.replace(/\r?\n/g, ""));
                console.log(text);
                let newNetwork = new Network(
                  text.layers,
                  text.inputs,
                  text.outputs
                );
                newNetwork.network = text.network;
                this.setState({ ...text, network: newNetwork });
              };
              reader.readAsText(file);
              e.target.value = "";
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>
              Входов
              <input
                type="number"
                min="1"
                value={this.state.inputs}
                onChange={this.setInputs}
              />
            </label>

            <label>
              Выходов
              <input
                type="number"
                min="1"
                value={this.state.outputs}
                onChange={this.setOutputs}
              />
            </label>

            <label>
              Скрытых слоёв
              <input
                type="number"
                value={this.state.layers.length}
                min="0"
                onChange={(e) => {
                  let tmp = e.target.value;
                  this.setState({
                    layers: new Array(+tmp).fill(1),
                  });
                }}
              />
            </label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {this.state.layers.map((e, i) => (
                <input
                  type="number"
                  min="1"
                  value={e}
                  key={i}
                  onChange={(event) => {
                    const value = +event.target.value;
                    this.setState((state) => {
                      let tmp = state.layers;
                      tmp[i] = value;
                      return { layers: tmp };
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
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
          <div>
            <div> {correctCount}</div>
            {answer.map((e) => (
              <div>{e}</div>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

export default GUI;
