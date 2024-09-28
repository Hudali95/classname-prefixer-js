
# classname-prefixer-js

A Webpack loader to automatically prefix CSS class names in JavaScript or TypeScript files with a custom string.

## Installation

Install the package using npm:

```
npm install classname-prefixer-js --save-dev
```

Usage
Add the loader to your Webpack configuration under the module.rules section for .js/.ts files.

Webpack Configuration Example:

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,             // Target JS/TS files
        exclude: /node_modules/,        // Exclude dependencies
        use: [
          {
            loader: 'classname-prefixer-js',
            options: {
              prefix: 'your-prefix',    // Replace 'your-prefix' with your desired class name prefix
            },
          },
        ],
      },
    ],
  },
};
```
Example:
Before applying the loader:

```
<div className="container header"></div>
```
After applying the loader with prefix: 'my-app':
```
<div className="my-app-container my-app-header"></div>
```
Options
prefix (required): A string that will be prefixed to all CSS class names found in the JavaScript/TypeScript files.
Example:
If your prefix is set to 'mf-onboarding', and your original class names are:

```
<div className="container header"></div>
```
The output after using classname-prefixer-js would be:

```
<div className="mf-onboarding-container mf-onboarding-header"></div>
```
