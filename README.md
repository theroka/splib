# splib
Fetch and write Sharepoint list data.

**Disclaimer**: Originally a module in a non-public project, this lib is used in production, although it is poorly documented.

Tested with Microsoft Sharepoint 2010.

## Setup

To install dependencies and transpile with Babel
```
npm install
or
yarn install
```

To transpile sources separately
```
npm run-scripts postinstall
or
yarn postinstall
```
Transpiled will be written to dist/.

To generate source docs with Typedoc
```
node_modules/.bin/typedoc
or
yarn typedoc
```

## Get list items

````javascript
// define with columns/fields you want and their prop names
// IDs are queried by default
let fields = {
    "Title": "title"
};
// fetch items asynchronously
let items = await getItems("foobar", fields); // --> [{id: 1, title: "foo" }, { id: 2, title: "bar" }, ...]
````

To filter list items you can pass CAML query to getItems().

````javascript
let query = `
    <Where>
        <Eq>
            <FieldRef Name="Title"></FieldRef>
            <Value Type="Text">bar</Value>
        </Eq>
    </Where>`;
// fetch items asynchronously
let items = await getItems("foobar", fields, query); // --> [{ id: 2, title: "bar" }]
````
