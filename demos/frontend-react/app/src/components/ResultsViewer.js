import React, { Component } from 'react';
import Rnd from 'react-rnd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ResultsViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 'visible',
      width: 600,
      height: 600,
      x: 1200,
      y: 20
    };
  }

  convertToPublic(pathToConvert) {
    if (pathToConvert === null)
      return pathToConvert;

    // Hack: make all local path pulic
    var localDir = '//filesrv.speag.com/outbox/'
    var publicDir = 'https://outbox.zurichmedtech.com/maiz/';

    var pathConverted = pathToConvert.replace(localDir, publicDir);
    return pathConverted;
  }

  convertOutputToImage(filePath) {
    return (<img style={{height: '100%', width: '100%', objectFit: 'contain'}}
      src={this.convertToPublic(filePath)}
    />)
  }

  convertOutputToHtml(filePath) {
    let htmlCode = "";

    if (!filePath)
      return htmlCode;

    let ext = filePath.split('.').pop();
    switch (ext) {
      case 'png':
        htmlCode = this.convertOutputToImage(filePath);
        break;
      default:
        htmlCode = "";
        break;
    }
    return htmlCode;
  }

  render() {
    return (
      <div className="ResultsViewer">
        <Rnd
          style = {{
            color: this.props.color,
            backgroundColor: this.props.backgroundColor,
            borderStyle: 'solid',
            opacity: .85
          }}
          visibility = {this.state.visible}
          size = {{ width: this.state.width,  height: this.state.height }}
          position = {{ x: this.state.x, y: this.state.y }}
          onDragStop = {(e, d) => { this.setState({ x: d.x, y: d.y }) }}
          onResize = {(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position,
            });
          }}
        >
          <h4 style={{textAlign: 'center'}}>Results Viewer</h4>
          <hr style={{marginTop: '0px', marginBottom: '0px'}} />
          <div style={{backgroundColor: this.props.backgroundColor}}>
            {this.convertOutputToHtml(this.props.showOutputDataReducer)}
          </div>
        </Rnd>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    showOutputDataReducer: state.showOutputDataReducer,
  };
}

export default connect(mapStateToProps, null)(ResultsViewer);
