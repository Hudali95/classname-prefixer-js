'use strict';

const fs = require('fs'); // Import fs module for file operations
const path = require('path'); // Import path module for handling file paths
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default; // To generate the modified source
const types = require('@babel/types'); // For AST manipulations

const outputPath1 = path.resolve(__dirname, '..', 'output1.txt'); // Adjusted path to point to the root folder

// Helper function to prefix class names
function prefixClassName(value, prefix) {
    return value
        .split(' ')
        .map(className => className.trim() ? `${prefix}-${className.trim()}` : '')
        .join(' ');
}

function loader(source, inputSourceMap) {
    // Get the options passed from Webpack config
    const options = this.getOptions();
    const prefix = options.prefix || 'app'; // Default to 'app' if no prefix is provided

    // Parse the source code into an AST
    const ast = parser.parse(source, {
        sourceType: 'module',
        plugins: [
            'jsx', 'typescript', // For JSX and TypeScript support
            'classProperties', // For class fields in your code
            'dynamicImport', // For dynamic import() syntax
            'optionalChaining', // Optional chaining support
            'nullishCoalescingOperator' // Nullish coalescing (??)
        ],
    });

    // Traverse the AST and modify className attributes
    traverse(ast, {
        JSXAttribute(path) {
            if (path.node.name.name === 'className') {
                const value = path.node.value;

                // Handle string literals
                if (types.isStringLiteral(value)) {
                    const originalValue = value.value; // Capture the original className
                    const prefixedValue = prefixClassName(originalValue, prefix);
                    path.node.value = types.stringLiteral(prefixedValue);

                    // Log the original and updated classNames to the output file
                    fs.appendFileSync(outputPath1, `Original className="${originalValue}" => Updated className="${prefixedValue}"\n\n`);
                }
                // Handle JSX expressions (ternary, template literals, etc.)
                else if (types.isJSXExpressionContainer(value)) {
                    let expression = path.get('value.expression');

                    if (types.isStringLiteral(expression.node)) {
                        const originalValue = expression.node.value; // Capture the original className
                        const prefixedValue = prefixClassName(originalValue, prefix);
                        expression.replaceWith(types.stringLiteral(prefixedValue));

                        // Log the original and updated classNames to the output file
                        fs.appendFileSync(outputPath1, `Original className={${originalValue}} => Updated className={${prefixedValue}}\n\n`);
                    }
                    // Handle ternary expressions (e.g., {condition ? 'class1' : 'class2'})
                    else if (types.isConditionalExpression(expression.node)) {
                        const consequent = expression.get('consequent');
                        const alternate = expression.get('alternate');

                        if (types.isStringLiteral(consequent.node)) {
                            const originalConsequent = consequent.node.value; // Capture the original className
                            const prefixedConsequent = prefixClassName(originalConsequent, prefix);
                            consequent.replaceWith(types.stringLiteral(prefixedConsequent));

                            // Log the original and updated classNames
                            fs.appendFileSync(outputPath1, `Original className={${originalConsequent}} => Updated className={${prefixedConsequent}}\n\n`);
                        }

                        if (types.isStringLiteral(alternate.node)) {
                            const originalAlternate = alternate.node.value; // Capture the original className
                            const prefixedAlternate = prefixClassName(originalAlternate, prefix);
                            alternate.replaceWith(types.stringLiteral(prefixedAlternate));

                            // Log the original and updated classNames
                            fs.appendFileSync(outputPath1, `Original className={${originalAlternate}} => Updated className={${prefixedAlternate}}\n\n`);
                        }
                    }
                    // Handle template literals (e.g., `some-${variable}-class`)
                    else if (types.isTemplateLiteral(expression.node)) {
                        const quasis = expression.get('quasis');
                        const expressions = expression.get('expressions');

                        // Handle each quasis part (static strings inside template literal)
                        quasis.forEach((element) => {
                            const originalValue = element.node.value.raw; // Capture the original quasis
                            const prefixedValue = prefixClassName(originalValue, prefix);
                            element.node.value.raw = prefixedValue;
                            element.node.value.cooked = prefixedValue;

                            // Log the original and updated classNames
                            fs.appendFileSync(outputPath1, `Original template literal part="${originalValue}" => Updated part="${prefixedValue}"\n\n`);
                        });

                        // Handle expressions (like ternary operators inside template literal)
                        expressions.forEach((exp) => {
                            if (types.isConditionalExpression(exp.node)) {
                                const consequent = exp.get('consequent');
                                const alternate = exp.get('alternate');

                                if (types.isStringLiteral(consequent.node)) {
                                    const originalConsequent = consequent.node.value; // Capture the original className
                                    const prefixedConsequent = prefixClassName(originalConsequent, prefix);
                                    consequent.replaceWith(types.stringLiteral(prefixedConsequent));

                                    // Log the original and updated classNames
                                    fs.appendFileSync(outputPath1, `Original template literal expression part={${originalConsequent}} => Updated part={${prefixedConsequent}}\n\n`);
                                }

                                if (types.isStringLiteral(alternate.node)) {
                                    const originalAlternate = alternate.node.value; // Capture the original className
                                    const prefixedAlternate = prefixClassName(originalAlternate, prefix);
                                    alternate.replaceWith(types.stringLiteral(prefixedAlternate));

                                    // Log the original and updated classNames
                                    fs.appendFileSync(outputPath1, `Original template literal expression part={${originalAlternate}} => Updated part={${prefixedAlternate}}\n\n`);
                                }
                            }
                        });

                        fs.appendFileSync(outputPath1, `Updated template literal className={${expression.toString()}}\n\n`);
                    }
                    // Handle classnames function calls (e.g., classnames('class1', {'class2': condition}))
                    else if (types.isCallExpression(expression.node) && expression.node.callee.name === 'classnames') {
                        expression.get('arguments').forEach(arg => {
                            if (types.isStringLiteral(arg.node)) {
                                const originalValue = arg.node.value; // Capture the original className
                                const prefixedValue = prefixClassName(originalValue, prefix);
                                arg.replaceWith(types.stringLiteral(prefixedValue));

                                // Log the original and updated classNames
                                fs.appendFileSync(outputPath1, `Original classnames argument={${originalValue}} => Updated argument={${prefixedValue}}\n\n`);
                            }
                        });

                        fs.appendFileSync(outputPath1, `Updated classnames function call className={${expression.toString()}}\n\n`);
                    }
                }
            }
        }
    });

    // Generate the modified source code back from the AST
    const output = generate(ast, {}, source);

    // Return the modified source code so Webpack can continue processing
    return output.code;
}

exports.default = loader;
module.exports = exports['default'];
