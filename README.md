<div align="center">
	<br>
	<br>
	<img width="300" src="logo.png"></img></a>
</div>

# Brainfucc

---

> A small brainfuck interpreter for nodejs.

## Introduction

Brainfuck is the most famous esoteric programming language, it's syntax consists of only 8 commands, represented by the following characters `> < + - . , [ ]`.

| Command | Description |
| - | -----------------|
| <div align=center>**\>**</div> |  Moves pointer to the right. |
| <div align=center>**\<**</div> |  Moves pointer to the left. |
| <div align=center>**\+**</div> |  Adds 1 to the memory cell under the pointer. |
| <div align=center>**\-**</div> |  Subtracts 1 from the memory cell under the pointer. |
| <div align=center>**\.**</div> |  Outputs the ASCII character represented by the value present in memory cell under the pointer. (Ex: 48 => 0) |
| <div align=center>**\,**</div> |  Input a character and stores it's value in the memory cell under the pointer. |
| <div align=center>**\[**</div> |  Jump past the matching ] if the cell under the pointer is 0. |
| <div align=center>**\>**</div> |  Jump back to the matching [ if the cell under the pointer is nonzero.|

## Installation

```shell
$ npm install brainfucc
```


## Basic usage

```javascript
const brainfucc = require('brainfucc')

// Call brainfucc function.
brainfucc('+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.')
```
The above code will output `hello world` in the console.

## Features

### Memory Structure

- Brainfucc implements the memory as an array of 8-bit integers raging from 0 to 255.

- This memory wraps, so **if you decrement a 0 it becomes a 255 and if you increment a 255 it becomes a 0**.

- Memory by default has 30000 cells, initialized as 0.

### Options

- **memory** - Controls the number of memory cells available to the code (Default = 30000).


```javascript
// Makes available 5 memory cells. The code bellow outputs '0'.
brainfucc('++++++[> ++++++++ < -] > .', { memory: 5 })

// Initializes
//  v
// [0,0,0,0,0]
```

- **delay** - Controls the delay between the execution of each command, in milliseconds (Default = 0).


```javascript
// Forces a 10 millisecond delay between each command execution.
brainfucc('+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.', { delay: 10 })
```


- **debug** - Display before each command, the current code position, loop stack and memory condition (Default = false). **OBS: Memory condition is only displayed if the memory parameter is set to a value smaller than 51.**


```javascript
// Displays information about the current state of the machine at each step.
// The code bellow outputs '0'.
brainfucc('++++++[> ++++++++ < -] > .', { debug: true, memory: 5, delay: 200 })
```
<div align="center">
	<br>
	<img width="400" src="https://media.giphy.com/media/J4Ja55XJcRLOeY9APu/giphy.gif"></img></a>
</div>




### Comments and whitespaces
- Brainfucc ignores every character except for the 8 brainfuck symbols `> < + - . , [ ]`. So comments can be made with any other characters.

```javascript
// The code bellow will still output 'hello world'.
brainfucc('+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-. returns a hello world!')

// Brainfucc also ignores spaces and newlines so
// the code bellow will still output 'hello world'.
brainfucc(`+[-[<<[+[--->]-
[<<<]]]>>>-]>-.---.>..>.<<<<-.
<+.>>>>>.>.<<.<-. 
returns a hello world!`)
```

### Code validation and Runtime errors

- Brainfucc checks the code before running for mismatched loop brackets. If any dangling brackets are encountered it throws an exception.


```javascript
// The code bellow will throw an exception.
brainfucc('[[]')
```

- If the code tries to access unavailable memory, Brainfucc throws an exception.

```javascript
// The code bellow will throw an exception for 
// trying to access memory at the -1 position.
brainfucc('<')


// The code bellow will throw an exception for trying to 
// access memory greater than the number of cells alocated.
brainfucc('>>>', { memory: 3 })
```

---

## Contributing

If you find a bug or think that something is hard to understand feel free to open an issue or contact me on twitter [@cvmcosta](https://twitter.com/cvmcosta), pull requests are also welcome :).

---

## License

[![APACHE2 License](https://img.shields.io/github/license/cvmcosta/ltijs)](LICENSE)

