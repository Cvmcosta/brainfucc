// Brainfucc - Cvmcosta 2020

// Imports stdin reader
const readline = require('readline')

// Sanitizes brainfuck code
const sanitize = (code) => {
  // Removes whitespaces, newlines and other useless characters from source code
  return code.replace(/\s/g, '')
}

// Analyzes code to check for dangling loop brackets
const syntaxCheck = (code) => {
  const stack = []
  let flag = 0
  let index = 0
  for (const mark of code) {
    if (mark === '[') { stack.push(index); flag++ }
    if (mark === ']') { stack.pop(); flag-- }
    if (flag < 0) throw new Error('Dangling closing bracket at index: ' + index)
    index++
  }
  if (flag !== 0) throw new Error('Infinite loop found at index: ' + stack.pop())
}
const wait = (ms) => {
  var d = new Date()
  var d2 = null
  do { d2 = new Date() }
  while (d2 - d < ms)
}

// Interprets the brainfuckcode
/**
 * @description Interprets brainfuck code
 * @param {String} code - Brainfuck code.
 * @param {Object} opts - Options.
 * @param {Boolean} [opts.debug=false] - If true, displays memory and parser information at every step.
 * @param {Number} [opts.delay=0] - Delay between each step (In milliseconds).
 * @param {Number} [opts.memory=30000] - Number of memory cells.
 */
exports.interpret = async (code, opts) => {
  // Memory array initialized with 30000 registers
  const memory = new Uint8Array((opts && opts.memory) ? parseInt(opts.memory) : 30000)

  // Initializes pointer at position 0
  let pointer = 0

  // Initializes loop stack
  const loop = []

  // Removes whitespaces, newlines and other useless characters from source code
  code = sanitize(code)

  // Checks if source code will reach an infinite loop
  syntaxCheck(code)

  // Prompt function
  const prompt = () => {
    return new Promise((resolve, reject) => {
      // Initializes stdin input reader
      const stdreader = readline.createInterface({ input: process.stdin, output: process.stdout })
      stdreader.question('<< ', (userInput) => {
        resolve(userInput)
        stdreader.close()
      })
    })
  }

  // Iterates through source code
  for (let index = 0; index < code.length; index++) {
    const mark = code[index]

    if (opts && opts.debug) {
      let debugCode = '{'
      let header = ' '
      for (const i in code) {
        if (parseInt(i) === parseInt(index)) {
          debugCode += ' ' + code[i] + ' '
          header += ' v '
        } else {
          debugCode += ' ' + code[i] + ' '
          header += '   '
        }
      }
      debugCode += '}'
      console.log('Code:')
      console.log(header)
      console.log(debugCode, '\n')
      console.log('Loop stack:')
      console.log(loop, '\n')
      if (opts && opts.memory <= 50) {
        console.log('Memory:')
        console.table(memory)
      }
      console.log('\n')
    }

    switch (mark) {
      case '>':
        pointer++
        if (pointer >= memory.length) throw new Error('Pointer out of bounds at index: ' + pointer)
        break
      case '<':
        pointer--
        if (pointer < 0) throw new Error('Pointer out of bounds at index: ' + pointer)
        break
      case '+':
        memory[pointer]++
        break
      case '-':
        memory[pointer]--
        break
      case '.':
        process.stdout.write(String.fromCharCode(memory[pointer]))
        break
      case ',':
        const input = await prompt()
        memory[pointer] = input.charCodeAt(0)
        break
      case '[':
        if (memory[pointer] !== 0) loop.push(index)
        else {
          let depth = 1
          while (depth > 0) {
            index++
            if (code[index] === '[') depth++
            else if (code[index] === ']') depth--
          }
        }
        break
      case ']':
        if (memory[pointer] === 0) loop.pop()
        else {
          index = loop[loop.length - 1]
        }
        break
    }
    if (opts && opts.delay !== undefined) wait(opts.delay)
  }
  // Adds newline when it's done
  console.log()
}
