'use strict';

const classNameRegex = /className\s*[:=]\s*["']([^"']*)["']/g;
const classNamesRegex = /classnames\(([^)]+)\)/g; // Regex to match classnames function calls
const stringBetweenQuotesRegex = /(["'])(\\?.)*?\1/g; // Regex to match strings within quotes
let ignore = [];


function loader(source, inputSourceMap) {
    // Get the options passed from Webpack config
    const options = this.getOptions();
    const prefix = options.prefix || 'app'; // Default to 'app' if no prefix is provided

    if (prefix) {
        // Process classes with classnames module
        const classNamesMatches = source.match(classNamesRegex);

        if (classNamesMatches) {
            classNamesMatches.forEach(item => {
                const cleanedItem = item.replace(/\s+/g, ''); // Remove whitespace
                const classNamesMatchesStrings = cleanedItem.match(stringBetweenQuotesRegex);

                if (classNamesMatchesStrings) {
                    classNamesMatchesStrings.forEach(classString => {
                        source = source.replace(new RegExp(classString, 'g'), (text) => {
                            const replaceResult = `"${prefix}-${text.replace(/['"]/g, '').trim()}"`; // Trim spaces
                            ignore.push(replaceResult);
                            return replaceResult;
                        });
                    });
                }
            });
        }

        // Replace className attributes
        source = source.replace(classNameRegex, (text, classNames) => {
            const attr = text.match(/className/i) ? 'className' : 'className';
            // Split classNames by whitespace and trim each one
            const prefixedClassNames = classNames.split(/\s+/).map(className => {
                return className.trim() ? `${prefix}-${className.trim()}` : ''; // Trim spaces before prefixing and ensure not to add empty strings
            }).filter(Boolean).join(' '); // Filter out empty strings

            return `${attr}:"${prefixedClassNames}"`; // Return the modified className
        });
    }

    return source;
}

function ignoreClassName(className) {
    return classMatchesTest(className, ignore) || className.trim().length === 0 || /^[A-Z-]/.test(className) || ignore.includes(className);
}

function classMatchesTest(className, ignore) {
    if (!ignore) return false;

    className = className.trim();

    if (ignore instanceof RegExp) return ignore.exec(className);

    if (Array.isArray(ignore)) {
        return ignore.some(test => {
            if (test instanceof RegExp) return test.exec(className);
            return className === test;
        });
    }

    return className === ignore;
}

function getQueryParameterByName(name, query) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(query);
    if (!results) return null;
    if (!results[2]) return '';
    return results[2].replace(/\+/g, " ");
}

exports.default = loader;
module.exports = exports['default'];
