var __engine = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/crypto-js/core.js
  var require_core = __commonJS({
    "node_modules/crypto-js/core.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define([], factory);
        } else {
          root.CryptoJS = factory();
        }
      })(exports, function() {
        var CryptoJS = CryptoJS || (function(Math2, undefined2) {
          var crypto;
          if (typeof window !== "undefined" && window.crypto) {
            crypto = window.crypto;
          }
          if (typeof self !== "undefined" && self.crypto) {
            crypto = self.crypto;
          }
          if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto = globalThis.crypto;
          }
          if (!crypto && typeof window !== "undefined" && window.msCrypto) {
            crypto = window.msCrypto;
          }
          if (!crypto && typeof global !== "undefined" && global.crypto) {
            crypto = global.crypto;
          }
          if (!crypto && typeof __require === "function") {
            try {
              crypto = require_crypto();
            } catch (err) {
            }
          }
          var cryptoSecureRandomInt = function() {
            if (crypto) {
              if (typeof crypto.getRandomValues === "function") {
                try {
                  return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {
                }
              }
              if (typeof crypto.randomBytes === "function") {
                try {
                  return crypto.randomBytes(4).readInt32LE();
                } catch (err) {
                }
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
          };
          var create = Object.create || /* @__PURE__ */ (function() {
            function F() {
            }
            return function(obj) {
              var subtype;
              F.prototype = obj;
              subtype = new F();
              F.prototype = null;
              return subtype;
            };
          })();
          var C = {};
          var C_lib = C.lib = {};
          var Base = C_lib.Base = /* @__PURE__ */ (function() {
            return {
              /**
               * Creates a new object that inherits from this object.
               *
               * @param {Object} overrides Properties to copy into the new object.
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         field: 'value',
               *
               *         method: function () {
               *         }
               *     });
               */
              extend: function(overrides) {
                var subtype = create(this);
                if (overrides) {
                  subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                  subtype.init = function() {
                    subtype.$super.init.apply(this, arguments);
                  };
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
              },
              /**
               * Extends this object and runs the init method.
               * Arguments to create() will be passed to init().
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var instance = MyType.create();
               */
              create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },
              /**
               * Initializes a newly created object.
               * Override this method to add some logic when your objects are created.
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         init: function () {
               *             // ...
               *         }
               *     });
               */
              init: function() {
              },
              /**
               * Copies properties into this object.
               *
               * @param {Object} properties The properties to mix in.
               *
               * @example
               *
               *     MyType.mixIn({
               *         field: 'value'
               *     });
               */
              mixIn: function(properties) {
                for (var propertyName in properties) {
                  if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                  }
                }
                if (properties.hasOwnProperty("toString")) {
                  this.toString = properties.toString;
                }
              },
              /**
               * Creates a copy of this object.
               *
               * @return {Object} The clone.
               *
               * @example
               *
               *     var clone = instance.clone();
               */
              clone: function() {
                return this.init.prototype.extend(this);
              }
            };
          })();
          var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined2) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },
            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function(encoder) {
              return (encoder || Hex).stringify(this);
            },
            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function(wordArray) {
              var thisWords = this.words;
              var thatWords = wordArray.words;
              var thisSigBytes = this.sigBytes;
              var thatSigBytes = wordArray.sigBytes;
              this.clamp();
              if (thisSigBytes % 4) {
                for (var i = 0; i < thatSigBytes; i++) {
                  var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                  thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                }
              } else {
                for (var j = 0; j < thatSigBytes; j += 4) {
                  thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
                }
              }
              this.sigBytes += thatSigBytes;
              return this;
            },
            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function() {
              var words = this.words;
              var sigBytes = this.sigBytes;
              words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
              words.length = Math2.ceil(sigBytes / 4);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },
            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function(nBytes) {
              var words = [];
              for (var i = 0; i < nBytes; i += 4) {
                words.push(cryptoSecureRandomInt());
              }
              return new WordArray.init(words, nBytes);
            }
          });
          var C_enc = C.enc = {};
          var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var hexChars = [];
              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 15).toString(16));
              }
              return hexChars.join("");
            },
            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function(hexStr) {
              var hexStrLength = hexStr.length;
              var words = [];
              for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
              }
              return new WordArray.init(words, hexStrLength / 2);
            }
          };
          var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var latin1Chars = [];
              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                latin1Chars.push(String.fromCharCode(bite));
              }
              return latin1Chars.join("");
            },
            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function(latin1Str) {
              var latin1StrLength = latin1Str.length;
              var words = [];
              for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
              }
              return new WordArray.init(words, latin1StrLength);
            }
          };
          var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function(wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function(utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function() {
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },
            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function(data) {
              if (typeof data == "string") {
                data = Utf8.parse(data);
              }
              this._data.concat(data);
              this._nDataBytes += data.sigBytes;
            },
            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function(doFlush) {
              var processedWords;
              var data = this._data;
              var dataWords = data.words;
              var dataSigBytes = data.sigBytes;
              var blockSize = this.blockSize;
              var blockSizeBytes = blockSize * 4;
              var nBlocksReady = dataSigBytes / blockSizeBytes;
              if (doFlush) {
                nBlocksReady = Math2.ceil(nBlocksReady);
              } else {
                nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
              }
              var nWordsReady = nBlocksReady * blockSize;
              var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
              if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                  this._doProcessBlock(dataWords, offset);
                }
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
              }
              return new WordArray.init(processedWords, nBytesReady);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),
            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
              this.reset();
            },
            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._append(messageUpdate);
              this._process();
              return this;
            },
            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              if (messageUpdate) {
                this._append(messageUpdate);
              }
              var hash = this._doFinalize();
              return hash;
            },
            blockSize: 512 / 32,
            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function(hasher) {
              return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },
            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function(hasher) {
              return function(message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          var C_algo = C.algo = {};
          return C;
        })(Math);
        return CryptoJS;
      });
    }
  });

  // node_modules/crypto-js/x64-core.js
  var require_x64_core = __commonJS({
    "node_modules/crypto-js/x64-core.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          var C_x64 = C.x64 = {};
          var X64Word = C_x64.Word = Base.extend({
            /**
             * Initializes a newly created 64-bit word.
             *
             * @param {number} high The high 32 bits.
             * @param {number} low The low 32 bits.
             *
             * @example
             *
             *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
             */
            init: function(high, low) {
              this.high = high;
              this.low = low;
            }
            /**
             * Bitwise NOTs this word.
             *
             * @return {X64Word} A new x64-Word object after negating.
             *
             * @example
             *
             *     var negated = x64Word.not();
             */
            // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ANDs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to AND with this word.
             *
             * @return {X64Word} A new x64-Word object after ANDing.
             *
             * @example
             *
             *     var anded = x64Word.and(anotherX64Word);
             */
            // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to OR with this word.
             *
             * @return {X64Word} A new x64-Word object after ORing.
             *
             * @example
             *
             *     var ored = x64Word.or(anotherX64Word);
             */
            // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise XORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to XOR with this word.
             *
             * @return {X64Word} A new x64-Word object after XORing.
             *
             * @example
             *
             *     var xored = x64Word.xor(anotherX64Word);
             */
            // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the left.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftL(25);
             */
            // shiftL: function (n) {
            // if (n < 32) {
            // var high = (this.high << n) | (this.low >>> (32 - n));
            // var low = this.low << n;
            // } else {
            // var high = this.low << (n - 32);
            // var low = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the right.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftR(7);
             */
            // shiftR: function (n) {
            // if (n < 32) {
            // var low = (this.low >>> n) | (this.high << (32 - n));
            // var high = this.high >>> n;
            // } else {
            // var low = this.high >>> (n - 32);
            // var high = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Rotates this word n bits to the left.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotL(25);
             */
            // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
            // },
            /**
             * Rotates this word n bits to the right.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotR(7);
             */
            // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
            // },
            /**
             * Adds this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to add with this word.
             *
             * @return {X64Word} A new x64-Word object after adding.
             *
             * @example
             *
             *     var added = x64Word.add(anotherX64Word);
             */
            // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;
            // return X64Word.create(high, low);
            // }
          });
          var X64WordArray = C_x64.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.x64.WordArray.create();
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ]);
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ], 10);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined2) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },
            /**
             * Converts this 64-bit word array to a 32-bit word array.
             *
             * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
             *
             * @example
             *
             *     var x32WordArray = x64WordArray.toX32();
             */
            toX32: function() {
              var x64Words = this.words;
              var x64WordsLength = x64Words.length;
              var x32Words = [];
              for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
              }
              return X32WordArray.create(x32Words, this.sigBytes);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {X64WordArray} The clone.
             *
             * @example
             *
             *     var clone = x64WordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              var words = clone.words = this.words.slice(0);
              var wordsLength = words.length;
              for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
              }
              return clone;
            }
          });
        })();
        return CryptoJS;
      });
    }
  });

  // node_modules/crypto-js/lib-typedarrays.js
  var require_lib_typedarrays = __commonJS({
    "node_modules/crypto-js/lib-typedarrays.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          if (typeof ArrayBuffer != "function") {
            return;
          }
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var superInit = WordArray.init;
          var subInit = WordArray.init = function(typedArray) {
            if (typedArray instanceof ArrayBuffer) {
              typedArray = new Uint8Array(typedArray);
            }
            if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
              typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
            }
            if (typedArray instanceof Uint8Array) {
              var typedArrayByteLength = typedArray.byteLength;
              var words = [];
              for (var i = 0; i < typedArrayByteLength; i++) {
                words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
              }
              superInit.call(this, words, typedArrayByteLength);
            } else {
              superInit.apply(this, arguments);
            }
          };
          subInit.prototype = WordArray;
        })();
        return CryptoJS.lib.WordArray;
      });
    }
  });

  // node_modules/crypto-js/enc-utf16.js
  var require_enc_utf16 = __commonJS({
    "node_modules/crypto-js/enc-utf16.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
            /**
             * Converts a word array to a UTF-16 BE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 BE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 BE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 BE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          C_enc.Utf16LE = {
            /**
             * Converts a word array to a UTF-16 LE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 LE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 LE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 LE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          function swapEndian(word) {
            return word << 8 & 4278255360 | word >>> 8 & 16711935;
          }
        })();
        return CryptoJS.enc.Utf16;
      });
    }
  });

  // node_modules/crypto-js/enc-base64.js
  var require_enc_base64 = __commonJS({
    "node_modules/crypto-js/enc-base64.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Base64 = C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function(base64Str) {
              var base64StrLength = base64Str.length;
              var map = this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS.enc.Base64;
      });
    }
  });

  // node_modules/crypto-js/enc-base64url.js
  var require_enc_base64url = __commonJS({
    "node_modules/crypto-js/enc-base64url.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Base64url = C_enc.Base64url = {
            /**
             * Converts a word array to a Base64url string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {string} The Base64url string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
             */
            stringify: function(wordArray, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = urlSafe ? this._safe_map : this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64url string to a word array.
             *
             * @param {string} base64Str The Base64url string.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
             */
            parse: function(base64Str, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var base64StrLength = base64Str.length;
              var map = urlSafe ? this._safe_map : this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS.enc.Base64url;
      });
    }
  });

  // node_modules/crypto-js/md5.js
  var require_md5 = __commonJS({
    "node_modules/crypto-js/md5.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var T = [];
          (function() {
            for (var i = 0; i < 64; i++) {
              T[i] = Math2.abs(Math2.sin(i + 1)) * 4294967296 | 0;
            }
          })();
          var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878
              ]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i = 0; i < 16; i++) {
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var M_offset_0 = M[offset + 0];
              var M_offset_1 = M[offset + 1];
              var M_offset_2 = M[offset + 2];
              var M_offset_3 = M[offset + 3];
              var M_offset_4 = M[offset + 4];
              var M_offset_5 = M[offset + 5];
              var M_offset_6 = M[offset + 6];
              var M_offset_7 = M[offset + 7];
              var M_offset_8 = M[offset + 8];
              var M_offset_9 = M[offset + 9];
              var M_offset_10 = M[offset + 10];
              var M_offset_11 = M[offset + 11];
              var M_offset_12 = M[offset + 12];
              var M_offset_13 = M[offset + 13];
              var M_offset_14 = M[offset + 14];
              var M_offset_15 = M[offset + 15];
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              a = FF(a, b, c, d, M_offset_0, 7, T[0]);
              d = FF(d, a, b, c, M_offset_1, 12, T[1]);
              c = FF(c, d, a, b, M_offset_2, 17, T[2]);
              b = FF(b, c, d, a, M_offset_3, 22, T[3]);
              a = FF(a, b, c, d, M_offset_4, 7, T[4]);
              d = FF(d, a, b, c, M_offset_5, 12, T[5]);
              c = FF(c, d, a, b, M_offset_6, 17, T[6]);
              b = FF(b, c, d, a, M_offset_7, 22, T[7]);
              a = FF(a, b, c, d, M_offset_8, 7, T[8]);
              d = FF(d, a, b, c, M_offset_9, 12, T[9]);
              c = FF(c, d, a, b, M_offset_10, 17, T[10]);
              b = FF(b, c, d, a, M_offset_11, 22, T[11]);
              a = FF(a, b, c, d, M_offset_12, 7, T[12]);
              d = FF(d, a, b, c, M_offset_13, 12, T[13]);
              c = FF(c, d, a, b, M_offset_14, 17, T[14]);
              b = FF(b, c, d, a, M_offset_15, 22, T[15]);
              a = GG(a, b, c, d, M_offset_1, 5, T[16]);
              d = GG(d, a, b, c, M_offset_6, 9, T[17]);
              c = GG(c, d, a, b, M_offset_11, 14, T[18]);
              b = GG(b, c, d, a, M_offset_0, 20, T[19]);
              a = GG(a, b, c, d, M_offset_5, 5, T[20]);
              d = GG(d, a, b, c, M_offset_10, 9, T[21]);
              c = GG(c, d, a, b, M_offset_15, 14, T[22]);
              b = GG(b, c, d, a, M_offset_4, 20, T[23]);
              a = GG(a, b, c, d, M_offset_9, 5, T[24]);
              d = GG(d, a, b, c, M_offset_14, 9, T[25]);
              c = GG(c, d, a, b, M_offset_3, 14, T[26]);
              b = GG(b, c, d, a, M_offset_8, 20, T[27]);
              a = GG(a, b, c, d, M_offset_13, 5, T[28]);
              d = GG(d, a, b, c, M_offset_2, 9, T[29]);
              c = GG(c, d, a, b, M_offset_7, 14, T[30]);
              b = GG(b, c, d, a, M_offset_12, 20, T[31]);
              a = HH(a, b, c, d, M_offset_5, 4, T[32]);
              d = HH(d, a, b, c, M_offset_8, 11, T[33]);
              c = HH(c, d, a, b, M_offset_11, 16, T[34]);
              b = HH(b, c, d, a, M_offset_14, 23, T[35]);
              a = HH(a, b, c, d, M_offset_1, 4, T[36]);
              d = HH(d, a, b, c, M_offset_4, 11, T[37]);
              c = HH(c, d, a, b, M_offset_7, 16, T[38]);
              b = HH(b, c, d, a, M_offset_10, 23, T[39]);
              a = HH(a, b, c, d, M_offset_13, 4, T[40]);
              d = HH(d, a, b, c, M_offset_0, 11, T[41]);
              c = HH(c, d, a, b, M_offset_3, 16, T[42]);
              b = HH(b, c, d, a, M_offset_6, 23, T[43]);
              a = HH(a, b, c, d, M_offset_9, 4, T[44]);
              d = HH(d, a, b, c, M_offset_12, 11, T[45]);
              c = HH(c, d, a, b, M_offset_15, 16, T[46]);
              b = HH(b, c, d, a, M_offset_2, 23, T[47]);
              a = II(a, b, c, d, M_offset_0, 6, T[48]);
              d = II(d, a, b, c, M_offset_7, 10, T[49]);
              c = II(c, d, a, b, M_offset_14, 15, T[50]);
              b = II(b, c, d, a, M_offset_5, 21, T[51]);
              a = II(a, b, c, d, M_offset_12, 6, T[52]);
              d = II(d, a, b, c, M_offset_3, 10, T[53]);
              c = II(c, d, a, b, M_offset_10, 15, T[54]);
              b = II(b, c, d, a, M_offset_1, 21, T[55]);
              a = II(a, b, c, d, M_offset_8, 6, T[56]);
              d = II(d, a, b, c, M_offset_15, 10, T[57]);
              c = II(c, d, a, b, M_offset_6, 15, T[58]);
              b = II(b, c, d, a, M_offset_13, 21, T[59]);
              a = II(a, b, c, d, M_offset_4, 6, T[60]);
              d = II(d, a, b, c, M_offset_11, 10, T[61]);
              c = II(c, d, a, b, M_offset_2, 15, T[62]);
              b = II(b, c, d, a, M_offset_9, 21, T[63]);
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
              var nBitsTotalL = nBitsTotal;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i = 0; i < 4; i++) {
                var H_i = H[i];
                H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function FF(a, b, c, d, x, s, t) {
            var n = a + (b & c | ~b & d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function GG(a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          C.MD5 = Hasher._createHelper(MD5);
          C.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);
        return CryptoJS.MD5;
      });
    }
  });

  // node_modules/crypto-js/sha1.js
  var require_sha1 = __commonJS({
    "node_modules/crypto-js/sha1.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var W = [];
          var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878,
                3285377520
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              var e = H[4];
              for (var i = 0; i < 80; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                  W[i] = n << 1 | n >>> 31;
                }
                var t = (a << 5 | a >>> 27) + e + W[i];
                if (i < 20) {
                  t += (b & c | ~b & d) + 1518500249;
                } else if (i < 40) {
                  t += (b ^ c ^ d) + 1859775393;
                } else if (i < 60) {
                  t += (b & c | b & d | c & d) - 1894007588;
                } else {
                  t += (b ^ c ^ d) - 899497514;
                }
                e = d;
                d = c;
                c = b << 30 | b >>> 2;
                b = a;
                a = t;
              }
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
              H[4] = H[4] + e | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA1 = Hasher._createHelper(SHA1);
          C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        })();
        return CryptoJS.SHA1;
      });
    }
  });

  // node_modules/crypto-js/sha256.js
  var require_sha256 = __commonJS({
    "node_modules/crypto-js/sha256.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var H = [];
          var K = [];
          (function() {
            function isPrime(n2) {
              var sqrtN = Math2.sqrt(n2);
              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n2 % factor)) {
                  return false;
                }
              }
              return true;
            }
            function getFractionalBits(n2) {
              return (n2 - (n2 | 0)) * 4294967296 | 0;
            }
            var n = 2;
            var nPrime = 0;
            while (nPrime < 64) {
              if (isPrime(n)) {
                if (nPrime < 8) {
                  H[nPrime] = getFractionalBits(Math2.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math2.pow(n, 1 / 3));
                nPrime++;
              }
              n++;
            }
          })();
          var W = [];
          var SHA256 = C_algo.SHA256 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init(H.slice(0));
            },
            _doProcessBlock: function(M, offset) {
              var H2 = this._hash.words;
              var a = H2[0];
              var b = H2[1];
              var c = H2[2];
              var d = H2[3];
              var e = H2[4];
              var f = H2[5];
              var g = H2[6];
              var h = H2[7];
              for (var i = 0; i < 64; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var gamma0x = W[i - 15];
                  var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                  var gamma1x = W[i - 2];
                  var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                  W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }
                var ch = e & f ^ ~e & g;
                var maj = a & b ^ a & c ^ b & c;
                var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
              }
              H2[0] = H2[0] + a | 0;
              H2[1] = H2[1] + b | 0;
              H2[2] = H2[2] + c | 0;
              H2[3] = H2[3] + d | 0;
              H2[4] = H2[4] + e | 0;
              H2[5] = H2[5] + f | 0;
              H2[6] = H2[6] + g | 0;
              H2[7] = H2[7] + h | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA256 = Hasher._createHelper(SHA256);
          C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        })(Math);
        return CryptoJS.SHA256;
      });
    }
  });

  // node_modules/crypto-js/sha224.js
  var require_sha224 = __commonJS({
    "node_modules/crypto-js/sha224.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha256());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha256"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var SHA224 = C_algo.SHA224 = SHA256.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                3238371032,
                914150663,
                812702999,
                4144912697,
                4290775857,
                1750603025,
                1694076839,
                3204075428
              ]);
            },
            _doFinalize: function() {
              var hash = SHA256._doFinalize.call(this);
              hash.sigBytes -= 4;
              return hash;
            }
          });
          C.SHA224 = SHA256._createHelper(SHA224);
          C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        })();
        return CryptoJS.SHA224;
      });
    }
  });

  // node_modules/crypto-js/sha512.js
  var require_sha512 = __commonJS({
    "node_modules/crypto-js/sha512.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          function X64Word_create() {
            return X64Word.create.apply(X64Word, arguments);
          }
          var K = [
            X64Word_create(1116352408, 3609767458),
            X64Word_create(1899447441, 602891725),
            X64Word_create(3049323471, 3964484399),
            X64Word_create(3921009573, 2173295548),
            X64Word_create(961987163, 4081628472),
            X64Word_create(1508970993, 3053834265),
            X64Word_create(2453635748, 2937671579),
            X64Word_create(2870763221, 3664609560),
            X64Word_create(3624381080, 2734883394),
            X64Word_create(310598401, 1164996542),
            X64Word_create(607225278, 1323610764),
            X64Word_create(1426881987, 3590304994),
            X64Word_create(1925078388, 4068182383),
            X64Word_create(2162078206, 991336113),
            X64Word_create(2614888103, 633803317),
            X64Word_create(3248222580, 3479774868),
            X64Word_create(3835390401, 2666613458),
            X64Word_create(4022224774, 944711139),
            X64Word_create(264347078, 2341262773),
            X64Word_create(604807628, 2007800933),
            X64Word_create(770255983, 1495990901),
            X64Word_create(1249150122, 1856431235),
            X64Word_create(1555081692, 3175218132),
            X64Word_create(1996064986, 2198950837),
            X64Word_create(2554220882, 3999719339),
            X64Word_create(2821834349, 766784016),
            X64Word_create(2952996808, 2566594879),
            X64Word_create(3210313671, 3203337956),
            X64Word_create(3336571891, 1034457026),
            X64Word_create(3584528711, 2466948901),
            X64Word_create(113926993, 3758326383),
            X64Word_create(338241895, 168717936),
            X64Word_create(666307205, 1188179964),
            X64Word_create(773529912, 1546045734),
            X64Word_create(1294757372, 1522805485),
            X64Word_create(1396182291, 2643833823),
            X64Word_create(1695183700, 2343527390),
            X64Word_create(1986661051, 1014477480),
            X64Word_create(2177026350, 1206759142),
            X64Word_create(2456956037, 344077627),
            X64Word_create(2730485921, 1290863460),
            X64Word_create(2820302411, 3158454273),
            X64Word_create(3259730800, 3505952657),
            X64Word_create(3345764771, 106217008),
            X64Word_create(3516065817, 3606008344),
            X64Word_create(3600352804, 1432725776),
            X64Word_create(4094571909, 1467031594),
            X64Word_create(275423344, 851169720),
            X64Word_create(430227734, 3100823752),
            X64Word_create(506948616, 1363258195),
            X64Word_create(659060556, 3750685593),
            X64Word_create(883997877, 3785050280),
            X64Word_create(958139571, 3318307427),
            X64Word_create(1322822218, 3812723403),
            X64Word_create(1537002063, 2003034995),
            X64Word_create(1747873779, 3602036899),
            X64Word_create(1955562222, 1575990012),
            X64Word_create(2024104815, 1125592928),
            X64Word_create(2227730452, 2716904306),
            X64Word_create(2361852424, 442776044),
            X64Word_create(2428436474, 593698344),
            X64Word_create(2756734187, 3733110249),
            X64Word_create(3204031479, 2999351573),
            X64Word_create(3329325298, 3815920427),
            X64Word_create(3391569614, 3928383900),
            X64Word_create(3515267271, 566280711),
            X64Word_create(3940187606, 3454069534),
            X64Word_create(4118630271, 4000239992),
            X64Word_create(116418474, 1914138554),
            X64Word_create(174292421, 2731055270),
            X64Word_create(289380356, 3203993006),
            X64Word_create(460393269, 320620315),
            X64Word_create(685471733, 587496836),
            X64Word_create(852142971, 1086792851),
            X64Word_create(1017036298, 365543100),
            X64Word_create(1126000580, 2618297676),
            X64Word_create(1288033470, 3409855158),
            X64Word_create(1501505948, 4234509866),
            X64Word_create(1607167915, 987167468),
            X64Word_create(1816402316, 1246189591)
          ];
          var W = [];
          (function() {
            for (var i = 0; i < 80; i++) {
              W[i] = X64Word_create();
            }
          })();
          var SHA512 = C_algo.SHA512 = Hasher.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(1779033703, 4089235720),
                new X64Word.init(3144134277, 2227873595),
                new X64Word.init(1013904242, 4271175723),
                new X64Word.init(2773480762, 1595750129),
                new X64Word.init(1359893119, 2917565137),
                new X64Word.init(2600822924, 725511199),
                new X64Word.init(528734635, 4215389547),
                new X64Word.init(1541459225, 327033209)
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var H0 = H[0];
              var H1 = H[1];
              var H2 = H[2];
              var H3 = H[3];
              var H4 = H[4];
              var H5 = H[5];
              var H6 = H[6];
              var H7 = H[7];
              var H0h = H0.high;
              var H0l = H0.low;
              var H1h = H1.high;
              var H1l = H1.low;
              var H2h = H2.high;
              var H2l = H2.low;
              var H3h = H3.high;
              var H3l = H3.low;
              var H4h = H4.high;
              var H4l = H4.low;
              var H5h = H5.high;
              var H5l = H5.low;
              var H6h = H6.high;
              var H6l = H6.low;
              var H7h = H7.high;
              var H7l = H7.low;
              var ah = H0h;
              var al = H0l;
              var bh = H1h;
              var bl = H1l;
              var ch = H2h;
              var cl = H2l;
              var dh = H3h;
              var dl = H3l;
              var eh = H4h;
              var el = H4l;
              var fh = H5h;
              var fl = H5l;
              var gh = H6h;
              var gl = H6l;
              var hh = H7h;
              var hl = H7l;
              for (var i = 0; i < 80; i++) {
                var Wil;
                var Wih;
                var Wi = W[i];
                if (i < 16) {
                  Wih = Wi.high = M[offset + i * 2] | 0;
                  Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                } else {
                  var gamma0x = W[i - 15];
                  var gamma0xh = gamma0x.high;
                  var gamma0xl = gamma0x.low;
                  var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                  var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                  var gamma1x = W[i - 2];
                  var gamma1xh = gamma1x.high;
                  var gamma1xl = gamma1x.low;
                  var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                  var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                  var Wi7 = W[i - 7];
                  var Wi7h = Wi7.high;
                  var Wi7l = Wi7.low;
                  var Wi16 = W[i - 16];
                  var Wi16h = Wi16.high;
                  var Wi16l = Wi16.low;
                  Wil = gamma0l + Wi7l;
                  Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                  Wil = Wil + gamma1l;
                  Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                  Wil = Wil + Wi16l;
                  Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                  Wi.high = Wih;
                  Wi.low = Wil;
                }
                var chh = eh & fh ^ ~eh & gh;
                var chl = el & fl ^ ~el & gl;
                var majh = ah & bh ^ ah & ch ^ bh & ch;
                var majl = al & bl ^ al & cl ^ bl & cl;
                var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
                var Ki = K[i];
                var Kih = Ki.high;
                var Kil = Ki.low;
                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = dl + t1l | 0;
                eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = t1l + t2l | 0;
                ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
              }
              H0l = H0.low = H0l + al;
              H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
              H1l = H1.low = H1l + bl;
              H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
              H2l = H2.low = H2l + cl;
              H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
              H3l = H3.low = H3l + dl;
              H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
              H4l = H4.low = H4l + el;
              H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
              H5l = H5.low = H5l + fl;
              H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
              H6l = H6.low = H6l + gl;
              H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
              H7l = H7.low = H7l + hl;
              H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var hash = this._hash.toX32();
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            },
            blockSize: 1024 / 32
          });
          C.SHA512 = Hasher._createHelper(SHA512);
          C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        })();
        return CryptoJS.SHA512;
      });
    }
  });

  // node_modules/crypto-js/sha384.js
  var require_sha384 = __commonJS({
    "node_modules/crypto-js/sha384.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core(), require_sha512());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core", "./sha512"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          var SHA512 = C_algo.SHA512;
          var SHA384 = C_algo.SHA384 = SHA512.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(3418070365, 3238371032),
                new X64Word.init(1654270250, 914150663),
                new X64Word.init(2438529370, 812702999),
                new X64Word.init(355462360, 4144912697),
                new X64Word.init(1731405415, 4290775857),
                new X64Word.init(2394180231, 1750603025),
                new X64Word.init(3675008525, 1694076839),
                new X64Word.init(1203062813, 3204075428)
              ]);
            },
            _doFinalize: function() {
              var hash = SHA512._doFinalize.call(this);
              hash.sigBytes -= 16;
              return hash;
            }
          });
          C.SHA384 = SHA512._createHelper(SHA384);
          C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        })();
        return CryptoJS.SHA384;
      });
    }
  });

  // node_modules/crypto-js/sha3.js
  var require_sha3 = __commonJS({
    "node_modules/crypto-js/sha3.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var C_algo = C.algo;
          var RHO_OFFSETS = [];
          var PI_INDEXES = [];
          var ROUND_CONSTANTS = [];
          (function() {
            var x = 1, y = 0;
            for (var t = 0; t < 24; t++) {
              RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
              var newX = y % 5;
              var newY = (2 * x + 3 * y) % 5;
              x = newX;
              y = newY;
            }
            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
              }
            }
            var LFSR = 1;
            for (var i = 0; i < 24; i++) {
              var roundConstantMsw = 0;
              var roundConstantLsw = 0;
              for (var j = 0; j < 7; j++) {
                if (LFSR & 1) {
                  var bitPosition = (1 << j) - 1;
                  if (bitPosition < 32) {
                    roundConstantLsw ^= 1 << bitPosition;
                  } else {
                    roundConstantMsw ^= 1 << bitPosition - 32;
                  }
                }
                if (LFSR & 128) {
                  LFSR = LFSR << 1 ^ 113;
                } else {
                  LFSR <<= 1;
                }
              }
              ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
            }
          })();
          var T = [];
          (function() {
            for (var i = 0; i < 25; i++) {
              T[i] = X64Word.create();
            }
          })();
          var SHA3 = C_algo.SHA3 = Hasher.extend({
            /**
             * Configuration options.
             *
             * @property {number} outputLength
             *   The desired number of bits in the output hash.
             *   Only values permitted are: 224, 256, 384, 512.
             *   Default: 512
             */
            cfg: Hasher.cfg.extend({
              outputLength: 512
            }),
            _doReset: function() {
              var state = this._state = [];
              for (var i = 0; i < 25; i++) {
                state[i] = new X64Word.init();
              }
              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function(M, offset) {
              var state = this._state;
              var nBlockSizeLanes = this.blockSize / 2;
              for (var i = 0; i < nBlockSizeLanes; i++) {
                var M2i = M[offset + 2 * i];
                var M2i1 = M[offset + 2 * i + 1];
                M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
                M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
                var lane = state[i];
                lane.high ^= M2i1;
                lane.low ^= M2i;
              }
              for (var round = 0; round < 24; round++) {
                for (var x = 0; x < 5; x++) {
                  var tMsw = 0, tLsw = 0;
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                  }
                  var Tx = T[x];
                  Tx.high = tMsw;
                  Tx.low = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                  var Tx4 = T[(x + 4) % 5];
                  var Tx1 = T[(x + 1) % 5];
                  var Tx1Msw = Tx1.high;
                  var Tx1Lsw = Tx1.low;
                  var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                  var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                  }
                }
                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                  var tMsw;
                  var tLsw;
                  var lane = state[laneIndex];
                  var laneMsw = lane.high;
                  var laneLsw = lane.low;
                  var rhoOffset = RHO_OFFSETS[laneIndex];
                  if (rhoOffset < 32) {
                    tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                    tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                  } else {
                    tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                    tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                  }
                  var TPiLane = T[PI_INDEXES[laneIndex]];
                  TPiLane.high = tMsw;
                  TPiLane.low = tLsw;
                }
                var T0 = T[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low = state0.low;
                for (var x = 0; x < 5; x++) {
                  for (var y = 0; y < 5; y++) {
                    var laneIndex = x + 5 * y;
                    var lane = state[laneIndex];
                    var TLane = T[laneIndex];
                    var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                    var Tx2Lane = T[(x + 2) % 5 + 5 * y];
                    lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                    lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                  }
                }
                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low ^= roundConstant.low;
              }
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              var blockSizeBits = this.blockSize * 32;
              dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
              dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var state = this._state;
              var outputLengthBytes = this.cfg.outputLength / 8;
              var outputLengthLanes = outputLengthBytes / 8;
              var hashWords = [];
              for (var i = 0; i < outputLengthLanes; i++) {
                var lane = state[i];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
                laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
              }
              return new WordArray.init(hashWords, outputLengthBytes);
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              var state = clone._state = this._state.slice(0);
              for (var i = 0; i < 25; i++) {
                state[i] = state[i].clone();
              }
              return clone;
            }
          });
          C.SHA3 = Hasher._createHelper(SHA3);
          C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        })(Math);
        return CryptoJS.SHA3;
      });
    }
  });

  // node_modules/crypto-js/ripemd160.js
  var require_ripemd160 = __commonJS({
    "node_modules/crypto-js/ripemd160.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var _zl = WordArray.create([
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            7,
            4,
            13,
            1,
            10,
            6,
            15,
            3,
            12,
            0,
            9,
            5,
            2,
            14,
            11,
            8,
            3,
            10,
            14,
            4,
            9,
            15,
            8,
            1,
            2,
            7,
            0,
            6,
            13,
            11,
            5,
            12,
            1,
            9,
            11,
            10,
            0,
            8,
            12,
            4,
            13,
            3,
            7,
            15,
            14,
            5,
            6,
            2,
            4,
            0,
            5,
            9,
            7,
            12,
            2,
            10,
            14,
            1,
            3,
            8,
            11,
            6,
            15,
            13
          ]);
          var _zr = WordArray.create([
            5,
            14,
            7,
            0,
            9,
            2,
            11,
            4,
            13,
            6,
            15,
            8,
            1,
            10,
            3,
            12,
            6,
            11,
            3,
            7,
            0,
            13,
            5,
            10,
            14,
            15,
            8,
            12,
            4,
            9,
            1,
            2,
            15,
            5,
            1,
            3,
            7,
            14,
            6,
            9,
            11,
            8,
            12,
            2,
            10,
            0,
            4,
            13,
            8,
            6,
            4,
            1,
            3,
            11,
            15,
            0,
            5,
            12,
            2,
            13,
            9,
            7,
            10,
            14,
            12,
            15,
            10,
            4,
            1,
            5,
            8,
            7,
            6,
            2,
            13,
            14,
            0,
            3,
            9,
            11
          ]);
          var _sl = WordArray.create([
            11,
            14,
            15,
            12,
            5,
            8,
            7,
            9,
            11,
            13,
            14,
            15,
            6,
            7,
            9,
            8,
            7,
            6,
            8,
            13,
            11,
            9,
            7,
            15,
            7,
            12,
            15,
            9,
            11,
            7,
            13,
            12,
            11,
            13,
            6,
            7,
            14,
            9,
            13,
            15,
            14,
            8,
            13,
            6,
            5,
            12,
            7,
            5,
            11,
            12,
            14,
            15,
            14,
            15,
            9,
            8,
            9,
            14,
            5,
            6,
            8,
            6,
            5,
            12,
            9,
            15,
            5,
            11,
            6,
            8,
            13,
            12,
            5,
            12,
            13,
            14,
            11,
            8,
            5,
            6
          ]);
          var _sr = WordArray.create([
            8,
            9,
            9,
            11,
            13,
            15,
            15,
            5,
            7,
            7,
            8,
            11,
            14,
            14,
            12,
            6,
            9,
            13,
            15,
            7,
            12,
            8,
            9,
            11,
            7,
            7,
            12,
            7,
            6,
            15,
            13,
            11,
            9,
            7,
            15,
            11,
            8,
            6,
            6,
            14,
            12,
            13,
            5,
            14,
            13,
            13,
            7,
            5,
            15,
            5,
            8,
            11,
            14,
            14,
            6,
            14,
            6,
            9,
            12,
            9,
            12,
            5,
            15,
            8,
            8,
            5,
            12,
            9,
            12,
            5,
            14,
            6,
            8,
            13,
            6,
            5,
            15,
            13,
            11,
            11
          ]);
          var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
          var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
          var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
            _doReset: function() {
              this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i = 0; i < 16; i++) {
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var hl = _hl.words;
              var hr = _hr.words;
              var zl = _zl.words;
              var zr = _zr.words;
              var sl = _sl.words;
              var sr = _sr.words;
              var al, bl, cl, dl, el;
              var ar, br, cr, dr, er;
              ar = al = H[0];
              br = bl = H[1];
              cr = cl = H[2];
              dr = dl = H[3];
              er = el = H[4];
              var t;
              for (var i = 0; i < 80; i += 1) {
                t = al + M[offset + zl[i]] | 0;
                if (i < 16) {
                  t += f1(bl, cl, dl) + hl[0];
                } else if (i < 32) {
                  t += f2(bl, cl, dl) + hl[1];
                } else if (i < 48) {
                  t += f3(bl, cl, dl) + hl[2];
                } else if (i < 64) {
                  t += f4(bl, cl, dl) + hl[3];
                } else {
                  t += f5(bl, cl, dl) + hl[4];
                }
                t = t | 0;
                t = rotl(t, sl[i]);
                t = t + el | 0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t;
                t = ar + M[offset + zr[i]] | 0;
                if (i < 16) {
                  t += f5(br, cr, dr) + hr[0];
                } else if (i < 32) {
                  t += f4(br, cr, dr) + hr[1];
                } else if (i < 48) {
                  t += f3(br, cr, dr) + hr[2];
                } else if (i < 64) {
                  t += f2(br, cr, dr) + hr[3];
                } else {
                  t += f1(br, cr, dr) + hr[4];
                }
                t = t | 0;
                t = rotl(t, sr[i]);
                t = t + er | 0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t;
              }
              t = H[1] + cl + dr | 0;
              H[1] = H[2] + dl + er | 0;
              H[2] = H[3] + el + ar | 0;
              H[3] = H[4] + al + br | 0;
              H[4] = H[0] + bl + cr | 0;
              H[0] = t;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i = 0; i < 5; i++) {
                var H_i = H[i];
                H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function f1(x, y, z) {
            return x ^ y ^ z;
          }
          function f2(x, y, z) {
            return x & y | ~x & z;
          }
          function f3(x, y, z) {
            return (x | ~y) ^ z;
          }
          function f4(x, y, z) {
            return x & z | y & ~z;
          }
          function f5(x, y, z) {
            return x ^ (y | ~z);
          }
          function rotl(x, n) {
            return x << n | x >>> 32 - n;
          }
          C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })(Math);
        return CryptoJS.RIPEMD160;
      });
    }
  });

  // node_modules/crypto-js/hmac.js
  var require_hmac = __commonJS({
    "node_modules/crypto-js/hmac.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C.algo;
          var HMAC = C_algo.HMAC = Base.extend({
            /**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */
            init: function(hasher, key) {
              hasher = this._hasher = new hasher.init();
              if (typeof key == "string") {
                key = Utf8.parse(key);
              }
              var hasherBlockSize = hasher.blockSize;
              var hasherBlockSizeBytes = hasherBlockSize * 4;
              if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
              }
              key.clamp();
              var oKey = this._oKey = key.clone();
              var iKey = this._iKey = key.clone();
              var oKeyWords = oKey.words;
              var iKeyWords = iKey.words;
              for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 1549556828;
                iKeyWords[i] ^= 909522486;
              }
              oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
              this.reset();
            },
            /**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */
            reset: function() {
              var hasher = this._hasher;
              hasher.reset();
              hasher.update(this._iKey);
            },
            /**
             * Updates this HMAC with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {HMAC} This HMAC instance.
             *
             * @example
             *
             *     hmacHasher.update('message');
             *     hmacHasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._hasher.update(messageUpdate);
              return this;
            },
            /**
             * Finalizes the HMAC computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The HMAC.
             *
             * @example
             *
             *     var hmac = hmacHasher.finalize();
             *     var hmac = hmacHasher.finalize('message');
             *     var hmac = hmacHasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              var hasher = this._hasher;
              var innerHash = hasher.finalize(messageUpdate);
              hasher.reset();
              var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
              return hmac;
            }
          });
        })();
      });
    }
  });

  // node_modules/crypto-js/pbkdf2.js
  var require_pbkdf2 = __commonJS({
    "node_modules/crypto-js/pbkdf2.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha256(), require_hmac());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha256", "./hmac"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var HMAC = C_algo.HMAC;
          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hasher to use. Default: SHA256
             * @property {number} iterations The number of iterations to perform. Default: 250000
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA256,
              iterations: 25e4
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.PBKDF2.create();
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var cfg = this.cfg;
              var hmac = HMAC.create(cfg.hasher, password);
              var derivedKey = WordArray.create();
              var blockIndex = WordArray.create([1]);
              var derivedKeyWords = derivedKey.words;
              var blockIndexWords = blockIndex.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).finalize(blockIndex);
                hmac.reset();
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                  intermediate = hmac.finalize(intermediate);
                  hmac.reset();
                  var intermediateWords = intermediate.words;
                  for (var j = 0; j < blockWordsLength; j++) {
                    blockWords[j] ^= intermediateWords[j];
                  }
                }
                derivedKey.concat(block);
                blockIndexWords[0]++;
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.PBKDF2 = function(password, salt, cfg) {
            return PBKDF2.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS.PBKDF2;
      });
    }
  });

  // node_modules/crypto-js/evpkdf.js
  var require_evpkdf = __commonJS({
    "node_modules/crypto-js/evpkdf.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha1(), require_hmac());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha1", "./hmac"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var MD5 = C_algo.MD5;
          var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var block;
              var cfg = this.cfg;
              var hasher = cfg.hasher.create();
              var derivedKey = WordArray.create();
              var derivedKeyWords = derivedKey.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                if (block) {
                  hasher.update(block);
                }
                block = hasher.update(password).finalize(salt);
                hasher.reset();
                for (var i = 1; i < iterations; i++) {
                  block = hasher.finalize(block);
                  hasher.reset();
                }
                derivedKey.concat(block);
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.EvpKDF = function(password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS.EvpKDF;
      });
    }
  });

  // node_modules/crypto-js/cipher-core.js
  var require_cipher_core = __commonJS({
    "node_modules/crypto-js/cipher-core.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_evpkdf());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./evpkdf"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.lib.Cipher || (function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var Base64 = C_enc.Base64;
          var C_algo = C.algo;
          var EvpKDF = C_algo.EvpKDF;
          var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),
            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function(key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },
            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function(key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },
            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function(xformMode, key, cfg) {
              this.cfg = this.cfg.extend(cfg);
              this._xformMode = xformMode;
              this._key = key;
              this.reset();
            },
            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function(dataUpdate) {
              this._append(dataUpdate);
              return this._process();
            },
            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function(dataUpdate) {
              if (dataUpdate) {
                this._append(dataUpdate);
              }
              var finalProcessedData = this._doFinalize();
              return finalProcessedData;
            },
            keySize: 128 / 32,
            ivSize: 128 / 32,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: /* @__PURE__ */ (function() {
              function selectCipherStrategy(key) {
                if (typeof key == "string") {
                  return PasswordBasedCipher;
                } else {
                  return SerializableCipher;
                }
              }
              return function(cipher) {
                return {
                  encrypt: function(message, key, cfg) {
                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                  },
                  decrypt: function(ciphertext, key, cfg) {
                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                  }
                };
              };
            })()
          });
          var StreamCipher = C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function() {
              var finalProcessedBlocks = this._process(true);
              return finalProcessedBlocks;
            },
            blockSize: 1
          });
          var C_mode = C.mode = {};
          var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function(cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },
            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function(cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },
            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function(cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          var CBC = C_mode.CBC = (function() {
            var CBC2 = BlockCipherMode.extend();
            CBC2.Encryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            CBC2.Decryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var thisBlock = words.slice(offset, offset + blockSize);
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);
                this._prevBlock = thisBlock;
              }
            });
            function xorBlock(words, offset, blockSize) {
              var block;
              var iv = this._iv;
              if (iv) {
                block = iv;
                this._iv = undefined2;
              } else {
                block = this._prevBlock;
              }
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
              }
            }
            return CBC2;
          })();
          var C_pad = C.pad = {};
          var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function(data, blockSize) {
              var blockSizeBytes = blockSize * 4;
              var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
              var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
              var paddingWords = [];
              for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
              }
              var padding = WordArray.create(paddingWords, nPaddingBytes);
              data.concat(padding);
            },
            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function(data) {
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
              data.sigBytes -= nPaddingBytes;
            }
          };
          var BlockCipher = C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
              mode: CBC,
              padding: Pkcs7
            }),
            reset: function() {
              var modeCreator;
              Cipher.reset.call(this);
              var cfg = this.cfg;
              var iv = cfg.iv;
              var mode = cfg.mode;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                modeCreator = mode.createEncryptor;
              } else {
                modeCreator = mode.createDecryptor;
                this._minBufferSize = 1;
              }
              if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
              } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
              }
            },
            _doProcessBlock: function(words, offset) {
              this._mode.processBlock(words, offset);
            },
            _doFinalize: function() {
              var finalProcessedBlocks;
              var padding = this.cfg.padding;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                padding.pad(this._data, this.blockSize);
                finalProcessedBlocks = this._process(true);
              } else {
                finalProcessedBlocks = this._process(true);
                padding.unpad(finalProcessedBlocks);
              }
              return finalProcessedBlocks;
            },
            blockSize: 128 / 32
          });
          var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function(cipherParams) {
              this.mixIn(cipherParams);
            },
            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function(formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          var C_format = C.format = {};
          var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              var wordArray;
              var ciphertext = cipherParams.ciphertext;
              var salt = cipherParams.salt;
              if (salt) {
                wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
              } else {
                wordArray = ciphertext;
              }
              return wordArray.toString(Base64);
            },
            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function(openSSLStr) {
              var salt;
              var ciphertext = Base64.parse(openSSLStr);
              var ciphertextWords = ciphertext.words;
              if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
                salt = WordArray.create(ciphertextWords.slice(2, 4));
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
              }
              return CipherParams.create({ ciphertext, salt });
            }
          };
          var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),
            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, key, cfg) {
              cfg = this.cfg.extend(cfg);
              var encryptor = cipher.createEncryptor(key, cfg);
              var ciphertext = encryptor.finalize(message);
              var cipherCfg = encryptor.cfg;
              return CipherParams.create({
                ciphertext,
                key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
              });
            },
            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, key, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },
            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function(ciphertext, format) {
              if (typeof ciphertext == "string") {
                return format.parse(ciphertext, this);
              } else {
                return ciphertext;
              }
            }
          });
          var C_kdf = C.kdf = {};
          var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function(password, keySize, ivSize, salt, hasher) {
              if (!salt) {
                salt = WordArray.random(64 / 8);
              }
              if (!hasher) {
                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
              } else {
                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
              }
              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4;
              return CipherParams.create({ key, iv, salt });
            }
          };
          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),
            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, password, cfg) {
              cfg = this.cfg.extend(cfg);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },
            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, password, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
              return plaintext;
            }
          });
        })();
      });
    }
  });

  // node_modules/crypto-js/mode-cfb.js
  var require_mode_cfb = __commonJS({
    "node_modules/crypto-js/mode-cfb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CFB = (function() {
          var CFB = CryptoJS.lib.BlockCipherMode.extend();
          CFB.Encryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CFB.Decryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = thisBlock;
            }
          });
          function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
            var keystream;
            var iv = this._iv;
            if (iv) {
              keystream = iv.slice(0);
              this._iv = void 0;
            } else {
              keystream = this._prevBlock;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
          return CFB;
        })();
        return CryptoJS.mode.CFB;
      });
    }
  });

  // node_modules/crypto-js/mode-ctr.js
  var require_mode_ctr = __commonJS({
    "node_modules/crypto-js/mode-ctr.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CTR = (function() {
          var CTR = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = CTR.Encryptor = CTR.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTR.Decryptor = Encryptor;
          return CTR;
        })();
        return CryptoJS.mode.CTR;
      });
    }
  });

  // node_modules/crypto-js/mode-ctr-gladman.js
  var require_mode_ctr_gladman = __commonJS({
    "node_modules/crypto-js/mode-ctr-gladman.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CTRGladman = (function() {
          var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
          function incWord(word) {
            if ((word >> 24 & 255) === 255) {
              var b1 = word >> 16 & 255;
              var b2 = word >> 8 & 255;
              var b3 = word & 255;
              if (b1 === 255) {
                b1 = 0;
                if (b2 === 255) {
                  b2 = 0;
                  if (b3 === 255) {
                    b3 = 0;
                  } else {
                    ++b3;
                  }
                } else {
                  ++b2;
                }
              } else {
                ++b1;
              }
              word = 0;
              word += b1 << 16;
              word += b2 << 8;
              word += b3;
            } else {
              word += 1 << 24;
            }
            return word;
          }
          function incCounter(counter) {
            if ((counter[0] = incWord(counter[0])) === 0) {
              counter[1] = incWord(counter[1]);
            }
            return counter;
          }
          var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              incCounter(counter);
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTRGladman.Decryptor = Encryptor;
          return CTRGladman;
        })();
        return CryptoJS.mode.CTRGladman;
      });
    }
  });

  // node_modules/crypto-js/mode-ofb.js
  var require_mode_ofb = __commonJS({
    "node_modules/crypto-js/mode-ofb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.OFB = (function() {
          var OFB = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = OFB.Encryptor = OFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var keystream = this._keystream;
              if (iv) {
                keystream = this._keystream = iv.slice(0);
                this._iv = void 0;
              }
              cipher.encryptBlock(keystream, 0);
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          OFB.Decryptor = Encryptor;
          return OFB;
        })();
        return CryptoJS.mode.OFB;
      });
    }
  });

  // node_modules/crypto-js/mode-ecb.js
  var require_mode_ecb = __commonJS({
    "node_modules/crypto-js/mode-ecb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.ECB = (function() {
          var ECB = CryptoJS.lib.BlockCipherMode.extend();
          ECB.Encryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.encryptBlock(words, offset);
            }
          });
          ECB.Decryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.decryptBlock(words, offset);
            }
          });
          return ECB;
        })();
        return CryptoJS.mode.ECB;
      });
    }
  });

  // node_modules/crypto-js/pad-ansix923.js
  var require_pad_ansix923 = __commonJS({
    "node_modules/crypto-js/pad-ansix923.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.AnsiX923 = {
          pad: function(data, blockSize) {
            var dataSigBytes = data.sigBytes;
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
            var lastBytePos = dataSigBytes + nPaddingBytes - 1;
            data.clamp();
            data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
            data.sigBytes += nPaddingBytes;
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Ansix923;
      });
    }
  });

  // node_modules/crypto-js/pad-iso10126.js
  var require_pad_iso10126 = __commonJS({
    "node_modules/crypto-js/pad-iso10126.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.Iso10126 = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Iso10126;
      });
    }
  });

  // node_modules/crypto-js/pad-iso97971.js
  var require_pad_iso97971 = __commonJS({
    "node_modules/crypto-js/pad-iso97971.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.Iso97971 = {
          pad: function(data, blockSize) {
            data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
            CryptoJS.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function(data) {
            CryptoJS.pad.ZeroPadding.unpad(data);
            data.sigBytes--;
          }
        };
        return CryptoJS.pad.Iso97971;
      });
    }
  });

  // node_modules/crypto-js/pad-zeropadding.js
  var require_pad_zeropadding = __commonJS({
    "node_modules/crypto-js/pad-zeropadding.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.ZeroPadding = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            data.clamp();
            data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
          },
          unpad: function(data) {
            var dataWords = data.words;
            var i = data.sigBytes - 1;
            for (var i = data.sigBytes - 1; i >= 0; i--) {
              if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
                data.sigBytes = i + 1;
                break;
              }
            }
          }
        };
        return CryptoJS.pad.ZeroPadding;
      });
    }
  });

  // node_modules/crypto-js/pad-nopadding.js
  var require_pad_nopadding = __commonJS({
    "node_modules/crypto-js/pad-nopadding.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.NoPadding = {
          pad: function() {
          },
          unpad: function() {
          }
        };
        return CryptoJS.pad.NoPadding;
      });
    }
  });

  // node_modules/crypto-js/format-hex.js
  var require_format_hex = __commonJS({
    "node_modules/crypto-js/format-hex.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C.enc;
          var Hex = C_enc.Hex;
          var C_format = C.format;
          var HexFormatter = C_format.Hex = {
            /**
             * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The hexadecimally encoded string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },
            /**
             * Converts a hexadecimally encoded ciphertext string to a cipher params object.
             *
             * @param {string} input The hexadecimally encoded string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
             */
            parse: function(input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({ ciphertext });
            }
          };
        })();
        return CryptoJS.format.Hex;
      });
    }
  });

  // node_modules/crypto-js/aes.js
  var require_aes = __commonJS({
    "node_modules/crypto-js/aes.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var SBOX = [];
          var INV_SBOX = [];
          var SUB_MIX_0 = [];
          var SUB_MIX_1 = [];
          var SUB_MIX_2 = [];
          var SUB_MIX_3 = [];
          var INV_SUB_MIX_0 = [];
          var INV_SUB_MIX_1 = [];
          var INV_SUB_MIX_2 = [];
          var INV_SUB_MIX_3 = [];
          (function() {
            var d = [];
            for (var i = 0; i < 256; i++) {
              if (i < 128) {
                d[i] = i << 1;
              } else {
                d[i] = i << 1 ^ 283;
              }
            }
            var x = 0;
            var xi = 0;
            for (var i = 0; i < 256; i++) {
              var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
              sx = sx >>> 8 ^ sx & 255 ^ 99;
              SBOX[x] = sx;
              INV_SBOX[sx] = x;
              var x2 = d[x];
              var x4 = d[x2];
              var x8 = d[x4];
              var t = d[sx] * 257 ^ sx * 16843008;
              SUB_MIX_0[x] = t << 24 | t >>> 8;
              SUB_MIX_1[x] = t << 16 | t >>> 16;
              SUB_MIX_2[x] = t << 8 | t >>> 24;
              SUB_MIX_3[x] = t;
              var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
              INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
              INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
              INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
              INV_SUB_MIX_3[sx] = t;
              if (!x) {
                x = xi = 1;
              } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
              }
            }
          })();
          var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
          var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function() {
              var t;
              if (this._nRounds && this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              var nRounds = this._nRounds = keySize + 6;
              var ksRows = (nRounds + 1) * 4;
              var keySchedule = this._keySchedule = [];
              for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                  keySchedule[ksRow] = keyWords[ksRow];
                } else {
                  t = keySchedule[ksRow - 1];
                  if (!(ksRow % keySize)) {
                    t = t << 8 | t >>> 24;
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                    t ^= RCON[ksRow / keySize | 0] << 24;
                  } else if (keySize > 6 && ksRow % keySize == 4) {
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                  }
                  keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
              }
              var invKeySchedule = this._invKeySchedule = [];
              for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;
                if (invKsRow % 4) {
                  var t = keySchedule[ksRow];
                } else {
                  var t = keySchedule[ksRow - 4];
                }
                if (invKsRow < 4 || ksRow <= 4) {
                  invKeySchedule[invKsRow] = t;
                } else {
                  invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
                }
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },
            decryptBlock: function(M, offset) {
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
              this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
            },
            _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
              var nRounds = this._nRounds;
              var s0 = M[offset] ^ keySchedule[0];
              var s1 = M[offset + 1] ^ keySchedule[1];
              var s2 = M[offset + 2] ^ keySchedule[2];
              var s3 = M[offset + 3] ^ keySchedule[3];
              var ksRow = 4;
              for (var round = 1; round < nRounds; round++) {
                var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
              }
              var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
              var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
              var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
              var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
              M[offset] = t0;
              M[offset + 1] = t1;
              M[offset + 2] = t2;
              M[offset + 3] = t3;
            },
            keySize: 256 / 32
          });
          C.AES = BlockCipher._createHelper(AES);
        })();
        return CryptoJS.AES;
      });
    }
  });

  // node_modules/crypto-js/tripledes.js
  var require_tripledes = __commonJS({
    "node_modules/crypto-js/tripledes.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var PC1 = [
            57,
            49,
            41,
            33,
            25,
            17,
            9,
            1,
            58,
            50,
            42,
            34,
            26,
            18,
            10,
            2,
            59,
            51,
            43,
            35,
            27,
            19,
            11,
            3,
            60,
            52,
            44,
            36,
            63,
            55,
            47,
            39,
            31,
            23,
            15,
            7,
            62,
            54,
            46,
            38,
            30,
            22,
            14,
            6,
            61,
            53,
            45,
            37,
            29,
            21,
            13,
            5,
            28,
            20,
            12,
            4
          ];
          var PC2 = [
            14,
            17,
            11,
            24,
            1,
            5,
            3,
            28,
            15,
            6,
            21,
            10,
            23,
            19,
            12,
            4,
            26,
            8,
            16,
            7,
            27,
            20,
            13,
            2,
            41,
            52,
            31,
            37,
            47,
            55,
            30,
            40,
            51,
            45,
            33,
            48,
            44,
            49,
            39,
            56,
            34,
            53,
            46,
            42,
            50,
            36,
            29,
            32
          ];
          var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
          var SBOX_P = [
            {
              0: 8421888,
              268435456: 32768,
              536870912: 8421378,
              805306368: 2,
              1073741824: 512,
              1342177280: 8421890,
              1610612736: 8389122,
              1879048192: 8388608,
              2147483648: 514,
              2415919104: 8389120,
              2684354560: 33280,
              2952790016: 8421376,
              3221225472: 32770,
              3489660928: 8388610,
              3758096384: 0,
              4026531840: 33282,
              134217728: 0,
              402653184: 8421890,
              671088640: 33282,
              939524096: 32768,
              1207959552: 8421888,
              1476395008: 512,
              1744830464: 8421378,
              2013265920: 2,
              2281701376: 8389120,
              2550136832: 33280,
              2818572288: 8421376,
              3087007744: 8389122,
              3355443200: 8388610,
              3623878656: 32770,
              3892314112: 514,
              4160749568: 8388608,
              1: 32768,
              268435457: 2,
              536870913: 8421888,
              805306369: 8388608,
              1073741825: 8421378,
              1342177281: 33280,
              1610612737: 512,
              1879048193: 8389122,
              2147483649: 8421890,
              2415919105: 8421376,
              2684354561: 8388610,
              2952790017: 33282,
              3221225473: 514,
              3489660929: 8389120,
              3758096385: 32770,
              4026531841: 0,
              134217729: 8421890,
              402653185: 8421376,
              671088641: 8388608,
              939524097: 512,
              1207959553: 32768,
              1476395009: 8388610,
              1744830465: 2,
              2013265921: 33282,
              2281701377: 32770,
              2550136833: 8389122,
              2818572289: 514,
              3087007745: 8421888,
              3355443201: 8389120,
              3623878657: 0,
              3892314113: 33280,
              4160749569: 8421378
            },
            {
              0: 1074282512,
              16777216: 16384,
              33554432: 524288,
              50331648: 1074266128,
              67108864: 1073741840,
              83886080: 1074282496,
              100663296: 1073758208,
              117440512: 16,
              134217728: 540672,
              150994944: 1073758224,
              167772160: 1073741824,
              184549376: 540688,
              201326592: 524304,
              218103808: 0,
              234881024: 16400,
              251658240: 1074266112,
              8388608: 1073758208,
              25165824: 540688,
              41943040: 16,
              58720256: 1073758224,
              75497472: 1074282512,
              92274688: 1073741824,
              109051904: 524288,
              125829120: 1074266128,
              142606336: 524304,
              159383552: 0,
              176160768: 16384,
              192937984: 1074266112,
              209715200: 1073741840,
              226492416: 540672,
              243269632: 1074282496,
              260046848: 16400,
              268435456: 0,
              285212672: 1074266128,
              301989888: 1073758224,
              318767104: 1074282496,
              335544320: 1074266112,
              352321536: 16,
              369098752: 540688,
              385875968: 16384,
              402653184: 16400,
              419430400: 524288,
              436207616: 524304,
              452984832: 1073741840,
              469762048: 540672,
              486539264: 1073758208,
              503316480: 1073741824,
              520093696: 1074282512,
              276824064: 540688,
              293601280: 524288,
              310378496: 1074266112,
              327155712: 16384,
              343932928: 1073758208,
              360710144: 1074282512,
              377487360: 16,
              394264576: 1073741824,
              411041792: 1074282496,
              427819008: 1073741840,
              444596224: 1073758224,
              461373440: 524304,
              478150656: 0,
              494927872: 16400,
              511705088: 1074266128,
              528482304: 540672
            },
            {
              0: 260,
              1048576: 0,
              2097152: 67109120,
              3145728: 65796,
              4194304: 65540,
              5242880: 67108868,
              6291456: 67174660,
              7340032: 67174400,
              8388608: 67108864,
              9437184: 67174656,
              10485760: 65792,
              11534336: 67174404,
              12582912: 67109124,
              13631488: 65536,
              14680064: 4,
              15728640: 256,
              524288: 67174656,
              1572864: 67174404,
              2621440: 0,
              3670016: 67109120,
              4718592: 67108868,
              5767168: 65536,
              6815744: 65540,
              7864320: 260,
              8912896: 4,
              9961472: 256,
              11010048: 67174400,
              12058624: 65796,
              13107200: 65792,
              14155776: 67109124,
              15204352: 67174660,
              16252928: 67108864,
              16777216: 67174656,
              17825792: 65540,
              18874368: 65536,
              19922944: 67109120,
              20971520: 256,
              22020096: 67174660,
              23068672: 67108868,
              24117248: 0,
              25165824: 67109124,
              26214400: 67108864,
              27262976: 4,
              28311552: 65792,
              29360128: 67174400,
              30408704: 260,
              31457280: 65796,
              32505856: 67174404,
              17301504: 67108864,
              18350080: 260,
              19398656: 67174656,
              20447232: 0,
              21495808: 65540,
              22544384: 67109120,
              23592960: 256,
              24641536: 67174404,
              25690112: 65536,
              26738688: 67174660,
              27787264: 65796,
              28835840: 67108868,
              29884416: 67109124,
              30932992: 67174400,
              31981568: 4,
              33030144: 65792
            },
            {
              0: 2151682048,
              65536: 2147487808,
              131072: 4198464,
              196608: 2151677952,
              262144: 0,
              327680: 4198400,
              393216: 2147483712,
              458752: 4194368,
              524288: 2147483648,
              589824: 4194304,
              655360: 64,
              720896: 2147487744,
              786432: 2151678016,
              851968: 4160,
              917504: 4096,
              983040: 2151682112,
              32768: 2147487808,
              98304: 64,
              163840: 2151678016,
              229376: 2147487744,
              294912: 4198400,
              360448: 2151682112,
              425984: 0,
              491520: 2151677952,
              557056: 4096,
              622592: 2151682048,
              688128: 4194304,
              753664: 4160,
              819200: 2147483648,
              884736: 4194368,
              950272: 4198464,
              1015808: 2147483712,
              1048576: 4194368,
              1114112: 4198400,
              1179648: 2147483712,
              1245184: 0,
              1310720: 4160,
              1376256: 2151678016,
              1441792: 2151682048,
              1507328: 2147487808,
              1572864: 2151682112,
              1638400: 2147483648,
              1703936: 2151677952,
              1769472: 4198464,
              1835008: 2147487744,
              1900544: 4194304,
              1966080: 64,
              2031616: 4096,
              1081344: 2151677952,
              1146880: 2151682112,
              1212416: 0,
              1277952: 4198400,
              1343488: 4194368,
              1409024: 2147483648,
              1474560: 2147487808,
              1540096: 64,
              1605632: 2147483712,
              1671168: 4096,
              1736704: 2147487744,
              1802240: 2151678016,
              1867776: 4160,
              1933312: 2151682048,
              1998848: 4194304,
              2064384: 4198464
            },
            {
              0: 128,
              4096: 17039360,
              8192: 262144,
              12288: 536870912,
              16384: 537133184,
              20480: 16777344,
              24576: 553648256,
              28672: 262272,
              32768: 16777216,
              36864: 537133056,
              40960: 536871040,
              45056: 553910400,
              49152: 553910272,
              53248: 0,
              57344: 17039488,
              61440: 553648128,
              2048: 17039488,
              6144: 553648256,
              10240: 128,
              14336: 17039360,
              18432: 262144,
              22528: 537133184,
              26624: 553910272,
              30720: 536870912,
              34816: 537133056,
              38912: 0,
              43008: 553910400,
              47104: 16777344,
              51200: 536871040,
              55296: 553648128,
              59392: 16777216,
              63488: 262272,
              65536: 262144,
              69632: 128,
              73728: 536870912,
              77824: 553648256,
              81920: 16777344,
              86016: 553910272,
              90112: 537133184,
              94208: 16777216,
              98304: 553910400,
              102400: 553648128,
              106496: 17039360,
              110592: 537133056,
              114688: 262272,
              118784: 536871040,
              122880: 0,
              126976: 17039488,
              67584: 553648256,
              71680: 16777216,
              75776: 17039360,
              79872: 537133184,
              83968: 536870912,
              88064: 17039488,
              92160: 128,
              96256: 553910272,
              100352: 262272,
              104448: 553910400,
              108544: 0,
              112640: 553648128,
              116736: 16777344,
              120832: 262144,
              124928: 537133056,
              129024: 536871040
            },
            {
              0: 268435464,
              256: 8192,
              512: 270532608,
              768: 270540808,
              1024: 268443648,
              1280: 2097152,
              1536: 2097160,
              1792: 268435456,
              2048: 0,
              2304: 268443656,
              2560: 2105344,
              2816: 8,
              3072: 270532616,
              3328: 2105352,
              3584: 8200,
              3840: 270540800,
              128: 270532608,
              384: 270540808,
              640: 8,
              896: 2097152,
              1152: 2105352,
              1408: 268435464,
              1664: 268443648,
              1920: 8200,
              2176: 2097160,
              2432: 8192,
              2688: 268443656,
              2944: 270532616,
              3200: 0,
              3456: 270540800,
              3712: 2105344,
              3968: 268435456,
              4096: 268443648,
              4352: 270532616,
              4608: 270540808,
              4864: 8200,
              5120: 2097152,
              5376: 268435456,
              5632: 268435464,
              5888: 2105344,
              6144: 2105352,
              6400: 0,
              6656: 8,
              6912: 270532608,
              7168: 8192,
              7424: 268443656,
              7680: 270540800,
              7936: 2097160,
              4224: 8,
              4480: 2105344,
              4736: 2097152,
              4992: 268435464,
              5248: 268443648,
              5504: 8200,
              5760: 270540808,
              6016: 270532608,
              6272: 270540800,
              6528: 270532616,
              6784: 8192,
              7040: 2105352,
              7296: 2097160,
              7552: 0,
              7808: 268435456,
              8064: 268443656
            },
            {
              0: 1048576,
              16: 33555457,
              32: 1024,
              48: 1049601,
              64: 34604033,
              80: 0,
              96: 1,
              112: 34603009,
              128: 33555456,
              144: 1048577,
              160: 33554433,
              176: 34604032,
              192: 34603008,
              208: 1025,
              224: 1049600,
              240: 33554432,
              8: 34603009,
              24: 0,
              40: 33555457,
              56: 34604032,
              72: 1048576,
              88: 33554433,
              104: 33554432,
              120: 1025,
              136: 1049601,
              152: 33555456,
              168: 34603008,
              184: 1048577,
              200: 1024,
              216: 34604033,
              232: 1,
              248: 1049600,
              256: 33554432,
              272: 1048576,
              288: 33555457,
              304: 34603009,
              320: 1048577,
              336: 33555456,
              352: 34604032,
              368: 1049601,
              384: 1025,
              400: 34604033,
              416: 1049600,
              432: 1,
              448: 0,
              464: 34603008,
              480: 33554433,
              496: 1024,
              264: 1049600,
              280: 33555457,
              296: 34603009,
              312: 1,
              328: 33554432,
              344: 1048576,
              360: 1025,
              376: 34604032,
              392: 33554433,
              408: 34603008,
              424: 0,
              440: 34604033,
              456: 1049601,
              472: 1024,
              488: 33555456,
              504: 1048577
            },
            {
              0: 134219808,
              1: 131072,
              2: 134217728,
              3: 32,
              4: 131104,
              5: 134350880,
              6: 134350848,
              7: 2048,
              8: 134348800,
              9: 134219776,
              10: 133120,
              11: 134348832,
              12: 2080,
              13: 0,
              14: 134217760,
              15: 133152,
              2147483648: 2048,
              2147483649: 134350880,
              2147483650: 134219808,
              2147483651: 134217728,
              2147483652: 134348800,
              2147483653: 133120,
              2147483654: 133152,
              2147483655: 32,
              2147483656: 134217760,
              2147483657: 2080,
              2147483658: 131104,
              2147483659: 134350848,
              2147483660: 0,
              2147483661: 134348832,
              2147483662: 134219776,
              2147483663: 131072,
              16: 133152,
              17: 134350848,
              18: 32,
              19: 2048,
              20: 134219776,
              21: 134217760,
              22: 134348832,
              23: 131072,
              24: 0,
              25: 131104,
              26: 134348800,
              27: 134219808,
              28: 134350880,
              29: 133120,
              30: 2080,
              31: 134217728,
              2147483664: 131072,
              2147483665: 2048,
              2147483666: 134348832,
              2147483667: 133152,
              2147483668: 32,
              2147483669: 134348800,
              2147483670: 134217728,
              2147483671: 134219808,
              2147483672: 134350880,
              2147483673: 134217760,
              2147483674: 134219776,
              2147483675: 0,
              2147483676: 133120,
              2147483677: 2080,
              2147483678: 131104,
              2147483679: 134350848
            }
          ];
          var SBOX_MASK = [
            4160749569,
            528482304,
            33030144,
            2064384,
            129024,
            8064,
            504,
            2147483679
          ];
          var DES = C_algo.DES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keyBits = [];
              for (var i = 0; i < 56; i++) {
                var keyBitPos = PC1[i] - 1;
                keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
              }
              var subKeys = this._subKeys = [];
              for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                var subKey = subKeys[nSubKey] = [];
                var bitShift = BIT_SHIFTS[nSubKey];
                for (var i = 0; i < 24; i++) {
                  subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;
                  subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
                }
                subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
                for (var i = 1; i < 7; i++) {
                  subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
                }
                subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
              }
              var invSubKeys = this._invSubKeys = [];
              for (var i = 0; i < 16; i++) {
                invSubKeys[i] = subKeys[15 - i];
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._subKeys);
            },
            decryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._invSubKeys);
            },
            _doCryptBlock: function(M, offset, subKeys) {
              this._lBlock = M[offset];
              this._rBlock = M[offset + 1];
              exchangeLR.call(this, 4, 252645135);
              exchangeLR.call(this, 16, 65535);
              exchangeRL.call(this, 2, 858993459);
              exchangeRL.call(this, 8, 16711935);
              exchangeLR.call(this, 1, 1431655765);
              for (var round = 0; round < 16; round++) {
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock;
                var f = 0;
                for (var i = 0; i < 8; i++) {
                  f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f;
              }
              var t = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = t;
              exchangeLR.call(this, 1, 1431655765);
              exchangeRL.call(this, 8, 16711935);
              exchangeRL.call(this, 2, 858993459);
              exchangeLR.call(this, 16, 65535);
              exchangeLR.call(this, 4, 252645135);
              M[offset] = this._lBlock;
              M[offset + 1] = this._rBlock;
            },
            keySize: 64 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          function exchangeLR(offset, mask) {
            var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
            this._rBlock ^= t;
            this._lBlock ^= t << offset;
          }
          function exchangeRL(offset, mask) {
            var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
            this._lBlock ^= t;
            this._rBlock ^= t << offset;
          }
          C.DES = BlockCipher._createHelper(DES);
          var TripleDES = C_algo.TripleDES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
              }
              var key1 = keyWords.slice(0, 2);
              var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
              var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
              this._des1 = DES.createEncryptor(WordArray.create(key1));
              this._des2 = DES.createEncryptor(WordArray.create(key2));
              this._des3 = DES.createEncryptor(WordArray.create(key3));
            },
            encryptBlock: function(M, offset) {
              this._des1.encryptBlock(M, offset);
              this._des2.decryptBlock(M, offset);
              this._des3.encryptBlock(M, offset);
            },
            decryptBlock: function(M, offset) {
              this._des3.decryptBlock(M, offset);
              this._des2.encryptBlock(M, offset);
              this._des1.decryptBlock(M, offset);
            },
            keySize: 192 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          C.TripleDES = BlockCipher._createHelper(TripleDES);
        })();
        return CryptoJS.TripleDES;
      });
    }
  });

  // node_modules/crypto-js/rc4.js
  var require_rc4 = __commonJS({
    "node_modules/crypto-js/rc4.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var RC4 = C_algo.RC4 = StreamCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keySigBytes = key.sigBytes;
              var S = this._S = [];
              for (var i = 0; i < 256; i++) {
                S[i] = i;
              }
              for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
                j = (j + S[i] + keyByte) % 256;
                var t = S[i];
                S[i] = S[j];
                S[j] = t;
              }
              this._i = this._j = 0;
            },
            _doProcessBlock: function(M, offset) {
              M[offset] ^= generateKeystreamWord.call(this);
            },
            keySize: 256 / 32,
            ivSize: 0
          });
          function generateKeystreamWord() {
            var S = this._S;
            var i = this._i;
            var j = this._j;
            var keystreamWord = 0;
            for (var n = 0; n < 4; n++) {
              i = (i + 1) % 256;
              j = (j + S[i]) % 256;
              var t = S[i];
              S[i] = S[j];
              S[j] = t;
              keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
            }
            this._i = i;
            this._j = j;
            return keystreamWord;
          }
          C.RC4 = StreamCipher._createHelper(RC4);
          var RC4Drop = C_algo.RC4Drop = RC4.extend({
            /**
             * Configuration options.
             *
             * @property {number} drop The number of keystream words to drop. Default 192
             */
            cfg: RC4.cfg.extend({
              drop: 192
            }),
            _doReset: function() {
              RC4._doReset.call(this);
              for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
              }
            }
          });
          C.RC4Drop = StreamCipher._createHelper(RC4Drop);
        })();
        return CryptoJS.RC4;
      });
    }
  });

  // node_modules/crypto-js/rabbit.js
  var require_rabbit = __commonJS({
    "node_modules/crypto-js/rabbit.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var Rabbit = C_algo.Rabbit = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              for (var i = 0; i < 4; i++) {
                K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
              }
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
              for (var i = 0; i < 8; i++) {
                C2[i] ^= X[i + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i2 & 4294901760;
                var i3 = i2 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i2;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i2;
                C2[7] ^= i3;
                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i = 0; i < 4; i++) {
                S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i = 0; i < 8; i++) {
              C_[i] = C2[i];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C2[i];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.Rabbit = StreamCipher._createHelper(Rabbit);
        })();
        return CryptoJS.Rabbit;
      });
    }
  });

  // node_modules/crypto-js/rabbit-legacy.js
  var require_rabbit_legacy = __commonJS({
    "node_modules/crypto-js/rabbit-legacy.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
              for (var i = 0; i < 8; i++) {
                C2[i] ^= X[i + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i2 & 4294901760;
                var i3 = i2 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i2;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i2;
                C2[7] ^= i3;
                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i = 0; i < 4; i++) {
                S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i = 0; i < 8; i++) {
              C_[i] = C2[i];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C2[i];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        })();
        return CryptoJS.RabbitLegacy;
      });
    }
  });

  // node_modules/crypto-js/blowfish.js
  var require_blowfish = __commonJS({
    "node_modules/crypto-js/blowfish.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          const N = 16;
          const ORIG_P = [
            608135816,
            2242054355,
            320440878,
            57701188,
            2752067618,
            698298832,
            137296536,
            3964562569,
            1160258022,
            953160567,
            3193202383,
            887688300,
            3232508343,
            3380367581,
            1065670069,
            3041331479,
            2450970073,
            2306472731
          ];
          const ORIG_S = [
            [
              3509652390,
              2564797868,
              805139163,
              3491422135,
              3101798381,
              1780907670,
              3128725573,
              4046225305,
              614570311,
              3012652279,
              134345442,
              2240740374,
              1667834072,
              1901547113,
              2757295779,
              4103290238,
              227898511,
              1921955416,
              1904987480,
              2182433518,
              2069144605,
              3260701109,
              2620446009,
              720527379,
              3318853667,
              677414384,
              3393288472,
              3101374703,
              2390351024,
              1614419982,
              1822297739,
              2954791486,
              3608508353,
              3174124327,
              2024746970,
              1432378464,
              3864339955,
              2857741204,
              1464375394,
              1676153920,
              1439316330,
              715854006,
              3033291828,
              289532110,
              2706671279,
              2087905683,
              3018724369,
              1668267050,
              732546397,
              1947742710,
              3462151702,
              2609353502,
              2950085171,
              1814351708,
              2050118529,
              680887927,
              999245976,
              1800124847,
              3300911131,
              1713906067,
              1641548236,
              4213287313,
              1216130144,
              1575780402,
              4018429277,
              3917837745,
              3693486850,
              3949271944,
              596196993,
              3549867205,
              258830323,
              2213823033,
              772490370,
              2760122372,
              1774776394,
              2652871518,
              566650946,
              4142492826,
              1728879713,
              2882767088,
              1783734482,
              3629395816,
              2517608232,
              2874225571,
              1861159788,
              326777828,
              3124490320,
              2130389656,
              2716951837,
              967770486,
              1724537150,
              2185432712,
              2364442137,
              1164943284,
              2105845187,
              998989502,
              3765401048,
              2244026483,
              1075463327,
              1455516326,
              1322494562,
              910128902,
              469688178,
              1117454909,
              936433444,
              3490320968,
              3675253459,
              1240580251,
              122909385,
              2157517691,
              634681816,
              4142456567,
              3825094682,
              3061402683,
              2540495037,
              79693498,
              3249098678,
              1084186820,
              1583128258,
              426386531,
              1761308591,
              1047286709,
              322548459,
              995290223,
              1845252383,
              2603652396,
              3431023940,
              2942221577,
              3202600964,
              3727903485,
              1712269319,
              422464435,
              3234572375,
              1170764815,
              3523960633,
              3117677531,
              1434042557,
              442511882,
              3600875718,
              1076654713,
              1738483198,
              4213154764,
              2393238008,
              3677496056,
              1014306527,
              4251020053,
              793779912,
              2902807211,
              842905082,
              4246964064,
              1395751752,
              1040244610,
              2656851899,
              3396308128,
              445077038,
              3742853595,
              3577915638,
              679411651,
              2892444358,
              2354009459,
              1767581616,
              3150600392,
              3791627101,
              3102740896,
              284835224,
              4246832056,
              1258075500,
              768725851,
              2589189241,
              3069724005,
              3532540348,
              1274779536,
              3789419226,
              2764799539,
              1660621633,
              3471099624,
              4011903706,
              913787905,
              3497959166,
              737222580,
              2514213453,
              2928710040,
              3937242737,
              1804850592,
              3499020752,
              2949064160,
              2386320175,
              2390070455,
              2415321851,
              4061277028,
              2290661394,
              2416832540,
              1336762016,
              1754252060,
              3520065937,
              3014181293,
              791618072,
              3188594551,
              3933548030,
              2332172193,
              3852520463,
              3043980520,
              413987798,
              3465142937,
              3030929376,
              4245938359,
              2093235073,
              3534596313,
              375366246,
              2157278981,
              2479649556,
              555357303,
              3870105701,
              2008414854,
              3344188149,
              4221384143,
              3956125452,
              2067696032,
              3594591187,
              2921233993,
              2428461,
              544322398,
              577241275,
              1471733935,
              610547355,
              4027169054,
              1432588573,
              1507829418,
              2025931657,
              3646575487,
              545086370,
              48609733,
              2200306550,
              1653985193,
              298326376,
              1316178497,
              3007786442,
              2064951626,
              458293330,
              2589141269,
              3591329599,
              3164325604,
              727753846,
              2179363840,
              146436021,
              1461446943,
              4069977195,
              705550613,
              3059967265,
              3887724982,
              4281599278,
              3313849956,
              1404054877,
              2845806497,
              146425753,
              1854211946
            ],
            [
              1266315497,
              3048417604,
              3681880366,
              3289982499,
              290971e4,
              1235738493,
              2632868024,
              2414719590,
              3970600049,
              1771706367,
              1449415276,
              3266420449,
              422970021,
              1963543593,
              2690192192,
              3826793022,
              1062508698,
              1531092325,
              1804592342,
              2583117782,
              2714934279,
              4024971509,
              1294809318,
              4028980673,
              1289560198,
              2221992742,
              1669523910,
              35572830,
              157838143,
              1052438473,
              1016535060,
              1802137761,
              1753167236,
              1386275462,
              3080475397,
              2857371447,
              1040679964,
              2145300060,
              2390574316,
              1461121720,
              2956646967,
              4031777805,
              4028374788,
              33600511,
              2920084762,
              1018524850,
              629373528,
              3691585981,
              3515945977,
              2091462646,
              2486323059,
              586499841,
              988145025,
              935516892,
              3367335476,
              2599673255,
              2839830854,
              265290510,
              3972581182,
              2759138881,
              3795373465,
              1005194799,
              847297441,
              406762289,
              1314163512,
              1332590856,
              1866599683,
              4127851711,
              750260880,
              613907577,
              1450815602,
              3165620655,
              3734664991,
              3650291728,
              3012275730,
              3704569646,
              1427272223,
              778793252,
              1343938022,
              2676280711,
              2052605720,
              1946737175,
              3164576444,
              3914038668,
              3967478842,
              3682934266,
              1661551462,
              3294938066,
              4011595847,
              840292616,
              3712170807,
              616741398,
              312560963,
              711312465,
              1351876610,
              322626781,
              1910503582,
              271666773,
              2175563734,
              1594956187,
              70604529,
              3617834859,
              1007753275,
              1495573769,
              4069517037,
              2549218298,
              2663038764,
              504708206,
              2263041392,
              3941167025,
              2249088522,
              1514023603,
              1998579484,
              1312622330,
              694541497,
              2582060303,
              2151582166,
              1382467621,
              776784248,
              2618340202,
              3323268794,
              2497899128,
              2784771155,
              503983604,
              4076293799,
              907881277,
              423175695,
              432175456,
              1378068232,
              4145222326,
              3954048622,
              3938656102,
              3820766613,
              2793130115,
              2977904593,
              26017576,
              3274890735,
              3194772133,
              1700274565,
              1756076034,
              4006520079,
              3677328699,
              720338349,
              1533947780,
              354530856,
              688349552,
              3973924725,
              1637815568,
              332179504,
              3949051286,
              53804574,
              2852348879,
              3044236432,
              1282449977,
              3583942155,
              3416972820,
              4006381244,
              1617046695,
              2628476075,
              3002303598,
              1686838959,
              431878346,
              2686675385,
              1700445008,
              1080580658,
              1009431731,
              832498133,
              3223435511,
              2605976345,
              2271191193,
              2516031870,
              1648197032,
              4164389018,
              2548247927,
              300782431,
              375919233,
              238389289,
              3353747414,
              2531188641,
              2019080857,
              1475708069,
              455242339,
              2609103871,
              448939670,
              3451063019,
              1395535956,
              2413381860,
              1841049896,
              1491858159,
              885456874,
              4264095073,
              4001119347,
              1565136089,
              3898914787,
              1108368660,
              540939232,
              1173283510,
              2745871338,
              3681308437,
              4207628240,
              3343053890,
              4016749493,
              1699691293,
              1103962373,
              3625875870,
              2256883143,
              3830138730,
              1031889488,
              3479347698,
              1535977030,
              4236805024,
              3251091107,
              2132092099,
              1774941330,
              1199868427,
              1452454533,
              157007616,
              2904115357,
              342012276,
              595725824,
              1480756522,
              206960106,
              497939518,
              591360097,
              863170706,
              2375253569,
              3596610801,
              1814182875,
              2094937945,
              3421402208,
              1082520231,
              3463918190,
              2785509508,
              435703966,
              3908032597,
              1641649973,
              2842273706,
              3305899714,
              1510255612,
              2148256476,
              2655287854,
              3276092548,
              4258621189,
              236887753,
              3681803219,
              274041037,
              1734335097,
              3815195456,
              3317970021,
              1899903192,
              1026095262,
              4050517792,
              356393447,
              2410691914,
              3873677099,
              3682840055
            ],
            [
              3913112168,
              2491498743,
              4132185628,
              2489919796,
              1091903735,
              1979897079,
              3170134830,
              3567386728,
              3557303409,
              857797738,
              1136121015,
              1342202287,
              507115054,
              2535736646,
              337727348,
              3213592640,
              1301675037,
              2528481711,
              1895095763,
              1721773893,
              3216771564,
              62756741,
              2142006736,
              835421444,
              2531993523,
              1442658625,
              3659876326,
              2882144922,
              676362277,
              1392781812,
              170690266,
              3921047035,
              1759253602,
              3611846912,
              1745797284,
              664899054,
              1329594018,
              3901205900,
              3045908486,
              2062866102,
              2865634940,
              3543621612,
              3464012697,
              1080764994,
              553557557,
              3656615353,
              3996768171,
              991055499,
              499776247,
              1265440854,
              648242737,
              3940784050,
              980351604,
              3713745714,
              1749149687,
              3396870395,
              4211799374,
              3640570775,
              1161844396,
              3125318951,
              1431517754,
              545492359,
              4268468663,
              3499529547,
              1437099964,
              2702547544,
              3433638243,
              2581715763,
              2787789398,
              1060185593,
              1593081372,
              2418618748,
              4260947970,
              69676912,
              2159744348,
              86519011,
              2512459080,
              3838209314,
              1220612927,
              3339683548,
              133810670,
              1090789135,
              1078426020,
              1569222167,
              845107691,
              3583754449,
              4072456591,
              1091646820,
              628848692,
              1613405280,
              3757631651,
              526609435,
              236106946,
              48312990,
              2942717905,
              3402727701,
              1797494240,
              859738849,
              992217954,
              4005476642,
              2243076622,
              3870952857,
              3732016268,
              765654824,
              3490871365,
              2511836413,
              1685915746,
              3888969200,
              1414112111,
              2273134842,
              3281911079,
              4080962846,
              172450625,
              2569994100,
              980381355,
              4109958455,
              2819808352,
              2716589560,
              2568741196,
              3681446669,
              3329971472,
              1835478071,
              660984891,
              3704678404,
              4045999559,
              3422617507,
              3040415634,
              1762651403,
              1719377915,
              3470491036,
              2693910283,
              3642056355,
              3138596744,
              1364962596,
              2073328063,
              1983633131,
              926494387,
              3423689081,
              2150032023,
              4096667949,
              1749200295,
              3328846651,
              309677260,
              2016342300,
              1779581495,
              3079819751,
              111262694,
              1274766160,
              443224088,
              298511866,
              1025883608,
              3806446537,
              1145181785,
              168956806,
              3641502830,
              3584813610,
              1689216846,
              3666258015,
              3200248200,
              1692713982,
              2646376535,
              4042768518,
              1618508792,
              1610833997,
              3523052358,
              4130873264,
              2001055236,
              3610705100,
              2202168115,
              4028541809,
              2961195399,
              1006657119,
              2006996926,
              3186142756,
              1430667929,
              3210227297,
              1314452623,
              4074634658,
              4101304120,
              2273951170,
              1399257539,
              3367210612,
              3027628629,
              1190975929,
              2062231137,
              2333990788,
              2221543033,
              2438960610,
              1181637006,
              548689776,
              2362791313,
              3372408396,
              3104550113,
              3145860560,
              296247880,
              1970579870,
              3078560182,
              3769228297,
              1714227617,
              3291629107,
              3898220290,
              166772364,
              1251581989,
              493813264,
              448347421,
              195405023,
              2709975567,
              677966185,
              3703036547,
              1463355134,
              2715995803,
              1338867538,
              1343315457,
              2802222074,
              2684532164,
              233230375,
              2599980071,
              2000651841,
              3277868038,
              1638401717,
              4028070440,
              3237316320,
              6314154,
              819756386,
              300326615,
              590932579,
              1405279636,
              3267499572,
              3150704214,
              2428286686,
              3959192993,
              3461946742,
              1862657033,
              1266418056,
              963775037,
              2089974820,
              2263052895,
              1917689273,
              448879540,
              3550394620,
              3981727096,
              150775221,
              3627908307,
              1303187396,
              508620638,
              2975983352,
              2726630617,
              1817252668,
              1876281319,
              1457606340,
              908771278,
              3720792119,
              3617206836,
              2455994898,
              1729034894,
              1080033504
            ],
            [
              976866871,
              3556439503,
              2881648439,
              1522871579,
              1555064734,
              1336096578,
              3548522304,
              2579274686,
              3574697629,
              3205460757,
              3593280638,
              3338716283,
              3079412587,
              564236357,
              2993598910,
              1781952180,
              1464380207,
              3163844217,
              3332601554,
              1699332808,
              1393555694,
              1183702653,
              3581086237,
              1288719814,
              691649499,
              2847557200,
              2895455976,
              3193889540,
              2717570544,
              1781354906,
              1676643554,
              2592534050,
              3230253752,
              1126444790,
              2770207658,
              2633158820,
              2210423226,
              2615765581,
              2414155088,
              3127139286,
              673620729,
              2805611233,
              1269405062,
              4015350505,
              3341807571,
              4149409754,
              1057255273,
              2012875353,
              2162469141,
              2276492801,
              2601117357,
              993977747,
              3918593370,
              2654263191,
              753973209,
              36408145,
              2530585658,
              25011837,
              3520020182,
              2088578344,
              530523599,
              2918365339,
              1524020338,
              1518925132,
              3760827505,
              3759777254,
              1202760957,
              3985898139,
              3906192525,
              674977740,
              4174734889,
              2031300136,
              2019492241,
              3983892565,
              4153806404,
              3822280332,
              352677332,
              2297720250,
              60907813,
              90501309,
              3286998549,
              1016092578,
              2535922412,
              2839152426,
              457141659,
              509813237,
              4120667899,
              652014361,
              1966332200,
              2975202805,
              55981186,
              2327461051,
              676427537,
              3255491064,
              2882294119,
              3433927263,
              1307055953,
              942726286,
              933058658,
              2468411793,
              3933900994,
              4215176142,
              1361170020,
              2001714738,
              2830558078,
              3274259782,
              1222529897,
              1679025792,
              2729314320,
              3714953764,
              1770335741,
              151462246,
              3013232138,
              1682292957,
              1483529935,
              471910574,
              1539241949,
              458788160,
              3436315007,
              1807016891,
              3718408830,
              978976581,
              1043663428,
              3165965781,
              1927990952,
              4200891579,
              2372276910,
              3208408903,
              3533431907,
              1412390302,
              2931980059,
              4132332400,
              1947078029,
              3881505623,
              4168226417,
              2941484381,
              1077988104,
              1320477388,
              886195818,
              18198404,
              3786409e3,
              2509781533,
              112762804,
              3463356488,
              1866414978,
              891333506,
              18488651,
              661792760,
              1628790961,
              3885187036,
              3141171499,
              876946877,
              2693282273,
              1372485963,
              791857591,
              2686433993,
              3759982718,
              3167212022,
              3472953795,
              2716379847,
              445679433,
              3561995674,
              3504004811,
              3574258232,
              54117162,
              3331405415,
              2381918588,
              3769707343,
              4154350007,
              1140177722,
              4074052095,
              668550556,
              3214352940,
              367459370,
              261225585,
              2610173221,
              4209349473,
              3468074219,
              3265815641,
              314222801,
              3066103646,
              3808782860,
              282218597,
              3406013506,
              3773591054,
              379116347,
              1285071038,
              846784868,
              2669647154,
              3771962079,
              3550491691,
              2305946142,
              453669953,
              1268987020,
              3317592352,
              3279303384,
              3744833421,
              2610507566,
              3859509063,
              266596637,
              3847019092,
              517658769,
              3462560207,
              3443424879,
              370717030,
              4247526661,
              2224018117,
              4143653529,
              4112773975,
              2788324899,
              2477274417,
              1456262402,
              2901442914,
              1517677493,
              1846949527,
              2295493580,
              3734397586,
              2176403920,
              1280348187,
              1908823572,
              3871786941,
              846861322,
              1172426758,
              3287448474,
              3383383037,
              1655181056,
              3139813346,
              901632758,
              1897031941,
              2986607138,
              3066810236,
              3447102507,
              1393639104,
              373351379,
              950779232,
              625454576,
              3124240540,
              4148612726,
              2007998917,
              544563296,
              2244738638,
              2330496472,
              2058025392,
              1291430526,
              424198748,
              50039436,
              29584100,
              3605783033,
              2429876329,
              2791104160,
              1057563949,
              3255363231,
              3075367218,
              3463963227,
              1469046755,
              985887462
            ]
          ];
          var BLOWFISH_CTX = {
            pbox: [],
            sbox: []
          };
          function F(ctx, x) {
            let a = x >> 24 & 255;
            let b = x >> 16 & 255;
            let c = x >> 8 & 255;
            let d = x & 255;
            let y = ctx.sbox[0][a] + ctx.sbox[1][b];
            y = y ^ ctx.sbox[2][c];
            y = y + ctx.sbox[3][d];
            return y;
          }
          function BlowFish_Encrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i = 0; i < N; ++i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[N];
            Xl = Xl ^ ctx.pbox[N + 1];
            return { left: Xl, right: Xr };
          }
          function BlowFish_Decrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i = N + 1; i > 1; --i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[1];
            Xl = Xl ^ ctx.pbox[0];
            return { left: Xl, right: Xr };
          }
          function BlowFishInit(ctx, key, keysize) {
            for (let Row = 0; Row < 4; Row++) {
              ctx.sbox[Row] = [];
              for (let Col = 0; Col < 256; Col++) {
                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
              }
            }
            let keyIndex = 0;
            for (let index = 0; index < N + 2; index++) {
              ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
              keyIndex++;
              if (keyIndex >= keysize) {
                keyIndex = 0;
              }
            }
            let Data1 = 0;
            let Data2 = 0;
            let res = 0;
            for (let i = 0; i < N + 2; i += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.pbox[i] = Data1;
              ctx.pbox[i + 1] = Data2;
            }
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 256; j += 2) {
                res = BlowFish_Encrypt(ctx, Data1, Data2);
                Data1 = res.left;
                Data2 = res.right;
                ctx.sbox[i][j] = Data1;
                ctx.sbox[i][j + 1] = Data2;
              }
            }
            return true;
          }
          var Blowfish = C_algo.Blowfish = BlockCipher.extend({
            _doReset: function() {
              if (this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
            },
            encryptBlock: function(M, offset) {
              var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            decryptBlock: function(M, offset) {
              var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            blockSize: 64 / 32,
            keySize: 128 / 32,
            ivSize: 64 / 32
          });
          C.Blowfish = BlockCipher._createHelper(Blowfish);
        })();
        return CryptoJS.Blowfish;
      });
    }
  });

  // node_modules/crypto-js/index.js
  var require_crypto_js = __commonJS({
    "node_modules/crypto-js/index.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core(), require_lib_typedarrays(), require_enc_utf16(), require_enc_base64(), require_enc_base64url(), require_md5(), require_sha1(), require_sha256(), require_sha224(), require_sha512(), require_sha384(), require_sha3(), require_ripemd160(), require_hmac(), require_pbkdf2(), require_evpkdf(), require_cipher_core(), require_mode_cfb(), require_mode_ctr(), require_mode_ctr_gladman(), require_mode_ofb(), require_mode_ecb(), require_pad_ansix923(), require_pad_iso10126(), require_pad_iso97971(), require_pad_zeropadding(), require_pad_nopadding(), require_format_hex(), require_aes(), require_tripledes(), require_rc4(), require_rabbit(), require_rabbit_legacy(), require_blowfish());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./enc-base64url", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy", "./blowfish"], factory);
        } else {
          root.CryptoJS = factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        return CryptoJS;
      });
    }
  });

  // node_modules/jsbn/index.js
  var require_jsbn = __commonJS({
    "node_modules/jsbn/index.js"(exports, module) {
      (function() {
        var dbits;
        var canary = 244837814094590;
        var j_lm = (canary & 16777215) == 15715070;
        function BigInteger(a, b, c) {
          if (a != null)
            if ("number" == typeof a) this.fromNumber(a, b, c);
            else if (b == null && "string" != typeof a) this.fromString(a, 256);
            else this.fromString(a, b);
        }
        function nbi() {
          return new BigInteger(null);
        }
        function am1(i, x, w, j, c, n) {
          while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 67108864);
            w[j++] = v & 67108863;
          }
          return c;
        }
        function am2(i, x, w, j, c, n) {
          var xl = x & 32767, xh = x >> 15;
          while (--n >= 0) {
            var l = this[i] & 32767;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 1073741823;
          }
          return c;
        }
        function am3(i, x, w, j, c, n) {
          var xl = x & 16383, xh = x >> 14;
          while (--n >= 0) {
            var l = this[i] & 16383;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 16383) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 268435455;
          }
          return c;
        }
        var inBrowser = typeof navigator !== "undefined";
        if (inBrowser && j_lm && navigator.appName == "Microsoft Internet Explorer") {
          BigInteger.prototype.am = am2;
          dbits = 30;
        } else if (inBrowser && j_lm && navigator.appName != "Netscape") {
          BigInteger.prototype.am = am1;
          dbits = 26;
        } else {
          BigInteger.prototype.am = am3;
          dbits = 28;
        }
        BigInteger.prototype.DB = dbits;
        BigInteger.prototype.DM = (1 << dbits) - 1;
        BigInteger.prototype.DV = 1 << dbits;
        var BI_FP = 52;
        BigInteger.prototype.FV = Math.pow(2, BI_FP);
        BigInteger.prototype.F1 = BI_FP - dbits;
        BigInteger.prototype.F2 = 2 * dbits - BI_FP;
        var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
        var BI_RC = new Array();
        var rr, vv;
        rr = "0".charCodeAt(0);
        for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
        rr = "a".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
        rr = "A".charCodeAt(0);
        for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
        function int2char(n) {
          return BI_RM.charAt(n);
        }
        function intAt(s, i) {
          var c = BI_RC[s.charCodeAt(i)];
          return c == null ? -1 : c;
        }
        function bnpCopyTo(r) {
          for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
          r.t = this.t;
          r.s = this.s;
        }
        function bnpFromInt(x) {
          this.t = 1;
          this.s = x < 0 ? -1 : 0;
          if (x > 0) this[0] = x;
          else if (x < -1) this[0] = x + this.DV;
          else this.t = 0;
        }
        function nbv(i) {
          var r = nbi();
          r.fromInt(i);
          return r;
        }
        function bnpFromString(s, b) {
          var k;
          if (b == 16) k = 4;
          else if (b == 8) k = 3;
          else if (b == 256) k = 8;
          else if (b == 2) k = 1;
          else if (b == 32) k = 5;
          else if (b == 4) k = 2;
          else {
            this.fromRadix(s, b);
            return;
          }
          this.t = 0;
          this.s = 0;
          var i = s.length, mi = false, sh = 0;
          while (--i >= 0) {
            var x = k == 8 ? s[i] & 255 : intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-") mi = true;
              continue;
            }
            mi = false;
            if (sh == 0)
              this[this.t++] = x;
            else if (sh + k > this.DB) {
              this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
              this[this.t++] = x >> this.DB - sh;
            } else
              this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= this.DB) sh -= this.DB;
          }
          if (k == 8 && (s[0] & 128) != 0) {
            this.s = -1;
            if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
          }
          this.clamp();
          if (mi) BigInteger.ZERO.subTo(this, this);
        }
        function bnpClamp() {
          var c = this.s & this.DM;
          while (this.t > 0 && this[this.t - 1] == c) --this.t;
        }
        function bnToString(b) {
          if (this.s < 0) return "-" + this.negate().toString(b);
          var k;
          if (b == 16) k = 4;
          else if (b == 8) k = 3;
          else if (b == 2) k = 1;
          else if (b == 32) k = 5;
          else if (b == 4) k = 2;
          else return this.toRadix(b);
          var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
          var p = this.DB - i * this.DB % k;
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
              m = true;
              r = int2char(d);
            }
            while (i >= 0) {
              if (p < k) {
                d = (this[i] & (1 << p) - 1) << k - p;
                d |= this[--i] >> (p += this.DB - k);
              } else {
                d = this[i] >> (p -= k) & km;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if (d > 0) m = true;
              if (m) r += int2char(d);
            }
          }
          return m ? r : "0";
        }
        function bnNegate() {
          var r = nbi();
          BigInteger.ZERO.subTo(this, r);
          return r;
        }
        function bnAbs() {
          return this.s < 0 ? this.negate() : this;
        }
        function bnCompareTo(a) {
          var r = this.s - a.s;
          if (r != 0) return r;
          var i = this.t;
          r = i - a.t;
          if (r != 0) return this.s < 0 ? -r : r;
          while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
          return 0;
        }
        function nbits(x) {
          var r = 1, t2;
          if ((t2 = x >>> 16) != 0) {
            x = t2;
            r += 16;
          }
          if ((t2 = x >> 8) != 0) {
            x = t2;
            r += 8;
          }
          if ((t2 = x >> 4) != 0) {
            x = t2;
            r += 4;
          }
          if ((t2 = x >> 2) != 0) {
            x = t2;
            r += 2;
          }
          if ((t2 = x >> 1) != 0) {
            x = t2;
            r += 1;
          }
          return r;
        }
        function bnBitLength() {
          if (this.t <= 0) return 0;
          return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
        }
        function bnpDLShiftTo(n, r) {
          var i;
          for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
          for (i = n - 1; i >= 0; --i) r[i] = 0;
          r.t = this.t + n;
          r.s = this.s;
        }
        function bnpDRShiftTo(n, r) {
          for (var i = n; i < this.t; ++i) r[i - n] = this[i];
          r.t = Math.max(this.t - n, 0);
          r.s = this.s;
        }
        function bnpLShiftTo(n, r) {
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << cbs) - 1;
          var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
          for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = this[i] >> cbs | c;
            c = (this[i] & bm) << bs;
          }
          for (i = ds - 1; i >= 0; --i) r[i] = 0;
          r[ds] = c;
          r.t = this.t + ds + 1;
          r.s = this.s;
          r.clamp();
        }
        function bnpRShiftTo(n, r) {
          r.s = this.s;
          var ds = Math.floor(n / this.DB);
          if (ds >= this.t) {
            r.t = 0;
            return;
          }
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << bs) - 1;
          r[0] = this[ds] >> bs;
          for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
          }
          if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
          r.t = this.t - ds;
          r.clamp();
        }
        function bnpSubTo(a, r) {
          var i = 0, c = 0, m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c -= a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c -= a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c < -1) r[i++] = this.DV + c;
          else if (c > 0) r[i++] = c;
          r.t = i;
          r.clamp();
        }
        function bnpMultiplyTo(a, r) {
          var x = this.abs(), y = a.abs();
          var i = x.t;
          r.t = i + y.t;
          while (--i >= 0) r[i] = 0;
          for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
          r.s = 0;
          r.clamp();
          if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
        }
        function bnpSquareTo(r) {
          var x = this.abs();
          var i = r.t = 2 * x.t;
          while (--i >= 0) r[i] = 0;
          for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
              r[i + x.t] -= x.DV;
              r[i + x.t + 1] = 1;
            }
          }
          if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
          r.s = 0;
          r.clamp();
        }
        function bnpDivRemTo(m, q, r) {
          var pm = m.abs();
          if (pm.t <= 0) return;
          var pt = this.abs();
          if (pt.t < pm.t) {
            if (q != null) q.fromInt(0);
            if (r != null) this.copyTo(r);
            return;
          }
          if (r == null) r = nbi();
          var y = nbi(), ts = this.s, ms = m.s;
          var nsh = this.DB - nbits(pm[pm.t - 1]);
          if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
          } else {
            pm.copyTo(y);
            pt.copyTo(r);
          }
          var ys = y.t;
          var y0 = y[ys - 1];
          if (y0 == 0) return;
          var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
          var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
          var i = r.t, j = i - ys, t2 = q == null ? nbi() : q;
          y.dlShiftTo(j, t2);
          if (r.compareTo(t2) >= 0) {
            r[r.t++] = 1;
            r.subTo(t2, r);
          }
          BigInteger.ONE.dlShiftTo(ys, t2);
          t2.subTo(y, y);
          while (y.t < ys) y[y.t++] = 0;
          while (--j >= 0) {
            var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
              y.dlShiftTo(j, t2);
              r.subTo(t2, r);
              while (r[i] < --qd) r.subTo(t2, r);
            }
          }
          if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) BigInteger.ZERO.subTo(q, q);
          }
          r.t = ys;
          r.clamp();
          if (nsh > 0) r.rShiftTo(nsh, r);
          if (ts < 0) BigInteger.ZERO.subTo(r, r);
        }
        function bnMod(a) {
          var r = nbi();
          this.abs().divRemTo(a, null, r);
          if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
          return r;
        }
        function Classic(m) {
          this.m = m;
        }
        function cConvert(x) {
          if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
          else return x;
        }
        function cRevert(x) {
          return x;
        }
        function cReduce(x) {
          x.divRemTo(this.m, null, x);
        }
        function cMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        function cSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        Classic.prototype.convert = cConvert;
        Classic.prototype.revert = cRevert;
        Classic.prototype.reduce = cReduce;
        Classic.prototype.mulTo = cMulTo;
        Classic.prototype.sqrTo = cSqrTo;
        function bnpInvDigit() {
          if (this.t < 1) return 0;
          var x = this[0];
          if ((x & 1) == 0) return 0;
          var y = x & 3;
          y = y * (2 - (x & 15) * y) & 15;
          y = y * (2 - (x & 255) * y) & 255;
          y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
          y = y * (2 - x * y % this.DV) % this.DV;
          return y > 0 ? this.DV - y : -y;
        }
        function Montgomery(m) {
          this.m = m;
          this.mp = m.invDigit();
          this.mpl = this.mp & 32767;
          this.mph = this.mp >> 15;
          this.um = (1 << m.DB - 15) - 1;
          this.mt2 = 2 * m.t;
        }
        function montConvert(x) {
          var r = nbi();
          x.abs().dlShiftTo(this.m.t, r);
          r.divRemTo(this.m, null, r);
          if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
          return r;
        }
        function montRevert(x) {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        }
        function montReduce(x) {
          while (x.t <= this.mt2)
            x[x.t++] = 0;
          for (var i = 0; i < this.m.t; ++i) {
            var j = x[i] & 32767;
            var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            while (x[j] >= x.DV) {
              x[j] -= x.DV;
              x[++j]++;
            }
          }
          x.clamp();
          x.drShiftTo(this.m.t, x);
          if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
        }
        function montSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        function montMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        Montgomery.prototype.convert = montConvert;
        Montgomery.prototype.revert = montRevert;
        Montgomery.prototype.reduce = montReduce;
        Montgomery.prototype.mulTo = montMulTo;
        Montgomery.prototype.sqrTo = montSqrTo;
        function bnpIsEven() {
          return (this.t > 0 ? this[0] & 1 : this.s) == 0;
        }
        function bnpExp(e, z2) {
          if (e > 4294967295 || e < 1) return BigInteger.ONE;
          var r = nbi(), r2 = nbi(), g = z2.convert(this), i = nbits(e) - 1;
          g.copyTo(r);
          while (--i >= 0) {
            z2.sqrTo(r, r2);
            if ((e & 1 << i) > 0) z2.mulTo(r2, g, r);
            else {
              var t2 = r;
              r = r2;
              r2 = t2;
            }
          }
          return z2.revert(r);
        }
        function bnModPowInt(e, m) {
          var z2;
          if (e < 256 || m.isEven()) z2 = new Classic(m);
          else z2 = new Montgomery(m);
          return this.exp(e, z2);
        }
        BigInteger.prototype.copyTo = bnpCopyTo;
        BigInteger.prototype.fromInt = bnpFromInt;
        BigInteger.prototype.fromString = bnpFromString;
        BigInteger.prototype.clamp = bnpClamp;
        BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
        BigInteger.prototype.drShiftTo = bnpDRShiftTo;
        BigInteger.prototype.lShiftTo = bnpLShiftTo;
        BigInteger.prototype.rShiftTo = bnpRShiftTo;
        BigInteger.prototype.subTo = bnpSubTo;
        BigInteger.prototype.multiplyTo = bnpMultiplyTo;
        BigInteger.prototype.squareTo = bnpSquareTo;
        BigInteger.prototype.divRemTo = bnpDivRemTo;
        BigInteger.prototype.invDigit = bnpInvDigit;
        BigInteger.prototype.isEven = bnpIsEven;
        BigInteger.prototype.exp = bnpExp;
        BigInteger.prototype.toString = bnToString;
        BigInteger.prototype.negate = bnNegate;
        BigInteger.prototype.abs = bnAbs;
        BigInteger.prototype.compareTo = bnCompareTo;
        BigInteger.prototype.bitLength = bnBitLength;
        BigInteger.prototype.mod = bnMod;
        BigInteger.prototype.modPowInt = bnModPowInt;
        BigInteger.ZERO = nbv(0);
        BigInteger.ONE = nbv(1);
        function bnClone() {
          var r = nbi();
          this.copyTo(r);
          return r;
        }
        function bnIntValue() {
          if (this.s < 0) {
            if (this.t == 1) return this[0] - this.DV;
            else if (this.t == 0) return -1;
          } else if (this.t == 1) return this[0];
          else if (this.t == 0) return 0;
          return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
        }
        function bnByteValue() {
          return this.t == 0 ? this.s : this[0] << 24 >> 24;
        }
        function bnShortValue() {
          return this.t == 0 ? this.s : this[0] << 16 >> 16;
        }
        function bnpChunkSize(r) {
          return Math.floor(Math.LN2 * this.DB / Math.log(r));
        }
        function bnSigNum() {
          if (this.s < 0) return -1;
          else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;
          else return 1;
        }
        function bnpToRadix(b) {
          if (b == null) b = 10;
          if (this.signum() == 0 || b < 2 || b > 36) return "0";
          var cs = this.chunkSize(b);
          var a = Math.pow(b, cs);
          var d = nbv(a), y = nbi(), z2 = nbi(), r = "";
          this.divRemTo(d, y, z2);
          while (y.signum() > 0) {
            r = (a + z2.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z2);
          }
          return z2.intValue().toString(b) + r;
        }
        function bnpFromRadix(s, b) {
          this.fromInt(0);
          if (b == null) b = 10;
          var cs = this.chunkSize(b);
          var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
          for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
              continue;
            }
            w = b * w + x;
            if (++j >= cs) {
              this.dMultiply(d);
              this.dAddOffset(w, 0);
              j = 0;
              w = 0;
            }
          }
          if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
          }
          if (mi) BigInteger.ZERO.subTo(this, this);
        }
        function bnpFromNumber(a, b, c) {
          if ("number" == typeof b) {
            if (a < 2) this.fromInt(1);
            else {
              this.fromNumber(a, c);
              if (!this.testBit(a - 1))
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
              if (this.isEven()) this.dAddOffset(1, 0);
              while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
              }
            }
          } else {
            var x = new Array(), t2 = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t2 > 0) x[0] &= (1 << t2) - 1;
            else x[0] = 0;
            this.fromString(x, 256);
          }
        }
        function bnToByteArray() {
          var i = this.t, r = new Array();
          r[0] = this.s;
          var p = this.DB - i * this.DB % 8, d, k = 0;
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
              r[k++] = d | this.s << this.DB - p;
            while (i >= 0) {
              if (p < 8) {
                d = (this[i] & (1 << p) - 1) << 8 - p;
                d |= this[--i] >> (p += this.DB - 8);
              } else {
                d = this[i] >> (p -= 8) & 255;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if ((d & 128) != 0) d |= -256;
              if (k == 0 && (this.s & 128) != (d & 128)) ++k;
              if (k > 0 || d != this.s) r[k++] = d;
            }
          }
          return r;
        }
        function bnEquals(a) {
          return this.compareTo(a) == 0;
        }
        function bnMin(a) {
          return this.compareTo(a) < 0 ? this : a;
        }
        function bnMax(a) {
          return this.compareTo(a) > 0 ? this : a;
        }
        function bnpBitwiseTo(a, op, r) {
          var i, f, m = Math.min(a.t, this.t);
          for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
          if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
            r.t = this.t;
          } else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
            r.t = a.t;
          }
          r.s = op(this.s, a.s);
          r.clamp();
        }
        function op_and(x, y) {
          return x & y;
        }
        function bnAnd(a) {
          var r = nbi();
          this.bitwiseTo(a, op_and, r);
          return r;
        }
        function op_or(x, y) {
          return x | y;
        }
        function bnOr(a) {
          var r = nbi();
          this.bitwiseTo(a, op_or, r);
          return r;
        }
        function op_xor(x, y) {
          return x ^ y;
        }
        function bnXor(a) {
          var r = nbi();
          this.bitwiseTo(a, op_xor, r);
          return r;
        }
        function op_andnot(x, y) {
          return x & ~y;
        }
        function bnAndNot(a) {
          var r = nbi();
          this.bitwiseTo(a, op_andnot, r);
          return r;
        }
        function bnNot() {
          var r = nbi();
          for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
          r.t = this.t;
          r.s = ~this.s;
          return r;
        }
        function bnShiftLeft(n) {
          var r = nbi();
          if (n < 0) this.rShiftTo(-n, r);
          else this.lShiftTo(n, r);
          return r;
        }
        function bnShiftRight(n) {
          var r = nbi();
          if (n < 0) this.lShiftTo(-n, r);
          else this.rShiftTo(n, r);
          return r;
        }
        function lbit(x) {
          if (x == 0) return -1;
          var r = 0;
          if ((x & 65535) == 0) {
            x >>= 16;
            r += 16;
          }
          if ((x & 255) == 0) {
            x >>= 8;
            r += 8;
          }
          if ((x & 15) == 0) {
            x >>= 4;
            r += 4;
          }
          if ((x & 3) == 0) {
            x >>= 2;
            r += 2;
          }
          if ((x & 1) == 0) ++r;
          return r;
        }
        function bnGetLowestSetBit() {
          for (var i = 0; i < this.t; ++i)
            if (this[i] != 0) return i * this.DB + lbit(this[i]);
          if (this.s < 0) return this.t * this.DB;
          return -1;
        }
        function cbit(x) {
          var r = 0;
          while (x != 0) {
            x &= x - 1;
            ++r;
          }
          return r;
        }
        function bnBitCount() {
          var r = 0, x = this.s & this.DM;
          for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
          return r;
        }
        function bnTestBit(n) {
          var j = Math.floor(n / this.DB);
          if (j >= this.t) return this.s != 0;
          return (this[j] & 1 << n % this.DB) != 0;
        }
        function bnpChangeBit(n, op) {
          var r = BigInteger.ONE.shiftLeft(n);
          this.bitwiseTo(r, op, r);
          return r;
        }
        function bnSetBit(n) {
          return this.changeBit(n, op_or);
        }
        function bnClearBit(n) {
          return this.changeBit(n, op_andnot);
        }
        function bnFlipBit(n) {
          return this.changeBit(n, op_xor);
        }
        function bnpAddTo(a, r) {
          var i = 0, c = 0, m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c += a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c > 0) r[i++] = c;
          else if (c < -1) r[i++] = this.DV + c;
          r.t = i;
          r.clamp();
        }
        function bnAdd(a) {
          var r = nbi();
          this.addTo(a, r);
          return r;
        }
        function bnSubtract(a) {
          var r = nbi();
          this.subTo(a, r);
          return r;
        }
        function bnMultiply(a) {
          var r = nbi();
          this.multiplyTo(a, r);
          return r;
        }
        function bnSquare() {
          var r = nbi();
          this.squareTo(r);
          return r;
        }
        function bnDivide(a) {
          var r = nbi();
          this.divRemTo(a, r, null);
          return r;
        }
        function bnRemainder(a) {
          var r = nbi();
          this.divRemTo(a, null, r);
          return r;
        }
        function bnDivideAndRemainder(a) {
          var q = nbi(), r = nbi();
          this.divRemTo(a, q, r);
          return new Array(q, r);
        }
        function bnpDMultiply(n) {
          this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
          ++this.t;
          this.clamp();
        }
        function bnpDAddOffset(n, w) {
          if (n == 0) return;
          while (this.t <= w) this[this.t++] = 0;
          this[w] += n;
          while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) this[this.t++] = 0;
            ++this[w];
          }
        }
        function NullExp() {
        }
        function nNop(x) {
          return x;
        }
        function nMulTo(x, y, r) {
          x.multiplyTo(y, r);
        }
        function nSqrTo(x, r) {
          x.squareTo(r);
        }
        NullExp.prototype.convert = nNop;
        NullExp.prototype.revert = nNop;
        NullExp.prototype.mulTo = nMulTo;
        NullExp.prototype.sqrTo = nSqrTo;
        function bnPow(e) {
          return this.exp(e, new NullExp());
        }
        function bnpMultiplyLowerTo(a, n, r) {
          var i = Math.min(this.t + a.t, n);
          r.s = 0;
          r.t = i;
          while (i > 0) r[--i] = 0;
          var j;
          for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
          for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
          r.clamp();
        }
        function bnpMultiplyUpperTo(a, n, r) {
          --n;
          var i = r.t = this.t + a.t - n;
          r.s = 0;
          while (--i >= 0) r[i] = 0;
          for (i = Math.max(n - this.t, 0); i < a.t; ++i)
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
          r.clamp();
          r.drShiftTo(1, r);
        }
        function Barrett(m) {
          this.r2 = nbi();
          this.q3 = nbi();
          BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
          this.mu = this.r2.divide(m);
          this.m = m;
        }
        function barrettConvert(x) {
          if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
          else if (x.compareTo(this.m) < 0) return x;
          else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
          }
        }
        function barrettRevert(x) {
          return x;
        }
        function barrettReduce(x) {
          x.drShiftTo(this.m.t - 1, this.r2);
          if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
          }
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
          while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
          x.subTo(this.r2, x);
          while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
        }
        function barrettSqrTo(x, r) {
          x.squareTo(r);
          this.reduce(r);
        }
        function barrettMulTo(x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        }
        Barrett.prototype.convert = barrettConvert;
        Barrett.prototype.revert = barrettRevert;
        Barrett.prototype.reduce = barrettReduce;
        Barrett.prototype.mulTo = barrettMulTo;
        Barrett.prototype.sqrTo = barrettSqrTo;
        function bnModPow(e, m) {
          var i = e.bitLength(), k, r = nbv(1), z2;
          if (i <= 0) return r;
          else if (i < 18) k = 1;
          else if (i < 48) k = 3;
          else if (i < 144) k = 4;
          else if (i < 768) k = 5;
          else k = 6;
          if (i < 8)
            z2 = new Classic(m);
          else if (m.isEven())
            z2 = new Barrett(m);
          else
            z2 = new Montgomery(m);
          var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
          g[1] = z2.convert(this);
          if (k > 1) {
            var g2 = nbi();
            z2.sqrTo(g[1], g2);
            while (n <= km) {
              g[n] = nbi();
              z2.mulTo(g2, g[n - 2], g[n]);
              n += 2;
            }
          }
          var j = e.t - 1, w, is1 = true, r2 = nbi(), t2;
          i = nbits(e[j]) - 1;
          while (j >= 0) {
            if (i >= k1) w = e[j] >> i - k1 & km;
            else {
              w = (e[j] & (1 << i + 1) - 1) << k1 - i;
              if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
            }
            n = k;
            while ((w & 1) == 0) {
              w >>= 1;
              --n;
            }
            if ((i -= n) < 0) {
              i += this.DB;
              --j;
            }
            if (is1) {
              g[w].copyTo(r);
              is1 = false;
            } else {
              while (n > 1) {
                z2.sqrTo(r, r2);
                z2.sqrTo(r2, r);
                n -= 2;
              }
              if (n > 0) z2.sqrTo(r, r2);
              else {
                t2 = r;
                r = r2;
                r2 = t2;
              }
              z2.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & 1 << i) == 0) {
              z2.sqrTo(r, r2);
              t2 = r;
              r = r2;
              r2 = t2;
              if (--i < 0) {
                i = this.DB - 1;
                --j;
              }
            }
          }
          return z2.revert(r);
        }
        function bnGCD(a) {
          var x = this.s < 0 ? this.negate() : this.clone();
          var y = a.s < 0 ? a.negate() : a.clone();
          if (x.compareTo(y) < 0) {
            var t2 = x;
            x = y;
            y = t2;
          }
          var i = x.getLowestSetBit(), g = y.getLowestSetBit();
          if (g < 0) return x;
          if (i < g) g = i;
          if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
          }
          while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
            if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
            if (x.compareTo(y) >= 0) {
              x.subTo(y, x);
              x.rShiftTo(1, x);
            } else {
              y.subTo(x, y);
              y.rShiftTo(1, y);
            }
          }
          if (g > 0) y.lShiftTo(g, y);
          return y;
        }
        function bnpModInt(n) {
          if (n <= 0) return 0;
          var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
          if (this.t > 0)
            if (d == 0) r = this[0] % n;
            else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
          return r;
        }
        function bnModInverse(m) {
          var ac = m.isEven();
          if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
          var u = m.clone(), v = this.clone();
          var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
          while (u.signum() != 0) {
            while (u.isEven()) {
              u.rShiftTo(1, u);
              if (ac) {
                if (!a.isEven() || !b.isEven()) {
                  a.addTo(this, a);
                  b.subTo(m, b);
                }
                a.rShiftTo(1, a);
              } else if (!b.isEven()) b.subTo(m, b);
              b.rShiftTo(1, b);
            }
            while (v.isEven()) {
              v.rShiftTo(1, v);
              if (ac) {
                if (!c.isEven() || !d.isEven()) {
                  c.addTo(this, c);
                  d.subTo(m, d);
                }
                c.rShiftTo(1, c);
              } else if (!d.isEven()) d.subTo(m, d);
              d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
              u.subTo(v, u);
              if (ac) a.subTo(c, a);
              b.subTo(d, b);
            } else {
              v.subTo(u, v);
              if (ac) c.subTo(a, c);
              d.subTo(b, d);
            }
          }
          if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
          if (d.compareTo(m) >= 0) return d.subtract(m);
          if (d.signum() < 0) d.addTo(m, d);
          else return d;
          if (d.signum() < 0) return d.add(m);
          else return d;
        }
        var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
        var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
        function bnIsProbablePrime(t2) {
          var i, x = this.abs();
          if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i)
              if (x[0] == lowprimes[i]) return true;
            return false;
          }
          if (x.isEven()) return false;
          i = 1;
          while (i < lowprimes.length) {
            var m = lowprimes[i], j = i + 1;
            while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
            m = x.modInt(m);
            while (i < j) if (m % lowprimes[i++] == 0) return false;
          }
          return x.millerRabin(t2);
        }
        function bnpMillerRabin(t2) {
          var n1 = this.subtract(BigInteger.ONE);
          var k = n1.getLowestSetBit();
          if (k <= 0) return false;
          var r = n1.shiftRight(k);
          t2 = t2 + 1 >> 1;
          if (t2 > lowprimes.length) t2 = lowprimes.length;
          var a = nbi();
          for (var i = 0; i < t2; ++i) {
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
              var j = 1;
              while (j++ < k && y.compareTo(n1) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0) return false;
              }
              if (y.compareTo(n1) != 0) return false;
            }
          }
          return true;
        }
        BigInteger.prototype.chunkSize = bnpChunkSize;
        BigInteger.prototype.toRadix = bnpToRadix;
        BigInteger.prototype.fromRadix = bnpFromRadix;
        BigInteger.prototype.fromNumber = bnpFromNumber;
        BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
        BigInteger.prototype.changeBit = bnpChangeBit;
        BigInteger.prototype.addTo = bnpAddTo;
        BigInteger.prototype.dMultiply = bnpDMultiply;
        BigInteger.prototype.dAddOffset = bnpDAddOffset;
        BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
        BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
        BigInteger.prototype.modInt = bnpModInt;
        BigInteger.prototype.millerRabin = bnpMillerRabin;
        BigInteger.prototype.clone = bnClone;
        BigInteger.prototype.intValue = bnIntValue;
        BigInteger.prototype.byteValue = bnByteValue;
        BigInteger.prototype.shortValue = bnShortValue;
        BigInteger.prototype.signum = bnSigNum;
        BigInteger.prototype.toByteArray = bnToByteArray;
        BigInteger.prototype.equals = bnEquals;
        BigInteger.prototype.min = bnMin;
        BigInteger.prototype.max = bnMax;
        BigInteger.prototype.and = bnAnd;
        BigInteger.prototype.or = bnOr;
        BigInteger.prototype.xor = bnXor;
        BigInteger.prototype.andNot = bnAndNot;
        BigInteger.prototype.not = bnNot;
        BigInteger.prototype.shiftLeft = bnShiftLeft;
        BigInteger.prototype.shiftRight = bnShiftRight;
        BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
        BigInteger.prototype.bitCount = bnBitCount;
        BigInteger.prototype.testBit = bnTestBit;
        BigInteger.prototype.setBit = bnSetBit;
        BigInteger.prototype.clearBit = bnClearBit;
        BigInteger.prototype.flipBit = bnFlipBit;
        BigInteger.prototype.add = bnAdd;
        BigInteger.prototype.subtract = bnSubtract;
        BigInteger.prototype.multiply = bnMultiply;
        BigInteger.prototype.divide = bnDivide;
        BigInteger.prototype.remainder = bnRemainder;
        BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
        BigInteger.prototype.modPow = bnModPow;
        BigInteger.prototype.modInverse = bnModInverse;
        BigInteger.prototype.pow = bnPow;
        BigInteger.prototype.gcd = bnGCD;
        BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
        BigInteger.prototype.square = bnSquare;
        BigInteger.prototype.Barrett = Barrett;
        var rng_state;
        var rng_pool;
        var rng_pptr;
        function rng_seed_int(x) {
          rng_pool[rng_pptr++] ^= x & 255;
          rng_pool[rng_pptr++] ^= x >> 8 & 255;
          rng_pool[rng_pptr++] ^= x >> 16 & 255;
          rng_pool[rng_pptr++] ^= x >> 24 & 255;
          if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
        }
        function rng_seed_time() {
          rng_seed_int((/* @__PURE__ */ new Date()).getTime());
        }
        if (rng_pool == null) {
          rng_pool = new Array();
          rng_pptr = 0;
          var t;
          if (typeof window !== "undefined" && window.crypto) {
            if (window.crypto.getRandomValues) {
              var ua = new Uint8Array(32);
              window.crypto.getRandomValues(ua);
              for (t = 0; t < 32; ++t)
                rng_pool[rng_pptr++] = ua[t];
            } else if (navigator.appName == "Netscape" && navigator.appVersion < "5") {
              var z = window.crypto.random(32);
              for (t = 0; t < z.length; ++t)
                rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
            }
          }
          while (rng_pptr < rng_psize) {
            t = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = t >>> 8;
            rng_pool[rng_pptr++] = t & 255;
          }
          rng_pptr = 0;
          rng_seed_time();
        }
        function rng_get_byte() {
          if (rng_state == null) {
            rng_seed_time();
            rng_state = prng_newstate();
            rng_state.init(rng_pool);
            for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
              rng_pool[rng_pptr] = 0;
            rng_pptr = 0;
          }
          return rng_state.next();
        }
        function rng_get_bytes(ba) {
          var i;
          for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
        }
        function SecureRandom() {
        }
        SecureRandom.prototype.nextBytes = rng_get_bytes;
        function Arcfour() {
          this.i = 0;
          this.j = 0;
          this.S = new Array();
        }
        function ARC4init(key) {
          var i, j, t2;
          for (i = 0; i < 256; ++i)
            this.S[i] = i;
          j = 0;
          for (i = 0; i < 256; ++i) {
            j = j + this.S[i] + key[i % key.length] & 255;
            t2 = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t2;
          }
          this.i = 0;
          this.j = 0;
        }
        function ARC4next() {
          var t2;
          this.i = this.i + 1 & 255;
          this.j = this.j + this.S[this.i] & 255;
          t2 = this.S[this.i];
          this.S[this.i] = this.S[this.j];
          this.S[this.j] = t2;
          return this.S[t2 + this.S[this.i] & 255];
        }
        Arcfour.prototype.init = ARC4init;
        Arcfour.prototype.next = ARC4next;
        function prng_newstate() {
          return new Arcfour();
        }
        var rng_psize = 256;
        if (typeof exports !== "undefined") {
          exports = module.exports = {
            default: BigInteger,
            BigInteger,
            SecureRandom
          };
        } else {
          this.jsbn = {
            BigInteger,
            SecureRandom
          };
        }
      }).call(exports);
    }
  });

  // node_modules/sm-crypto/src/sm2/asn1.js
  var require_asn1 = __commonJS({
    "node_modules/sm-crypto/src/sm2/asn1.js"(exports, module) {
      var { BigInteger } = require_jsbn();
      function bigintToValue(bigint) {
        let h = bigint.toString(16);
        if (h[0] !== "-") {
          if (h.length % 2 === 1) h = "0" + h;
          else if (!h.match(/^[0-7]/)) h = "00" + h;
        } else {
          h = h.substr(1);
          let len = h.length;
          if (len % 2 === 1) len += 1;
          else if (!h.match(/^[0-7]/)) len += 2;
          let mask = "";
          for (let i = 0; i < len; i++) mask += "f";
          mask = new BigInteger(mask, 16);
          h = mask.xor(bigint).add(BigInteger.ONE);
          h = h.toString(16).replace(/^-/, "");
        }
        return h;
      }
      var ASN1Object = class {
        constructor() {
          this.tlv = null;
          this.t = "00";
          this.l = "00";
          this.v = "";
        }
        /**
         * 获取 der 编码比特流16进制串
         */
        getEncodedHex() {
          if (!this.tlv) {
            this.v = this.getValue();
            this.l = this.getLength();
            this.tlv = this.t + this.l + this.v;
          }
          return this.tlv;
        }
        getLength() {
          const n = this.v.length / 2;
          let nHex = n.toString(16);
          if (nHex.length % 2 === 1) nHex = "0" + nHex;
          if (n < 128) {
            return nHex;
          } else {
            const head = 128 + nHex.length / 2;
            return head.toString(16) + nHex;
          }
        }
        getValue() {
          return "";
        }
      };
      var DERInteger = class extends ASN1Object {
        constructor(bigint) {
          super();
          this.t = "02";
          if (bigint) this.v = bigintToValue(bigint);
        }
        getValue() {
          return this.v;
        }
      };
      var DERSequence = class extends ASN1Object {
        constructor(asn1Array) {
          super();
          this.t = "30";
          this.asn1Array = asn1Array;
        }
        getValue() {
          this.v = this.asn1Array.map((asn1Object) => asn1Object.getEncodedHex()).join("");
          return this.v;
        }
      };
      function getLenOfL(str, start) {
        if (+str[start + 2] < 8) return 1;
        return +str.substr(start + 2, 2) & 127 + 1;
      }
      function getL(str, start) {
        const len = getLenOfL(str, start);
        const l = str.substr(start + 2, len * 2);
        if (!l) return -1;
        const bigint = +l[0] < 8 ? new BigInteger(l, 16) : new BigInteger(l.substr(2), 16);
        return bigint.intValue();
      }
      function getStartOfV(str, start) {
        const len = getLenOfL(str, start);
        return start + (len + 1) * 2;
      }
      module.exports = {
        /**
         * ASN.1 der 编码，针对 sm2 签名
         */
        encodeDer(r, s) {
          const derR = new DERInteger(r);
          const derS = new DERInteger(s);
          const derSeq = new DERSequence([derR, derS]);
          return derSeq.getEncodedHex();
        },
        /**
         * 解析 ASN.1 der，针对 sm2 验签
         */
        decodeDer(input) {
          const start = getStartOfV(input, 0);
          const vIndexR = getStartOfV(input, start);
          const lR = getL(input, start);
          const vR = input.substr(vIndexR, lR * 2);
          const nextStart = vIndexR + vR.length;
          const vIndexS = getStartOfV(input, nextStart);
          const lS = getL(input, nextStart);
          const vS = input.substr(vIndexS, lS * 2);
          const r = new BigInteger(vR, 16);
          const s = new BigInteger(vS, 16);
          return { r, s };
        }
      };
    }
  });

  // node_modules/sm-crypto/src/sm2/ec.js
  var require_ec = __commonJS({
    "node_modules/sm-crypto/src/sm2/ec.js"(exports, module) {
      var { BigInteger } = require_jsbn();
      var TWO = new BigInteger("2");
      var THREE = new BigInteger("3");
      var ECFieldElementFp = class _ECFieldElementFp {
        constructor(q, x) {
          this.x = x;
          this.q = q;
        }
        /**
         * 判断相等
         */
        equals(other) {
          if (other === this) return true;
          return this.q.equals(other.q) && this.x.equals(other.x);
        }
        /**
         * 返回具体数值
         */
        toBigInteger() {
          return this.x;
        }
        /**
         * 取反
         */
        negate() {
          return new _ECFieldElementFp(this.q, this.x.negate().mod(this.q));
        }
        /**
         * 相加
         */
        add(b) {
          return new _ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
        }
        /**
         * 相减
         */
        subtract(b) {
          return new _ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
        }
        /**
         * 相乘
         */
        multiply(b) {
          return new _ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
        }
        /**
         * 相除
         */
        divide(b) {
          return new _ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
        }
        /**
         * 平方
         */
        square() {
          return new _ECFieldElementFp(this.q, this.x.square().mod(this.q));
        }
      };
      var ECPointFp = class _ECPointFp {
        constructor(curve, x, y, z) {
          this.curve = curve;
          this.x = x;
          this.y = y;
          this.z = z == null ? BigInteger.ONE : z;
          this.zinv = null;
        }
        getX() {
          if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);
          return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
        }
        getY() {
          if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);
          return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
        }
        /**
         * 判断相等
         */
        equals(other) {
          if (other === this) return true;
          if (this.isInfinity()) return other.isInfinity();
          if (other.isInfinity()) return this.isInfinity();
          const u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
          if (!u.equals(BigInteger.ZERO)) return false;
          const v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
          return v.equals(BigInteger.ZERO);
        }
        /**
         * 是否是无穷远点
         */
        isInfinity() {
          if (this.x === null && this.y === null) return true;
          return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
        }
        /**
         * 取反，x 轴对称点
         */
        negate() {
          return new _ECPointFp(this.curve, this.x, this.y.negate(), this.z);
        }
        /**
         * 相加
         *
         * 标准射影坐标系：
         *
         * λ1 = x1 * z2
         * λ2 = x2 * z1
         * λ3 = λ1 − λ2
         * λ4 = y1 * z2
         * λ5 = y2 * z1
         * λ6 = λ4 − λ5
         * λ7 = λ1 + λ2
         * λ8 = z1 * z2
         * λ9 = λ3^2
         * λ10 = λ3 * λ9
         * λ11 = λ8 * λ6^2 − λ7 * λ9
         * x3 = λ3 * λ11
         * y3 = λ6 * (λ9 * λ1 − λ11) − λ4 * λ10
         * z3 = λ10 * λ8
         */
        add(b) {
          if (this.isInfinity()) return b;
          if (b.isInfinity()) return this;
          const x1 = this.x.toBigInteger();
          const y1 = this.y.toBigInteger();
          const z1 = this.z;
          const x2 = b.x.toBigInteger();
          const y2 = b.y.toBigInteger();
          const z2 = b.z;
          const q = this.curve.q;
          const w1 = x1.multiply(z2).mod(q);
          const w2 = x2.multiply(z1).mod(q);
          const w3 = w1.subtract(w2);
          const w4 = y1.multiply(z2).mod(q);
          const w5 = y2.multiply(z1).mod(q);
          const w6 = w4.subtract(w5);
          if (BigInteger.ZERO.equals(w3)) {
            if (BigInteger.ZERO.equals(w6)) {
              return this.twice();
            }
            return this.curve.infinity;
          }
          const w7 = w1.add(w2);
          const w8 = z1.multiply(z2).mod(q);
          const w9 = w3.square().mod(q);
          const w10 = w3.multiply(w9).mod(q);
          const w11 = w8.multiply(w6.square()).subtract(w7.multiply(w9)).mod(q);
          const x3 = w3.multiply(w11).mod(q);
          const y3 = w6.multiply(w9.multiply(w1).subtract(w11)).subtract(w4.multiply(w10)).mod(q);
          const z3 = w10.multiply(w8).mod(q);
          return new _ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
        }
        /**
         * 自加
         *
         * 标准射影坐标系：
         *
         * λ1 = 3 * x1^2 + a * z1^2
         * λ2 = 2 * y1 * z1
         * λ3 = y1^2
         * λ4 = λ3 * x1 * z1
         * λ5 = λ2^2
         * λ6 = λ1^2 − 8 * λ4
         * x3 = λ2 * λ6
         * y3 = λ1 * (4 * λ4 − λ6) − 2 * λ5 * λ3
         * z3 = λ2 * λ5
         */
        twice() {
          if (this.isInfinity()) return this;
          if (!this.y.toBigInteger().signum()) return this.curve.infinity;
          const x1 = this.x.toBigInteger();
          const y1 = this.y.toBigInteger();
          const z1 = this.z;
          const q = this.curve.q;
          const a = this.curve.a.toBigInteger();
          const w1 = x1.square().multiply(THREE).add(a.multiply(z1.square())).mod(q);
          const w2 = y1.shiftLeft(1).multiply(z1).mod(q);
          const w3 = y1.square().mod(q);
          const w4 = w3.multiply(x1).multiply(z1).mod(q);
          const w5 = w2.square().mod(q);
          const w6 = w1.square().subtract(w4.shiftLeft(3)).mod(q);
          const x3 = w2.multiply(w6).mod(q);
          const y3 = w1.multiply(w4.shiftLeft(2).subtract(w6)).subtract(w5.shiftLeft(1).multiply(w3)).mod(q);
          const z3 = w2.multiply(w5).mod(q);
          return new _ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
        }
        /**
         * 倍点计算
         */
        multiply(k) {
          if (this.isInfinity()) return this;
          if (!k.signum()) return this.curve.infinity;
          const k3 = k.multiply(THREE);
          const neg = this.negate();
          let Q = this;
          for (let i = k3.bitLength() - 2; i > 0; i--) {
            Q = Q.twice();
            const k3Bit = k3.testBit(i);
            const kBit = k.testBit(i);
            if (k3Bit !== kBit) {
              Q = Q.add(k3Bit ? this : neg);
            }
          }
          return Q;
        }
      };
      var ECCurveFp = class {
        constructor(q, a, b) {
          this.q = q;
          this.a = this.fromBigInteger(a);
          this.b = this.fromBigInteger(b);
          this.infinity = new ECPointFp(this, null, null);
        }
        /**
         * 判断两个椭圆曲线是否相等
         */
        equals(other) {
          if (other === this) return true;
          return this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b);
        }
        /**
         * 生成椭圆曲线域元素
         */
        fromBigInteger(x) {
          return new ECFieldElementFp(this.q, x);
        }
        /**
         * 解析 16 进制串为椭圆曲线点
         */
        decodePointHex(s) {
          switch (parseInt(s.substr(0, 2), 16)) {
            // 第一个字节
            case 0:
              return this.infinity;
            case 2:
            case 3:
              const x = this.fromBigInteger(new BigInteger(s.substr(2), 16));
              let y = this.fromBigInteger(x.multiply(x.square()).add(
                x.multiply(this.a)
              ).add(this.b).toBigInteger().modPow(
                this.q.divide(new BigInteger("4")).add(BigInteger.ONE),
                this.q
              ));
              if (!y.toBigInteger().mod(TWO).equals(new BigInteger(s.substr(0, 2), 16).subtract(TWO))) {
                y = y.negate();
              }
              return new ECPointFp(this, x, y);
            case 4:
            case 6:
            case 7:
              const len = (s.length - 2) / 2;
              const xHex = s.substr(2, len);
              const yHex = s.substr(len + 2, len);
              return new ECPointFp(this, this.fromBigInteger(new BigInteger(xHex, 16)), this.fromBigInteger(new BigInteger(yHex, 16)));
            default:
              return null;
          }
        }
      };
      module.exports = {
        ECPointFp,
        ECCurveFp
      };
    }
  });

  // node_modules/sm-crypto/src/sm2/utils.js
  var require_utils = __commonJS({
    "node_modules/sm-crypto/src/sm2/utils.js"(exports, module) {
      var { BigInteger, SecureRandom } = require_jsbn();
      var { ECCurveFp } = require_ec();
      var rng = new SecureRandom();
      var { curve, G, n } = generateEcparam();
      function getGlobalCurve() {
        return curve;
      }
      function generateEcparam() {
        const p = new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF", 16);
        const a = new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC", 16);
        const b = new BigInteger("28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93", 16);
        const curve2 = new ECCurveFp(p, a, b);
        const gxHex = "32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7";
        const gyHex = "BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0";
        const G2 = curve2.decodePointHex("04" + gxHex + gyHex);
        const n2 = new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123", 16);
        return { curve: curve2, G: G2, n: n2 };
      }
      function generateKeyPairHex(a, b, c) {
        const random = a ? new BigInteger(a, b, c) : new BigInteger(n.bitLength(), rng);
        const d = random.mod(n.subtract(BigInteger.ONE)).add(BigInteger.ONE);
        const privateKey = leftPad(d.toString(16), 64);
        const P = G.multiply(d);
        const Px = leftPad(P.getX().toBigInteger().toString(16), 64);
        const Py = leftPad(P.getY().toBigInteger().toString(16), 64);
        const publicKey = "04" + Px + Py;
        return { privateKey, publicKey };
      }
      function compressPublicKeyHex(s) {
        if (s.length !== 130) throw new Error("Invalid public key to compress");
        const len = (s.length - 2) / 2;
        const xHex = s.substr(2, len);
        const y = new BigInteger(s.substr(len + 2, len), 16);
        let prefix = "03";
        if (y.mod(new BigInteger("2")).equals(BigInteger.ZERO)) prefix = "02";
        return prefix + xHex;
      }
      function utf8ToHex(input) {
        input = unescape(encodeURIComponent(input));
        const length = input.length;
        const words = [];
        for (let i = 0; i < length; i++) {
          words[i >>> 2] |= (input.charCodeAt(i) & 255) << 24 - i % 4 * 8;
        }
        const hexChars = [];
        for (let i = 0; i < length; i++) {
          const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
          hexChars.push((bite >>> 4).toString(16));
          hexChars.push((bite & 15).toString(16));
        }
        return hexChars.join("");
      }
      function leftPad(input, num) {
        if (input.length >= num) return input;
        return new Array(num - input.length + 1).join("0") + input;
      }
      function arrayToHex(arr) {
        return arr.map((item) => {
          item = item.toString(16);
          return item.length === 1 ? "0" + item : item;
        }).join("");
      }
      function arrayToUtf8(arr) {
        const words = [];
        let j = 0;
        for (let i = 0; i < arr.length * 2; i += 2) {
          words[i >>> 3] |= parseInt(arr[j], 10) << 24 - i % 8 * 4;
          j++;
        }
        try {
          const latin1Chars = [];
          for (let i = 0; i < arr.length; i++) {
            const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
            latin1Chars.push(String.fromCharCode(bite));
          }
          return decodeURIComponent(escape(latin1Chars.join("")));
        } catch (e) {
          throw new Error("Malformed UTF-8 data");
        }
      }
      function hexToArray(hexStr) {
        const words = [];
        let hexStrLength = hexStr.length;
        if (hexStrLength % 2 !== 0) {
          hexStr = leftPad(hexStr, hexStrLength + 1);
        }
        hexStrLength = hexStr.length;
        for (let i = 0; i < hexStrLength; i += 2) {
          words.push(parseInt(hexStr.substr(i, 2), 16));
        }
        return words;
      }
      function verifyPublicKey(publicKey) {
        const point = curve.decodePointHex(publicKey);
        if (!point) return false;
        const x = point.getX();
        const y = point.getY();
        return y.square().equals(x.multiply(x.square()).add(x.multiply(curve.a)).add(curve.b));
      }
      function comparePublicKeyHex(publicKey1, publicKey2) {
        const point1 = curve.decodePointHex(publicKey1);
        if (!point1) return false;
        const point2 = curve.decodePointHex(publicKey2);
        if (!point2) return false;
        return point1.equals(point2);
      }
      module.exports = {
        getGlobalCurve,
        generateEcparam,
        generateKeyPairHex,
        compressPublicKeyHex,
        utf8ToHex,
        leftPad,
        arrayToHex,
        arrayToUtf8,
        hexToArray,
        verifyPublicKey,
        comparePublicKeyHex
      };
    }
  });

  // node_modules/sm-crypto/src/sm2/sm3.js
  var require_sm3 = __commonJS({
    "node_modules/sm-crypto/src/sm2/sm3.js"(exports, module) {
      var W = new Uint32Array(68);
      var M = new Uint32Array(64);
      function rotl(x, n) {
        const s = n & 31;
        return x << s | x >>> 32 - s;
      }
      function xor(x, y) {
        const result = [];
        for (let i = x.length - 1; i >= 0; i--) result[i] = (x[i] ^ y[i]) & 255;
        return result;
      }
      function P0(X) {
        return X ^ rotl(X, 9) ^ rotl(X, 17);
      }
      function P1(X) {
        return X ^ rotl(X, 15) ^ rotl(X, 23);
      }
      function sm3(array) {
        let len = array.length * 8;
        let k = len % 512;
        k = k >= 448 ? 512 - k % 448 - 1 : 448 - k - 1;
        const kArr = new Array((k - 7) / 8);
        const lenArr = new Array(8);
        for (let i = 0, len2 = kArr.length; i < len2; i++) kArr[i] = 0;
        for (let i = 0, len2 = lenArr.length; i < len2; i++) lenArr[i] = 0;
        len = len.toString(2);
        for (let i = 7; i >= 0; i--) {
          if (len.length > 8) {
            const start = len.length - 8;
            lenArr[i] = parseInt(len.substr(start), 2);
            len = len.substr(0, start);
          } else if (len.length > 0) {
            lenArr[i] = parseInt(len, 2);
            len = "";
          }
        }
        const m = new Uint8Array([...array, 128, ...kArr, ...lenArr]);
        const dataView = new DataView(m.buffer, 0);
        const n = m.length / 64;
        const V = new Uint32Array([1937774191, 1226093241, 388252375, 3666478592, 2842636476, 372324522, 3817729613, 2969243214]);
        for (let i = 0; i < n; i++) {
          W.fill(0);
          M.fill(0);
          const start = 16 * i;
          for (let j = 0; j < 16; j++) {
            W[j] = dataView.getUint32((start + j) * 4, false);
          }
          for (let j = 16; j < 68; j++) {
            W[j] = P1(W[j - 16] ^ W[j - 9] ^ rotl(W[j - 3], 15)) ^ rotl(W[j - 13], 7) ^ W[j - 6];
          }
          for (let j = 0; j < 64; j++) {
            M[j] = W[j] ^ W[j + 4];
          }
          const T1 = 2043430169;
          const T2 = 2055708042;
          let A = V[0];
          let B = V[1];
          let C = V[2];
          let D = V[3];
          let E = V[4];
          let F = V[5];
          let G = V[6];
          let H = V[7];
          let SS1;
          let SS2;
          let TT1;
          let TT2;
          let T;
          for (let j = 0; j < 64; j++) {
            T = j >= 0 && j <= 15 ? T1 : T2;
            SS1 = rotl(rotl(A, 12) + E + rotl(T, j), 7);
            SS2 = SS1 ^ rotl(A, 12);
            TT1 = (j >= 0 && j <= 15 ? A ^ B ^ C : A & B | A & C | B & C) + D + SS2 + M[j];
            TT2 = (j >= 0 && j <= 15 ? E ^ F ^ G : E & F | ~E & G) + H + SS1 + W[j];
            D = C;
            C = rotl(B, 9);
            B = A;
            A = TT1;
            H = G;
            G = rotl(F, 19);
            F = E;
            E = P0(TT2);
          }
          V[0] ^= A;
          V[1] ^= B;
          V[2] ^= C;
          V[3] ^= D;
          V[4] ^= E;
          V[5] ^= F;
          V[6] ^= G;
          V[7] ^= H;
        }
        const result = [];
        for (let i = 0, len2 = V.length; i < len2; i++) {
          const word = V[i];
          result.push((word & 4278190080) >>> 24, (word & 16711680) >>> 16, (word & 65280) >>> 8, word & 255);
        }
        return result;
      }
      var blockLen = 64;
      var iPad = new Uint8Array(blockLen);
      var oPad = new Uint8Array(blockLen);
      for (let i = 0; i < blockLen; i++) {
        iPad[i] = 54;
        oPad[i] = 92;
      }
      function hmac(input, key) {
        if (key.length > blockLen) key = sm3(key);
        while (key.length < blockLen) key.push(0);
        const iPadKey = xor(key, iPad);
        const oPadKey = xor(key, oPad);
        const hash = sm3([...iPadKey, ...input]);
        return sm3([...oPadKey, ...hash]);
      }
      module.exports = {
        sm3,
        hmac
      };
    }
  });

  // node_modules/sm-crypto/src/sm2/index.js
  var require_sm2 = __commonJS({
    "node_modules/sm-crypto/src/sm2/index.js"(exports, module) {
      var { BigInteger } = require_jsbn();
      var { encodeDer, decodeDer } = require_asn1();
      var _ = require_utils();
      var sm3 = require_sm3().sm3;
      var { G, curve, n } = _.generateEcparam();
      var C1C2C3 = 0;
      function doEncrypt(msg, publicKey, cipherMode = 1) {
        msg = typeof msg === "string" ? _.hexToArray(_.utf8ToHex(msg)) : Array.prototype.slice.call(msg);
        publicKey = _.getGlobalCurve().decodePointHex(publicKey);
        const keypair = _.generateKeyPairHex();
        const k = new BigInteger(keypair.privateKey, 16);
        let c1 = keypair.publicKey;
        if (c1.length > 128) c1 = c1.substr(c1.length - 128);
        const p = publicKey.multiply(k);
        const x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
        const y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));
        const c3 = _.arrayToHex(sm3([].concat(x2, msg, y2)));
        let ct = 1;
        let offset = 0;
        let t = [];
        const z = [].concat(x2, y2);
        const nextT = () => {
          t = sm3([...z, ct >> 24 & 255, ct >> 16 & 255, ct >> 8 & 255, ct & 255]);
          ct++;
          offset = 0;
        };
        nextT();
        for (let i = 0, len = msg.length; i < len; i++) {
          if (offset === t.length) nextT();
          msg[i] ^= t[offset++] & 255;
        }
        const c2 = _.arrayToHex(msg);
        return cipherMode === C1C2C3 ? c1 + c2 + c3 : c1 + c3 + c2;
      }
      function doDecrypt(encryptData, privateKey, cipherMode = 1, {
        output = "string"
      } = {}) {
        privateKey = new BigInteger(privateKey, 16);
        let c3 = encryptData.substr(128, 64);
        let c2 = encryptData.substr(128 + 64);
        if (cipherMode === C1C2C3) {
          c3 = encryptData.substr(encryptData.length - 64);
          c2 = encryptData.substr(128, encryptData.length - 128 - 64);
        }
        const msg = _.hexToArray(c2);
        const c1 = _.getGlobalCurve().decodePointHex("04" + encryptData.substr(0, 128));
        if (!c1 || !_.verifyPublicKey("04" + encryptData.substr(0, 128))) {
          return output === "array" ? [] : "";
        }
        const p = c1.multiply(privateKey);
        const x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
        const y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));
        let ct = 1;
        let offset = 0;
        let t = [];
        const z = [].concat(x2, y2);
        const nextT = () => {
          t = sm3([...z, ct >> 24 & 255, ct >> 16 & 255, ct >> 8 & 255, ct & 255]);
          ct++;
          offset = 0;
        };
        nextT();
        for (let i = 0, len = msg.length; i < len; i++) {
          if (offset === t.length) nextT();
          msg[i] ^= t[offset++] & 255;
        }
        const checkC3 = _.arrayToHex(sm3([].concat(x2, msg, y2)));
        if (checkC3 === c3.toLowerCase()) {
          return output === "array" ? msg : _.arrayToUtf8(msg);
        } else {
          return output === "array" ? [] : "";
        }
      }
      function doSignature(msg, privateKey, {
        pointPool,
        der,
        hash = true,
        publicKey,
        userId
      } = {}) {
        let hashHex = typeof msg === "string" ? _.utf8ToHex(msg) : _.arrayToHex(msg);
        if (hash) {
          publicKey = publicKey || getPublicKeyFromPrivateKey(privateKey);
          hashHex = getHash(hashHex, publicKey, userId);
        }
        const dA = new BigInteger(privateKey, 16);
        const e = new BigInteger(hashHex, 16);
        let k = null;
        let r = null;
        let s = null;
        do {
          do {
            let point;
            if (pointPool && pointPool.length) {
              point = pointPool.pop();
            } else {
              point = getPoint();
            }
            k = point.k;
            r = e.add(point.x1).mod(n);
          } while (r.equals(BigInteger.ZERO) || r.add(k).equals(n));
          s = dA.add(BigInteger.ONE).modInverse(n).multiply(k.subtract(r.multiply(dA))).mod(n);
        } while (s.equals(BigInteger.ZERO));
        if (der) return encodeDer(r, s);
        return _.leftPad(r.toString(16), 64) + _.leftPad(s.toString(16), 64);
      }
      function doVerifySignature(msg, signHex, publicKey, { der, hash = true, userId } = {}) {
        let hashHex = typeof msg === "string" ? _.utf8ToHex(msg) : _.arrayToHex(msg);
        if (hash) {
          hashHex = getHash(hashHex, publicKey, userId);
        }
        let r;
        let s;
        if (der) {
          const decodeDerObj = decodeDer(signHex);
          r = decodeDerObj.r;
          s = decodeDerObj.s;
        } else {
          r = new BigInteger(signHex.substring(0, 64), 16);
          s = new BigInteger(signHex.substring(64), 16);
        }
        const nSubOne = n.subtract(BigInteger.ONE);
        if (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(nSubOne) > 0) return false;
        if (s.compareTo(BigInteger.ONE) < 0 || s.compareTo(nSubOne) > 0) return false;
        const PA = curve.decodePointHex(publicKey);
        if (!PA || !_.verifyPublicKey(publicKey)) return false;
        const e = new BigInteger(hashHex, 16);
        const t = r.add(s).mod(n);
        if (t.equals(BigInteger.ZERO)) return false;
        const x1y1 = G.multiply(s).add(PA.multiply(t));
        const R = e.add(x1y1.getX().toBigInteger()).mod(n);
        return r.equals(R);
      }
      function getHash(hashHex, publicKey, userId = "1234567812345678") {
        userId = _.utf8ToHex(userId);
        const a = _.leftPad(G.curve.a.toBigInteger().toRadix(16), 64);
        const b = _.leftPad(G.curve.b.toBigInteger().toRadix(16), 64);
        const gx = _.leftPad(G.getX().toBigInteger().toRadix(16), 64);
        const gy = _.leftPad(G.getY().toBigInteger().toRadix(16), 64);
        let px;
        let py;
        if (publicKey.length === 128) {
          px = publicKey.substr(0, 64);
          py = publicKey.substr(64, 64);
        } else {
          const point = G.curve.decodePointHex(publicKey);
          px = _.leftPad(point.getX().toBigInteger().toRadix(16), 64);
          py = _.leftPad(point.getY().toBigInteger().toRadix(16), 64);
        }
        const data = _.hexToArray(userId + a + b + gx + gy + px + py);
        const entl = userId.length * 4;
        data.unshift(entl & 255);
        data.unshift(entl >> 8 & 255);
        const z = sm3(data);
        return _.arrayToHex(sm3(z.concat(_.hexToArray(hashHex))));
      }
      function getPublicKeyFromPrivateKey(privateKey) {
        const PA = G.multiply(new BigInteger(privateKey, 16));
        const x = _.leftPad(PA.getX().toBigInteger().toString(16), 64);
        const y = _.leftPad(PA.getY().toBigInteger().toString(16), 64);
        return "04" + x + y;
      }
      function getPoint() {
        const keypair = _.generateKeyPairHex();
        const PA = curve.decodePointHex(keypair.publicKey);
        keypair.k = new BigInteger(keypair.privateKey, 16);
        keypair.x1 = PA.getX().toBigInteger();
        return keypair;
      }
      module.exports = {
        generateKeyPairHex: _.generateKeyPairHex,
        compressPublicKeyHex: _.compressPublicKeyHex,
        comparePublicKeyHex: _.comparePublicKeyHex,
        doEncrypt,
        doDecrypt,
        doSignature,
        doVerifySignature,
        getPublicKeyFromPrivateKey,
        getPoint,
        verifyPublicKey: _.verifyPublicKey
      };
    }
  });

  // node_modules/sm-crypto/src/sm3/index.js
  var require_sm32 = __commonJS({
    "node_modules/sm-crypto/src/sm3/index.js"(exports, module) {
      var { sm3, hmac } = require_sm3();
      function leftPad(input, num) {
        if (input.length >= num) return input;
        return new Array(num - input.length + 1).join("0") + input;
      }
      function ArrayToHex(arr) {
        return arr.map((item) => {
          item = item.toString(16);
          return item.length === 1 ? "0" + item : item;
        }).join("");
      }
      function hexToArray(hexStr) {
        const words = [];
        let hexStrLength = hexStr.length;
        if (hexStrLength % 2 !== 0) {
          hexStr = leftPad(hexStr, hexStrLength + 1);
        }
        hexStrLength = hexStr.length;
        for (let i = 0; i < hexStrLength; i += 2) {
          words.push(parseInt(hexStr.substr(i, 2), 16));
        }
        return words;
      }
      function utf8ToArray(str) {
        const arr = [];
        for (let i = 0, len = str.length; i < len; i++) {
          const point = str.codePointAt(i);
          if (point <= 127) {
            arr.push(point);
          } else if (point <= 2047) {
            arr.push(192 | point >>> 6);
            arr.push(128 | point & 63);
          } else if (point <= 55295 || point >= 57344 && point <= 65535) {
            arr.push(224 | point >>> 12);
            arr.push(128 | point >>> 6 & 63);
            arr.push(128 | point & 63);
          } else if (point >= 65536 && point <= 1114111) {
            i++;
            arr.push(240 | point >>> 18 & 28);
            arr.push(128 | point >>> 12 & 63);
            arr.push(128 | point >>> 6 & 63);
            arr.push(128 | point & 63);
          } else {
            arr.push(point);
            throw new Error("input is not supported");
          }
        }
        return arr;
      }
      module.exports = function(input, options) {
        input = typeof input === "string" ? utf8ToArray(input) : Array.prototype.slice.call(input);
        if (options) {
          const mode = options.mode || "hmac";
          if (mode !== "hmac") throw new Error("invalid mode");
          let key = options.key;
          if (!key) throw new Error("invalid key");
          key = typeof key === "string" ? hexToArray(key) : Array.prototype.slice.call(key);
          return ArrayToHex(hmac(input, key));
        }
        return ArrayToHex(sm3(input));
      };
    }
  });

  // node_modules/sm-crypto/src/sm4/index.js
  var require_sm4 = __commonJS({
    "node_modules/sm-crypto/src/sm4/index.js"(exports, module) {
      var DECRYPT = 0;
      var ROUND = 32;
      var BLOCK = 16;
      var Sbox = [
        214,
        144,
        233,
        254,
        204,
        225,
        61,
        183,
        22,
        182,
        20,
        194,
        40,
        251,
        44,
        5,
        43,
        103,
        154,
        118,
        42,
        190,
        4,
        195,
        170,
        68,
        19,
        38,
        73,
        134,
        6,
        153,
        156,
        66,
        80,
        244,
        145,
        239,
        152,
        122,
        51,
        84,
        11,
        67,
        237,
        207,
        172,
        98,
        228,
        179,
        28,
        169,
        201,
        8,
        232,
        149,
        128,
        223,
        148,
        250,
        117,
        143,
        63,
        166,
        71,
        7,
        167,
        252,
        243,
        115,
        23,
        186,
        131,
        89,
        60,
        25,
        230,
        133,
        79,
        168,
        104,
        107,
        129,
        178,
        113,
        100,
        218,
        139,
        248,
        235,
        15,
        75,
        112,
        86,
        157,
        53,
        30,
        36,
        14,
        94,
        99,
        88,
        209,
        162,
        37,
        34,
        124,
        59,
        1,
        33,
        120,
        135,
        212,
        0,
        70,
        87,
        159,
        211,
        39,
        82,
        76,
        54,
        2,
        231,
        160,
        196,
        200,
        158,
        234,
        191,
        138,
        210,
        64,
        199,
        56,
        181,
        163,
        247,
        242,
        206,
        249,
        97,
        21,
        161,
        224,
        174,
        93,
        164,
        155,
        52,
        26,
        85,
        173,
        147,
        50,
        48,
        245,
        140,
        177,
        227,
        29,
        246,
        226,
        46,
        130,
        102,
        202,
        96,
        192,
        41,
        35,
        171,
        13,
        83,
        78,
        111,
        213,
        219,
        55,
        69,
        222,
        253,
        142,
        47,
        3,
        255,
        106,
        114,
        109,
        108,
        91,
        81,
        141,
        27,
        175,
        146,
        187,
        221,
        188,
        127,
        17,
        217,
        92,
        65,
        31,
        16,
        90,
        216,
        10,
        193,
        49,
        136,
        165,
        205,
        123,
        189,
        45,
        116,
        208,
        18,
        184,
        229,
        180,
        176,
        137,
        105,
        151,
        74,
        12,
        150,
        119,
        126,
        101,
        185,
        241,
        9,
        197,
        110,
        198,
        132,
        24,
        240,
        125,
        236,
        58,
        220,
        77,
        32,
        121,
        238,
        95,
        62,
        215,
        203,
        57,
        72
      ];
      var CK = [
        462357,
        472066609,
        943670861,
        1415275113,
        1886879365,
        2358483617,
        2830087869,
        3301692121,
        3773296373,
        4228057617,
        404694573,
        876298825,
        1347903077,
        1819507329,
        2291111581,
        2762715833,
        3234320085,
        3705924337,
        4177462797,
        337322537,
        808926789,
        1280531041,
        1752135293,
        2223739545,
        2695343797,
        3166948049,
        3638552301,
        4110090761,
        269950501,
        741554753,
        1213159005,
        1684763257
      ];
      function hexToArray(str) {
        const arr = [];
        for (let i = 0, len = str.length; i < len; i += 2) {
          arr.push(parseInt(str.substr(i, 2), 16));
        }
        return arr;
      }
      function ArrayToHex(arr) {
        return arr.map((item) => {
          item = item.toString(16);
          return item.length === 1 ? "0" + item : item;
        }).join("");
      }
      function utf8ToArray(str) {
        const arr = [];
        for (let i = 0, len = str.length; i < len; i++) {
          const point = str.codePointAt(i);
          if (point <= 127) {
            arr.push(point);
          } else if (point <= 2047) {
            arr.push(192 | point >>> 6);
            arr.push(128 | point & 63);
          } else if (point <= 55295 || point >= 57344 && point <= 65535) {
            arr.push(224 | point >>> 12);
            arr.push(128 | point >>> 6 & 63);
            arr.push(128 | point & 63);
          } else if (point >= 65536 && point <= 1114111) {
            i++;
            arr.push(240 | point >>> 18 & 28);
            arr.push(128 | point >>> 12 & 63);
            arr.push(128 | point >>> 6 & 63);
            arr.push(128 | point & 63);
          } else {
            arr.push(point);
            throw new Error("input is not supported");
          }
        }
        return arr;
      }
      function arrayToUtf8(arr) {
        const str = [];
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] >= 240 && arr[i] <= 247) {
            str.push(String.fromCodePoint(((arr[i] & 7) << 18) + ((arr[i + 1] & 63) << 12) + ((arr[i + 2] & 63) << 6) + (arr[i + 3] & 63)));
            i += 3;
          } else if (arr[i] >= 224 && arr[i] <= 239) {
            str.push(String.fromCodePoint(((arr[i] & 15) << 12) + ((arr[i + 1] & 63) << 6) + (arr[i + 2] & 63)));
            i += 2;
          } else if (arr[i] >= 192 && arr[i] <= 223) {
            str.push(String.fromCodePoint(((arr[i] & 31) << 6) + (arr[i + 1] & 63)));
            i++;
          } else {
            str.push(String.fromCodePoint(arr[i]));
          }
        }
        return str.join("");
      }
      function rotl(x, n) {
        const s = n & 31;
        return x << s | x >>> 32 - s;
      }
      function byteSub(a) {
        return (Sbox[a >>> 24 & 255] & 255) << 24 | (Sbox[a >>> 16 & 255] & 255) << 16 | (Sbox[a >>> 8 & 255] & 255) << 8 | Sbox[a & 255] & 255;
      }
      function l1(b) {
        return b ^ rotl(b, 2) ^ rotl(b, 10) ^ rotl(b, 18) ^ rotl(b, 24);
      }
      function l2(b) {
        return b ^ rotl(b, 13) ^ rotl(b, 23);
      }
      function sms4Crypt(input, output, roundKey) {
        const x = new Array(4);
        const tmp = new Array(4);
        for (let i = 0; i < 4; i++) {
          tmp[0] = input[4 * i] & 255;
          tmp[1] = input[4 * i + 1] & 255;
          tmp[2] = input[4 * i + 2] & 255;
          tmp[3] = input[4 * i + 3] & 255;
          x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
        }
        for (let r = 0, mid; r < 32; r += 4) {
          mid = x[1] ^ x[2] ^ x[3] ^ roundKey[r + 0];
          x[0] ^= l1(byteSub(mid));
          mid = x[2] ^ x[3] ^ x[0] ^ roundKey[r + 1];
          x[1] ^= l1(byteSub(mid));
          mid = x[3] ^ x[0] ^ x[1] ^ roundKey[r + 2];
          x[2] ^= l1(byteSub(mid));
          mid = x[0] ^ x[1] ^ x[2] ^ roundKey[r + 3];
          x[3] ^= l1(byteSub(mid));
        }
        for (let j = 0; j < 16; j += 4) {
          output[j] = x[3 - j / 4] >>> 24 & 255;
          output[j + 1] = x[3 - j / 4] >>> 16 & 255;
          output[j + 2] = x[3 - j / 4] >>> 8 & 255;
          output[j + 3] = x[3 - j / 4] & 255;
        }
      }
      function sms4KeyExt(key, roundKey, cryptFlag) {
        const x = new Array(4);
        const tmp = new Array(4);
        for (let i = 0; i < 4; i++) {
          tmp[0] = key[0 + 4 * i] & 255;
          tmp[1] = key[1 + 4 * i] & 255;
          tmp[2] = key[2 + 4 * i] & 255;
          tmp[3] = key[3 + 4 * i] & 255;
          x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
        }
        x[0] ^= 2746333894;
        x[1] ^= 1453994832;
        x[2] ^= 1736282519;
        x[3] ^= 2993693404;
        for (let r = 0, mid; r < 32; r += 4) {
          mid = x[1] ^ x[2] ^ x[3] ^ CK[r + 0];
          roundKey[r + 0] = x[0] ^= l2(byteSub(mid));
          mid = x[2] ^ x[3] ^ x[0] ^ CK[r + 1];
          roundKey[r + 1] = x[1] ^= l2(byteSub(mid));
          mid = x[3] ^ x[0] ^ x[1] ^ CK[r + 2];
          roundKey[r + 2] = x[2] ^= l2(byteSub(mid));
          mid = x[0] ^ x[1] ^ x[2] ^ CK[r + 3];
          roundKey[r + 3] = x[3] ^= l2(byteSub(mid));
        }
        if (cryptFlag === DECRYPT) {
          for (let r = 0, mid; r < 16; r++) {
            mid = roundKey[r];
            roundKey[r] = roundKey[31 - r];
            roundKey[31 - r] = mid;
          }
        }
      }
      function sm4(inArray, key, cryptFlag, {
        padding = "pkcs#7",
        mode,
        iv = [],
        output = "string"
      } = {}) {
        if (mode === "cbc") {
          if (typeof iv === "string") iv = hexToArray(iv);
          if (iv.length !== 128 / 8) {
            throw new Error("iv is invalid");
          }
        }
        if (typeof key === "string") key = hexToArray(key);
        if (key.length !== 128 / 8) {
          throw new Error("key is invalid");
        }
        if (typeof inArray === "string") {
          if (cryptFlag !== DECRYPT) {
            inArray = utf8ToArray(inArray);
          } else {
            inArray = hexToArray(inArray);
          }
        } else {
          inArray = [...inArray];
        }
        if ((padding === "pkcs#5" || padding === "pkcs#7") && cryptFlag !== DECRYPT) {
          const paddingCount = BLOCK - inArray.length % BLOCK;
          for (let i = 0; i < paddingCount; i++) inArray.push(paddingCount);
        }
        const roundKey = new Array(ROUND);
        sms4KeyExt(key, roundKey, cryptFlag);
        const outArray = [];
        let lastVector = iv;
        let restLen = inArray.length;
        let point = 0;
        while (restLen >= BLOCK) {
          const input = inArray.slice(point, point + 16);
          const output2 = new Array(16);
          if (mode === "cbc") {
            for (let i = 0; i < BLOCK; i++) {
              if (cryptFlag !== DECRYPT) {
                input[i] ^= lastVector[i];
              }
            }
          }
          sms4Crypt(input, output2, roundKey);
          for (let i = 0; i < BLOCK; i++) {
            if (mode === "cbc") {
              if (cryptFlag === DECRYPT) {
                output2[i] ^= lastVector[i];
              }
            }
            outArray[point + i] = output2[i];
          }
          if (mode === "cbc") {
            if (cryptFlag !== DECRYPT) {
              lastVector = output2;
            } else {
              lastVector = input;
            }
          }
          restLen -= BLOCK;
          point += BLOCK;
        }
        if ((padding === "pkcs#5" || padding === "pkcs#7") && cryptFlag === DECRYPT) {
          const len = outArray.length;
          const paddingCount = outArray[len - 1];
          for (let i = 1; i <= paddingCount; i++) {
            if (outArray[len - i] !== paddingCount) throw new Error("padding is invalid");
          }
          outArray.splice(len - paddingCount, paddingCount);
        }
        if (output !== "array") {
          if (cryptFlag !== DECRYPT) {
            return ArrayToHex(outArray);
          } else {
            return arrayToUtf8(outArray);
          }
        } else {
          return outArray;
        }
      }
      module.exports = {
        encrypt(inArray, key, options) {
          return sm4(inArray, key, 1, options);
        },
        decrypt(inArray, key, options) {
          return sm4(inArray, key, 0, options);
        }
      };
    }
  });

  // node_modules/sm-crypto/src/index.js
  var require_src = __commonJS({
    "node_modules/sm-crypto/src/index.js"(exports, module) {
      module.exports = {
        sm2: require_sm2(),
        sm3: require_sm32(),
        sm4: require_sm4()
      };
    }
  });

  // node_modules/node-forge/lib/forge.js
  var require_forge = __commonJS({
    "node_modules/node-forge/lib/forge.js"(exports, module) {
      module.exports = {
        // default options
        options: {
          usePureJavaScript: false
        }
      };
    }
  });

  // node_modules/node-forge/lib/baseN.js
  var require_baseN = __commonJS({
    "node_modules/node-forge/lib/baseN.js"(exports, module) {
      var api = {};
      module.exports = api;
      var _reverseAlphabets = {};
      api.encode = function(input, alphabet, maxline) {
        if (typeof alphabet !== "string") {
          throw new TypeError('"alphabet" must be a string.');
        }
        if (maxline !== void 0 && typeof maxline !== "number") {
          throw new TypeError('"maxline" must be a number.');
        }
        var output = "";
        if (!(input instanceof Uint8Array)) {
          output = _encodeWithByteBuffer(input, alphabet);
        } else {
          var i = 0;
          var base = alphabet.length;
          var first = alphabet.charAt(0);
          var digits = [0];
          for (i = 0; i < input.length; ++i) {
            for (var j = 0, carry = input[i]; j < digits.length; ++j) {
              carry += digits[j] << 8;
              digits[j] = carry % base;
              carry = carry / base | 0;
            }
            while (carry > 0) {
              digits.push(carry % base);
              carry = carry / base | 0;
            }
          }
          for (i = 0; input[i] === 0 && i < input.length - 1; ++i) {
            output += first;
          }
          for (i = digits.length - 1; i >= 0; --i) {
            output += alphabet[digits[i]];
          }
        }
        if (maxline) {
          var regex = new RegExp(".{1," + maxline + "}", "g");
          output = output.match(regex).join("\r\n");
        }
        return output;
      };
      api.decode = function(input, alphabet) {
        if (typeof input !== "string") {
          throw new TypeError('"input" must be a string.');
        }
        if (typeof alphabet !== "string") {
          throw new TypeError('"alphabet" must be a string.');
        }
        var table = _reverseAlphabets[alphabet];
        if (!table) {
          table = _reverseAlphabets[alphabet] = [];
          for (var i = 0; i < alphabet.length; ++i) {
            table[alphabet.charCodeAt(i)] = i;
          }
        }
        input = input.replace(/\s/g, "");
        var base = alphabet.length;
        var first = alphabet.charAt(0);
        var bytes = [0];
        for (var i = 0; i < input.length; i++) {
          var value = table[input.charCodeAt(i)];
          if (value === void 0) {
            return;
          }
          for (var j = 0, carry = value; j < bytes.length; ++j) {
            carry += bytes[j] * base;
            bytes[j] = carry & 255;
            carry >>= 8;
          }
          while (carry > 0) {
            bytes.push(carry & 255);
            carry >>= 8;
          }
        }
        for (var k = 0; input[k] === first && k < input.length - 1; ++k) {
          bytes.push(0);
        }
        if (typeof Buffer !== "undefined") {
          return Buffer.from(bytes.reverse());
        }
        return new Uint8Array(bytes.reverse());
      };
      function _encodeWithByteBuffer(input, alphabet) {
        var i = 0;
        var base = alphabet.length;
        var first = alphabet.charAt(0);
        var digits = [0];
        for (i = 0; i < input.length(); ++i) {
          for (var j = 0, carry = input.at(i); j < digits.length; ++j) {
            carry += digits[j] << 8;
            digits[j] = carry % base;
            carry = carry / base | 0;
          }
          while (carry > 0) {
            digits.push(carry % base);
            carry = carry / base | 0;
          }
        }
        var output = "";
        for (i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) {
          output += first;
        }
        for (i = digits.length - 1; i >= 0; --i) {
          output += alphabet[digits[i]];
        }
        return output;
      }
    }
  });

  // node_modules/node-forge/lib/util.js
  var require_util = __commonJS({
    "node_modules/node-forge/lib/util.js"(exports, module) {
      var forge = require_forge();
      var baseN = require_baseN();
      var util = module.exports = forge.util = forge.util || {};
      (function() {
        if (typeof process !== "undefined" && process.nextTick && !process.browser) {
          util.nextTick = process.nextTick;
          if (typeof setImmediate === "function") {
            util.setImmediate = setImmediate;
          } else {
            util.setImmediate = util.nextTick;
          }
          return;
        }
        if (typeof setImmediate === "function") {
          util.setImmediate = function() {
            return setImmediate.apply(void 0, arguments);
          };
          util.nextTick = function(callback) {
            return setImmediate(callback);
          };
          return;
        }
        util.setImmediate = function(callback) {
          setTimeout(callback, 0);
        };
        if (typeof window !== "undefined" && typeof window.postMessage === "function") {
          let handler2 = function(event) {
            if (event.source === window && event.data === msg) {
              event.stopPropagation();
              var copy = callbacks.slice();
              callbacks.length = 0;
              copy.forEach(function(callback) {
                callback();
              });
            }
          };
          var handler = handler2;
          var msg = "forge.setImmediate";
          var callbacks = [];
          util.setImmediate = function(callback) {
            callbacks.push(callback);
            if (callbacks.length === 1) {
              window.postMessage(msg, "*");
            }
          };
          window.addEventListener("message", handler2, true);
        }
        if (typeof MutationObserver !== "undefined") {
          var now = Date.now();
          var attr = true;
          var div = document.createElement("div");
          var callbacks = [];
          new MutationObserver(function() {
            var copy = callbacks.slice();
            callbacks.length = 0;
            copy.forEach(function(callback) {
              callback();
            });
          }).observe(div, { attributes: true });
          var oldSetImmediate = util.setImmediate;
          util.setImmediate = function(callback) {
            if (Date.now() - now > 15) {
              now = Date.now();
              oldSetImmediate(callback);
            } else {
              callbacks.push(callback);
              if (callbacks.length === 1) {
                div.setAttribute("a", attr = !attr);
              }
            }
          };
        }
        util.nextTick = util.setImmediate;
      })();
      util.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
      util.globalScope = (function() {
        if (util.isNodejs) {
          return global;
        }
        return typeof self === "undefined" ? window : self;
      })();
      util.isArray = Array.isArray || function(x) {
        return Object.prototype.toString.call(x) === "[object Array]";
      };
      util.isArrayBuffer = function(x) {
        return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
      };
      util.isArrayBufferView = function(x) {
        return x && util.isArrayBuffer(x.buffer) && x.byteLength !== void 0;
      };
      function _checkBitsParam(n) {
        if (!(n === 8 || n === 16 || n === 24 || n === 32)) {
          throw new Error("Only 8, 16, 24, or 32 bits supported: " + n);
        }
      }
      util.ByteBuffer = ByteStringBuffer;
      function ByteStringBuffer(b) {
        this.data = "";
        this.read = 0;
        if (typeof b === "string") {
          this.data = b;
        } else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
          if (typeof Buffer !== "undefined" && b instanceof Buffer) {
            this.data = b.toString("binary");
          } else {
            var arr = new Uint8Array(b);
            try {
              this.data = String.fromCharCode.apply(null, arr);
            } catch (e) {
              for (var i = 0; i < arr.length; ++i) {
                this.putByte(arr[i]);
              }
            }
          }
        } else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number") {
          this.data = b.data;
          this.read = b.read;
        }
        this._constructedStringLength = 0;
      }
      util.ByteStringBuffer = ByteStringBuffer;
      var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
      util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
        this._constructedStringLength += x;
        if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
          this.data.substr(0, 1);
          this._constructedStringLength = 0;
        }
      };
      util.ByteStringBuffer.prototype.length = function() {
        return this.data.length - this.read;
      };
      util.ByteStringBuffer.prototype.isEmpty = function() {
        return this.length() <= 0;
      };
      util.ByteStringBuffer.prototype.putByte = function(b) {
        return this.putBytes(String.fromCharCode(b));
      };
      util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
        b = String.fromCharCode(b);
        var d = this.data;
        while (n > 0) {
          if (n & 1) {
            d += b;
          }
          n >>>= 1;
          if (n > 0) {
            b += b;
          }
        }
        this.data = d;
        this._optimizeConstructedString(n);
        return this;
      };
      util.ByteStringBuffer.prototype.putBytes = function(bytes) {
        this.data += bytes;
        this._optimizeConstructedString(bytes.length);
        return this;
      };
      util.ByteStringBuffer.prototype.putString = function(str) {
        return this.putBytes(util.encodeUtf8(str));
      };
      util.ByteStringBuffer.prototype.putInt16 = function(i) {
        return this.putBytes(
          String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt24 = function(i) {
        return this.putBytes(
          String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt32 = function(i) {
        return this.putBytes(
          String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt16Le = function(i) {
        return this.putBytes(
          String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt24Le = function(i) {
        return this.putBytes(
          String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt32Le = function(i) {
        return this.putBytes(
          String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255)
        );
      };
      util.ByteStringBuffer.prototype.putInt = function(i, n) {
        _checkBitsParam(n);
        var bytes = "";
        do {
          n -= 8;
          bytes += String.fromCharCode(i >> n & 255);
        } while (n > 0);
        return this.putBytes(bytes);
      };
      util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
        if (i < 0) {
          i += 2 << n - 1;
        }
        return this.putInt(i, n);
      };
      util.ByteStringBuffer.prototype.putBuffer = function(buffer) {
        return this.putBytes(buffer.getBytes());
      };
      util.ByteStringBuffer.prototype.getByte = function() {
        return this.data.charCodeAt(this.read++);
      };
      util.ByteStringBuffer.prototype.getInt16 = function() {
        var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
        this.read += 2;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt24 = function() {
        var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
        this.read += 3;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt32 = function() {
        var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
        this.read += 4;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt16Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
        this.read += 2;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt24Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
        this.read += 3;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt32Le = function() {
        var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
        this.read += 4;
        return rval;
      };
      util.ByteStringBuffer.prototype.getInt = function(n) {
        _checkBitsParam(n);
        var rval = 0;
        do {
          rval = (rval << 8) + this.data.charCodeAt(this.read++);
          n -= 8;
        } while (n > 0);
        return rval;
      };
      util.ByteStringBuffer.prototype.getSignedInt = function(n) {
        var x = this.getInt(n);
        var max = 2 << n - 2;
        if (x >= max) {
          x -= max << 1;
        }
        return x;
      };
      util.ByteStringBuffer.prototype.getBytes = function(count) {
        var rval;
        if (count) {
          count = Math.min(this.length(), count);
          rval = this.data.slice(this.read, this.read + count);
          this.read += count;
        } else if (count === 0) {
          rval = "";
        } else {
          rval = this.read === 0 ? this.data : this.data.slice(this.read);
          this.clear();
        }
        return rval;
      };
      util.ByteStringBuffer.prototype.bytes = function(count) {
        return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
      };
      util.ByteStringBuffer.prototype.at = function(i) {
        return this.data.charCodeAt(this.read + i);
      };
      util.ByteStringBuffer.prototype.setAt = function(i, b) {
        this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
        return this;
      };
      util.ByteStringBuffer.prototype.last = function() {
        return this.data.charCodeAt(this.data.length - 1);
      };
      util.ByteStringBuffer.prototype.copy = function() {
        var c = util.createBuffer(this.data);
        c.read = this.read;
        return c;
      };
      util.ByteStringBuffer.prototype.compact = function() {
        if (this.read > 0) {
          this.data = this.data.slice(this.read);
          this.read = 0;
        }
        return this;
      };
      util.ByteStringBuffer.prototype.clear = function() {
        this.data = "";
        this.read = 0;
        return this;
      };
      util.ByteStringBuffer.prototype.truncate = function(count) {
        var len = Math.max(0, this.length() - count);
        this.data = this.data.substr(this.read, len);
        this.read = 0;
        return this;
      };
      util.ByteStringBuffer.prototype.toHex = function() {
        var rval = "";
        for (var i = this.read; i < this.data.length; ++i) {
          var b = this.data.charCodeAt(i);
          if (b < 16) {
            rval += "0";
          }
          rval += b.toString(16);
        }
        return rval;
      };
      util.ByteStringBuffer.prototype.toString = function() {
        return util.decodeUtf8(this.bytes());
      };
      function DataBuffer(b, options) {
        options = options || {};
        this.read = options.readOffset || 0;
        this.growSize = options.growSize || 1024;
        var isArrayBuffer = util.isArrayBuffer(b);
        var isArrayBufferView = util.isArrayBufferView(b);
        if (isArrayBuffer || isArrayBufferView) {
          if (isArrayBuffer) {
            this.data = new DataView(b);
          } else {
            this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
          }
          this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
          return;
        }
        this.data = new DataView(new ArrayBuffer(0));
        this.write = 0;
        if (b !== null && b !== void 0) {
          this.putBytes(b);
        }
        if ("writeOffset" in options) {
          this.write = options.writeOffset;
        }
      }
      util.DataBuffer = DataBuffer;
      util.DataBuffer.prototype.length = function() {
        return this.write - this.read;
      };
      util.DataBuffer.prototype.isEmpty = function() {
        return this.length() <= 0;
      };
      util.DataBuffer.prototype.accommodate = function(amount, growSize) {
        if (this.length() >= amount) {
          return this;
        }
        growSize = Math.max(growSize || this.growSize, amount);
        var src = new Uint8Array(
          this.data.buffer,
          this.data.byteOffset,
          this.data.byteLength
        );
        var dst = new Uint8Array(this.length() + growSize);
        dst.set(src);
        this.data = new DataView(dst.buffer);
        return this;
      };
      util.DataBuffer.prototype.putByte = function(b) {
        this.accommodate(1);
        this.data.setUint8(this.write++, b);
        return this;
      };
      util.DataBuffer.prototype.fillWithByte = function(b, n) {
        this.accommodate(n);
        for (var i = 0; i < n; ++i) {
          this.data.setUint8(b);
        }
        return this;
      };
      util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
        if (util.isArrayBufferView(bytes)) {
          var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          var len = src.byteLength - src.byteOffset;
          this.accommodate(len);
          var dst = new Uint8Array(this.data.buffer, this.write);
          dst.set(src);
          this.write += len;
          return this;
        }
        if (util.isArrayBuffer(bytes)) {
          var src = new Uint8Array(bytes);
          this.accommodate(src.byteLength);
          var dst = new Uint8Array(this.data.buffer);
          dst.set(src, this.write);
          this.write += src.byteLength;
          return this;
        }
        if (bytes instanceof util.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util.isArrayBufferView(bytes.data)) {
          var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
          this.accommodate(src.byteLength);
          var dst = new Uint8Array(bytes.data.byteLength, this.write);
          dst.set(src);
          this.write += src.byteLength;
          return this;
        }
        if (bytes instanceof util.ByteStringBuffer) {
          bytes = bytes.data;
          encoding = "binary";
        }
        encoding = encoding || "binary";
        if (typeof bytes === "string") {
          var view;
          if (encoding === "hex") {
            this.accommodate(Math.ceil(bytes.length / 2));
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.hex.decode(bytes, view, this.write);
            return this;
          }
          if (encoding === "base64") {
            this.accommodate(Math.ceil(bytes.length / 4) * 3);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.base64.decode(bytes, view, this.write);
            return this;
          }
          if (encoding === "utf8") {
            bytes = util.encodeUtf8(bytes);
            encoding = "binary";
          }
          if (encoding === "binary" || encoding === "raw") {
            this.accommodate(bytes.length);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.raw.decode(view);
            return this;
          }
          if (encoding === "utf16") {
            this.accommodate(bytes.length * 2);
            view = new Uint16Array(this.data.buffer, this.write);
            this.write += util.text.utf16.encode(view);
            return this;
          }
          throw new Error("Invalid encoding: " + encoding);
        }
        throw Error("Invalid parameter: " + bytes);
      };
      util.DataBuffer.prototype.putBuffer = function(buffer) {
        this.putBytes(buffer);
        buffer.clear();
        return this;
      };
      util.DataBuffer.prototype.putString = function(str) {
        return this.putBytes(str, "utf16");
      };
      util.DataBuffer.prototype.putInt16 = function(i) {
        this.accommodate(2);
        this.data.setInt16(this.write, i);
        this.write += 2;
        return this;
      };
      util.DataBuffer.prototype.putInt24 = function(i) {
        this.accommodate(3);
        this.data.setInt16(this.write, i >> 8 & 65535);
        this.data.setInt8(this.write, i >> 16 & 255);
        this.write += 3;
        return this;
      };
      util.DataBuffer.prototype.putInt32 = function(i) {
        this.accommodate(4);
        this.data.setInt32(this.write, i);
        this.write += 4;
        return this;
      };
      util.DataBuffer.prototype.putInt16Le = function(i) {
        this.accommodate(2);
        this.data.setInt16(this.write, i, true);
        this.write += 2;
        return this;
      };
      util.DataBuffer.prototype.putInt24Le = function(i) {
        this.accommodate(3);
        this.data.setInt8(this.write, i >> 16 & 255);
        this.data.setInt16(this.write, i >> 8 & 65535, true);
        this.write += 3;
        return this;
      };
      util.DataBuffer.prototype.putInt32Le = function(i) {
        this.accommodate(4);
        this.data.setInt32(this.write, i, true);
        this.write += 4;
        return this;
      };
      util.DataBuffer.prototype.putInt = function(i, n) {
        _checkBitsParam(n);
        this.accommodate(n / 8);
        do {
          n -= 8;
          this.data.setInt8(this.write++, i >> n & 255);
        } while (n > 0);
        return this;
      };
      util.DataBuffer.prototype.putSignedInt = function(i, n) {
        _checkBitsParam(n);
        this.accommodate(n / 8);
        if (i < 0) {
          i += 2 << n - 1;
        }
        return this.putInt(i, n);
      };
      util.DataBuffer.prototype.getByte = function() {
        return this.data.getInt8(this.read++);
      };
      util.DataBuffer.prototype.getInt16 = function() {
        var rval = this.data.getInt16(this.read);
        this.read += 2;
        return rval;
      };
      util.DataBuffer.prototype.getInt24 = function() {
        var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
        this.read += 3;
        return rval;
      };
      util.DataBuffer.prototype.getInt32 = function() {
        var rval = this.data.getInt32(this.read);
        this.read += 4;
        return rval;
      };
      util.DataBuffer.prototype.getInt16Le = function() {
        var rval = this.data.getInt16(this.read, true);
        this.read += 2;
        return rval;
      };
      util.DataBuffer.prototype.getInt24Le = function() {
        var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
        this.read += 3;
        return rval;
      };
      util.DataBuffer.prototype.getInt32Le = function() {
        var rval = this.data.getInt32(this.read, true);
        this.read += 4;
        return rval;
      };
      util.DataBuffer.prototype.getInt = function(n) {
        _checkBitsParam(n);
        var rval = 0;
        do {
          rval = (rval << 8) + this.data.getInt8(this.read++);
          n -= 8;
        } while (n > 0);
        return rval;
      };
      util.DataBuffer.prototype.getSignedInt = function(n) {
        var x = this.getInt(n);
        var max = 2 << n - 2;
        if (x >= max) {
          x -= max << 1;
        }
        return x;
      };
      util.DataBuffer.prototype.getBytes = function(count) {
        var rval;
        if (count) {
          count = Math.min(this.length(), count);
          rval = this.data.slice(this.read, this.read + count);
          this.read += count;
        } else if (count === 0) {
          rval = "";
        } else {
          rval = this.read === 0 ? this.data : this.data.slice(this.read);
          this.clear();
        }
        return rval;
      };
      util.DataBuffer.prototype.bytes = function(count) {
        return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
      };
      util.DataBuffer.prototype.at = function(i) {
        return this.data.getUint8(this.read + i);
      };
      util.DataBuffer.prototype.setAt = function(i, b) {
        this.data.setUint8(i, b);
        return this;
      };
      util.DataBuffer.prototype.last = function() {
        return this.data.getUint8(this.write - 1);
      };
      util.DataBuffer.prototype.copy = function() {
        return new util.DataBuffer(this);
      };
      util.DataBuffer.prototype.compact = function() {
        if (this.read > 0) {
          var src = new Uint8Array(this.data.buffer, this.read);
          var dst = new Uint8Array(src.byteLength);
          dst.set(src);
          this.data = new DataView(dst);
          this.write -= this.read;
          this.read = 0;
        }
        return this;
      };
      util.DataBuffer.prototype.clear = function() {
        this.data = new DataView(new ArrayBuffer(0));
        this.read = this.write = 0;
        return this;
      };
      util.DataBuffer.prototype.truncate = function(count) {
        this.write = Math.max(0, this.length() - count);
        this.read = Math.min(this.read, this.write);
        return this;
      };
      util.DataBuffer.prototype.toHex = function() {
        var rval = "";
        for (var i = this.read; i < this.data.byteLength; ++i) {
          var b = this.data.getUint8(i);
          if (b < 16) {
            rval += "0";
          }
          rval += b.toString(16);
        }
        return rval;
      };
      util.DataBuffer.prototype.toString = function(encoding) {
        var view = new Uint8Array(this.data, this.read, this.length());
        encoding = encoding || "utf8";
        if (encoding === "binary" || encoding === "raw") {
          return util.binary.raw.encode(view);
        }
        if (encoding === "hex") {
          return util.binary.hex.encode(view);
        }
        if (encoding === "base64") {
          return util.binary.base64.encode(view);
        }
        if (encoding === "utf8") {
          return util.text.utf8.decode(view);
        }
        if (encoding === "utf16") {
          return util.text.utf16.decode(view);
        }
        throw new Error("Invalid encoding: " + encoding);
      };
      util.createBuffer = function(input, encoding) {
        encoding = encoding || "raw";
        if (input !== void 0 && encoding === "utf8") {
          input = util.encodeUtf8(input);
        }
        return new util.ByteBuffer(input);
      };
      util.fillString = function(c, n) {
        var s = "";
        while (n > 0) {
          if (n & 1) {
            s += c;
          }
          n >>>= 1;
          if (n > 0) {
            c += c;
          }
        }
        return s;
      };
      util.xorBytes = function(s1, s2, n) {
        var s3 = "";
        var b = "";
        var t = "";
        var i = 0;
        var c = 0;
        for (; n > 0; --n, ++i) {
          b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
          if (c >= 10) {
            s3 += t;
            t = "";
            c = 0;
          }
          t += String.fromCharCode(b);
          ++c;
        }
        s3 += t;
        return s3;
      };
      util.hexToBytes = function(hex) {
        var rval = "";
        var i = 0;
        if (hex.length & true) {
          i = 1;
          rval += String.fromCharCode(parseInt(hex[0], 16));
        }
        for (; i < hex.length; i += 2) {
          rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return rval;
      };
      util.bytesToHex = function(bytes) {
        return util.createBuffer(bytes).toHex();
      };
      util.int32ToBytes = function(i) {
        return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
      };
      var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var _base64Idx = [
        /*43 -43 = 0*/
        /*'+',  1,  2,  3,'/' */
        62,
        -1,
        -1,
        -1,
        63,
        /*'0','1','2','3','4','5','6','7','8','9' */
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        /*15, 16, 17,'=', 19, 20, 21 */
        -1,
        -1,
        -1,
        64,
        -1,
        -1,
        -1,
        /*65 - 43 = 22*/
        /*'A','B','C','D','E','F','G','H','I','J','K','L','M', */
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        /*'N','O','P','Q','R','S','T','U','V','W','X','Y','Z' */
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        /*91 - 43 = 48 */
        /*48, 49, 50, 51, 52, 53 */
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        /*97 - 43 = 54*/
        /*'a','b','c','d','e','f','g','h','i','j','k','l','m' */
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        /*'n','o','p','q','r','s','t','u','v','w','x','y','z' */
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51
      ];
      var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      util.encode64 = function(input, maxline) {
        var line = "";
        var output = "";
        var chr1, chr2, chr3;
        var i = 0;
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          line += _base64.charAt(chr1 >> 2);
          line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
          if (isNaN(chr2)) {
            line += "==";
          } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
          }
          if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + "\r\n";
            line = line.substr(maxline);
          }
        }
        output += line;
        return output;
      };
      util.decode64 = function(input) {
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var output = "";
        var enc1, enc2, enc3, enc4;
        var i = 0;
        while (i < input.length) {
          enc1 = _base64Idx[input.charCodeAt(i++) - 43];
          enc2 = _base64Idx[input.charCodeAt(i++) - 43];
          enc3 = _base64Idx[input.charCodeAt(i++) - 43];
          enc4 = _base64Idx[input.charCodeAt(i++) - 43];
          output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
          if (enc3 !== 64) {
            output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
            if (enc4 !== 64) {
              output += String.fromCharCode((enc3 & 3) << 6 | enc4);
            }
          }
        }
        return output;
      };
      util.encodeUtf8 = function(str) {
        return unescape(encodeURIComponent(str));
      };
      util.decodeUtf8 = function(str) {
        return decodeURIComponent(escape(str));
      };
      util.binary = {
        raw: {},
        hex: {},
        base64: {},
        base58: {},
        baseN: {
          encode: baseN.encode,
          decode: baseN.decode
        }
      };
      util.binary.raw.encode = function(bytes) {
        return String.fromCharCode.apply(null, bytes);
      };
      util.binary.raw.decode = function(str, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length);
        }
        offset = offset || 0;
        var j = offset;
        for (var i = 0; i < str.length; ++i) {
          out[j++] = str.charCodeAt(i);
        }
        return output ? j - offset : out;
      };
      util.binary.hex.encode = util.bytesToHex;
      util.binary.hex.decode = function(hex, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(Math.ceil(hex.length / 2));
        }
        offset = offset || 0;
        var i = 0, j = offset;
        if (hex.length & 1) {
          i = 1;
          out[j++] = parseInt(hex[0], 16);
        }
        for (; i < hex.length; i += 2) {
          out[j++] = parseInt(hex.substr(i, 2), 16);
        }
        return output ? j - offset : out;
      };
      util.binary.base64.encode = function(input, maxline) {
        var line = "";
        var output = "";
        var chr1, chr2, chr3;
        var i = 0;
        while (i < input.byteLength) {
          chr1 = input[i++];
          chr2 = input[i++];
          chr3 = input[i++];
          line += _base64.charAt(chr1 >> 2);
          line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
          if (isNaN(chr2)) {
            line += "==";
          } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
          }
          if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + "\r\n";
            line = line.substr(maxline);
          }
        }
        output += line;
        return output;
      };
      util.binary.base64.decode = function(input, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(Math.ceil(input.length / 4) * 3);
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        offset = offset || 0;
        var enc1, enc2, enc3, enc4;
        var i = 0, j = offset;
        while (i < input.length) {
          enc1 = _base64Idx[input.charCodeAt(i++) - 43];
          enc2 = _base64Idx[input.charCodeAt(i++) - 43];
          enc3 = _base64Idx[input.charCodeAt(i++) - 43];
          enc4 = _base64Idx[input.charCodeAt(i++) - 43];
          out[j++] = enc1 << 2 | enc2 >> 4;
          if (enc3 !== 64) {
            out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
            if (enc4 !== 64) {
              out[j++] = (enc3 & 3) << 6 | enc4;
            }
          }
        }
        return output ? j - offset : out.subarray(0, j);
      };
      util.binary.base58.encode = function(input, maxline) {
        return util.binary.baseN.encode(input, _base58, maxline);
      };
      util.binary.base58.decode = function(input, maxline) {
        return util.binary.baseN.decode(input, _base58, maxline);
      };
      util.text = {
        utf8: {},
        utf16: {}
      };
      util.text.utf8.encode = function(str, output, offset) {
        str = util.encodeUtf8(str);
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length);
        }
        offset = offset || 0;
        var j = offset;
        for (var i = 0; i < str.length; ++i) {
          out[j++] = str.charCodeAt(i);
        }
        return output ? j - offset : out;
      };
      util.text.utf8.decode = function(bytes) {
        return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
      };
      util.text.utf16.encode = function(str, output, offset) {
        var out = output;
        if (!out) {
          out = new Uint8Array(str.length * 2);
        }
        var view = new Uint16Array(out.buffer);
        offset = offset || 0;
        var j = offset;
        var k = offset;
        for (var i = 0; i < str.length; ++i) {
          view[k++] = str.charCodeAt(i);
          j += 2;
        }
        return output ? j - offset : out;
      };
      util.text.utf16.decode = function(bytes) {
        return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
      };
      util.deflate = function(api, bytes, raw) {
        bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
        if (raw) {
          var start = 2;
          var flg = bytes.charCodeAt(1);
          if (flg & 32) {
            start = 6;
          }
          bytes = bytes.substring(start, bytes.length - 4);
        }
        return bytes;
      };
      util.inflate = function(api, bytes, raw) {
        var rval = api.inflate(util.encode64(bytes)).rval;
        return rval === null ? null : util.decode64(rval);
      };
      var _setStorageObject = function(api, id, obj) {
        if (!api) {
          throw new Error("WebStorage not available.");
        }
        var rval;
        if (obj === null) {
          rval = api.removeItem(id);
        } else {
          obj = util.encode64(JSON.stringify(obj));
          rval = api.setItem(id, obj);
        }
        if (typeof rval !== "undefined" && rval.rval !== true) {
          var error = new Error(rval.error.message);
          error.id = rval.error.id;
          error.name = rval.error.name;
          throw error;
        }
      };
      var _getStorageObject = function(api, id) {
        if (!api) {
          throw new Error("WebStorage not available.");
        }
        var rval = api.getItem(id);
        if (api.init) {
          if (rval.rval === null) {
            if (rval.error) {
              var error = new Error(rval.error.message);
              error.id = rval.error.id;
              error.name = rval.error.name;
              throw error;
            }
            rval = null;
          } else {
            rval = rval.rval;
          }
        }
        if (rval !== null) {
          rval = JSON.parse(util.decode64(rval));
        }
        return rval;
      };
      var _setItem = function(api, id, key, data) {
        var obj = _getStorageObject(api, id);
        if (obj === null) {
          obj = {};
        }
        obj[key] = data;
        _setStorageObject(api, id, obj);
      };
      var _getItem = function(api, id, key) {
        var rval = _getStorageObject(api, id);
        if (rval !== null) {
          rval = key in rval ? rval[key] : null;
        }
        return rval;
      };
      var _removeItem = function(api, id, key) {
        var obj = _getStorageObject(api, id);
        if (obj !== null && key in obj) {
          delete obj[key];
          var empty = true;
          for (var prop in obj) {
            empty = false;
            break;
          }
          if (empty) {
            obj = null;
          }
          _setStorageObject(api, id, obj);
        }
      };
      var _clearItems = function(api, id) {
        _setStorageObject(api, id, null);
      };
      var _callStorageFunction = function(func, args, location) {
        var rval = null;
        if (typeof location === "undefined") {
          location = ["web", "flash"];
        }
        var type;
        var done = false;
        var exception = null;
        for (var idx in location) {
          type = location[idx];
          try {
            if (type === "flash" || type === "both") {
              if (args[0] === null) {
                throw new Error("Flash local storage not available.");
              }
              rval = func.apply(this, args);
              done = type === "flash";
            }
            if (type === "web" || type === "both") {
              args[0] = localStorage;
              rval = func.apply(this, args);
              done = true;
            }
          } catch (ex) {
            exception = ex;
          }
          if (done) {
            break;
          }
        }
        if (!done) {
          throw exception;
        }
        return rval;
      };
      util.setItem = function(api, id, key, data, location) {
        _callStorageFunction(_setItem, arguments, location);
      };
      util.getItem = function(api, id, key, location) {
        return _callStorageFunction(_getItem, arguments, location);
      };
      util.removeItem = function(api, id, key, location) {
        _callStorageFunction(_removeItem, arguments, location);
      };
      util.clearItems = function(api, id, location) {
        _callStorageFunction(_clearItems, arguments, location);
      };
      util.isEmpty = function(obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      };
      util.format = function(format) {
        var re = /%./g;
        var match;
        var part;
        var argi = 0;
        var parts = [];
        var last = 0;
        while (match = re.exec(format)) {
          part = format.substring(last, re.lastIndex - 2);
          if (part.length > 0) {
            parts.push(part);
          }
          last = re.lastIndex;
          var code = match[0][1];
          switch (code) {
            case "s":
            case "o":
              if (argi < arguments.length) {
                parts.push(arguments[argi++ + 1]);
              } else {
                parts.push("<?>");
              }
              break;
            // FIXME: do proper formatting for numbers, etc
            //case 'f':
            //case 'd':
            case "%":
              parts.push("%");
              break;
            default:
              parts.push("<%" + code + "?>");
          }
        }
        parts.push(format.substring(last));
        return parts.join("");
      };
      util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
        var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
        var d = dec_point === void 0 ? "," : dec_point;
        var t = thousands_sep === void 0 ? "." : thousands_sep, s = n < 0 ? "-" : "";
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
        var j = i.length > 3 ? i.length % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
      };
      util.formatSize = function(size) {
        if (size >= 1073741824) {
          size = util.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
        } else if (size >= 1048576) {
          size = util.formatNumber(size / 1048576, 2, ".", "") + " MiB";
        } else if (size >= 1024) {
          size = util.formatNumber(size / 1024, 0) + " KiB";
        } else {
          size = util.formatNumber(size, 0) + " bytes";
        }
        return size;
      };
      util.bytesFromIP = function(ip) {
        if (ip.indexOf(".") !== -1) {
          return util.bytesFromIPv4(ip);
        }
        if (ip.indexOf(":") !== -1) {
          return util.bytesFromIPv6(ip);
        }
        return null;
      };
      util.bytesFromIPv4 = function(ip) {
        ip = ip.split(".");
        if (ip.length !== 4) {
          return null;
        }
        var b = util.createBuffer();
        for (var i = 0; i < ip.length; ++i) {
          var num = parseInt(ip[i], 10);
          if (isNaN(num)) {
            return null;
          }
          b.putByte(num);
        }
        return b.getBytes();
      };
      util.bytesFromIPv6 = function(ip) {
        var blanks = 0;
        ip = ip.split(":").filter(function(e) {
          if (e.length === 0) ++blanks;
          return true;
        });
        var zeros = (8 - ip.length + blanks) * 2;
        var b = util.createBuffer();
        for (var i = 0; i < 8; ++i) {
          if (!ip[i] || ip[i].length === 0) {
            b.fillWithByte(0, zeros);
            zeros = 0;
            continue;
          }
          var bytes = util.hexToBytes(ip[i]);
          if (bytes.length < 2) {
            b.putByte(0);
          }
          b.putBytes(bytes);
        }
        return b.getBytes();
      };
      util.bytesToIP = function(bytes) {
        if (bytes.length === 4) {
          return util.bytesToIPv4(bytes);
        }
        if (bytes.length === 16) {
          return util.bytesToIPv6(bytes);
        }
        return null;
      };
      util.bytesToIPv4 = function(bytes) {
        if (bytes.length !== 4) {
          return null;
        }
        var ip = [];
        for (var i = 0; i < bytes.length; ++i) {
          ip.push(bytes.charCodeAt(i));
        }
        return ip.join(".");
      };
      util.bytesToIPv6 = function(bytes) {
        if (bytes.length !== 16) {
          return null;
        }
        var ip = [];
        var zeroGroups = [];
        var zeroMaxGroup = 0;
        for (var i = 0; i < bytes.length; i += 2) {
          var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
          while (hex[0] === "0" && hex !== "0") {
            hex = hex.substr(1);
          }
          if (hex === "0") {
            var last = zeroGroups[zeroGroups.length - 1];
            var idx = ip.length;
            if (!last || idx !== last.end + 1) {
              zeroGroups.push({ start: idx, end: idx });
            } else {
              last.end = idx;
              if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
                zeroMaxGroup = zeroGroups.length - 1;
              }
            }
          }
          ip.push(hex);
        }
        if (zeroGroups.length > 0) {
          var group = zeroGroups[zeroMaxGroup];
          if (group.end - group.start > 0) {
            ip.splice(group.start, group.end - group.start + 1, "");
            if (group.start === 0) {
              ip.unshift("");
            }
            if (group.end === 7) {
              ip.push("");
            }
          }
        }
        return ip.join(":");
      };
      util.estimateCores = function(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        if ("cores" in util && !options.update) {
          return callback(null, util.cores);
        }
        if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
          util.cores = navigator.hardwareConcurrency;
          return callback(null, util.cores);
        }
        if (typeof Worker === "undefined") {
          util.cores = 1;
          return callback(null, util.cores);
        }
        if (typeof Blob === "undefined") {
          util.cores = 2;
          return callback(null, util.cores);
        }
        var blobUrl = URL.createObjectURL(new Blob([
          "(",
          function() {
            self.addEventListener("message", function(e) {
              var st = Date.now();
              var et = st + 4;
              while (Date.now() < et) ;
              self.postMessage({ st, et });
            });
          }.toString(),
          ")()"
        ], { type: "application/javascript" }));
        sample([], 5, 16);
        function sample(max, samples, numWorkers) {
          if (samples === 0) {
            var avg = Math.floor(max.reduce(function(avg2, x) {
              return avg2 + x;
            }, 0) / max.length);
            util.cores = Math.max(1, avg);
            URL.revokeObjectURL(blobUrl);
            return callback(null, util.cores);
          }
          map(numWorkers, function(err, results) {
            max.push(reduce(numWorkers, results));
            sample(max, samples - 1, numWorkers);
          });
        }
        function map(numWorkers, callback2) {
          var workers = [];
          var results = [];
          for (var i = 0; i < numWorkers; ++i) {
            var worker = new Worker(blobUrl);
            worker.addEventListener("message", function(e) {
              results.push(e.data);
              if (results.length === numWorkers) {
                for (var i2 = 0; i2 < numWorkers; ++i2) {
                  workers[i2].terminate();
                }
                callback2(null, results);
              }
            });
            workers.push(worker);
          }
          for (var i = 0; i < numWorkers; ++i) {
            workers[i].postMessage(i);
          }
        }
        function reduce(numWorkers, results) {
          var overlaps = [];
          for (var n = 0; n < numWorkers; ++n) {
            var r1 = results[n];
            var overlap = overlaps[n] = [];
            for (var i = 0; i < numWorkers; ++i) {
              if (n === i) {
                continue;
              }
              var r2 = results[i];
              if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
                overlap.push(i);
              }
            }
          }
          return overlaps.reduce(function(max, overlap2) {
            return Math.max(max, overlap2.length);
          }, 0);
        }
      };
    }
  });

  // node_modules/node-forge/lib/cipher.js
  var require_cipher = __commonJS({
    "node_modules/node-forge/lib/cipher.js"(exports, module) {
      var forge = require_forge();
      require_util();
      module.exports = forge.cipher = forge.cipher || {};
      forge.cipher.algorithms = forge.cipher.algorithms || {};
      forge.cipher.createCipher = function(algorithm, key) {
        var api = algorithm;
        if (typeof api === "string") {
          api = forge.cipher.getAlgorithm(api);
          if (api) {
            api = api();
          }
        }
        if (!api) {
          throw new Error("Unsupported algorithm: " + algorithm);
        }
        return new forge.cipher.BlockCipher({
          algorithm: api,
          key,
          decrypt: false
        });
      };
      forge.cipher.createDecipher = function(algorithm, key) {
        var api = algorithm;
        if (typeof api === "string") {
          api = forge.cipher.getAlgorithm(api);
          if (api) {
            api = api();
          }
        }
        if (!api) {
          throw new Error("Unsupported algorithm: " + algorithm);
        }
        return new forge.cipher.BlockCipher({
          algorithm: api,
          key,
          decrypt: true
        });
      };
      forge.cipher.registerAlgorithm = function(name, algorithm) {
        name = name.toUpperCase();
        forge.cipher.algorithms[name] = algorithm;
      };
      forge.cipher.getAlgorithm = function(name) {
        name = name.toUpperCase();
        if (name in forge.cipher.algorithms) {
          return forge.cipher.algorithms[name];
        }
        return null;
      };
      var BlockCipher = forge.cipher.BlockCipher = function(options) {
        this.algorithm = options.algorithm;
        this.mode = this.algorithm.mode;
        this.blockSize = this.mode.blockSize;
        this._finish = false;
        this._input = null;
        this.output = null;
        this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
        this._decrypt = options.decrypt;
        this.algorithm.initialize(options);
      };
      BlockCipher.prototype.start = function(options) {
        options = options || {};
        var opts = {};
        for (var key in options) {
          opts[key] = options[key];
        }
        opts.decrypt = this._decrypt;
        this._finish = false;
        this._input = forge.util.createBuffer();
        this.output = options.output || forge.util.createBuffer();
        this.mode.start(opts);
      };
      BlockCipher.prototype.update = function(input) {
        if (input) {
          this._input.putBuffer(input);
        }
        while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {
        }
        this._input.compact();
      };
      BlockCipher.prototype.finish = function(pad) {
        if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
          this.mode.pad = function(input) {
            return pad(this.blockSize, input, false);
          };
          this.mode.unpad = function(output) {
            return pad(this.blockSize, output, true);
          };
        }
        var options = {};
        options.decrypt = this._decrypt;
        options.overflow = this._input.length() % this.blockSize;
        if (!this._decrypt && this.mode.pad) {
          if (!this.mode.pad(this._input, options)) {
            return false;
          }
        }
        this._finish = true;
        this.update();
        if (this._decrypt && this.mode.unpad) {
          if (!this.mode.unpad(this.output, options)) {
            return false;
          }
        }
        if (this.mode.afterFinish) {
          if (!this.mode.afterFinish(this.output, options)) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/node-forge/lib/cipherModes.js
  var require_cipherModes = __commonJS({
    "node_modules/node-forge/lib/cipherModes.js"(exports, module) {
      var forge = require_forge();
      require_util();
      forge.cipher = forge.cipher || {};
      var modes = module.exports = forge.cipher.modes = forge.cipher.modes || {};
      modes.ecb = function(options) {
        options = options || {};
        this.name = "ECB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
      };
      modes.ecb.prototype.start = function(options) {
      };
      modes.ecb.prototype.encrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
      };
      modes.ecb.prototype.decrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.decrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
      };
      modes.ecb.prototype.pad = function(input, options) {
        var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
        input.fillWithByte(padding, padding);
        return true;
      };
      modes.ecb.prototype.unpad = function(output, options) {
        if (options.overflow > 0) {
          return false;
        }
        var len = output.length();
        var count = output.at(len - 1);
        if (count > this.blockSize << 2) {
          return false;
        }
        output.truncate(count);
        return true;
      };
      modes.cbc = function(options) {
        options = options || {};
        this.name = "CBC";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
      };
      modes.cbc.prototype.start = function(options) {
        if (options.iv === null) {
          if (!this._prev) {
            throw new Error("Invalid IV parameter.");
          }
          this._iv = this._prev.slice(0);
        } else if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        } else {
          this._iv = transformIV(options.iv, this.blockSize);
          this._prev = this._iv.slice(0);
        }
      };
      modes.cbc.prototype.encrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._prev[i] ^ input.getInt32();
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i]);
        }
        this._prev = this._outBlock;
      };
      modes.cbc.prototype.decrypt = function(input, output, finish) {
        if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
          return true;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
        }
        this.cipher.decrypt(this._inBlock, this._outBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._prev[i] ^ this._outBlock[i]);
        }
        this._prev = this._inBlock.slice(0);
      };
      modes.cbc.prototype.pad = function(input, options) {
        var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
        input.fillWithByte(padding, padding);
        return true;
      };
      modes.cbc.prototype.unpad = function(output, options) {
        if (options.overflow > 0) {
          return false;
        }
        var len = output.length();
        var count = output.at(len - 1);
        if (count > this.blockSize << 2) {
          return false;
        }
        output.truncate(count);
        return true;
      };
      modes.cfb = function(options) {
        options = options || {};
        this.name = "CFB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialBlock = new Array(this._ints);
        this._partialOutput = forge.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.cfb.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.cfb.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
            output.putInt32(this._inBlock[i]);
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
          this._partialOutput.putInt32(this._partialBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._partialBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(
            partialBytes - this._partialBytes
          ));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(
          inputLength - this._partialBytes
        ));
        this._partialBytes = 0;
      };
      modes.cfb.prototype.decrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = input.getInt32();
            output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialBlock[i] = input.getInt32();
          this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._partialBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(
            partialBytes - this._partialBytes
          ));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(
          inputLength - this._partialBytes
        ));
        this._partialBytes = 0;
      };
      modes.ofb = function(options) {
        options = options || {};
        this.name = "OFB";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.ofb.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.ofb.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (input.length() === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(input.getInt32() ^ this._outBlock[i]);
            this._inBlock[i] = this._outBlock[i];
          }
          return;
        }
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        } else {
          for (var i = 0; i < this._ints; ++i) {
            this._inBlock[i] = this._outBlock[i];
          }
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(
            partialBytes - this._partialBytes
          ));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(
          inputLength - this._partialBytes
        ));
        this._partialBytes = 0;
      };
      modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
      modes.ctr = function(options) {
        options = options || {};
        this.name = "CTR";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = null;
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge.util.createBuffer();
        this._partialBytes = 0;
      };
      modes.ctr.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        this._iv = transformIV(options.iv, this.blockSize);
        this._inBlock = this._iv.slice(0);
        this._partialBytes = 0;
      };
      modes.ctr.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
        } else {
          var partialBytes = (this.blockSize - inputLength) % this.blockSize;
          if (partialBytes > 0) {
            partialBytes = this.blockSize - partialBytes;
          }
          this._partialOutput.clear();
          for (var i = 0; i < this._ints; ++i) {
            this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
          if (partialBytes > 0) {
            input.read -= this.blockSize;
          }
          if (this._partialBytes > 0) {
            this._partialOutput.getBytes(this._partialBytes);
          }
          if (partialBytes > 0 && !finish) {
            output.putBytes(this._partialOutput.getBytes(
              partialBytes - this._partialBytes
            ));
            this._partialBytes = partialBytes;
            return true;
          }
          output.putBytes(this._partialOutput.getBytes(
            inputLength - this._partialBytes
          ));
          this._partialBytes = 0;
        }
        inc32(this._inBlock);
      };
      modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
      modes.gcm = function(options) {
        options = options || {};
        this.name = "GCM";
        this.cipher = options.cipher;
        this.blockSize = options.blockSize || 16;
        this._ints = this.blockSize / 4;
        this._inBlock = new Array(this._ints);
        this._outBlock = new Array(this._ints);
        this._partialOutput = forge.util.createBuffer();
        this._partialBytes = 0;
        this._R = 3774873600;
      };
      modes.gcm.prototype.start = function(options) {
        if (!("iv" in options)) {
          throw new Error("Invalid IV parameter.");
        }
        var iv = forge.util.createBuffer(options.iv);
        this._cipherLength = 0;
        var additionalData;
        if ("additionalData" in options) {
          additionalData = forge.util.createBuffer(options.additionalData);
        } else {
          additionalData = forge.util.createBuffer();
        }
        if ("tagLength" in options) {
          this._tagLength = options.tagLength;
        } else {
          this._tagLength = 128;
        }
        this._tag = null;
        if (options.decrypt) {
          this._tag = forge.util.createBuffer(options.tag).getBytes();
          if (this._tag.length !== this._tagLength / 8) {
            throw new Error("Authentication tag does not match tag length.");
          }
        }
        this._hashBlock = new Array(this._ints);
        this.tag = null;
        this._hashSubkey = new Array(this._ints);
        this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
        this.componentBits = 4;
        this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
        var ivLength = iv.length();
        if (ivLength === 12) {
          this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
        } else {
          this._j0 = [0, 0, 0, 0];
          while (iv.length() > 0) {
            this._j0 = this.ghash(
              this._hashSubkey,
              this._j0,
              [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]
            );
          }
          this._j0 = this.ghash(
            this._hashSubkey,
            this._j0,
            [0, 0].concat(from64To32(ivLength * 8))
          );
        }
        this._inBlock = this._j0.slice(0);
        inc32(this._inBlock);
        this._partialBytes = 0;
        additionalData = forge.util.createBuffer(additionalData);
        this._aDataLength = from64To32(additionalData.length() * 8);
        var overflow = additionalData.length() % this.blockSize;
        if (overflow) {
          additionalData.fillWithByte(0, this.blockSize - overflow);
        }
        this._s = [0, 0, 0, 0];
        while (additionalData.length() > 0) {
          this._s = this.ghash(this._hashSubkey, this._s, [
            additionalData.getInt32(),
            additionalData.getInt32(),
            additionalData.getInt32(),
            additionalData.getInt32()
          ]);
        }
      };
      modes.gcm.prototype.encrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength === 0) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        if (this._partialBytes === 0 && inputLength >= this.blockSize) {
          for (var i = 0; i < this._ints; ++i) {
            output.putInt32(this._outBlock[i] ^= input.getInt32());
          }
          this._cipherLength += this.blockSize;
        } else {
          var partialBytes = (this.blockSize - inputLength) % this.blockSize;
          if (partialBytes > 0) {
            partialBytes = this.blockSize - partialBytes;
          }
          this._partialOutput.clear();
          for (var i = 0; i < this._ints; ++i) {
            this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
          }
          if (partialBytes <= 0 || finish) {
            if (finish) {
              var overflow = inputLength % this.blockSize;
              this._cipherLength += overflow;
              this._partialOutput.truncate(this.blockSize - overflow);
            } else {
              this._cipherLength += this.blockSize;
            }
            for (var i = 0; i < this._ints; ++i) {
              this._outBlock[i] = this._partialOutput.getInt32();
            }
            this._partialOutput.read -= this.blockSize;
          }
          if (this._partialBytes > 0) {
            this._partialOutput.getBytes(this._partialBytes);
          }
          if (partialBytes > 0 && !finish) {
            input.read -= this.blockSize;
            output.putBytes(this._partialOutput.getBytes(
              partialBytes - this._partialBytes
            ));
            this._partialBytes = partialBytes;
            return true;
          }
          output.putBytes(this._partialOutput.getBytes(
            inputLength - this._partialBytes
          ));
          this._partialBytes = 0;
        }
        this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
        inc32(this._inBlock);
      };
      modes.gcm.prototype.decrypt = function(input, output, finish) {
        var inputLength = input.length();
        if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
          return true;
        }
        this.cipher.encrypt(this._inBlock, this._outBlock);
        inc32(this._inBlock);
        this._hashBlock[0] = input.getInt32();
        this._hashBlock[1] = input.getInt32();
        this._hashBlock[2] = input.getInt32();
        this._hashBlock[3] = input.getInt32();
        this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
        }
        if (inputLength < this.blockSize) {
          this._cipherLength += inputLength % this.blockSize;
        } else {
          this._cipherLength += this.blockSize;
        }
      };
      modes.gcm.prototype.afterFinish = function(output, options) {
        var rval = true;
        if (options.decrypt && options.overflow) {
          output.truncate(this.blockSize - options.overflow);
        }
        this.tag = forge.util.createBuffer();
        var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
        this._s = this.ghash(this._hashSubkey, this._s, lengths);
        var tag = [];
        this.cipher.encrypt(this._j0, tag);
        for (var i = 0; i < this._ints; ++i) {
          this.tag.putInt32(this._s[i] ^ tag[i]);
        }
        this.tag.truncate(this.tag.length() % (this._tagLength / 8));
        if (options.decrypt && this.tag.bytes() !== this._tag) {
          rval = false;
        }
        return rval;
      };
      modes.gcm.prototype.multiply = function(x, y) {
        var z_i = [0, 0, 0, 0];
        var v_i = y.slice(0);
        for (var i = 0; i < 128; ++i) {
          var x_i = x[i / 32 | 0] & 1 << 31 - i % 32;
          if (x_i) {
            z_i[0] ^= v_i[0];
            z_i[1] ^= v_i[1];
            z_i[2] ^= v_i[2];
            z_i[3] ^= v_i[3];
          }
          this.pow(v_i, v_i);
        }
        return z_i;
      };
      modes.gcm.prototype.pow = function(x, out) {
        var lsb = x[3] & 1;
        for (var i = 3; i > 0; --i) {
          out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
        }
        out[0] = x[0] >>> 1;
        if (lsb) {
          out[0] ^= this._R;
        }
      };
      modes.gcm.prototype.tableMultiply = function(x) {
        var z = [0, 0, 0, 0];
        for (var i = 0; i < 32; ++i) {
          var idx = i / 8 | 0;
          var x_i = x[idx] >>> (7 - i % 8) * 4 & 15;
          var ah = this._m[i][x_i];
          z[0] ^= ah[0];
          z[1] ^= ah[1];
          z[2] ^= ah[2];
          z[3] ^= ah[3];
        }
        return z;
      };
      modes.gcm.prototype.ghash = function(h, y, x) {
        y[0] ^= x[0];
        y[1] ^= x[1];
        y[2] ^= x[2];
        y[3] ^= x[3];
        return this.tableMultiply(y);
      };
      modes.gcm.prototype.generateHashTable = function(h, bits) {
        var multiplier = 8 / bits;
        var perInt = 4 * multiplier;
        var size = 16 * multiplier;
        var m = new Array(size);
        for (var i = 0; i < size; ++i) {
          var tmp = [0, 0, 0, 0];
          var idx = i / perInt | 0;
          var shft = (perInt - 1 - i % perInt) * bits;
          tmp[idx] = 1 << bits - 1 << shft;
          m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits);
        }
        return m;
      };
      modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
        var size = 1 << bits;
        var half = size >>> 1;
        var m = new Array(size);
        m[half] = mid.slice(0);
        var i = half >>> 1;
        while (i > 0) {
          this.pow(m[2 * i], m[i] = []);
          i >>= 1;
        }
        i = 2;
        while (i < half) {
          for (var j = 1; j < i; ++j) {
            var m_i = m[i];
            var m_j = m[j];
            m[i + j] = [
              m_i[0] ^ m_j[0],
              m_i[1] ^ m_j[1],
              m_i[2] ^ m_j[2],
              m_i[3] ^ m_j[3]
            ];
          }
          i *= 2;
        }
        m[0] = [0, 0, 0, 0];
        for (i = half + 1; i < size; ++i) {
          var c = m[i ^ half];
          m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
        }
        return m;
      };
      function transformIV(iv, blockSize) {
        if (typeof iv === "string") {
          iv = forge.util.createBuffer(iv);
        }
        if (forge.util.isArray(iv) && iv.length > 4) {
          var tmp = iv;
          iv = forge.util.createBuffer();
          for (var i = 0; i < tmp.length; ++i) {
            iv.putByte(tmp[i]);
          }
        }
        if (iv.length() < blockSize) {
          throw new Error(
            "Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes."
          );
        }
        if (!forge.util.isArray(iv)) {
          var ints = [];
          var blocks = blockSize / 4;
          for (var i = 0; i < blocks; ++i) {
            ints.push(iv.getInt32());
          }
          iv = ints;
        }
        return iv;
      }
      function inc32(block) {
        block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
      }
      function from64To32(num) {
        return [num / 4294967296 | 0, num & 4294967295];
      }
    }
  });

  // node_modules/node-forge/lib/aes.js
  var require_aes2 = __commonJS({
    "node_modules/node-forge/lib/aes.js"(exports, module) {
      var forge = require_forge();
      require_cipher();
      require_cipherModes();
      require_util();
      module.exports = forge.aes = forge.aes || {};
      forge.aes.startEncrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: false,
          mode
        });
        cipher.start(iv);
        return cipher;
      };
      forge.aes.createEncryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: false,
          mode
        });
      };
      forge.aes.startDecrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: true,
          mode
        });
        cipher.start(iv);
        return cipher;
      };
      forge.aes.createDecryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: true,
          mode
        });
      };
      forge.aes.Algorithm = function(name, mode) {
        if (!init) {
          initialize();
        }
        var self2 = this;
        self2.name = name;
        self2.mode = new mode({
          blockSize: 16,
          cipher: {
            encrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._w, inBlock, outBlock, false);
            },
            decrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._w, inBlock, outBlock, true);
            }
          }
        });
        self2._init = false;
      };
      forge.aes.Algorithm.prototype.initialize = function(options) {
        if (this._init) {
          return;
        }
        var key = options.key;
        var tmp;
        if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) {
          key = forge.util.createBuffer(key);
        } else if (forge.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
          tmp = key;
          key = forge.util.createBuffer();
          for (var i = 0; i < tmp.length; ++i) {
            key.putByte(tmp[i]);
          }
        }
        if (!forge.util.isArray(key)) {
          tmp = key;
          key = [];
          var len = tmp.length();
          if (len === 16 || len === 24 || len === 32) {
            len = len >>> 2;
            for (var i = 0; i < len; ++i) {
              key.push(tmp.getInt32());
            }
          }
        }
        if (!forge.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
          throw new Error("Invalid key parameter.");
        }
        var mode = this.mode.name;
        var encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
        this._w = _expandKey(key, options.decrypt && !encryptOp);
        this._init = true;
      };
      forge.aes._expandKey = function(key, decrypt) {
        if (!init) {
          initialize();
        }
        return _expandKey(key, decrypt);
      };
      forge.aes._updateBlock = _updateBlock;
      registerAlgorithm("AES-ECB", forge.cipher.modes.ecb);
      registerAlgorithm("AES-CBC", forge.cipher.modes.cbc);
      registerAlgorithm("AES-CFB", forge.cipher.modes.cfb);
      registerAlgorithm("AES-OFB", forge.cipher.modes.ofb);
      registerAlgorithm("AES-CTR", forge.cipher.modes.ctr);
      registerAlgorithm("AES-GCM", forge.cipher.modes.gcm);
      function registerAlgorithm(name, mode) {
        var factory = function() {
          return new forge.aes.Algorithm(name, mode);
        };
        forge.cipher.registerAlgorithm(name, factory);
      }
      var init = false;
      var Nb = 4;
      var sbox;
      var isbox;
      var rcon;
      var mix;
      var imix;
      function initialize() {
        init = true;
        rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        var xtime = new Array(256);
        for (var i = 0; i < 128; ++i) {
          xtime[i] = i << 1;
          xtime[i + 128] = i + 128 << 1 ^ 283;
        }
        sbox = new Array(256);
        isbox = new Array(256);
        mix = new Array(4);
        imix = new Array(4);
        for (var i = 0; i < 4; ++i) {
          mix[i] = new Array(256);
          imix[i] = new Array(256);
        }
        var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
        for (var i = 0; i < 256; ++i) {
          sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
          sx = sx >> 8 ^ sx & 255 ^ 99;
          sbox[e] = sx;
          isbox[sx] = e;
          sx2 = xtime[sx];
          e2 = xtime[e];
          e4 = xtime[e2];
          e8 = xtime[e4];
          me = sx2 << 24 ^ // 2
          sx << 16 ^ // 1
          sx << 8 ^ // 1
          (sx ^ sx2);
          ime = (e2 ^ e4 ^ e8) << 24 ^ // E (14)
          (e ^ e8) << 16 ^ // 9
          (e ^ e4 ^ e8) << 8 ^ // D (13)
          (e ^ e2 ^ e8);
          for (var n = 0; n < 4; ++n) {
            mix[n][e] = me;
            imix[n][sx] = ime;
            me = me << 24 | me >>> 8;
            ime = ime << 24 | ime >>> 8;
          }
          if (e === 0) {
            e = ei = 1;
          } else {
            e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
            ei ^= xtime[xtime[ei]];
          }
        }
      }
      function _expandKey(key, decrypt) {
        var w = key.slice(0);
        var temp, iNk = 1;
        var Nk = w.length;
        var Nr1 = Nk + 6 + 1;
        var end = Nb * Nr1;
        for (var i = Nk; i < end; ++i) {
          temp = w[i - 1];
          if (i % Nk === 0) {
            temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
            iNk++;
          } else if (Nk > 6 && i % Nk === 4) {
            temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
          }
          w[i] = w[i - Nk] ^ temp;
        }
        if (decrypt) {
          var tmp;
          var m0 = imix[0];
          var m1 = imix[1];
          var m2 = imix[2];
          var m3 = imix[3];
          var wnew = w.slice(0);
          end = w.length;
          for (var i = 0, wi = end - Nb; i < end; i += Nb, wi -= Nb) {
            if (i === 0 || i === end - Nb) {
              wnew[i] = w[wi];
              wnew[i + 1] = w[wi + 3];
              wnew[i + 2] = w[wi + 2];
              wnew[i + 3] = w[wi + 1];
            } else {
              for (var n = 0; n < Nb; ++n) {
                tmp = w[wi + n];
                wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
              }
            }
          }
          w = wnew;
        }
        return w;
      }
      function _updateBlock(w, input, output, decrypt) {
        var Nr = w.length / 4 - 1;
        var m0, m1, m2, m3, sub;
        if (decrypt) {
          m0 = imix[0];
          m1 = imix[1];
          m2 = imix[2];
          m3 = imix[3];
          sub = isbox;
        } else {
          m0 = mix[0];
          m1 = mix[1];
          m2 = mix[2];
          m3 = mix[3];
          sub = sbox;
        }
        var a, b, c, d, a2, b2, c2;
        a = input[0] ^ w[0];
        b = input[decrypt ? 3 : 1] ^ w[1];
        c = input[2] ^ w[2];
        d = input[decrypt ? 1 : 3] ^ w[3];
        var i = 3;
        for (var round = 1; round < Nr; ++round) {
          a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
          b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
          c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
          d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
          a = a2;
          b = b2;
          c = c2;
        }
        output[0] = sub[a >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d & 255] ^ w[++i];
        output[decrypt ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a & 255] ^ w[++i];
        output[2] = sub[c >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b & 255] ^ w[++i];
        output[decrypt ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c & 255] ^ w[++i];
      }
      function _createCipher(options) {
        options = options || {};
        var mode = (options.mode || "CBC").toUpperCase();
        var algorithm = "AES-" + mode;
        var cipher;
        if (options.decrypt) {
          cipher = forge.cipher.createDecipher(algorithm, options.key);
        } else {
          cipher = forge.cipher.createCipher(algorithm, options.key);
        }
        var start = cipher.start;
        cipher.start = function(iv, options2) {
          var output = null;
          if (options2 instanceof forge.util.ByteBuffer) {
            output = options2;
            options2 = {};
          }
          options2 = options2 || {};
          options2.output = output;
          options2.iv = iv;
          start.call(cipher, options2);
        };
        return cipher;
      }
    }
  });

  // node_modules/node-forge/lib/oids.js
  var require_oids = __commonJS({
    "node_modules/node-forge/lib/oids.js"(exports, module) {
      var forge = require_forge();
      forge.pki = forge.pki || {};
      var oids = module.exports = forge.pki.oids = forge.oids = forge.oids || {};
      function _IN(id, name) {
        oids[id] = name;
        oids[name] = id;
      }
      function _I_(id, name) {
        oids[id] = name;
      }
      _IN("1.2.840.113549.1.1.1", "rsaEncryption");
      _IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
      _IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
      _IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
      _IN("1.2.840.113549.1.1.8", "mgf1");
      _IN("1.2.840.113549.1.1.9", "pSpecified");
      _IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
      _IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
      _IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
      _IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
      _IN("1.3.101.112", "EdDSA25519");
      _IN("1.2.840.10040.4.3", "dsa-with-sha1");
      _IN("1.3.14.3.2.7", "desCBC");
      _IN("1.3.14.3.2.26", "sha1");
      _IN("1.3.14.3.2.29", "sha1WithRSASignature");
      _IN("2.16.840.1.101.3.4.2.1", "sha256");
      _IN("2.16.840.1.101.3.4.2.2", "sha384");
      _IN("2.16.840.1.101.3.4.2.3", "sha512");
      _IN("2.16.840.1.101.3.4.2.4", "sha224");
      _IN("2.16.840.1.101.3.4.2.5", "sha512-224");
      _IN("2.16.840.1.101.3.4.2.6", "sha512-256");
      _IN("1.2.840.113549.2.2", "md2");
      _IN("1.2.840.113549.2.5", "md5");
      _IN("1.2.840.113549.1.7.1", "data");
      _IN("1.2.840.113549.1.7.2", "signedData");
      _IN("1.2.840.113549.1.7.3", "envelopedData");
      _IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
      _IN("1.2.840.113549.1.7.5", "digestedData");
      _IN("1.2.840.113549.1.7.6", "encryptedData");
      _IN("1.2.840.113549.1.9.1", "emailAddress");
      _IN("1.2.840.113549.1.9.2", "unstructuredName");
      _IN("1.2.840.113549.1.9.3", "contentType");
      _IN("1.2.840.113549.1.9.4", "messageDigest");
      _IN("1.2.840.113549.1.9.5", "signingTime");
      _IN("1.2.840.113549.1.9.6", "counterSignature");
      _IN("1.2.840.113549.1.9.7", "challengePassword");
      _IN("1.2.840.113549.1.9.8", "unstructuredAddress");
      _IN("1.2.840.113549.1.9.14", "extensionRequest");
      _IN("1.2.840.113549.1.9.20", "friendlyName");
      _IN("1.2.840.113549.1.9.21", "localKeyId");
      _IN("1.2.840.113549.1.9.22.1", "x509Certificate");
      _IN("1.2.840.113549.1.12.10.1.1", "keyBag");
      _IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
      _IN("1.2.840.113549.1.12.10.1.3", "certBag");
      _IN("1.2.840.113549.1.12.10.1.4", "crlBag");
      _IN("1.2.840.113549.1.12.10.1.5", "secretBag");
      _IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
      _IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
      _IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
      _IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
      _IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
      _IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
      _IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
      _IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
      _IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
      _IN("1.2.840.113549.2.7", "hmacWithSHA1");
      _IN("1.2.840.113549.2.8", "hmacWithSHA224");
      _IN("1.2.840.113549.2.9", "hmacWithSHA256");
      _IN("1.2.840.113549.2.10", "hmacWithSHA384");
      _IN("1.2.840.113549.2.11", "hmacWithSHA512");
      _IN("1.2.840.113549.3.7", "des-EDE3-CBC");
      _IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
      _IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
      _IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
      _IN("2.5.4.3", "commonName");
      _IN("2.5.4.4", "surname");
      _IN("2.5.4.5", "serialNumber");
      _IN("2.5.4.6", "countryName");
      _IN("2.5.4.7", "localityName");
      _IN("2.5.4.8", "stateOrProvinceName");
      _IN("2.5.4.9", "streetAddress");
      _IN("2.5.4.10", "organizationName");
      _IN("2.5.4.11", "organizationalUnitName");
      _IN("2.5.4.12", "title");
      _IN("2.5.4.13", "description");
      _IN("2.5.4.15", "businessCategory");
      _IN("2.5.4.17", "postalCode");
      _IN("2.5.4.42", "givenName");
      _IN("2.5.4.65", "pseudonym");
      _IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
      _IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
      _IN("2.16.840.1.113730.1.1", "nsCertType");
      _IN("2.16.840.1.113730.1.13", "nsComment");
      _I_("2.5.29.1", "authorityKeyIdentifier");
      _I_("2.5.29.2", "keyAttributes");
      _I_("2.5.29.3", "certificatePolicies");
      _I_("2.5.29.4", "keyUsageRestriction");
      _I_("2.5.29.5", "policyMapping");
      _I_("2.5.29.6", "subtreesConstraint");
      _I_("2.5.29.7", "subjectAltName");
      _I_("2.5.29.8", "issuerAltName");
      _I_("2.5.29.9", "subjectDirectoryAttributes");
      _I_("2.5.29.10", "basicConstraints");
      _I_("2.5.29.11", "nameConstraints");
      _I_("2.5.29.12", "policyConstraints");
      _I_("2.5.29.13", "basicConstraints");
      _IN("2.5.29.14", "subjectKeyIdentifier");
      _IN("2.5.29.15", "keyUsage");
      _I_("2.5.29.16", "privateKeyUsagePeriod");
      _IN("2.5.29.17", "subjectAltName");
      _IN("2.5.29.18", "issuerAltName");
      _IN("2.5.29.19", "basicConstraints");
      _I_("2.5.29.20", "cRLNumber");
      _I_("2.5.29.21", "cRLReason");
      _I_("2.5.29.22", "expirationDate");
      _I_("2.5.29.23", "instructionCode");
      _I_("2.5.29.24", "invalidityDate");
      _I_("2.5.29.25", "cRLDistributionPoints");
      _I_("2.5.29.26", "issuingDistributionPoint");
      _I_("2.5.29.27", "deltaCRLIndicator");
      _I_("2.5.29.28", "issuingDistributionPoint");
      _I_("2.5.29.29", "certificateIssuer");
      _I_("2.5.29.30", "nameConstraints");
      _IN("2.5.29.31", "cRLDistributionPoints");
      _IN("2.5.29.32", "certificatePolicies");
      _I_("2.5.29.33", "policyMappings");
      _I_("2.5.29.34", "policyConstraints");
      _IN("2.5.29.35", "authorityKeyIdentifier");
      _I_("2.5.29.36", "policyConstraints");
      _IN("2.5.29.37", "extKeyUsage");
      _I_("2.5.29.46", "freshestCRL");
      _I_("2.5.29.54", "inhibitAnyPolicy");
      _IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
      _IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
      _IN("1.3.6.1.5.5.7.3.1", "serverAuth");
      _IN("1.3.6.1.5.5.7.3.2", "clientAuth");
      _IN("1.3.6.1.5.5.7.3.3", "codeSigning");
      _IN("1.3.6.1.5.5.7.3.4", "emailProtection");
      _IN("1.3.6.1.5.5.7.3.8", "timeStamping");
    }
  });

  // node_modules/node-forge/lib/asn1.js
  var require_asn12 = __commonJS({
    "node_modules/node-forge/lib/asn1.js"(exports, module) {
      var forge = require_forge();
      require_util();
      require_oids();
      var asn1 = module.exports = forge.asn1 = forge.asn1 || {};
      asn1.Class = {
        UNIVERSAL: 0,
        APPLICATION: 64,
        CONTEXT_SPECIFIC: 128,
        PRIVATE: 192
      };
      asn1.Type = {
        NONE: 0,
        BOOLEAN: 1,
        INTEGER: 2,
        BITSTRING: 3,
        OCTETSTRING: 4,
        NULL: 5,
        OID: 6,
        ODESC: 7,
        EXTERNAL: 8,
        REAL: 9,
        ENUMERATED: 10,
        EMBEDDED: 11,
        UTF8: 12,
        ROID: 13,
        SEQUENCE: 16,
        SET: 17,
        PRINTABLESTRING: 19,
        IA5STRING: 22,
        UTCTIME: 23,
        GENERALIZEDTIME: 24,
        BMPSTRING: 30
      };
      asn1.maxDepth = 256;
      asn1.create = function(tagClass, type, constructed, value, options) {
        if (forge.util.isArray(value)) {
          var tmp = [];
          for (var i = 0; i < value.length; ++i) {
            if (value[i] !== void 0) {
              tmp.push(value[i]);
            }
          }
          value = tmp;
        }
        var obj = {
          tagClass,
          type,
          constructed,
          composed: constructed || forge.util.isArray(value),
          value
        };
        if (options && "bitStringContents" in options) {
          obj.bitStringContents = options.bitStringContents;
          obj.original = asn1.copy(obj);
        }
        return obj;
      };
      asn1.copy = function(obj, options) {
        var copy;
        if (forge.util.isArray(obj)) {
          copy = [];
          for (var i = 0; i < obj.length; ++i) {
            copy.push(asn1.copy(obj[i], options));
          }
          return copy;
        }
        if (typeof obj === "string") {
          return obj;
        }
        copy = {
          tagClass: obj.tagClass,
          type: obj.type,
          constructed: obj.constructed,
          composed: obj.composed,
          value: asn1.copy(obj.value, options)
        };
        if (options && !options.excludeBitStringContents) {
          copy.bitStringContents = obj.bitStringContents;
        }
        return copy;
      };
      asn1.equals = function(obj1, obj2, options) {
        if (forge.util.isArray(obj1)) {
          if (!forge.util.isArray(obj2)) {
            return false;
          }
          if (obj1.length !== obj2.length) {
            return false;
          }
          for (var i = 0; i < obj1.length; ++i) {
            if (!asn1.equals(obj1[i], obj2[i])) {
              return false;
            }
          }
          return true;
        }
        if (typeof obj1 !== typeof obj2) {
          return false;
        }
        if (typeof obj1 === "string") {
          return obj1 === obj2;
        }
        var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
        if (options && options.includeBitStringContents) {
          equal = equal && obj1.bitStringContents === obj2.bitStringContents;
        }
        return equal;
      };
      asn1.getBerValueLength = function(b) {
        var b2 = b.getByte();
        if (b2 === 128) {
          return void 0;
        }
        var length;
        var longForm = b2 & 128;
        if (!longForm) {
          length = b2;
        } else {
          length = b.getInt((b2 & 127) << 3);
        }
        return length;
      };
      function _checkBufferLength(bytes, remaining, n) {
        if (n > remaining) {
          var error = new Error("Too few bytes to parse DER.");
          error.available = bytes.length();
          error.remaining = remaining;
          error.requested = n;
          throw error;
        }
      }
      var _getValueLength = function(bytes, remaining) {
        var b2 = bytes.getByte();
        remaining--;
        if (b2 === 128) {
          return void 0;
        }
        var length;
        var longForm = b2 & 128;
        if (!longForm) {
          length = b2;
        } else {
          var longFormBytes = b2 & 127;
          _checkBufferLength(bytes, remaining, longFormBytes);
          length = bytes.getInt(longFormBytes << 3);
        }
        if (length < 0) {
          throw new Error("Negative length: " + length);
        }
        return length;
      };
      asn1.fromDer = function(bytes, options) {
        if (options === void 0) {
          options = {
            strict: true,
            parseAllBytes: true,
            decodeBitStrings: true
          };
        }
        if (typeof options === "boolean") {
          options = {
            strict: options,
            parseAllBytes: true,
            decodeBitStrings: true
          };
        }
        if (!("strict" in options)) {
          options.strict = true;
        }
        if (!("parseAllBytes" in options)) {
          options.parseAllBytes = true;
        }
        if (!("decodeBitStrings" in options)) {
          options.decodeBitStrings = true;
        }
        if (!("maxDepth" in options)) {
          options.maxDepth = asn1.maxDepth;
        }
        if (typeof bytes === "string") {
          bytes = forge.util.createBuffer(bytes);
        }
        var byteCount = bytes.length();
        var value = _fromDer(bytes, bytes.length(), 0, options);
        if (options.parseAllBytes && bytes.length() !== 0) {
          var error = new Error("Unparsed DER bytes remain after ASN.1 parsing.");
          error.byteCount = byteCount;
          error.remaining = bytes.length();
          throw error;
        }
        return value;
      };
      function _fromDer(bytes, remaining, depth, options) {
        if (depth >= options.maxDepth) {
          throw new Error("ASN.1 parsing error: Max depth exceeded.");
        }
        var start;
        _checkBufferLength(bytes, remaining, 2);
        var b1 = bytes.getByte();
        remaining--;
        var tagClass = b1 & 192;
        var type = b1 & 31;
        start = bytes.length();
        var length = _getValueLength(bytes, remaining);
        remaining -= start - bytes.length();
        if (length !== void 0 && length > remaining) {
          if (options.strict) {
            var error = new Error("Too few bytes to read ASN.1 value.");
            error.available = bytes.length();
            error.remaining = remaining;
            error.requested = length;
            throw error;
          }
          length = remaining;
        }
        var value;
        var bitStringContents;
        var constructed = (b1 & 32) === 32;
        if (constructed) {
          value = [];
          if (length === void 0) {
            for (; ; ) {
              _checkBufferLength(bytes, remaining, 2);
              if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
                bytes.getBytes(2);
                remaining -= 2;
                break;
              }
              start = bytes.length();
              value.push(_fromDer(bytes, remaining, depth + 1, options));
              remaining -= start - bytes.length();
            }
          } else {
            while (length > 0) {
              start = bytes.length();
              value.push(_fromDer(bytes, length, depth + 1, options));
              remaining -= start - bytes.length();
              length -= start - bytes.length();
            }
          }
        }
        if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) {
          bitStringContents = bytes.bytes(length);
        }
        if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && // FIXME: OCTET STRINGs not yet supported here
        // .. other parts of forge expect to decode OCTET STRINGs manually
        type === asn1.Type.BITSTRING && length > 1) {
          var savedRead = bytes.read;
          var savedRemaining = remaining;
          var unused = 0;
          if (type === asn1.Type.BITSTRING) {
            _checkBufferLength(bytes, remaining, 1);
            unused = bytes.getByte();
            remaining--;
          }
          if (unused === 0) {
            try {
              start = bytes.length();
              var subOptions = {
                // enforce strict mode to avoid parsing ASN.1 from plain data
                strict: true,
                decodeBitStrings: true
              };
              var composed = _fromDer(bytes, remaining, depth + 1, subOptions);
              var used = start - bytes.length();
              remaining -= used;
              if (type == asn1.Type.BITSTRING) {
                used++;
              }
              var tc = composed.tagClass;
              if (used === length && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) {
                value = [composed];
              }
            } catch (ex) {
            }
          }
          if (value === void 0) {
            bytes.read = savedRead;
            remaining = savedRemaining;
          }
        }
        if (value === void 0) {
          if (length === void 0) {
            if (options.strict) {
              throw new Error("Non-constructed ASN.1 object of indefinite length.");
            }
            length = remaining;
          }
          if (type === asn1.Type.BMPSTRING) {
            value = "";
            for (; length > 0; length -= 2) {
              _checkBufferLength(bytes, remaining, 2);
              value += String.fromCharCode(bytes.getInt16());
              remaining -= 2;
            }
          } else {
            value = bytes.getBytes(length);
            remaining -= length;
          }
        }
        var asn1Options = bitStringContents === void 0 ? null : {
          bitStringContents
        };
        return asn1.create(tagClass, type, constructed, value, asn1Options);
      }
      asn1.toDer = function(obj) {
        var bytes = forge.util.createBuffer();
        var b1 = obj.tagClass | obj.type;
        var value = forge.util.createBuffer();
        var useBitStringContents = false;
        if ("bitStringContents" in obj) {
          useBitStringContents = true;
          if (obj.original) {
            useBitStringContents = asn1.equals(obj, obj.original);
          }
        }
        if (useBitStringContents) {
          value.putBytes(obj.bitStringContents);
        } else if (obj.composed) {
          if (obj.constructed) {
            b1 |= 32;
          } else {
            value.putByte(0);
          }
          for (var i = 0; i < obj.value.length; ++i) {
            if (obj.value[i] !== void 0) {
              value.putBuffer(asn1.toDer(obj.value[i]));
            }
          }
        } else {
          if (obj.type === asn1.Type.BMPSTRING) {
            for (var i = 0; i < obj.value.length; ++i) {
              value.putInt16(obj.value.charCodeAt(i));
            }
          } else {
            if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && // leading 0x00 for positive integer
            (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || // leading 0xFF for negative integer
            obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) {
              value.putBytes(obj.value.substr(1));
            } else {
              value.putBytes(obj.value);
            }
          }
        }
        bytes.putByte(b1);
        if (value.length() <= 127) {
          bytes.putByte(value.length() & 127);
        } else {
          var len = value.length();
          var lenBytes = "";
          do {
            lenBytes += String.fromCharCode(len & 255);
            len = len >>> 8;
          } while (len > 0);
          bytes.putByte(lenBytes.length | 128);
          for (var i = lenBytes.length - 1; i >= 0; --i) {
            bytes.putByte(lenBytes.charCodeAt(i));
          }
        }
        bytes.putBuffer(value);
        return bytes;
      };
      asn1.oidToDer = function(oid) {
        var values = oid.split(".");
        var bytes = forge.util.createBuffer();
        bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
        var last, valueBytes, value, b;
        for (var i = 2; i < values.length; ++i) {
          last = true;
          valueBytes = [];
          value = parseInt(values[i], 10);
          if (value > 4294967295) {
            throw new Error("OID value too large; max is 32-bits.");
          }
          do {
            b = value & 127;
            value = value >>> 7;
            if (!last) {
              b |= 128;
            }
            valueBytes.push(b);
            last = false;
          } while (value > 0);
          for (var n = valueBytes.length - 1; n >= 0; --n) {
            bytes.putByte(valueBytes[n]);
          }
        }
        return bytes;
      };
      asn1.derToOid = function(bytes) {
        var oid;
        if (typeof bytes === "string") {
          bytes = forge.util.createBuffer(bytes);
        }
        var b = bytes.getByte();
        oid = Math.floor(b / 40) + "." + b % 40;
        var value = 0;
        while (bytes.length() > 0) {
          if (value > 70368744177663) {
            throw new Error("OID value too large; max is 53-bits.");
          }
          b = bytes.getByte();
          value = value * 128;
          if (b & 128) {
            value += b & 127;
          } else {
            oid += "." + (value + b);
            value = 0;
          }
        }
        return oid;
      };
      asn1.utcTimeToDate = function(utc) {
        var date = /* @__PURE__ */ new Date();
        var year = parseInt(utc.substr(0, 2), 10);
        year = year >= 50 ? 1900 + year : 2e3 + year;
        var MM = parseInt(utc.substr(2, 2), 10) - 1;
        var DD = parseInt(utc.substr(4, 2), 10);
        var hh = parseInt(utc.substr(6, 2), 10);
        var mm = parseInt(utc.substr(8, 2), 10);
        var ss = 0;
        if (utc.length > 11) {
          var c = utc.charAt(10);
          var end = 10;
          if (c !== "+" && c !== "-") {
            ss = parseInt(utc.substr(10, 2), 10);
            end += 2;
          }
        }
        date.setUTCFullYear(year, MM, DD);
        date.setUTCHours(hh, mm, ss, 0);
        if (end) {
          c = utc.charAt(end);
          if (c === "+" || c === "-") {
            var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
            var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
            var offset = hhoffset * 60 + mmoffset;
            offset *= 6e4;
            if (c === "+") {
              date.setTime(+date - offset);
            } else {
              date.setTime(+date + offset);
            }
          }
        }
        return date;
      };
      asn1.generalizedTimeToDate = function(gentime) {
        var date = /* @__PURE__ */ new Date();
        var YYYY = parseInt(gentime.substr(0, 4), 10);
        var MM = parseInt(gentime.substr(4, 2), 10) - 1;
        var DD = parseInt(gentime.substr(6, 2), 10);
        var hh = parseInt(gentime.substr(8, 2), 10);
        var mm = parseInt(gentime.substr(10, 2), 10);
        var ss = parseInt(gentime.substr(12, 2), 10);
        var fff = 0;
        var offset = 0;
        var isUTC = false;
        if (gentime.charAt(gentime.length - 1) === "Z") {
          isUTC = true;
        }
        var end = gentime.length - 5, c = gentime.charAt(end);
        if (c === "+" || c === "-") {
          var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
          var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
          offset = hhoffset * 60 + mmoffset;
          offset *= 6e4;
          if (c === "+") {
            offset *= -1;
          }
          isUTC = true;
        }
        if (gentime.charAt(14) === ".") {
          fff = parseFloat(gentime.substr(14), 10) * 1e3;
        }
        if (isUTC) {
          date.setUTCFullYear(YYYY, MM, DD);
          date.setUTCHours(hh, mm, ss, fff);
          date.setTime(+date + offset);
        } else {
          date.setFullYear(YYYY, MM, DD);
          date.setHours(hh, mm, ss, fff);
        }
        return date;
      };
      asn1.dateToUtcTime = function(date) {
        if (typeof date === "string") {
          return date;
        }
        var rval = "";
        var format = [];
        format.push(("" + date.getUTCFullYear()).substr(2));
        format.push("" + (date.getUTCMonth() + 1));
        format.push("" + date.getUTCDate());
        format.push("" + date.getUTCHours());
        format.push("" + date.getUTCMinutes());
        format.push("" + date.getUTCSeconds());
        for (var i = 0; i < format.length; ++i) {
          if (format[i].length < 2) {
            rval += "0";
          }
          rval += format[i];
        }
        rval += "Z";
        return rval;
      };
      asn1.dateToGeneralizedTime = function(date) {
        if (typeof date === "string") {
          return date;
        }
        var rval = "";
        var format = [];
        format.push("" + date.getUTCFullYear());
        format.push("" + (date.getUTCMonth() + 1));
        format.push("" + date.getUTCDate());
        format.push("" + date.getUTCHours());
        format.push("" + date.getUTCMinutes());
        format.push("" + date.getUTCSeconds());
        for (var i = 0; i < format.length; ++i) {
          if (format[i].length < 2) {
            rval += "0";
          }
          rval += format[i];
        }
        rval += "Z";
        return rval;
      };
      asn1.integerToDer = function(x) {
        var rval = forge.util.createBuffer();
        if (x >= -128 && x < 128) {
          return rval.putSignedInt(x, 8);
        }
        if (x >= -32768 && x < 32768) {
          return rval.putSignedInt(x, 16);
        }
        if (x >= -8388608 && x < 8388608) {
          return rval.putSignedInt(x, 24);
        }
        if (x >= -2147483648 && x < 2147483648) {
          return rval.putSignedInt(x, 32);
        }
        var error = new Error("Integer too large; max is 32-bits.");
        error.integer = x;
        throw error;
      };
      asn1.derToInteger = function(bytes) {
        if (typeof bytes === "string") {
          bytes = forge.util.createBuffer(bytes);
        }
        var n = bytes.length() * 8;
        if (n > 32) {
          throw new Error("Integer too large; max is 32-bits.");
        }
        return bytes.getSignedInt(n);
      };
      asn1.validate = function(obj, v, capture, errors) {
        var rval = false;
        if ((obj.tagClass === v.tagClass || typeof v.tagClass === "undefined") && (obj.type === v.type || typeof v.type === "undefined")) {
          if (obj.constructed === v.constructed || typeof v.constructed === "undefined") {
            rval = true;
            if (v.value && forge.util.isArray(v.value)) {
              var j = 0;
              for (var i = 0; rval && i < v.value.length; ++i) {
                var schemaItem = v.value[i];
                rval = !!schemaItem.optional;
                var objChild = obj.value[j];
                if (!objChild) {
                  if (!schemaItem.optional) {
                    rval = false;
                    if (errors) {
                      errors.push("[" + v.name + '] Missing required element. Expected tag class "' + schemaItem.tagClass + '", type "' + schemaItem.type + '"');
                    }
                  }
                  continue;
                }
                var schemaHasTag = typeof schemaItem.tagClass !== "undefined" && typeof schemaItem.type !== "undefined";
                if (schemaHasTag && (objChild.tagClass !== schemaItem.tagClass || objChild.type !== schemaItem.type)) {
                  if (schemaItem.optional) {
                    rval = true;
                    continue;
                  } else {
                    rval = false;
                    if (errors) {
                      errors.push("[" + v.name + "] Tag mismatch. Expected (" + schemaItem.tagClass + "," + schemaItem.type + "), got (" + objChild.tagClass + "," + objChild.type + ")");
                    }
                    break;
                  }
                }
                var childRval = asn1.validate(objChild, schemaItem, capture, errors);
                if (childRval) {
                  ++j;
                  rval = true;
                } else if (schemaItem.optional) {
                  rval = true;
                } else {
                  rval = false;
                  break;
                }
              }
            }
            if (rval && capture) {
              if (v.capture) {
                capture[v.capture] = obj.value;
              }
              if (v.captureAsn1) {
                capture[v.captureAsn1] = obj;
              }
              if (v.captureBitStringContents && "bitStringContents" in obj) {
                capture[v.captureBitStringContents] = obj.bitStringContents;
              }
              if (v.captureBitStringValue && "bitStringContents" in obj) {
                var value;
                if (obj.bitStringContents.length < 2) {
                  capture[v.captureBitStringValue] = "";
                } else {
                  var unused = obj.bitStringContents.charCodeAt(0);
                  if (unused !== 0) {
                    throw new Error(
                      "captureBitStringValue only supported for zero unused bits"
                    );
                  }
                  capture[v.captureBitStringValue] = obj.bitStringContents.slice(1);
                }
              }
            }
          } else if (errors) {
            errors.push(
              "[" + v.name + '] Expected constructed "' + v.constructed + '", got "' + obj.constructed + '"'
            );
          }
        } else if (errors) {
          if (obj.tagClass !== v.tagClass) {
            errors.push(
              "[" + v.name + '] Expected tag class "' + v.tagClass + '", got "' + obj.tagClass + '"'
            );
          }
          if (obj.type !== v.type) {
            errors.push(
              "[" + v.name + '] Expected type "' + v.type + '", got "' + obj.type + '"'
            );
          }
        }
        return rval;
      };
      var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
      asn1.prettyPrint = function(obj, level, indentation) {
        var rval = "";
        level = level || 0;
        indentation = indentation || 2;
        if (level > 0) {
          rval += "\n";
        }
        var indent = "";
        for (var i = 0; i < level * indentation; ++i) {
          indent += " ";
        }
        rval += indent + "Tag: ";
        switch (obj.tagClass) {
          case asn1.Class.UNIVERSAL:
            rval += "Universal:";
            break;
          case asn1.Class.APPLICATION:
            rval += "Application:";
            break;
          case asn1.Class.CONTEXT_SPECIFIC:
            rval += "Context-Specific:";
            break;
          case asn1.Class.PRIVATE:
            rval += "Private:";
            break;
        }
        if (obj.tagClass === asn1.Class.UNIVERSAL) {
          rval += obj.type;
          switch (obj.type) {
            case asn1.Type.NONE:
              rval += " (None)";
              break;
            case asn1.Type.BOOLEAN:
              rval += " (Boolean)";
              break;
            case asn1.Type.INTEGER:
              rval += " (Integer)";
              break;
            case asn1.Type.BITSTRING:
              rval += " (Bit string)";
              break;
            case asn1.Type.OCTETSTRING:
              rval += " (Octet string)";
              break;
            case asn1.Type.NULL:
              rval += " (Null)";
              break;
            case asn1.Type.OID:
              rval += " (Object Identifier)";
              break;
            case asn1.Type.ODESC:
              rval += " (Object Descriptor)";
              break;
            case asn1.Type.EXTERNAL:
              rval += " (External or Instance of)";
              break;
            case asn1.Type.REAL:
              rval += " (Real)";
              break;
            case asn1.Type.ENUMERATED:
              rval += " (Enumerated)";
              break;
            case asn1.Type.EMBEDDED:
              rval += " (Embedded PDV)";
              break;
            case asn1.Type.UTF8:
              rval += " (UTF8)";
              break;
            case asn1.Type.ROID:
              rval += " (Relative Object Identifier)";
              break;
            case asn1.Type.SEQUENCE:
              rval += " (Sequence)";
              break;
            case asn1.Type.SET:
              rval += " (Set)";
              break;
            case asn1.Type.PRINTABLESTRING:
              rval += " (Printable String)";
              break;
            case asn1.Type.IA5String:
              rval += " (IA5String (ASCII))";
              break;
            case asn1.Type.UTCTIME:
              rval += " (UTC time)";
              break;
            case asn1.Type.GENERALIZEDTIME:
              rval += " (Generalized time)";
              break;
            case asn1.Type.BMPSTRING:
              rval += " (BMP String)";
              break;
          }
        } else {
          rval += obj.type;
        }
        rval += "\n";
        rval += indent + "Constructed: " + obj.constructed + "\n";
        if (obj.composed) {
          var subvalues = 0;
          var sub = "";
          for (var i = 0; i < obj.value.length; ++i) {
            if (obj.value[i] !== void 0) {
              subvalues += 1;
              sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
              if (i + 1 < obj.value.length) {
                sub += ",";
              }
            }
          }
          rval += indent + "Sub values: " + subvalues + sub;
        } else {
          rval += indent + "Value: ";
          if (obj.type === asn1.Type.OID) {
            var oid = asn1.derToOid(obj.value);
            rval += oid;
            if (forge.pki && forge.pki.oids) {
              if (oid in forge.pki.oids) {
                rval += " (" + forge.pki.oids[oid] + ") ";
              }
            }
          }
          if (obj.type === asn1.Type.INTEGER) {
            try {
              rval += asn1.derToInteger(obj.value);
            } catch (ex) {
              rval += "0x" + forge.util.bytesToHex(obj.value);
            }
          } else if (obj.type === asn1.Type.BITSTRING) {
            if (obj.value.length > 1) {
              rval += "0x" + forge.util.bytesToHex(obj.value.slice(1));
            } else {
              rval += "(none)";
            }
            if (obj.value.length > 0) {
              var unused = obj.value.charCodeAt(0);
              if (unused == 1) {
                rval += " (1 unused bit shown)";
              } else if (unused > 1) {
                rval += " (" + unused + " unused bits shown)";
              }
            }
          } else if (obj.type === asn1.Type.OCTETSTRING) {
            if (!_nonLatinRegex.test(obj.value)) {
              rval += "(" + obj.value + ") ";
            }
            rval += "0x" + forge.util.bytesToHex(obj.value);
          } else if (obj.type === asn1.Type.UTF8) {
            try {
              rval += forge.util.decodeUtf8(obj.value);
            } catch (e) {
              if (e.message === "URI malformed") {
                rval += "0x" + forge.util.bytesToHex(obj.value) + " (malformed UTF8)";
              } else {
                throw e;
              }
            }
          } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
            rval += obj.value;
          } else if (_nonLatinRegex.test(obj.value)) {
            rval += "0x" + forge.util.bytesToHex(obj.value);
          } else if (obj.value.length === 0) {
            rval += "[null]";
          } else {
            rval += obj.value;
          }
        }
        return rval;
      };
    }
  });

  // node_modules/node-forge/lib/md.js
  var require_md = __commonJS({
    "node_modules/node-forge/lib/md.js"(exports, module) {
      var forge = require_forge();
      module.exports = forge.md = forge.md || {};
      forge.md.algorithms = forge.md.algorithms || {};
    }
  });

  // node_modules/node-forge/lib/hmac.js
  var require_hmac2 = __commonJS({
    "node_modules/node-forge/lib/hmac.js"(exports, module) {
      var forge = require_forge();
      require_md();
      require_util();
      var hmac = module.exports = forge.hmac = forge.hmac || {};
      hmac.create = function() {
        var _key = null;
        var _md = null;
        var _ipadding = null;
        var _opadding = null;
        var ctx = {};
        ctx.start = function(md, key) {
          if (md !== null) {
            if (typeof md === "string") {
              md = md.toLowerCase();
              if (md in forge.md.algorithms) {
                _md = forge.md.algorithms[md].create();
              } else {
                throw new Error('Unknown hash algorithm "' + md + '"');
              }
            } else {
              _md = md;
            }
          }
          if (key === null) {
            key = _key;
          } else {
            if (typeof key === "string") {
              key = forge.util.createBuffer(key);
            } else if (forge.util.isArray(key)) {
              var tmp = key;
              key = forge.util.createBuffer();
              for (var i = 0; i < tmp.length; ++i) {
                key.putByte(tmp[i]);
              }
            }
            var keylen = key.length();
            if (keylen > _md.blockLength) {
              _md.start();
              _md.update(key.bytes());
              key = _md.digest();
            }
            _ipadding = forge.util.createBuffer();
            _opadding = forge.util.createBuffer();
            keylen = key.length();
            for (var i = 0; i < keylen; ++i) {
              var tmp = key.at(i);
              _ipadding.putByte(54 ^ tmp);
              _opadding.putByte(92 ^ tmp);
            }
            if (keylen < _md.blockLength) {
              var tmp = _md.blockLength - keylen;
              for (var i = 0; i < tmp; ++i) {
                _ipadding.putByte(54);
                _opadding.putByte(92);
              }
            }
            _key = key;
            _ipadding = _ipadding.bytes();
            _opadding = _opadding.bytes();
          }
          _md.start();
          _md.update(_ipadding);
        };
        ctx.update = function(bytes) {
          _md.update(bytes);
        };
        ctx.getMac = function() {
          var inner = _md.digest().bytes();
          _md.start();
          _md.update(_opadding);
          _md.update(inner);
          return _md.digest();
        };
        ctx.digest = ctx.getMac;
        return ctx;
      };
    }
  });

  // node_modules/node-forge/lib/md5.js
  var require_md52 = __commonJS({
    "node_modules/node-forge/lib/md5.js"(exports, module) {
      var forge = require_forge();
      require_md();
      require_util();
      var md5 = module.exports = forge.md5 = forge.md5 || {};
      forge.md.md5 = forge.md.algorithms.md5 = md5;
      md5.create = function() {
        if (!_initialized) {
          _init();
        }
        var _state = null;
        var _input = forge.util.createBuffer();
        var _w = new Array(16);
        var md = {
          algorithm: "md5",
          blockLength: 64,
          digestLength: 16,
          // 56-bit length of message so far (does not including padding)
          messageLength: 0,
          // true message length
          fullMessageLength: null,
          // size of message length in bytes
          messageLengthSize: 8
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength64 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge.util.createBuffer();
          _state = {
            h0: 1732584193,
            h1: 4023233417,
            h2: 2562383102,
            h3: 271733878
          };
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_state, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var bits, carry = 0;
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            bits = md.fullMessageLength[i] * 8 + carry;
            carry = bits / 4294967296 >>> 0;
            finalBlock.putInt32Le(bits >>> 0);
          }
          var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3
          };
          _update(s2, _w, finalBlock);
          var rval = forge.util.createBuffer();
          rval.putInt32Le(s2.h0);
          rval.putInt32Le(s2.h1);
          rval.putInt32Le(s2.h2);
          rval.putInt32Le(s2.h3);
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _g = null;
      var _r = null;
      var _k = null;
      var _initialized = false;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge.util.fillString(String.fromCharCode(0), 64);
        _g = [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          1,
          6,
          11,
          0,
          5,
          10,
          15,
          4,
          9,
          14,
          3,
          8,
          13,
          2,
          7,
          12,
          5,
          8,
          11,
          14,
          1,
          4,
          7,
          10,
          13,
          0,
          3,
          6,
          9,
          12,
          15,
          2,
          0,
          7,
          14,
          5,
          12,
          3,
          10,
          1,
          8,
          15,
          6,
          13,
          4,
          11,
          2,
          9
        ];
        _r = [
          7,
          12,
          17,
          22,
          7,
          12,
          17,
          22,
          7,
          12,
          17,
          22,
          7,
          12,
          17,
          22,
          5,
          9,
          14,
          20,
          5,
          9,
          14,
          20,
          5,
          9,
          14,
          20,
          5,
          9,
          14,
          20,
          4,
          11,
          16,
          23,
          4,
          11,
          16,
          23,
          4,
          11,
          16,
          23,
          4,
          11,
          16,
          23,
          6,
          10,
          15,
          21,
          6,
          10,
          15,
          21,
          6,
          10,
          15,
          21,
          6,
          10,
          15,
          21
        ];
        _k = new Array(64);
        for (var i = 0; i < 64; ++i) {
          _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
        }
        _initialized = true;
      }
      function _update(s, w, bytes) {
        var t, a, b, c, d, f, r, i;
        var len = bytes.length();
        while (len >= 64) {
          a = s.h0;
          b = s.h1;
          c = s.h2;
          d = s.h3;
          for (i = 0; i < 16; ++i) {
            w[i] = bytes.getInt32Le();
            f = d ^ b & (c ^ d);
            t = a + f + _k[i] + w[i];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
          }
          for (; i < 32; ++i) {
            f = c ^ d & (b ^ c);
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
          }
          for (; i < 48; ++i) {
            f = b ^ c ^ d;
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
          }
          for (; i < 64; ++i) {
            f = c ^ (b | ~d);
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
          }
          s.h0 = s.h0 + a | 0;
          s.h1 = s.h1 + b | 0;
          s.h2 = s.h2 + c | 0;
          s.h3 = s.h3 + d | 0;
          len -= 64;
        }
      }
    }
  });

  // node_modules/node-forge/lib/pem.js
  var require_pem = __commonJS({
    "node_modules/node-forge/lib/pem.js"(exports, module) {
      var forge = require_forge();
      require_util();
      var pem = module.exports = forge.pem = forge.pem || {};
      pem.encode = function(msg, options) {
        options = options || {};
        var rval = "-----BEGIN " + msg.type + "-----\r\n";
        var header;
        if (msg.procType) {
          header = {
            name: "Proc-Type",
            values: [String(msg.procType.version), msg.procType.type]
          };
          rval += foldHeader(header);
        }
        if (msg.contentDomain) {
          header = { name: "Content-Domain", values: [msg.contentDomain] };
          rval += foldHeader(header);
        }
        if (msg.dekInfo) {
          header = { name: "DEK-Info", values: [msg.dekInfo.algorithm] };
          if (msg.dekInfo.parameters) {
            header.values.push(msg.dekInfo.parameters);
          }
          rval += foldHeader(header);
        }
        if (msg.headers) {
          for (var i = 0; i < msg.headers.length; ++i) {
            rval += foldHeader(msg.headers[i]);
          }
        }
        if (msg.procType) {
          rval += "\r\n";
        }
        rval += forge.util.encode64(msg.body, options.maxline || 64) + "\r\n";
        rval += "-----END " + msg.type + "-----\r\n";
        return rval;
      };
      pem.decode = function(str) {
        var rval = [];
        var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
        var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
        var rCRLF = /\r?\n/;
        var match;
        while (true) {
          match = rMessage.exec(str);
          if (!match) {
            break;
          }
          var type = match[1];
          if (type === "NEW CERTIFICATE REQUEST") {
            type = "CERTIFICATE REQUEST";
          }
          var msg = {
            type,
            procType: null,
            contentDomain: null,
            dekInfo: null,
            headers: [],
            body: forge.util.decode64(match[3])
          };
          rval.push(msg);
          if (!match[2]) {
            continue;
          }
          var lines = match[2].split(rCRLF);
          var li = 0;
          while (match && li < lines.length) {
            var line = lines[li].replace(/\s+$/, "");
            for (var nl = li + 1; nl < lines.length; ++nl) {
              var next = lines[nl];
              if (!/\s/.test(next[0])) {
                break;
              }
              line += next;
              li = nl;
            }
            match = line.match(rHeader);
            if (match) {
              var header = { name: match[1], values: [] };
              var values = match[2].split(",");
              for (var vi = 0; vi < values.length; ++vi) {
                header.values.push(ltrim(values[vi]));
              }
              if (!msg.procType) {
                if (header.name !== "Proc-Type") {
                  throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
                } else if (header.values.length !== 2) {
                  throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
                }
                msg.procType = { version: values[0], type: values[1] };
              } else if (!msg.contentDomain && header.name === "Content-Domain") {
                msg.contentDomain = values[0] || "";
              } else if (!msg.dekInfo && header.name === "DEK-Info") {
                if (header.values.length === 0) {
                  throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
                }
                msg.dekInfo = { algorithm: values[0], parameters: values[1] || null };
              } else {
                msg.headers.push(header);
              }
            }
            ++li;
          }
          if (msg.procType === "ENCRYPTED" && !msg.dekInfo) {
            throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
          }
        }
        if (rval.length === 0) {
          throw new Error("Invalid PEM formatted message.");
        }
        return rval;
      };
      function foldHeader(header) {
        var rval = header.name + ": ";
        var values = [];
        var insertSpace = function(match, $1) {
          return " " + $1;
        };
        for (var i = 0; i < header.values.length; ++i) {
          values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
        }
        rval += values.join(",") + "\r\n";
        var length = 0;
        var candidate = -1;
        for (var i = 0; i < rval.length; ++i, ++length) {
          if (length > 65 && candidate !== -1) {
            var insert = rval[candidate];
            if (insert === ",") {
              ++candidate;
              rval = rval.substr(0, candidate) + "\r\n " + rval.substr(candidate);
            } else {
              rval = rval.substr(0, candidate) + "\r\n" + insert + rval.substr(candidate + 1);
            }
            length = i - candidate - 1;
            candidate = -1;
            ++i;
          } else if (rval[i] === " " || rval[i] === "	" || rval[i] === ",") {
            candidate = i;
          }
        }
        return rval;
      }
      function ltrim(str) {
        return str.replace(/^\s+/, "");
      }
    }
  });

  // node_modules/node-forge/lib/des.js
  var require_des = __commonJS({
    "node_modules/node-forge/lib/des.js"(exports, module) {
      var forge = require_forge();
      require_cipher();
      require_cipherModes();
      require_util();
      module.exports = forge.des = forge.des || {};
      forge.des.startEncrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: false,
          mode: mode || (iv === null ? "ECB" : "CBC")
        });
        cipher.start(iv);
        return cipher;
      };
      forge.des.createEncryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: false,
          mode
        });
      };
      forge.des.startDecrypting = function(key, iv, output, mode) {
        var cipher = _createCipher({
          key,
          output,
          decrypt: true,
          mode: mode || (iv === null ? "ECB" : "CBC")
        });
        cipher.start(iv);
        return cipher;
      };
      forge.des.createDecryptionCipher = function(key, mode) {
        return _createCipher({
          key,
          output: null,
          decrypt: true,
          mode
        });
      };
      forge.des.Algorithm = function(name, mode) {
        var self2 = this;
        self2.name = name;
        self2.mode = new mode({
          blockSize: 8,
          cipher: {
            encrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._keys, inBlock, outBlock, false);
            },
            decrypt: function(inBlock, outBlock) {
              return _updateBlock(self2._keys, inBlock, outBlock, true);
            }
          }
        });
        self2._init = false;
      };
      forge.des.Algorithm.prototype.initialize = function(options) {
        if (this._init) {
          return;
        }
        var key = forge.util.createBuffer(options.key);
        if (this.name.indexOf("3DES") === 0) {
          if (key.length() !== 24) {
            throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
          }
        }
        this._keys = _createKeys(key);
        this._init = true;
      };
      registerAlgorithm("DES-ECB", forge.cipher.modes.ecb);
      registerAlgorithm("DES-CBC", forge.cipher.modes.cbc);
      registerAlgorithm("DES-CFB", forge.cipher.modes.cfb);
      registerAlgorithm("DES-OFB", forge.cipher.modes.ofb);
      registerAlgorithm("DES-CTR", forge.cipher.modes.ctr);
      registerAlgorithm("3DES-ECB", forge.cipher.modes.ecb);
      registerAlgorithm("3DES-CBC", forge.cipher.modes.cbc);
      registerAlgorithm("3DES-CFB", forge.cipher.modes.cfb);
      registerAlgorithm("3DES-OFB", forge.cipher.modes.ofb);
      registerAlgorithm("3DES-CTR", forge.cipher.modes.ctr);
      function registerAlgorithm(name, mode) {
        var factory = function() {
          return new forge.des.Algorithm(name, mode);
        };
        forge.cipher.registerAlgorithm(name, factory);
      }
      var spfunction1 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756];
      var spfunction2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344];
      var spfunction3 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584];
      var spfunction4 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928];
      var spfunction5 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080];
      var spfunction6 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312];
      var spfunction7 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154];
      var spfunction8 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
      function _createKeys(key) {
        var pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
        var iterations = key.length() > 8 ? 3 : 1;
        var keys = [];
        var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
        var n = 0, tmp;
        for (var j = 0; j < iterations; j++) {
          var left = key.getInt32();
          var right = key.getInt32();
          tmp = (left >>> 4 ^ right) & 252645135;
          right ^= tmp;
          left ^= tmp << 4;
          tmp = (right >>> -16 ^ left) & 65535;
          left ^= tmp;
          right ^= tmp << -16;
          tmp = (left >>> 2 ^ right) & 858993459;
          right ^= tmp;
          left ^= tmp << 2;
          tmp = (right >>> -16 ^ left) & 65535;
          left ^= tmp;
          right ^= tmp << -16;
          tmp = (left >>> 1 ^ right) & 1431655765;
          right ^= tmp;
          left ^= tmp << 1;
          tmp = (right >>> 8 ^ left) & 16711935;
          left ^= tmp;
          right ^= tmp << 8;
          tmp = (left >>> 1 ^ right) & 1431655765;
          right ^= tmp;
          left ^= tmp << 1;
          tmp = left << 8 | right >>> 20 & 240;
          left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
          right = tmp;
          for (var i = 0; i < shifts.length; ++i) {
            if (shifts[i]) {
              left = left << 2 | left >>> 26;
              right = right << 2 | right >>> 26;
            } else {
              left = left << 1 | left >>> 27;
              right = right << 1 | right >>> 27;
            }
            left &= -15;
            right &= -15;
            var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
            var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
            tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
            keys[n++] = lefttmp ^ tmp;
            keys[n++] = righttmp ^ tmp << 16;
          }
        }
        return keys;
      }
      function _updateBlock(keys, input, output, decrypt) {
        var iterations = keys.length === 32 ? 3 : 9;
        var looping;
        if (iterations === 3) {
          looping = decrypt ? [30, -2, -2] : [0, 32, 2];
        } else {
          looping = decrypt ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
        }
        var tmp;
        var left = input[0];
        var right = input[1];
        tmp = (left >>> 4 ^ right) & 252645135;
        right ^= tmp;
        left ^= tmp << 4;
        tmp = (left >>> 16 ^ right) & 65535;
        right ^= tmp;
        left ^= tmp << 16;
        tmp = (right >>> 2 ^ left) & 858993459;
        left ^= tmp;
        right ^= tmp << 2;
        tmp = (right >>> 8 ^ left) & 16711935;
        left ^= tmp;
        right ^= tmp << 8;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        left = left << 1 | left >>> 31;
        right = right << 1 | right >>> 31;
        for (var j = 0; j < iterations; j += 3) {
          var endloop = looping[j + 1];
          var loopinc = looping[j + 2];
          for (var i = looping[j]; i != endloop; i += loopinc) {
            var right1 = right ^ keys[i];
            var right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
            tmp = left;
            left = right;
            right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
          }
          tmp = left;
          left = right;
          right = tmp;
        }
        left = left >>> 1 | left << 31;
        right = right >>> 1 | right << 31;
        tmp = (left >>> 1 ^ right) & 1431655765;
        right ^= tmp;
        left ^= tmp << 1;
        tmp = (right >>> 8 ^ left) & 16711935;
        left ^= tmp;
        right ^= tmp << 8;
        tmp = (right >>> 2 ^ left) & 858993459;
        left ^= tmp;
        right ^= tmp << 2;
        tmp = (left >>> 16 ^ right) & 65535;
        right ^= tmp;
        left ^= tmp << 16;
        tmp = (left >>> 4 ^ right) & 252645135;
        right ^= tmp;
        left ^= tmp << 4;
        output[0] = left;
        output[1] = right;
      }
      function _createCipher(options) {
        options = options || {};
        var mode = (options.mode || "CBC").toUpperCase();
        var algorithm = "DES-" + mode;
        var cipher;
        if (options.decrypt) {
          cipher = forge.cipher.createDecipher(algorithm, options.key);
        } else {
          cipher = forge.cipher.createCipher(algorithm, options.key);
        }
        var start = cipher.start;
        cipher.start = function(iv, options2) {
          var output = null;
          if (options2 instanceof forge.util.ByteBuffer) {
            output = options2;
            options2 = {};
          }
          options2 = options2 || {};
          options2.output = output;
          options2.iv = iv;
          start.call(cipher, options2);
        };
        return cipher;
      }
    }
  });

  // node_modules/node-forge/lib/pbkdf2.js
  var require_pbkdf22 = __commonJS({
    "node_modules/node-forge/lib/pbkdf2.js"(exports, module) {
      var forge = require_forge();
      require_hmac2();
      require_md();
      require_util();
      var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};
      var crypto;
      if (forge.util.isNodejs && !forge.options.usePureJavaScript) {
        crypto = require_crypto();
      }
      module.exports = forge.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
        if (typeof md === "function") {
          callback = md;
          md = null;
        }
        if (forge.util.isNodejs && !forge.options.usePureJavaScript && crypto.pbkdf2 && (md === null || typeof md !== "object") && (crypto.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
          if (typeof md !== "string") {
            md = "sha1";
          }
          p = Buffer.from(p, "binary");
          s = Buffer.from(s, "binary");
          if (!callback) {
            if (crypto.pbkdf2Sync.length === 4) {
              return crypto.pbkdf2Sync(p, s, c, dkLen).toString("binary");
            }
            return crypto.pbkdf2Sync(p, s, c, dkLen, md).toString("binary");
          }
          if (crypto.pbkdf2Sync.length === 4) {
            return crypto.pbkdf2(p, s, c, dkLen, function(err2, key) {
              if (err2) {
                return callback(err2);
              }
              callback(null, key.toString("binary"));
            });
          }
          return crypto.pbkdf2(p, s, c, dkLen, md, function(err2, key) {
            if (err2) {
              return callback(err2);
            }
            callback(null, key.toString("binary"));
          });
        }
        if (typeof md === "undefined" || md === null) {
          md = "sha1";
        }
        if (typeof md === "string") {
          if (!(md in forge.md.algorithms)) {
            throw new Error("Unknown hash algorithm: " + md);
          }
          md = forge.md[md].create();
        }
        var hLen = md.digestLength;
        if (dkLen > 4294967295 * hLen) {
          var err = new Error("Derived key is too long.");
          if (callback) {
            return callback(err);
          }
          throw err;
        }
        var len = Math.ceil(dkLen / hLen);
        var r = dkLen - (len - 1) * hLen;
        var prf = forge.hmac.create();
        prf.start(md, p);
        var dk = "";
        var xor, u_c, u_c1;
        if (!callback) {
          for (var i = 1; i <= len; ++i) {
            prf.start(null, null);
            prf.update(s);
            prf.update(forge.util.int32ToBytes(i));
            xor = u_c1 = prf.digest().getBytes();
            for (var j = 2; j <= c; ++j) {
              prf.start(null, null);
              prf.update(u_c1);
              u_c = prf.digest().getBytes();
              xor = forge.util.xorBytes(xor, u_c, hLen);
              u_c1 = u_c;
            }
            dk += i < len ? xor : xor.substr(0, r);
          }
          return dk;
        }
        var i = 1, j;
        function outer() {
          if (i > len) {
            return callback(null, dk);
          }
          prf.start(null, null);
          prf.update(s);
          prf.update(forge.util.int32ToBytes(i));
          xor = u_c1 = prf.digest().getBytes();
          j = 2;
          inner();
        }
        function inner() {
          if (j <= c) {
            prf.start(null, null);
            prf.update(u_c1);
            u_c = prf.digest().getBytes();
            xor = forge.util.xorBytes(xor, u_c, hLen);
            u_c1 = u_c;
            ++j;
            return forge.util.setImmediate(inner);
          }
          dk += i < len ? xor : xor.substr(0, r);
          ++i;
          outer();
        }
        outer();
      };
    }
  });

  // node_modules/node-forge/lib/sha256.js
  var require_sha2562 = __commonJS({
    "node_modules/node-forge/lib/sha256.js"(exports, module) {
      var forge = require_forge();
      require_md();
      require_util();
      var sha256 = module.exports = forge.sha256 = forge.sha256 || {};
      forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
      sha256.create = function() {
        if (!_initialized) {
          _init();
        }
        var _state = null;
        var _input = forge.util.createBuffer();
        var _w = new Array(64);
        var md = {
          algorithm: "sha256",
          blockLength: 64,
          digestLength: 32,
          // 56-bit length of message so far (does not including padding)
          messageLength: 0,
          // true message length
          fullMessageLength: null,
          // size of message length in bytes
          messageLengthSize: 8
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength64 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge.util.createBuffer();
          _state = {
            h0: 1779033703,
            h1: 3144134277,
            h2: 1013904242,
            h3: 2773480762,
            h4: 1359893119,
            h5: 2600822924,
            h6: 528734635,
            h7: 1541459225
          };
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_state, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits += carry;
            finalBlock.putInt32(bits >>> 0);
            bits = next >>> 0;
          }
          finalBlock.putInt32(bits);
          var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4,
            h5: _state.h5,
            h6: _state.h6,
            h7: _state.h7
          };
          _update(s2, _w, finalBlock);
          var rval = forge.util.createBuffer();
          rval.putInt32(s2.h0);
          rval.putInt32(s2.h1);
          rval.putInt32(s2.h2);
          rval.putInt32(s2.h3);
          rval.putInt32(s2.h4);
          rval.putInt32(s2.h5);
          rval.putInt32(s2.h6);
          rval.putInt32(s2.h7);
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      var _k = null;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge.util.fillString(String.fromCharCode(0), 64);
        _k = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ];
        _initialized = true;
      }
      function _update(s, w, bytes) {
        var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
        var len = bytes.length();
        while (len >= 64) {
          for (i = 0; i < 16; ++i) {
            w[i] = bytes.getInt32();
          }
          for (; i < 64; ++i) {
            t1 = w[i - 2];
            t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            t2 = w[i - 15];
            t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
            w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
          }
          a = s.h0;
          b = s.h1;
          c = s.h2;
          d = s.h3;
          e = s.h4;
          f = s.h5;
          g = s.h6;
          h = s.h7;
          for (i = 0; i < 64; ++i) {
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ch = g ^ e & (f ^ g);
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            maj = a & b | c & (a ^ b);
            t1 = h + s1 + ch + _k[i] + w[i];
            t2 = s0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 >>> 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 >>> 0;
          }
          s.h0 = s.h0 + a | 0;
          s.h1 = s.h1 + b | 0;
          s.h2 = s.h2 + c | 0;
          s.h3 = s.h3 + d | 0;
          s.h4 = s.h4 + e | 0;
          s.h5 = s.h5 + f | 0;
          s.h6 = s.h6 + g | 0;
          s.h7 = s.h7 + h | 0;
          len -= 64;
        }
      }
    }
  });

  // node_modules/node-forge/lib/prng.js
  var require_prng = __commonJS({
    "node_modules/node-forge/lib/prng.js"(exports, module) {
      var forge = require_forge();
      require_util();
      var _crypto = null;
      if (forge.util.isNodejs && !forge.options.usePureJavaScript && !process.versions["node-webkit"]) {
        _crypto = require_crypto();
      }
      var prng = module.exports = forge.prng = forge.prng || {};
      prng.create = function(plugin) {
        var ctx = {
          plugin,
          key: null,
          seed: null,
          time: null,
          // number of reseeds so far
          reseeds: 0,
          // amount of data generated so far
          generated: 0,
          // no initial key bytes
          keyBytes: ""
        };
        var md = plugin.md;
        var pools = new Array(32);
        for (var i = 0; i < 32; ++i) {
          pools[i] = md.create();
        }
        ctx.pools = pools;
        ctx.pool = 0;
        ctx.generate = function(count, callback) {
          if (!callback) {
            return ctx.generateSync(count);
          }
          var cipher = ctx.plugin.cipher;
          var increment = ctx.plugin.increment;
          var formatKey = ctx.plugin.formatKey;
          var formatSeed = ctx.plugin.formatSeed;
          var b = forge.util.createBuffer();
          ctx.key = null;
          generate();
          function generate(err) {
            if (err) {
              return callback(err);
            }
            if (b.length() >= count) {
              return callback(null, b.getBytes(count));
            }
            if (ctx.generated > 1048575) {
              ctx.key = null;
            }
            if (ctx.key === null) {
              return forge.util.nextTick(function() {
                _reseed(generate);
              });
            }
            var bytes = cipher(ctx.key, ctx.seed);
            ctx.generated += bytes.length;
            b.putBytes(bytes);
            ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
            ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
            forge.util.setImmediate(generate);
          }
        };
        ctx.generateSync = function(count) {
          var cipher = ctx.plugin.cipher;
          var increment = ctx.plugin.increment;
          var formatKey = ctx.plugin.formatKey;
          var formatSeed = ctx.plugin.formatSeed;
          ctx.key = null;
          var b = forge.util.createBuffer();
          while (b.length() < count) {
            if (ctx.generated > 1048575) {
              ctx.key = null;
            }
            if (ctx.key === null) {
              _reseedSync();
            }
            var bytes = cipher(ctx.key, ctx.seed);
            ctx.generated += bytes.length;
            b.putBytes(bytes);
            ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
            ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
          }
          return b.getBytes(count);
        };
        function _reseed(callback) {
          if (ctx.pools[0].messageLength >= 32) {
            _seed();
            return callback();
          }
          var needed = 32 - ctx.pools[0].messageLength << 5;
          ctx.seedFile(needed, function(err, bytes) {
            if (err) {
              return callback(err);
            }
            ctx.collect(bytes);
            _seed();
            callback();
          });
        }
        function _reseedSync() {
          if (ctx.pools[0].messageLength >= 32) {
            return _seed();
          }
          var needed = 32 - ctx.pools[0].messageLength << 5;
          ctx.collect(ctx.seedFileSync(needed));
          _seed();
        }
        function _seed() {
          ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
          var md2 = ctx.plugin.md.create();
          md2.update(ctx.keyBytes);
          var _2powK = 1;
          for (var k = 0; k < 32; ++k) {
            if (ctx.reseeds % _2powK === 0) {
              md2.update(ctx.pools[k].digest().getBytes());
              ctx.pools[k].start();
            }
            _2powK = _2powK << 1;
          }
          ctx.keyBytes = md2.digest().getBytes();
          md2.start();
          md2.update(ctx.keyBytes);
          var seedBytes = md2.digest().getBytes();
          ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
          ctx.seed = ctx.plugin.formatSeed(seedBytes);
          ctx.generated = 0;
        }
        function defaultSeedFile(needed) {
          var getRandomValues = null;
          var globalScope = forge.util.globalScope;
          var _crypto2 = globalScope.crypto || globalScope.msCrypto;
          if (_crypto2 && _crypto2.getRandomValues) {
            getRandomValues = function(arr) {
              return _crypto2.getRandomValues(arr);
            };
          }
          var b = forge.util.createBuffer();
          if (getRandomValues) {
            while (b.length() < needed) {
              var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
              var entropy = new Uint32Array(Math.floor(count));
              try {
                getRandomValues(entropy);
                for (var i2 = 0; i2 < entropy.length; ++i2) {
                  b.putInt32(entropy[i2]);
                }
              } catch (e) {
                if (!(typeof QuotaExceededError !== "undefined" && e instanceof QuotaExceededError)) {
                  throw e;
                }
              }
            }
          }
          if (b.length() < needed) {
            var hi, lo, next;
            var seed = Math.floor(Math.random() * 65536);
            while (b.length() < needed) {
              lo = 16807 * (seed & 65535);
              hi = 16807 * (seed >> 16);
              lo += (hi & 32767) << 16;
              lo += hi >> 15;
              lo = (lo & 2147483647) + (lo >> 31);
              seed = lo & 4294967295;
              for (var i2 = 0; i2 < 3; ++i2) {
                next = seed >>> (i2 << 3);
                next ^= Math.floor(Math.random() * 256);
                b.putByte(next & 255);
              }
            }
          }
          return b.getBytes(needed);
        }
        if (_crypto) {
          ctx.seedFile = function(needed, callback) {
            _crypto.randomBytes(needed, function(err, bytes) {
              if (err) {
                return callback(err);
              }
              callback(null, bytes.toString());
            });
          };
          ctx.seedFileSync = function(needed) {
            return _crypto.randomBytes(needed).toString();
          };
        } else {
          ctx.seedFile = function(needed, callback) {
            try {
              callback(null, defaultSeedFile(needed));
            } catch (e) {
              callback(e);
            }
          };
          ctx.seedFileSync = defaultSeedFile;
        }
        ctx.collect = function(bytes) {
          var count = bytes.length;
          for (var i2 = 0; i2 < count; ++i2) {
            ctx.pools[ctx.pool].update(bytes.substr(i2, 1));
            ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
          }
        };
        ctx.collectInt = function(i2, n) {
          var bytes = "";
          for (var x = 0; x < n; x += 8) {
            bytes += String.fromCharCode(i2 >> x & 255);
          }
          ctx.collect(bytes);
        };
        ctx.registerWorker = function(worker) {
          if (worker === self) {
            ctx.seedFile = function(needed, callback) {
              function listener2(e) {
                var data = e.data;
                if (data.forge && data.forge.prng) {
                  self.removeEventListener("message", listener2);
                  callback(data.forge.prng.err, data.forge.prng.bytes);
                }
              }
              self.addEventListener("message", listener2);
              self.postMessage({ forge: { prng: { needed } } });
            };
          } else {
            var listener = function(e) {
              var data = e.data;
              if (data.forge && data.forge.prng) {
                ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
                  worker.postMessage({ forge: { prng: { err, bytes } } });
                });
              }
            };
            worker.addEventListener("message", listener);
          }
        };
        return ctx;
      };
    }
  });

  // node_modules/node-forge/lib/random.js
  var require_random = __commonJS({
    "node_modules/node-forge/lib/random.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_sha2562();
      require_prng();
      require_util();
      (function() {
        if (forge.random && forge.random.getBytes) {
          module.exports = forge.random;
          return;
        }
        (function(jQuery2) {
          var prng_aes = {};
          var _prng_aes_output = new Array(4);
          var _prng_aes_buffer = forge.util.createBuffer();
          prng_aes.formatKey = function(key2) {
            var tmp = forge.util.createBuffer(key2);
            key2 = new Array(4);
            key2[0] = tmp.getInt32();
            key2[1] = tmp.getInt32();
            key2[2] = tmp.getInt32();
            key2[3] = tmp.getInt32();
            return forge.aes._expandKey(key2, false);
          };
          prng_aes.formatSeed = function(seed) {
            var tmp = forge.util.createBuffer(seed);
            seed = new Array(4);
            seed[0] = tmp.getInt32();
            seed[1] = tmp.getInt32();
            seed[2] = tmp.getInt32();
            seed[3] = tmp.getInt32();
            return seed;
          };
          prng_aes.cipher = function(key2, seed) {
            forge.aes._updateBlock(key2, seed, _prng_aes_output, false);
            _prng_aes_buffer.putInt32(_prng_aes_output[0]);
            _prng_aes_buffer.putInt32(_prng_aes_output[1]);
            _prng_aes_buffer.putInt32(_prng_aes_output[2]);
            _prng_aes_buffer.putInt32(_prng_aes_output[3]);
            return _prng_aes_buffer.getBytes();
          };
          prng_aes.increment = function(seed) {
            ++seed[3];
            return seed;
          };
          prng_aes.md = forge.md.sha256;
          function spawnPrng() {
            var ctx = forge.prng.create(prng_aes);
            ctx.getBytes = function(count, callback) {
              return ctx.generate(count, callback);
            };
            ctx.getBytesSync = function(count) {
              return ctx.generate(count);
            };
            return ctx;
          }
          var _ctx = spawnPrng();
          var getRandomValues = null;
          var globalScope = forge.util.globalScope;
          var _crypto = globalScope.crypto || globalScope.msCrypto;
          if (_crypto && _crypto.getRandomValues) {
            getRandomValues = function(arr) {
              return _crypto.getRandomValues(arr);
            };
          }
          if (forge.options.usePureJavaScript || !forge.util.isNodejs && !getRandomValues) {
            if (typeof window === "undefined" || window.document === void 0) {
            }
            _ctx.collectInt(+/* @__PURE__ */ new Date(), 32);
            if (typeof navigator !== "undefined") {
              var _navBytes = "";
              for (var key in navigator) {
                try {
                  if (typeof navigator[key] == "string") {
                    _navBytes += navigator[key];
                  }
                } catch (e) {
                }
              }
              _ctx.collect(_navBytes);
              _navBytes = null;
            }
            if (jQuery2) {
              jQuery2().mousemove(function(e) {
                _ctx.collectInt(e.clientX, 16);
                _ctx.collectInt(e.clientY, 16);
              });
              jQuery2().keypress(function(e) {
                _ctx.collectInt(e.charCode, 8);
              });
            }
          }
          if (!forge.random) {
            forge.random = _ctx;
          } else {
            for (var key in _ctx) {
              forge.random[key] = _ctx[key];
            }
          }
          forge.random.createInstance = spawnPrng;
          module.exports = forge.random;
        })(typeof jQuery !== "undefined" ? jQuery : null);
      })();
    }
  });

  // node_modules/node-forge/lib/rc2.js
  var require_rc2 = __commonJS({
    "node_modules/node-forge/lib/rc2.js"(exports, module) {
      var forge = require_forge();
      require_util();
      var piTable = [
        217,
        120,
        249,
        196,
        25,
        221,
        181,
        237,
        40,
        233,
        253,
        121,
        74,
        160,
        216,
        157,
        198,
        126,
        55,
        131,
        43,
        118,
        83,
        142,
        98,
        76,
        100,
        136,
        68,
        139,
        251,
        162,
        23,
        154,
        89,
        245,
        135,
        179,
        79,
        19,
        97,
        69,
        109,
        141,
        9,
        129,
        125,
        50,
        189,
        143,
        64,
        235,
        134,
        183,
        123,
        11,
        240,
        149,
        33,
        34,
        92,
        107,
        78,
        130,
        84,
        214,
        101,
        147,
        206,
        96,
        178,
        28,
        115,
        86,
        192,
        20,
        167,
        140,
        241,
        220,
        18,
        117,
        202,
        31,
        59,
        190,
        228,
        209,
        66,
        61,
        212,
        48,
        163,
        60,
        182,
        38,
        111,
        191,
        14,
        218,
        70,
        105,
        7,
        87,
        39,
        242,
        29,
        155,
        188,
        148,
        67,
        3,
        248,
        17,
        199,
        246,
        144,
        239,
        62,
        231,
        6,
        195,
        213,
        47,
        200,
        102,
        30,
        215,
        8,
        232,
        234,
        222,
        128,
        82,
        238,
        247,
        132,
        170,
        114,
        172,
        53,
        77,
        106,
        42,
        150,
        26,
        210,
        113,
        90,
        21,
        73,
        116,
        75,
        159,
        208,
        94,
        4,
        24,
        164,
        236,
        194,
        224,
        65,
        110,
        15,
        81,
        203,
        204,
        36,
        145,
        175,
        80,
        161,
        244,
        112,
        57,
        153,
        124,
        58,
        133,
        35,
        184,
        180,
        122,
        252,
        2,
        54,
        91,
        37,
        85,
        151,
        49,
        45,
        93,
        250,
        152,
        227,
        138,
        146,
        174,
        5,
        223,
        41,
        16,
        103,
        108,
        186,
        201,
        211,
        0,
        230,
        207,
        225,
        158,
        168,
        44,
        99,
        22,
        1,
        63,
        88,
        226,
        137,
        169,
        13,
        56,
        52,
        27,
        171,
        51,
        255,
        176,
        187,
        72,
        12,
        95,
        185,
        177,
        205,
        46,
        197,
        243,
        219,
        71,
        229,
        165,
        156,
        119,
        10,
        166,
        32,
        104,
        254,
        127,
        193,
        173
      ];
      var s = [1, 2, 3, 5];
      var rol = function(word, bits) {
        return word << bits & 65535 | (word & 65535) >> 16 - bits;
      };
      var ror = function(word, bits) {
        return (word & 65535) >> bits | word << 16 - bits & 65535;
      };
      module.exports = forge.rc2 = forge.rc2 || {};
      forge.rc2.expandKey = function(key, effKeyBits) {
        if (typeof key === "string") {
          key = forge.util.createBuffer(key);
        }
        effKeyBits = effKeyBits || 128;
        var L = key;
        var T = key.length();
        var T1 = effKeyBits;
        var T8 = Math.ceil(T1 / 8);
        var TM = 255 >> (T1 & 7);
        var i;
        for (i = T; i < 128; i++) {
          L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
        }
        L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
        for (i = 127 - T8; i >= 0; i--) {
          L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
        }
        return L;
      };
      var createCipher = function(key, bits, encrypt) {
        var _finish = false, _input = null, _output = null, _iv = null;
        var mixRound, mashRound;
        var i, j, K = [];
        key = forge.rc2.expandKey(key, bits);
        for (i = 0; i < 64; i++) {
          K.push(key.getInt16Le());
        }
        if (encrypt) {
          mixRound = function(R) {
            for (i = 0; i < 4; i++) {
              R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
              R[i] = rol(R[i], s[i]);
              j++;
            }
          };
          mashRound = function(R) {
            for (i = 0; i < 4; i++) {
              R[i] += K[R[(i + 3) % 4] & 63];
            }
          };
        } else {
          mixRound = function(R) {
            for (i = 3; i >= 0; i--) {
              R[i] = ror(R[i], s[i]);
              R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
              j--;
            }
          };
          mashRound = function(R) {
            for (i = 3; i >= 0; i--) {
              R[i] -= K[R[(i + 3) % 4] & 63];
            }
          };
        }
        var runPlan = function(plan) {
          var R = [];
          for (i = 0; i < 4; i++) {
            var val = _input.getInt16Le();
            if (_iv !== null) {
              if (encrypt) {
                val ^= _iv.getInt16Le();
              } else {
                _iv.putInt16Le(val);
              }
            }
            R.push(val & 65535);
          }
          j = encrypt ? 0 : 63;
          for (var ptr = 0; ptr < plan.length; ptr++) {
            for (var ctr = 0; ctr < plan[ptr][0]; ctr++) {
              plan[ptr][1](R);
            }
          }
          for (i = 0; i < 4; i++) {
            if (_iv !== null) {
              if (encrypt) {
                _iv.putInt16Le(R[i]);
              } else {
                R[i] ^= _iv.getInt16Le();
              }
            }
            _output.putInt16Le(R[i]);
          }
        };
        var cipher = null;
        cipher = {
          /**
           * Starts or restarts the encryption or decryption process, whichever
           * was previously configured.
           *
           * To use the cipher in CBC mode, iv may be given either as a string
           * of bytes, or as a byte buffer.  For ECB mode, give null as iv.
           *
           * @param iv the initialization vector to use, null for ECB mode.
           * @param output the output the buffer to write to, null to create one.
           */
          start: function(iv, output) {
            if (iv) {
              if (typeof iv === "string") {
                iv = forge.util.createBuffer(iv);
              }
            }
            _finish = false;
            _input = forge.util.createBuffer();
            _output = output || new forge.util.createBuffer();
            _iv = iv;
            cipher.output = _output;
          },
          /**
           * Updates the next block.
           *
           * @param input the buffer to read from.
           */
          update: function(input) {
            if (!_finish) {
              _input.putBuffer(input);
            }
            while (_input.length() >= 8) {
              runPlan([
                [5, mixRound],
                [1, mashRound],
                [6, mixRound],
                [1, mashRound],
                [5, mixRound]
              ]);
            }
          },
          /**
           * Finishes encrypting or decrypting.
           *
           * @param pad a padding function to use, null for PKCS#7 padding,
           *           signature(blockSize, buffer, decrypt).
           *
           * @return true if successful, false on error.
           */
          finish: function(pad) {
            var rval = true;
            if (encrypt) {
              if (pad) {
                rval = pad(8, _input, !encrypt);
              } else {
                var padding = _input.length() === 8 ? 8 : 8 - _input.length();
                _input.fillWithByte(padding, padding);
              }
            }
            if (rval) {
              _finish = true;
              cipher.update();
            }
            if (!encrypt) {
              rval = _input.length() === 0;
              if (rval) {
                if (pad) {
                  rval = pad(8, _output, !encrypt);
                } else {
                  var len = _output.length();
                  var count = _output.at(len - 1);
                  if (count > len) {
                    rval = false;
                  } else {
                    _output.truncate(count);
                  }
                }
              }
            }
            return rval;
          }
        };
        return cipher;
      };
      forge.rc2.startEncrypting = function(key, iv, output) {
        var cipher = forge.rc2.createEncryptionCipher(key, 128);
        cipher.start(iv, output);
        return cipher;
      };
      forge.rc2.createEncryptionCipher = function(key, bits) {
        return createCipher(key, bits, true);
      };
      forge.rc2.startDecrypting = function(key, iv, output) {
        var cipher = forge.rc2.createDecryptionCipher(key, 128);
        cipher.start(iv, output);
        return cipher;
      };
      forge.rc2.createDecryptionCipher = function(key, bits) {
        return createCipher(key, bits, false);
      };
    }
  });

  // node_modules/node-forge/lib/jsbn.js
  var require_jsbn2 = __commonJS({
    "node_modules/node-forge/lib/jsbn.js"(exports, module) {
      var forge = require_forge();
      module.exports = forge.jsbn = forge.jsbn || {};
      var dbits;
      var canary = 244837814094590;
      var j_lm = (canary & 16777215) == 15715070;
      function BigInteger(a, b, c) {
        this.data = [];
        if (a != null)
          if ("number" == typeof a) this.fromNumber(a, b, c);
          else if (b == null && "string" != typeof a) this.fromString(a, 256);
          else this.fromString(a, b);
      }
      forge.jsbn.BigInteger = BigInteger;
      function nbi() {
        return new BigInteger(null);
      }
      function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
          var v = x * this.data[i++] + w.data[j] + c;
          c = Math.floor(v / 67108864);
          w.data[j++] = v & 67108863;
        }
        return c;
      }
      function am2(i, x, w, j, c, n) {
        var xl = x & 32767, xh = x >> 15;
        while (--n >= 0) {
          var l = this.data[i] & 32767;
          var h = this.data[i++] >> 15;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 32767) << 15) + w.data[j] + (c & 1073741823);
          c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
          w.data[j++] = l & 1073741823;
        }
        return c;
      }
      function am3(i, x, w, j, c, n) {
        var xl = x & 16383, xh = x >> 14;
        while (--n >= 0) {
          var l = this.data[i] & 16383;
          var h = this.data[i++] >> 14;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 16383) << 14) + w.data[j] + c;
          c = (l >> 28) + (m >> 14) + xh * h;
          w.data[j++] = l & 268435455;
        }
        return c;
      }
      if (typeof navigator === "undefined") {
        BigInteger.prototype.am = am3;
        dbits = 28;
      } else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
        BigInteger.prototype.am = am2;
        dbits = 30;
      } else if (j_lm && navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26;
      } else {
        BigInteger.prototype.am = am3;
        dbits = 28;
      }
      BigInteger.prototype.DB = dbits;
      BigInteger.prototype.DM = (1 << dbits) - 1;
      BigInteger.prototype.DV = 1 << dbits;
      var BI_FP = 52;
      BigInteger.prototype.FV = Math.pow(2, BI_FP);
      BigInteger.prototype.F1 = BI_FP - dbits;
      BigInteger.prototype.F2 = 2 * dbits - BI_FP;
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      var BI_RC = new Array();
      var rr;
      var vv;
      rr = "0".charCodeAt(0);
      for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
      rr = "a".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
      rr = "A".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
      function int2char(n) {
        return BI_RM.charAt(n);
      }
      function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return c == null ? -1 : c;
      }
      function bnpCopyTo(r) {
        for (var i = this.t - 1; i >= 0; --i) r.data[i] = this.data[i];
        r.t = this.t;
        r.s = this.s;
      }
      function bnpFromInt(x) {
        this.t = 1;
        this.s = x < 0 ? -1 : 0;
        if (x > 0) this.data[0] = x;
        else if (x < -1) this.data[0] = x + this.DV;
        else this.t = 0;
      }
      function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
      }
      function bnpFromString(s, b) {
        var k;
        if (b == 16) k = 4;
        else if (b == 8) k = 3;
        else if (b == 256) k = 8;
        else if (b == 2) k = 1;
        else if (b == 32) k = 5;
        else if (b == 4) k = 2;
        else {
          this.fromRadix(s, b);
          return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length, mi = false, sh = 0;
        while (--i >= 0) {
          var x = k == 8 ? s[i] & 255 : intAt(s, i);
          if (x < 0) {
            if (s.charAt(i) == "-") mi = true;
            continue;
          }
          mi = false;
          if (sh == 0)
            this.data[this.t++] = x;
          else if (sh + k > this.DB) {
            this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
            this.data[this.t++] = x >> this.DB - sh;
          } else
            this.data[this.t - 1] |= x << sh;
          sh += k;
          if (sh >= this.DB) sh -= this.DB;
        }
        if (k == 8 && (s[0] & 128) != 0) {
          this.s = -1;
          if (sh > 0) this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
        this.clamp();
        if (mi) BigInteger.ZERO.subTo(this, this);
      }
      function bnpClamp() {
        var c = this.s & this.DM;
        while (this.t > 0 && this.data[this.t - 1] == c) --this.t;
      }
      function bnToString(b) {
        if (this.s < 0) return "-" + this.negate().toString(b);
        var k;
        if (b == 16) k = 4;
        else if (b == 8) k = 3;
        else if (b == 2) k = 1;
        else if (b == 32) k = 5;
        else if (b == 4) k = 2;
        else return this.toRadix(b);
        var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
        var p = this.DB - i * this.DB % k;
        if (i-- > 0) {
          if (p < this.DB && (d = this.data[i] >> p) > 0) {
            m = true;
            r = int2char(d);
          }
          while (i >= 0) {
            if (p < k) {
              d = (this.data[i] & (1 << p) - 1) << k - p;
              d |= this.data[--i] >> (p += this.DB - k);
            } else {
              d = this.data[i] >> (p -= k) & km;
              if (p <= 0) {
                p += this.DB;
                --i;
              }
            }
            if (d > 0) m = true;
            if (m) r += int2char(d);
          }
        }
        return m ? r : "0";
      }
      function bnNegate() {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
      }
      function bnAbs() {
        return this.s < 0 ? this.negate() : this;
      }
      function bnCompareTo(a) {
        var r = this.s - a.s;
        if (r != 0) return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0) return this.s < 0 ? -r : r;
        while (--i >= 0) if ((r = this.data[i] - a.data[i]) != 0) return r;
        return 0;
      }
      function nbits(x) {
        var r = 1, t;
        if ((t = x >>> 16) != 0) {
          x = t;
          r += 16;
        }
        if ((t = x >> 8) != 0) {
          x = t;
          r += 8;
        }
        if ((t = x >> 4) != 0) {
          x = t;
          r += 4;
        }
        if ((t = x >> 2) != 0) {
          x = t;
          r += 2;
        }
        if ((t = x >> 1) != 0) {
          x = t;
          r += 1;
        }
        return r;
      }
      function bnBitLength() {
        if (this.t <= 0) return 0;
        return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
      }
      function bnpDLShiftTo(n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) r.data[i + n] = this.data[i];
        for (i = n - 1; i >= 0; --i) r.data[i] = 0;
        r.t = this.t + n;
        r.s = this.s;
      }
      function bnpDRShiftTo(n, r) {
        for (var i = n; i < this.t; ++i) r.data[i - n] = this.data[i];
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
      }
      function bnpLShiftTo(n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
        for (i = this.t - 1; i >= 0; --i) {
          r.data[i + ds + 1] = this.data[i] >> cbs | c;
          c = (this.data[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i) r.data[i] = 0;
        r.data[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
      }
      function bnpRShiftTo(n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
          r.t = 0;
          return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r.data[0] = this.data[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
          r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
          r.data[i - ds] = this.data[i] >> bs;
        }
        if (bs > 0) r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
      }
      function bnpSubTo(a, r) {
        var i = 0, c = 0, m = Math.min(a.t, this.t);
        while (i < m) {
          c += this.data[i] - a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c -= a.s;
          while (i < this.t) {
            c += this.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i < a.t) {
            c -= a.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c -= a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c < -1) r.data[i++] = this.DV + c;
        else if (c > 0) r.data[i++] = c;
        r.t = i;
        r.clamp();
      }
      function bnpMultiplyTo(a, r) {
        var x = this.abs(), y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) r.data[i] = 0;
        for (i = 0; i < y.t; ++i) r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
      }
      function bnpSquareTo(r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) r.data[i] = 0;
        for (i = 0; i < x.t - 1; ++i) {
          var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
          if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r.data[i + x.t] -= x.DV;
            r.data[i + x.t + 1] = 1;
          }
        }
        if (r.t > 0) r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
      }
      function bnpDivRemTo(m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) return;
        var pt = this.abs();
        if (pt.t < pm.t) {
          if (q != null) q.fromInt(0);
          if (r != null) this.copyTo(r);
          return;
        }
        if (r == null) r = nbi();
        var y = nbi(), ts = this.s, ms = m.s;
        var nsh = this.DB - nbits(pm.data[pm.t - 1]);
        if (nsh > 0) {
          pm.lShiftTo(nsh, y);
          pt.lShiftTo(nsh, r);
        } else {
          pm.copyTo(y);
          pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y.data[ys - 1];
        if (y0 == 0) return;
        var yt = y0 * (1 << this.F1) + (ys > 1 ? y.data[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
        var i = r.t, j = i - ys, t = q == null ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
          r.data[r.t++] = 1;
          r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y);
        while (y.t < ys) y.data[y.t++] = 0;
        while (--j >= 0) {
          var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
          if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r.data[i] < --qd) r.subTo(t, r);
          }
        }
        if (q != null) {
          r.drShiftTo(ys, q);
          if (ts != ms) BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) r.rShiftTo(nsh, r);
        if (ts < 0) BigInteger.ZERO.subTo(r, r);
      }
      function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
        return r;
      }
      function Classic(m) {
        this.m = m;
      }
      function cConvert(x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
        else return x;
      }
      function cRevert(x) {
        return x;
      }
      function cReduce(x) {
        x.divRemTo(this.m, null, x);
      }
      function cMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      function cSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      Classic.prototype.convert = cConvert;
      Classic.prototype.revert = cRevert;
      Classic.prototype.reduce = cReduce;
      Classic.prototype.mulTo = cMulTo;
      Classic.prototype.sqrTo = cSqrTo;
      function bnpInvDigit() {
        if (this.t < 1) return 0;
        var x = this.data[0];
        if ((x & 1) == 0) return 0;
        var y = x & 3;
        y = y * (2 - (x & 15) * y) & 15;
        y = y * (2 - (x & 255) * y) & 255;
        y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
        y = y * (2 - x * y % this.DV) % this.DV;
        return y > 0 ? this.DV - y : -y;
      }
      function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << m.DB - 15) - 1;
        this.mt2 = 2 * m.t;
      }
      function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
        return r;
      }
      function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
      function montReduce(x) {
        while (x.t <= this.mt2)
          x.data[x.t++] = 0;
        for (var i = 0; i < this.m.t; ++i) {
          var j = x.data[i] & 32767;
          var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
          j = i + this.m.t;
          x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
          while (x.data[j] >= x.DV) {
            x.data[j] -= x.DV;
            x.data[++j]++;
          }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
      }
      function montSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function montMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Montgomery.prototype.convert = montConvert;
      Montgomery.prototype.revert = montRevert;
      Montgomery.prototype.reduce = montReduce;
      Montgomery.prototype.mulTo = montMulTo;
      Montgomery.prototype.sqrTo = montSqrTo;
      function bnpIsEven() {
        return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
      }
      function bnpExp(e, z) {
        if (e > 4294967295 || e < 1) return BigInteger.ONE;
        var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
          z.sqrTo(r, r2);
          if ((e & 1 << i) > 0) z.mulTo(r2, g, r);
          else {
            var t = r;
            r = r2;
            r2 = t;
          }
        }
        return z.revert(r);
      }
      function bnModPowInt(e, m) {
        var z;
        if (e < 256 || m.isEven()) z = new Classic(m);
        else z = new Montgomery(m);
        return this.exp(e, z);
      }
      BigInteger.prototype.copyTo = bnpCopyTo;
      BigInteger.prototype.fromInt = bnpFromInt;
      BigInteger.prototype.fromString = bnpFromString;
      BigInteger.prototype.clamp = bnpClamp;
      BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
      BigInteger.prototype.drShiftTo = bnpDRShiftTo;
      BigInteger.prototype.lShiftTo = bnpLShiftTo;
      BigInteger.prototype.rShiftTo = bnpRShiftTo;
      BigInteger.prototype.subTo = bnpSubTo;
      BigInteger.prototype.multiplyTo = bnpMultiplyTo;
      BigInteger.prototype.squareTo = bnpSquareTo;
      BigInteger.prototype.divRemTo = bnpDivRemTo;
      BigInteger.prototype.invDigit = bnpInvDigit;
      BigInteger.prototype.isEven = bnpIsEven;
      BigInteger.prototype.exp = bnpExp;
      BigInteger.prototype.toString = bnToString;
      BigInteger.prototype.negate = bnNegate;
      BigInteger.prototype.abs = bnAbs;
      BigInteger.prototype.compareTo = bnCompareTo;
      BigInteger.prototype.bitLength = bnBitLength;
      BigInteger.prototype.mod = bnMod;
      BigInteger.prototype.modPowInt = bnModPowInt;
      BigInteger.ZERO = nbv(0);
      BigInteger.ONE = nbv(1);
      function bnClone() {
        var r = nbi();
        this.copyTo(r);
        return r;
      }
      function bnIntValue() {
        if (this.s < 0) {
          if (this.t == 1) return this.data[0] - this.DV;
          else if (this.t == 0) return -1;
        } else if (this.t == 1) return this.data[0];
        else if (this.t == 0) return 0;
        return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
      }
      function bnByteValue() {
        return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
      }
      function bnShortValue() {
        return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
      }
      function bnpChunkSize(r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
      }
      function bnSigNum() {
        if (this.s < 0) return -1;
        else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0) return 0;
        else return 1;
      }
      function bnpToRadix(b) {
        if (b == null) b = 10;
        if (this.signum() == 0 || b < 2 || b > 36) return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a), y = nbi(), z = nbi(), r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
          r = (a + z.intValue()).toString(b).substr(1) + r;
          y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
      }
      function bnpFromRadix(s, b) {
        this.fromInt(0);
        if (b == null) b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
        for (var i = 0; i < s.length; ++i) {
          var x = intAt(s, i);
          if (x < 0) {
            if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
            continue;
          }
          w = b * w + x;
          if (++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0;
          }
        }
        if (j > 0) {
          this.dMultiply(Math.pow(b, j));
          this.dAddOffset(w, 0);
        }
        if (mi) BigInteger.ZERO.subTo(this, this);
      }
      function bnpFromNumber(a, b, c) {
        if ("number" == typeof b) {
          if (a < 2) this.fromInt(1);
          else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1))
              this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven()) this.dAddOffset(1, 0);
            while (!this.isProbablePrime(b)) {
              this.dAddOffset(2, 0);
              if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
            }
          }
        } else {
          var x = new Array(), t = a & 7;
          x.length = (a >> 3) + 1;
          b.nextBytes(x);
          if (t > 0) x[0] &= (1 << t) - 1;
          else x[0] = 0;
          this.fromString(x, 256);
        }
      }
      function bnToByteArray() {
        var i = this.t, r = new Array();
        r[0] = this.s;
        var p = this.DB - i * this.DB % 8, d, k = 0;
        if (i-- > 0) {
          if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p)
            r[k++] = d | this.s << this.DB - p;
          while (i >= 0) {
            if (p < 8) {
              d = (this.data[i] & (1 << p) - 1) << 8 - p;
              d |= this.data[--i] >> (p += this.DB - 8);
            } else {
              d = this.data[i] >> (p -= 8) & 255;
              if (p <= 0) {
                p += this.DB;
                --i;
              }
            }
            if ((d & 128) != 0) d |= -256;
            if (k == 0 && (this.s & 128) != (d & 128)) ++k;
            if (k > 0 || d != this.s) r[k++] = d;
          }
        }
        return r;
      }
      function bnEquals(a) {
        return this.compareTo(a) == 0;
      }
      function bnMin(a) {
        return this.compareTo(a) < 0 ? this : a;
      }
      function bnMax(a) {
        return this.compareTo(a) > 0 ? this : a;
      }
      function bnpBitwiseTo(a, op, r) {
        var i, f, m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) r.data[i] = op(this.data[i], a.data[i]);
        if (a.t < this.t) {
          f = a.s & this.DM;
          for (i = m; i < this.t; ++i) r.data[i] = op(this.data[i], f);
          r.t = this.t;
        } else {
          f = this.s & this.DM;
          for (i = m; i < a.t; ++i) r.data[i] = op(f, a.data[i]);
          r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
      }
      function op_and(x, y) {
        return x & y;
      }
      function bnAnd(a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
      }
      function op_or(x, y) {
        return x | y;
      }
      function bnOr(a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
      }
      function op_xor(x, y) {
        return x ^ y;
      }
      function bnXor(a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
      }
      function op_andnot(x, y) {
        return x & ~y;
      }
      function bnAndNot(a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
      }
      function bnNot() {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) r.data[i] = this.DM & ~this.data[i];
        r.t = this.t;
        r.s = ~this.s;
        return r;
      }
      function bnShiftLeft(n) {
        var r = nbi();
        if (n < 0) this.rShiftTo(-n, r);
        else this.lShiftTo(n, r);
        return r;
      }
      function bnShiftRight(n) {
        var r = nbi();
        if (n < 0) this.lShiftTo(-n, r);
        else this.rShiftTo(n, r);
        return r;
      }
      function lbit(x) {
        if (x == 0) return -1;
        var r = 0;
        if ((x & 65535) == 0) {
          x >>= 16;
          r += 16;
        }
        if ((x & 255) == 0) {
          x >>= 8;
          r += 8;
        }
        if ((x & 15) == 0) {
          x >>= 4;
          r += 4;
        }
        if ((x & 3) == 0) {
          x >>= 2;
          r += 2;
        }
        if ((x & 1) == 0) ++r;
        return r;
      }
      function bnGetLowestSetBit() {
        for (var i = 0; i < this.t; ++i)
          if (this.data[i] != 0) return i * this.DB + lbit(this.data[i]);
        if (this.s < 0) return this.t * this.DB;
        return -1;
      }
      function cbit(x) {
        var r = 0;
        while (x != 0) {
          x &= x - 1;
          ++r;
        }
        return r;
      }
      function bnBitCount() {
        var r = 0, x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) r += cbit(this.data[i] ^ x);
        return r;
      }
      function bnTestBit(n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) return this.s != 0;
        return (this.data[j] & 1 << n % this.DB) != 0;
      }
      function bnpChangeBit(n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
      }
      function bnSetBit(n) {
        return this.changeBit(n, op_or);
      }
      function bnClearBit(n) {
        return this.changeBit(n, op_andnot);
      }
      function bnFlipBit(n) {
        return this.changeBit(n, op_xor);
      }
      function bnpAddTo(a, r) {
        var i = 0, c = 0, m = Math.min(a.t, this.t);
        while (i < m) {
          c += this.data[i] + a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        if (a.t < this.t) {
          c += a.s;
          while (i < this.t) {
            c += this.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += this.s;
        } else {
          c += this.s;
          while (i < a.t) {
            c += a.data[i];
            r.data[i++] = c & this.DM;
            c >>= this.DB;
          }
          c += a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c > 0) r.data[i++] = c;
        else if (c < -1) r.data[i++] = this.DV + c;
        r.t = i;
        r.clamp();
      }
      function bnAdd(a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
      }
      function bnSubtract(a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
      }
      function bnMultiply(a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
      }
      function bnSquare() {
        var r = nbi();
        this.squareTo(r);
        return r;
      }
      function bnDivide(a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
      }
      function bnRemainder(a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
      }
      function bnDivideAndRemainder(a) {
        var q = nbi(), r = nbi();
        this.divRemTo(a, q, r);
        return new Array(q, r);
      }
      function bnpDMultiply(n) {
        this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
      }
      function bnpDAddOffset(n, w) {
        if (n == 0) return;
        while (this.t <= w) this.data[this.t++] = 0;
        this.data[w] += n;
        while (this.data[w] >= this.DV) {
          this.data[w] -= this.DV;
          if (++w >= this.t) this.data[this.t++] = 0;
          ++this.data[w];
        }
      }
      function NullExp() {
      }
      function nNop(x) {
        return x;
      }
      function nMulTo(x, y, r) {
        x.multiplyTo(y, r);
      }
      function nSqrTo(x, r) {
        x.squareTo(r);
      }
      NullExp.prototype.convert = nNop;
      NullExp.prototype.revert = nNop;
      NullExp.prototype.mulTo = nMulTo;
      NullExp.prototype.sqrTo = nSqrTo;
      function bnPow(e) {
        return this.exp(e, new NullExp());
      }
      function bnpMultiplyLowerTo(a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0;
        r.t = i;
        while (i > 0) r.data[--i] = 0;
        var j;
        for (j = r.t - this.t; i < j; ++i) r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
        for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a.data[i], r, i, 0, n - i);
        r.clamp();
      }
      function bnpMultiplyUpperTo(a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0;
        while (--i >= 0) r.data[i] = 0;
        for (i = Math.max(n - this.t, 0); i < a.t; ++i)
          r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
        r.clamp();
        r.drShiftTo(1, r);
      }
      function Barrett(m) {
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
      }
      function barrettConvert(x) {
        if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
        else if (x.compareTo(this.m) < 0) return x;
        else {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        }
      }
      function barrettRevert(x) {
        return x;
      }
      function barrettReduce(x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
          x.t = this.m.t + 1;
          x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
      }
      function barrettSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
      }
      function barrettMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
      }
      Barrett.prototype.convert = barrettConvert;
      Barrett.prototype.revert = barrettRevert;
      Barrett.prototype.reduce = barrettReduce;
      Barrett.prototype.mulTo = barrettMulTo;
      Barrett.prototype.sqrTo = barrettSqrTo;
      function bnModPow(e, m) {
        var i = e.bitLength(), k, r = nbv(1), z;
        if (i <= 0) return r;
        else if (i < 18) k = 1;
        else if (i < 48) k = 3;
        else if (i < 144) k = 4;
        else if (i < 768) k = 5;
        else k = 6;
        if (i < 8)
          z = new Classic(m);
        else if (m.isEven())
          z = new Barrett(m);
        else
          z = new Montgomery(m);
        var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
          var g2 = nbi();
          z.sqrTo(g[1], g2);
          while (n <= km) {
            g[n] = nbi();
            z.mulTo(g2, g[n - 2], g[n]);
            n += 2;
          }
        }
        var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
        i = nbits(e.data[j]) - 1;
        while (j >= 0) {
          if (i >= k1) w = e.data[j] >> i - k1 & km;
          else {
            w = (e.data[j] & (1 << i + 1) - 1) << k1 - i;
            if (j > 0) w |= e.data[j - 1] >> this.DB + i - k1;
          }
          n = k;
          while ((w & 1) == 0) {
            w >>= 1;
            --n;
          }
          if ((i -= n) < 0) {
            i += this.DB;
            --j;
          }
          if (is1) {
            g[w].copyTo(r);
            is1 = false;
          } else {
            while (n > 1) {
              z.sqrTo(r, r2);
              z.sqrTo(r2, r);
              n -= 2;
            }
            if (n > 0) z.sqrTo(r, r2);
            else {
              t = r;
              r = r2;
              r2 = t;
            }
            z.mulTo(r2, g[w], r);
          }
          while (j >= 0 && (e.data[j] & 1 << i) == 0) {
            z.sqrTo(r, r2);
            t = r;
            r = r2;
            r2 = t;
            if (--i < 0) {
              i = this.DB - 1;
              --j;
            }
          }
        }
        return z.revert(r);
      }
      function bnGCD(a) {
        var x = this.s < 0 ? this.negate() : this.clone();
        var y = a.s < 0 ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
          var t = x;
          x = y;
          y = t;
        }
        var i = x.getLowestSetBit(), g = y.getLowestSetBit();
        if (g < 0) return x;
        if (i < g) g = i;
        if (g > 0) {
          x.rShiftTo(g, x);
          y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
          if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
          if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
          if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x);
          } else {
            y.subTo(x, y);
            y.rShiftTo(1, y);
          }
        }
        if (g > 0) y.lShiftTo(g, y);
        return y;
      }
      function bnpModInt(n) {
        if (n <= 0) return 0;
        var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
        if (this.t > 0)
          if (d == 0) r = this.data[0] % n;
          else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this.data[i]) % n;
        return r;
      }
      function bnModInverse(m) {
        if (this.signum() == 0) {
          return BigInteger.ZERO;
        }
        var ac = m.isEven();
        if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
        var u = m.clone(), v = this.clone();
        var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
        while (u.signum() != 0) {
          while (u.isEven()) {
            u.rShiftTo(1, u);
            if (ac) {
              if (!a.isEven() || !b.isEven()) {
                a.addTo(this, a);
                b.subTo(m, b);
              }
              a.rShiftTo(1, a);
            } else if (!b.isEven()) b.subTo(m, b);
            b.rShiftTo(1, b);
          }
          while (v.isEven()) {
            v.rShiftTo(1, v);
            if (ac) {
              if (!c.isEven() || !d.isEven()) {
                c.addTo(this, c);
                d.subTo(m, d);
              }
              c.rShiftTo(1, c);
            } else if (!d.isEven()) d.subTo(m, d);
            d.rShiftTo(1, d);
          }
          if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (ac) a.subTo(c, a);
            b.subTo(d, b);
          } else {
            v.subTo(u, v);
            if (ac) c.subTo(a, c);
            d.subTo(b, d);
          }
        }
        if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
        if (d.compareTo(m) >= 0) return d.subtract(m);
        if (d.signum() < 0) d.addTo(m, d);
        else return d;
        if (d.signum() < 0) return d.add(m);
        else return d;
      }
      var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
      var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
      function bnIsProbablePrime(t) {
        var i, x = this.abs();
        if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
          for (i = 0; i < lowprimes.length; ++i)
            if (x.data[0] == lowprimes[i]) return true;
          return false;
        }
        if (x.isEven()) return false;
        i = 1;
        while (i < lowprimes.length) {
          var m = lowprimes[i], j = i + 1;
          while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
          m = x.modInt(m);
          while (i < j) if (m % lowprimes[i++] == 0) return false;
        }
        return x.millerRabin(t);
      }
      function bnpMillerRabin(t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) return false;
        var r = n1.shiftRight(k);
        var prng = bnGetPrng();
        var a;
        for (var i = 0; i < t; ++i) {
          do {
            a = new BigInteger(this.bitLength(), prng);
          } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
          var y = a.modPow(r, this);
          if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while (j++ < k && y.compareTo(n1) != 0) {
              y = y.modPowInt(2, this);
              if (y.compareTo(BigInteger.ONE) == 0) return false;
            }
            if (y.compareTo(n1) != 0) return false;
          }
        }
        return true;
      }
      function bnGetPrng() {
        return {
          // x is an array to fill with bytes
          nextBytes: function(x) {
            for (var i = 0; i < x.length; ++i) {
              x[i] = Math.floor(Math.random() * 256);
            }
          }
        };
      }
      BigInteger.prototype.chunkSize = bnpChunkSize;
      BigInteger.prototype.toRadix = bnpToRadix;
      BigInteger.prototype.fromRadix = bnpFromRadix;
      BigInteger.prototype.fromNumber = bnpFromNumber;
      BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
      BigInteger.prototype.changeBit = bnpChangeBit;
      BigInteger.prototype.addTo = bnpAddTo;
      BigInteger.prototype.dMultiply = bnpDMultiply;
      BigInteger.prototype.dAddOffset = bnpDAddOffset;
      BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
      BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
      BigInteger.prototype.modInt = bnpModInt;
      BigInteger.prototype.millerRabin = bnpMillerRabin;
      BigInteger.prototype.clone = bnClone;
      BigInteger.prototype.intValue = bnIntValue;
      BigInteger.prototype.byteValue = bnByteValue;
      BigInteger.prototype.shortValue = bnShortValue;
      BigInteger.prototype.signum = bnSigNum;
      BigInteger.prototype.toByteArray = bnToByteArray;
      BigInteger.prototype.equals = bnEquals;
      BigInteger.prototype.min = bnMin;
      BigInteger.prototype.max = bnMax;
      BigInteger.prototype.and = bnAnd;
      BigInteger.prototype.or = bnOr;
      BigInteger.prototype.xor = bnXor;
      BigInteger.prototype.andNot = bnAndNot;
      BigInteger.prototype.not = bnNot;
      BigInteger.prototype.shiftLeft = bnShiftLeft;
      BigInteger.prototype.shiftRight = bnShiftRight;
      BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
      BigInteger.prototype.bitCount = bnBitCount;
      BigInteger.prototype.testBit = bnTestBit;
      BigInteger.prototype.setBit = bnSetBit;
      BigInteger.prototype.clearBit = bnClearBit;
      BigInteger.prototype.flipBit = bnFlipBit;
      BigInteger.prototype.add = bnAdd;
      BigInteger.prototype.subtract = bnSubtract;
      BigInteger.prototype.multiply = bnMultiply;
      BigInteger.prototype.divide = bnDivide;
      BigInteger.prototype.remainder = bnRemainder;
      BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
      BigInteger.prototype.modPow = bnModPow;
      BigInteger.prototype.modInverse = bnModInverse;
      BigInteger.prototype.pow = bnPow;
      BigInteger.prototype.gcd = bnGCD;
      BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
      BigInteger.prototype.square = bnSquare;
    }
  });

  // node_modules/node-forge/lib/sha1.js
  var require_sha12 = __commonJS({
    "node_modules/node-forge/lib/sha1.js"(exports, module) {
      var forge = require_forge();
      require_md();
      require_util();
      var sha1 = module.exports = forge.sha1 = forge.sha1 || {};
      forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
      sha1.create = function() {
        if (!_initialized) {
          _init();
        }
        var _state = null;
        var _input = forge.util.createBuffer();
        var _w = new Array(80);
        var md = {
          algorithm: "sha1",
          blockLength: 64,
          digestLength: 20,
          // 56-bit length of message so far (does not including padding)
          messageLength: 0,
          // true message length
          fullMessageLength: null,
          // size of message length in bytes
          messageLengthSize: 8
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength64 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge.util.createBuffer();
          _state = {
            h0: 1732584193,
            h1: 4023233417,
            h2: 2562383102,
            h3: 271733878,
            h4: 3285377520
          };
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_state, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits += carry;
            finalBlock.putInt32(bits >>> 0);
            bits = next >>> 0;
          }
          finalBlock.putInt32(bits);
          var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4
          };
          _update(s2, _w, finalBlock);
          var rval = forge.util.createBuffer();
          rval.putInt32(s2.h0);
          rval.putInt32(s2.h1);
          rval.putInt32(s2.h2);
          rval.putInt32(s2.h3);
          rval.putInt32(s2.h4);
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge.util.fillString(String.fromCharCode(0), 64);
        _initialized = true;
      }
      function _update(s, w, bytes) {
        var t, a, b, c, d, e, f, i;
        var len = bytes.length();
        while (len >= 64) {
          a = s.h0;
          b = s.h1;
          c = s.h2;
          d = s.h3;
          e = s.h4;
          for (i = 0; i < 16; ++i) {
            t = bytes.getInt32();
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 20; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 32; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 40; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 60; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b & c | d & (b ^ c);
            t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          for (; i < 80; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) >>> 0;
            b = a;
            a = t;
          }
          s.h0 = s.h0 + a | 0;
          s.h1 = s.h1 + b | 0;
          s.h2 = s.h2 + c | 0;
          s.h3 = s.h3 + d | 0;
          s.h4 = s.h4 + e | 0;
          len -= 64;
        }
      }
    }
  });

  // node_modules/node-forge/lib/pkcs1.js
  var require_pkcs1 = __commonJS({
    "node_modules/node-forge/lib/pkcs1.js"(exports, module) {
      var forge = require_forge();
      require_util();
      require_random();
      require_sha12();
      var pkcs1 = module.exports = forge.pkcs1 = forge.pkcs1 || {};
      pkcs1.encode_rsa_oaep = function(key, message, options) {
        var label;
        var seed;
        var md;
        var mgf1Md;
        if (typeof options === "string") {
          label = options;
          seed = arguments[3] || void 0;
          md = arguments[4] || void 0;
        } else if (options) {
          label = options.label || void 0;
          seed = options.seed || void 0;
          md = options.md || void 0;
          if (options.mgf1 && options.mgf1.md) {
            mgf1Md = options.mgf1.md;
          }
        }
        if (!md) {
          md = forge.md.sha1.create();
        } else {
          md.start();
        }
        if (!mgf1Md) {
          mgf1Md = md;
        }
        var keyLength = Math.ceil(key.n.bitLength() / 8);
        var maxLength = keyLength - 2 * md.digestLength - 2;
        if (message.length > maxLength) {
          var error = new Error("RSAES-OAEP input message length is too long.");
          error.length = message.length;
          error.maxLength = maxLength;
          throw error;
        }
        if (!label) {
          label = "";
        }
        md.update(label, "raw");
        var lHash = md.digest();
        var PS = "";
        var PS_length = maxLength - message.length;
        for (var i = 0; i < PS_length; i++) {
          PS += "\0";
        }
        var DB = lHash.getBytes() + PS + "" + message;
        if (!seed) {
          seed = forge.random.getBytes(md.digestLength);
        } else if (seed.length !== md.digestLength) {
          var error = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
          error.seedLength = seed.length;
          error.digestLength = md.digestLength;
          throw error;
        }
        var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
        var maskedDB = forge.util.xorBytes(DB, dbMask, DB.length);
        var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
        var maskedSeed = forge.util.xorBytes(seed, seedMask, seed.length);
        return "\0" + maskedSeed + maskedDB;
      };
      pkcs1.decode_rsa_oaep = function(key, em, options) {
        var label;
        var md;
        var mgf1Md;
        if (typeof options === "string") {
          label = options;
          md = arguments[3] || void 0;
        } else if (options) {
          label = options.label || void 0;
          md = options.md || void 0;
          if (options.mgf1 && options.mgf1.md) {
            mgf1Md = options.mgf1.md;
          }
        }
        var keyLength = Math.ceil(key.n.bitLength() / 8);
        if (em.length !== keyLength) {
          var error = new Error("RSAES-OAEP encoded message length is invalid.");
          error.length = em.length;
          error.expectedLength = keyLength;
          throw error;
        }
        if (md === void 0) {
          md = forge.md.sha1.create();
        } else {
          md.start();
        }
        if (!mgf1Md) {
          mgf1Md = md;
        }
        if (keyLength < 2 * md.digestLength + 2) {
          throw new Error("RSAES-OAEP key is too short for the hash function.");
        }
        if (!label) {
          label = "";
        }
        md.update(label, "raw");
        var lHash = md.digest().getBytes();
        var y = em.charAt(0);
        var maskedSeed = em.substring(1, md.digestLength + 1);
        var maskedDB = em.substring(1 + md.digestLength);
        var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
        var seed = forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
        var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
        var db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length);
        var lHashPrime = db.substring(0, md.digestLength);
        var error = y !== "\0";
        for (var i = 0; i < md.digestLength; ++i) {
          error |= lHash.charAt(i) !== lHashPrime.charAt(i);
        }
        var in_ps = 1;
        var index = md.digestLength;
        for (var j = md.digestLength; j < db.length; j++) {
          var code = db.charCodeAt(j);
          var is_0 = code & 1 ^ 1;
          var error_mask = in_ps ? 65534 : 0;
          error |= code & error_mask;
          in_ps = in_ps & is_0;
          index += in_ps;
        }
        if (error || db.charCodeAt(index) !== 1) {
          throw new Error("Invalid RSAES-OAEP padding.");
        }
        return db.substring(index + 1);
      };
      function rsa_mgf1(seed, maskLength, hash) {
        if (!hash) {
          hash = forge.md.sha1.create();
        }
        var t = "";
        var count = Math.ceil(maskLength / hash.digestLength);
        for (var i = 0; i < count; ++i) {
          var c = String.fromCharCode(
            i >> 24 & 255,
            i >> 16 & 255,
            i >> 8 & 255,
            i & 255
          );
          hash.start();
          hash.update(seed + c);
          t += hash.digest().getBytes();
        }
        return t.substring(0, maskLength);
      }
    }
  });

  // node_modules/node-forge/lib/prime.js
  var require_prime = __commonJS({
    "node_modules/node-forge/lib/prime.js"(exports, module) {
      var forge = require_forge();
      require_util();
      require_jsbn2();
      require_random();
      (function() {
        if (forge.prime) {
          module.exports = forge.prime;
          return;
        }
        var prime = module.exports = forge.prime = forge.prime || {};
        var BigInteger = forge.jsbn.BigInteger;
        var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
        var THIRTY = new BigInteger(null);
        THIRTY.fromInt(30);
        var op_or = function(x, y) {
          return x | y;
        };
        prime.generateProbablePrime = function(bits, options, callback) {
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          options = options || {};
          var algorithm = options.algorithm || "PRIMEINC";
          if (typeof algorithm === "string") {
            algorithm = { name: algorithm };
          }
          algorithm.options = algorithm.options || {};
          var prng = options.prng || forge.random;
          var rng = {
            // x is an array to fill with bytes
            nextBytes: function(x) {
              var b = prng.getBytesSync(x.length);
              for (var i = 0; i < x.length; ++i) {
                x[i] = b.charCodeAt(i);
              }
            }
          };
          if (algorithm.name === "PRIMEINC") {
            return primeincFindPrime(bits, rng, algorithm.options, callback);
          }
          throw new Error("Invalid prime generation algorithm: " + algorithm.name);
        };
        function primeincFindPrime(bits, rng, options, callback) {
          if ("workers" in options) {
            return primeincFindPrimeWithWorkers(bits, rng, options, callback);
          }
          return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
        }
        function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
          var num = generateRandom(bits, rng);
          var deltaIdx = 0;
          var mrTests = getMillerRabinTests(num.bitLength());
          if ("millerRabinTests" in options) {
            mrTests = options.millerRabinTests;
          }
          var maxBlockTime = 10;
          if ("maxBlockTime" in options) {
            maxBlockTime = options.maxBlockTime;
          }
          _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
        }
        function _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback) {
          var start = +/* @__PURE__ */ new Date();
          do {
            if (num.bitLength() > bits) {
              num = generateRandom(bits, rng);
            }
            if (num.isProbablePrime(mrTests)) {
              return callback(null, num);
            }
            num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
          } while (maxBlockTime < 0 || +/* @__PURE__ */ new Date() - start < maxBlockTime);
          forge.util.setImmediate(function() {
            _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
          });
        }
        function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
          if (typeof Worker === "undefined") {
            return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
          }
          var num = generateRandom(bits, rng);
          var numWorkers = options.workers;
          var workLoad = options.workLoad || 100;
          var range = workLoad * 30 / 8;
          var workerScript = options.workerScript || "forge/prime.worker.js";
          if (numWorkers === -1) {
            return forge.util.estimateCores(function(err, cores) {
              if (err) {
                cores = 2;
              }
              numWorkers = cores - 1;
              generate();
            });
          }
          generate();
          function generate() {
            numWorkers = Math.max(1, numWorkers);
            var workers = [];
            for (var i = 0; i < numWorkers; ++i) {
              workers[i] = new Worker(workerScript);
            }
            var running = numWorkers;
            for (var i = 0; i < numWorkers; ++i) {
              workers[i].addEventListener("message", workerMessage);
            }
            var found = false;
            function workerMessage(e) {
              if (found) {
                return;
              }
              --running;
              var data = e.data;
              if (data.found) {
                for (var i2 = 0; i2 < workers.length; ++i2) {
                  workers[i2].terminate();
                }
                found = true;
                return callback(null, new BigInteger(data.prime, 16));
              }
              if (num.bitLength() > bits) {
                num = generateRandom(bits, rng);
              }
              var hex = num.toString(16);
              e.target.postMessage({
                hex,
                workLoad
              });
              num.dAddOffset(range, 0);
            }
          }
        }
        function generateRandom(bits, rng) {
          var num = new BigInteger(bits, rng);
          var bits1 = bits - 1;
          if (!num.testBit(bits1)) {
            num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
          }
          num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
          return num;
        }
        function getMillerRabinTests(bits) {
          if (bits <= 100) return 27;
          if (bits <= 150) return 18;
          if (bits <= 200) return 15;
          if (bits <= 250) return 12;
          if (bits <= 300) return 9;
          if (bits <= 350) return 8;
          if (bits <= 400) return 7;
          if (bits <= 500) return 6;
          if (bits <= 600) return 5;
          if (bits <= 800) return 4;
          if (bits <= 1250) return 3;
          return 2;
        }
      })();
    }
  });

  // node_modules/node-forge/lib/rsa.js
  var require_rsa = __commonJS({
    "node_modules/node-forge/lib/rsa.js"(exports, module) {
      var forge = require_forge();
      require_asn12();
      require_jsbn2();
      require_oids();
      require_pkcs1();
      require_prime();
      require_random();
      require_util();
      if (typeof BigInteger === "undefined") {
        BigInteger = forge.jsbn.BigInteger;
      }
      var BigInteger;
      var _crypto = forge.util.isNodejs ? require_crypto() : null;
      var asn1 = forge.asn1;
      var util = forge.util;
      forge.pki = forge.pki || {};
      module.exports = forge.pki.rsa = forge.rsa = forge.rsa || {};
      var pki = forge.pki;
      var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
      var privateKeyValidator = {
        // PrivateKeyInfo
        name: "PrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          // Version (INTEGER)
          name: "PrivateKeyInfo.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyVersion"
        }, {
          // privateKeyAlgorithm
          name: "PrivateKeyInfo.privateKeyAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "privateKeyOid"
          }]
        }, {
          // PrivateKey
          name: "PrivateKeyInfo",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "privateKey"
        }]
      };
      var rsaPrivateKeyValidator = {
        // RSAPrivateKey
        name: "RSAPrivateKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          // Version (INTEGER)
          name: "RSAPrivateKey.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyVersion"
        }, {
          // modulus (n)
          name: "RSAPrivateKey.modulus",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyModulus"
        }, {
          // publicExponent (e)
          name: "RSAPrivateKey.publicExponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPublicExponent"
        }, {
          // privateExponent (d)
          name: "RSAPrivateKey.privateExponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrivateExponent"
        }, {
          // prime1 (p)
          name: "RSAPrivateKey.prime1",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrime1"
        }, {
          // prime2 (q)
          name: "RSAPrivateKey.prime2",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyPrime2"
        }, {
          // exponent1 (d mod (p-1))
          name: "RSAPrivateKey.exponent1",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyExponent1"
        }, {
          // exponent2 (d mod (q-1))
          name: "RSAPrivateKey.exponent2",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyExponent2"
        }, {
          // coefficient ((inverse of q) mod p)
          name: "RSAPrivateKey.coefficient",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyCoefficient"
        }]
      };
      var rsaPublicKeyValidator = {
        // RSAPublicKey
        name: "RSAPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          // modulus (n)
          name: "RSAPublicKey.modulus",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "publicKeyModulus"
        }, {
          // publicExponent (e)
          name: "RSAPublicKey.exponent",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "publicKeyExponent"
        }]
      };
      var publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "subjectPublicKeyInfo",
        value: [{
          name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "publicKeyOid"
          }]
        }, {
          // subjectPublicKey
          name: "SubjectPublicKeyInfo.subjectPublicKey",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.BITSTRING,
          constructed: false,
          value: [{
            // RSAPublicKey
            name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            optional: true,
            captureAsn1: "rsaPublicKey"
          }]
        }]
      };
      var digestInfoValidator = {
        name: "DigestInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "DigestInfo.DigestAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "algorithmIdentifier"
          }, {
            // NULL parameters
            name: "DigestInfo.DigestAlgorithm.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.NULL,
            // captured only to check existence for md2 and md5
            capture: "parameters",
            optional: true,
            constructed: false
          }]
        }, {
          // digest
          name: "DigestInfo.digest",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "digest"
        }]
      };
      var emsaPkcs1v15encode = function(md) {
        var oid;
        if (md.algorithm in pki.oids) {
          oid = pki.oids[md.algorithm];
        } else {
          var error = new Error("Unknown message digest algorithm.");
          error.algorithm = md.algorithm;
          throw error;
        }
        var oidBytes = asn1.oidToDer(oid).getBytes();
        var digestInfo = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          []
        );
        var digestAlgorithm = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          []
        );
        digestAlgorithm.value.push(asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OID,
          false,
          oidBytes
        ));
        digestAlgorithm.value.push(asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.NULL,
          false,
          ""
        ));
        var digest = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          md.digest().getBytes()
        );
        digestInfo.value.push(digestAlgorithm);
        digestInfo.value.push(digest);
        return asn1.toDer(digestInfo).getBytes();
      };
      var _modPow = function(x, key, pub) {
        if (pub) {
          return x.modPow(key.e, key.n);
        }
        if (!key.p || !key.q) {
          return x.modPow(key.d, key.n);
        }
        if (!key.dP) {
          key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
        }
        if (!key.dQ) {
          key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
        }
        if (!key.qInv) {
          key.qInv = key.q.modInverse(key.p);
        }
        var r;
        do {
          r = new BigInteger(
            forge.util.bytesToHex(forge.random.getBytes(key.n.bitLength() / 8)),
            16
          );
        } while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
        x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
        var xp = x.mod(key.p).modPow(key.dP, key.p);
        var xq = x.mod(key.q).modPow(key.dQ, key.q);
        while (xp.compareTo(xq) < 0) {
          xp = xp.add(key.p);
        }
        var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
        y = y.multiply(r.modInverse(key.n)).mod(key.n);
        return y;
      };
      pki.rsa.encrypt = function(m, key, bt) {
        var pub = bt;
        var eb;
        var k = Math.ceil(key.n.bitLength() / 8);
        if (bt !== false && bt !== true) {
          pub = bt === 2;
          eb = _encodePkcs1_v1_5(m, key, bt);
        } else {
          eb = forge.util.createBuffer();
          eb.putBytes(m);
        }
        var x = new BigInteger(eb.toHex(), 16);
        var y = _modPow(x, key, pub);
        var yhex = y.toString(16);
        var ed = forge.util.createBuffer();
        var zeros = k - Math.ceil(yhex.length / 2);
        while (zeros > 0) {
          ed.putByte(0);
          --zeros;
        }
        ed.putBytes(forge.util.hexToBytes(yhex));
        return ed.getBytes();
      };
      pki.rsa.decrypt = function(ed, key, pub, ml) {
        var k = Math.ceil(key.n.bitLength() / 8);
        if (ed.length !== k) {
          var error = new Error("Encrypted message length is invalid.");
          error.length = ed.length;
          error.expected = k;
          throw error;
        }
        var y = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
        if (y.compareTo(key.n) >= 0) {
          throw new Error("Encrypted message is invalid.");
        }
        var x = _modPow(y, key, pub);
        var xhex = x.toString(16);
        var eb = forge.util.createBuffer();
        var zeros = k - Math.ceil(xhex.length / 2);
        while (zeros > 0) {
          eb.putByte(0);
          --zeros;
        }
        eb.putBytes(forge.util.hexToBytes(xhex));
        if (ml !== false) {
          return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
        }
        return eb.getBytes();
      };
      pki.rsa.createKeyPairGenerationState = function(bits, e, options) {
        if (typeof bits === "string") {
          bits = parseInt(bits, 10);
        }
        bits = bits || 2048;
        options = options || {};
        var prng = options.prng || forge.random;
        var rng = {
          // x is an array to fill with bytes
          nextBytes: function(x) {
            var b = prng.getBytesSync(x.length);
            for (var i = 0; i < x.length; ++i) {
              x[i] = b.charCodeAt(i);
            }
          }
        };
        var algorithm = options.algorithm || "PRIMEINC";
        var rval;
        if (algorithm === "PRIMEINC") {
          rval = {
            algorithm,
            state: 0,
            bits,
            rng,
            eInt: e || 65537,
            e: new BigInteger(null),
            p: null,
            q: null,
            qBits: bits >> 1,
            pBits: bits - (bits >> 1),
            pqState: 0,
            num: null,
            keys: null
          };
          rval.e.fromInt(rval.eInt);
        } else {
          throw new Error("Invalid key generation algorithm: " + algorithm);
        }
        return rval;
      };
      pki.rsa.stepKeyPairGenerationState = function(state, n) {
        if (!("algorithm" in state)) {
          state.algorithm = "PRIMEINC";
        }
        var THIRTY = new BigInteger(null);
        THIRTY.fromInt(30);
        var deltaIdx = 0;
        var op_or = function(x, y) {
          return x | y;
        };
        var t1 = +/* @__PURE__ */ new Date();
        var t2;
        var total = 0;
        while (state.keys === null && (n <= 0 || total < n)) {
          if (state.state === 0) {
            var bits = state.p === null ? state.pBits : state.qBits;
            var bits1 = bits - 1;
            if (state.pqState === 0) {
              state.num = new BigInteger(bits, state.rng);
              if (!state.num.testBit(bits1)) {
                state.num.bitwiseTo(
                  BigInteger.ONE.shiftLeft(bits1),
                  op_or,
                  state.num
                );
              }
              state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
              deltaIdx = 0;
              ++state.pqState;
            } else if (state.pqState === 1) {
              if (state.num.bitLength() > bits) {
                state.pqState = 0;
              } else if (state.num.isProbablePrime(
                _getMillerRabinTests(state.num.bitLength())
              )) {
                ++state.pqState;
              } else {
                state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
              }
            } else if (state.pqState === 2) {
              state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
            } else if (state.pqState === 3) {
              state.pqState = 0;
              if (state.p === null) {
                state.p = state.num;
              } else {
                state.q = state.num;
              }
              if (state.p !== null && state.q !== null) {
                ++state.state;
              }
              state.num = null;
            }
          } else if (state.state === 1) {
            if (state.p.compareTo(state.q) < 0) {
              state.num = state.p;
              state.p = state.q;
              state.q = state.num;
            }
            ++state.state;
          } else if (state.state === 2) {
            state.p1 = state.p.subtract(BigInteger.ONE);
            state.q1 = state.q.subtract(BigInteger.ONE);
            state.phi = state.p1.multiply(state.q1);
            ++state.state;
          } else if (state.state === 3) {
            if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
              ++state.state;
            } else {
              state.p = null;
              state.q = null;
              state.state = 0;
            }
          } else if (state.state === 4) {
            state.n = state.p.multiply(state.q);
            if (state.n.bitLength() === state.bits) {
              ++state.state;
            } else {
              state.q = null;
              state.state = 0;
            }
          } else if (state.state === 5) {
            var d = state.e.modInverse(state.phi);
            state.keys = {
              privateKey: pki.rsa.setPrivateKey(
                state.n,
                state.e,
                d,
                state.p,
                state.q,
                d.mod(state.p1),
                d.mod(state.q1),
                state.q.modInverse(state.p)
              ),
              publicKey: pki.rsa.setPublicKey(state.n, state.e)
            };
          }
          t2 = +/* @__PURE__ */ new Date();
          total += t2 - t1;
          t1 = t2;
        }
        return state.keys !== null;
      };
      pki.rsa.generateKeyPair = function(bits, e, options, callback) {
        if (arguments.length === 1) {
          if (typeof bits === "object") {
            options = bits;
            bits = void 0;
          } else if (typeof bits === "function") {
            callback = bits;
            bits = void 0;
          }
        } else if (arguments.length === 2) {
          if (typeof bits === "number") {
            if (typeof e === "function") {
              callback = e;
              e = void 0;
            } else if (typeof e !== "number") {
              options = e;
              e = void 0;
            }
          } else {
            options = bits;
            callback = e;
            bits = void 0;
            e = void 0;
          }
        } else if (arguments.length === 3) {
          if (typeof e === "number") {
            if (typeof options === "function") {
              callback = options;
              options = void 0;
            }
          } else {
            callback = options;
            options = e;
            e = void 0;
          }
        }
        options = options || {};
        if (bits === void 0) {
          bits = options.bits || 2048;
        }
        if (e === void 0) {
          e = options.e || 65537;
        }
        if (!forge.options.usePureJavaScript && !options.prng && bits >= 256 && bits <= 16384 && (e === 65537 || e === 3)) {
          if (callback) {
            if (_detectNodeCrypto("generateKeyPair")) {
              return _crypto.generateKeyPair("rsa", {
                modulusLength: bits,
                publicExponent: e,
                publicKeyEncoding: {
                  type: "spki",
                  format: "pem"
                },
                privateKeyEncoding: {
                  type: "pkcs8",
                  format: "pem"
                }
              }, function(err, pub, priv) {
                if (err) {
                  return callback(err);
                }
                callback(null, {
                  privateKey: pki.privateKeyFromPem(priv),
                  publicKey: pki.publicKeyFromPem(pub)
                });
              });
            }
            if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) {
              return util.globalScope.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: bits,
                publicExponent: _intToUint8Array(e),
                hash: { name: "SHA-256" }
              }, true, ["sign", "verify"]).then(function(pair) {
                return util.globalScope.crypto.subtle.exportKey(
                  "pkcs8",
                  pair.privateKey
                );
              }).then(void 0, function(err) {
                callback(err);
              }).then(function(pkcs8) {
                if (pkcs8) {
                  var privateKey = pki.privateKeyFromAsn1(
                    asn1.fromDer(forge.util.createBuffer(pkcs8))
                  );
                  callback(null, {
                    privateKey,
                    publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                  });
                }
              });
            }
            if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
              var genOp = util.globalScope.msCrypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: bits,
                publicExponent: _intToUint8Array(e),
                hash: { name: "SHA-256" }
              }, true, ["sign", "verify"]);
              genOp.oncomplete = function(e2) {
                var pair = e2.target.result;
                var exportOp = util.globalScope.msCrypto.subtle.exportKey(
                  "pkcs8",
                  pair.privateKey
                );
                exportOp.oncomplete = function(e3) {
                  var pkcs8 = e3.target.result;
                  var privateKey = pki.privateKeyFromAsn1(
                    asn1.fromDer(forge.util.createBuffer(pkcs8))
                  );
                  callback(null, {
                    privateKey,
                    publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
                  });
                };
                exportOp.onerror = function(err) {
                  callback(err);
                };
              };
              genOp.onerror = function(err) {
                callback(err);
              };
              return;
            }
          } else {
            if (_detectNodeCrypto("generateKeyPairSync")) {
              var keypair = _crypto.generateKeyPairSync("rsa", {
                modulusLength: bits,
                publicExponent: e,
                publicKeyEncoding: {
                  type: "spki",
                  format: "pem"
                },
                privateKeyEncoding: {
                  type: "pkcs8",
                  format: "pem"
                }
              });
              return {
                privateKey: pki.privateKeyFromPem(keypair.privateKey),
                publicKey: pki.publicKeyFromPem(keypair.publicKey)
              };
            }
          }
        }
        var state = pki.rsa.createKeyPairGenerationState(bits, e, options);
        if (!callback) {
          pki.rsa.stepKeyPairGenerationState(state, 0);
          return state.keys;
        }
        _generateKeyPair(state, options, callback);
      };
      pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n, e) {
        var key = {
          n,
          e
        };
        key.encrypt = function(data, scheme, schemeOptions) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSAES-PKCS1-V1_5";
          }
          if (scheme === "RSAES-PKCS1-V1_5") {
            scheme = {
              encode: function(m, key2, pub) {
                return _encodePkcs1_v1_5(m, key2, 2).getBytes();
              }
            };
          } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
            scheme = {
              encode: function(m, key2) {
                return forge.pkcs1.encode_rsa_oaep(key2, m, schemeOptions);
              }
            };
          } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
            scheme = { encode: function(e3) {
              return e3;
            } };
          } else if (typeof scheme === "string") {
            throw new Error('Unsupported encryption scheme: "' + scheme + '".');
          }
          var e2 = scheme.encode(data, key, true);
          return pki.rsa.encrypt(e2, key, true);
        };
        key.verify = function(digest, signature, scheme, options) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSASSA-PKCS1-V1_5";
          }
          if (options === void 0) {
            options = {
              _parseAllDigestBytes: true,
              _skipPaddingChecks: false
            };
          }
          if (!("_parseAllDigestBytes" in options)) {
            options._parseAllDigestBytes = true;
          }
          if (!("_skipPaddingChecks" in options)) {
            options._skipPaddingChecks = false;
          }
          if (scheme === "RSASSA-PKCS1-V1_5") {
            scheme = {
              verify: function(digest2, d2) {
                d2 = _decodePkcs1_v1_5(d2, key, true, void 0, options);
                var obj = asn1.fromDer(d2, {
                  parseAllBytes: options._parseAllDigestBytes
                });
                var capture = {};
                var errors = [];
                if (!asn1.validate(obj, digestInfoValidator, capture, errors) || obj.value.length !== 2) {
                  var error = new Error(
                    "ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value."
                  );
                  error.errors = errors;
                  throw error;
                }
                var oid = asn1.derToOid(capture.algorithmIdentifier);
                if (!(oid === forge.oids.md2 || oid === forge.oids.md5 || oid === forge.oids.sha1 || oid === forge.oids.sha224 || oid === forge.oids.sha256 || oid === forge.oids.sha384 || oid === forge.oids.sha512 || oid === forge.oids["sha512-224"] || oid === forge.oids["sha512-256"])) {
                  var error = new Error(
                    "Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier."
                  );
                  error.oid = oid;
                  throw error;
                }
                if (oid === forge.oids.md2 || oid === forge.oids.md5) {
                  if (!("parameters" in capture)) {
                    throw new Error(
                      "ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifier NULL parameters."
                    );
                  }
                }
                return digest2 === capture.digest;
              }
            };
          } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
            scheme = {
              verify: function(digest2, d2) {
                d2 = _decodePkcs1_v1_5(d2, key, true, void 0, options);
                return digest2 === d2;
              }
            };
          }
          var d = pki.rsa.decrypt(signature, key, true, false);
          return scheme.verify(digest, d, key.n.bitLength());
        };
        return key;
      };
      pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
        var key = {
          n,
          e,
          d,
          p,
          q,
          dP,
          dQ,
          qInv
        };
        key.decrypt = function(data, scheme, schemeOptions) {
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          } else if (scheme === void 0) {
            scheme = "RSAES-PKCS1-V1_5";
          }
          var d2 = pki.rsa.decrypt(data, key, false, false);
          if (scheme === "RSAES-PKCS1-V1_5") {
            scheme = { decode: _decodePkcs1_v1_5 };
          } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
            scheme = {
              decode: function(d3, key2) {
                return forge.pkcs1.decode_rsa_oaep(key2, d3, schemeOptions);
              }
            };
          } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
            scheme = { decode: function(d3) {
              return d3;
            } };
          } else {
            throw new Error('Unsupported encryption scheme: "' + scheme + '".');
          }
          return scheme.decode(d2, key, false);
        };
        key.sign = function(md, scheme) {
          var bt = false;
          if (typeof scheme === "string") {
            scheme = scheme.toUpperCase();
          }
          if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5") {
            scheme = { encode: emsaPkcs1v15encode };
            bt = 1;
          } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
            scheme = { encode: function() {
              return md;
            } };
            bt = 1;
          }
          var d2 = scheme.encode(md, key.n.bitLength());
          return pki.rsa.encrypt(d2, key, bt);
        };
        return key;
      };
      pki.wrapRsaPrivateKey = function(rsaKey) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version (0)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(0).getBytes()
          ),
          // privateKeyAlgorithm
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(pki.oids.rsaEncryption).getBytes()
            ),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          // PrivateKey
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            asn1.toDer(rsaKey).getBytes()
          )
        ]);
      };
      pki.privateKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        if (asn1.validate(obj, privateKeyValidator, capture, errors)) {
          obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
        }
        capture = {};
        errors = [];
        if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
          var error = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
          error.errors = errors;
          throw error;
        }
        var n, e, d, p, q, dP, dQ, qInv;
        n = forge.util.createBuffer(capture.privateKeyModulus).toHex();
        e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex();
        d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
        p = forge.util.createBuffer(capture.privateKeyPrime1).toHex();
        q = forge.util.createBuffer(capture.privateKeyPrime2).toHex();
        dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex();
        dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex();
        qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();
        return pki.setRsaPrivateKey(
          new BigInteger(n, 16),
          new BigInteger(e, 16),
          new BigInteger(d, 16),
          new BigInteger(p, 16),
          new BigInteger(q, 16),
          new BigInteger(dP, 16),
          new BigInteger(dQ, 16),
          new BigInteger(qInv, 16)
        );
      };
      pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version (0 = only 2 primes, 1 multiple primes)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(0).getBytes()
          ),
          // modulus (n)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.n)
          ),
          // publicExponent (e)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.e)
          ),
          // privateExponent (d)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.d)
          ),
          // privateKeyPrime1 (p)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.p)
          ),
          // privateKeyPrime2 (q)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.q)
          ),
          // privateKeyExponent1 (dP)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.dP)
          ),
          // privateKeyExponent2 (dQ)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.dQ)
          ),
          // coefficient (qInv)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.qInv)
          )
        ]);
      };
      pki.publicKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
          var oid = asn1.derToOid(capture.publicKeyOid);
          if (oid !== pki.oids.rsaEncryption) {
            var error = new Error("Cannot read public key. Unknown OID.");
            error.oid = oid;
            throw error;
          }
          obj = capture.rsaPublicKey;
        }
        errors = [];
        if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
          var error = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
          error.errors = errors;
          throw error;
        }
        var n = forge.util.createBuffer(capture.publicKeyModulus).toHex();
        var e = forge.util.createBuffer(capture.publicKeyExponent).toHex();
        return pki.setRsaPublicKey(
          new BigInteger(n, 16),
          new BigInteger(e, 16)
        );
      };
      pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // AlgorithmIdentifier
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(pki.oids.rsaEncryption).getBytes()
            ),
            // parameters (null)
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          // subjectPublicKey
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
            pki.publicKeyToRSAPublicKey(key)
          ])
        ]);
      };
      pki.publicKeyToRSAPublicKey = function(key) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // modulus (n)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.n)
          ),
          // publicExponent (e)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            _bnToBytes(key.e)
          )
        ]);
      };
      function _encodePkcs1_v1_5(m, key, bt) {
        var eb = forge.util.createBuffer();
        var k = Math.ceil(key.n.bitLength() / 8);
        if (m.length > k - 11) {
          var error = new Error("Message is too long for PKCS#1 v1.5 padding.");
          error.length = m.length;
          error.max = k - 11;
          throw error;
        }
        eb.putByte(0);
        eb.putByte(bt);
        var padNum = k - 3 - m.length;
        var padByte;
        if (bt === 0 || bt === 1) {
          padByte = bt === 0 ? 0 : 255;
          for (var i = 0; i < padNum; ++i) {
            eb.putByte(padByte);
          }
        } else {
          while (padNum > 0) {
            var numZeros = 0;
            var padBytes = forge.random.getBytes(padNum);
            for (var i = 0; i < padNum; ++i) {
              padByte = padBytes.charCodeAt(i);
              if (padByte === 0) {
                ++numZeros;
              } else {
                eb.putByte(padByte);
              }
            }
            padNum = numZeros;
          }
        }
        eb.putByte(0);
        eb.putBytes(m);
        return eb;
      }
      function _decodePkcs1_v1_5(em, key, pub, ml, options) {
        var k = Math.ceil(key.n.bitLength() / 8);
        var eb = forge.util.createBuffer(em);
        var first = eb.getByte();
        var bt = eb.getByte();
        if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt !== 2 || pub && bt === 0 && typeof ml === "undefined") {
          throw new Error("Encryption block is invalid.");
        }
        var padNum = 0;
        if (bt === 0) {
          padNum = k - 3 - ml;
          for (var i = 0; i < padNum; ++i) {
            if (eb.getByte() !== 0) {
              throw new Error("Encryption block is invalid.");
            }
          }
        } else if (bt === 1) {
          padNum = 0;
          while (eb.length() > 1) {
            if (eb.getByte() !== 255) {
              --eb.read;
              break;
            }
            ++padNum;
          }
          if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) {
            throw new Error("Encryption block is invalid.");
          }
        } else if (bt === 2) {
          padNum = 0;
          while (eb.length() > 1) {
            if (eb.getByte() === 0) {
              --eb.read;
              break;
            }
            ++padNum;
          }
          if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) {
            throw new Error("Encryption block is invalid.");
          }
        }
        var zero = eb.getByte();
        if (zero !== 0 || padNum !== k - 3 - eb.length()) {
          throw new Error("Encryption block is invalid.");
        }
        return eb.getBytes();
      }
      function _generateKeyPair(state, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options = options || {};
        var opts = {
          algorithm: {
            name: options.algorithm || "PRIMEINC",
            options: {
              workers: options.workers || 2,
              workLoad: options.workLoad || 100,
              workerScript: options.workerScript
            }
          }
        };
        if ("prng" in options) {
          opts.prng = options.prng;
        }
        generate();
        function generate() {
          getPrime(state.pBits, function(err, num) {
            if (err) {
              return callback(err);
            }
            state.p = num;
            if (state.q !== null) {
              return finish(err, state.q);
            }
            getPrime(state.qBits, finish);
          });
        }
        function getPrime(bits, callback2) {
          forge.prime.generateProbablePrime(bits, opts, callback2);
        }
        function finish(err, num) {
          if (err) {
            return callback(err);
          }
          state.q = num;
          if (state.p.compareTo(state.q) < 0) {
            var tmp = state.p;
            state.p = state.q;
            state.q = tmp;
          }
          if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.p = null;
            generate();
            return;
          }
          if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.q = null;
            getPrime(state.qBits, finish);
            return;
          }
          state.p1 = state.p.subtract(BigInteger.ONE);
          state.q1 = state.q.subtract(BigInteger.ONE);
          state.phi = state.p1.multiply(state.q1);
          if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
            state.p = state.q = null;
            generate();
            return;
          }
          state.n = state.p.multiply(state.q);
          if (state.n.bitLength() !== state.bits) {
            state.q = null;
            getPrime(state.qBits, finish);
            return;
          }
          var d = state.e.modInverse(state.phi);
          state.keys = {
            privateKey: pki.rsa.setPrivateKey(
              state.n,
              state.e,
              d,
              state.p,
              state.q,
              d.mod(state.p1),
              d.mod(state.q1),
              state.q.modInverse(state.p)
            ),
            publicKey: pki.rsa.setPublicKey(state.n, state.e)
          };
          callback(null, state.keys);
        }
      }
      function _bnToBytes(b) {
        var hex = b.toString(16);
        if (hex[0] >= "8") {
          hex = "00" + hex;
        }
        var bytes = forge.util.hexToBytes(hex);
        if (bytes.length > 1 && // leading 0x00 for positive integer
        (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || // leading 0xFF for negative integer
        bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128)) {
          return bytes.substr(1);
        }
        return bytes;
      }
      function _getMillerRabinTests(bits) {
        if (bits <= 100) return 27;
        if (bits <= 150) return 18;
        if (bits <= 200) return 15;
        if (bits <= 250) return 12;
        if (bits <= 300) return 9;
        if (bits <= 350) return 8;
        if (bits <= 400) return 7;
        if (bits <= 500) return 6;
        if (bits <= 600) return 5;
        if (bits <= 800) return 4;
        if (bits <= 1250) return 3;
        return 2;
      }
      function _detectNodeCrypto(fn) {
        return forge.util.isNodejs && typeof _crypto[fn] === "function";
      }
      function _detectSubtleCrypto(fn) {
        return typeof util.globalScope !== "undefined" && typeof util.globalScope.crypto === "object" && typeof util.globalScope.crypto.subtle === "object" && typeof util.globalScope.crypto.subtle[fn] === "function";
      }
      function _detectSubtleMsCrypto(fn) {
        return typeof util.globalScope !== "undefined" && typeof util.globalScope.msCrypto === "object" && typeof util.globalScope.msCrypto.subtle === "object" && typeof util.globalScope.msCrypto.subtle[fn] === "function";
      }
      function _intToUint8Array(x) {
        var bytes = forge.util.hexToBytes(x.toString(16));
        var buffer = new Uint8Array(bytes.length);
        for (var i = 0; i < bytes.length; ++i) {
          buffer[i] = bytes.charCodeAt(i);
        }
        return buffer;
      }
    }
  });

  // node_modules/node-forge/lib/pbe.js
  var require_pbe = __commonJS({
    "node_modules/node-forge/lib/pbe.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_asn12();
      require_des();
      require_md();
      require_oids();
      require_pbkdf22();
      require_pem();
      require_random();
      require_rc2();
      require_rsa();
      require_util();
      if (typeof BigInteger === "undefined") {
        BigInteger = forge.jsbn.BigInteger;
      }
      var BigInteger;
      var asn1 = forge.asn1;
      var pki = forge.pki = forge.pki || {};
      module.exports = pki.pbe = forge.pbe = forge.pbe || {};
      var oids = pki.oids;
      var encryptedPrivateKeyValidator = {
        name: "EncryptedPrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encryptionOid"
          }, {
            name: "AlgorithmIdentifier.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: "encryptionParams"
          }]
        }, {
          // encryptedData
          name: "EncryptedPrivateKeyInfo.encryptedData",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "encryptedData"
        }]
      };
      var PBES2AlgorithmsValidator = {
        name: "PBES2Algorithms",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.keyDerivationFunc",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PBES2Algorithms.keyDerivationFunc.oid",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "kdfOid"
          }, {
            name: "PBES2Algorithms.params",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: "PBES2Algorithms.params.salt",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OCTETSTRING,
              constructed: false,
              capture: "kdfSalt"
            }, {
              name: "PBES2Algorithms.params.iterationCount",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              capture: "kdfIterationCount"
            }, {
              name: "PBES2Algorithms.params.keyLength",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              optional: true,
              capture: "keyLength"
            }, {
              // prf
              name: "PBES2Algorithms.params.prf",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              optional: true,
              value: [{
                name: "PBES2Algorithms.params.prf.algorithm",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OID,
                constructed: false,
                capture: "prfOid"
              }]
            }]
          }]
        }, {
          name: "PBES2Algorithms.encryptionScheme",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PBES2Algorithms.encryptionScheme.oid",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encOid"
          }, {
            name: "PBES2Algorithms.encryptionScheme.iv",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: "encIv"
          }]
        }]
      };
      var pkcs12PbeParamsValidator = {
        name: "pkcs-12PbeParams",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "pkcs-12PbeParams.salt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "salt"
        }, {
          name: "pkcs-12PbeParams.iterations",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "iterations"
        }]
      };
      pki.encryptPrivateKeyInfo = function(obj, password, options) {
        options = options || {};
        options.saltSize = options.saltSize || 8;
        options.count = options.count || 2048;
        options.algorithm = options.algorithm || "aes128";
        options.prfAlgorithm = options.prfAlgorithm || "sha1";
        var salt = forge.random.getBytesSync(options.saltSize);
        var count = options.count;
        var countBytes = asn1.integerToDer(count);
        var dkLen;
        var encryptionAlgorithm;
        var encryptedData;
        if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
          var ivLen, encOid, cipherFn;
          switch (options.algorithm) {
            case "aes128":
              dkLen = 16;
              ivLen = 16;
              encOid = oids["aes128-CBC"];
              cipherFn = forge.aes.createEncryptionCipher;
              break;
            case "aes192":
              dkLen = 24;
              ivLen = 16;
              encOid = oids["aes192-CBC"];
              cipherFn = forge.aes.createEncryptionCipher;
              break;
            case "aes256":
              dkLen = 32;
              ivLen = 16;
              encOid = oids["aes256-CBC"];
              cipherFn = forge.aes.createEncryptionCipher;
              break;
            case "des":
              dkLen = 8;
              ivLen = 8;
              encOid = oids["desCBC"];
              cipherFn = forge.des.createEncryptionCipher;
              break;
            default:
              var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
              error.algorithm = options.algorithm;
              throw error;
          }
          var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
          var md = prfAlgorithmToMessageDigest(prfAlgorithm);
          var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
          var iv = forge.random.getBytesSync(ivLen);
          var cipher = cipherFn(dk);
          cipher.start(iv);
          cipher.update(asn1.toDer(obj));
          cipher.finish();
          encryptedData = cipher.output.getBytes();
          var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
          encryptionAlgorithm = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()
              ),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // keyDerivationFunc
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OID,
                    false,
                    asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()
                  ),
                  // PBKDF2-params
                  params
                ]),
                // encryptionScheme
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OID,
                    false,
                    asn1.oidToDer(encOid).getBytes()
                  ),
                  // iv
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OCTETSTRING,
                    false,
                    iv
                  )
                ])
              ])
            ]
          );
        } else if (options.algorithm === "3des") {
          dkLen = 24;
          var saltBytes = new forge.util.ByteBuffer(salt);
          var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
          var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
          var cipher = forge.des.createEncryptionCipher(dk);
          cipher.start(iv);
          cipher.update(asn1.toDer(obj));
          cipher.finish();
          encryptedData = cipher.output.getBytes();
          encryptionAlgorithm = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()
              ),
              // pkcs-12PbeParams
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // salt
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
                // iteration count
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.INTEGER,
                  false,
                  countBytes.getBytes()
                )
              ])
            ]
          );
        } else {
          var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
          error.algorithm = options.algorithm;
          throw error;
        }
        var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // encryptionAlgorithm
          encryptionAlgorithm,
          // encryptedData
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            encryptedData
          )
        ]);
        return rval;
      };
      pki.decryptPrivateKeyInfo = function(obj, password) {
        var rval = null;
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
          var error = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.encryptionOid);
        var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
        var encrypted = forge.util.createBuffer(capture.encryptedData);
        cipher.update(encrypted);
        if (cipher.finish()) {
          rval = asn1.fromDer(cipher.output);
        }
        return rval;
      };
      pki.encryptedPrivateKeyToPem = function(epki, maxline) {
        var msg = {
          type: "ENCRYPTED PRIVATE KEY",
          body: asn1.toDer(epki).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.encryptedPrivateKeyFromPem = function(pem) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "ENCRYPTED PRIVATE KEY") {
          var error = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
        }
        return asn1.fromDer(msg.body);
      };
      pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
        options = options || {};
        if (!options.legacy) {
          var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
          rval = pki.encryptPrivateKeyInfo(rval, password, options);
          return pki.encryptedPrivateKeyToPem(rval);
        }
        var algorithm;
        var iv;
        var dkLen;
        var cipherFn;
        switch (options.algorithm) {
          case "aes128":
            algorithm = "AES-128-CBC";
            dkLen = 16;
            iv = forge.random.getBytesSync(16);
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "aes192":
            algorithm = "AES-192-CBC";
            dkLen = 24;
            iv = forge.random.getBytesSync(16);
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "aes256":
            algorithm = "AES-256-CBC";
            dkLen = 32;
            iv = forge.random.getBytesSync(16);
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case "3des":
            algorithm = "DES-EDE3-CBC";
            dkLen = 24;
            iv = forge.random.getBytesSync(8);
            cipherFn = forge.des.createEncryptionCipher;
            break;
          case "des":
            algorithm = "DES-CBC";
            dkLen = 8;
            iv = forge.random.getBytesSync(8);
            cipherFn = forge.des.createEncryptionCipher;
            break;
          default:
            var error = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + options.algorithm + '".');
            error.algorithm = options.algorithm;
            throw error;
        }
        var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
        cipher.finish();
        var msg = {
          type: "RSA PRIVATE KEY",
          procType: {
            version: "4",
            type: "ENCRYPTED"
          },
          dekInfo: {
            algorithm,
            parameters: forge.util.bytesToHex(iv).toUpperCase()
          },
          body: cipher.output.getBytes()
        };
        return forge.pem.encode(msg);
      };
      pki.decryptRsaPrivateKey = function(pem, password) {
        var rval = null;
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
          var error = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
          error.headerType = error;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          var dkLen;
          var cipherFn;
          switch (msg.dekInfo.algorithm) {
            case "DES-CBC":
              dkLen = 8;
              cipherFn = forge.des.createDecryptionCipher;
              break;
            case "DES-EDE3-CBC":
              dkLen = 24;
              cipherFn = forge.des.createDecryptionCipher;
              break;
            case "AES-128-CBC":
              dkLen = 16;
              cipherFn = forge.aes.createDecryptionCipher;
              break;
            case "AES-192-CBC":
              dkLen = 24;
              cipherFn = forge.aes.createDecryptionCipher;
              break;
            case "AES-256-CBC":
              dkLen = 32;
              cipherFn = forge.aes.createDecryptionCipher;
              break;
            case "RC2-40-CBC":
              dkLen = 5;
              cipherFn = function(key) {
                return forge.rc2.createDecryptionCipher(key, 40);
              };
              break;
            case "RC2-64-CBC":
              dkLen = 8;
              cipherFn = function(key) {
                return forge.rc2.createDecryptionCipher(key, 64);
              };
              break;
            case "RC2-128-CBC":
              dkLen = 16;
              cipherFn = function(key) {
                return forge.rc2.createDecryptionCipher(key, 128);
              };
              break;
            default:
              var error = new Error('Could not decrypt private key; unsupported encryption algorithm "' + msg.dekInfo.algorithm + '".');
              error.algorithm = msg.dekInfo.algorithm;
              throw error;
          }
          var iv = forge.util.hexToBytes(msg.dekInfo.parameters);
          var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
          var cipher = cipherFn(dk);
          cipher.start(iv);
          cipher.update(forge.util.createBuffer(msg.body));
          if (cipher.finish()) {
            rval = cipher.output.getBytes();
          } else {
            return rval;
          }
        } else {
          rval = msg.body;
        }
        if (msg.type === "ENCRYPTED PRIVATE KEY") {
          rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
        } else {
          rval = asn1.fromDer(rval);
        }
        if (rval !== null) {
          rval = pki.privateKeyFromAsn1(rval);
        }
        return rval;
      };
      pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
        var j, l;
        if (typeof md === "undefined" || md === null) {
          if (!("sha1" in forge.md)) {
            throw new Error('"sha1" hash algorithm unavailable.');
          }
          md = forge.md.sha1.create();
        }
        var u = md.digestLength;
        var v = md.blockLength;
        var result = new forge.util.ByteBuffer();
        var passBuf = new forge.util.ByteBuffer();
        if (password !== null && password !== void 0) {
          for (l = 0; l < password.length; l++) {
            passBuf.putInt16(password.charCodeAt(l));
          }
          passBuf.putInt16(0);
        }
        var p = passBuf.length();
        var s = salt.length();
        var D = new forge.util.ByteBuffer();
        D.fillWithByte(id, v);
        var Slen = v * Math.ceil(s / v);
        var S = new forge.util.ByteBuffer();
        for (l = 0; l < Slen; l++) {
          S.putByte(salt.at(l % s));
        }
        var Plen = v * Math.ceil(p / v);
        var P = new forge.util.ByteBuffer();
        for (l = 0; l < Plen; l++) {
          P.putByte(passBuf.at(l % p));
        }
        var I = S;
        I.putBuffer(P);
        var c = Math.ceil(n / u);
        for (var i = 1; i <= c; i++) {
          var buf = new forge.util.ByteBuffer();
          buf.putBytes(D.bytes());
          buf.putBytes(I.bytes());
          for (var round = 0; round < iter; round++) {
            md.start();
            md.update(buf.getBytes());
            buf = md.digest();
          }
          var B = new forge.util.ByteBuffer();
          for (l = 0; l < v; l++) {
            B.putByte(buf.at(l % u));
          }
          var k = Math.ceil(s / v) + Math.ceil(p / v);
          var Inew = new forge.util.ByteBuffer();
          for (j = 0; j < k; j++) {
            var chunk = new forge.util.ByteBuffer(I.getBytes(v));
            var x = 511;
            for (l = B.length() - 1; l >= 0; l--) {
              x = x >> 8;
              x += B.at(l) + chunk.at(l);
              chunk.setAt(l, x & 255);
            }
            Inew.putBuffer(chunk);
          }
          I = Inew;
          result.putBuffer(buf);
        }
        result.truncate(result.length() - n);
        return result;
      };
      pki.pbe.getCipher = function(oid, params, password) {
        switch (oid) {
          case pki.oids["pkcs5PBES2"]:
            return pki.pbe.getCipherForPBES2(oid, params, password);
          case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
          case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
            return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
          default:
            var error = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
            error.oid = oid;
            error.supportedOids = [
              "pkcs5PBES2",
              "pbeWithSHAAnd3-KeyTripleDES-CBC",
              "pbewithSHAAnd40BitRC2-CBC"
            ];
            throw error;
        }
      };
      pki.pbe.getCipherForPBES2 = function(oid, params, password) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
          var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        oid = asn1.derToOid(capture.kdfOid);
        if (oid !== pki.oids["pkcs5PBKDF2"]) {
          var error = new Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
          error.oid = oid;
          error.supportedOids = ["pkcs5PBKDF2"];
          throw error;
        }
        oid = asn1.derToOid(capture.encOid);
        if (oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids["desCBC"]) {
          var error = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
          error.oid = oid;
          error.supportedOids = [
            "aes128-CBC",
            "aes192-CBC",
            "aes256-CBC",
            "des-EDE3-CBC",
            "desCBC"
          ];
          throw error;
        }
        var salt = capture.kdfSalt;
        var count = forge.util.createBuffer(capture.kdfIterationCount);
        count = count.getInt(count.length() << 3);
        var dkLen;
        var cipherFn;
        switch (pki.oids[oid]) {
          case "aes128-CBC":
            dkLen = 16;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "aes192-CBC":
            dkLen = 24;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "aes256-CBC":
            dkLen = 32;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case "des-EDE3-CBC":
            dkLen = 24;
            cipherFn = forge.des.createDecryptionCipher;
            break;
          case "desCBC":
            dkLen = 8;
            cipherFn = forge.des.createDecryptionCipher;
            break;
        }
        var md = prfOidToMessageDigest(capture.prfOid);
        var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
        var iv = capture.encIv;
        var cipher = cipherFn(dk);
        cipher.start(iv);
        return cipher;
      };
      pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
          var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
          error.errors = errors;
          throw error;
        }
        var salt = forge.util.createBuffer(capture.salt);
        var count = forge.util.createBuffer(capture.iterations);
        count = count.getInt(count.length() << 3);
        var dkLen, dIvLen, cipherFn;
        switch (oid) {
          case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
            dkLen = 24;
            dIvLen = 8;
            cipherFn = forge.des.startDecrypting;
            break;
          case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
            dkLen = 5;
            dIvLen = 8;
            cipherFn = function(key2, iv2) {
              var cipher = forge.rc2.createDecryptionCipher(key2, 40);
              cipher.start(iv2, null);
              return cipher;
            };
            break;
          default:
            var error = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
            error.oid = oid;
            throw error;
        }
        var md = prfOidToMessageDigest(capture.prfOid);
        var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
        md.start();
        var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
        return cipherFn(key, iv);
      };
      pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
        if (typeof md === "undefined" || md === null) {
          if (!("md5" in forge.md)) {
            throw new Error('"md5" hash algorithm unavailable.');
          }
          md = forge.md.md5.create();
        }
        if (salt === null) {
          salt = "";
        }
        var digests = [hash(md, password + salt)];
        for (var length = 16, i = 1; length < dkLen; ++i, length += 16) {
          digests.push(hash(md, digests[i - 1] + password + salt));
        }
        return digests.join("").substr(0, dkLen);
      };
      function hash(md, bytes) {
        return md.start().update(bytes).digest().getBytes();
      }
      function prfOidToMessageDigest(prfOid) {
        var prfAlgorithm;
        if (!prfOid) {
          prfAlgorithm = "hmacWithSHA1";
        } else {
          prfAlgorithm = pki.oids[asn1.derToOid(prfOid)];
          if (!prfAlgorithm) {
            var error = new Error("Unsupported PRF OID.");
            error.oid = prfOid;
            error.supported = [
              "hmacWithSHA1",
              "hmacWithSHA224",
              "hmacWithSHA256",
              "hmacWithSHA384",
              "hmacWithSHA512"
            ];
            throw error;
          }
        }
        return prfAlgorithmToMessageDigest(prfAlgorithm);
      }
      function prfAlgorithmToMessageDigest(prfAlgorithm) {
        var factory = forge.md;
        switch (prfAlgorithm) {
          case "hmacWithSHA224":
            factory = forge.md.sha512;
          case "hmacWithSHA1":
          case "hmacWithSHA256":
          case "hmacWithSHA384":
          case "hmacWithSHA512":
            prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
            break;
          default:
            var error = new Error("Unsupported PRF algorithm.");
            error.algorithm = prfAlgorithm;
            error.supported = [
              "hmacWithSHA1",
              "hmacWithSHA224",
              "hmacWithSHA256",
              "hmacWithSHA384",
              "hmacWithSHA512"
            ];
            throw error;
        }
        if (!factory || !(prfAlgorithm in factory)) {
          throw new Error("Unknown hash algorithm: " + prfAlgorithm);
        }
        return factory[prfAlgorithm].create();
      }
      function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
        var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // salt
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            salt
          ),
          // iteration count
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            countBytes.getBytes()
          )
        ]);
        if (prfAlgorithm !== "hmacWithSHA1") {
          params.value.push(
            // key length
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              forge.util.hexToBytes(dkLen.toString(16))
            ),
            // AlgorithmIdentifier
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // algorithm
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()
              ),
              // parameters (null)
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
            ])
          );
        }
        return params;
      }
    }
  });

  // node_modules/node-forge/lib/pkcs7asn1.js
  var require_pkcs7asn1 = __commonJS({
    "node_modules/node-forge/lib/pkcs7asn1.js"(exports, module) {
      var forge = require_forge();
      require_asn12();
      require_util();
      var asn1 = forge.asn1;
      var p7v = module.exports = forge.pkcs7asn1 = forge.pkcs7asn1 || {};
      forge.pkcs7 = forge.pkcs7 || {};
      forge.pkcs7.asn1 = p7v;
      var contentInfoValidator = {
        name: "ContentInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "ContentInfo.ContentType",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "contentType"
        }, {
          name: "ContentInfo.content",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          optional: true,
          captureAsn1: "content"
        }]
      };
      p7v.contentInfoValidator = contentInfoValidator;
      var encryptedContentInfoValidator = {
        name: "EncryptedContentInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "EncryptedContentInfo.contentType",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "contentType"
        }, {
          name: "EncryptedContentInfo.contentEncryptionAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encAlgorithm"
          }, {
            name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
            tagClass: asn1.Class.UNIVERSAL,
            captureAsn1: "encParameter"
          }]
        }, {
          name: "EncryptedContentInfo.encryptedContent",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          /* The PKCS#7 structure output by OpenSSL somewhat differs from what
           * other implementations do generate.
           *
           * OpenSSL generates a structure like this:
           * SEQUENCE {
           *    ...
           *    [0]
           *       26 DA 67 D2 17 9C 45 3C B1 2A A8 59 2F 29 33 38
           *       C3 C3 DF 86 71 74 7A 19 9F 40 D0 29 BE 85 90 45
           *       ...
           * }
           *
           * Whereas other implementations (and this PKCS#7 module) generate:
           * SEQUENCE {
           *    ...
           *    [0] {
           *       OCTET STRING
           *          26 DA 67 D2 17 9C 45 3C B1 2A A8 59 2F 29 33 38
           *          C3 C3 DF 86 71 74 7A 19 9F 40 D0 29 BE 85 90 45
           *          ...
           *    }
           * }
           *
           * In order to support both, we just capture the context specific
           * field here.  The OCTET STRING bit is removed below.
           */
          capture: "encryptedContent",
          captureAsn1: "encryptedContentAsn1"
        }]
      };
      p7v.envelopedDataValidator = {
        name: "EnvelopedData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "EnvelopedData.Version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "version"
        }, {
          name: "EnvelopedData.RecipientInfos",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SET,
          constructed: true,
          captureAsn1: "recipientInfos"
        }].concat(encryptedContentInfoValidator)
      };
      p7v.encryptedDataValidator = {
        name: "EncryptedData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "EncryptedData.Version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "version"
        }].concat(encryptedContentInfoValidator)
      };
      var signerValidator = {
        name: "SignerInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "SignerInfo.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false
        }, {
          name: "SignerInfo.issuerAndSerialNumber",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "SignerInfo.issuerAndSerialNumber.issuer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: "issuer"
          }, {
            name: "SignerInfo.issuerAndSerialNumber.serialNumber",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "serial"
          }]
        }, {
          name: "SignerInfo.digestAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "SignerInfo.digestAlgorithm.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "digestAlgorithm"
          }, {
            name: "SignerInfo.digestAlgorithm.parameter",
            tagClass: asn1.Class.UNIVERSAL,
            constructed: false,
            captureAsn1: "digestParameter",
            optional: true
          }]
        }, {
          name: "SignerInfo.authenticatedAttributes",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          optional: true,
          capture: "authenticatedAttributes"
        }, {
          name: "SignerInfo.digestEncryptionAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          capture: "signatureAlgorithm"
        }, {
          name: "SignerInfo.encryptedDigest",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "signature"
        }, {
          name: "SignerInfo.unauthenticatedAttributes",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: true,
          optional: true,
          capture: "unauthenticatedAttributes"
        }]
      };
      p7v.signedDataValidator = {
        name: "SignedData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
          {
            name: "SignedData.Version",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "version"
          },
          {
            name: "SignedData.DigestAlgorithms",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            constructed: true,
            captureAsn1: "digestAlgorithms"
          },
          contentInfoValidator,
          {
            name: "SignedData.Certificates",
            tagClass: asn1.Class.CONTEXT_SPECIFIC,
            type: 0,
            optional: true,
            captureAsn1: "certificates"
          },
          {
            name: "SignedData.CertificateRevocationLists",
            tagClass: asn1.Class.CONTEXT_SPECIFIC,
            type: 1,
            optional: true,
            captureAsn1: "crls"
          },
          {
            name: "SignedData.SignerInfos",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            capture: "signerInfos",
            optional: true,
            value: [signerValidator]
          }
        ]
      };
      p7v.recipientInfoValidator = {
        name: "RecipientInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "RecipientInfo.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "version"
        }, {
          name: "RecipientInfo.issuerAndSerial",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "RecipientInfo.issuerAndSerial.issuer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: "issuer"
          }, {
            name: "RecipientInfo.issuerAndSerial.serialNumber",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "serial"
          }]
        }, {
          name: "RecipientInfo.keyEncryptionAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "encAlgorithm"
          }, {
            name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
            tagClass: asn1.Class.UNIVERSAL,
            constructed: false,
            captureAsn1: "encParameter",
            optional: true
          }]
        }, {
          name: "RecipientInfo.encryptedKey",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "encKey"
        }]
      };
    }
  });

  // node_modules/node-forge/lib/mgf1.js
  var require_mgf1 = __commonJS({
    "node_modules/node-forge/lib/mgf1.js"(exports, module) {
      var forge = require_forge();
      require_util();
      forge.mgf = forge.mgf || {};
      var mgf1 = module.exports = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};
      mgf1.create = function(md) {
        var mgf = {
          /**
           * Generate mask of specified length.
           *
           * @param {String} seed The seed for mask generation.
           * @param maskLen Number of bytes to generate.
           * @return {String} The generated mask.
           */
          generate: function(seed, maskLen) {
            var t = new forge.util.ByteBuffer();
            var len = Math.ceil(maskLen / md.digestLength);
            for (var i = 0; i < len; i++) {
              var c = new forge.util.ByteBuffer();
              c.putInt32(i);
              md.start();
              md.update(seed + c.getBytes());
              t.putBuffer(md.digest());
            }
            t.truncate(t.length() - maskLen);
            return t.getBytes();
          }
        };
        return mgf;
      };
    }
  });

  // node_modules/node-forge/lib/mgf.js
  var require_mgf = __commonJS({
    "node_modules/node-forge/lib/mgf.js"(exports, module) {
      var forge = require_forge();
      require_mgf1();
      module.exports = forge.mgf = forge.mgf || {};
      forge.mgf.mgf1 = forge.mgf1;
    }
  });

  // node_modules/node-forge/lib/pss.js
  var require_pss = __commonJS({
    "node_modules/node-forge/lib/pss.js"(exports, module) {
      var forge = require_forge();
      require_random();
      require_util();
      var pss = module.exports = forge.pss = forge.pss || {};
      pss.create = function(options) {
        if (arguments.length === 3) {
          options = {
            md: arguments[0],
            mgf: arguments[1],
            saltLength: arguments[2]
          };
        }
        var hash = options.md;
        var mgf = options.mgf;
        var hLen = hash.digestLength;
        var salt_ = options.salt || null;
        if (typeof salt_ === "string") {
          salt_ = forge.util.createBuffer(salt_);
        }
        var sLen;
        if ("saltLength" in options) {
          sLen = options.saltLength;
        } else if (salt_ !== null) {
          sLen = salt_.length();
        } else {
          throw new Error("Salt length not specified or specific salt not given.");
        }
        if (salt_ !== null && salt_.length() !== sLen) {
          throw new Error("Given salt length does not match length of given salt.");
        }
        var prng = options.prng || forge.random;
        var pssobj = {};
        pssobj.encode = function(md, modBits) {
          var i;
          var emBits = modBits - 1;
          var emLen = Math.ceil(emBits / 8);
          var mHash = md.digest().getBytes();
          if (emLen < hLen + sLen + 2) {
            throw new Error("Message is too long to encrypt.");
          }
          var salt;
          if (salt_ === null) {
            salt = prng.getBytesSync(sLen);
          } else {
            salt = salt_.bytes();
          }
          var m_ = new forge.util.ByteBuffer();
          m_.fillWithByte(0, 8);
          m_.putBytes(mHash);
          m_.putBytes(salt);
          hash.start();
          hash.update(m_.getBytes());
          var h = hash.digest().getBytes();
          var ps = new forge.util.ByteBuffer();
          ps.fillWithByte(0, emLen - sLen - hLen - 2);
          ps.putByte(1);
          ps.putBytes(salt);
          var db = ps.getBytes();
          var maskLen = emLen - hLen - 1;
          var dbMask = mgf.generate(h, maskLen);
          var maskedDB = "";
          for (i = 0; i < maskLen; i++) {
            maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
          }
          var mask = 65280 >> 8 * emLen - emBits & 255;
          maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1);
          return maskedDB + h + String.fromCharCode(188);
        };
        pssobj.verify = function(mHash, em, modBits) {
          var i;
          var emBits = modBits - 1;
          var emLen = Math.ceil(emBits / 8);
          em = em.substr(-emLen);
          if (emLen < hLen + sLen + 2) {
            throw new Error("Inconsistent parameters to PSS signature verification.");
          }
          if (em.charCodeAt(emLen - 1) !== 188) {
            throw new Error("Encoded message does not end in 0xBC.");
          }
          var maskLen = emLen - hLen - 1;
          var maskedDB = em.substr(0, maskLen);
          var h = em.substr(maskLen, hLen);
          var mask = 65280 >> 8 * emLen - emBits & 255;
          if ((maskedDB.charCodeAt(0) & mask) !== 0) {
            throw new Error("Bits beyond keysize not zero as expected.");
          }
          var dbMask = mgf.generate(h, maskLen);
          var db = "";
          for (i = 0; i < maskLen; i++) {
            db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
          }
          db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
          var checkLen = emLen - hLen - sLen - 2;
          for (i = 0; i < checkLen; i++) {
            if (db.charCodeAt(i) !== 0) {
              throw new Error("Leftmost octets not zero as expected");
            }
          }
          if (db.charCodeAt(checkLen) !== 1) {
            throw new Error("Inconsistent PSS signature, 0x01 marker not found");
          }
          var salt = db.substr(-sLen);
          var m_ = new forge.util.ByteBuffer();
          m_.fillWithByte(0, 8);
          m_.putBytes(mHash);
          m_.putBytes(salt);
          hash.start();
          hash.update(m_.getBytes());
          var h_ = hash.digest().getBytes();
          return h === h_;
        };
        return pssobj;
      };
    }
  });

  // node_modules/node-forge/lib/x509.js
  var require_x509 = __commonJS({
    "node_modules/node-forge/lib/x509.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_asn12();
      require_des();
      require_md();
      require_mgf();
      require_oids();
      require_pem();
      require_pss();
      require_rsa();
      require_util();
      var asn1 = forge.asn1;
      var pki = module.exports = forge.pki = forge.pki || {};
      var oids = pki.oids;
      var _shortNames = {};
      _shortNames["CN"] = oids["commonName"];
      _shortNames["commonName"] = "CN";
      _shortNames["C"] = oids["countryName"];
      _shortNames["countryName"] = "C";
      _shortNames["L"] = oids["localityName"];
      _shortNames["localityName"] = "L";
      _shortNames["ST"] = oids["stateOrProvinceName"];
      _shortNames["stateOrProvinceName"] = "ST";
      _shortNames["O"] = oids["organizationName"];
      _shortNames["organizationName"] = "O";
      _shortNames["OU"] = oids["organizationalUnitName"];
      _shortNames["organizationalUnitName"] = "OU";
      _shortNames["E"] = oids["emailAddress"];
      _shortNames["emailAddress"] = "E";
      var publicKeyValidator = forge.pki.rsa.publicKeyValidator;
      var x509CertificateValidator = {
        name: "Certificate",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "Certificate.TBSCertificate",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "tbsCertificate",
          value: [
            {
              name: "Certificate.TBSCertificate.version",
              tagClass: asn1.Class.CONTEXT_SPECIFIC,
              type: 0,
              constructed: true,
              optional: true,
              value: [{
                name: "Certificate.TBSCertificate.version.integer",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.INTEGER,
                constructed: false,
                capture: "certVersion"
              }]
            },
            {
              name: "Certificate.TBSCertificate.serialNumber",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              capture: "certSerialNumber"
            },
            {
              name: "Certificate.TBSCertificate.signature",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              value: [{
                name: "Certificate.TBSCertificate.signature.algorithm",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OID,
                constructed: false,
                capture: "certinfoSignatureOid"
              }, {
                name: "Certificate.TBSCertificate.signature.parameters",
                tagClass: asn1.Class.UNIVERSAL,
                optional: true,
                captureAsn1: "certinfoSignatureParams"
              }]
            },
            {
              name: "Certificate.TBSCertificate.issuer",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              captureAsn1: "certIssuer"
            },
            {
              name: "Certificate.TBSCertificate.validity",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              // Note: UTC and generalized times may both appear so the capture
              // names are based on their detected order, the names used below
              // are only for the common case, which validity time really means
              // "notBefore" and which means "notAfter" will be determined by order
              value: [{
                // notBefore (Time) (UTC time case)
                name: "Certificate.TBSCertificate.validity.notBefore (utc)",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.UTCTIME,
                constructed: false,
                optional: true,
                capture: "certValidity1UTCTime"
              }, {
                // notBefore (Time) (generalized time case)
                name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.GENERALIZEDTIME,
                constructed: false,
                optional: true,
                capture: "certValidity2GeneralizedTime"
              }, {
                // notAfter (Time) (only UTC time is supported)
                name: "Certificate.TBSCertificate.validity.notAfter (utc)",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.UTCTIME,
                constructed: false,
                optional: true,
                capture: "certValidity3UTCTime"
              }, {
                // notAfter (Time) (only UTC time is supported)
                name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.GENERALIZEDTIME,
                constructed: false,
                optional: true,
                capture: "certValidity4GeneralizedTime"
              }]
            },
            {
              // Name (subject) (RDNSequence)
              name: "Certificate.TBSCertificate.subject",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              captureAsn1: "certSubject"
            },
            // SubjectPublicKeyInfo
            publicKeyValidator,
            {
              // issuerUniqueID (optional)
              name: "Certificate.TBSCertificate.issuerUniqueID",
              tagClass: asn1.Class.CONTEXT_SPECIFIC,
              type: 1,
              constructed: true,
              optional: true,
              value: [{
                name: "Certificate.TBSCertificate.issuerUniqueID.id",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.BITSTRING,
                constructed: false,
                // TODO: support arbitrary bit length ids
                captureBitStringValue: "certIssuerUniqueId"
              }]
            },
            {
              // subjectUniqueID (optional)
              name: "Certificate.TBSCertificate.subjectUniqueID",
              tagClass: asn1.Class.CONTEXT_SPECIFIC,
              type: 2,
              constructed: true,
              optional: true,
              value: [{
                name: "Certificate.TBSCertificate.subjectUniqueID.id",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.BITSTRING,
                constructed: false,
                // TODO: support arbitrary bit length ids
                captureBitStringValue: "certSubjectUniqueId"
              }]
            },
            {
              // Extensions (optional)
              name: "Certificate.TBSCertificate.extensions",
              tagClass: asn1.Class.CONTEXT_SPECIFIC,
              type: 3,
              constructed: true,
              captureAsn1: "certExtensions",
              optional: true
            }
          ]
        }, {
          // AlgorithmIdentifier (signature algorithm)
          name: "Certificate.signatureAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            // algorithm
            name: "Certificate.signatureAlgorithm.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "certSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            optional: true,
            captureAsn1: "certSignatureParams"
          }]
        }, {
          // SignatureValue
          name: "Certificate.signatureValue",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.BITSTRING,
          constructed: false,
          captureBitStringValue: "certSignature"
        }]
      };
      var rsassaPssParameterValidator = {
        name: "rsapss",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "rsapss.hashAlgorithm",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          value: [{
            name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Class.SEQUENCE,
            constructed: true,
            optional: true,
            value: [{
              name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "hashOid"
              /* parameter block omitted, for SHA1 NULL anyhow. */
            }]
          }]
        }, {
          name: "rsapss.maskGenAlgorithm",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: true,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Class.SEQUENCE,
            constructed: true,
            optional: true,
            value: [{
              name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "maskGenOid"
            }, {
              name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              value: [{
                name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OID,
                constructed: false,
                capture: "maskGenHashOid"
                /* parameter block omitted, for SHA1 NULL anyhow. */
              }]
            }]
          }]
        }, {
          name: "rsapss.saltLength",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 2,
          optional: true,
          value: [{
            name: "rsapss.saltLength.saltLength",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Class.INTEGER,
            constructed: false,
            capture: "saltLength"
          }]
        }, {
          name: "rsapss.trailerField",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 3,
          optional: true,
          value: [{
            name: "rsapss.trailer.trailer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Class.INTEGER,
            constructed: false,
            capture: "trailer"
          }]
        }]
      };
      var certificationRequestInfoValidator = {
        name: "CertificationRequestInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "certificationRequestInfo",
        value: [
          {
            name: "CertificationRequestInfo.integer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "certificationRequestInfoVersion"
          },
          {
            // Name (subject) (RDNSequence)
            name: "CertificationRequestInfo.subject",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: "certificationRequestInfoSubject"
          },
          // SubjectPublicKeyInfo
          publicKeyValidator,
          {
            name: "CertificationRequestInfo.attributes",
            tagClass: asn1.Class.CONTEXT_SPECIFIC,
            type: 0,
            constructed: true,
            optional: true,
            capture: "certificationRequestInfoAttributes",
            value: [{
              name: "CertificationRequestInfo.attributes",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              value: [{
                name: "CertificationRequestInfo.attributes.type",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OID,
                constructed: false
              }, {
                name: "CertificationRequestInfo.attributes.value",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SET,
                constructed: true
              }]
            }]
          }
        ]
      };
      var certificationRequestValidator = {
        name: "CertificationRequest",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "csr",
        value: [
          certificationRequestInfoValidator,
          {
            // AlgorithmIdentifier (signature algorithm)
            name: "CertificationRequest.signatureAlgorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              // algorithm
              name: "CertificationRequest.signatureAlgorithm.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "csrSignatureOid"
            }, {
              name: "CertificationRequest.signatureAlgorithm.parameters",
              tagClass: asn1.Class.UNIVERSAL,
              optional: true,
              captureAsn1: "csrSignatureParams"
            }]
          },
          {
            // signature
            name: "CertificationRequest.signature",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "csrSignature"
          }
        ]
      };
      pki.RDNAttributesAsArray = function(rdn, md) {
        var rval = [];
        var set, attr, obj;
        for (var si = 0; si < rdn.value.length; ++si) {
          set = rdn.value[si];
          for (var i = 0; i < set.value.length; ++i) {
            obj = {};
            attr = set.value[i];
            obj.type = asn1.derToOid(attr.value[0].value);
            obj.value = attr.value[1].value;
            obj.valueTagClass = attr.value[1].type;
            if (obj.type in oids) {
              obj.name = oids[obj.type];
              if (obj.name in _shortNames) {
                obj.shortName = _shortNames[obj.name];
              }
            }
            if (md) {
              md.update(obj.type);
              md.update(obj.value);
            }
            rval.push(obj);
          }
        }
        return rval;
      };
      pki.CRIAttributesAsArray = function(attributes) {
        var rval = [];
        for (var si = 0; si < attributes.length; ++si) {
          var seq = attributes[si];
          var type = asn1.derToOid(seq.value[0].value);
          var values = seq.value[1].value;
          for (var vi = 0; vi < values.length; ++vi) {
            var obj = {};
            obj.type = type;
            obj.value = values[vi].value;
            obj.valueTagClass = values[vi].type;
            if (obj.type in oids) {
              obj.name = oids[obj.type];
              if (obj.name in _shortNames) {
                obj.shortName = _shortNames[obj.name];
              }
            }
            if (obj.type === oids.extensionRequest) {
              obj.extensions = [];
              for (var ei = 0; ei < obj.value.length; ++ei) {
                obj.extensions.push(pki.certificateExtensionFromAsn1(obj.value[ei]));
              }
            }
            rval.push(obj);
          }
        }
        return rval;
      };
      function _getAttribute(obj, options) {
        if (typeof options === "string") {
          options = { shortName: options };
        }
        var rval = null;
        var attr;
        for (var i = 0; rval === null && i < obj.attributes.length; ++i) {
          attr = obj.attributes[i];
          if (options.type && options.type === attr.type) {
            rval = attr;
          } else if (options.name && options.name === attr.name) {
            rval = attr;
          } else if (options.shortName && options.shortName === attr.shortName) {
            rval = attr;
          }
        }
        return rval;
      }
      var _readSignatureParameters = function(oid, obj, fillDefaults) {
        var params = {};
        if (oid !== oids["RSASSA-PSS"]) {
          return params;
        }
        if (fillDefaults) {
          params = {
            hash: {
              algorithmOid: oids["sha1"]
            },
            mgf: {
              algorithmOid: oids["mgf1"],
              hash: {
                algorithmOid: oids["sha1"]
              }
            },
            saltLength: 20
          };
        }
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors)) {
          var error = new Error("Cannot read RSASSA-PSS parameter block.");
          error.errors = errors;
          throw error;
        }
        if (capture.hashOid !== void 0) {
          params.hash = params.hash || {};
          params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
        }
        if (capture.maskGenOid !== void 0) {
          params.mgf = params.mgf || {};
          params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid);
          params.mgf.hash = params.mgf.hash || {};
          params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
        }
        if (capture.saltLength !== void 0) {
          params.saltLength = capture.saltLength.charCodeAt(0);
        }
        return params;
      };
      var _createSignatureDigest = function(options) {
        switch (oids[options.signatureOid]) {
          case "sha1WithRSAEncryption":
          // deprecated alias
          case "sha1WithRSASignature":
            return forge.md.sha1.create();
          case "md5WithRSAEncryption":
            return forge.md.md5.create();
          case "sha256WithRSAEncryption":
            return forge.md.sha256.create();
          case "sha384WithRSAEncryption":
            return forge.md.sha384.create();
          case "sha512WithRSAEncryption":
            return forge.md.sha512.create();
          case "RSASSA-PSS":
            return forge.md.sha256.create();
          default:
            var error = new Error(
              "Could not compute " + options.type + " digest. Unknown signature OID."
            );
            error.signatureOid = options.signatureOid;
            throw error;
        }
      };
      var _verifySignature = function(options) {
        var cert = options.certificate;
        var scheme;
        switch (cert.signatureOid) {
          case oids.sha1WithRSAEncryption:
          // deprecated alias
          case oids.sha1WithRSASignature:
            break;
          case oids["RSASSA-PSS"]:
            var hash, mgf;
            hash = oids[cert.signatureParameters.mgf.hash.algorithmOid];
            if (hash === void 0 || forge.md[hash] === void 0) {
              var error = new Error("Unsupported MGF hash function.");
              error.oid = cert.signatureParameters.mgf.hash.algorithmOid;
              error.name = hash;
              throw error;
            }
            mgf = oids[cert.signatureParameters.mgf.algorithmOid];
            if (mgf === void 0 || forge.mgf[mgf] === void 0) {
              var error = new Error("Unsupported MGF function.");
              error.oid = cert.signatureParameters.mgf.algorithmOid;
              error.name = mgf;
              throw error;
            }
            mgf = forge.mgf[mgf].create(forge.md[hash].create());
            hash = oids[cert.signatureParameters.hash.algorithmOid];
            if (hash === void 0 || forge.md[hash] === void 0) {
              var error = new Error("Unsupported RSASSA-PSS hash function.");
              error.oid = cert.signatureParameters.hash.algorithmOid;
              error.name = hash;
              throw error;
            }
            scheme = forge.pss.create(
              forge.md[hash].create(),
              mgf,
              cert.signatureParameters.saltLength
            );
            break;
        }
        return cert.publicKey.verify(
          options.md.digest().getBytes(),
          options.signature,
          scheme
        );
      };
      pki.certificateFromPem = function(pem, computeHash, strict) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
          var error = new Error(
            'Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".'
          );
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error(
            "Could not convert certificate from PEM; PEM is encrypted."
          );
        }
        var obj = asn1.fromDer(msg.body, strict);
        return pki.certificateFromAsn1(obj, computeHash);
      };
      pki.certificateToPem = function(cert, maxline) {
        var msg = {
          type: "CERTIFICATE",
          body: asn1.toDer(pki.certificateToAsn1(cert)).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.publicKeyFromPem = function(pem) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "PUBLIC KEY" && msg.type !== "RSA PUBLIC KEY") {
          var error = new Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert public key from PEM; PEM is encrypted.");
        }
        var obj = asn1.fromDer(msg.body);
        return pki.publicKeyFromAsn1(obj);
      };
      pki.publicKeyToPem = function(key, maxline) {
        var msg = {
          type: "PUBLIC KEY",
          body: asn1.toDer(pki.publicKeyToAsn1(key)).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.publicKeyToRSAPublicKeyPem = function(key, maxline) {
        var msg = {
          type: "RSA PUBLIC KEY",
          body: asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.getPublicKeyFingerprint = function(key, options) {
        options = options || {};
        var md = options.md || forge.md.sha1.create();
        var type = options.type || "RSAPublicKey";
        var bytes;
        switch (type) {
          case "RSAPublicKey":
            bytes = asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes();
            break;
          case "SubjectPublicKeyInfo":
            bytes = asn1.toDer(pki.publicKeyToAsn1(key)).getBytes();
            break;
          default:
            throw new Error('Unknown fingerprint type "' + options.type + '".');
        }
        md.start();
        md.update(bytes);
        var digest = md.digest();
        if (options.encoding === "hex") {
          var hex = digest.toHex();
          if (options.delimiter) {
            return hex.match(/.{2}/g).join(options.delimiter);
          }
          return hex;
        } else if (options.encoding === "binary") {
          return digest.getBytes();
        } else if (options.encoding) {
          throw new Error('Unknown encoding "' + options.encoding + '".');
        }
        return digest;
      };
      pki.certificationRequestFromPem = function(pem, computeHash, strict) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "CERTIFICATE REQUEST") {
          var error = new Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert certification request from PEM; PEM is encrypted.");
        }
        var obj = asn1.fromDer(msg.body, strict);
        return pki.certificationRequestFromAsn1(obj, computeHash);
      };
      pki.certificationRequestToPem = function(csr, maxline) {
        var msg = {
          type: "CERTIFICATE REQUEST",
          body: asn1.toDer(pki.certificationRequestToAsn1(csr)).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.createCertificate = function() {
        var cert = {};
        cert.version = 2;
        cert.serialNumber = "00";
        cert.signatureOid = null;
        cert.signature = null;
        cert.siginfo = {};
        cert.siginfo.algorithmOid = null;
        cert.validity = {};
        cert.validity.notBefore = /* @__PURE__ */ new Date();
        cert.validity.notAfter = /* @__PURE__ */ new Date();
        cert.issuer = {};
        cert.issuer.getField = function(sn) {
          return _getAttribute(cert.issuer, sn);
        };
        cert.issuer.addField = function(attr) {
          _fillMissingFields([attr]);
          cert.issuer.attributes.push(attr);
        };
        cert.issuer.attributes = [];
        cert.issuer.hash = null;
        cert.subject = {};
        cert.subject.getField = function(sn) {
          return _getAttribute(cert.subject, sn);
        };
        cert.subject.addField = function(attr) {
          _fillMissingFields([attr]);
          cert.subject.attributes.push(attr);
        };
        cert.subject.attributes = [];
        cert.subject.hash = null;
        cert.extensions = [];
        cert.publicKey = null;
        cert.md = null;
        cert.setSubject = function(attrs, uniqueId) {
          _fillMissingFields(attrs);
          cert.subject.attributes = attrs;
          delete cert.subject.uniqueId;
          if (uniqueId) {
            cert.subject.uniqueId = uniqueId;
          }
          cert.subject.hash = null;
        };
        cert.setIssuer = function(attrs, uniqueId) {
          _fillMissingFields(attrs);
          cert.issuer.attributes = attrs;
          delete cert.issuer.uniqueId;
          if (uniqueId) {
            cert.issuer.uniqueId = uniqueId;
          }
          cert.issuer.hash = null;
        };
        cert.setExtensions = function(exts) {
          for (var i = 0; i < exts.length; ++i) {
            _fillMissingExtensionFields(exts[i], { cert });
          }
          cert.extensions = exts;
        };
        cert.getExtension = function(options) {
          if (typeof options === "string") {
            options = { name: options };
          }
          var rval = null;
          var ext;
          for (var i = 0; rval === null && i < cert.extensions.length; ++i) {
            ext = cert.extensions[i];
            if (options.id && ext.id === options.id) {
              rval = ext;
            } else if (options.name && ext.name === options.name) {
              rval = ext;
            }
          }
          return rval;
        };
        cert.sign = function(key, md) {
          cert.md = md || forge.md.sha1.create();
          var algorithmOid = oids[cert.md.algorithm + "WithRSAEncryption"];
          if (!algorithmOid) {
            var error = new Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
            error.algorithm = cert.md.algorithm;
            throw error;
          }
          cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid;
          cert.tbsCertificate = pki.getTBSCertificate(cert);
          var bytes = asn1.toDer(cert.tbsCertificate);
          cert.md.update(bytes.getBytes());
          cert.signature = key.sign(cert.md);
        };
        cert.verify = function(child) {
          var rval = false;
          if (!cert.issued(child)) {
            var issuer = child.issuer;
            var subject = cert.subject;
            var error = new Error(
              "The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject."
            );
            error.expectedIssuer = subject.attributes;
            error.actualIssuer = issuer.attributes;
            throw error;
          }
          var md = child.md;
          if (md === null) {
            md = _createSignatureDigest({
              signatureOid: child.signatureOid,
              type: "certificate"
            });
            var tbsCertificate = child.tbsCertificate || pki.getTBSCertificate(child);
            var bytes = asn1.toDer(tbsCertificate);
            md.update(bytes.getBytes());
          }
          if (md !== null) {
            rval = _verifySignature({
              certificate: cert,
              md,
              signature: child.signature
            });
          }
          return rval;
        };
        cert.isIssuer = function(parent) {
          var rval = false;
          var i = cert.issuer;
          var s = parent.subject;
          if (i.hash && s.hash) {
            rval = i.hash === s.hash;
          } else if (i.attributes.length === s.attributes.length) {
            rval = true;
            var iattr, sattr;
            for (var n = 0; rval && n < i.attributes.length; ++n) {
              iattr = i.attributes[n];
              sattr = s.attributes[n];
              if (iattr.type !== sattr.type || iattr.value !== sattr.value) {
                rval = false;
              }
            }
          }
          return rval;
        };
        cert.issued = function(child) {
          return child.isIssuer(cert);
        };
        cert.generateSubjectKeyIdentifier = function() {
          return pki.getPublicKeyFingerprint(cert.publicKey, { type: "RSAPublicKey" });
        };
        cert.verifySubjectKeyIdentifier = function() {
          var oid = oids["subjectKeyIdentifier"];
          for (var i = 0; i < cert.extensions.length; ++i) {
            var ext = cert.extensions[i];
            if (ext.id === oid) {
              var ski = cert.generateSubjectKeyIdentifier().getBytes();
              return forge.util.hexToBytes(ext.subjectKeyIdentifier) === ski;
            }
          }
          return false;
        };
        return cert;
      };
      pki.certificateFromAsn1 = function(obj, computeHash) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, x509CertificateValidator, capture, errors)) {
          var error = new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.publicKeyOid);
        if (oid !== pki.oids.rsaEncryption) {
          throw new Error("Cannot read public key. OID is not RSA.");
        }
        var cert = pki.createCertificate();
        cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
        var serial = forge.util.createBuffer(capture.certSerialNumber);
        cert.serialNumber = serial.toHex();
        cert.signatureOid = forge.asn1.derToOid(capture.certSignatureOid);
        cert.signatureParameters = _readSignatureParameters(
          cert.signatureOid,
          capture.certSignatureParams,
          true
        );
        cert.siginfo.algorithmOid = forge.asn1.derToOid(capture.certinfoSignatureOid);
        cert.siginfo.parameters = _readSignatureParameters(
          cert.siginfo.algorithmOid,
          capture.certinfoSignatureParams,
          false
        );
        cert.signature = capture.certSignature;
        var validity = [];
        if (capture.certValidity1UTCTime !== void 0) {
          validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
        }
        if (capture.certValidity2GeneralizedTime !== void 0) {
          validity.push(asn1.generalizedTimeToDate(
            capture.certValidity2GeneralizedTime
          ));
        }
        if (capture.certValidity3UTCTime !== void 0) {
          validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
        }
        if (capture.certValidity4GeneralizedTime !== void 0) {
          validity.push(asn1.generalizedTimeToDate(
            capture.certValidity4GeneralizedTime
          ));
        }
        if (validity.length > 2) {
          throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
        }
        if (validity.length < 2) {
          throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
        }
        cert.validity.notBefore = validity[0];
        cert.validity.notAfter = validity[1];
        cert.tbsCertificate = capture.tbsCertificate;
        if (computeHash) {
          cert.md = _createSignatureDigest({
            signatureOid: cert.signatureOid,
            type: "certificate"
          });
          var bytes = asn1.toDer(cert.tbsCertificate);
          cert.md.update(bytes.getBytes());
        }
        var imd = forge.md.sha1.create();
        var ibytes = asn1.toDer(capture.certIssuer);
        imd.update(ibytes.getBytes());
        cert.issuer.getField = function(sn) {
          return _getAttribute(cert.issuer, sn);
        };
        cert.issuer.addField = function(attr) {
          _fillMissingFields([attr]);
          cert.issuer.attributes.push(attr);
        };
        cert.issuer.attributes = pki.RDNAttributesAsArray(capture.certIssuer);
        if (capture.certIssuerUniqueId) {
          cert.issuer.uniqueId = capture.certIssuerUniqueId;
        }
        cert.issuer.hash = imd.digest().toHex();
        var smd = forge.md.sha1.create();
        var sbytes = asn1.toDer(capture.certSubject);
        smd.update(sbytes.getBytes());
        cert.subject.getField = function(sn) {
          return _getAttribute(cert.subject, sn);
        };
        cert.subject.addField = function(attr) {
          _fillMissingFields([attr]);
          cert.subject.attributes.push(attr);
        };
        cert.subject.attributes = pki.RDNAttributesAsArray(capture.certSubject);
        if (capture.certSubjectUniqueId) {
          cert.subject.uniqueId = capture.certSubjectUniqueId;
        }
        cert.subject.hash = smd.digest().toHex();
        if (capture.certExtensions) {
          cert.extensions = pki.certificateExtensionsFromAsn1(capture.certExtensions);
        } else {
          cert.extensions = [];
        }
        cert.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
        return cert;
      };
      pki.certificateExtensionsFromAsn1 = function(exts) {
        var rval = [];
        for (var i = 0; i < exts.value.length; ++i) {
          var extseq = exts.value[i];
          for (var ei = 0; ei < extseq.value.length; ++ei) {
            rval.push(pki.certificateExtensionFromAsn1(extseq.value[ei]));
          }
        }
        return rval;
      };
      pki.certificateExtensionFromAsn1 = function(ext) {
        var e = {};
        e.id = asn1.derToOid(ext.value[0].value);
        e.critical = false;
        if (ext.value[1].type === asn1.Type.BOOLEAN) {
          e.critical = ext.value[1].value.charCodeAt(0) !== 0;
          e.value = ext.value[2].value;
        } else {
          e.value = ext.value[1].value;
        }
        if (e.id in oids) {
          e.name = oids[e.id];
          if (e.name === "keyUsage") {
            var ev = asn1.fromDer(e.value);
            var b2 = 0;
            var b3 = 0;
            if (ev.value.length > 1) {
              b2 = ev.value.charCodeAt(1);
              b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
            }
            e.digitalSignature = (b2 & 128) === 128;
            e.nonRepudiation = (b2 & 64) === 64;
            e.keyEncipherment = (b2 & 32) === 32;
            e.dataEncipherment = (b2 & 16) === 16;
            e.keyAgreement = (b2 & 8) === 8;
            e.keyCertSign = (b2 & 4) === 4;
            e.cRLSign = (b2 & 2) === 2;
            e.encipherOnly = (b2 & 1) === 1;
            e.decipherOnly = (b3 & 128) === 128;
          } else if (e.name === "basicConstraints") {
            var ev = asn1.fromDer(e.value);
            if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN) {
              e.cA = ev.value[0].value.charCodeAt(0) !== 0;
            } else {
              e.cA = false;
            }
            var value = null;
            if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER) {
              value = ev.value[0].value;
            } else if (ev.value.length > 1) {
              value = ev.value[1].value;
            }
            if (value !== null) {
              e.pathLenConstraint = asn1.derToInteger(value);
            }
          } else if (e.name === "extKeyUsage") {
            var ev = asn1.fromDer(e.value);
            for (var vi = 0; vi < ev.value.length; ++vi) {
              var oid = asn1.derToOid(ev.value[vi].value);
              if (oid in oids) {
                e[oids[oid]] = true;
              } else {
                e[oid] = true;
              }
            }
          } else if (e.name === "nsCertType") {
            var ev = asn1.fromDer(e.value);
            var b2 = 0;
            if (ev.value.length > 1) {
              b2 = ev.value.charCodeAt(1);
            }
            e.client = (b2 & 128) === 128;
            e.server = (b2 & 64) === 64;
            e.email = (b2 & 32) === 32;
            e.objsign = (b2 & 16) === 16;
            e.reserved = (b2 & 8) === 8;
            e.sslCA = (b2 & 4) === 4;
            e.emailCA = (b2 & 2) === 2;
            e.objCA = (b2 & 1) === 1;
          } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
            e.altNames = [];
            var gn;
            var ev = asn1.fromDer(e.value);
            for (var n = 0; n < ev.value.length; ++n) {
              gn = ev.value[n];
              var altName = {
                type: gn.type,
                value: gn.value
              };
              e.altNames.push(altName);
              switch (gn.type) {
                // rfc822Name
                case 1:
                // dNSName
                case 2:
                // uniformResourceIdentifier (URI)
                case 6:
                  break;
                // IPAddress
                case 7:
                  altName.ip = forge.util.bytesToIP(gn.value);
                  break;
                // registeredID
                case 8:
                  altName.oid = asn1.derToOid(gn.value);
                  break;
                default:
              }
            }
          } else if (e.name === "subjectKeyIdentifier") {
            var ev = asn1.fromDer(e.value);
            e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
          }
        }
        return e;
      };
      pki.certificationRequestFromAsn1 = function(obj, computeHash) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, certificationRequestValidator, capture, errors)) {
          var error = new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.publicKeyOid);
        if (oid !== pki.oids.rsaEncryption) {
          throw new Error("Cannot read public key. OID is not RSA.");
        }
        var csr = pki.createCertificationRequest();
        csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
        csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid);
        csr.signatureParameters = _readSignatureParameters(
          csr.signatureOid,
          capture.csrSignatureParams,
          true
        );
        csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid);
        csr.siginfo.parameters = _readSignatureParameters(
          csr.siginfo.algorithmOid,
          capture.csrSignatureParams,
          false
        );
        csr.signature = capture.csrSignature;
        csr.certificationRequestInfo = capture.certificationRequestInfo;
        if (computeHash) {
          csr.md = _createSignatureDigest({
            signatureOid: csr.signatureOid,
            type: "certification request"
          });
          var bytes = asn1.toDer(csr.certificationRequestInfo);
          csr.md.update(bytes.getBytes());
        }
        var smd = forge.md.sha1.create();
        csr.subject.getField = function(sn) {
          return _getAttribute(csr.subject, sn);
        };
        csr.subject.addField = function(attr) {
          _fillMissingFields([attr]);
          csr.subject.attributes.push(attr);
        };
        csr.subject.attributes = pki.RDNAttributesAsArray(
          capture.certificationRequestInfoSubject,
          smd
        );
        csr.subject.hash = smd.digest().toHex();
        csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
        csr.getAttribute = function(sn) {
          return _getAttribute(csr, sn);
        };
        csr.addAttribute = function(attr) {
          _fillMissingFields([attr]);
          csr.attributes.push(attr);
        };
        csr.attributes = pki.CRIAttributesAsArray(
          capture.certificationRequestInfoAttributes || []
        );
        return csr;
      };
      pki.createCertificationRequest = function() {
        var csr = {};
        csr.version = 0;
        csr.signatureOid = null;
        csr.signature = null;
        csr.siginfo = {};
        csr.siginfo.algorithmOid = null;
        csr.subject = {};
        csr.subject.getField = function(sn) {
          return _getAttribute(csr.subject, sn);
        };
        csr.subject.addField = function(attr) {
          _fillMissingFields([attr]);
          csr.subject.attributes.push(attr);
        };
        csr.subject.attributes = [];
        csr.subject.hash = null;
        csr.publicKey = null;
        csr.attributes = [];
        csr.getAttribute = function(sn) {
          return _getAttribute(csr, sn);
        };
        csr.addAttribute = function(attr) {
          _fillMissingFields([attr]);
          csr.attributes.push(attr);
        };
        csr.md = null;
        csr.setSubject = function(attrs) {
          _fillMissingFields(attrs);
          csr.subject.attributes = attrs;
          csr.subject.hash = null;
        };
        csr.setAttributes = function(attrs) {
          _fillMissingFields(attrs);
          csr.attributes = attrs;
        };
        csr.sign = function(key, md) {
          csr.md = md || forge.md.sha1.create();
          var algorithmOid = oids[csr.md.algorithm + "WithRSAEncryption"];
          if (!algorithmOid) {
            var error = new Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
            error.algorithm = csr.md.algorithm;
            throw error;
          }
          csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;
          csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
          var bytes = asn1.toDer(csr.certificationRequestInfo);
          csr.md.update(bytes.getBytes());
          csr.signature = key.sign(csr.md);
        };
        csr.verify = function() {
          var rval = false;
          var md = csr.md;
          if (md === null) {
            md = _createSignatureDigest({
              signatureOid: csr.signatureOid,
              type: "certification request"
            });
            var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
            var bytes = asn1.toDer(cri);
            md.update(bytes.getBytes());
          }
          if (md !== null) {
            rval = _verifySignature({
              certificate: csr,
              md,
              signature: csr.signature
            });
          }
          return rval;
        };
        return csr;
      };
      function _dnToAsn1(obj) {
        var rval = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          []
        );
        var attr, set;
        var attrs = obj.attributes;
        for (var i = 0; i < attrs.length; ++i) {
          attr = attrs[i];
          var value = attr.value;
          var valueTagClass = asn1.Type.PRINTABLESTRING;
          if ("valueTagClass" in attr) {
            valueTagClass = attr.valueTagClass;
            if (valueTagClass === asn1.Type.UTF8) {
              value = forge.util.encodeUtf8(value);
            }
          }
          set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // AttributeType
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(attr.type).getBytes()
              ),
              // AttributeValue
              asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)
            ])
          ]);
          rval.value.push(set);
        }
        return rval;
      }
      function _fillMissingFields(attrs) {
        var attr;
        for (var i = 0; i < attrs.length; ++i) {
          attr = attrs[i];
          if (typeof attr.name === "undefined") {
            if (attr.type && attr.type in pki.oids) {
              attr.name = pki.oids[attr.type];
            } else if (attr.shortName && attr.shortName in _shortNames) {
              attr.name = pki.oids[_shortNames[attr.shortName]];
            }
          }
          if (typeof attr.type === "undefined") {
            if (attr.name && attr.name in pki.oids) {
              attr.type = pki.oids[attr.name];
            } else {
              var error = new Error("Attribute type not specified.");
              error.attribute = attr;
              throw error;
            }
          }
          if (typeof attr.shortName === "undefined") {
            if (attr.name && attr.name in _shortNames) {
              attr.shortName = _shortNames[attr.name];
            }
          }
          if (attr.type === oids.extensionRequest) {
            attr.valueConstructed = true;
            attr.valueTagClass = asn1.Type.SEQUENCE;
            if (!attr.value && attr.extensions) {
              attr.value = [];
              for (var ei = 0; ei < attr.extensions.length; ++ei) {
                attr.value.push(pki.certificateExtensionToAsn1(
                  _fillMissingExtensionFields(attr.extensions[ei])
                ));
              }
            }
          }
          if (typeof attr.value === "undefined") {
            var error = new Error("Attribute value not specified.");
            error.attribute = attr;
            throw error;
          }
        }
      }
      function _fillMissingExtensionFields(e, options) {
        options = options || {};
        if (typeof e.name === "undefined") {
          if (e.id && e.id in pki.oids) {
            e.name = pki.oids[e.id];
          }
        }
        if (typeof e.id === "undefined") {
          if (e.name && e.name in pki.oids) {
            e.id = pki.oids[e.name];
          } else {
            var error = new Error("Extension ID not specified.");
            error.extension = e;
            throw error;
          }
        }
        if (typeof e.value !== "undefined") {
          return e;
        }
        if (e.name === "keyUsage") {
          var unused = 0;
          var b2 = 0;
          var b3 = 0;
          if (e.digitalSignature) {
            b2 |= 128;
            unused = 7;
          }
          if (e.nonRepudiation) {
            b2 |= 64;
            unused = 6;
          }
          if (e.keyEncipherment) {
            b2 |= 32;
            unused = 5;
          }
          if (e.dataEncipherment) {
            b2 |= 16;
            unused = 4;
          }
          if (e.keyAgreement) {
            b2 |= 8;
            unused = 3;
          }
          if (e.keyCertSign) {
            b2 |= 4;
            unused = 2;
          }
          if (e.cRLSign) {
            b2 |= 2;
            unused = 1;
          }
          if (e.encipherOnly) {
            b2 |= 1;
            unused = 0;
          }
          if (e.decipherOnly) {
            b3 |= 128;
            unused = 7;
          }
          var value = String.fromCharCode(unused);
          if (b3 !== 0) {
            value += String.fromCharCode(b2) + String.fromCharCode(b3);
          } else if (b2 !== 0) {
            value += String.fromCharCode(b2);
          }
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BITSTRING,
            false,
            value
          );
        } else if (e.name === "basicConstraints") {
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            []
          );
          if (e.cA) {
            e.value.value.push(asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.BOOLEAN,
              false,
              String.fromCharCode(255)
            ));
          }
          if ("pathLenConstraint" in e) {
            e.value.value.push(asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              asn1.integerToDer(e.pathLenConstraint).getBytes()
            ));
          }
        } else if (e.name === "extKeyUsage") {
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            []
          );
          var seq = e.value.value;
          for (var key in e) {
            if (e[key] !== true) {
              continue;
            }
            if (key in oids) {
              seq.push(asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(oids[key]).getBytes()
              ));
            } else if (key.indexOf(".") !== -1) {
              seq.push(asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(key).getBytes()
              ));
            }
          }
        } else if (e.name === "nsCertType") {
          var unused = 0;
          var b2 = 0;
          if (e.client) {
            b2 |= 128;
            unused = 7;
          }
          if (e.server) {
            b2 |= 64;
            unused = 6;
          }
          if (e.email) {
            b2 |= 32;
            unused = 5;
          }
          if (e.objsign) {
            b2 |= 16;
            unused = 4;
          }
          if (e.reserved) {
            b2 |= 8;
            unused = 3;
          }
          if (e.sslCA) {
            b2 |= 4;
            unused = 2;
          }
          if (e.emailCA) {
            b2 |= 2;
            unused = 1;
          }
          if (e.objCA) {
            b2 |= 1;
            unused = 0;
          }
          var value = String.fromCharCode(unused);
          if (b2 !== 0) {
            value += String.fromCharCode(b2);
          }
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BITSTRING,
            false,
            value
          );
        } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
          e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
          var altName;
          for (var n = 0; n < e.altNames.length; ++n) {
            altName = e.altNames[n];
            var value = altName.value;
            if (altName.type === 7 && altName.ip) {
              value = forge.util.bytesFromIP(altName.ip);
              if (value === null) {
                var error = new Error(
                  'Extension "ip" value is not a valid IPv4 or IPv6 address.'
                );
                error.extension = e;
                throw error;
              }
            } else if (altName.type === 8) {
              if (altName.oid) {
                value = asn1.oidToDer(asn1.oidToDer(altName.oid));
              } else {
                value = asn1.oidToDer(value);
              }
            }
            e.value.value.push(asn1.create(
              asn1.Class.CONTEXT_SPECIFIC,
              altName.type,
              false,
              value
            ));
          }
        } else if (e.name === "nsComment" && options.cert) {
          if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128) {
            throw new Error('Invalid "nsComment" content.');
          }
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.IA5STRING,
            false,
            e.comment
          );
        } else if (e.name === "subjectKeyIdentifier" && options.cert) {
          var ski = options.cert.generateSubjectKeyIdentifier();
          e.subjectKeyIdentifier = ski.toHex();
          e.value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            ski.getBytes()
          );
        } else if (e.name === "authorityKeyIdentifier" && options.cert) {
          e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
          var seq = e.value.value;
          if (e.keyIdentifier) {
            var keyIdentifier = e.keyIdentifier === true ? options.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
            seq.push(
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, false, keyIdentifier)
            );
          }
          if (e.authorityCertIssuer) {
            var authorityCertIssuer = [
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
                _dnToAsn1(e.authorityCertIssuer === true ? options.cert.issuer : e.authorityCertIssuer)
              ])
            ];
            seq.push(
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, authorityCertIssuer)
            );
          }
          if (e.serialNumber) {
            var serialNumber = forge.util.hexToBytes(e.serialNumber === true ? options.cert.serialNumber : e.serialNumber);
            seq.push(
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, false, serialNumber)
            );
          }
        } else if (e.name === "cRLDistributionPoints") {
          e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
          var seq = e.value.value;
          var subSeq = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            []
          );
          var fullNameGeneralNames = asn1.create(
            asn1.Class.CONTEXT_SPECIFIC,
            0,
            true,
            []
          );
          var altName;
          for (var n = 0; n < e.altNames.length; ++n) {
            altName = e.altNames[n];
            var value = altName.value;
            if (altName.type === 7 && altName.ip) {
              value = forge.util.bytesFromIP(altName.ip);
              if (value === null) {
                var error = new Error(
                  'Extension "ip" value is not a valid IPv4 or IPv6 address.'
                );
                error.extension = e;
                throw error;
              }
            } else if (altName.type === 8) {
              if (altName.oid) {
                value = asn1.oidToDer(asn1.oidToDer(altName.oid));
              } else {
                value = asn1.oidToDer(value);
              }
            }
            fullNameGeneralNames.value.push(asn1.create(
              asn1.Class.CONTEXT_SPECIFIC,
              altName.type,
              false,
              value
            ));
          }
          subSeq.value.push(asn1.create(
            asn1.Class.CONTEXT_SPECIFIC,
            0,
            true,
            [fullNameGeneralNames]
          ));
          seq.push(subSeq);
        }
        if (typeof e.value === "undefined") {
          var error = new Error("Extension value not specified.");
          error.extension = e;
          throw error;
        }
        return e;
      }
      function _signatureParametersToAsn1(oid, params) {
        switch (oid) {
          case oids["RSASSA-PSS"]:
            var parts = [];
            if (params.hash.algorithmOid !== void 0) {
              parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OID,
                    false,
                    asn1.oidToDer(params.hash.algorithmOid).getBytes()
                  ),
                  asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
                ])
              ]));
            }
            if (params.mgf.algorithmOid !== void 0) {
              parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OID,
                    false,
                    asn1.oidToDer(params.mgf.algorithmOid).getBytes()
                  ),
                  asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                    asn1.create(
                      asn1.Class.UNIVERSAL,
                      asn1.Type.OID,
                      false,
                      asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()
                    ),
                    asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
                  ])
                ])
              ]));
            }
            if (params.saltLength !== void 0) {
              parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.INTEGER,
                  false,
                  asn1.integerToDer(params.saltLength).getBytes()
                )
              ]));
            }
            return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);
          default:
            return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "");
        }
      }
      function _CRIAttributesToAsn1(csr) {
        var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
        if (csr.attributes.length === 0) {
          return rval;
        }
        var attrs = csr.attributes;
        for (var i = 0; i < attrs.length; ++i) {
          var attr = attrs[i];
          var value = attr.value;
          var valueTagClass = asn1.Type.UTF8;
          if ("valueTagClass" in attr) {
            valueTagClass = attr.valueTagClass;
          }
          if (valueTagClass === asn1.Type.UTF8) {
            value = forge.util.encodeUtf8(value);
          }
          var valueConstructed = false;
          if ("valueConstructed" in attr) {
            valueConstructed = attr.valueConstructed;
          }
          var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // AttributeType
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(attr.type).getBytes()
            ),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
              // AttributeValue
              asn1.create(
                asn1.Class.UNIVERSAL,
                valueTagClass,
                valueConstructed,
                value
              )
            ])
          ]);
          rval.value.push(seq);
        }
        return rval;
      }
      var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z");
      var jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z");
      function _dateToAsn1(date) {
        if (date >= jan_1_1950 && date < jan_1_2050) {
          return asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.UTCTIME,
            false,
            asn1.dateToUtcTime(date)
          );
        } else {
          return asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.GENERALIZEDTIME,
            false,
            asn1.dateToGeneralizedTime(date)
          );
        }
      }
      pki.getTBSCertificate = function(cert) {
        var notBefore = _dateToAsn1(cert.validity.notBefore);
        var notAfter = _dateToAsn1(cert.validity.notAfter);
        var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            // integer
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              asn1.integerToDer(cert.version).getBytes()
            )
          ]),
          // serialNumber
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            forge.util.hexToBytes(cert.serialNumber)
          ),
          // signature
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()
            ),
            // parameters
            _signatureParametersToAsn1(
              cert.siginfo.algorithmOid,
              cert.siginfo.parameters
            )
          ]),
          // issuer
          _dnToAsn1(cert.issuer),
          // validity
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            notBefore,
            notAfter
          ]),
          // subject
          _dnToAsn1(cert.subject),
          // SubjectPublicKeyInfo
          pki.publicKeyToAsn1(cert.publicKey)
        ]);
        if (cert.issuer.uniqueId) {
          tbs.value.push(
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.BITSTRING,
                false,
                // TODO: support arbitrary bit length ids
                String.fromCharCode(0) + cert.issuer.uniqueId
              )
            ])
          );
        }
        if (cert.subject.uniqueId) {
          tbs.value.push(
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.BITSTRING,
                false,
                // TODO: support arbitrary bit length ids
                String.fromCharCode(0) + cert.subject.uniqueId
              )
            ])
          );
        }
        if (cert.extensions.length > 0) {
          tbs.value.push(pki.certificateExtensionsToAsn1(cert.extensions));
        }
        return tbs;
      };
      pki.getCertificationRequestInfo = function(csr) {
        var cri = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(csr.version).getBytes()
          ),
          // subject
          _dnToAsn1(csr.subject),
          // SubjectPublicKeyInfo
          pki.publicKeyToAsn1(csr.publicKey),
          // attributes
          _CRIAttributesToAsn1(csr)
        ]);
        return cri;
      };
      pki.distinguishedNameToAsn1 = function(dn) {
        return _dnToAsn1(dn);
      };
      pki.certificateToAsn1 = function(cert) {
        var tbsCertificate = cert.tbsCertificate || pki.getTBSCertificate(cert);
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // TBSCertificate
          tbsCertificate,
          // AlgorithmIdentifier (signature algorithm)
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(cert.signatureOid).getBytes()
            ),
            // parameters
            _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)
          ]),
          // SignatureValue
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BITSTRING,
            false,
            String.fromCharCode(0) + cert.signature
          )
        ]);
      };
      pki.certificateExtensionsToAsn1 = function(exts) {
        var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, []);
        var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        rval.value.push(seq);
        for (var i = 0; i < exts.length; ++i) {
          seq.value.push(pki.certificateExtensionToAsn1(exts[i]));
        }
        return rval;
      };
      pki.certificateExtensionToAsn1 = function(ext) {
        var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        extseq.value.push(asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OID,
          false,
          asn1.oidToDer(ext.id).getBytes()
        ));
        if (ext.critical) {
          extseq.value.push(asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BOOLEAN,
            false,
            String.fromCharCode(255)
          ));
        }
        var value = ext.value;
        if (typeof ext.value !== "string") {
          value = asn1.toDer(value).getBytes();
        }
        extseq.value.push(asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          value
        ));
        return extseq;
      };
      pki.certificationRequestToAsn1 = function(csr) {
        var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // CertificationRequestInfo
          cri,
          // AlgorithmIdentifier (signature algorithm)
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(csr.signatureOid).getBytes()
            ),
            // parameters
            _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)
          ]),
          // signature
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.BITSTRING,
            false,
            String.fromCharCode(0) + csr.signature
          )
        ]);
      };
      pki.createCaStore = function(certs) {
        var caStore = {
          // stored certificates
          certs: {}
        };
        caStore.getIssuer = function(cert2) {
          var rval = getBySubject(cert2.issuer);
          return rval;
        };
        caStore.addCertificate = function(cert2) {
          if (typeof cert2 === "string") {
            cert2 = forge.pki.certificateFromPem(cert2);
          }
          ensureSubjectHasHash(cert2.subject);
          if (!caStore.hasCertificate(cert2)) {
            if (cert2.subject.hash in caStore.certs) {
              var tmp = caStore.certs[cert2.subject.hash];
              if (!forge.util.isArray(tmp)) {
                tmp = [tmp];
              }
              tmp.push(cert2);
              caStore.certs[cert2.subject.hash] = tmp;
            } else {
              caStore.certs[cert2.subject.hash] = cert2;
            }
          }
        };
        caStore.hasCertificate = function(cert2) {
          if (typeof cert2 === "string") {
            cert2 = forge.pki.certificateFromPem(cert2);
          }
          var match = getBySubject(cert2.subject);
          if (!match) {
            return false;
          }
          if (!forge.util.isArray(match)) {
            match = [match];
          }
          var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
          for (var i2 = 0; i2 < match.length; ++i2) {
            var der2 = asn1.toDer(pki.certificateToAsn1(match[i2])).getBytes();
            if (der1 === der2) {
              return true;
            }
          }
          return false;
        };
        caStore.listAllCertificates = function() {
          var certList = [];
          for (var hash in caStore.certs) {
            if (caStore.certs.hasOwnProperty(hash)) {
              var value = caStore.certs[hash];
              if (!forge.util.isArray(value)) {
                certList.push(value);
              } else {
                for (var i2 = 0; i2 < value.length; ++i2) {
                  certList.push(value[i2]);
                }
              }
            }
          }
          return certList;
        };
        caStore.removeCertificate = function(cert2) {
          var result;
          if (typeof cert2 === "string") {
            cert2 = forge.pki.certificateFromPem(cert2);
          }
          ensureSubjectHasHash(cert2.subject);
          if (!caStore.hasCertificate(cert2)) {
            return null;
          }
          var match = getBySubject(cert2.subject);
          if (!forge.util.isArray(match)) {
            result = caStore.certs[cert2.subject.hash];
            delete caStore.certs[cert2.subject.hash];
            return result;
          }
          var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
          for (var i2 = 0; i2 < match.length; ++i2) {
            var der2 = asn1.toDer(pki.certificateToAsn1(match[i2])).getBytes();
            if (der1 === der2) {
              result = match[i2];
              match.splice(i2, 1);
            }
          }
          if (match.length === 0) {
            delete caStore.certs[cert2.subject.hash];
          }
          return result;
        };
        function getBySubject(subject) {
          ensureSubjectHasHash(subject);
          return caStore.certs[subject.hash] || null;
        }
        function ensureSubjectHasHash(subject) {
          if (!subject.hash) {
            var md = forge.md.sha1.create();
            subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(subject), md);
            subject.hash = md.digest().toHex();
          }
        }
        if (certs) {
          for (var i = 0; i < certs.length; ++i) {
            var cert = certs[i];
            caStore.addCertificate(cert);
          }
        }
        return caStore;
      };
      pki.certificateError = {
        bad_certificate: "forge.pki.BadCertificate",
        unsupported_certificate: "forge.pki.UnsupportedCertificate",
        certificate_revoked: "forge.pki.CertificateRevoked",
        certificate_expired: "forge.pki.CertificateExpired",
        certificate_unknown: "forge.pki.CertificateUnknown",
        unknown_ca: "forge.pki.UnknownCertificateAuthority"
      };
      pki.verifyCertificateChain = function(caStore, chain, options) {
        if (typeof options === "function") {
          options = { verify: options };
        }
        options = options || {};
        chain = chain.slice(0);
        var certs = chain.slice(0);
        var validityCheckDate = options.validityCheckDate;
        if (typeof validityCheckDate === "undefined") {
          validityCheckDate = /* @__PURE__ */ new Date();
        }
        var first = true;
        var error = null;
        var depth = 0;
        do {
          var cert = chain.shift();
          var parent = null;
          var selfSigned = false;
          if (validityCheckDate) {
            if (validityCheckDate < cert.validity.notBefore || validityCheckDate > cert.validity.notAfter) {
              error = {
                message: "Certificate is not valid yet or has expired.",
                error: pki.certificateError.certificate_expired,
                notBefore: cert.validity.notBefore,
                notAfter: cert.validity.notAfter,
                // TODO: we might want to reconsider renaming 'now' to
                // 'validityCheckDate' should this API be changed in the future.
                now: validityCheckDate
              };
            }
          }
          if (error === null) {
            parent = chain[0] || caStore.getIssuer(cert);
            if (parent === null) {
              if (cert.isIssuer(cert)) {
                selfSigned = true;
                parent = cert;
              }
            }
            if (parent) {
              var parents = parent;
              if (!forge.util.isArray(parents)) {
                parents = [parents];
              }
              var verified = false;
              while (!verified && parents.length > 0) {
                parent = parents.shift();
                try {
                  verified = parent.verify(cert);
                } catch (ex) {
                }
              }
              if (!verified) {
                error = {
                  message: "Certificate signature is invalid.",
                  error: pki.certificateError.bad_certificate
                };
              }
            }
            if (error === null && (!parent || selfSigned) && !caStore.hasCertificate(cert)) {
              error = {
                message: "Certificate is not trusted.",
                error: pki.certificateError.unknown_ca
              };
            }
          }
          if (error === null && parent && !cert.isIssuer(parent)) {
            error = {
              message: "Certificate issuer is invalid.",
              error: pki.certificateError.bad_certificate
            };
          }
          if (error === null) {
            var se = {
              keyUsage: true,
              basicConstraints: true
            };
            for (var i = 0; error === null && i < cert.extensions.length; ++i) {
              var ext = cert.extensions[i];
              if (ext.critical && !(ext.name in se)) {
                error = {
                  message: "Certificate has an unsupported critical extension.",
                  error: pki.certificateError.unsupported_certificate
                };
              }
            }
          }
          if (error === null && (!first || chain.length === 0 && (!parent || selfSigned))) {
            var bcExt = cert.getExtension("basicConstraints");
            var keyUsageExt = cert.getExtension("keyUsage");
            if (keyUsageExt !== null) {
              if (!keyUsageExt.keyCertSign || bcExt === null) {
                error = {
                  message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                  error: pki.certificateError.bad_certificate
                };
              }
            }
            if (error === null && bcExt === null) {
              error = {
                message: "Certificate is missing basicConstraints extension and cannot be used as a CA.",
                error: pki.certificateError.bad_certificate
              };
            }
            if (error === null && bcExt !== null && !bcExt.cA) {
              error = {
                message: "Certificate basicConstraints indicates the certificate is not a CA.",
                error: pki.certificateError.bad_certificate
              };
            }
            if (error === null && keyUsageExt !== null && "pathLenConstraint" in bcExt) {
              var pathLen = depth - 1;
              if (pathLen > bcExt.pathLenConstraint) {
                error = {
                  message: "Certificate basicConstraints pathLenConstraint violated.",
                  error: pki.certificateError.bad_certificate
                };
              }
            }
          }
          var vfd = error === null ? true : error.error;
          var ret = options.verify ? options.verify(vfd, depth, certs) : vfd;
          if (ret === true) {
            error = null;
          } else {
            if (vfd === true) {
              error = {
                message: "The application rejected the certificate.",
                error: pki.certificateError.bad_certificate
              };
            }
            if (ret || ret === 0) {
              if (typeof ret === "object" && !forge.util.isArray(ret)) {
                if (ret.message) {
                  error.message = ret.message;
                }
                if (ret.error) {
                  error.error = ret.error;
                }
              } else if (typeof ret === "string") {
                error.error = ret;
              }
            }
            throw error;
          }
          first = false;
          ++depth;
        } while (chain.length > 0);
        return true;
      };
    }
  });

  // node_modules/node-forge/lib/pkcs12.js
  var require_pkcs12 = __commonJS({
    "node_modules/node-forge/lib/pkcs12.js"(exports, module) {
      var forge = require_forge();
      require_asn12();
      require_hmac2();
      require_oids();
      require_pkcs7asn1();
      require_pbe();
      require_random();
      require_rsa();
      require_sha12();
      require_util();
      require_x509();
      var asn1 = forge.asn1;
      var pki = forge.pki;
      var p12 = module.exports = forge.pkcs12 = forge.pkcs12 || {};
      var contentInfoValidator = {
        name: "ContentInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        // a ContentInfo
        constructed: true,
        value: [{
          name: "ContentInfo.contentType",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "contentType"
        }, {
          name: "ContentInfo.content",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          constructed: true,
          captureAsn1: "content"
        }]
      };
      var pfxValidator = {
        name: "PFX",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [
          {
            name: "PFX.version",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "version"
          },
          contentInfoValidator,
          {
            name: "PFX.macData",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            optional: true,
            captureAsn1: "mac",
            value: [{
              name: "PFX.macData.mac",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              // DigestInfo
              constructed: true,
              value: [{
                name: "PFX.macData.mac.digestAlgorithm",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.SEQUENCE,
                // DigestAlgorithmIdentifier
                constructed: true,
                value: [{
                  name: "PFX.macData.mac.digestAlgorithm.algorithm",
                  tagClass: asn1.Class.UNIVERSAL,
                  type: asn1.Type.OID,
                  constructed: false,
                  capture: "macAlgorithm"
                }, {
                  name: "PFX.macData.mac.digestAlgorithm.parameters",
                  optional: true,
                  tagClass: asn1.Class.UNIVERSAL,
                  captureAsn1: "macAlgorithmParameters"
                }]
              }, {
                name: "PFX.macData.mac.digest",
                tagClass: asn1.Class.UNIVERSAL,
                type: asn1.Type.OCTETSTRING,
                constructed: false,
                capture: "macDigest"
              }]
            }, {
              name: "PFX.macData.macSalt",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OCTETSTRING,
              constructed: false,
              capture: "macSalt"
            }, {
              name: "PFX.macData.iterations",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.INTEGER,
              constructed: false,
              optional: true,
              capture: "macIterations"
            }]
          }
        ]
      };
      var safeBagValidator = {
        name: "SafeBag",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "SafeBag.bagId",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "bagId"
        }, {
          name: "SafeBag.bagValue",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          constructed: true,
          captureAsn1: "bagValue"
        }, {
          name: "SafeBag.bagAttributes",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SET,
          constructed: true,
          optional: true,
          capture: "bagAttributes"
        }]
      };
      var attributeValidator = {
        name: "Attribute",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "Attribute.attrId",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "oid"
        }, {
          name: "Attribute.attrValues",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SET,
          constructed: true,
          capture: "values"
        }]
      };
      var certBagValidator = {
        name: "CertBag",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "CertBag.certId",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "certId"
        }, {
          name: "CertBag.certValue",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          constructed: true,
          /* So far we only support X.509 certificates (which are wrapped in
             an OCTET STRING, hence hard code that here). */
          value: [{
            name: "CertBag.certValue[0]",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Class.OCTETSTRING,
            constructed: false,
            capture: "cert"
          }]
        }]
      };
      function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
        var result = [];
        for (var i = 0; i < safeContents.length; i++) {
          for (var j = 0; j < safeContents[i].safeBags.length; j++) {
            var bag = safeContents[i].safeBags[j];
            if (bagType !== void 0 && bag.type !== bagType) {
              continue;
            }
            if (attrName === null) {
              result.push(bag);
              continue;
            }
            if (bag.attributes[attrName] !== void 0 && bag.attributes[attrName].indexOf(attrValue) >= 0) {
              result.push(bag);
            }
          }
        }
        return result;
      }
      p12.pkcs12FromAsn1 = function(obj, strict, password) {
        if (typeof strict === "string") {
          password = strict;
          strict = true;
        } else if (strict === void 0) {
          strict = true;
        }
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, pfxValidator, capture, errors)) {
          var error = new Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
          error.errors = error;
          throw error;
        }
        var pfx = {
          version: capture.version.charCodeAt(0),
          safeContents: [],
          /**
           * Gets bags with matching attributes.
           *
           * @param filter the attributes to filter by:
           *          [localKeyId] the localKeyId to search for.
           *          [localKeyIdHex] the localKeyId in hex to search for.
           *          [friendlyName] the friendly name to search for.
           *          [bagType] bag type to narrow each attribute search by.
           *
           * @return a map of attribute type to an array of matching bags or, if no
           *           attribute was given but a bag type, the map key will be the
           *           bag type.
           */
          getBags: function(filter) {
            var rval = {};
            var localKeyId;
            if ("localKeyId" in filter) {
              localKeyId = filter.localKeyId;
            } else if ("localKeyIdHex" in filter) {
              localKeyId = forge.util.hexToBytes(filter.localKeyIdHex);
            }
            if (localKeyId === void 0 && !("friendlyName" in filter) && "bagType" in filter) {
              rval[filter.bagType] = _getBagsByAttribute(
                pfx.safeContents,
                null,
                null,
                filter.bagType
              );
            }
            if (localKeyId !== void 0) {
              rval.localKeyId = _getBagsByAttribute(
                pfx.safeContents,
                "localKeyId",
                localKeyId,
                filter.bagType
              );
            }
            if ("friendlyName" in filter) {
              rval.friendlyName = _getBagsByAttribute(
                pfx.safeContents,
                "friendlyName",
                filter.friendlyName,
                filter.bagType
              );
            }
            return rval;
          },
          /**
           * DEPRECATED: use getBags() instead.
           *
           * Get bags with matching friendlyName attribute.
           *
           * @param friendlyName the friendly name to search for.
           * @param [bagType] bag type to narrow search by.
           *
           * @return an array of bags with matching friendlyName attribute.
           */
          getBagsByFriendlyName: function(friendlyName, bagType) {
            return _getBagsByAttribute(
              pfx.safeContents,
              "friendlyName",
              friendlyName,
              bagType
            );
          },
          /**
           * DEPRECATED: use getBags() instead.
           *
           * Get bags with matching localKeyId attribute.
           *
           * @param localKeyId the localKeyId to search for.
           * @param [bagType] bag type to narrow search by.
           *
           * @return an array of bags with matching localKeyId attribute.
           */
          getBagsByLocalKeyId: function(localKeyId, bagType) {
            return _getBagsByAttribute(
              pfx.safeContents,
              "localKeyId",
              localKeyId,
              bagType
            );
          }
        };
        if (capture.version.charCodeAt(0) !== 3) {
          var error = new Error("PKCS#12 PFX of version other than 3 not supported.");
          error.version = capture.version.charCodeAt(0);
          throw error;
        }
        if (asn1.derToOid(capture.contentType) !== pki.oids.data) {
          var error = new Error("Only PKCS#12 PFX in password integrity mode supported.");
          error.oid = asn1.derToOid(capture.contentType);
          throw error;
        }
        var data = capture.content.value[0];
        if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
          throw new Error("PKCS#12 authSafe content data is not an OCTET STRING.");
        }
        data = _decodePkcs7Data(data);
        if (capture.mac) {
          var md = null;
          var macKeyBytes = 0;
          var macAlgorithm = asn1.derToOid(capture.macAlgorithm);
          switch (macAlgorithm) {
            case pki.oids.sha1:
              md = forge.md.sha1.create();
              macKeyBytes = 20;
              break;
            case pki.oids.sha256:
              md = forge.md.sha256.create();
              macKeyBytes = 32;
              break;
            case pki.oids.sha384:
              md = forge.md.sha384.create();
              macKeyBytes = 48;
              break;
            case pki.oids.sha512:
              md = forge.md.sha512.create();
              macKeyBytes = 64;
              break;
            case pki.oids.md5:
              md = forge.md.md5.create();
              macKeyBytes = 16;
              break;
          }
          if (md === null) {
            throw new Error("PKCS#12 uses unsupported MAC algorithm: " + macAlgorithm);
          }
          var macSalt = new forge.util.ByteBuffer(capture.macSalt);
          var macIterations = "macIterations" in capture ? parseInt(forge.util.bytesToHex(capture.macIterations), 16) : 1;
          var macKey = p12.generateKey(
            password,
            macSalt,
            3,
            macIterations,
            macKeyBytes,
            md
          );
          var mac = forge.hmac.create();
          mac.start(md, macKey);
          mac.update(data.value);
          var macValue = mac.getMac();
          if (macValue.getBytes() !== capture.macDigest) {
            throw new Error("PKCS#12 MAC could not be verified. Invalid password?");
          }
        } else if (Array.isArray(obj.value) && obj.value.length > 2) {
          throw new Error("Invalid PKCS#12. macData field present but MAC was not validated.");
        }
        _decodeAuthenticatedSafe(pfx, data.value, strict, password);
        return pfx;
      };
      function _decodePkcs7Data(data) {
        if (data.composed || data.constructed) {
          var value = forge.util.createBuffer();
          for (var i = 0; i < data.value.length; ++i) {
            value.putBytes(data.value[i].value);
          }
          data.composed = data.constructed = false;
          data.value = value.getBytes();
        }
        return data;
      }
      function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
        authSafe = asn1.fromDer(authSafe, strict);
        if (authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== true) {
          throw new Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
        }
        for (var i = 0; i < authSafe.value.length; i++) {
          var contentInfo = authSafe.value[i];
          var capture = {};
          var errors = [];
          if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors)) {
            var error = new Error("Cannot read ContentInfo.");
            error.errors = errors;
            throw error;
          }
          var obj = {
            encrypted: false
          };
          var safeContents = null;
          var data = capture.content.value[0];
          switch (asn1.derToOid(capture.contentType)) {
            case pki.oids.data:
              if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
                throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
              }
              safeContents = _decodePkcs7Data(data).value;
              break;
            case pki.oids.encryptedData:
              safeContents = _decryptSafeContents(data, password);
              obj.encrypted = true;
              break;
            default:
              var error = new Error("Unsupported PKCS#12 contentType.");
              error.contentType = asn1.derToOid(capture.contentType);
              throw error;
          }
          obj.safeBags = _decodeSafeContents(safeContents, strict, password);
          pfx.safeContents.push(obj);
        }
      }
      function _decryptSafeContents(data, password) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(
          data,
          forge.pkcs7.asn1.encryptedDataValidator,
          capture,
          errors
        )) {
          var error = new Error("Cannot read EncryptedContentInfo.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.contentType);
        if (oid !== pki.oids.data) {
          var error = new Error(
            "PKCS#12 EncryptedContentInfo ContentType is not Data."
          );
          error.oid = oid;
          throw error;
        }
        oid = asn1.derToOid(capture.encAlgorithm);
        var cipher = pki.pbe.getCipher(oid, capture.encParameter, password);
        var encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1);
        var encrypted = forge.util.createBuffer(encryptedContentAsn1.value);
        cipher.update(encrypted);
        if (!cipher.finish()) {
          throw new Error("Failed to decrypt PKCS#12 SafeContents.");
        }
        return cipher.output.getBytes();
      }
      function _decodeSafeContents(safeContents, strict, password) {
        if (!strict && safeContents.length === 0) {
          return [];
        }
        safeContents = asn1.fromDer(safeContents, strict);
        if (safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== true) {
          throw new Error(
            "PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag."
          );
        }
        var res = [];
        for (var i = 0; i < safeContents.value.length; i++) {
          var safeBag = safeContents.value[i];
          var capture = {};
          var errors = [];
          if (!asn1.validate(safeBag, safeBagValidator, capture, errors)) {
            var error = new Error("Cannot read SafeBag.");
            error.errors = errors;
            throw error;
          }
          var bag = {
            type: asn1.derToOid(capture.bagId),
            attributes: _decodeBagAttributes(capture.bagAttributes)
          };
          res.push(bag);
          var validator, decoder;
          var bagAsn1 = capture.bagValue.value[0];
          switch (bag.type) {
            case pki.oids.pkcs8ShroudedKeyBag:
              bagAsn1 = pki.decryptPrivateKeyInfo(bagAsn1, password);
              if (bagAsn1 === null) {
                throw new Error(
                  "Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?"
                );
              }
            /* fall through */
            case pki.oids.keyBag:
              try {
                bag.key = pki.privateKeyFromAsn1(bagAsn1);
              } catch (e) {
                bag.key = null;
                bag.asn1 = bagAsn1;
              }
              continue;
            /* Nothing more to do. */
            case pki.oids.certBag:
              validator = certBagValidator;
              decoder = function() {
                if (asn1.derToOid(capture.certId) !== pki.oids.x509Certificate) {
                  var error2 = new Error(
                    "Unsupported certificate type, only X.509 supported."
                  );
                  error2.oid = asn1.derToOid(capture.certId);
                  throw error2;
                }
                var certAsn1 = asn1.fromDer(capture.cert, strict);
                try {
                  bag.cert = pki.certificateFromAsn1(certAsn1, true);
                } catch (e) {
                  bag.cert = null;
                  bag.asn1 = certAsn1;
                }
              };
              break;
            default:
              var error = new Error("Unsupported PKCS#12 SafeBag type.");
              error.oid = bag.type;
              throw error;
          }
          if (validator !== void 0 && !asn1.validate(bagAsn1, validator, capture, errors)) {
            var error = new Error("Cannot read PKCS#12 " + validator.name);
            error.errors = errors;
            throw error;
          }
          decoder();
        }
        return res;
      }
      function _decodeBagAttributes(attributes) {
        var decodedAttrs = {};
        if (attributes !== void 0) {
          for (var i = 0; i < attributes.length; ++i) {
            var capture = {};
            var errors = [];
            if (!asn1.validate(attributes[i], attributeValidator, capture, errors)) {
              var error = new Error("Cannot read PKCS#12 BagAttribute.");
              error.errors = errors;
              throw error;
            }
            var oid = asn1.derToOid(capture.oid);
            if (pki.oids[oid] === void 0) {
              continue;
            }
            decodedAttrs[pki.oids[oid]] = [];
            for (var j = 0; j < capture.values.length; ++j) {
              decodedAttrs[pki.oids[oid]].push(capture.values[j].value);
            }
          }
        }
        return decodedAttrs;
      }
      p12.toPkcs12Asn1 = function(key, cert, password, options) {
        options = options || {};
        options.saltSize = options.saltSize || 8;
        options.count = options.count || 2048;
        options.algorithm = options.algorithm || options.encAlgorithm || "aes128";
        if (!("useMac" in options)) {
          options.useMac = true;
        }
        if (!("localKeyId" in options)) {
          options.localKeyId = null;
        }
        if (!("generateLocalKeyId" in options)) {
          options.generateLocalKeyId = true;
        }
        var localKeyId = options.localKeyId;
        var bagAttrs;
        if (localKeyId !== null) {
          localKeyId = forge.util.hexToBytes(localKeyId);
        } else if (options.generateLocalKeyId) {
          if (cert) {
            var pairedCert = forge.util.isArray(cert) ? cert[0] : cert;
            if (typeof pairedCert === "string") {
              pairedCert = pki.certificateFromPem(pairedCert);
            }
            var sha1 = forge.md.sha1.create();
            sha1.update(asn1.toDer(pki.certificateToAsn1(pairedCert)).getBytes());
            localKeyId = sha1.digest().getBytes();
          } else {
            localKeyId = forge.random.getBytes(20);
          }
        }
        var attrs = [];
        if (localKeyId !== null) {
          attrs.push(
            // localKeyID
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // attrId
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(pki.oids.localKeyId).getBytes()
              ),
              // attrValues
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OCTETSTRING,
                  false,
                  localKeyId
                )
              ])
            ])
          );
        }
        if ("friendlyName" in options) {
          attrs.push(
            // friendlyName
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // attrId
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(pki.oids.friendlyName).getBytes()
              ),
              // attrValues
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.BMPSTRING,
                  false,
                  options.friendlyName
                )
              ])
            ])
          );
        }
        if (attrs.length > 0) {
          bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, attrs);
        }
        var contents = [];
        var chain = [];
        if (cert !== null) {
          if (forge.util.isArray(cert)) {
            chain = cert;
          } else {
            chain = [cert];
          }
        }
        var certSafeBags = [];
        for (var i = 0; i < chain.length; ++i) {
          cert = chain[i];
          if (typeof cert === "string") {
            cert = pki.certificateFromPem(cert);
          }
          var certBagAttrs = i === 0 ? bagAttrs : void 0;
          var certAsn1 = pki.certificateToAsn1(cert);
          var certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // bagId
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(pki.oids.certBag).getBytes()
            ),
            // bagValue
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
              // CertBag
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // certId
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(pki.oids.x509Certificate).getBytes()
                ),
                // certValue (x509Certificate)
                asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OCTETSTRING,
                    false,
                    asn1.toDer(certAsn1).getBytes()
                  )
                ])
              ])
            ]),
            // bagAttributes (OPTIONAL)
            certBagAttrs
          ]);
          certSafeBags.push(certSafeBag);
        }
        if (certSafeBags.length > 0) {
          var certSafeContents = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.SEQUENCE,
            true,
            certSafeBags
          );
          var certCI = (
            // PKCS#7 ContentInfo
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // contentType
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                // OID for the content type is 'data'
                asn1.oidToDer(pki.oids.data).getBytes()
              ),
              // content
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OCTETSTRING,
                  false,
                  asn1.toDer(certSafeContents).getBytes()
                )
              ])
            ])
          );
          contents.push(certCI);
        }
        var keyBag = null;
        if (key !== null) {
          var pkAsn1 = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(key));
          if (password === null) {
            keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // bagId
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(pki.oids.keyBag).getBytes()
              ),
              // bagValue
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                // PrivateKeyInfo
                pkAsn1
              ]),
              // bagAttributes (OPTIONAL)
              bagAttrs
            ]);
          } else {
            keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // bagId
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(pki.oids.pkcs8ShroudedKeyBag).getBytes()
              ),
              // bagValue
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                // EncryptedPrivateKeyInfo
                pki.encryptPrivateKeyInfo(pkAsn1, password, options)
              ]),
              // bagAttributes (OPTIONAL)
              bagAttrs
            ]);
          }
          var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [keyBag]);
          var keyCI = (
            // PKCS#7 ContentInfo
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // contentType
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                // OID for the content type is 'data'
                asn1.oidToDer(pki.oids.data).getBytes()
              ),
              // content
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OCTETSTRING,
                  false,
                  asn1.toDer(keySafeContents).getBytes()
                )
              ])
            ])
          );
          contents.push(keyCI);
        }
        var safe = asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.SEQUENCE,
          true,
          contents
        );
        var macData;
        if (options.useMac) {
          var sha1 = forge.md.sha1.create();
          var macSalt = new forge.util.ByteBuffer(
            forge.random.getBytes(options.saltSize)
          );
          var count = options.count;
          var key = p12.generateKey(password, macSalt, 3, count, 20);
          var mac = forge.hmac.create();
          mac.start(sha1, key);
          mac.update(asn1.toDer(safe).getBytes());
          var macValue = mac.getMac();
          macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // mac DigestInfo
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // digestAlgorithm
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // algorithm = SHA-1
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(pki.oids.sha1).getBytes()
                ),
                // parameters = Null
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
              ]),
              // digest
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OCTETSTRING,
                false,
                macValue.getBytes()
              )
            ]),
            // macSalt OCTET STRING
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OCTETSTRING,
              false,
              macSalt.getBytes()
            ),
            // iterations INTEGER (XXX: Only support count < 65536)
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              asn1.integerToDer(count).getBytes()
            )
          ]);
        }
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version (3)
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(3).getBytes()
          ),
          // PKCS#7 ContentInfo
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // contentType
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              // OID for the content type is 'data'
              asn1.oidToDer(pki.oids.data).getBytes()
            ),
            // content
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OCTETSTRING,
                false,
                asn1.toDer(safe).getBytes()
              )
            ])
          ]),
          macData
        ]);
      };
      p12.generateKey = forge.pbe.generatePkcs12Key;
    }
  });

  // node_modules/node-forge/lib/pki.js
  var require_pki = __commonJS({
    "node_modules/node-forge/lib/pki.js"(exports, module) {
      var forge = require_forge();
      require_asn12();
      require_oids();
      require_pbe();
      require_pem();
      require_pbkdf22();
      require_pkcs12();
      require_pss();
      require_rsa();
      require_util();
      require_x509();
      var asn1 = forge.asn1;
      var pki = module.exports = forge.pki = forge.pki || {};
      pki.pemToDer = function(pem) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert PEM to DER; PEM is encrypted.");
        }
        return forge.util.createBuffer(msg.body);
      };
      pki.privateKeyFromPem = function(pem) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
          var error = new Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert private key from PEM; PEM is encrypted.");
        }
        var obj = asn1.fromDer(msg.body);
        return pki.privateKeyFromAsn1(obj);
      };
      pki.privateKeyToPem = function(key, maxline) {
        var msg = {
          type: "RSA PRIVATE KEY",
          body: asn1.toDer(pki.privateKeyToAsn1(key)).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
      pki.privateKeyInfoToPem = function(pki2, maxline) {
        var msg = {
          type: "PRIVATE KEY",
          body: asn1.toDer(pki2).getBytes()
        };
        return forge.pem.encode(msg, { maxline });
      };
    }
  });

  // node_modules/node-forge/lib/tls.js
  var require_tls = __commonJS({
    "node_modules/node-forge/lib/tls.js"(exports, module) {
      var forge = require_forge();
      require_asn12();
      require_hmac2();
      require_md52();
      require_pem();
      require_pki();
      require_random();
      require_sha12();
      require_util();
      var prf_TLS1 = function(secret, label, seed, length) {
        var rval = forge.util.createBuffer();
        var idx = secret.length >> 1;
        var slen = idx + (secret.length & 1);
        var s1 = secret.substr(0, slen);
        var s2 = secret.substr(idx, slen);
        var ai = forge.util.createBuffer();
        var hmac = forge.hmac.create();
        seed = label + seed;
        var md5itr = Math.ceil(length / 16);
        var sha1itr = Math.ceil(length / 20);
        hmac.start("MD5", s1);
        var md5bytes = forge.util.createBuffer();
        ai.putBytes(seed);
        for (var i = 0; i < md5itr; ++i) {
          hmac.start(null, null);
          hmac.update(ai.getBytes());
          ai.putBuffer(hmac.digest());
          hmac.start(null, null);
          hmac.update(ai.bytes() + seed);
          md5bytes.putBuffer(hmac.digest());
        }
        hmac.start("SHA1", s2);
        var sha1bytes = forge.util.createBuffer();
        ai.clear();
        ai.putBytes(seed);
        for (var i = 0; i < sha1itr; ++i) {
          hmac.start(null, null);
          hmac.update(ai.getBytes());
          ai.putBuffer(hmac.digest());
          hmac.start(null, null);
          hmac.update(ai.bytes() + seed);
          sha1bytes.putBuffer(hmac.digest());
        }
        rval.putBytes(forge.util.xorBytes(
          md5bytes.getBytes(),
          sha1bytes.getBytes(),
          length
        ));
        return rval;
      };
      var hmac_sha1 = function(key2, seqNum, record) {
        var hmac = forge.hmac.create();
        hmac.start("SHA1", key2);
        var b = forge.util.createBuffer();
        b.putInt32(seqNum[0]);
        b.putInt32(seqNum[1]);
        b.putByte(record.type);
        b.putByte(record.version.major);
        b.putByte(record.version.minor);
        b.putInt16(record.length);
        b.putBytes(record.fragment.bytes());
        hmac.update(b.getBytes());
        return hmac.digest().getBytes();
      };
      var deflate = function(c, record, s) {
        var rval = false;
        try {
          var bytes = c.deflate(record.fragment.getBytes());
          record.fragment = forge.util.createBuffer(bytes);
          record.length = bytes.length;
          rval = true;
        } catch (ex) {
        }
        return rval;
      };
      var inflate = function(c, record, s) {
        var rval = false;
        try {
          var bytes = c.inflate(record.fragment.getBytes());
          record.fragment = forge.util.createBuffer(bytes);
          record.length = bytes.length;
          rval = true;
        } catch (ex) {
        }
        return rval;
      };
      var readVector = function(b, lenBytes) {
        var len = 0;
        switch (lenBytes) {
          case 1:
            len = b.getByte();
            break;
          case 2:
            len = b.getInt16();
            break;
          case 3:
            len = b.getInt24();
            break;
          case 4:
            len = b.getInt32();
            break;
        }
        return forge.util.createBuffer(b.getBytes(len));
      };
      var writeVector = function(b, lenBytes, v) {
        b.putInt(v.length(), lenBytes << 3);
        b.putBuffer(v);
      };
      var tls = {};
      tls.Versions = {
        TLS_1_0: { major: 3, minor: 1 },
        TLS_1_1: { major: 3, minor: 2 },
        TLS_1_2: { major: 3, minor: 3 }
      };
      tls.SupportedVersions = [
        tls.Versions.TLS_1_1,
        tls.Versions.TLS_1_0
      ];
      tls.Version = tls.SupportedVersions[0];
      tls.MaxFragment = 16384 - 1024;
      tls.ConnectionEnd = {
        server: 0,
        client: 1
      };
      tls.PRFAlgorithm = {
        tls_prf_sha256: 0
      };
      tls.BulkCipherAlgorithm = {
        none: null,
        rc4: 0,
        des3: 1,
        aes: 2
      };
      tls.CipherType = {
        stream: 0,
        block: 1,
        aead: 2
      };
      tls.MACAlgorithm = {
        none: null,
        hmac_md5: 0,
        hmac_sha1: 1,
        hmac_sha256: 2,
        hmac_sha384: 3,
        hmac_sha512: 4
      };
      tls.CompressionMethod = {
        none: 0,
        deflate: 1
      };
      tls.ContentType = {
        change_cipher_spec: 20,
        alert: 21,
        handshake: 22,
        application_data: 23,
        heartbeat: 24
      };
      tls.HandshakeType = {
        hello_request: 0,
        client_hello: 1,
        server_hello: 2,
        certificate: 11,
        server_key_exchange: 12,
        certificate_request: 13,
        server_hello_done: 14,
        certificate_verify: 15,
        client_key_exchange: 16,
        finished: 20
      };
      tls.Alert = {};
      tls.Alert.Level = {
        warning: 1,
        fatal: 2
      };
      tls.Alert.Description = {
        close_notify: 0,
        unexpected_message: 10,
        bad_record_mac: 20,
        decryption_failed: 21,
        record_overflow: 22,
        decompression_failure: 30,
        handshake_failure: 40,
        bad_certificate: 42,
        unsupported_certificate: 43,
        certificate_revoked: 44,
        certificate_expired: 45,
        certificate_unknown: 46,
        illegal_parameter: 47,
        unknown_ca: 48,
        access_denied: 49,
        decode_error: 50,
        decrypt_error: 51,
        export_restriction: 60,
        protocol_version: 70,
        insufficient_security: 71,
        internal_error: 80,
        user_canceled: 90,
        no_renegotiation: 100
      };
      tls.HeartbeatMessageType = {
        heartbeat_request: 1,
        heartbeat_response: 2
      };
      tls.CipherSuites = {};
      tls.getCipherSuite = function(twoBytes) {
        var rval = null;
        for (var key2 in tls.CipherSuites) {
          var cs = tls.CipherSuites[key2];
          if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
            rval = cs;
            break;
          }
        }
        return rval;
      };
      tls.handleUnexpected = function(c, record) {
        var ignore = !c.open && c.entity === tls.ConnectionEnd.client;
        if (!ignore) {
          c.error(c, {
            message: "Unexpected message. Received TLS record out of order.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.unexpected_message
            }
          });
        }
      };
      tls.handleHelloRequest = function(c, record, length) {
        if (!c.handshaking && c.handshakes > 0) {
          tls.queue(c, tls.createAlert(c, {
            level: tls.Alert.Level.warning,
            description: tls.Alert.Description.no_renegotiation
          }));
          tls.flush(c);
        }
        c.process();
      };
      tls.parseHelloMessage = function(c, record, length) {
        var msg = null;
        var client = c.entity === tls.ConnectionEnd.client;
        if (length < 38) {
          c.error(c, {
            message: client ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        } else {
          var b = record.fragment;
          var remaining = b.length();
          msg = {
            version: {
              major: b.getByte(),
              minor: b.getByte()
            },
            random: forge.util.createBuffer(b.getBytes(32)),
            session_id: readVector(b, 1),
            extensions: []
          };
          if (client) {
            msg.cipher_suite = b.getBytes(2);
            msg.compression_method = b.getByte();
          } else {
            msg.cipher_suites = readVector(b, 2);
            msg.compression_methods = readVector(b, 1);
          }
          remaining = length - (remaining - b.length());
          if (remaining > 0) {
            var exts = readVector(b, 2);
            while (exts.length() > 0) {
              msg.extensions.push({
                type: [exts.getByte(), exts.getByte()],
                data: readVector(exts, 2)
              });
            }
            if (!client) {
              for (var i = 0; i < msg.extensions.length; ++i) {
                var ext = msg.extensions[i];
                if (ext.type[0] === 0 && ext.type[1] === 0) {
                  var snl = readVector(ext.data, 2);
                  while (snl.length() > 0) {
                    var snType = snl.getByte();
                    if (snType !== 0) {
                      break;
                    }
                    c.session.extensions.server_name.serverNameList.push(
                      readVector(snl, 2).getBytes()
                    );
                  }
                }
              }
            }
          }
          if (c.session.version) {
            if (msg.version.major !== c.session.version.major || msg.version.minor !== c.session.version.minor) {
              return c.error(c, {
                message: "TLS version change is disallowed during renegotiation.",
                send: true,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.protocol_version
                }
              });
            }
          }
          if (client) {
            c.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
          } else {
            var tmp = forge.util.createBuffer(msg.cipher_suites.bytes());
            while (tmp.length() > 0) {
              c.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2));
              if (c.session.cipherSuite !== null) {
                break;
              }
            }
          }
          if (c.session.cipherSuite === null) {
            return c.error(c, {
              message: "No cipher suites in common.",
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.handshake_failure
              },
              cipherSuite: forge.util.bytesToHex(msg.cipher_suite)
            });
          }
          if (client) {
            c.session.compressionMethod = msg.compression_method;
          } else {
            c.session.compressionMethod = tls.CompressionMethod.none;
          }
        }
        return msg;
      };
      tls.createSecurityParameters = function(c, msg) {
        var client = c.entity === tls.ConnectionEnd.client;
        var msgRandom = msg.random.bytes();
        var cRandom = client ? c.session.sp.client_random : msgRandom;
        var sRandom = client ? msgRandom : tls.createRandom().getBytes();
        c.session.sp = {
          entity: c.entity,
          prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
          bulk_cipher_algorithm: null,
          cipher_type: null,
          enc_key_length: null,
          block_length: null,
          fixed_iv_length: null,
          record_iv_length: null,
          mac_algorithm: null,
          mac_length: null,
          mac_key_length: null,
          compression_algorithm: c.session.compressionMethod,
          pre_master_secret: null,
          master_secret: null,
          client_random: cRandom,
          server_random: sRandom
        };
      };
      tls.handleServerHello = function(c, record, length) {
        var msg = tls.parseHelloMessage(c, record, length);
        if (c.fail) {
          return;
        }
        if (msg.version.minor <= c.version.minor) {
          c.version.minor = msg.version.minor;
        } else {
          return c.error(c, {
            message: "Incompatible TLS version.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
        }
        c.session.version = c.version;
        var sessionId = msg.session_id.bytes();
        if (sessionId.length > 0 && sessionId === c.session.id) {
          c.expect = SCC;
          c.session.resuming = true;
          c.session.sp.server_random = msg.random.bytes();
        } else {
          c.expect = SCE;
          c.session.resuming = false;
          tls.createSecurityParameters(c, msg);
        }
        c.session.id = sessionId;
        c.process();
      };
      tls.handleClientHello = function(c, record, length) {
        var msg = tls.parseHelloMessage(c, record, length);
        if (c.fail) {
          return;
        }
        var sessionId = msg.session_id.bytes();
        var session = null;
        if (c.sessionCache) {
          session = c.sessionCache.getSession(sessionId);
          if (session === null) {
            sessionId = "";
          } else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor) {
            session = null;
            sessionId = "";
          }
        }
        if (sessionId.length === 0) {
          sessionId = forge.random.getBytes(32);
        }
        c.session.id = sessionId;
        c.session.clientHelloVersion = msg.version;
        c.session.sp = {};
        if (session) {
          c.version = c.session.version = session.version;
          c.session.sp = session.sp;
        } else {
          var version;
          for (var i = 1; i < tls.SupportedVersions.length; ++i) {
            version = tls.SupportedVersions[i];
            if (version.minor <= msg.version.minor) {
              break;
            }
          }
          c.version = { major: version.major, minor: version.minor };
          c.session.version = c.version;
        }
        if (session !== null) {
          c.expect = CCC;
          c.session.resuming = true;
          c.session.sp.client_random = msg.random.bytes();
        } else {
          c.expect = c.verifyClient !== false ? CCE : CKE;
          c.session.resuming = false;
          tls.createSecurityParameters(c, msg);
        }
        c.open = true;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createServerHello(c)
        }));
        if (c.session.resuming) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.change_cipher_spec,
            data: tls.createChangeCipherSpec()
          }));
          c.state.pending = tls.createConnectionState(c);
          c.state.current.write = c.state.pending.write;
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createFinished(c)
          }));
        } else {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createCertificate(c)
          }));
          if (!c.fail) {
            tls.queue(c, tls.createRecord(c, {
              type: tls.ContentType.handshake,
              data: tls.createServerKeyExchange(c)
            }));
            if (c.verifyClient !== false) {
              tls.queue(c, tls.createRecord(c, {
                type: tls.ContentType.handshake,
                data: tls.createCertificateRequest(c)
              }));
            }
            tls.queue(c, tls.createRecord(c, {
              type: tls.ContentType.handshake,
              data: tls.createServerHelloDone(c)
            }));
          }
        }
        tls.flush(c);
        c.process();
      };
      tls.handleCertificate = function(c, record, length) {
        if (length < 3) {
          return c.error(c, {
            message: "Invalid Certificate message. Message too short.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        }
        var b = record.fragment;
        var msg = {
          certificate_list: readVector(b, 3)
        };
        var cert, asn1;
        var certs = [];
        try {
          while (msg.certificate_list.length() > 0) {
            cert = readVector(msg.certificate_list, 3);
            asn1 = forge.asn1.fromDer(cert);
            cert = forge.pki.certificateFromAsn1(asn1, true);
            certs.push(cert);
          }
        } catch (ex) {
          return c.error(c, {
            message: "Could not parse certificate list.",
            cause: ex,
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_certificate
            }
          });
        }
        var client = c.entity === tls.ConnectionEnd.client;
        if ((client || c.verifyClient === true) && certs.length === 0) {
          c.error(c, {
            message: client ? "No server certificate provided." : "No client certificate provided.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        } else if (certs.length === 0) {
          c.expect = client ? SKE : CKE;
        } else {
          if (client) {
            c.session.serverCertificate = certs[0];
          } else {
            c.session.clientCertificate = certs[0];
          }
          if (tls.verifyCertificateChain(c, certs)) {
            c.expect = client ? SKE : CKE;
          }
        }
        c.process();
      };
      tls.handleServerKeyExchange = function(c, record, length) {
        if (length > 0) {
          return c.error(c, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.unsupported_certificate
            }
          });
        }
        c.expect = SCR;
        c.process();
      };
      tls.handleClientKeyExchange = function(c, record, length) {
        if (length < 48) {
          return c.error(c, {
            message: "Invalid key parameters. Only RSA is supported.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.unsupported_certificate
            }
          });
        }
        var b = record.fragment;
        var msg = {
          enc_pre_master_secret: readVector(b, 2).getBytes()
        };
        var privateKey = null;
        if (c.getPrivateKey) {
          try {
            privateKey = c.getPrivateKey(c, c.session.serverCertificate);
            privateKey = forge.pki.privateKeyFromPem(privateKey);
          } catch (ex) {
            c.error(c, {
              message: "Could not get private key.",
              cause: ex,
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.internal_error
              }
            });
          }
        }
        if (privateKey === null) {
          return c.error(c, {
            message: "No private key set.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
        try {
          var sp = c.session.sp;
          sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
          var version = c.session.clientHelloVersion;
          if (version.major !== sp.pre_master_secret.charCodeAt(0) || version.minor !== sp.pre_master_secret.charCodeAt(1)) {
            throw new Error("TLS version rollback attack detected.");
          }
        } catch (ex) {
          sp.pre_master_secret = forge.random.getBytes(48);
        }
        c.expect = CCC;
        if (c.session.clientCertificate !== null) {
          c.expect = CCV;
        }
        c.process();
      };
      tls.handleCertificateRequest = function(c, record, length) {
        if (length < 3) {
          return c.error(c, {
            message: "Invalid CertificateRequest. Message too short.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        }
        var b = record.fragment;
        var msg = {
          certificate_types: readVector(b, 1),
          certificate_authorities: readVector(b, 2)
        };
        c.session.certificateRequest = msg;
        c.expect = SHD;
        c.process();
      };
      tls.handleCertificateVerify = function(c, record, length) {
        if (length < 2) {
          return c.error(c, {
            message: "Invalid CertificateVerify. Message too short.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        }
        var b = record.fragment;
        b.read -= 4;
        var msgBytes = b.bytes();
        b.read += 4;
        var msg = {
          signature: readVector(b, 2).getBytes()
        };
        var verify = forge.util.createBuffer();
        verify.putBuffer(c.session.md5.digest());
        verify.putBuffer(c.session.sha1.digest());
        verify = verify.getBytes();
        try {
          var cert = c.session.clientCertificate;
          if (!cert.publicKey.verify(verify, msg.signature, "NONE")) {
            throw new Error("CertificateVerify signature does not match.");
          }
          c.session.md5.update(msgBytes);
          c.session.sha1.update(msgBytes);
        } catch (ex) {
          return c.error(c, {
            message: "Bad signature in CertificateVerify.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.handshake_failure
            }
          });
        }
        c.expect = CCC;
        c.process();
      };
      tls.handleServerHelloDone = function(c, record, length) {
        if (length > 0) {
          return c.error(c, {
            message: "Invalid ServerHelloDone message. Invalid length.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.record_overflow
            }
          });
        }
        if (c.serverCertificate === null) {
          var error = {
            message: "No server certificate provided. Not enough security.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.insufficient_security
            }
          };
          var depth = 0;
          var ret = c.verify(c, error.alert.description, depth, []);
          if (ret !== true) {
            if (ret || ret === 0) {
              if (typeof ret === "object" && !forge.util.isArray(ret)) {
                if (ret.message) {
                  error.message = ret.message;
                }
                if (ret.alert) {
                  error.alert.description = ret.alert;
                }
              } else if (typeof ret === "number") {
                error.alert.description = ret;
              }
            }
            return c.error(c, error);
          }
        }
        if (c.session.certificateRequest !== null) {
          record = tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createCertificate(c)
          });
          tls.queue(c, record);
        }
        record = tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createClientKeyExchange(c)
        });
        tls.queue(c, record);
        c.expect = SER;
        var callback = function(c2, signature) {
          if (c2.session.certificateRequest !== null && c2.session.clientCertificate !== null) {
            tls.queue(c2, tls.createRecord(c2, {
              type: tls.ContentType.handshake,
              data: tls.createCertificateVerify(c2, signature)
            }));
          }
          tls.queue(c2, tls.createRecord(c2, {
            type: tls.ContentType.change_cipher_spec,
            data: tls.createChangeCipherSpec()
          }));
          c2.state.pending = tls.createConnectionState(c2);
          c2.state.current.write = c2.state.pending.write;
          tls.queue(c2, tls.createRecord(c2, {
            type: tls.ContentType.handshake,
            data: tls.createFinished(c2)
          }));
          c2.expect = SCC;
          tls.flush(c2);
          c2.process();
        };
        if (c.session.certificateRequest === null || c.session.clientCertificate === null) {
          return callback(c, null);
        }
        tls.getClientSignature(c, callback);
      };
      tls.handleChangeCipherSpec = function(c, record) {
        if (record.fragment.getByte() !== 1) {
          return c.error(c, {
            message: "Invalid ChangeCipherSpec message received.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.illegal_parameter
            }
          });
        }
        var client = c.entity === tls.ConnectionEnd.client;
        if (c.session.resuming && client || !c.session.resuming && !client) {
          c.state.pending = tls.createConnectionState(c);
        }
        c.state.current.read = c.state.pending.read;
        if (!c.session.resuming && client || c.session.resuming && !client) {
          c.state.pending = null;
        }
        c.expect = client ? SFI : CFI;
        c.process();
      };
      tls.handleFinished = function(c, record, length) {
        var b = record.fragment;
        b.read -= 4;
        var msgBytes = b.bytes();
        b.read += 4;
        var vd = record.fragment.getBytes();
        b = forge.util.createBuffer();
        b.putBuffer(c.session.md5.digest());
        b.putBuffer(c.session.sha1.digest());
        var client = c.entity === tls.ConnectionEnd.client;
        var label = client ? "server finished" : "client finished";
        var sp = c.session.sp;
        var vdl = 12;
        var prf = prf_TLS1;
        b = prf(sp.master_secret, label, b.getBytes(), vdl);
        if (b.getBytes() !== vd) {
          return c.error(c, {
            message: "Invalid verify_data in Finished message.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.decrypt_error
            }
          });
        }
        c.session.md5.update(msgBytes);
        c.session.sha1.update(msgBytes);
        if (c.session.resuming && client || !c.session.resuming && !client) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.change_cipher_spec,
            data: tls.createChangeCipherSpec()
          }));
          c.state.current.write = c.state.pending.write;
          c.state.pending = null;
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createFinished(c)
          }));
        }
        c.expect = client ? SAD : CAD;
        c.handshaking = false;
        ++c.handshakes;
        c.peerCertificate = client ? c.session.serverCertificate : c.session.clientCertificate;
        tls.flush(c);
        c.isConnected = true;
        c.connected(c);
        c.process();
      };
      tls.handleAlert = function(c, record) {
        var b = record.fragment;
        var alert = {
          level: b.getByte(),
          description: b.getByte()
        };
        var msg;
        switch (alert.description) {
          case tls.Alert.Description.close_notify:
            msg = "Connection closed.";
            break;
          case tls.Alert.Description.unexpected_message:
            msg = "Unexpected message.";
            break;
          case tls.Alert.Description.bad_record_mac:
            msg = "Bad record MAC.";
            break;
          case tls.Alert.Description.decryption_failed:
            msg = "Decryption failed.";
            break;
          case tls.Alert.Description.record_overflow:
            msg = "Record overflow.";
            break;
          case tls.Alert.Description.decompression_failure:
            msg = "Decompression failed.";
            break;
          case tls.Alert.Description.handshake_failure:
            msg = "Handshake failure.";
            break;
          case tls.Alert.Description.bad_certificate:
            msg = "Bad certificate.";
            break;
          case tls.Alert.Description.unsupported_certificate:
            msg = "Unsupported certificate.";
            break;
          case tls.Alert.Description.certificate_revoked:
            msg = "Certificate revoked.";
            break;
          case tls.Alert.Description.certificate_expired:
            msg = "Certificate expired.";
            break;
          case tls.Alert.Description.certificate_unknown:
            msg = "Certificate unknown.";
            break;
          case tls.Alert.Description.illegal_parameter:
            msg = "Illegal parameter.";
            break;
          case tls.Alert.Description.unknown_ca:
            msg = "Unknown certificate authority.";
            break;
          case tls.Alert.Description.access_denied:
            msg = "Access denied.";
            break;
          case tls.Alert.Description.decode_error:
            msg = "Decode error.";
            break;
          case tls.Alert.Description.decrypt_error:
            msg = "Decrypt error.";
            break;
          case tls.Alert.Description.export_restriction:
            msg = "Export restriction.";
            break;
          case tls.Alert.Description.protocol_version:
            msg = "Unsupported protocol version.";
            break;
          case tls.Alert.Description.insufficient_security:
            msg = "Insufficient security.";
            break;
          case tls.Alert.Description.internal_error:
            msg = "Internal error.";
            break;
          case tls.Alert.Description.user_canceled:
            msg = "User canceled.";
            break;
          case tls.Alert.Description.no_renegotiation:
            msg = "Renegotiation not supported.";
            break;
          default:
            msg = "Unknown error.";
            break;
        }
        if (alert.description === tls.Alert.Description.close_notify) {
          return c.close();
        }
        c.error(c, {
          message: msg,
          send: false,
          // origin is the opposite end
          origin: c.entity === tls.ConnectionEnd.client ? "server" : "client",
          alert
        });
        c.process();
      };
      tls.handleHandshake = function(c, record) {
        var b = record.fragment;
        var type = b.getByte();
        var length = b.getInt24();
        if (length > b.length()) {
          c.fragmented = record;
          record.fragment = forge.util.createBuffer();
          b.read -= 4;
          return c.process();
        }
        c.fragmented = null;
        b.read -= 4;
        var bytes = b.bytes(length + 4);
        b.read += 4;
        if (type in hsTable[c.entity][c.expect]) {
          if (c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
            c.handshaking = true;
            c.session = {
              version: null,
              extensions: {
                server_name: {
                  serverNameList: []
                }
              },
              cipherSuite: null,
              compressionMethod: null,
              serverCertificate: null,
              clientCertificate: null,
              md5: forge.md.md5.create(),
              sha1: forge.md.sha1.create()
            };
          }
          if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished) {
            c.session.md5.update(bytes);
            c.session.sha1.update(bytes);
          }
          hsTable[c.entity][c.expect][type](c, record, length);
        } else {
          tls.handleUnexpected(c, record);
        }
      };
      tls.handleApplicationData = function(c, record) {
        c.data.putBuffer(record.fragment);
        c.dataReady(c);
        c.process();
      };
      tls.handleHeartbeat = function(c, record) {
        var b = record.fragment;
        var type = b.getByte();
        var length = b.getInt16();
        var payload = b.getBytes(length);
        if (type === tls.HeartbeatMessageType.heartbeat_request) {
          if (c.handshaking || length > payload.length) {
            return c.process();
          }
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.heartbeat,
            data: tls.createHeartbeat(
              tls.HeartbeatMessageType.heartbeat_response,
              payload
            )
          }));
          tls.flush(c);
        } else if (type === tls.HeartbeatMessageType.heartbeat_response) {
          if (payload !== c.expectedHeartbeatPayload) {
            return c.process();
          }
          if (c.heartbeatReceived) {
            c.heartbeatReceived(c, forge.util.createBuffer(payload));
          }
        }
        c.process();
      };
      var SHE = 0;
      var SCE = 1;
      var SKE = 2;
      var SCR = 3;
      var SHD = 4;
      var SCC = 5;
      var SFI = 6;
      var SAD = 7;
      var SER = 8;
      var CHE = 0;
      var CCE = 1;
      var CKE = 2;
      var CCV = 3;
      var CCC = 4;
      var CFI = 5;
      var CAD = 6;
      var __ = tls.handleUnexpected;
      var R0 = tls.handleChangeCipherSpec;
      var R1 = tls.handleAlert;
      var R2 = tls.handleHandshake;
      var R3 = tls.handleApplicationData;
      var R4 = tls.handleHeartbeat;
      var ctTable = [];
      ctTable[tls.ConnectionEnd.client] = [
        //      CC,AL,HS,AD,HB
        /*SHE*/
        [__, R1, R2, __, R4],
        /*SCE*/
        [__, R1, R2, __, R4],
        /*SKE*/
        [__, R1, R2, __, R4],
        /*SCR*/
        [__, R1, R2, __, R4],
        /*SHD*/
        [__, R1, R2, __, R4],
        /*SCC*/
        [R0, R1, __, __, R4],
        /*SFI*/
        [__, R1, R2, __, R4],
        /*SAD*/
        [__, R1, R2, R3, R4],
        /*SER*/
        [__, R1, R2, __, R4]
      ];
      ctTable[tls.ConnectionEnd.server] = [
        //      CC,AL,HS,AD
        /*CHE*/
        [__, R1, R2, __, R4],
        /*CCE*/
        [__, R1, R2, __, R4],
        /*CKE*/
        [__, R1, R2, __, R4],
        /*CCV*/
        [__, R1, R2, __, R4],
        /*CCC*/
        [R0, R1, __, __, R4],
        /*CFI*/
        [__, R1, R2, __, R4],
        /*CAD*/
        [__, R1, R2, R3, R4],
        /*CER*/
        [__, R1, R2, __, R4]
      ];
      var H0 = tls.handleHelloRequest;
      var H1 = tls.handleServerHello;
      var H2 = tls.handleCertificate;
      var H3 = tls.handleServerKeyExchange;
      var H4 = tls.handleCertificateRequest;
      var H5 = tls.handleServerHelloDone;
      var H6 = tls.handleFinished;
      var hsTable = [];
      hsTable[tls.ConnectionEnd.client] = [
        //      HR,01,SH,03,04,05,06,07,08,09,10,SC,SK,CR,HD,15,CK,17,18,19,FI
        /*SHE*/
        [__, __, H1, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*SCE*/
        [H0, __, __, __, __, __, __, __, __, __, __, H2, H3, H4, H5, __, __, __, __, __, __],
        /*SKE*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, H3, H4, H5, __, __, __, __, __, __],
        /*SCR*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, H4, H5, __, __, __, __, __, __],
        /*SHD*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, H5, __, __, __, __, __, __],
        /*SCC*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*SFI*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
        /*SAD*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*SER*/
        [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
      ];
      var H7 = tls.handleClientHello;
      var H8 = tls.handleClientKeyExchange;
      var H9 = tls.handleCertificateVerify;
      hsTable[tls.ConnectionEnd.server] = [
        //      01,CH,02,03,04,05,06,07,08,09,10,CC,12,13,14,CV,CK,17,18,19,FI
        /*CHE*/
        [__, H7, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*CCE*/
        [__, __, __, __, __, __, __, __, __, __, __, H2, __, __, __, __, __, __, __, __, __],
        /*CKE*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H8, __, __, __, __],
        /*CCV*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H9, __, __, __, __, __],
        /*CCC*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*CFI*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
        /*CAD*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        /*CER*/
        [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
      ];
      tls.generateKeys = function(c, sp) {
        var prf = prf_TLS1;
        var random = sp.client_random + sp.server_random;
        if (!c.session.resuming) {
          sp.master_secret = prf(
            sp.pre_master_secret,
            "master secret",
            random,
            48
          ).bytes();
          sp.pre_master_secret = null;
        }
        random = sp.server_random + sp.client_random;
        var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length;
        var tls10 = c.version.major === tls.Versions.TLS_1_0.major && c.version.minor === tls.Versions.TLS_1_0.minor;
        if (tls10) {
          length += 2 * sp.fixed_iv_length;
        }
        var km = prf(sp.master_secret, "key expansion", random, length);
        var rval = {
          client_write_MAC_key: km.getBytes(sp.mac_key_length),
          server_write_MAC_key: km.getBytes(sp.mac_key_length),
          client_write_key: km.getBytes(sp.enc_key_length),
          server_write_key: km.getBytes(sp.enc_key_length)
        };
        if (tls10) {
          rval.client_write_IV = km.getBytes(sp.fixed_iv_length);
          rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
        }
        return rval;
      };
      tls.createConnectionState = function(c) {
        var client = c.entity === tls.ConnectionEnd.client;
        var createMode = function() {
          var mode = {
            // two 32-bit numbers, first is most significant
            sequenceNumber: [0, 0],
            macKey: null,
            macLength: 0,
            macFunction: null,
            cipherState: null,
            cipherFunction: function(record) {
              return true;
            },
            compressionState: null,
            compressFunction: function(record) {
              return true;
            },
            updateSequenceNumber: function() {
              if (mode.sequenceNumber[1] === 4294967295) {
                mode.sequenceNumber[1] = 0;
                ++mode.sequenceNumber[0];
              } else {
                ++mode.sequenceNumber[1];
              }
            }
          };
          return mode;
        };
        var state = {
          read: createMode(),
          write: createMode()
        };
        state.read.update = function(c2, record) {
          if (!state.read.cipherFunction(record, state.read)) {
            c2.error(c2, {
              message: "Could not decrypt record or bad MAC.",
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                // doesn't matter if decryption failed or MAC was
                // invalid, return the same error so as not to reveal
                // which one occurred
                description: tls.Alert.Description.bad_record_mac
              }
            });
          } else if (!state.read.compressFunction(c2, record, state.read)) {
            c2.error(c2, {
              message: "Could not decompress record.",
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.decompression_failure
              }
            });
          }
          return !c2.fail;
        };
        state.write.update = function(c2, record) {
          if (!state.write.compressFunction(c2, record, state.write)) {
            c2.error(c2, {
              message: "Could not compress record.",
              send: false,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.internal_error
              }
            });
          } else if (!state.write.cipherFunction(record, state.write)) {
            c2.error(c2, {
              message: "Could not encrypt record.",
              send: false,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.internal_error
              }
            });
          }
          return !c2.fail;
        };
        if (c.session) {
          var sp = c.session.sp;
          c.session.cipherSuite.initSecurityParameters(sp);
          sp.keys = tls.generateKeys(c, sp);
          state.read.macKey = client ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key;
          state.write.macKey = client ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key;
          c.session.cipherSuite.initConnectionState(state, c, sp);
          switch (sp.compression_algorithm) {
            case tls.CompressionMethod.none:
              break;
            case tls.CompressionMethod.deflate:
              state.read.compressFunction = inflate;
              state.write.compressFunction = deflate;
              break;
            default:
              throw new Error("Unsupported compression algorithm.");
          }
        }
        return state;
      };
      tls.createRandom = function() {
        var d = /* @__PURE__ */ new Date();
        var utc = +d + d.getTimezoneOffset() * 6e4;
        var rval = forge.util.createBuffer();
        rval.putInt32(utc);
        rval.putBytes(forge.random.getBytes(28));
        return rval;
      };
      tls.createRecord = function(c, options) {
        if (!options.data) {
          return null;
        }
        var record = {
          type: options.type,
          version: {
            major: c.version.major,
            minor: c.version.minor
          },
          length: options.data.length(),
          fragment: options.data
        };
        return record;
      };
      tls.createAlert = function(c, alert) {
        var b = forge.util.createBuffer();
        b.putByte(alert.level);
        b.putByte(alert.description);
        return tls.createRecord(c, {
          type: tls.ContentType.alert,
          data: b
        });
      };
      tls.createClientHello = function(c) {
        c.session.clientHelloVersion = {
          major: c.version.major,
          minor: c.version.minor
        };
        var cipherSuites = forge.util.createBuffer();
        for (var i = 0; i < c.cipherSuites.length; ++i) {
          var cs = c.cipherSuites[i];
          cipherSuites.putByte(cs.id[0]);
          cipherSuites.putByte(cs.id[1]);
        }
        var cSuites = cipherSuites.length();
        var compressionMethods = forge.util.createBuffer();
        compressionMethods.putByte(tls.CompressionMethod.none);
        var cMethods = compressionMethods.length();
        var extensions = forge.util.createBuffer();
        if (c.virtualHost) {
          var ext = forge.util.createBuffer();
          ext.putByte(0);
          ext.putByte(0);
          var serverName = forge.util.createBuffer();
          serverName.putByte(0);
          writeVector(serverName, 2, forge.util.createBuffer(c.virtualHost));
          var snList = forge.util.createBuffer();
          writeVector(snList, 2, serverName);
          writeVector(ext, 2, snList);
          extensions.putBuffer(ext);
        }
        var extLength = extensions.length();
        if (extLength > 0) {
          extLength += 2;
        }
        var sessionId = c.session.id;
        var length = sessionId.length + 1 + // session ID vector
        2 + // version (major + minor)
        4 + 28 + // random time and random bytes
        2 + cSuites + // cipher suites vector
        1 + cMethods + // compression methods vector
        extLength;
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.client_hello);
        rval.putInt24(length);
        rval.putByte(c.version.major);
        rval.putByte(c.version.minor);
        rval.putBytes(c.session.sp.client_random);
        writeVector(rval, 1, forge.util.createBuffer(sessionId));
        writeVector(rval, 2, cipherSuites);
        writeVector(rval, 1, compressionMethods);
        if (extLength > 0) {
          writeVector(rval, 2, extensions);
        }
        return rval;
      };
      tls.createServerHello = function(c) {
        var sessionId = c.session.id;
        var length = sessionId.length + 1 + // session ID vector
        2 + // version (major + minor)
        4 + 28 + // random time and random bytes
        2 + // chosen cipher suite
        1;
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.server_hello);
        rval.putInt24(length);
        rval.putByte(c.version.major);
        rval.putByte(c.version.minor);
        rval.putBytes(c.session.sp.server_random);
        writeVector(rval, 1, forge.util.createBuffer(sessionId));
        rval.putByte(c.session.cipherSuite.id[0]);
        rval.putByte(c.session.cipherSuite.id[1]);
        rval.putByte(c.session.compressionMethod);
        return rval;
      };
      tls.createCertificate = function(c) {
        var client = c.entity === tls.ConnectionEnd.client;
        var cert = null;
        if (c.getCertificate) {
          var hint;
          if (client) {
            hint = c.session.certificateRequest;
          } else {
            hint = c.session.extensions.server_name.serverNameList;
          }
          cert = c.getCertificate(c, hint);
        }
        var certList = forge.util.createBuffer();
        if (cert !== null) {
          try {
            if (!forge.util.isArray(cert)) {
              cert = [cert];
            }
            var asn1 = null;
            for (var i = 0; i < cert.length; ++i) {
              var msg = forge.pem.decode(cert[i])[0];
              if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
                var error = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
                error.headerType = msg.type;
                throw error;
              }
              if (msg.procType && msg.procType.type === "ENCRYPTED") {
                throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
              }
              var der = forge.util.createBuffer(msg.body);
              if (asn1 === null) {
                asn1 = forge.asn1.fromDer(der.bytes(), false);
              }
              var certBuffer = forge.util.createBuffer();
              writeVector(certBuffer, 3, der);
              certList.putBuffer(certBuffer);
            }
            cert = forge.pki.certificateFromAsn1(asn1);
            if (client) {
              c.session.clientCertificate = cert;
            } else {
              c.session.serverCertificate = cert;
            }
          } catch (ex) {
            return c.error(c, {
              message: "Could not send certificate list.",
              cause: ex,
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.bad_certificate
              }
            });
          }
        }
        var length = 3 + certList.length();
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.certificate);
        rval.putInt24(length);
        writeVector(rval, 3, certList);
        return rval;
      };
      tls.createClientKeyExchange = function(c) {
        var b = forge.util.createBuffer();
        b.putByte(c.session.clientHelloVersion.major);
        b.putByte(c.session.clientHelloVersion.minor);
        b.putBytes(forge.random.getBytes(46));
        var sp = c.session.sp;
        sp.pre_master_secret = b.getBytes();
        var key2 = c.session.serverCertificate.publicKey;
        b = key2.encrypt(sp.pre_master_secret);
        var length = b.length + 2;
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.client_key_exchange);
        rval.putInt24(length);
        rval.putInt16(b.length);
        rval.putBytes(b);
        return rval;
      };
      tls.createServerKeyExchange = function(c) {
        var length = 0;
        var rval = forge.util.createBuffer();
        if (length > 0) {
          rval.putByte(tls.HandshakeType.server_key_exchange);
          rval.putInt24(length);
        }
        return rval;
      };
      tls.getClientSignature = function(c, callback) {
        var b = forge.util.createBuffer();
        b.putBuffer(c.session.md5.digest());
        b.putBuffer(c.session.sha1.digest());
        b = b.getBytes();
        c.getSignature = c.getSignature || function(c2, b2, callback2) {
          var privateKey = null;
          if (c2.getPrivateKey) {
            try {
              privateKey = c2.getPrivateKey(c2, c2.session.clientCertificate);
              privateKey = forge.pki.privateKeyFromPem(privateKey);
            } catch (ex) {
              c2.error(c2, {
                message: "Could not get private key.",
                cause: ex,
                send: true,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.internal_error
                }
              });
            }
          }
          if (privateKey === null) {
            c2.error(c2, {
              message: "No private key set.",
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.internal_error
              }
            });
          } else {
            b2 = privateKey.sign(b2, null);
          }
          callback2(c2, b2);
        };
        c.getSignature(c, b, callback);
      };
      tls.createCertificateVerify = function(c, signature) {
        var length = signature.length + 2;
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.certificate_verify);
        rval.putInt24(length);
        rval.putInt16(signature.length);
        rval.putBytes(signature);
        return rval;
      };
      tls.createCertificateRequest = function(c) {
        var certTypes = forge.util.createBuffer();
        certTypes.putByte(1);
        var cAs = forge.util.createBuffer();
        for (var key2 in c.caStore.certs) {
          var cert = c.caStore.certs[key2];
          var dn = forge.pki.distinguishedNameToAsn1(cert.subject);
          var byteBuffer = forge.asn1.toDer(dn);
          cAs.putInt16(byteBuffer.length());
          cAs.putBuffer(byteBuffer);
        }
        var length = 1 + certTypes.length() + 2 + cAs.length();
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.certificate_request);
        rval.putInt24(length);
        writeVector(rval, 1, certTypes);
        writeVector(rval, 2, cAs);
        return rval;
      };
      tls.createServerHelloDone = function(c) {
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.server_hello_done);
        rval.putInt24(0);
        return rval;
      };
      tls.createChangeCipherSpec = function() {
        var rval = forge.util.createBuffer();
        rval.putByte(1);
        return rval;
      };
      tls.createFinished = function(c) {
        var b = forge.util.createBuffer();
        b.putBuffer(c.session.md5.digest());
        b.putBuffer(c.session.sha1.digest());
        var client = c.entity === tls.ConnectionEnd.client;
        var sp = c.session.sp;
        var vdl = 12;
        var prf = prf_TLS1;
        var label = client ? "client finished" : "server finished";
        b = prf(sp.master_secret, label, b.getBytes(), vdl);
        var rval = forge.util.createBuffer();
        rval.putByte(tls.HandshakeType.finished);
        rval.putInt24(b.length());
        rval.putBuffer(b);
        return rval;
      };
      tls.createHeartbeat = function(type, payload, payloadLength) {
        if (typeof payloadLength === "undefined") {
          payloadLength = payload.length;
        }
        var rval = forge.util.createBuffer();
        rval.putByte(type);
        rval.putInt16(payloadLength);
        rval.putBytes(payload);
        var plaintextLength = rval.length();
        var paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
        rval.putBytes(forge.random.getBytes(paddingLength));
        return rval;
      };
      tls.queue = function(c, record) {
        if (!record) {
          return;
        }
        if (record.fragment.length() === 0) {
          if (record.type === tls.ContentType.handshake || record.type === tls.ContentType.alert || record.type === tls.ContentType.change_cipher_spec) {
            return;
          }
        }
        if (record.type === tls.ContentType.handshake) {
          var bytes = record.fragment.bytes();
          c.session.md5.update(bytes);
          c.session.sha1.update(bytes);
          bytes = null;
        }
        var records;
        if (record.fragment.length() <= tls.MaxFragment) {
          records = [record];
        } else {
          records = [];
          var data = record.fragment.bytes();
          while (data.length > tls.MaxFragment) {
            records.push(tls.createRecord(c, {
              type: record.type,
              data: forge.util.createBuffer(data.slice(0, tls.MaxFragment))
            }));
            data = data.slice(tls.MaxFragment);
          }
          if (data.length > 0) {
            records.push(tls.createRecord(c, {
              type: record.type,
              data: forge.util.createBuffer(data)
            }));
          }
        }
        for (var i = 0; i < records.length && !c.fail; ++i) {
          var rec = records[i];
          var s = c.state.current.write;
          if (s.update(c, rec)) {
            c.records.push(rec);
          }
        }
      };
      tls.flush = function(c) {
        for (var i = 0; i < c.records.length; ++i) {
          var record = c.records[i];
          c.tlsData.putByte(record.type);
          c.tlsData.putByte(record.version.major);
          c.tlsData.putByte(record.version.minor);
          c.tlsData.putInt16(record.fragment.length());
          c.tlsData.putBuffer(c.records[i].fragment);
        }
        c.records = [];
        return c.tlsDataReady(c);
      };
      var _certErrorToAlertDesc = function(error) {
        switch (error) {
          case true:
            return true;
          case forge.pki.certificateError.bad_certificate:
            return tls.Alert.Description.bad_certificate;
          case forge.pki.certificateError.unsupported_certificate:
            return tls.Alert.Description.unsupported_certificate;
          case forge.pki.certificateError.certificate_revoked:
            return tls.Alert.Description.certificate_revoked;
          case forge.pki.certificateError.certificate_expired:
            return tls.Alert.Description.certificate_expired;
          case forge.pki.certificateError.certificate_unknown:
            return tls.Alert.Description.certificate_unknown;
          case forge.pki.certificateError.unknown_ca:
            return tls.Alert.Description.unknown_ca;
          default:
            return tls.Alert.Description.bad_certificate;
        }
      };
      var _alertDescToCertError = function(desc) {
        switch (desc) {
          case true:
            return true;
          case tls.Alert.Description.bad_certificate:
            return forge.pki.certificateError.bad_certificate;
          case tls.Alert.Description.unsupported_certificate:
            return forge.pki.certificateError.unsupported_certificate;
          case tls.Alert.Description.certificate_revoked:
            return forge.pki.certificateError.certificate_revoked;
          case tls.Alert.Description.certificate_expired:
            return forge.pki.certificateError.certificate_expired;
          case tls.Alert.Description.certificate_unknown:
            return forge.pki.certificateError.certificate_unknown;
          case tls.Alert.Description.unknown_ca:
            return forge.pki.certificateError.unknown_ca;
          default:
            return forge.pki.certificateError.bad_certificate;
        }
      };
      tls.verifyCertificateChain = function(c, chain) {
        try {
          var options = {};
          for (var key2 in c.verifyOptions) {
            options[key2] = c.verifyOptions[key2];
          }
          options.verify = function(vfd, depth, chain2) {
            var desc = _certErrorToAlertDesc(vfd);
            var ret = c.verify(c, vfd, depth, chain2);
            if (ret !== true) {
              if (typeof ret === "object" && !forge.util.isArray(ret)) {
                var error = new Error("The application rejected the certificate.");
                error.send = true;
                error.alert = {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.bad_certificate
                };
                if (ret.message) {
                  error.message = ret.message;
                }
                if (ret.alert) {
                  error.alert.description = ret.alert;
                }
                throw error;
              }
              if (ret !== vfd) {
                ret = _alertDescToCertError(ret);
              }
            }
            return ret;
          };
          forge.pki.verifyCertificateChain(c.caStore, chain, options);
        } catch (ex) {
          var err = ex;
          if (typeof err !== "object" || forge.util.isArray(err)) {
            err = {
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: _certErrorToAlertDesc(ex)
              }
            };
          }
          if (!("send" in err)) {
            err.send = true;
          }
          if (!("alert" in err)) {
            err.alert = {
              level: tls.Alert.Level.fatal,
              description: _certErrorToAlertDesc(err.error)
            };
          }
          c.error(c, err);
        }
        return !c.fail;
      };
      tls.createSessionCache = function(cache, capacity) {
        var rval = null;
        if (cache && cache.getSession && cache.setSession && cache.order) {
          rval = cache;
        } else {
          rval = {};
          rval.cache = cache || {};
          rval.capacity = Math.max(capacity || 100, 1);
          rval.order = [];
          for (var key2 in cache) {
            if (rval.order.length <= capacity) {
              rval.order.push(key2);
            } else {
              delete cache[key2];
            }
          }
          rval.getSession = function(sessionId) {
            var session = null;
            var key3 = null;
            if (sessionId) {
              key3 = forge.util.bytesToHex(sessionId);
            } else if (rval.order.length > 0) {
              key3 = rval.order[0];
            }
            if (key3 !== null && key3 in rval.cache) {
              session = rval.cache[key3];
              delete rval.cache[key3];
              for (var i in rval.order) {
                if (rval.order[i] === key3) {
                  rval.order.splice(i, 1);
                  break;
                }
              }
            }
            return session;
          };
          rval.setSession = function(sessionId, session) {
            if (rval.order.length === rval.capacity) {
              var key3 = rval.order.shift();
              delete rval.cache[key3];
            }
            var key3 = forge.util.bytesToHex(sessionId);
            rval.order.push(key3);
            rval.cache[key3] = session;
          };
        }
        return rval;
      };
      tls.createConnection = function(options) {
        var caStore = null;
        if (options.caStore) {
          if (forge.util.isArray(options.caStore)) {
            caStore = forge.pki.createCaStore(options.caStore);
          } else {
            caStore = options.caStore;
          }
        } else {
          caStore = forge.pki.createCaStore();
        }
        var cipherSuites = options.cipherSuites || null;
        if (cipherSuites === null) {
          cipherSuites = [];
          for (var key2 in tls.CipherSuites) {
            cipherSuites.push(tls.CipherSuites[key2]);
          }
        }
        var entity = options.server || false ? tls.ConnectionEnd.server : tls.ConnectionEnd.client;
        var sessionCache = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null;
        var c = {
          version: { major: tls.Version.major, minor: tls.Version.minor },
          entity,
          sessionId: options.sessionId,
          caStore,
          sessionCache,
          cipherSuites,
          connected: options.connected,
          virtualHost: options.virtualHost || null,
          verifyClient: options.verifyClient || false,
          verify: options.verify || function(cn, vfd, dpth, cts) {
            return vfd;
          },
          verifyOptions: options.verifyOptions || {},
          getCertificate: options.getCertificate || null,
          getPrivateKey: options.getPrivateKey || null,
          getSignature: options.getSignature || null,
          input: forge.util.createBuffer(),
          tlsData: forge.util.createBuffer(),
          data: forge.util.createBuffer(),
          tlsDataReady: options.tlsDataReady,
          dataReady: options.dataReady,
          heartbeatReceived: options.heartbeatReceived,
          closed: options.closed,
          error: function(c2, ex) {
            ex.origin = ex.origin || (c2.entity === tls.ConnectionEnd.client ? "client" : "server");
            if (ex.send) {
              tls.queue(c2, tls.createAlert(c2, ex.alert));
              tls.flush(c2);
            }
            var fatal = ex.fatal !== false;
            if (fatal) {
              c2.fail = true;
            }
            options.error(c2, ex);
            if (fatal) {
              c2.close(false);
            }
          },
          deflate: options.deflate || null,
          inflate: options.inflate || null
        };
        c.reset = function(clearFail) {
          c.version = { major: tls.Version.major, minor: tls.Version.minor };
          c.record = null;
          c.session = null;
          c.peerCertificate = null;
          c.state = {
            pending: null,
            current: null
          };
          c.expect = c.entity === tls.ConnectionEnd.client ? SHE : CHE;
          c.fragmented = null;
          c.records = [];
          c.open = false;
          c.handshakes = 0;
          c.handshaking = false;
          c.isConnected = false;
          c.fail = !(clearFail || typeof clearFail === "undefined");
          c.input.clear();
          c.tlsData.clear();
          c.data.clear();
          c.state.current = tls.createConnectionState(c);
        };
        c.reset();
        var _update = function(c2, record) {
          var aligned = record.type - tls.ContentType.change_cipher_spec;
          var handlers = ctTable[c2.entity][c2.expect];
          if (aligned in handlers) {
            handlers[aligned](c2, record);
          } else {
            tls.handleUnexpected(c2, record);
          }
        };
        var _readRecordHeader = function(c2) {
          var rval = 0;
          var b = c2.input;
          var len = b.length();
          if (len < 5) {
            rval = 5 - len;
          } else {
            c2.record = {
              type: b.getByte(),
              version: {
                major: b.getByte(),
                minor: b.getByte()
              },
              length: b.getInt16(),
              fragment: forge.util.createBuffer(),
              ready: false
            };
            var compatibleVersion = c2.record.version.major === c2.version.major;
            if (compatibleVersion && c2.session && c2.session.version) {
              compatibleVersion = c2.record.version.minor === c2.version.minor;
            }
            if (!compatibleVersion) {
              c2.error(c2, {
                message: "Incompatible TLS version.",
                send: true,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.protocol_version
                }
              });
            }
          }
          return rval;
        };
        var _readRecord = function(c2) {
          var rval = 0;
          var b = c2.input;
          var len = b.length();
          if (len < c2.record.length) {
            rval = c2.record.length - len;
          } else {
            c2.record.fragment.putBytes(b.getBytes(c2.record.length));
            b.compact();
            var s = c2.state.current.read;
            if (s.update(c2, c2.record)) {
              if (c2.fragmented !== null) {
                if (c2.fragmented.type === c2.record.type) {
                  c2.fragmented.fragment.putBuffer(c2.record.fragment);
                  c2.record = c2.fragmented;
                } else {
                  c2.error(c2, {
                    message: "Invalid fragmented record.",
                    send: true,
                    alert: {
                      level: tls.Alert.Level.fatal,
                      description: tls.Alert.Description.unexpected_message
                    }
                  });
                }
              }
              c2.record.ready = true;
            }
          }
          return rval;
        };
        c.handshake = function(sessionId) {
          if (c.entity !== tls.ConnectionEnd.client) {
            c.error(c, {
              message: "Cannot initiate handshake as a server.",
              fatal: false
            });
          } else if (c.handshaking) {
            c.error(c, {
              message: "Handshake already in progress.",
              fatal: false
            });
          } else {
            if (c.fail && !c.open && c.handshakes === 0) {
              c.fail = false;
            }
            c.handshaking = true;
            sessionId = sessionId || "";
            var session = null;
            if (sessionId.length > 0) {
              if (c.sessionCache) {
                session = c.sessionCache.getSession(sessionId);
              }
              if (session === null) {
                sessionId = "";
              }
            }
            if (sessionId.length === 0 && c.sessionCache) {
              session = c.sessionCache.getSession();
              if (session !== null) {
                sessionId = session.id;
              }
            }
            c.session = {
              id: sessionId,
              version: null,
              cipherSuite: null,
              compressionMethod: null,
              serverCertificate: null,
              certificateRequest: null,
              clientCertificate: null,
              sp: {},
              md5: forge.md.md5.create(),
              sha1: forge.md.sha1.create()
            };
            if (session) {
              c.version = session.version;
              c.session.sp = session.sp;
            }
            c.session.sp.client_random = tls.createRandom().getBytes();
            c.open = true;
            tls.queue(c, tls.createRecord(c, {
              type: tls.ContentType.handshake,
              data: tls.createClientHello(c)
            }));
            tls.flush(c);
          }
        };
        c.process = function(data) {
          var rval = 0;
          if (data) {
            c.input.putBytes(data);
          }
          if (!c.fail) {
            if (c.record !== null && c.record.ready && c.record.fragment.isEmpty()) {
              c.record = null;
            }
            if (c.record === null) {
              rval = _readRecordHeader(c);
            }
            if (!c.fail && c.record !== null && !c.record.ready) {
              rval = _readRecord(c);
            }
            if (!c.fail && c.record !== null && c.record.ready) {
              _update(c, c.record);
            }
          }
          return rval;
        };
        c.prepare = function(data) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.application_data,
            data: forge.util.createBuffer(data)
          }));
          return tls.flush(c);
        };
        c.prepareHeartbeatRequest = function(payload, payloadLength) {
          if (payload instanceof forge.util.ByteBuffer) {
            payload = payload.bytes();
          }
          if (typeof payloadLength === "undefined") {
            payloadLength = payload.length;
          }
          c.expectedHeartbeatPayload = payload;
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.heartbeat,
            data: tls.createHeartbeat(
              tls.HeartbeatMessageType.heartbeat_request,
              payload,
              payloadLength
            )
          }));
          return tls.flush(c);
        };
        c.close = function(clearFail) {
          if (!c.fail && c.sessionCache && c.session) {
            var session = {
              id: c.session.id,
              version: c.session.version,
              sp: c.session.sp
            };
            session.sp.keys = null;
            c.sessionCache.setSession(session.id, session);
          }
          if (c.open) {
            c.open = false;
            c.input.clear();
            if (c.isConnected || c.handshaking) {
              c.isConnected = c.handshaking = false;
              tls.queue(c, tls.createAlert(c, {
                level: tls.Alert.Level.warning,
                description: tls.Alert.Description.close_notify
              }));
              tls.flush(c);
            }
            c.closed(c);
          }
          c.reset(clearFail);
        };
        return c;
      };
      module.exports = forge.tls = forge.tls || {};
      for (key in tls) {
        if (typeof tls[key] !== "function") {
          forge.tls[key] = tls[key];
        }
      }
      var key;
      forge.tls.prf_tls1 = prf_TLS1;
      forge.tls.hmac_sha1 = hmac_sha1;
      forge.tls.createSessionCache = tls.createSessionCache;
      forge.tls.createConnection = tls.createConnection;
    }
  });

  // node_modules/node-forge/lib/aesCipherSuites.js
  var require_aesCipherSuites = __commonJS({
    "node_modules/node-forge/lib/aesCipherSuites.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_tls();
      var tls = module.exports = forge.tls;
      tls.CipherSuites["TLS_RSA_WITH_AES_128_CBC_SHA"] = {
        id: [0, 47],
        name: "TLS_RSA_WITH_AES_128_CBC_SHA",
        initSecurityParameters: function(sp) {
          sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
          sp.cipher_type = tls.CipherType.block;
          sp.enc_key_length = 16;
          sp.block_length = 16;
          sp.fixed_iv_length = 16;
          sp.record_iv_length = 16;
          sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
          sp.mac_length = 20;
          sp.mac_key_length = 20;
        },
        initConnectionState
      };
      tls.CipherSuites["TLS_RSA_WITH_AES_256_CBC_SHA"] = {
        id: [0, 53],
        name: "TLS_RSA_WITH_AES_256_CBC_SHA",
        initSecurityParameters: function(sp) {
          sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
          sp.cipher_type = tls.CipherType.block;
          sp.enc_key_length = 32;
          sp.block_length = 16;
          sp.fixed_iv_length = 16;
          sp.record_iv_length = 16;
          sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
          sp.mac_length = 20;
          sp.mac_key_length = 20;
        },
        initConnectionState
      };
      function initConnectionState(state, c, sp) {
        var client = c.entity === forge.tls.ConnectionEnd.client;
        state.read.cipherState = {
          init: false,
          cipher: forge.cipher.createDecipher("AES-CBC", client ? sp.keys.server_write_key : sp.keys.client_write_key),
          iv: client ? sp.keys.server_write_IV : sp.keys.client_write_IV
        };
        state.write.cipherState = {
          init: false,
          cipher: forge.cipher.createCipher("AES-CBC", client ? sp.keys.client_write_key : sp.keys.server_write_key),
          iv: client ? sp.keys.client_write_IV : sp.keys.server_write_IV
        };
        state.read.cipherFunction = decrypt_aes_cbc_sha1;
        state.write.cipherFunction = encrypt_aes_cbc_sha1;
        state.read.macLength = state.write.macLength = sp.mac_length;
        state.read.macFunction = state.write.macFunction = tls.hmac_sha1;
      }
      function encrypt_aes_cbc_sha1(record, s) {
        var rval = false;
        var mac = s.macFunction(s.macKey, s.sequenceNumber, record);
        record.fragment.putBytes(mac);
        s.updateSequenceNumber();
        var iv;
        if (record.version.minor === tls.Versions.TLS_1_0.minor) {
          iv = s.cipherState.init ? null : s.cipherState.iv;
        } else {
          iv = forge.random.getBytesSync(16);
        }
        s.cipherState.init = true;
        var cipher = s.cipherState.cipher;
        cipher.start({ iv });
        if (record.version.minor >= tls.Versions.TLS_1_1.minor) {
          cipher.output.putBytes(iv);
        }
        cipher.update(record.fragment);
        if (cipher.finish(encrypt_aes_cbc_sha1_padding)) {
          record.fragment = cipher.output;
          record.length = record.fragment.length();
          rval = true;
        }
        return rval;
      }
      function encrypt_aes_cbc_sha1_padding(blockSize, input, decrypt) {
        if (!decrypt) {
          var padding = blockSize - input.length() % blockSize;
          input.fillWithByte(padding - 1, padding);
        }
        return true;
      }
      function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
        var rval = true;
        if (decrypt) {
          var len = output.length();
          var paddingLength = output.last();
          for (var i = len - 1 - paddingLength; i < len - 1; ++i) {
            rval = rval && output.at(i) == paddingLength;
          }
          if (rval) {
            output.truncate(paddingLength + 1);
          }
        }
        return rval;
      }
      function decrypt_aes_cbc_sha1(record, s) {
        var rval = false;
        var iv;
        if (record.version.minor === tls.Versions.TLS_1_0.minor) {
          iv = s.cipherState.init ? null : s.cipherState.iv;
        } else {
          iv = record.fragment.getBytes(16);
        }
        s.cipherState.init = true;
        var cipher = s.cipherState.cipher;
        cipher.start({ iv });
        cipher.update(record.fragment);
        rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
        var macLen = s.macLength;
        var mac = forge.random.getBytesSync(macLen);
        var len = cipher.output.length();
        if (len >= macLen) {
          record.fragment = cipher.output.getBytes(len - macLen);
          mac = cipher.output.getBytes(macLen);
        } else {
          record.fragment = cipher.output.getBytes();
        }
        record.fragment = forge.util.createBuffer(record.fragment);
        record.length = record.fragment.length();
        var mac2 = s.macFunction(s.macKey, s.sequenceNumber, record);
        s.updateSequenceNumber();
        rval = compareMacs(s.macKey, mac, mac2) && rval;
        return rval;
      }
      function compareMacs(key, mac1, mac2) {
        var hmac = forge.hmac.create();
        hmac.start("SHA1", key);
        hmac.update(mac1);
        mac1 = hmac.digest().getBytes();
        hmac.start(null, null);
        hmac.update(mac2);
        mac2 = hmac.digest().getBytes();
        return mac1 === mac2;
      }
    }
  });

  // node_modules/node-forge/lib/sha512.js
  var require_sha5122 = __commonJS({
    "node_modules/node-forge/lib/sha512.js"(exports, module) {
      var forge = require_forge();
      require_md();
      require_util();
      var sha512 = module.exports = forge.sha512 = forge.sha512 || {};
      forge.md.sha512 = forge.md.algorithms.sha512 = sha512;
      var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
      sha384.create = function() {
        return sha512.create("SHA-384");
      };
      forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
      forge.sha512.sha256 = forge.sha512.sha256 || {
        create: function() {
          return sha512.create("SHA-512/256");
        }
      };
      forge.md["sha512/256"] = forge.md.algorithms["sha512/256"] = forge.sha512.sha256;
      forge.sha512.sha224 = forge.sha512.sha224 || {
        create: function() {
          return sha512.create("SHA-512/224");
        }
      };
      forge.md["sha512/224"] = forge.md.algorithms["sha512/224"] = forge.sha512.sha224;
      sha512.create = function(algorithm) {
        if (!_initialized) {
          _init();
        }
        if (typeof algorithm === "undefined") {
          algorithm = "SHA-512";
        }
        if (!(algorithm in _states)) {
          throw new Error("Invalid SHA-512 algorithm: " + algorithm);
        }
        var _state = _states[algorithm];
        var _h = null;
        var _input = forge.util.createBuffer();
        var _w = new Array(80);
        for (var wi = 0; wi < 80; ++wi) {
          _w[wi] = new Array(2);
        }
        var digestLength = 64;
        switch (algorithm) {
          case "SHA-384":
            digestLength = 48;
            break;
          case "SHA-512/256":
            digestLength = 32;
            break;
          case "SHA-512/224":
            digestLength = 28;
            break;
        }
        var md = {
          // SHA-512 => sha512
          algorithm: algorithm.replace("-", "").toLowerCase(),
          blockLength: 128,
          digestLength,
          // 56-bit length of message so far (does not including padding)
          messageLength: 0,
          // true message length
          fullMessageLength: null,
          // size of message length in bytes
          messageLengthSize: 16
        };
        md.start = function() {
          md.messageLength = 0;
          md.fullMessageLength = md.messageLength128 = [];
          var int32s = md.messageLengthSize / 4;
          for (var i = 0; i < int32s; ++i) {
            md.fullMessageLength.push(0);
          }
          _input = forge.util.createBuffer();
          _h = new Array(_state.length);
          for (var i = 0; i < _state.length; ++i) {
            _h[i] = _state[i].slice(0);
          }
          return md;
        };
        md.start();
        md.update = function(msg, encoding) {
          if (encoding === "utf8") {
            msg = forge.util.encodeUtf8(msg);
          }
          var len = msg.length;
          md.messageLength += len;
          len = [len / 4294967296 >>> 0, len >>> 0];
          for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
            md.fullMessageLength[i] += len[1];
            len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
            md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
          }
          _input.putBytes(msg);
          _update(_h, _w, _input);
          if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
          }
          return md;
        };
        md.digest = function() {
          var finalBlock = forge.util.createBuffer();
          finalBlock.putBytes(_input.bytes());
          var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
          var overflow = remaining & md.blockLength - 1;
          finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
          var next, carry;
          var bits = md.fullMessageLength[0] * 8;
          for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
            next = md.fullMessageLength[i + 1] * 8;
            carry = next / 4294967296 >>> 0;
            bits += carry;
            finalBlock.putInt32(bits >>> 0);
            bits = next >>> 0;
          }
          finalBlock.putInt32(bits);
          var h = new Array(_h.length);
          for (var i = 0; i < _h.length; ++i) {
            h[i] = _h[i].slice(0);
          }
          _update(h, _w, finalBlock);
          var rval = forge.util.createBuffer();
          var hlen;
          if (algorithm === "SHA-512") {
            hlen = h.length;
          } else if (algorithm === "SHA-384") {
            hlen = h.length - 2;
          } else {
            hlen = h.length - 4;
          }
          for (var i = 0; i < hlen; ++i) {
            rval.putInt32(h[i][0]);
            if (i !== hlen - 1 || algorithm !== "SHA-512/224") {
              rval.putInt32(h[i][1]);
            }
          }
          return rval;
        };
        return md;
      };
      var _padding = null;
      var _initialized = false;
      var _k = null;
      var _states = null;
      function _init() {
        _padding = String.fromCharCode(128);
        _padding += forge.util.fillString(String.fromCharCode(0), 128);
        _k = [
          [1116352408, 3609767458],
          [1899447441, 602891725],
          [3049323471, 3964484399],
          [3921009573, 2173295548],
          [961987163, 4081628472],
          [1508970993, 3053834265],
          [2453635748, 2937671579],
          [2870763221, 3664609560],
          [3624381080, 2734883394],
          [310598401, 1164996542],
          [607225278, 1323610764],
          [1426881987, 3590304994],
          [1925078388, 4068182383],
          [2162078206, 991336113],
          [2614888103, 633803317],
          [3248222580, 3479774868],
          [3835390401, 2666613458],
          [4022224774, 944711139],
          [264347078, 2341262773],
          [604807628, 2007800933],
          [770255983, 1495990901],
          [1249150122, 1856431235],
          [1555081692, 3175218132],
          [1996064986, 2198950837],
          [2554220882, 3999719339],
          [2821834349, 766784016],
          [2952996808, 2566594879],
          [3210313671, 3203337956],
          [3336571891, 1034457026],
          [3584528711, 2466948901],
          [113926993, 3758326383],
          [338241895, 168717936],
          [666307205, 1188179964],
          [773529912, 1546045734],
          [1294757372, 1522805485],
          [1396182291, 2643833823],
          [1695183700, 2343527390],
          [1986661051, 1014477480],
          [2177026350, 1206759142],
          [2456956037, 344077627],
          [2730485921, 1290863460],
          [2820302411, 3158454273],
          [3259730800, 3505952657],
          [3345764771, 106217008],
          [3516065817, 3606008344],
          [3600352804, 1432725776],
          [4094571909, 1467031594],
          [275423344, 851169720],
          [430227734, 3100823752],
          [506948616, 1363258195],
          [659060556, 3750685593],
          [883997877, 3785050280],
          [958139571, 3318307427],
          [1322822218, 3812723403],
          [1537002063, 2003034995],
          [1747873779, 3602036899],
          [1955562222, 1575990012],
          [2024104815, 1125592928],
          [2227730452, 2716904306],
          [2361852424, 442776044],
          [2428436474, 593698344],
          [2756734187, 3733110249],
          [3204031479, 2999351573],
          [3329325298, 3815920427],
          [3391569614, 3928383900],
          [3515267271, 566280711],
          [3940187606, 3454069534],
          [4118630271, 4000239992],
          [116418474, 1914138554],
          [174292421, 2731055270],
          [289380356, 3203993006],
          [460393269, 320620315],
          [685471733, 587496836],
          [852142971, 1086792851],
          [1017036298, 365543100],
          [1126000580, 2618297676],
          [1288033470, 3409855158],
          [1501505948, 4234509866],
          [1607167915, 987167468],
          [1816402316, 1246189591]
        ];
        _states = {};
        _states["SHA-512"] = [
          [1779033703, 4089235720],
          [3144134277, 2227873595],
          [1013904242, 4271175723],
          [2773480762, 1595750129],
          [1359893119, 2917565137],
          [2600822924, 725511199],
          [528734635, 4215389547],
          [1541459225, 327033209]
        ];
        _states["SHA-384"] = [
          [3418070365, 3238371032],
          [1654270250, 914150663],
          [2438529370, 812702999],
          [355462360, 4144912697],
          [1731405415, 4290775857],
          [2394180231, 1750603025],
          [3675008525, 1694076839],
          [1203062813, 3204075428]
        ];
        _states["SHA-512/256"] = [
          [573645204, 4230739756],
          [2673172387, 3360449730],
          [596883563, 1867755857],
          [2520282905, 1497426621],
          [2519219938, 2827943907],
          [3193839141, 1401305490],
          [721525244, 746961066],
          [246885852, 2177182882]
        ];
        _states["SHA-512/224"] = [
          [2352822216, 424955298],
          [1944164710, 2312950998],
          [502970286, 855612546],
          [1738396948, 1479516111],
          [258812777, 2077511080],
          [2011393907, 79989058],
          [1067287976, 1780299464],
          [286451373, 2446758561]
        ];
        _initialized = true;
      }
      function _update(s, w, bytes) {
        var t1_hi, t1_lo;
        var t2_hi, t2_lo;
        var s0_hi, s0_lo;
        var s1_hi, s1_lo;
        var ch_hi, ch_lo;
        var maj_hi, maj_lo;
        var a_hi, a_lo;
        var b_hi, b_lo;
        var c_hi, c_lo;
        var d_hi, d_lo;
        var e_hi, e_lo;
        var f_hi, f_lo;
        var g_hi, g_lo;
        var h_hi, h_lo;
        var i, hi, lo, w2, w7, w15, w16;
        var len = bytes.length();
        while (len >= 128) {
          for (i = 0; i < 16; ++i) {
            w[i][0] = bytes.getInt32() >>> 0;
            w[i][1] = bytes.getInt32() >>> 0;
          }
          for (; i < 80; ++i) {
            w2 = w[i - 2];
            hi = w2[0];
            lo = w2[1];
            t1_hi = ((hi >>> 19 | lo << 13) ^ // ROTR 19
            (lo >>> 29 | hi << 3) ^ // ROTR 61/(swap + ROTR 29)
            hi >>> 6) >>> 0;
            t1_lo = ((hi << 13 | lo >>> 19) ^ // ROTR 19
            (lo << 3 | hi >>> 29) ^ // ROTR 61/(swap + ROTR 29)
            (hi << 26 | lo >>> 6)) >>> 0;
            w15 = w[i - 15];
            hi = w15[0];
            lo = w15[1];
            t2_hi = ((hi >>> 1 | lo << 31) ^ // ROTR 1
            (hi >>> 8 | lo << 24) ^ // ROTR 8
            hi >>> 7) >>> 0;
            t2_lo = ((hi << 31 | lo >>> 1) ^ // ROTR 1
            (hi << 24 | lo >>> 8) ^ // ROTR 8
            (hi << 25 | lo >>> 7)) >>> 0;
            w7 = w[i - 7];
            w16 = w[i - 16];
            lo = t1_lo + w7[1] + t2_lo + w16[1];
            w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
            w[i][1] = lo >>> 0;
          }
          a_hi = s[0][0];
          a_lo = s[0][1];
          b_hi = s[1][0];
          b_lo = s[1][1];
          c_hi = s[2][0];
          c_lo = s[2][1];
          d_hi = s[3][0];
          d_lo = s[3][1];
          e_hi = s[4][0];
          e_lo = s[4][1];
          f_hi = s[5][0];
          f_lo = s[5][1];
          g_hi = s[6][0];
          g_lo = s[6][1];
          h_hi = s[7][0];
          h_lo = s[7][1];
          for (i = 0; i < 80; ++i) {
            s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ // ROTR 14
            (e_hi >>> 18 | e_lo << 14) ^ // ROTR 18
            (e_lo >>> 9 | e_hi << 23)) >>> 0;
            s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ // ROTR 14
            (e_hi << 14 | e_lo >>> 18) ^ // ROTR 18
            (e_lo << 23 | e_hi >>> 9)) >>> 0;
            ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
            ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
            s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ // ROTR 28
            (a_lo >>> 2 | a_hi << 30) ^ // ROTR 34/(swap + ROTR 2)
            (a_lo >>> 7 | a_hi << 25)) >>> 0;
            s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ // ROTR 28
            (a_lo << 30 | a_hi >>> 2) ^ // ROTR 34/(swap + ROTR 2)
            (a_lo << 25 | a_hi >>> 7)) >>> 0;
            maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
            maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
            lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
            t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
            t1_lo = lo >>> 0;
            lo = s0_lo + maj_lo;
            t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
            t2_lo = lo >>> 0;
            h_hi = g_hi;
            h_lo = g_lo;
            g_hi = f_hi;
            g_lo = f_lo;
            f_hi = e_hi;
            f_lo = e_lo;
            lo = d_lo + t1_lo;
            e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
            e_lo = lo >>> 0;
            d_hi = c_hi;
            d_lo = c_lo;
            c_hi = b_hi;
            c_lo = b_lo;
            b_hi = a_hi;
            b_lo = a_lo;
            lo = t1_lo + t2_lo;
            a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
            a_lo = lo >>> 0;
          }
          lo = s[0][1] + a_lo;
          s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[0][1] = lo >>> 0;
          lo = s[1][1] + b_lo;
          s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[1][1] = lo >>> 0;
          lo = s[2][1] + c_lo;
          s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[2][1] = lo >>> 0;
          lo = s[3][1] + d_lo;
          s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[3][1] = lo >>> 0;
          lo = s[4][1] + e_lo;
          s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[4][1] = lo >>> 0;
          lo = s[5][1] + f_lo;
          s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[5][1] = lo >>> 0;
          lo = s[6][1] + g_lo;
          s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[6][1] = lo >>> 0;
          lo = s[7][1] + h_lo;
          s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
          s[7][1] = lo >>> 0;
          len -= 128;
        }
      }
    }
  });

  // node_modules/node-forge/lib/asn1-validator.js
  var require_asn1_validator = __commonJS({
    "node_modules/node-forge/lib/asn1-validator.js"(exports) {
      var forge = require_forge();
      require_asn12();
      var asn1 = forge.asn1;
      exports.privateKeyValidator = {
        // PrivateKeyInfo
        name: "PrivateKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          // Version (INTEGER)
          name: "PrivateKeyInfo.version",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "privateKeyVersion"
        }, {
          // privateKeyAlgorithm
          name: "PrivateKeyInfo.privateKeyAlgorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "AlgorithmIdentifier.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "privateKeyOid"
          }]
        }, {
          // PrivateKey
          name: "PrivateKeyInfo",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "privateKey"
        }]
      };
      exports.publicKeyValidator = {
        name: "SubjectPublicKeyInfo",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "subjectPublicKeyInfo",
        value: [
          {
            name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: "AlgorithmIdentifier.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "publicKeyOid"
            }]
          },
          // capture group for ed25519PublicKey
          {
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            composed: true,
            captureBitStringValue: "ed25519PublicKey"
          }
          // FIXME: this is capture group for rsaPublicKey, use it in this API or
          // discard?
          /* {
            // subjectPublicKey
            name: 'SubjectPublicKeyInfo.subjectPublicKey',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            value: [{
              // RSAPublicKey
              name: 'SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey',
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.SEQUENCE,
              constructed: true,
              optional: true,
              captureAsn1: 'rsaPublicKey'
            }]
          } */
        ]
      };
    }
  });

  // node_modules/node-forge/lib/ed25519.js
  var require_ed25519 = __commonJS({
    "node_modules/node-forge/lib/ed25519.js"(exports, module) {
      var forge = require_forge();
      require_jsbn2();
      require_random();
      require_sha5122();
      require_util();
      var asn1Validator = require_asn1_validator();
      var publicKeyValidator = asn1Validator.publicKeyValidator;
      var privateKeyValidator = asn1Validator.privateKeyValidator;
      if (typeof BigInteger === "undefined") {
        BigInteger = forge.jsbn.BigInteger;
      }
      var BigInteger;
      var ByteBuffer = forge.util.ByteBuffer;
      var NativeBuffer = typeof Buffer === "undefined" ? Uint8Array : Buffer;
      forge.pki = forge.pki || {};
      module.exports = forge.pki.ed25519 = forge.ed25519 = forge.ed25519 || {};
      var ed25519 = forge.ed25519;
      ed25519.constants = {};
      ed25519.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
      ed25519.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
      ed25519.constants.SEED_BYTE_LENGTH = 32;
      ed25519.constants.SIGN_BYTE_LENGTH = 64;
      ed25519.constants.HASH_BYTE_LENGTH = 64;
      ed25519.generateKeyPair = function(options) {
        options = options || {};
        var seed = options.seed;
        if (seed === void 0) {
          seed = forge.random.getBytesSync(ed25519.constants.SEED_BYTE_LENGTH);
        } else if (typeof seed === "string") {
          if (seed.length !== ed25519.constants.SEED_BYTE_LENGTH) {
            throw new TypeError(
              '"seed" must be ' + ed25519.constants.SEED_BYTE_LENGTH + " bytes in length."
            );
          }
        } else if (!(seed instanceof Uint8Array)) {
          throw new TypeError(
            '"seed" must be a node.js Buffer, Uint8Array, or a binary string.'
          );
        }
        seed = messageToNativeBuffer({ message: seed, encoding: "binary" });
        var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
        var sk = new NativeBuffer(ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
        for (var i = 0; i < 32; ++i) {
          sk[i] = seed[i];
        }
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, privateKey: sk };
      };
      ed25519.privateKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        var valid = forge.asn1.validate(obj, privateKeyValidator, capture, errors);
        if (!valid) {
          var error = new Error("Invalid Key.");
          error.errors = errors;
          throw error;
        }
        var oid = forge.asn1.derToOid(capture.privateKeyOid);
        var ed25519Oid = forge.oids.EdDSA25519;
        if (oid !== ed25519Oid) {
          throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
        }
        var privateKey = capture.privateKey;
        var privateKeyBytes = messageToNativeBuffer({
          message: forge.asn1.fromDer(privateKey).value,
          encoding: "binary"
        });
        return { privateKeyBytes };
      };
      ed25519.publicKeyFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        var valid = forge.asn1.validate(obj, publicKeyValidator, capture, errors);
        if (!valid) {
          var error = new Error("Invalid Key.");
          error.errors = errors;
          throw error;
        }
        var oid = forge.asn1.derToOid(capture.publicKeyOid);
        var ed25519Oid = forge.oids.EdDSA25519;
        if (oid !== ed25519Oid) {
          throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
        }
        var publicKeyBytes = capture.ed25519PublicKey;
        if (publicKeyBytes.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
          throw new Error("Key length is invalid.");
        }
        return messageToNativeBuffer({
          message: publicKeyBytes,
          encoding: "binary"
        });
      };
      ed25519.publicKeyFromPrivateKey = function(options) {
        options = options || {};
        var privateKey = messageToNativeBuffer({
          message: options.privateKey,
          encoding: "binary"
        });
        if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
          throw new TypeError(
            '"options.privateKey" must have a byte length of ' + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH
          );
        }
        var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
        for (var i = 0; i < pk.length; ++i) {
          pk[i] = privateKey[32 + i];
        }
        return pk;
      };
      ed25519.sign = function(options) {
        options = options || {};
        var msg = messageToNativeBuffer(options);
        var privateKey = messageToNativeBuffer({
          message: options.privateKey,
          encoding: "binary"
        });
        if (privateKey.length === ed25519.constants.SEED_BYTE_LENGTH) {
          var keyPair = ed25519.generateKeyPair({ seed: privateKey });
          privateKey = keyPair.privateKey;
        } else if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
          throw new TypeError(
            '"options.privateKey" must have a byte length of ' + ed25519.constants.SEED_BYTE_LENGTH + " or " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH
          );
        }
        var signedMsg = new NativeBuffer(
          ed25519.constants.SIGN_BYTE_LENGTH + msg.length
        );
        crypto_sign(signedMsg, msg, msg.length, privateKey);
        var sig = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH);
        for (var i = 0; i < sig.length; ++i) {
          sig[i] = signedMsg[i];
        }
        return sig;
      };
      ed25519.verify = function(options) {
        options = options || {};
        var msg = messageToNativeBuffer(options);
        if (options.signature === void 0) {
          throw new TypeError(
            '"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.'
          );
        }
        var sig = messageToNativeBuffer({
          message: options.signature,
          encoding: "binary"
        });
        if (sig.length !== ed25519.constants.SIGN_BYTE_LENGTH) {
          throw new TypeError(
            '"options.signature" must have a byte length of ' + ed25519.constants.SIGN_BYTE_LENGTH
          );
        }
        var publicKey = messageToNativeBuffer({
          message: options.publicKey,
          encoding: "binary"
        });
        if (publicKey.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
          throw new TypeError(
            '"options.publicKey" must have a byte length of ' + ed25519.constants.PUBLIC_KEY_BYTE_LENGTH
          );
        }
        var sm = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
        var m = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
        var i;
        for (i = 0; i < ed25519.constants.SIGN_BYTE_LENGTH; ++i) {
          sm[i] = sig[i];
        }
        for (i = 0; i < msg.length; ++i) {
          sm[i + ed25519.constants.SIGN_BYTE_LENGTH] = msg[i];
        }
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      function messageToNativeBuffer(options) {
        var message = options.message;
        if (message instanceof Uint8Array || message instanceof NativeBuffer) {
          return message;
        }
        var encoding = options.encoding;
        if (message === void 0) {
          if (options.md) {
            message = options.md.digest().getBytes();
            encoding = "binary";
          } else {
            throw new TypeError('"options.message" or "options.md" not specified.');
          }
        }
        if (typeof message === "string" && !encoding) {
          throw new TypeError('"options.encoding" must be "binary" or "utf8".');
        }
        if (typeof message === "string") {
          if (typeof Buffer !== "undefined") {
            return Buffer.from(message, encoding);
          }
          message = new ByteBuffer(message, encoding);
        } else if (!(message instanceof ByteBuffer)) {
          throw new TypeError(
            '"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.'
          );
        }
        var buffer = new NativeBuffer(message.length());
        for (var i = 0; i < buffer.length; ++i) {
          buffer[i] = message.at(i);
        }
        return buffer;
      }
      var gf0 = gf();
      var gf1 = gf([1]);
      var D = gf([
        30883,
        4953,
        19914,
        30187,
        55467,
        16705,
        2637,
        112,
        59544,
        30585,
        16505,
        36039,
        65139,
        11119,
        27886,
        20995
      ]);
      var D2 = gf([
        61785,
        9906,
        39828,
        60374,
        45398,
        33411,
        5274,
        224,
        53552,
        61171,
        33010,
        6542,
        64743,
        22239,
        55772,
        9222
      ]);
      var X = gf([
        54554,
        36645,
        11616,
        51542,
        42930,
        38181,
        51040,
        26924,
        56412,
        64982,
        57905,
        49316,
        21502,
        52590,
        14035,
        8553
      ]);
      var Y = gf([
        26200,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214
      ]);
      var L = new Float64Array([
        237,
        211,
        245,
        92,
        26,
        99,
        18,
        88,
        214,
        156,
        247,
        162,
        222,
        249,
        222,
        20,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        16
      ]);
      var I = gf([
        41136,
        18958,
        6951,
        50414,
        58488,
        44335,
        6150,
        12099,
        55207,
        15867,
        153,
        11085,
        57099,
        20417,
        9344,
        11139
      ]);
      function sha512(msg, msgLen) {
        var md = forge.md.sha512.create();
        var buffer = new ByteBuffer(msg);
        md.update(buffer.getBytes(msgLen), "binary");
        var hash = md.digest().getBytes();
        if (typeof Buffer !== "undefined") {
          return Buffer.from(hash, "binary");
        }
        var out = new NativeBuffer(ed25519.constants.HASH_BYTE_LENGTH);
        for (var i = 0; i < 64; ++i) {
          out[i] = hash.charCodeAt(i);
        }
        return out;
      }
      function crypto_sign_keypair(pk, sk) {
        var p = [gf(), gf(), gf(), gf()];
        var i;
        var d = sha512(sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; ++i) {
          sk[i + 32] = pk[i];
        }
        return 0;
      }
      function crypto_sign(sm, m, n, sk) {
        var i, j, x = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var d = sha512(sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; ++i) {
          sm[64 + i] = m[i];
        }
        for (i = 0; i < 32; ++i) {
          sm[32 + i] = d[32 + i];
        }
        var r = sha512(sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; ++i) {
          sm[i] = sk[i];
        }
        var h = sha512(sm, n + 64);
        reduce(h);
        for (i = 32; i < 64; ++i) {
          x[i] = 0;
        }
        for (i = 0; i < 32; ++i) {
          x[i] = r[i];
        }
        for (i = 0; i < 32; ++i) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i, mlen;
        var t = new NativeBuffer(32);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        mlen = -1;
        if (n < 64) {
          return -1;
        }
        if (unpackneg(q, pk)) {
          return -1;
        }
        if (!_isCanonicalSignatureScalar(sm, 32)) {
          return -1;
        }
        for (i = 0; i < n; ++i) {
          m[i] = sm[i];
        }
        for (i = 0; i < 32; ++i) {
          m[i + 32] = pk[i];
        }
        var h = sha512(m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; ++i) {
            m[i] = 0;
          }
          return -1;
        }
        for (i = 0; i < n; ++i) {
          m[i] = sm[i + 64];
        }
        mlen = n;
        return mlen;
      }
      function _isCanonicalSignatureScalar(bytes, offset) {
        var i;
        for (i = 31; i >= 0; --i) {
          if (bytes[offset + i] < L[i]) {
            return true;
          }
          if (bytes[offset + i] > L[i]) {
            return false;
          }
        }
        return false;
      }
      function modL(r, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = x[j] + 128 >> 8;
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; ++j) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; ++j) {
          x[j] -= carry * L[j];
        }
        for (i = 0; i < 32; ++i) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      function reduce(r) {
        var x = new Float64Array(64);
        for (var i = 0; i < 64; ++i) {
          x[i] = r[i];
          r[i] = 0;
        }
        modL(r, x);
      }
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d, p[2], q[2]);
        A(d, d, d);
        Z(e, b, a);
        Z(f, d, c);
        A(g, d, c);
        A(h, b, a);
        M(p[0], e, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e, h);
      }
      function cswap(p, q, b) {
        for (var i = 0; i < 4; ++i) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; ++i) {
          t[i] = n[i];
        }
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; ++j) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; ++i) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S(num, r[1]);
        M(den, num, D);
        Z(num, num, r[2]);
        A(den, r[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r[0], t, den);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) {
          M(r[0], r[0], I);
        }
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) {
          return -1;
        }
        if (par25519(r[0]) === p[31] >> 7) {
          Z(r[0], gf0, r[0]);
        }
        M(r[3], r[0], r[1]);
        return 0;
      }
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; ++i) {
          o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        }
        o[15] &= 32767;
      }
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; ++a) {
          c[a] = i[a];
        }
        for (a = 250; a >= 0; --a) {
          S(c, c);
          if (a !== 1) {
            M(c, c, i);
          }
        }
        for (a = 0; a < 16; ++a) {
          o[a] = c[a];
        }
      }
      function neq25519(a, b) {
        var c = new NativeBuffer(32);
        var d = new NativeBuffer(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      function vn(x, xi, y, yi, n) {
        var i, d = 0;
        for (i = 0; i < n; ++i) {
          d |= x[xi + i] ^ y[yi + i];
        }
        return (1 & d - 1 >>> 8) - 1;
      }
      function par25519(a) {
        var d = new NativeBuffer(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function scalarmult(p, q, s) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++) {
          r[i] = a[i] | 0;
        }
      }
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; ++a) {
          c[a] = i[a];
        }
        for (a = 253; a >= 0; --a) {
          S(c, c);
          if (a !== 2 && a !== 4) {
            M(c, c, i);
          }
        }
        for (a = 0; a < 16; ++a) {
          o[a] = c[a];
        }
      }
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; ++i) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; ++i) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function gf(init) {
        var i, r = new Float64Array(16);
        if (init) {
          for (i = 0; i < init.length; ++i) {
            r[i] = init[i];
          }
        }
        return r;
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; ++i) {
          o[i] = a[i] + b[i];
        }
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; ++i) {
          o[i] = a[i] - b[i];
        }
      }
      function S(o, a) {
        M(o, a, a);
      }
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
    }
  });

  // node_modules/node-forge/lib/kem.js
  var require_kem = __commonJS({
    "node_modules/node-forge/lib/kem.js"(exports, module) {
      var forge = require_forge();
      require_util();
      require_random();
      require_jsbn2();
      module.exports = forge.kem = forge.kem || {};
      var BigInteger = forge.jsbn.BigInteger;
      forge.kem.rsa = {};
      forge.kem.rsa.create = function(kdf, options) {
        options = options || {};
        var prng = options.prng || forge.random;
        var kem = {};
        kem.encrypt = function(publicKey, keyLength) {
          var byteLength = Math.ceil(publicKey.n.bitLength() / 8);
          var r;
          do {
            r = new BigInteger(
              forge.util.bytesToHex(prng.getBytesSync(byteLength)),
              16
            ).mod(publicKey.n);
          } while (r.compareTo(BigInteger.ONE) <= 0);
          r = forge.util.hexToBytes(r.toString(16));
          var zeros = byteLength - r.length;
          if (zeros > 0) {
            r = forge.util.fillString(String.fromCharCode(0), zeros) + r;
          }
          var encapsulation = publicKey.encrypt(r, "NONE");
          var key = kdf.generate(r, keyLength);
          return { encapsulation, key };
        };
        kem.decrypt = function(privateKey, encapsulation, keyLength) {
          var r = privateKey.decrypt(encapsulation, "NONE");
          return kdf.generate(r, keyLength);
        };
        return kem;
      };
      forge.kem.kdf1 = function(md, digestLength) {
        _createKDF(this, md, 0, digestLength || md.digestLength);
      };
      forge.kem.kdf2 = function(md, digestLength) {
        _createKDF(this, md, 1, digestLength || md.digestLength);
      };
      function _createKDF(kdf, md, counterStart, digestLength) {
        kdf.generate = function(x, length) {
          var key = new forge.util.ByteBuffer();
          var k = Math.ceil(length / digestLength) + counterStart;
          var c = new forge.util.ByteBuffer();
          for (var i = counterStart; i < k; ++i) {
            c.putInt32(i);
            md.start();
            md.update(x + c.getBytes());
            var hash = md.digest();
            key.putBytes(hash.getBytes(digestLength));
          }
          key.truncate(key.length() - length);
          return key.getBytes();
        };
      }
    }
  });

  // node_modules/node-forge/lib/log.js
  var require_log = __commonJS({
    "node_modules/node-forge/lib/log.js"(exports, module) {
      var forge = require_forge();
      require_util();
      module.exports = forge.log = forge.log || {};
      forge.log.levels = [
        "none",
        "error",
        "warning",
        "info",
        "debug",
        "verbose",
        "max"
      ];
      var sLevelInfo = {};
      var sLoggers = [];
      var sConsoleLogger = null;
      forge.log.LEVEL_LOCKED = 1 << 1;
      forge.log.NO_LEVEL_CHECK = 1 << 2;
      forge.log.INTERPOLATE = 1 << 3;
      for (i = 0; i < forge.log.levels.length; ++i) {
        level = forge.log.levels[i];
        sLevelInfo[level] = {
          index: i,
          name: level.toUpperCase()
        };
      }
      var level;
      var i;
      forge.log.logMessage = function(message) {
        var messageLevelIndex = sLevelInfo[message.level].index;
        for (var i2 = 0; i2 < sLoggers.length; ++i2) {
          var logger2 = sLoggers[i2];
          if (logger2.flags & forge.log.NO_LEVEL_CHECK) {
            logger2.f(message);
          } else {
            var loggerLevelIndex = sLevelInfo[logger2.level].index;
            if (messageLevelIndex <= loggerLevelIndex) {
              logger2.f(logger2, message);
            }
          }
        }
      };
      forge.log.prepareStandard = function(message) {
        if (!("standard" in message)) {
          message.standard = sLevelInfo[message.level].name + //' ' + +message.timestamp +
          " [" + message.category + "] " + message.message;
        }
      };
      forge.log.prepareFull = function(message) {
        if (!("full" in message)) {
          var args = [message.message];
          args = args.concat([]);
          message.full = forge.util.format.apply(this, args);
        }
      };
      forge.log.prepareStandardFull = function(message) {
        if (!("standardFull" in message)) {
          forge.log.prepareStandard(message);
          message.standardFull = message.standard;
        }
      };
      if (true) {
        levels = ["error", "warning", "info", "debug", "verbose"];
        for (i = 0; i < levels.length; ++i) {
          (function(level2) {
            forge.log[level2] = function(category, message) {
              var args = Array.prototype.slice.call(arguments).slice(2);
              var msg = {
                timestamp: /* @__PURE__ */ new Date(),
                level: level2,
                category,
                message,
                "arguments": args
                /*standard*/
                /*full*/
                /*fullMessage*/
              };
              forge.log.logMessage(msg);
            };
          })(levels[i]);
        }
      }
      var levels;
      var i;
      forge.log.makeLogger = function(logFunction) {
        var logger2 = {
          flags: 0,
          f: logFunction
        };
        forge.log.setLevel(logger2, "none");
        return logger2;
      };
      forge.log.setLevel = function(logger2, level2) {
        var rval = false;
        if (logger2 && !(logger2.flags & forge.log.LEVEL_LOCKED)) {
          for (var i2 = 0; i2 < forge.log.levels.length; ++i2) {
            var aValidLevel = forge.log.levels[i2];
            if (level2 == aValidLevel) {
              logger2.level = level2;
              rval = true;
              break;
            }
          }
        }
        return rval;
      };
      forge.log.lock = function(logger2, lock2) {
        if (typeof lock2 === "undefined" || lock2) {
          logger2.flags |= forge.log.LEVEL_LOCKED;
        } else {
          logger2.flags &= ~forge.log.LEVEL_LOCKED;
        }
      };
      forge.log.addLogger = function(logger2) {
        sLoggers.push(logger2);
      };
      if (typeof console !== "undefined" && "log" in console) {
        if (console.error && console.warn && console.info && console.debug) {
          levelHandlers = {
            error: console.error,
            warning: console.warn,
            info: console.info,
            debug: console.debug,
            verbose: console.debug
          };
          f = function(logger2, message) {
            forge.log.prepareStandard(message);
            var handler = levelHandlers[message.level];
            var args = [message.standard];
            args = args.concat(message["arguments"].slice());
            handler.apply(console, args);
          };
          logger = forge.log.makeLogger(f);
        } else {
          f = function(logger2, message) {
            forge.log.prepareStandardFull(message);
            console.log(message.standardFull);
          };
          logger = forge.log.makeLogger(f);
        }
        forge.log.setLevel(logger, "debug");
        forge.log.addLogger(logger);
        sConsoleLogger = logger;
      } else {
        console = {
          log: function() {
          }
        };
      }
      var logger;
      var levelHandlers;
      var f;
      if (sConsoleLogger !== null && typeof window !== "undefined" && window.location) {
        query = new URL(window.location.href).searchParams;
        if (query.has("console.level")) {
          forge.log.setLevel(
            sConsoleLogger,
            query.get("console.level").slice(-1)[0]
          );
        }
        if (query.has("console.lock")) {
          lock = query.get("console.lock").slice(-1)[0];
          if (lock == "true") {
            forge.log.lock(sConsoleLogger);
          }
        }
      }
      var query;
      var lock;
      forge.log.consoleLogger = sConsoleLogger;
    }
  });

  // node_modules/node-forge/lib/md.all.js
  var require_md_all = __commonJS({
    "node_modules/node-forge/lib/md.all.js"(exports, module) {
      module.exports = require_md();
      require_md52();
      require_sha12();
      require_sha2562();
      require_sha5122();
    }
  });

  // node_modules/node-forge/lib/pkcs7.js
  var require_pkcs7 = __commonJS({
    "node_modules/node-forge/lib/pkcs7.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_asn12();
      require_des();
      require_oids();
      require_pem();
      require_pkcs7asn1();
      require_random();
      require_util();
      require_x509();
      var asn1 = forge.asn1;
      var p7 = module.exports = forge.pkcs7 = forge.pkcs7 || {};
      p7.messageFromPem = function(pem) {
        var msg = forge.pem.decode(pem)[0];
        if (msg.type !== "PKCS7") {
          var error = new Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
          error.headerType = msg.type;
          throw error;
        }
        if (msg.procType && msg.procType.type === "ENCRYPTED") {
          throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
        }
        var obj = asn1.fromDer(msg.body);
        return p7.messageFromAsn1(obj);
      };
      p7.messageToPem = function(msg, maxline) {
        var pemObj = {
          type: "PKCS7",
          body: asn1.toDer(msg.toAsn1()).getBytes()
        };
        return forge.pem.encode(pemObj, { maxline });
      };
      p7.messageFromAsn1 = function(obj) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors)) {
          var error = new Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
          error.errors = errors;
          throw error;
        }
        var contentType = asn1.derToOid(capture.contentType);
        var msg;
        switch (contentType) {
          case forge.pki.oids.envelopedData:
            msg = p7.createEnvelopedData();
            break;
          case forge.pki.oids.encryptedData:
            msg = p7.createEncryptedData();
            break;
          case forge.pki.oids.signedData:
            msg = p7.createSignedData();
            break;
          default:
            throw new Error("Cannot read PKCS#7 message. ContentType with OID " + contentType + " is not (yet) supported.");
        }
        msg.fromAsn1(capture.content.value[0]);
        return msg;
      };
      p7.createSignedData = function() {
        var msg = null;
        msg = {
          type: forge.pki.oids.signedData,
          version: 1,
          certificates: [],
          crls: [],
          // TODO: add json-formatted signer stuff here?
          signers: [],
          // populated during sign()
          digestAlgorithmIdentifiers: [],
          contentInfo: null,
          signerInfos: [],
          fromAsn1: function(obj) {
            _fromAsn1(msg, obj, p7.asn1.signedDataValidator);
            msg.certificates = [];
            msg.crls = [];
            msg.digestAlgorithmIdentifiers = [];
            msg.contentInfo = null;
            msg.signerInfos = [];
            if (msg.rawCapture.certificates) {
              var certs = msg.rawCapture.certificates.value;
              for (var i = 0; i < certs.length; ++i) {
                msg.certificates.push(forge.pki.certificateFromAsn1(certs[i]));
              }
            }
          },
          toAsn1: function() {
            if (!msg.contentInfo) {
              msg.sign();
            }
            var certs = [];
            for (var i = 0; i < msg.certificates.length; ++i) {
              certs.push(forge.pki.certificateToAsn1(msg.certificates[i]));
            }
            var crls = [];
            var signedData = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // Version
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.INTEGER,
                  false,
                  asn1.integerToDer(msg.version).getBytes()
                ),
                // DigestAlgorithmIdentifiers
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.SET,
                  true,
                  msg.digestAlgorithmIdentifiers
                ),
                // ContentInfo
                msg.contentInfo
              ])
            ]);
            if (certs.length > 0) {
              signedData.value[0].value.push(
                asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, certs)
              );
            }
            if (crls.length > 0) {
              signedData.value[0].value.push(
                asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, crls)
              );
            }
            signedData.value[0].value.push(
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.SET,
                true,
                msg.signerInfos
              )
            );
            return asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.SEQUENCE,
              true,
              [
                // ContentType
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(msg.type).getBytes()
                ),
                // [0] SignedData
                signedData
              ]
            );
          },
          /**
           * Add (another) entity to list of signers.
           *
           * Note: If authenticatedAttributes are provided, then, per RFC 2315,
           * they must include at least two attributes: content type and
           * message digest. The message digest attribute value will be
           * auto-calculated during signing and will be ignored if provided.
           *
           * Here's an example of providing these two attributes:
           *
           * forge.pkcs7.createSignedData();
           * p7.addSigner({
           *   issuer: cert.issuer.attributes,
           *   serialNumber: cert.serialNumber,
           *   key: privateKey,
           *   digestAlgorithm: forge.pki.oids.sha1,
           *   authenticatedAttributes: [{
           *     type: forge.pki.oids.contentType,
           *     value: forge.pki.oids.data
           *   }, {
           *     type: forge.pki.oids.messageDigest
           *   }]
           * });
           *
           * TODO: Support [subjectKeyIdentifier] as signer's ID.
           *
           * @param signer the signer information:
           *          key the signer's private key.
           *          [certificate] a certificate containing the public key
           *            associated with the signer's private key; use this option as
           *            an alternative to specifying signer.issuer and
           *            signer.serialNumber.
           *          [issuer] the issuer attributes (eg: cert.issuer.attributes).
           *          [serialNumber] the signer's certificate's serial number in
           *           hexadecimal (eg: cert.serialNumber).
           *          [digestAlgorithm] the message digest OID, as a string, to use
           *            (eg: forge.pki.oids.sha1).
           *          [authenticatedAttributes] an optional array of attributes
           *            to also sign along with the content.
           */
          addSigner: function(signer) {
            var issuer = signer.issuer;
            var serialNumber = signer.serialNumber;
            if (signer.certificate) {
              var cert = signer.certificate;
              if (typeof cert === "string") {
                cert = forge.pki.certificateFromPem(cert);
              }
              issuer = cert.issuer.attributes;
              serialNumber = cert.serialNumber;
            }
            var key = signer.key;
            if (!key) {
              throw new Error(
                "Could not add PKCS#7 signer; no private key specified."
              );
            }
            if (typeof key === "string") {
              key = forge.pki.privateKeyFromPem(key);
            }
            var digestAlgorithm = signer.digestAlgorithm || forge.pki.oids.sha1;
            switch (digestAlgorithm) {
              case forge.pki.oids.sha1:
              case forge.pki.oids.sha256:
              case forge.pki.oids.sha384:
              case forge.pki.oids.sha512:
              case forge.pki.oids.md5:
                break;
              default:
                throw new Error(
                  "Could not add PKCS#7 signer; unknown message digest algorithm: " + digestAlgorithm
                );
            }
            var authenticatedAttributes = signer.authenticatedAttributes || [];
            if (authenticatedAttributes.length > 0) {
              var contentType = false;
              var messageDigest = false;
              for (var i = 0; i < authenticatedAttributes.length; ++i) {
                var attr = authenticatedAttributes[i];
                if (!contentType && attr.type === forge.pki.oids.contentType) {
                  contentType = true;
                  if (messageDigest) {
                    break;
                  }
                  continue;
                }
                if (!messageDigest && attr.type === forge.pki.oids.messageDigest) {
                  messageDigest = true;
                  if (contentType) {
                    break;
                  }
                  continue;
                }
              }
              if (!contentType || !messageDigest) {
                throw new Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.");
              }
            }
            msg.signers.push({
              key,
              version: 1,
              issuer,
              serialNumber,
              digestAlgorithm,
              signatureAlgorithm: forge.pki.oids.rsaEncryption,
              signature: null,
              authenticatedAttributes,
              unauthenticatedAttributes: []
            });
          },
          /**
           * Signs the content.
           * @param options Options to apply when signing:
           *    [detached] boolean. If signing should be done in detached mode. Defaults to false.
           */
          sign: function(options) {
            options = options || {};
            if (typeof msg.content !== "object" || msg.contentInfo === null) {
              msg.contentInfo = asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.SEQUENCE,
                true,
                [
                  // ContentType
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.OID,
                    false,
                    asn1.oidToDer(forge.pki.oids.data).getBytes()
                  )
                ]
              );
              if ("content" in msg) {
                var content;
                if (msg.content instanceof forge.util.ByteBuffer) {
                  content = msg.content.bytes();
                } else if (typeof msg.content === "string") {
                  content = forge.util.encodeUtf8(msg.content);
                }
                if (options.detached) {
                  msg.detachedContent = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content);
                } else {
                  msg.contentInfo.value.push(
                    // [0] EXPLICIT content
                    asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                      asn1.create(
                        asn1.Class.UNIVERSAL,
                        asn1.Type.OCTETSTRING,
                        false,
                        content
                      )
                    ])
                  );
                }
              }
            }
            if (msg.signers.length === 0) {
              return;
            }
            var mds = addDigestAlgorithmIds();
            addSignerInfos(mds);
          },
          verify: function() {
            throw new Error("PKCS#7 signature verification not yet implemented.");
          },
          /**
           * Add a certificate.
           *
           * @param cert the certificate to add.
           */
          addCertificate: function(cert) {
            if (typeof cert === "string") {
              cert = forge.pki.certificateFromPem(cert);
            }
            msg.certificates.push(cert);
          },
          /**
           * Add a certificate revokation list.
           *
           * @param crl the certificate revokation list to add.
           */
          addCertificateRevokationList: function(crl) {
            throw new Error("PKCS#7 CRL support not yet implemented.");
          }
        };
        return msg;
        function addDigestAlgorithmIds() {
          var mds = {};
          for (var i = 0; i < msg.signers.length; ++i) {
            var signer = msg.signers[i];
            var oid = signer.digestAlgorithm;
            if (!(oid in mds)) {
              mds[oid] = forge.md[forge.pki.oids[oid]].create();
            }
            if (signer.authenticatedAttributes.length === 0) {
              signer.md = mds[oid];
            } else {
              signer.md = forge.md[forge.pki.oids[oid]].create();
            }
          }
          msg.digestAlgorithmIdentifiers = [];
          for (var oid in mds) {
            msg.digestAlgorithmIdentifiers.push(
              // AlgorithmIdentifier
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                // algorithm
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(oid).getBytes()
                ),
                // parameters (null)
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
              ])
            );
          }
          return mds;
        }
        function addSignerInfos(mds) {
          var content;
          if (msg.detachedContent) {
            content = msg.detachedContent;
          } else {
            content = msg.contentInfo.value[1];
            content = content.value[0];
          }
          if (!content) {
            throw new Error(
              "Could not sign PKCS#7 message; there is no content to sign."
            );
          }
          var contentType = asn1.derToOid(msg.contentInfo.value[0].value);
          var bytes = asn1.toDer(content);
          bytes.getByte();
          asn1.getBerValueLength(bytes);
          bytes = bytes.getBytes();
          for (var oid in mds) {
            mds[oid].start().update(bytes);
          }
          var signingTime = /* @__PURE__ */ new Date();
          for (var i = 0; i < msg.signers.length; ++i) {
            var signer = msg.signers[i];
            if (signer.authenticatedAttributes.length === 0) {
              if (contentType !== forge.pki.oids.data) {
                throw new Error(
                  "Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data."
                );
              }
            } else {
              signer.authenticatedAttributesAsn1 = asn1.create(
                asn1.Class.CONTEXT_SPECIFIC,
                0,
                true,
                []
              );
              var attrsAsn1 = asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.SET,
                true,
                []
              );
              for (var ai = 0; ai < signer.authenticatedAttributes.length; ++ai) {
                var attr = signer.authenticatedAttributes[ai];
                if (attr.type === forge.pki.oids.messageDigest) {
                  attr.value = mds[signer.digestAlgorithm].digest();
                } else if (attr.type === forge.pki.oids.signingTime) {
                  if (!attr.value) {
                    attr.value = signingTime;
                  }
                }
                attrsAsn1.value.push(_attributeToAsn1(attr));
                signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
              }
              bytes = asn1.toDer(attrsAsn1).getBytes();
              signer.md.start().update(bytes);
            }
            signer.signature = signer.key.sign(signer.md, "RSASSA-PKCS1-V1_5");
          }
          msg.signerInfos = _signersToAsn1(msg.signers);
        }
      };
      p7.createEncryptedData = function() {
        var msg = null;
        msg = {
          type: forge.pki.oids.encryptedData,
          version: 0,
          encryptedContent: {
            algorithm: forge.pki.oids["aes256-CBC"]
          },
          /**
           * Reads an EncryptedData content block (in ASN.1 format)
           *
           * @param obj The ASN.1 representation of the EncryptedData content block
           */
          fromAsn1: function(obj) {
            _fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
          },
          /**
           * Decrypt encrypted content
           *
           * @param key The (symmetric) key as a byte buffer
           */
          decrypt: function(key) {
            if (key !== void 0) {
              msg.encryptedContent.key = key;
            }
            _decryptContent(msg);
          }
        };
        return msg;
      };
      p7.createEnvelopedData = function() {
        var msg = null;
        msg = {
          type: forge.pki.oids.envelopedData,
          version: 0,
          recipients: [],
          encryptedContent: {
            algorithm: forge.pki.oids["aes256-CBC"]
          },
          /**
           * Reads an EnvelopedData content block (in ASN.1 format)
           *
           * @param obj the ASN.1 representation of the EnvelopedData content block.
           */
          fromAsn1: function(obj) {
            var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
            msg.recipients = _recipientsFromAsn1(capture.recipientInfos.value);
          },
          toAsn1: function() {
            return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              // ContentType
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer(msg.type).getBytes()
              ),
              // [0] EnvelopedData
              asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                  // Version
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.INTEGER,
                    false,
                    asn1.integerToDer(msg.version).getBytes()
                  ),
                  // RecipientInfos
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.SET,
                    true,
                    _recipientsToAsn1(msg.recipients)
                  ),
                  // EncryptedContentInfo
                  asn1.create(
                    asn1.Class.UNIVERSAL,
                    asn1.Type.SEQUENCE,
                    true,
                    _encryptedContentToAsn1(msg.encryptedContent)
                  )
                ])
              ])
            ]);
          },
          /**
           * Find recipient by X.509 certificate's issuer.
           *
           * @param cert the certificate with the issuer to look for.
           *
           * @return the recipient object.
           */
          findRecipient: function(cert) {
            var sAttr = cert.issuer.attributes;
            for (var i = 0; i < msg.recipients.length; ++i) {
              var r = msg.recipients[i];
              var rAttr = r.issuer;
              if (r.serialNumber !== cert.serialNumber) {
                continue;
              }
              if (rAttr.length !== sAttr.length) {
                continue;
              }
              var match = true;
              for (var j = 0; j < sAttr.length; ++j) {
                if (rAttr[j].type !== sAttr[j].type || rAttr[j].value !== sAttr[j].value) {
                  match = false;
                  break;
                }
              }
              if (match) {
                return r;
              }
            }
            return null;
          },
          /**
           * Decrypt enveloped content
           *
           * @param recipient The recipient object related to the private key
           * @param privKey The (RSA) private key object
           */
          decrypt: function(recipient, privKey) {
            if (msg.encryptedContent.key === void 0 && recipient !== void 0 && privKey !== void 0) {
              switch (recipient.encryptedContent.algorithm) {
                case forge.pki.oids.rsaEncryption:
                case forge.pki.oids.desCBC:
                  var key = privKey.decrypt(recipient.encryptedContent.content);
                  msg.encryptedContent.key = forge.util.createBuffer(key);
                  break;
                default:
                  throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
              }
            }
            _decryptContent(msg);
          },
          /**
           * Add (another) entity to list of recipients.
           *
           * @param cert The certificate of the entity to add.
           */
          addRecipient: function(cert) {
            msg.recipients.push({
              version: 0,
              issuer: cert.issuer.attributes,
              serialNumber: cert.serialNumber,
              encryptedContent: {
                // We simply assume rsaEncryption here, since forge.pki only
                // supports RSA so far.  If the PKI module supports other
                // ciphers one day, we need to modify this one as well.
                algorithm: forge.pki.oids.rsaEncryption,
                key: cert.publicKey
              }
            });
          },
          /**
           * Encrypt enveloped content.
           *
           * This function supports two optional arguments, cipher and key, which
           * can be used to influence symmetric encryption.  Unless cipher is
           * provided, the cipher specified in encryptedContent.algorithm is used
           * (defaults to AES-256-CBC).  If no key is provided, encryptedContent.key
           * is (re-)used.  If that one's not set, a random key will be generated
           * automatically.
           *
           * @param [key] The key to be used for symmetric encryption.
           * @param [cipher] The OID of the symmetric cipher to use.
           */
          encrypt: function(key, cipher) {
            if (msg.encryptedContent.content === void 0) {
              cipher = cipher || msg.encryptedContent.algorithm;
              key = key || msg.encryptedContent.key;
              var keyLen, ivLen, ciphFn;
              switch (cipher) {
                case forge.pki.oids["aes128-CBC"]:
                  keyLen = 16;
                  ivLen = 16;
                  ciphFn = forge.aes.createEncryptionCipher;
                  break;
                case forge.pki.oids["aes192-CBC"]:
                  keyLen = 24;
                  ivLen = 16;
                  ciphFn = forge.aes.createEncryptionCipher;
                  break;
                case forge.pki.oids["aes256-CBC"]:
                  keyLen = 32;
                  ivLen = 16;
                  ciphFn = forge.aes.createEncryptionCipher;
                  break;
                case forge.pki.oids["des-EDE3-CBC"]:
                  keyLen = 24;
                  ivLen = 8;
                  ciphFn = forge.des.createEncryptionCipher;
                  break;
                default:
                  throw new Error("Unsupported symmetric cipher, OID " + cipher);
              }
              if (key === void 0) {
                key = forge.util.createBuffer(forge.random.getBytes(keyLen));
              } else if (key.length() != keyLen) {
                throw new Error("Symmetric key has wrong length; got " + key.length() + " bytes, expected " + keyLen + ".");
              }
              msg.encryptedContent.algorithm = cipher;
              msg.encryptedContent.key = key;
              msg.encryptedContent.parameter = forge.util.createBuffer(
                forge.random.getBytes(ivLen)
              );
              var ciph = ciphFn(key);
              ciph.start(msg.encryptedContent.parameter.copy());
              ciph.update(msg.content);
              if (!ciph.finish()) {
                throw new Error("Symmetric encryption failed.");
              }
              msg.encryptedContent.content = ciph.output;
            }
            for (var i = 0; i < msg.recipients.length; ++i) {
              var recipient = msg.recipients[i];
              if (recipient.encryptedContent.content !== void 0) {
                continue;
              }
              switch (recipient.encryptedContent.algorithm) {
                case forge.pki.oids.rsaEncryption:
                  recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(
                    msg.encryptedContent.key.data
                  );
                  break;
                default:
                  throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
              }
            }
          }
        };
        return msg;
      };
      function _recipientFromAsn1(obj) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors)) {
          var error = new Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
          error.errors = errors;
          throw error;
        }
        return {
          version: capture.version.charCodeAt(0),
          issuer: forge.pki.RDNAttributesAsArray(capture.issuer),
          serialNumber: forge.util.createBuffer(capture.serial).toHex(),
          encryptedContent: {
            algorithm: asn1.derToOid(capture.encAlgorithm),
            parameter: capture.encParameter ? capture.encParameter.value : void 0,
            content: capture.encKey
          }
        };
      }
      function _recipientToAsn1(obj) {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // Version
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(obj.version).getBytes()
          ),
          // IssuerAndSerialNumber
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // Name
            forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
            // Serial
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              forge.util.hexToBytes(obj.serialNumber)
            )
          ]),
          // KeyEncryptionAlgorithmIdentifier
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // Algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()
            ),
            // Parameter, force NULL, only RSA supported for now.
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          // EncryptedKey
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            obj.encryptedContent.content
          )
        ]);
      }
      function _recipientsFromAsn1(infos) {
        var ret = [];
        for (var i = 0; i < infos.length; ++i) {
          ret.push(_recipientFromAsn1(infos[i]));
        }
        return ret;
      }
      function _recipientsToAsn1(recipients) {
        var ret = [];
        for (var i = 0; i < recipients.length; ++i) {
          ret.push(_recipientToAsn1(recipients[i]));
        }
        return ret;
      }
      function _signerToAsn1(obj) {
        var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // version
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.INTEGER,
            false,
            asn1.integerToDer(obj.version).getBytes()
          ),
          // issuerAndSerialNumber
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // name
            forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
            // serial
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.INTEGER,
              false,
              forge.util.hexToBytes(obj.serialNumber)
            )
          ]),
          // digestAlgorithm
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(obj.digestAlgorithm).getBytes()
            ),
            // parameters (null)
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ])
        ]);
        if (obj.authenticatedAttributesAsn1) {
          rval.value.push(obj.authenticatedAttributesAsn1);
        }
        rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // algorithm
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(obj.signatureAlgorithm).getBytes()
          ),
          // parameters (null)
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
        ]));
        rval.value.push(asn1.create(
          asn1.Class.UNIVERSAL,
          asn1.Type.OCTETSTRING,
          false,
          obj.signature
        ));
        if (obj.unauthenticatedAttributes.length > 0) {
          var attrsAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, []);
          for (var i = 0; i < obj.unauthenticatedAttributes.length; ++i) {
            var attr = obj.unauthenticatedAttributes[i];
            attrsAsn1.values.push(_attributeToAsn1(attr));
          }
          rval.value.push(attrsAsn1);
        }
        return rval;
      }
      function _signersToAsn1(signers) {
        var ret = [];
        for (var i = 0; i < signers.length; ++i) {
          ret.push(_signerToAsn1(signers[i]));
        }
        return ret;
      }
      function _attributeToAsn1(attr) {
        var value;
        if (attr.type === forge.pki.oids.contentType) {
          value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(attr.value).getBytes()
          );
        } else if (attr.type === forge.pki.oids.messageDigest) {
          value = asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OCTETSTRING,
            false,
            attr.value.bytes()
          );
        } else if (attr.type === forge.pki.oids.signingTime) {
          var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z");
          var jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z");
          var date = attr.value;
          if (typeof date === "string") {
            var timestamp = Date.parse(date);
            if (!isNaN(timestamp)) {
              date = new Date(timestamp);
            } else if (date.length === 13) {
              date = asn1.utcTimeToDate(date);
            } else {
              date = asn1.generalizedTimeToDate(date);
            }
          }
          if (date >= jan_1_1950 && date < jan_1_2050) {
            value = asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.UTCTIME,
              false,
              asn1.dateToUtcTime(date)
            );
          } else {
            value = asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.GENERALIZEDTIME,
              false,
              asn1.dateToGeneralizedTime(date)
            );
          }
        }
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          // AttributeType
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(attr.type).getBytes()
          ),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
            // AttributeValue
            value
          ])
        ]);
      }
      function _encryptedContentToAsn1(ec) {
        return [
          // ContentType, always Data for the moment
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(forge.pki.oids.data).getBytes()
          ),
          // ContentEncryptionAlgorithmIdentifier
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            // Algorithm
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OID,
              false,
              asn1.oidToDer(ec.algorithm).getBytes()
            ),
            // Parameters (IV)
            !ec.parameter ? void 0 : asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OCTETSTRING,
              false,
              ec.parameter.getBytes()
            )
          ]),
          // [0] EncryptedContent
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(
              asn1.Class.UNIVERSAL,
              asn1.Type.OCTETSTRING,
              false,
              ec.content.getBytes()
            )
          ])
        ];
      }
      function _fromAsn1(msg, obj, validator) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(obj, validator, capture, errors)) {
          var error = new Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
          error.errors = error;
          throw error;
        }
        var contentType = asn1.derToOid(capture.contentType);
        if (contentType !== forge.pki.oids.data) {
          throw new Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
        }
        if (capture.encryptedContent) {
          var content = "";
          if (forge.util.isArray(capture.encryptedContent)) {
            for (var i = 0; i < capture.encryptedContent.length; ++i) {
              if (capture.encryptedContent[i].type !== asn1.Type.OCTETSTRING) {
                throw new Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
              }
              content += capture.encryptedContent[i].value;
            }
          } else {
            content = capture.encryptedContent;
          }
          msg.encryptedContent = {
            algorithm: asn1.derToOid(capture.encAlgorithm),
            parameter: forge.util.createBuffer(capture.encParameter.value),
            content: forge.util.createBuffer(content)
          };
        }
        if (capture.content) {
          var content = "";
          if (forge.util.isArray(capture.content)) {
            for (var i = 0; i < capture.content.length; ++i) {
              if (capture.content[i].type !== asn1.Type.OCTETSTRING) {
                throw new Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
              }
              content += capture.content[i].value;
            }
          } else {
            content = capture.content;
          }
          msg.content = forge.util.createBuffer(content);
        }
        msg.version = capture.version.charCodeAt(0);
        msg.rawCapture = capture;
        return capture;
      }
      function _decryptContent(msg) {
        if (msg.encryptedContent.key === void 0) {
          throw new Error("Symmetric key not available.");
        }
        if (msg.content === void 0) {
          var ciph;
          switch (msg.encryptedContent.algorithm) {
            case forge.pki.oids["aes128-CBC"]:
            case forge.pki.oids["aes192-CBC"]:
            case forge.pki.oids["aes256-CBC"]:
              ciph = forge.aes.createDecryptionCipher(msg.encryptedContent.key);
              break;
            case forge.pki.oids["desCBC"]:
            case forge.pki.oids["des-EDE3-CBC"]:
              ciph = forge.des.createDecryptionCipher(msg.encryptedContent.key);
              break;
            default:
              throw new Error("Unsupported symmetric cipher, OID " + msg.encryptedContent.algorithm);
          }
          ciph.start(msg.encryptedContent.parameter);
          ciph.update(msg.encryptedContent.content);
          if (!ciph.finish()) {
            throw new Error("Symmetric decryption failed.");
          }
          msg.content = ciph.output;
        }
      }
    }
  });

  // node_modules/node-forge/lib/ssh.js
  var require_ssh = __commonJS({
    "node_modules/node-forge/lib/ssh.js"(exports, module) {
      var forge = require_forge();
      require_aes2();
      require_hmac2();
      require_md52();
      require_sha12();
      require_util();
      var ssh = module.exports = forge.ssh = forge.ssh || {};
      ssh.privateKeyToPutty = function(privateKey, passphrase, comment) {
        comment = comment || "";
        passphrase = passphrase || "";
        var algorithm = "ssh-rsa";
        var encryptionAlgorithm = passphrase === "" ? "none" : "aes256-cbc";
        var ppk = "PuTTY-User-Key-File-2: " + algorithm + "\r\n";
        ppk += "Encryption: " + encryptionAlgorithm + "\r\n";
        ppk += "Comment: " + comment + "\r\n";
        var pubbuffer = forge.util.createBuffer();
        _addStringToBuffer(pubbuffer, algorithm);
        _addBigIntegerToBuffer(pubbuffer, privateKey.e);
        _addBigIntegerToBuffer(pubbuffer, privateKey.n);
        var pub = forge.util.encode64(pubbuffer.bytes(), 64);
        var length = Math.floor(pub.length / 66) + 1;
        ppk += "Public-Lines: " + length + "\r\n";
        ppk += pub;
        var privbuffer = forge.util.createBuffer();
        _addBigIntegerToBuffer(privbuffer, privateKey.d);
        _addBigIntegerToBuffer(privbuffer, privateKey.p);
        _addBigIntegerToBuffer(privbuffer, privateKey.q);
        _addBigIntegerToBuffer(privbuffer, privateKey.qInv);
        var priv;
        if (!passphrase) {
          priv = forge.util.encode64(privbuffer.bytes(), 64);
        } else {
          var encLen = privbuffer.length() + 16 - 1;
          encLen -= encLen % 16;
          var padding = _sha1(privbuffer.bytes());
          padding.truncate(padding.length() - encLen + privbuffer.length());
          privbuffer.putBuffer(padding);
          var aeskey = forge.util.createBuffer();
          aeskey.putBuffer(_sha1("\0\0\0\0", passphrase));
          aeskey.putBuffer(_sha1("\0\0\0", passphrase));
          var cipher = forge.aes.createEncryptionCipher(aeskey.truncate(8), "CBC");
          cipher.start(forge.util.createBuffer().fillWithByte(0, 16));
          cipher.update(privbuffer.copy());
          cipher.finish();
          var encrypted = cipher.output;
          encrypted.truncate(16);
          priv = forge.util.encode64(encrypted.bytes(), 64);
        }
        length = Math.floor(priv.length / 66) + 1;
        ppk += "\r\nPrivate-Lines: " + length + "\r\n";
        ppk += priv;
        var mackey = _sha1("putty-private-key-file-mac-key", passphrase);
        var macbuffer = forge.util.createBuffer();
        _addStringToBuffer(macbuffer, algorithm);
        _addStringToBuffer(macbuffer, encryptionAlgorithm);
        _addStringToBuffer(macbuffer, comment);
        macbuffer.putInt32(pubbuffer.length());
        macbuffer.putBuffer(pubbuffer);
        macbuffer.putInt32(privbuffer.length());
        macbuffer.putBuffer(privbuffer);
        var hmac = forge.hmac.create();
        hmac.start("sha1", mackey);
        hmac.update(macbuffer.bytes());
        ppk += "\r\nPrivate-MAC: " + hmac.digest().toHex() + "\r\n";
        return ppk;
      };
      ssh.publicKeyToOpenSSH = function(key, comment) {
        var type = "ssh-rsa";
        comment = comment || "";
        var buffer = forge.util.createBuffer();
        _addStringToBuffer(buffer, type);
        _addBigIntegerToBuffer(buffer, key.e);
        _addBigIntegerToBuffer(buffer, key.n);
        return type + " " + forge.util.encode64(buffer.bytes()) + " " + comment;
      };
      ssh.privateKeyToOpenSSH = function(privateKey, passphrase) {
        if (!passphrase) {
          return forge.pki.privateKeyToPem(privateKey);
        }
        return forge.pki.encryptRsaPrivateKey(
          privateKey,
          passphrase,
          { legacy: true, algorithm: "aes128" }
        );
      };
      ssh.getPublicKeyFingerprint = function(key, options) {
        options = options || {};
        var md = options.md || forge.md.md5.create();
        var type = "ssh-rsa";
        var buffer = forge.util.createBuffer();
        _addStringToBuffer(buffer, type);
        _addBigIntegerToBuffer(buffer, key.e);
        _addBigIntegerToBuffer(buffer, key.n);
        md.start();
        md.update(buffer.getBytes());
        var digest = md.digest();
        if (options.encoding === "hex") {
          var hex = digest.toHex();
          if (options.delimiter) {
            return hex.match(/.{2}/g).join(options.delimiter);
          }
          return hex;
        } else if (options.encoding === "binary") {
          return digest.getBytes();
        } else if (options.encoding) {
          throw new Error('Unknown encoding "' + options.encoding + '".');
        }
        return digest;
      };
      function _addBigIntegerToBuffer(buffer, val) {
        var hexVal = val.toString(16);
        if (hexVal[0] >= "8") {
          hexVal = "00" + hexVal;
        }
        var bytes = forge.util.hexToBytes(hexVal);
        buffer.putInt32(bytes.length);
        buffer.putBytes(bytes);
      }
      function _addStringToBuffer(buffer, val) {
        buffer.putInt32(val.length);
        buffer.putString(val);
      }
      function _sha1() {
        var sha = forge.md.sha1.create();
        var num = arguments.length;
        for (var i = 0; i < num; ++i) {
          sha.update(arguments[i]);
        }
        return sha.digest();
      }
    }
  });

  // node_modules/node-forge/lib/index.js
  var require_lib = __commonJS({
    "node_modules/node-forge/lib/index.js"(exports, module) {
      module.exports = require_forge();
      require_aes2();
      require_aesCipherSuites();
      require_asn12();
      require_cipher();
      require_des();
      require_ed25519();
      require_hmac2();
      require_kem();
      require_log();
      require_md_all();
      require_mgf1();
      require_pbkdf22();
      require_pem();
      require_pkcs1();
      require_pkcs12();
      require_pkcs7();
      require_pki();
      require_prime();
      require_prng();
      require_pss();
      require_random();
      require_rc2();
      require_ssh();
      require_tls();
      require_util();
    }
  });

  // crypto_engine.js
  var require_crypto_engine = __commonJS({
    "crypto_engine.js"(exports, module) {
      var CryptoJS = require_crypto_js();
      var sm = require_src();
      var forge = require_lib();
      function parseEncoding(data, encoding) {
        switch (encoding) {
          case "base64":
            return CryptoJS.enc.Base64.parse(data);
          case "hex":
            return CryptoJS.enc.Hex.parse(data);
          case "utf-8":
          default:
            return CryptoJS.enc.Utf8.parse(data);
        }
      }
      function formatOutput(wordArray, encoding) {
        switch (encoding) {
          case "base64":
            return CryptoJS.enc.Base64.stringify(wordArray);
          case "hex":
            return CryptoJS.enc.Hex.stringify(wordArray);
          case "utf-8":
          default:
            return CryptoJS.enc.Utf8.stringify(wordArray);
        }
      }
      function getCryptoJSMode(mode) {
        const modes = {
          "CBC": CryptoJS.mode.CBC,
          "ECB": CryptoJS.mode.ECB,
          "CFB": CryptoJS.mode.CFB,
          "OFB": CryptoJS.mode.OFB,
          "CTR": CryptoJS.mode.CTR
        };
        return modes[mode] || CryptoJS.mode.CBC;
      }
      function getCryptoJSPadding(padding) {
        const paddings = {
          "PKCS7": CryptoJS.pad.Pkcs7,
          "ZeroPadding": CryptoJS.pad.ZeroPadding,
          "NoPadding": CryptoJS.pad.NoPadding,
          "Iso10126": CryptoJS.pad.Iso10126,
          "Iso97971": CryptoJS.pad.Iso97971,
          "AnsiX923": CryptoJS.pad.AnsiX923
        };
        return paddings[padding] || CryptoJS.pad.Pkcs7;
      }
      function aes_encrypt(plaintext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var data = plaintext;
        var encrypted = CryptoJS.AES.encrypt(data, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        var outputEnc = params.output_encoding || "base64";
        if (outputEnc === "base64") return encrypted.toString();
        if (outputEnc === "hex") return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encrypted.toString();
      }
      function aes_decrypt(ciphertext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var outputEnc = params.output_encoding || "base64";
        var cipherParams;
        if (outputEnc === "hex") {
          cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
          });
        } else {
          cipherParams = ciphertext;
        }
        var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
      function des_encrypt(plaintext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var encrypted = CryptoJS.DES.encrypt(plaintext, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        var outputEnc = params.output_encoding || "base64";
        if (outputEnc === "hex") return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encrypted.toString();
      }
      function des_decrypt(ciphertext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var outputEnc = params.output_encoding || "base64";
        var cipherParams;
        if (outputEnc === "hex") {
          cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
          });
        } else {
          cipherParams = ciphertext;
        }
        var decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
      function triple_des_encrypt(plaintext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var encrypted = CryptoJS.TripleDES.encrypt(plaintext, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        var outputEnc = params.output_encoding || "base64";
        if (outputEnc === "hex") return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encrypted.toString();
      }
      function triple_des_decrypt(ciphertext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var iv = parseEncoding(params.iv || "", params.key_encoding || "utf-8");
        var outputEnc = params.output_encoding || "base64";
        var cipherParams;
        if (outputEnc === "hex") {
          cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
          });
        } else {
          cipherParams = ciphertext;
        }
        var decrypted = CryptoJS.TripleDES.decrypt(cipherParams, key, {
          iv,
          mode: getCryptoJSMode(params.mode || "CBC"),
          padding: getCryptoJSPadding(params.padding || "PKCS7")
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
      function rc4_encrypt(plaintext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var encrypted = CryptoJS.RC4.encrypt(plaintext, key);
        var outputEnc = params.output_encoding || "base64";
        if (outputEnc === "hex") return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        return encrypted.toString();
      }
      function rc4_decrypt(ciphertext, params) {
        var key = parseEncoding(params.key, params.key_encoding || "utf-8");
        var outputEnc = params.output_encoding || "base64";
        var cipherParams;
        if (outputEnc === "hex") {
          cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
          });
        } else {
          cipherParams = ciphertext;
        }
        var decrypted = CryptoJS.RC4.decrypt(cipherParams, key);
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
      function rsa_encrypt(plaintext, params) {
        var outputEnc = params.output_encoding || "base64";
        var padding = params.padding || "OAEP";
        var encryptWith = params.encrypt_with || "public";
        var key;
        if (encryptWith === "public") {
          key = forge.pki.publicKeyFromPem(params.public_key);
        } else {
          key = forge.pki.privateKeyFromPem(params.private_key);
        }
        var encrypted;
        if (encryptWith === "public") {
          if (padding === "OAEP") {
            encrypted = key.encrypt(plaintext, "RSA-OAEP");
          } else {
            encrypted = key.encrypt(plaintext, "RSAES-PKCS1-V1_5");
          }
        } else {
          encrypted = forge.pki.rsa.encrypt(
            forge.util.createBuffer(plaintext, "utf8").getBytes(),
            key,
            1
          );
        }
        if (outputEnc === "hex") return forge.util.bytesToHex(encrypted);
        return forge.util.encode64(encrypted);
      }
      function rsa_decrypt(ciphertext, params) {
        var outputEnc = params.output_encoding || "base64";
        var padding = params.padding || "OAEP";
        var data;
        if (outputEnc === "hex") {
          data = forge.util.hexToBytes(ciphertext);
        } else {
          data = forge.util.decode64(ciphertext);
        }
        var key = forge.pki.privateKeyFromPem(params.private_key);
        var decrypted;
        if (padding === "OAEP") {
          decrypted = key.decrypt(data, "RSA-OAEP");
        } else {
          decrypted = key.decrypt(data, "RSAES-PKCS1-V1_5");
        }
        return decrypted;
      }
      function rsa_generate_keypair(params) {
        var bits = parseInt(params.bits) || 2048;
        var keypair = forge.pki.rsa.generateKeyPair({ bits });
        return JSON.stringify({
          public_key: forge.pki.publicKeyToPem(keypair.publicKey),
          private_key: forge.pki.privateKeyToPem(keypair.privateKey)
        });
      }
      function sm2_encrypt(plaintext, params) {
        var publicKey = params.public_key;
        var cipherMode = parseInt(params.cipher_mode) || 1;
        var encrypted = sm.sm2.doEncrypt(plaintext, publicKey, cipherMode);
        return encrypted;
      }
      function sm2_decrypt(ciphertext, params) {
        var privateKey = params.private_key;
        var cipherMode = parseInt(params.cipher_mode) || 1;
        var decrypted = sm.sm2.doDecrypt(ciphertext, privateKey, cipherMode);
        return decrypted;
      }
      function sm2_sign(data, params) {
        var privateKey = params.private_key;
        var signature = sm.sm2.doSignature(data, privateKey);
        return signature;
      }
      function sm2_verify(data, params) {
        var publicKey = params.public_key;
        var signature = params.signature;
        var result = sm.sm2.doVerifySignature(data, signature, publicKey);
        return result.toString();
      }
      function sm2_generate_keypair() {
        var keypair = sm.sm2.generateKeyPairHex();
        return JSON.stringify({
          public_key: keypair.publicKey,
          private_key: keypair.privateKey
        });
      }
      function sm3_hash(data, params) {
        var result = sm.sm3(data);
        return result;
      }
      function sm4_encrypt(plaintext, params) {
        var key = params.key;
        var mode = params.mode || "ecb";
        var iv = params.iv || "";
        var outputEnc = params.output_encoding || "hex";
        var result;
        if (mode === "cbc") {
          result = sm.sm4.encrypt(plaintext, key, { mode: "cbc", iv, output: "array" });
        } else {
          result = sm.sm4.encrypt(plaintext, key, { output: "array" });
        }
        var hex = Array.from(result).map(function(b) {
          return ("0" + b.toString(16)).slice(-2);
        }).join("");
        if (outputEnc === "base64") {
          return Buffer.from(hex, "hex").toString("base64");
        }
        return hex;
      }
      function sm4_decrypt(ciphertext, params) {
        var key = params.key;
        var mode = params.mode || "ecb";
        var iv = params.iv || "";
        var outputEnc = params.output_encoding || "hex";
        var data;
        if (outputEnc === "base64") {
          data = Buffer.from(ciphertext, "base64").toString("hex");
        } else {
          data = ciphertext;
        }
        var bytes = [];
        for (var i = 0; i < data.length; i += 2) {
          bytes.push(parseInt(data.substr(i, 2), 16));
        }
        var result;
        if (mode === "cbc") {
          result = sm.sm4.decrypt(bytes, key, { mode: "cbc", iv, output: "utf8" });
        } else {
          result = sm.sm4.decrypt(bytes, key, { output: "utf8" });
        }
        return result;
      }
      function hash_digest(data, params) {
        var algorithm = params.hash_algorithm || "md5";
        var outputEnc = params.output_encoding || "hex";
        var result;
        switch (algorithm.toLowerCase()) {
          case "md5":
            result = CryptoJS.MD5(data);
            break;
          case "sha1":
            result = CryptoJS.SHA1(data);
            break;
          case "sha256":
            result = CryptoJS.SHA256(data);
            break;
          case "sha512":
            result = CryptoJS.SHA512(data);
            break;
          case "sha224":
            result = CryptoJS.SHA224(data);
            break;
          case "sha384":
            result = CryptoJS.SHA384(data);
            break;
          case "sha3":
            result = CryptoJS.SHA3(data);
            break;
          case "ripemd160":
            result = CryptoJS.RIPEMD160(data);
            break;
          default:
            result = CryptoJS.MD5(data);
        }
        return formatOutput(result, outputEnc);
      }
      function hmac_digest(data, params) {
        var key = params.key || "";
        var algorithm = params.hash_algorithm || "sha256";
        var outputEnc = params.output_encoding || "hex";
        var result;
        switch (algorithm.toLowerCase()) {
          case "md5":
            result = CryptoJS.HmacMD5(data, key);
            break;
          case "sha1":
            result = CryptoJS.HmacSHA1(data, key);
            break;
          case "sha256":
            result = CryptoJS.HmacSHA256(data, key);
            break;
          case "sha512":
            result = CryptoJS.HmacSHA512(data, key);
            break;
          case "sha224":
            result = CryptoJS.HmacSHA224(data, key);
            break;
          case "sha384":
            result = CryptoJS.HmacSHA384(data, key);
            break;
          default:
            result = CryptoJS.HmacSHA256(data, key);
        }
        return formatOutput(result, outputEnc);
      }
      function base64_encode(data) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
      }
      function base64_decode(data) {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data));
      }
      function dispatch(action, algorithm, data, paramsJson) {
        var params = JSON.parse(paramsJson);
        var algo = algorithm.toLowerCase();
        if (action === "encrypt") {
          switch (algo) {
            case "aes":
              return aes_encrypt(data, params);
            case "des":
              return des_encrypt(data, params);
            case "3des":
              return triple_des_encrypt(data, params);
            case "rc4":
              return rc4_encrypt(data, params);
            case "rsa":
              return rsa_encrypt(data, params);
            case "sm2":
              return sm2_encrypt(data, params);
            case "sm4":
              return sm4_encrypt(data, params);
            case "base64":
              return base64_encode(data);
            case "hash":
              return hash_digest(data, params);
            case "hmac":
              return hmac_digest(data, params);
            case "sm3":
              return sm3_hash(data, params);
            default:
              throw new Error("\u4E0D\u652F\u6301\u7684\u7B97\u6CD5: " + algorithm);
          }
        } else if (action === "decrypt") {
          switch (algo) {
            case "aes":
              return aes_decrypt(data, params);
            case "des":
              return des_decrypt(data, params);
            case "3des":
              return triple_des_decrypt(data, params);
            case "rc4":
              return rc4_decrypt(data, params);
            case "rsa":
              return rsa_decrypt(data, params);
            case "sm2":
              return sm2_decrypt(data, params);
            case "sm4":
              return sm4_decrypt(data, params);
            case "base64":
              return base64_decode(data);
            case "hash":
              return hash_digest(data, params);
            case "hmac":
              return hmac_digest(data, params);
            case "sm3":
              return sm3_hash(data, params);
            default:
              throw new Error("\u4E0D\u652F\u6301\u7684\u7B97\u6CD5: " + algorithm);
          }
        } else if (action === "sign") {
          if (algo === "sm2") return sm2_sign(data, params);
          throw new Error("\u7B7E\u540D\u4EC5\u652F\u6301 SM2");
        } else if (action === "verify") {
          if (algo === "sm2") return sm2_verify(data, params);
          throw new Error("\u9A8C\u7B7E\u4EC5\u652F\u6301 SM2");
        } else if (action === "generate_keypair") {
          if (algo === "rsa") return rsa_generate_keypair(params);
          if (algo === "sm2") return sm2_generate_keypair();
          throw new Error("\u5BC6\u94A5\u751F\u6210\u4EC5\u652F\u6301 RSA/SM2");
        }
        throw new Error("\u4E0D\u652F\u6301\u7684\u64CD\u4F5C: " + action);
      }
      module.exports = { dispatch };
    }
  });
  return require_crypto_engine();
})();
/*! Bundled license information:

crypto-js/ripemd160.js:
  (** @preserve
  	(c) 2012 by Cédric Mesnil. All rights reserved.
  
  	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
  
  	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  
  	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  	*)

crypto-js/mode-ctr-gladman.js:
  (** @preserve
   * Counter block mode compatible with  Dr Brian Gladman fileenc.c
   * derived from CryptoJS.mode.CTR
   * Jan Hruby jhruby.web@gmail.com
   *)
*/

var dispatch = __engine.dispatch;
