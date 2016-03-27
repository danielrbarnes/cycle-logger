# cycle-logger
Provides logging capabilities to cycle.js applications.

## Installation
`npm i cycle-logger2 --save`

## Scripts
NOTE: Make sure you've installed all dependencies using `npm install` first.

To generate documentation: `npm run doc`. This will create documentation in the
`build/docs` folder.

To run unit tests: `npm test`

## API
### Loggers
Create new [Logger](#Logger) instances or filter logging events by Logger name or logging level.

**Kind**: global class  

* [Loggers](#Loggers)
    * _static_
        * [.Levels](#Loggers.Levels) : <code>enum</code>
        * [.get(name)](#Loggers.get) ⇒ <code>[Logger](#Logger)</code>
        * [.asObservable()](#Loggers.asObservable) ⇒ <code>[LoggerObservable](#LoggerObservable)</code>
    * _inner_
        * [~Levels](#Loggers..Levels) : <code>Object</code>

<a name="Loggers.Levels"></a>
### Loggers.Levels : <code>enum</code>
An enumeration of logging levels that users can subscribe to. In order: ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE

**Kind**: static enum property of <code>[Loggers](#Loggers)</code>  
**Example**  
```js
logger.on(Logger.Levels.WARN, function warningOccurred(msg) { ... });logger.on(Logger.Levels.ERROR, function errorOccurred(msg) { ... });
```
<a name="Loggers.get"></a>
### Loggers.get(name) ⇒ <code>[Logger](#Logger)</code>
Retrieves the specified [Logger](#Logger) instance, creating one if necessary.

**Kind**: static method of <code>[Loggers](#Loggers)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance with the specified name.  
**Throws**:

- <code>Error</code> A name must be specified.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the [Logger](#Logger) instance to create/retrieve. |

**Example**  
```js
Loggers.get('my.logger').warn('some warning message');
```
<a name="Loggers.asObservable"></a>
### Loggers.asObservable() ⇒ <code>[LoggerObservable](#LoggerObservable)</code>
Returns a [LoggerObservable](#LoggerObservable) instance that can be filtered by Logger nameor [built-in log level](#Loggers..Levels).

**Kind**: static method of <code>[Loggers](#Loggers)</code>  
**Example**  
```js
Loggers.asObservable()  .byMinLevel(Loggers.Levels.WARN)  .byName('my.logger')  .subscribe(...);
```
<a name="Loggers..Levels"></a>
### Loggers~Levels : <code>Object</code>
The available logging levels. In order: ALL &lt; TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; NONE

**Kind**: inner typedef of <code>[Loggers](#Loggers)</code>  
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


### Logger
Provides methods to log information at various [levels](#Loggers..Levels).

**Kind**: global class  

* [Logger](#Logger)
    * [.name](#Logger+name) : <code>String</code>
    * [.trace(msg, args)](#Logger+trace) ⇒ <code>[Logger](#Logger)</code>
    * [.debug(msg, args)](#Logger+debug) ⇒ <code>[Logger](#Logger)</code>
    * [.info(msg, args)](#Logger+info) ⇒ <code>[Logger](#Logger)</code>
    * [.warn(msg, args)](#Logger+warn) ⇒ <code>[Logger](#Logger)</code>
    * [.error(msg, args)](#Logger+error) ⇒ <code>[Logger](#Logger)</code>

<a name="Logger+name"></a>
### logger.name : <code>String</code>
The unique name of the Logger instance.

**Kind**: instance property of <code>[Logger](#Logger)</code>  
**Read only**: true  
<a name="Logger+trace"></a>
### logger.trace(msg, args) ⇒ <code>[Logger](#Logger)</code>
Outputs trace information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance, for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+debug"></a>
### logger.debug(msg, args) ⇒ <code>[Logger](#Logger)</code>
Outputs debug information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance, for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+info"></a>
### logger.info(msg, args) ⇒ <code>[Logger](#Logger)</code>
Outputs non-error information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance, for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+warn"></a>
### logger.warn(msg, args) ⇒ <code>[Logger](#Logger)</code>
Outputs warnings to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance, for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |

<a name="Logger+error"></a>
### logger.error(msg, args) ⇒ <code>[Logger](#Logger)</code>
Outputs error information to any registered listeners.

**Kind**: instance method of <code>[Logger](#Logger)</code>  
**Returns**: <code>[Logger](#Logger)</code> - The Logger instance, for chaining.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | The message string or object to log. |
| args | <code>\*</code> | The arguments to substitute into the message string.  See node's `util.format` method for more information on formatting. |


### LoggerObservable
**Kind**: global class  
**Inherits**: Observable  

* [LoggerObservable](#LoggerObservable)
    * [new LoggerObservable()](#new_LoggerObservable_new)
    * [.byName(name)](#LoggerObservable.byName) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>
    * [.byMinLevel(level)](#LoggerObservable.byMinLevel) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>
    * [.byLevels(levels)](#LoggerObservable.byLevels) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>

<a name="new_LoggerObservable_new"></a>
### new LoggerObservable()
Provides operators for filtering [logging events](#LoggingEvent).

**Example**  
```js
Loggers.asObservable()  .byName('log name')  .map(event => event.message)  .subscribe(msg => file.writeln(msg));
```
<a name="LoggerObservable.byName"></a>
### LoggerObservable.byName(name) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>
**Kind**: static method of <code>[LoggerObservable](#LoggerObservable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>RegExp</code> | The string or regular expression to use to match  against [Logger](#Logger) names in [LoggingEvent](#LoggingEvent)s. |

**Example**  
```js
Loggers.asObservable()  .byName('log name')  .map(event => event.message)  .subscribe(msg => file.writeln(msg));
```
<a name="LoggerObservable.byMinLevel"></a>
### LoggerObservable.byMinLevel(level) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>
**Kind**: static method of <code>[LoggerObservable](#LoggerObservable)</code>  
**Throws**:

- The specified level is invalid.


| Param | Type | Description |
| --- | --- | --- |
| level | <code>[Levels](#Loggers..Levels)</code> | The minimum level to filter [LoggingEvent](#LoggingEvent)s.  Any events at or above this level will be included in the resulting observable. |

**Example**  
```js
Loggers.asObservable()  .byMinLevel(Loggers.Levels.WARN)  .subscribe(event => file.writeln(`${event.logger}: ${event.message}`));
```
<a name="LoggerObservable.byLevels"></a>
### LoggerObservable.byLevels(levels) ⇒ <code>[Observable.&lt;LoggingEvent&gt;](#LoggingEvent)</code>
**Kind**: static method of <code>[LoggerObservable](#LoggerObservable)</code>  
**Throws**:

- The specified level is invalid.


| Param | Type | Description |
| --- | --- | --- |
| levels | <code>[Array.&lt;Levels&gt;](#Loggers..Levels)</code> | One or more levels to filter [LoggingEvent](#LoggingEvent)s by. |

**Example**  
```js
Loggers.asObservable()  .byLevels(Loggers.Levels.INFO, Loggers.Levels.ERROR)  .map(event => event.message)  .subscribe(msg => file.writeln(msg));
```

### LoggingEvent
Represents a single logged entry.

**Kind**: global class  

* [LoggingEvent](#LoggingEvent)
    * [.level](#LoggingEvent+level) : <code>[Levels](#Loggers..Levels)</code>
    * [.logger](#LoggingEvent+logger) : <code>String</code>
    * [.message](#LoggingEvent+message) : <code>String</code>
    * [.datetime](#LoggingEvent+datetime) : <code>Number</code>
    * [.toString([fmt])](#LoggingEvent+toString) ⇒ <code>String</code>

<a name="LoggingEvent+level"></a>
### loggingEvent.level : <code>[Levels](#Loggers..Levels)</code>
The level the event was logged at.

**Kind**: instance property of <code>[LoggingEvent](#LoggingEvent)</code>  
<a name="LoggingEvent+logger"></a>
### loggingEvent.logger : <code>String</code>
The name of the [Logger](#Logger) instance that recorded this event.

**Kind**: instance property of <code>[LoggingEvent](#LoggingEvent)</code>  
<a name="LoggingEvent+message"></a>
### loggingEvent.message : <code>String</code>
The message logged.

**Kind**: instance property of <code>[LoggingEvent](#LoggingEvent)</code>  
<a name="LoggingEvent+datetime"></a>
### loggingEvent.datetime : <code>Number</code>
The epoch time (number of milliseconds since 1/1/1970 UTC).

**Kind**: instance property of <code>[LoggingEvent](#LoggingEvent)</code>  
<a name="LoggingEvent+toString"></a>
### loggingEvent.toString([fmt]) ⇒ <code>String</code>
Converts the LoggingEvent instance to a formatted string. You can provide

**Kind**: instance method of <code>[LoggingEvent](#LoggingEvent)</code>  
**Returns**: <code>String</code> - A formatted string.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [fmt] | <code>String</code> | <code>&#x27;%datetime% %level [%logger%]: %message%&#x27;</code> | The string containing  the tokens you wish to replace with the instance values. |

**Example**  
```js
// using built-in formatting:Loggers.asObservable()  .subscribe(event => file.writeln(event.toString()));
```
**Example**  
```js
// using custom formatting:let format = '[%datetime] %level%: %message%';Loggers.asObservable()  .byName('my.logger')  .subscribe(event => file.writeln(event.toString(format)));
```
