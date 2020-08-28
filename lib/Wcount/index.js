'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CountUp = require('./lib/CountUp');

var _CountUp2 = _interopRequireDefault(_CountUp);

var _common = require('../common/common');

require('./index.scss');

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var prefix = 'cloud-wcount';

var checkKey = ['start', 'decimals', 'duration', 'useEasing', 'useGrouping', 'separator', 'decimal', 'placeholder'];
// 检查 a, b 两个对象中某些key是否有变化
function configChange(a, b) {
  return checkKey.some(function (key) {
    return a[key] !== b[key];
  });
}

/**
 * 数字切片函数
 *
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {number} clipNum 切片数
 * @param {number} slipScale 幅度数组
 *
 * @return {array} 切片后的数值数组
 * */
function clipValue(start, end, clipNum, slipScale) {
  var result = [];
  var delta = end - start;
  var step = delta / clipNum;

  // 循环次数为 clipNum - 1， 最后一次直接添加end，防止计算精度误差
  for (var i = 1; i < clipNum; i++) {
    if (slipScale[i]) {
      // 自定义切片
      result.push(start + slipScale[i] * delta);
    } else {
      // 平均切片
      result.push(start + step * i);
    }
  }

  result.push(end);

  return result;
}

var Wcount = function (_React$Component) {
  _inherits(Wcount, _React$Component);

  function Wcount(props) {
    _classCallCheck(this, Wcount);

    // 图表初始化时记录日志
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.dom = null;
    _this.countUp = null;
    _this.clipTimer = null;
    (0, _log2.default)('Wcount', 'init');
    return _this;
  }

  Wcount.prototype.componentDidMount = function componentDidMount() {
    if (!this.dom) {
      return;
    }

    this.createCountUp(this.props);
  };

  Wcount.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props = this.props,
        newEnd = _props.end,
        newOptions = _objectWithoutProperties(_props, ['end']);

    var oldEnd = prevProps.end,
        oldOptions = _objectWithoutProperties(prevProps, ['end']);

    // 大部分配置项如果改变了，直接生成新的实例


    if (configChange(newOptions, oldOptions)) {
      this.createCountUp(this.props);
    } else if (newEnd !== oldEnd && this.countUp) {
      // 如果只有 end 改变了，更新数据
      this.clipNumber(newOptions, newEnd);
    }
  };

  Wcount.prototype.componentWillUnmount = function componentWillUnmount() {
    // 清空定时器
    clearInterval(this.clipTimer);

    // 停止 countUp 组件
    if (this.countUp) {
      this.countUp.pauseResume();
    }
  };

  Wcount.prototype.clipNumber = function clipNumber(props, newEnd) {
    var _this2 = this;

    var clipNum = props.clipNum,
        clipPeriod = props.clipPeriod,
        slipScale = props.slipScale;

    // 清空定时器

    clearInterval(this.clipTimer);

    if (clipNum > 1) {
      // 切片
      // 生成切片列表，每个周期更新一次
      var clipArray = clipValue(this.countUp.endVal, newEnd, clipNum, slipScale);
      var loopIndex = 0;
      // 定时更新
      this.clipTimer = setInterval(function () {
        _this2.countUp && _this2.countUp.update(clipArray[loopIndex]);

        loopIndex += 1;
        // 已更新完切片列表，清空定时器
        if (loopIndex >= clipArray.length) {
          clearInterval(_this2.clipTimer);
        }
      }, clipPeriod * 1000);
    } else {
      // 直接更新
      this.countUp.update(newEnd);
    }
  };

  Wcount.prototype.createCountUp = function createCountUp(props) {
    var start = props.start,
        end = props.end,
        decimals = props.decimals,
        duration = props.duration,
        options = _objectWithoutProperties(props, ['start', 'end', 'decimals', 'duration']);

    var countUp = new _CountUp2.default(this.dom, start, end, decimals, duration, options);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }

    this.countUp = countUp;
  };

  Wcount.prototype.render = function render() {
    var _classNames,
        _this3 = this;

    var _props2 = this.props,
        className = _props2.className,
        otherProps = _objectWithoutProperties(_props2, ['className']);

    var mainClasses = (0, _classnames2.default)((_classNames = {
      'cloud-charts': true
    }, _classNames[prefix] = true, _classNames[className] = !!className, _classNames));

    return _react2.default.createElement('span', _extends({ ref: function ref(s) {
        return _this3.dom = s;
      }, className: mainClasses }, (0, _common.filterKey)(otherProps, checkKey.concat(['end', 'clipNum', 'clipPeriod', 'slipScale']))));
  };

  return Wcount;
}(_react2.default.Component);

Wcount.displayName = 'Wcount';
Wcount.defaultProps = {
  // 切片配置
  clipNum: 1,
  clipPeriod: 5,
  slipScale: [],
  // countUp 配置
  // 常用
  start: 0,
  end: 0,
  decimals: 0,
  duration: 1.5,
  // 额外配置
  useEasing: true, // toggle easing
  useGrouping: true, // 1,000,000 vs 1000000
  separator: ',', // character to use as a separator
  decimal: '.', // character to use as a decimal
  placeholder: "-" // 非数据时的替换
};
Wcount.displayName = 'Wcount';
exports.default = Wcount;


Wcount.propTypes = {
  clipNum: _propTypes2.default.number,
  clipPeriod: _propTypes2.default.number,
  slipScale: _propTypes2.default.arrayOf(_propTypes2.default.number),
  start: _propTypes2.default.number,
  end: _propTypes2.default.number,
  decimals: _propTypes2.default.number,
  duration: _propTypes2.default.number,
  useEasing: _propTypes2.default.bool,
  useGrouping: _propTypes2.default.bool,
  separator: _propTypes2.default.string,
  decimal: _propTypes2.default.string,
  placeholder: _propTypes2.default.string
};