echo 'Updating gitignore...'
cat << 'IGN' > .gitignore
node_modules/
dist/
build/
coverage/
jest_out.txt
create-bedrock/create_addon_extracted/
create-bedrock/node_modules/
IGN
