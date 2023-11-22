export interface MapRangeOptions {
  inputValue: number;
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
}

export const mapRange = (options: MapRangeOptions) => {
  const {inputValue, inputMin, inputMax, outputMin, outputMax} = options;

  const outputValue =
    ((inputValue - inputMin) / (inputMax - inputMin)) *
      (outputMax - outputMin) +
    outputMin;

  if (outputValue === Infinity) {
    return 0;
  }

  return outputValue;
};
