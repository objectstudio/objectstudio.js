/**
 * A console log implementation for the logging service.
 */
var ConsoleLogProvider = /** @class */ (function () {
    function ConsoleLogProvider() {
    }
    ConsoleLogProvider.prototype.write = function (level, args) {
        if (console && console[level]) {
            console[level].apply(console, args);
        }
    };
    return ConsoleLogProvider;
}());
export { ConsoleLogProvider };
//# sourceMappingURL=console-log.provider.js.map