const bcrypt = require('bcrypt');

async function run() {
    const password = 'june1999';

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`Salt: ${salt}`);
    console.log(`Password: ${password}`);
    console.log(`Hashed Password: ${hashedPassword}`);

    // Call password match function
    await matchP(password, hashedPassword);
}

async function matchP(password, hashedPassword) {
    const result = await bcrypt.compare('lol', hashedPassword);
    console.log(`Password Match: ${result}`);
}

// Run the function
run();
