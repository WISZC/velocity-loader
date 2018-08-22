const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const { Compile, parse } = require('velocityjs');

let watcher;

// resourcePath vm文件路径
const macros = (resourcePath, options) => {
  return {
    parse(filePath) {
      return this.include(filePath);
    },
    include(filePath) {
      //获取真实路径
      let absPath;
      if (options.basePath) {
        absPath = path.join(options.basePath, filePath);

      } else {
        absPath = path.resolve(path.dirname(resourcePath), filePath);
      }
      if (!fs.existsSync(absPath)) return "";
      watcher(absPath);
      return fs.readFileSync(absPath, "utf8");
    },
    springUrl(url){
      return url;
    },
  }
}



module.exports = function (source) {
  this.cacheable && this.cacheable();


  const options = _.defaults(loaderUtils.getOptions(this), {
    compileVm: true,
    compileEjs: false,
    removeComments: false
  })


  const filePath = this.resourcePath;
  // const fileName = path.basename(filePath).split('.')[0];
  // const fileDirPath = path.dirname(filePath);

  watcher = this.addDependency

  const content = new Compile(parse(source), {
    escape: false
  })
  .render(null, macros(filePath, options));

  return `module.exports = ${JSON.stringify(content)};`;
}
