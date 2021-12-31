const bcrypt = require('bcrypt')
const saltRounds = 10;

const encrypt = async password => {
    return await bcrypt.hash(password, saltRounds)
}

const compare = async (userInputPassword, storedHashedPassword) => {
    return await bcrypt.compare(userInputPassword, storedHashedPassword)
}

module.exports = { encrypt, compare }