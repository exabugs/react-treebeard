'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _velocityReact = require('velocity-react');

var _reactDnd = require('react-dnd');

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _ItemTypes = require('./ItemTypes');

var _ItemTypes2 = _interopRequireDefault(_ItemTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeNode = function (_React$Component) {
    (0, _inherits3.default)(TreeNode, _React$Component);

    function TreeNode() {
        (0, _classCallCheck3.default)(this, TreeNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TreeNode.__proto__ || (0, _getPrototypeOf2.default)(TreeNode)).call(this));

        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(TreeNode, [{
        key: 'onClick',
        value: function onClick() {
            var _props = this.props,
                node = _props.node,
                onToggle = _props.onToggle;
            var toggled = node.toggled;


            if (onToggle) {
                onToggle(node, !toggled);
            }
        }
    }, {
        key: 'animations',
        value: function animations() {
            var _props2 = this.props,
                animations = _props2.animations,
                node = _props2.node;


            if (animations === false) {
                return false;
            }

            var anim = (0, _assign2.default)({}, animations, node.animations);
            return {
                toggle: anim.toggle(this.props),
                drawer: anim.drawer(this.props)
            };
        }
    }, {
        key: 'decorators',
        value: function decorators() {
            // Merge Any Node Based Decorators Into The Pack
            var _props3 = this.props,
                decorators = _props3.decorators,
                node = _props3.node;

            var nodeDecorators = node.decorators || {};

            return (0, _assign2.default)({}, decorators, nodeDecorators);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props4 = this.props,
                style = _props4.style,
                connectDragSource = _props4.connectDragSource,
                connectDropTarget = _props4.connectDropTarget,
                canDrop = _props4.canDrop;

            var decorators = this.decorators();
            var animations = this.animations();

            return connectDropTarget(connectDragSource(_react2.default.createElement(
                'li',
                { ref: function ref(_ref) {
                        return _this2.topLevelRef = _ref;
                    },
                    style: (0, _assign2.default)({}, style.base, canDrop && style.canDrop) },
                this.renderHeader(decorators, animations),
                this.renderDrawer(decorators, animations)
            )));
        }
    }, {
        key: 'renderDrawer',
        value: function renderDrawer(decorators, animations) {
            var _this3 = this;

            var toggled = this.props.node.toggled;


            if (!animations && !toggled) {
                return null;
            } else if (!animations && toggled) {
                return this.renderChildren(decorators, animations);
            }

            var _animations$drawer = animations.drawer,
                animation = _animations$drawer.animation,
                duration = _animations$drawer.duration,
                restAnimationInfo = (0, _objectWithoutProperties3.default)(_animations$drawer, ['animation', 'duration']);

            return _react2.default.createElement(
                _velocityReact.VelocityTransitionGroup,
                (0, _extends3.default)({}, restAnimationInfo, {
                    ref: function ref(_ref2) {
                        return _this3.velocityRef = _ref2;
                    } }),
                toggled ? this.renderChildren(decorators, animations) : null
            );
        }
    }, {
        key: 'renderHeader',
        value: function renderHeader(decorators, animations) {
            var _props5 = this.props,
                node = _props5.node,
                style = _props5.style;


            return _react2.default.createElement(_header2.default, { animations: animations,
                decorators: decorators,
                node: (0, _assign2.default)({}, node),
                onClick: this.onClick,
                style: style });
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren(decorators) {
            var _this4 = this;

            var _props6 = this.props,
                node = _props6.node,
                props = (0, _objectWithoutProperties3.default)(_props6, ['node']);


            if (node.loading) {
                return this.renderLoading(decorators);
            }

            var children = node.children;
            if (!Array.isArray(children)) {
                children = children ? [children] : [];
            }

            return _react2.default.createElement(_tree2.default, (0, _extends3.default)({}, props, {
                event: this._eventBubbles(),
                treeRef: function treeRef(ref) {
                    return _this4.subtreeRef = ref;
                },
                data: children }));
        }
    }, {
        key: 'renderLoading',
        value: function renderLoading(decorators) {
            var style = this.props.style;


            return _react2.default.createElement(
                'ul',
                { style: style.subtree },
                _react2.default.createElement(
                    'li',
                    null,
                    _react2.default.createElement(decorators.Loading, { style: style.loading })
                )
            );
        }
    }, {
        key: '_eventBubbles',
        value: function _eventBubbles() {
            var onToggle = this.props.onToggle;


            return {
                onToggle: onToggle
            };
        }
    }]);
    return TreeNode;
}(_react2.default.Component);

TreeNode.propTypes = {
    style: _propTypes2.default.object.isRequired,
    node: _propTypes2.default.object.isRequired,
    decorators: _propTypes2.default.object.isRequired,
    animations: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool]).isRequired,
    onToggle: _propTypes2.default.func,
    connectDragSource: _propTypes2.default.func.isRequired,
    connectDropTarget: _propTypes2.default.func.isRequired,
    canDrop: _propTypes2.default.bool,
    onDrop: _propTypes2.default.func
};

var source = {
    canDrag: function canDrag(props) {
        return props.node.active;
    },
    beginDrag: function beginDrag(props) {
        return { props: props };
    }

    // endDrag(props, monitor, component) {
    //     // const { decoratedComponentInstance: { props } } = component;
    //     // const { id: droppedId, originalIndex, key } = monitor.getItem();
    //     const didDrop = monitor.didDrop();
    //     const item = monitor.getItem();
    //
    //     console.log('endDrag');
    //     console.log(props);
    //
    //     if (props.endDrag) {
    //         props.endDrag(didDrop, props, item);
    //     }
    // }

};

// Check path.
var startsWith = function startsWith(_a, _b) {
    var a = (_a || '') + '/';
    var b = (_b || '') + '/';
    return a.startsWith(b);
};

// Check name.
var findNode = function findNode(node, name) {
    return node.children.reduce(function (found, n) {
        return found || n.name === name && n;
    }, null);
};

// Check canDrop.
var checkDrop = function checkDrop(a, b) {
    return !startsWith(a.id, b.id) && !findNode(a, b.name);
};

var target = {
    canDrop: function canDrop(props, monitor) {
        var children = props.node.children !== undefined;
        var isOver = monitor.isOver({ shallow: true });
        var node = monitor.getItem().props.node;

        return children && isOver && checkDrop(props.node, node);
    },
    drop: function drop(props, monitor) {
        console.log('drop');
        console.log(props);
        var node = monitor.getItem().props.node;

        props.onDrop && props.onDrop(props.node, node);
    }

    // hover(props, monitor) {
    //     // const { tabKey } = monitor.getItem().props;
    //     // if (tabKey !== props.tabKey) {
    //     //   props.hover && props.hover(tabKey, props.tabKey);
    //     // }
    // }

};

TreeNode = (0, _reactDnd.DropTarget)(_ItemTypes2.default.TREE, target, function (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop()
    };
})(TreeNode);

TreeNode = (0, _reactDnd.DragSource)(_ItemTypes2.default.TREE, source, function (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
})(TreeNode);

exports.default = TreeNode;