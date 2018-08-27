# csv-model-generator
a simple text generator that takes your fake schema and builds out dummy data.

## Description
This package quickly builds out dummy csv data that conforms exactly to your schema which should be readily comsumable by your model.


## Usage 

This library does two things: 
1. takes your model structure `model.fake()`; generates dummy data to stdout 
2. iterates over the above data; uses your `model.insertBatch()` to perform batch insert


## THEORY
Most of the magic is done with [streaming data](https://nodejs.org/api/stream.html) [piped](https://en.wikipedia.org/wiki/Pipeline_(Unix)) in from a bash script or [redirected out](https://en.wikipedia.org/wiki/Redirection_(computing)) into a file


### Generating Fake data
> (required) you *must* have a model with a method named `fake` that returns an object with keys that match the schema columns. The data (values) *must* be executable function refs (function references to be executed later).

```bash
generate -m model/User -c 20 > data/demo_users.csv
```
we're calling the `generate` binary, and passing 2 args: 
  - (m) the location of the model that contains the method `fake`, 
  - (c) the quantity of records to create  
and we're piping the results to some file to be created


### Read in fake data, write to the database
> (required) you *must* have a model with a method named `insertBatch` that receives an array of objects that can be put directly into a query.

```bash
cat data/demo_users.csv | seed -m model/User
```

We're piping the contents of `data/demo_users.csv` we generated in the step above into our `seed` binary, and giving it the location of our model.


