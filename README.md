# cycle-logger
Provides logging capabilities to cycle.js applications.

## Installation
`npm i cycle-logger --save`

## Scripts
NOTE: Make sure you've installed all dependencies using `npm install` first.

To generate documentation: `npm run doc`. This will create documentation in the
`build/docs` folder.

To run unit tests: `npm test`

## API
### Broker
**Kind**: global class  
**Inherits**: Broker  

* [Logger](#Logger)
    * [new Logger()](#new_Logger_new)
    * _instance_
        * [.from(level)](#Logger+from)
        * [.filter(levels)](#Logger+filter)
        * [.trace(msg, args)](#Logger+trace)
        * [.debug(msg, args)](#Logger+debug)
        * [.info(msg, args)](#Logger+info)
        * [.warn(msg, args)](#Logger+warn)
        * [.error(msg, args)](#Logger+error)
    * _static_
        * [.Levels](#Logger.Levels) : <code>[Levels](#Logger..Levels)</code>
    * _inner_
        * [~Levels](#Logger..Levels) : <code>Object</code>

<a name="new_Logger_new"></a>
### new Logger()
Provides logging functionality to Cycle.js applications.

**Example**  
```js
var Logger = require('Logger');var logger = new Logger();// Loggers inherit from cycle-events.Broker// you can listen for specific logging levels:logger.on(Logger.Levels.WARN, function(msg) {  logFile.writeLine('warning: %s', msg);});
```
**Example**  
```js
// you can also view all messages at or above// a specific logging level:logger.from(Logger.Levels.INFO).subscribe(function onNext(data) {  logFile.writeLine(data.level, data.msg);});logger.error('this will be written to the file');logger.info('this will also be written to the file');logger.debug('this will not be written to the file');
```
**Example**  
```js
logger.filter('WARN', 'INFO').subscribe(function onNext(data) {  logFile.writeLine(data.level, data.msg);});logger.warn('this will be written to the file');logger.info('this will also be written to the file');logger.error('this will not be written to the file');
```
<a name="Logger+from"></a>
### logger.from(level)
Creates an Observable populated with future logging events at orabove the specified logging level.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>String</code> | One of the [built-in logging levels](#Logger..Levels). |

**Example**  
```js
logger.from(Logger.Levels.WARN)  .subscribe(function log(data) {    logFile.writeLine(data.level, data.msg);  });logger.warn('this will be logged');logger.error('this will also be logged');logger.debug('this will NOT be logged');
```
<a name="Logger+filter"></a>
### logger.filter(levels)
Creates an Observable populated with future logging eventsmatching the specified logging levels.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| levels | <code>String</code> | One or more of the [built-in logging levels](#Logger..Levels). |

**Example**  
```js
logger.filter(Logger.Levels.INFO, Logger.Levels.ERROR)  .subscribe(function log(data) {    logFile.writeLine(data.level, data.msg);  });logger.error('this will be logged');logger.warn('this will NOT be logged');logger.debug('this also will NOT be logged');logger.info('this will be logged, too');
```
<a name="Logger+trace"></a>
### logger.trace(msg, args)
Outputs trace information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+debug"></a>
### logger.debug(msg, args)
Outputs debug information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+info"></a>
### logger.info(msg, args)
Outputs non-error information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+warn"></a>
### logger.warn(msg, args)
Outputs warnings to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+error"></a>
### logger.error(msg, args)
Outputs error information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger.Levels"></a>
### Logger.Levels : <code>[Levels](#Logger..Levels)</code>
An enumeration of logging levels that users can subscribe to. In order: ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE

**Kind**: static property of <code>[Logger](#Logger)</code>  
**Example**  
```js
logger.on(Logger.Levels.WARN, function warningOccurred(msg) { ... });logger.on(Logger.Levels.ERROR, function errorOccurred(msg) { ... });
```
<a name="Logger..Levels"></a>
### Logger~Levels : <code>Object</code>
The available logging levels. In order: ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE

**Kind**: inner typedef of <code>[Logger](#Logger)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ALL | <code>String</code> |  |
| TRACE | <code>String</code> | Extremely detailed information, like object dumps. |
| DEBUG | <code>String</code> | Detailed information on your program's execution flow. |
| INFO | <code>String</code> | Interesting lifecycle events. |
| WARN | <code>String</code> | Use of deprecated APIs, 'almost' errors, and other undesirable or unexpected events. |
| ERROR | <code>String</code> | Runtime errors and unexpected conditions. |
| NONE | <code>String</code> |  |

