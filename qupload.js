'use strict';

const fs = require('fs');
const pathlib = require('path');
const qiniu = require('qiniu');

const traversal = function (src, cb) {
  let queue = [];
  let stat = fs.statSync(src);
  if (stat.isFile()) {
    queue.push(cb(src));
  } else if (stat.isDirectory()) {
    for (let path of fs.readdirSync(src)) {
      queue.push(...traversal(pathlib.join(src, path), cb));
    }
  }
  return queue;
};

class Deployer {
  constructor(options) {
    this.options = {
      mac: null,
      accessKey: null,
      secretKey: null,
      dirsToRefresh: [],
      tokenOptions: {
        scope: null,
      },
      configOptions: {
        zone: null,
      },
      cover: false,
      refreshCdn: false,
    };
    Object.assign(this.options, options);

    this.options.mac = new qiniu.auth.digest.Mac(
      options.accessKey,
      options.secretKey
    );
    this.options.configOptions.zone = qiniu.zone[options.configOptions.zone];
  }

  createCdnManager(mac) {
    return new qiniu.cdn.CdnManager(mac);
  }

  createUploadToken(mac, putPolicyOptions) {
    return new qiniu.rs.PutPolicy(putPolicyOptions).uploadToken(mac);
  }

  createConfig(configOptions) {
    let config = new qiniu.conf.Config();
    return Object.assign(config, configOptions);
  }

  deploy(publicDir) {
    let that = this;
    return new Promise((resolve, reject) => {
      Promise.all(
        traversal(publicDir, (src) => {
          const key = pathlib.win32
            .relative(publicDir, src)
            .replace(/\\/g, '/');
          that.upload(src, key).then(() => {
            console.info('Uploaded: ' + key);
          });
          if (key.endsWith('index.html')) {
            const noIndex = key.substr(0, key.length - 10);
            if (noIndex == '') {
              that.upload(src, '/').then(() => {
                console.info('Uploaded: ' + '/');
              });
            } else {
              that.upload(src, noIndex).then(() => {
                console.info('Uploaded: ' + noIndex);
              });
              const noIndex2 = key.substr(0, key.length - 11);
              that.upload(src, noIndex2).then(() => {
                console.info('Uploaded: ' + noIndex2);
              });
              const noIndexWithFix = noIndex2 + '.html';
              that.upload(src, noIndexWithFix).then(() => {
                console.info('Uploaded: ' + noIndexWithFix);
              });
            }
          }
        })
      )
        .then(() => {
          console.info('Upload to qiniu finished!');
          if (that.options.refreshCdn) {
            that
              .createCdnManager(this.options.mac)
              .refreshDirs(
                that.options.dirsToRefresh,
                (respErr, respBody, respInfo) => {
                  if (respInfo.statusCode === 200) {
                    resolve(respErr, respBody, respInfo);
                  } else {
                    reject(respErr, respBody, respInfo);
                  }
                }
              );
          }
        })
        .catch((e) => {
          console.info('Upload to qiniu fail!', e || '');
        });
    })
      .then((data) => {
        console.info('Refresh qiniu finished!', data || '');
      })
      .catch((e) => {
        console.info('Refresh qiniu fail!', e || '');
      });
  }

  upload(src, key, tokenOptions, configOptions) {
    let uploadToken = this.createUploadToken(
      this.options.mac,
      Object.assign(
        {},
        this.options.tokenOptions,
        tokenOptions,
        this.options.cover
          ? { scope: this.options.tokenOptions.scope + ':' + key }
          : {}
      )
    );
    let formUploader = new qiniu.form_up.FormUploader(
      this.createConfig(
        Object.assign({}, this.options.configOptions, configOptions)
      )
    );
    let putExtra = new qiniu.form_up.PutExtra();
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        uploadToken,
        key,
        src,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respInfo.statusCode === 200) {
            resolve(respErr, respBody, respInfo);
          } else {
            reject(respErr, respBody, respInfo);
          }
        }
      );
    });
  }
}

const argv = process.argv.splice(2);
const args = {
  accessKey: argv[0],
  secretKey: argv[1],
  zone: argv[2], // 华东: Zone_z0, 华北: Zone_z1, 华南: Zone_z2, 北美: Zone_na0, 东南亚: Zone_as0
  scope: argv[3], // the name of bucket
  dirsToRefresh: argv[4], // example http://www.a.com/,http://www.b.cn/
  refreshCdn: argv[5], // default is true
  cover: argv[6], // default is true
  expires: argv[7], // default is 3600
};
if (
  !args.accessKey ||
  !args.secretKey ||
  !args.zone ||
  !args.scope ||
  !args.dirsToRefresh
) {
  console.error(`You should configure arguments like:\n
    node qupload.js <accessKey> <secretKey> <zone> <scope> <dirsToRefresh> [refreshCdn] [cover] [expires]\n`);
  return;
}

const deployer = new Deployer({
  accessKey: args.accessKey,
  secretKey: args.secretKey,
  dirsToRefresh: args.dirsToRefresh.split(','),
  tokenOptions: {
    scope: args.scope,
    expires: +args.expires || 3600,
  },
  configOptions: {
    zone: args.zone,
  },
  cover: args.cover != 'false',
  refreshCdn: args.refreshCdn != 'false',
});

const publicDir = 'public/';
deployer.deploy(publicDir);
