import Display from './Display';
import Keypad from './Keypad';
import './Calculator.css';

export default function CalculatorView() {
  return (
    <div className="calculator-container elevation-2">
      <Display />
      <Keypad />
    </div>
  );
}
