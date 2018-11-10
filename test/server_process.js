var assert = require('assert');
var child_process = require('child_process')
var http = require('http');

var SERVER_LAUNCH_WAIT_TIME = 5 * 1000;

describe('server process', function() {
  var server_proc = null;
  var server_exited = false;

  before(function() {
    this.timeout(SERVER_LAUNCH_WAIT_TIME + 1000);

    console.log("launching server...")
    server_proc = child_process.spawn('webpack-dev-server', ['--content-base', 'static', '--mode', 'development'], {
      cwd: '.',
      shell: '/bin/bash',
      detached: true
    });

    server_proc.on('exit', function(code, signal) {
      console.log("process terminated: " + server_proc.killed)
      server_exited = true;
      server_proc.removeAllListeners('exit');
      server_proc = null;
    });

    server_proc.unref();
    server_proc.unref();
    server_proc.unref();

    return (new Promise(function(done) {
      // @TODO Better way to detect server alive-ness than waiting?
      setTimeout(done, SERVER_LAUNCH_WAIT_TIME)
      console.log('process pid: ' + server_proc.pid)
    }));
  });

  after(function() {
    console.log("killing server...")
    console.log('SIGQUIT')
    server_proc.kill('SIGQUIT');
    console.log('SIGINT')
    server_proc.kill('SIGINT');
    console.log('SIGKILL')
    server_proc.kill('SIGKILL');
    console.log("server killed...")
  });

  it('should launch', function() {
    assert.equal(server_exited, false);
  });

  var urls = [
    '/',
    'js/index.bundle.js'
  ];

  urls.forEach(function(url) {

    it('should respond to request for "' + url + '"', function(done) {
      this.timeout(5000);

      http.get({
        hostname: 'localhost',
        port: 8080,
        path: '/'
      }, function(res) {
        var result_data = '';

        if(res.statusCode != 200) {
          throw new Error('Server response was not 200.');
        }

        res.on('data', function(data) { result_data += data });

        res.on('end', function() {
          if (result_data.length > 0) {
            done();
          } else {
            done(new Error("Server returned no data."));
          }
        });
      })

    });

  });

});
