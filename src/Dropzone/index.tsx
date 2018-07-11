import * as React from 'react';
// import * as classNames from 'classnames';
import transformFiles from './transformFiles';

import styles from './styles.scss'

interface IProps {
  onDrop?: Function;
  onParseFiles: Function;
  style?: any;
  children?: any;
}

interface IState {
  over: boolean;
}

class Dropzone extends React.Component<IProps, IState> {
  private timeout: number;
  constructor(props: IProps) {
    super(props);

    this.state = {
      over: false,
    };
  }

  public handleDrop = async (e: React.DragEvent) => {
    if (this.props.onDrop) {
      this.props.onDrop();
    }
    e.preventDefault();
    e.persist();
    const folders = await transformFiles(e);
    if (e.dataTransfer.items) {
      e.dataTransfer.items.clear();
    } else {
      e.dataTransfer.clearData();
    }
    this.props.onParseFiles(folders);
  }

  public handleDrag = (over: boolean) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      this.setState({
        over,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public stop = (e: any) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.state.over === false) {
      this.setState({
        over: true,
      });
    }
    this.timeout = setTimeout(() => {
      this.setState({
        over: false,
      });
    }, 50);
    e.preventDefault();
  }

  public render() {
    console.log('over', this.state.over);
    const className = `${styles.container} ${this.state.over ? styles.over : ''}`;
    return (
      <div
        className={className}
        draggable={true}
        // onDragStart={this.handleDrag(true)}
        // onDragEnd={this.handleDrag(false)}
        onDrop={this.handleDrop}
        onDragOver={this.stop}
        style={this.props.style}
      >
        {this.props.children || (<span>Drop Images To Begin Training</span>)}
        <input
          className={styles.input}
          type="file"
          name="files[]"
          data-multiple-caption="{count} files selected"
          multiple={true}
        />
      </div>
    );
  }
};

export default Dropzone;
