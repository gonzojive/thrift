/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var testCase = require('nodeunit').testCase;

var thrift = require('thrift'),
    Calculator = require('./gen-nodejs/Calculator.js');
    ttypes = require('./gen-nodejs/tutorial_types.js');

function setTestTimeLimitInternal(test, timeout_ms, is_done, timeout_callback) {
  var elapsed = 0;
  var interval = 100;
  function setTimeoutCallback () {
    if (is_done(test)) {
      return;
    }
    elapsed += interval;
    if (elapsed > timeout_ms) {
      timeout_callback();
    } else {
      setTimeout(setTimeoutCallback, interval);
    }
  }
  setTimeout(setTimeoutCallback, interval);
}

/**
  * Times out the test after a given amount of time, calling
  * timeout_callback upon such an event.
  */
function setTestTimeLimit(test, timeout_ms, timeout_callback) {
  var is_done = false;
  var done = test.done;
  test.done = function() {
    is_done = true;
    return done.apply(test, arguments);
  }
  setTestTimeLimitInternal(
    test,
    timeout_ms,
    function() { return is_done; },
    timeout_callback);
}

/*
// TODO: add thise code for using an available port.
var portfinder = require('portfinder');

portfinder.getPort(function (err, port) {
    //
    // `port` is guarenteed to be a free port 
    // in this scope.
    //
});
*/

var TEST_TIMEOUT = 4000; // 4 seconds
var TEST_PORT = 9091;

module.exports = testCase({
  "Client should ping server once": function (test) {
    test.expect(2);

    var server;
    var connection;
    function cleanup () {
      if (connection) {
        connection.end();
        connection = null;
      }
      if (server) {
        server.close();
        server = null;
      }
      test.done();
    }

    server = thrift.createServer(Calculator, {
      ping: function(result) {
        test.ok(true);
        result(null);
      },
    });

    server.listen(TEST_PORT, null, null, function(err) {
      connection = thrift.createConnection('localhost', TEST_PORT);
      var client = thrift.createClient(Calculator, connection);
      
      connection.on('error', function(err) {
        test.ok(false, err);
      });
      
      client.ping(function(err) {
        if (err) {
          test.ok(false, err);
        } else {
          test.ok(true);
        }
        cleanup();
      });      
    });

     
    // Don't take more than 5 seconds.
    setTestTimeLimit(test, TEST_TIMEOUT, function () { 
      test.ok(false, "timed out");
      cleanup();
    });
  },
  "Client should ping server twice": function (test) {
    test.expect(3);

    var server;
    var connection;
    function cleanup () {
      if (connection) {
        connection.end();
        connection = null;
      }
      if (server) {
        server.close();
        server = null;
      }
      test.done();
    }

    server = thrift.createServer(Calculator, {
      ping: function(result) {
        test.ok(true);
        result(null);
      },
    });

    server.listen(TEST_PORT, null, null, function(err) {
      connection = thrift.createConnection('localhost', TEST_PORT);
      var client = thrift.createClient(Calculator, connection);
      
      connection.on('error', function(err) {
        test.ok(false, err);
      });

      var ping_count = 0;

      client.ping(function(err) {
        if (err) {
          test.ok(false, err);
        } else {
          test.ok(true);
        }
        ping_count++;
        if (ping_count == 2) {
          cleanup();
        }
      });      
      client.ping(function(err) {
        if (err) {
          test.ok(false, err);
        } else {
          test.ok(true);
        }
        ping_count++;
        if (ping_count == 2) {
          cleanup();
        }
      });      
    });

     
    // Don't take more than 5 seconds.
    setTestTimeLimit(test, TEST_TIMEOUT, function () { 
      test.ok(false, "timed out");
      cleanup();
    });
  },
});
