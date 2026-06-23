const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        content = content.replace(/www\.saheragroup\.com/g, 'www.shop.nexuscalculator.net');
        content = content.replace(/https:\/\/saheragroup\.com/g, 'https://www.shop.nexuscalculator.net');
        content = content.replace(/support@saheragroup\.com/g, 'support@shop.nexuscalculator.net');
        content = content.replace(/orders@saheragroup\.com/g, 'orders@shop.nexuscalculator.net');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
