License
=======

Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements. See the NOTICE file
distributed with this work for additional information
regarding copyright ownership. The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the
specific language governing permissions and limitations
under the License.

Thrift NodeJS Unit Tests
========================
This directory contains unit tests of the NodeJS implementation.

To run the unit tests in this directory,

    # Run make in the top-level thrift directory.
    # Then cd into 'lib/nodejs/test/' and run
    ../../../compiler/cpp/thrift --gen js:node -r tutorial.thrift
    NODE_PATH=../lib:../lib/thrift nodeunit *.test.js

TODOS
=====
- Add rules for building and running tests to `Makefile.am`.
- Much, much, much more coverage (unit tests).
- Test against backends from other languages.
