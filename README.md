# csv-model-generator
a simple text generator that takes your fake schema and builds out dummy data.

## Description
This package quickly builds out dummy csv data that conforms exactly to your schema which should be readily comsumable by your model.


## THEORY
Most of the magic is done with [streaming data](https://nodejs.org/api/stream.html) [piped](https://en.wikipedia.org/wiki/Pipeline_(Unix)) in from a bash script or [redirected out](https://en.wikipedia.org/wiki/Redirection_(computing)) into a file



## Installation
Either through cloning with git or by using yarn (the recommended way):

```bash 
yarn add -D csv-model-generator
```

This will install a binary called `model-csv` to your node_modules. It will not be available in your system path. Instead, the local installation can be run by calling it from within an npm script (such as `yarn data:generate`). 

## Usage 

This library does two things: 
1. takes your model structure, given that `-m path/to/model.fake`; generates dummy data to stdout 
2. iterates over the above data; uses your `-m path/to/model.insertBatch` to perform batch insert
> [note]: these method names are also dynamic and can be tailored to whatever your method names are: `-m another/path/to/some/model.functionName`

### A note on usage
> If you call `model-csv` directly from yarn (~`yarn model-csv`~), *BEWARE*, it must be done in *silent* mode, since yarn outputs all sorts of stuff you don't want in your data
>
> ~`yarn model-csv`~ 🚫    
> `yarn -s model-csv` ✅

### Generating Fake data
> (required) your method MUST return an object with keys that match the schema columns, and data (values) *must* be executable functions (function references to be executed later).

```bash
model-csv -m model/User.fake -c 20 --out > data/demo_users.csv
```
#### Explanation
we're calling the `model-csv` binary, and passing 2 args: 
  - (-m, --model=) the location of the model that contains the method, in the form of
    -  `path/to/some/model.functionName`, 
  - (-c, --count=) the quantity of records to create  
and we're piping the results to some file to be created


### Read in fake data, write to the database
> (required) you *must* have a model with a method named `insertBatch` that receives an array of objects that can be put directly into a query.

```bash
cat data/demo_users.csv | model-csv -m model/User.insertBatch
```

We're piping the contents of `data/demo_users.csv` we generated in the step above into our `seed` binary, and giving it the location of our model.


