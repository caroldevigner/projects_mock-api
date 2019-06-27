#!/usr/bin/env node

const chalk = require('chalk')
const bcrypt = require('bcrypt')
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

const hash = function (password) {
    return bcrypt.hashSync(password, salt)
}

const resultLog = chalk.green('Your encrypted password is: ',hash(process.argv[2]))
console.log(resultLog)