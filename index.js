const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';

const args = process.argv.slice(2);

const cmd = args[0];
const password = args[1];

const source = args[2];
const dest = args[3];

function encrypt(text) {
	const cipher = crypto.createCipher(algorithm, password);
	let crypted = cipher.update(text, 'utf8', 'hex')
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text) {
	const decipher = crypto.createDecipher(algorithm, password)
	let dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
}

function toCSV(json) {
	return json.data.map((value, index) => {
		return (index + 1) + ',' + value.user + ',' + value.pass + ',' + (value.details || 'N/A');
	});
}

function toJSON(csv) {
	const rows = csv.split('\n');
	const data = rows.map((value, index) => {
		const cols = value.split(',');
		return { user: cols[1], pass: cols[2], details: cols[3] };
	});
	return { updatedAt: (new Date()).toString(), data: data };
}

function showHelp() {
	console.log('\x1b[43m%s\x1b[0m', 'Usage:');
	console.log('$node index.js <command> <master-password> <source-file> <dest-file>\n');
	console.log('\x1b[43m%s\x1b[0m', 'Commands:');
	console.log('help, decrypt, encrypt\n');
	console.log('\x1b[33m%s\x1b[0m', 'help', '- To get help');
	console.log('\x1b[33m%s\x1b[0m', 'decrypt', '- To show contents of encrypted file');
	console.log('\x1b[33m%s\x1b[0m', 'encrypt', '- To encrypt the contents of plain password file\n');
}

function checkInput() {
	if (!source) {
		console.log('\x1b[41m%s\x1b[0m\x1b[31m%s\x1b[0m', 'Error:', " Invalid source file name\n");
		showHelp();
		process.exit(1);
	}
	if (!dest) {
		console.log('\x1b[41m%s\x1b[0m\x1b[31m%s\x1b[0m', 'Error:', " Invalid destination file name\n");
		showHelp();
		process.exit(1);
	}
}

switch (cmd) {
	case 'help':
		showHelp();
		break;
	case 'decrypt':
		// Decrypt file
		checkInput();
		console.log('Reading file: ' + source);
		fs.readFile(source, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				console.log('\x1b[31m%s\x1b[0m',
					'Error occured while reading the file! Make sure the file path is correct.');
				return;
			}
			console.log('Decrypting file...');
			try {
				const json = JSON.parse(decrypt(data));
				console.log('Decrypted successfully!\nSaving data to: ' + dest);
				console.log('Converting to CSV');
				fs.writeFile(dest, toCSV(json).join('\n'), (err, data) => {
					if (err) {
						console.error(err);
						console.log('\x1b[31m%s\x1b[0m', 'Error occured while saving the data!');
						return;
					}
					console.log('\x1b[32m%s\x1b[0m', 'Successfully saved to: ' + dest);
				});
			} catch (error) {
				console.log('\x1b[31m%s\x1b[0m', 'Wrong master key!');
			}
		});
		break;
	case 'encrypt':
		// Encrypt file
		checkInput();
		console.log('Reading file: ' + source);
		fs.readFile(source, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				console.log('\x1b[31m%s\x1b[0m',
					'Error occured while reading the file! Make sure the file path is correct.');
				return;
			}

			console.log('Converting to JSON');
			data = toJSON(data);

			console.log('Encrypting file...');
			const json = encrypt(JSON.stringify(data));

			console.log('Encrypted successfully!\nSaving data to: ' + dest);
			fs.writeFile(dest, json, (err, data) => {
				if (err) {
					console.error(err);
					console.log('\x1b[31m%s\x1b[0m', 'Error occured while saving the data!');
					return;
				}
				console.log('\x1b[32m%s\x1b[0m', 'Successfully saved to: ' + dest);
			});
		});
		break;
	default:
		console.log('\x1b[41m%s\x1b[0m\x1b[31m%s\x1b[0m', 'Error:', ' Invalid input', '\n');
		showHelp();
		break;
}
