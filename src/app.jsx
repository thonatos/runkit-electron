import React, { Component } from 'react';
import Resizable from 're-resizable';
import { ipcRenderer } from 'electron';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: `const a = 'b';`,
      result: '',
    };
  }

  componentDidMount() {
    // console.log(ipcRenderer.sendSync('synchronous-message', 'ping'));
    ipcRenderer.on('async-result', (event, arg) => {
      console.log(arg);
      const _result = this.state.result;
      const result = _result ? _result + '\n\n' + String(arg) : String(arg);
      this.setState({
        result,
      });
    });
  }

  handleRun() {
    ipcRenderer.send('async-code', this.state.code);
  }

  handleClear() {
    this.setState({
      result: '',
    });
  }

  handleCodeChange(editor, data, value) {
    console.log(value);
    this.setState({
      code: value,
    });
  }

  render() {
    const onRun = this.handleRun.bind(this);
    const onClear = this.handleClear.bind(this);
    const onCodeChange = this.handleCodeChange.bind(this);

    return (
      <div className="wrap">
        <div className="header">
          <img src="logo.svg" className="logo" alt="" />

          <div className="actions">
            <a className="btn clear" onClick={onClear}>
              CLEAR
            </a>

            <a className="btn run" onClick={onRun}>
              RUN
            </a>
          </div>
        </div>
        <div className="main">
          <Resizable defaultSize={{ width: '50%' }}>
            <CodeMirror
              className="editor"
              value={this.state.code}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                tabSize: 2,
              }}
              onChange={onCodeChange}
            />
          </Resizable>

          <CodeMirror
            className="preview"
            value={this.state.result}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true,
              readOnly: true,
            }}
          />
        </div>
      </div>
    );
  }
}
