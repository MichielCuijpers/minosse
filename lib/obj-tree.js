function set(root, path, value) {
    path = path.split('.');
    //Walk up the chain of properties, creating new objects / arrays as you go.
    var context = root;
    var lastProperty = parsePropertyName(path.shift());
    var isPropertyArray = null;
    var newContext = null;
    var nextProperty = null;
    while(path.length) {
        newContext = context[lastProperty];
        if (!newContext) {
            //Check if the next property has the [5] format, in which case
            //this property needs to become an array.
            nextProperty = parsePropertyName(path[0]);
            isPropertyArray = (typeof nextProperty === 'number');
            context[lastProperty] = newContext = isPropertyArray ? [] : {};
        }
        context = newContext;
        lastProperty = parsePropertyName(path.shift());
    }
    context[lastProperty] = value;
}

function get(root, path) {
    path = path.split('.');
    var item = root;
    var lastProperty = null;
    while (path.length) {
        lastProperty = path.shift();
        //Check if this property has the [5] format, in which case we need
        //set lastProperty to 5 (the number) instead of the string '5'.
        lastProperty = parsePropertyName(lastProperty);
        item = item[lastProperty];
    }
    return item;
}

function parsePropertyName(propertyName) {
    var regexResult = /[(\d+)]/.exec(propertyName);
    if (regexResult) {
        return parseInt(regexResult[0], 10);
    }
    return propertyName;
}

exports.get = get;
exports.set = set;