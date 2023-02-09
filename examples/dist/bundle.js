;(function(modules) {

  function require(id) {
    const [fn, mapping] = modules[id];

    const module = {
      exports: {},
    }

    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }

    fn(localRequire, module, module.exports)

    return module.exports;
  }

  require(0);
})({
  
    0: [function(require, module, exports) {
      "use strict";

var _user = require("../public/user.json");

var _user2 = _interopRequireDefault(_user);

var _foo = require("./foo.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _foo.foo)();
console.log('main.js');
console.log(JSON.parse(_user2.default).name);
    }, {"../public/user.json":1,"./foo.js":2}],
  
    1: [function(require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\r\n  \"name\": \"ylg\",\r\n  \"age\": \"180\"\r\n}";
    }, {}],
  
    2: [function(require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

function foo() {
  console.log('foo');
  (0, _bar.bar)();
}
    }, {"./bar.js":3}],
  
    3: [function(require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('bar');
}
    }, {}],
  
})