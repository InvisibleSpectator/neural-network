class Network {
  constructor(layers, inputCounts, outputCounts) {
    this.network = [];
    for (let i = 0; i < layers.length; i++) {
      const layer = [];
      for (let j = 0; j < layers[i]; j++) {
        const neuron = [];
        for (let k = 0; k <= (i === 0 ? inputCounts : layers[i - 1]); k++)
          neuron.push(Math.random());
        layer.push(neuron);
      }
      this.network.push(layer);
    }
    const layer = [];
    for (let j = 0; j < outputCounts; j++) {
      const neuron = [];
      for (let k = 0; k <= this.network[this.network.length - 1].length; k++)
        neuron.push(Math.random());
      layer.push(neuron);
    }
    this.network.push(layer);
  }

  activationFunction(x) {
    return 1 / (1 + Math.exp(-x));
  }

  derivative(x) {
    return this.activationFunction(x) * (1 - this.activationFunction(x));
  }

  getResponse(input) {
    let sums = this.network.reduce((prev, layer) => {
      let addedBias = [1];
      addedBias = addedBias.concat(prev);
      let output = layer.map((neuron) =>
        this.activationFunction(
          neuron
            .map((weight, i) => weight * addedBias[i])
            .reduce((acc, mult) => acc + mult, 0)
        )
      );
      return output;
    }, input);
    return sums;
  }

  backward(input) {
    let deltas = [];
    deltas.push(
      input.subs.map(
        (e, i) => input.derivatives[input.derivatives.length - 1][i] * e
      )
    );
    for (let index = this.network.length - 2; index >= 0; index--) {
      deltas.push(
        this.network[index].map((neuron, i) =>
          this.network[index + 1]
            .map((nextLayerNeuron) => nextLayerNeuron[i + 1])
            .reduce(
              (acc, weigth, n) => acc + deltas[deltas.length - 1][n] * weigth,
              0
            )
        )
      );
    }
    deltas.reverse();
    input.deltas = deltas;
    return input;
  }

  forvard(input) {
    const tecnicalTable = {
      intermediateCalculations: [],
      weightedSums: [],
      derivatives: [],
    };
    tecnicalTable.intermediateCalculations.push(input.slice());
    this.network.forEach((layer, i) => {
      tecnicalTable.intermediateCalculations[i].unshift(1);
      const sums = layer.map((neuron, j) =>
        neuron.reduce(
          (acc, weight, k) =>
            tecnicalTable.intermediateCalculations[i][k] * weight + acc,
          0
        )
      );
      const values = sums.map((e) => this.activationFunction(e));
      const derivatives = sums.map((e) => this.derivative(e));
      tecnicalTable.derivatives.push(derivatives);
      tecnicalTable.intermediateCalculations.push(values);
    });
    return tecnicalTable;
  }

  calcWeigth(techData, coeff) {
    let tmp = this.network.slice();
    this.network.forEach((layer, i) =>
      layer.forEach((neuron, j) =>
        neuron.forEach((weigth, k) => {
          tmp[i][j][k] =
            weigth -
            coeff *
              techData.deltas[i][j] *
              techData.intermediateCalculations[i][k];
        })
      )
    );
    this.network = tmp;
  }

  train(trainSequence, trainCoeff, iterations, dataReturnCallback = () => {}) {
    let iter = 0;
    let error = 0;
    do {
      error = 0;
      trainSequence.forEach((trainSample) => {
        const forward = this.forvard(trainSample[0]);
        forward.subs = trainSample[1].map((e, i) => {
          return (
            forward.intermediateCalculations[
              forward.intermediateCalculations.length - 1
            ][i] - e
          );
        });

        let back = this.backward(forward);
        this.calcWeigth(back, trainCoeff);
        error += forward.subs.reduce((acc, e) => acc + e ** 2, 0);
      });
      error /= 2;
      iter++;
      dataReturnCallback(iter, error);
      
    } while (iter < iterations && error > 0.0001);
  }
}

export default Network;
