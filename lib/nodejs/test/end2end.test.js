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

module.exports = testCase({
  "Client should ping once": function (test) {
    var TEST_PORT = 9090;
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

    var connection = thrift.createConnection('localhost', TEST_PORT);
    var client = thrift.createClient(Calculator, connection);

    connection.on('error', function(err) {
      test.ok(false, err);
    });
    
    var work = new ttypes.Work({ op: ttypes.Operation.DIVIDE,
			         num1: 10,
			         num2: 2 });
    
    var counter = 0;

    client.ping(function(err) {
      if (err) {
        test.ok(false, err);
      } else {
        test.ok(true, "ping1 succeeded");
      }
      test.done();
    });
    
    test.expect(1);

    // Don't take more than 5 seconds.
    setTimeout(function () { 
      test.ok(false, "timed out");
      test.done();
    }, 5000);
  },
  "Client should ping twice": function (test) {
    var TEST_PORT = 9090;

    var connection = thrift.createConnection('localhost', TEST_PORT);
    var client = thrift.createClient(Calculator, connection);

    connection.on('error', function(err) {
      test.fail(err);
      console.error("Connection error", err);
    });
    
    var work = new ttypes.Work({ op: ttypes.Operation.DIVIDE,
			         num1: 10,
			         num2: 2 });

    var counter = 0;
    function maybeDone () {
      counter++;
      if (counter == 2) {
        onDone()
      }
    }
    function onDone() {
      test.equal(2, ping_count);
      connection.end();
      test.done();
    }

    var ping_count = 0;
    client.ping(function(err) {
      if (err) {
        test.ok(false, err);
      } else {
        test.ok(true, "ping1 succeeded");
        ping_count++;
      }
      maybeDone();
    });
    
    client.ping(function(err) {
      if (err) {
        test.ok(false, err);
      } else {
        test(true, "ping2 succeeded");
        ping_count++;
      }
      maybeDone();
    });

    test.expect(3);

    // Don't take more than 5 seconds.
    setTimeout(function () {
      test.ok(false, "timed out");
      onDone();
    }, 5000);
  },
});
