
Copy code

---

### **README.md for `classname-prefixer-css`:**

# classname-prefixer-css

A Webpack loader to automatically prefix CSS class names in `.scss` or `.css` files with a custom string.

## Installation

Install the package using npm:

```
npm install classname-prefixer-css --save-dev
```

Usage
Could you add the loader to your Webpack configuration under the module? rules section for CSS/SCSS files.

Webpack Configuration Example:

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,            // Target SCSS files
        exclude: /node_modules/,     // Exclude dependencies
        use: [
          'style-loader',            // Inject CSS into the DOM
          'css-loader',              // Translate CSS into CommonJS
          {
            loader: 'classname-prefixer-css',  // Add classname-prefixer-css loader
            options: {
              prefix: 'your-prefix',  // Replace 'your-prefix' with your desired class name prefix
            },
          },
          'sass-loader',             // Compile Sass to CSS
        ],
      },
    ],
  },
};
```
Example:
Before applying the loader:
```
.container {
  color: black;
}

.header {
  font-size: 16px;
}
```
After applying the loader with prefix: 'my-app':
```
.my-app-container {
  color: black;
}

.my-app-header {
  font-size: 16px;
}
```
Options
prefix (required): The string that will be prefixed to every class name in the CSS/SCSS files.
Example:
With the prefix: 'mf-onboarding':
```
.header {
  background: red;
}
```
Will become:
```
.mf-onboarding-header {
  background: red;
}
```
