<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.formulate-input-errors {
  margin: 0;
  margin-top: 5px;
  color: rgb(255, 51, 0);
  font-size: 13px;
  list-style-type: none;
  padding: 0;
  padding-left: 15px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

textarea {
  height: 120px;
}

input[type=text], input[type=date], input[type=number], select, textarea {
  font-size: 15px;
  background: rgb(226, 226, 226);
  outline: none;
  border: 2px solid #b4b4b4;
  color: #5e5e5e;
  padding: 3px 5px;
  border-radius: 3px;
  width: 100%;
}

input[type=text]:focus, input[type=date]:focus, input[type=number]:focus, select:focus, textarea:focus {
  color: #000;
  background: #fff;
  border: #000 2px solid;
}

.formulate-input-element--checkbox {
  display: inline;
}

h1 {
  text-align: center;
  margin-bottom: 15px;
  margin-top: 10px;
}

.textInput {
  margin-top: 15px;
  min-width: 75%;
}

.stdAdd {
  margin-top: 15px;
  border: 1px solid black;
  border-radius: 5px;
  width: 75px;
  text-align: center;
  padding: 2px 3px;
  cursor: pointer;
}

.min-container {
  padding: 10px 5px 15px 35px;
  margin: 10px 35px;
  border-left: rgb(255, 0, 0) 3px solid;
  width: 70%;

  h2 {
      margin-top: 0;
  }
  align-self: flex-start;
}

.rowData {
  border: 1px solid gray;
  padding: 5px 10px;
  margin: 10px 0;
  border-left: 4px solid gray;
  transition: .4s;
  cursor: pointer;
  p {
      margin: 4px;
  }
}

.rowData:hover {
  background: rgb(238, 198, 198);
}


@media only screen and (max-width: 900px) {
  .stepcontainer {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .textInput {
    margin-top: 15px;
    min-width: 110%;
  }

  .min-container {
    padding: 10px 5px 15px 15px;
    margin: 10px 15px;
  }
}

</style>
