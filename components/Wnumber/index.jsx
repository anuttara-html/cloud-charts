'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import Warrow from '../common/arrow';
import chartLog from "../common/log";
import './index.scss';

const prefix = 'cloud-wnumber';

function getTrendIcon(trend) {
  if(trend === 'raise'){
    return <Warrow type="up"/>
  }else if( trend === 'drop'){
    return <Warrow type="down"/>
  }
}

export default class Wnumber extends React.Component {
  static displayName = 'Wnumber';

  static defaultProps = {
    numberTrend: '',
    rightRatioTrend: '',
    status: ''
  };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wnumber', 'init');
  }

  renderBottom(bottomTitle) {
    if (!!bottomTitle) {
      return(
        <div className={`${prefix}-bottomTitle`}>{bottomTitle}</div>
      );
    }
  }

  renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, rightRatioStatus, trend, children) {
    const numberTrendIcon = getTrendIcon(numberTrend);
    const numberClasses = `${prefix}-number`;

    const rightRatioTrendIcon = getTrendIcon(rightRatioTrend);
    const rightRatioTrendClasses = `${prefix}-rightRatio ${rightRatioTrend} ${rightRatioStatus ? getStatusColorName(rightRatioStatus) : ''}`;

    return(
      <div className={`${prefix}-main ${numberTrend} ${status ? getStatusColorName(status) : ''}`}>
        {
          numberTrend &&
          <span className={`${prefix}-leftIcon`}>
            {numberTrendIcon}
          </span>
        }
        <span className={numberClasses}>
          {children}
        </span>
        {
          unit &&
          <span className={`${prefix}-unit`}>
            {unit}
          </span>
        }
        {
          rightTitle &&
          <span className={`${prefix}-rightTitle`}>
            {rightTitle}
          </span>
        }
        {
          rightRatio &&
          <span className={rightRatioTrendClasses}>
            {
              rightRatioTrend &&
              <span className={`${prefix}-rightRatioIcon`}>
                {rightRatioTrendIcon}
              </span>
            }
            {rightRatio}
          </span>
        }
        { trend &&
          <span className={`${prefix}-trend`}>
            {trend()}
          </span>
        }
      </div>
    );
  }

  render() {
    const {
      className, style,
      // main props
      status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, rightRatioStatus, trend, children,
      // bottom props
      bottomTitle,
      ...otherProps
    } = this.props;

    const mainClasses = classNames({
      'cloud-charts': true,
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={style} {...otherProps}>
        {this.renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, rightRatioStatus, trend, children)}
        {this.renderBottom(bottomTitle)}
      </div>
    );
  }
}

Wnumber.propTypes = {
  bottomTitle: PropTypes.node,
  unit: PropTypes.node,
  trend: PropTypes.func
};
