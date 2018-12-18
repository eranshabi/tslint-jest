# tslint-jest
Lint rules for projects that use jest.

### Usage
First install:

`npm install --save-dev tslint-jest`

Then add `tslint-jest` to `extends` in your `tslint.json`, with the desired rules:
```js
{
  "extends": ["tslint-jest"],
  "rules": {
  		"no-alias-methods": true
  		...
  	}
}
```

### Rules
- `no-alias-methods`
  - Disallow alias methods	
- `expect-expect`
  - Enforce assertion to be made in a test body

### Contributions
Are welcome, see issues.
