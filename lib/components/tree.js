'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tree = function (_React$Component) {
    (0, _inherits3.default)(Tree, _React$Component);

    function Tree() {
        (0, _classCallCheck3.default)(this, Tree);
        return (0, _possibleConstructorReturn3.default)(this, (Tree.__proto__ || (0, _getPrototypeOf2.default)(Tree)).apply(this, arguments));
    }

    (0, _createClass3.default)(Tree, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                animations = _props.animations,
                decorators = _props.decorators,
                data = _props.data,
                onToggle = _props.onToggle,
                onSelect = _props.onSelect,
                style = _props.style,
                event = _props.event,
                treeRef = _props.treeRef,
                onDrop = _props.onDrop;
            var tree = style.tree;


            return _react2.default.createElement(
                'ul',
                { style: tree ? tree.base : style.subtree,
                    ref: treeRef },
                data.map(function (node, index) {
                    return _react2.default.createElement(_node2.default, (0, _extends3.default)({}, event, {
                        animations: animations,
                        decorators: decorators,
                        key: node.id || index,
                        node: node,
                        onToggle: onToggle,
                        onSelect: onSelect,
                        onDrop: onDrop,
                        style: tree ? tree.node : style }));
                })
            );
        }
    }]);
    return Tree;
}(_react2.default.Component);

Tree.propTypes = {
    style: _propTypes2.default.object.isRequired,
    data: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,
    decorators: _propTypes2.default.object.isRequired,
    animations: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool]).isRequired,
    onToggle: _propTypes2.default.func,
    onSelect: _propTypes2.default.func,
    event: _propTypes2.default.object,
    treeRef: _propTypes2.default.func.isRequired,
    onDrop: _propTypes2.default.func
};

exports.default = Tree;