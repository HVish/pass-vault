# pass-vault
An application to store your passwords in encrypted format

# Usage
There are three commands: `help`, `encrypt`, `decrypt`

## Encryption
For encryption you provide a `csv` file as `source-file` and the output is an encrypted file as `dest-file`.

## Decryption
For decryption you provide an encrypted file as `source-file` and the output is a `csv` file as `dest-file`.

## Command format
```bash
$node <path/to/index.js> <command> <master-password> <path/to/source-file> <path/to/dest-file.csv>
```
> **Note:** The `dest-file` is saved in same directory where you are running the command!

## Examples
```bash
$node index.js encrypt <master-password> passwords.csv output  #encryption
$node index.js decrypt <master-password> output passwords.csv  #decryption
```
