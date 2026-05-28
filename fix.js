const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix template literal variables: /product/?{product.id} -> /product/${product.id}
    // We only want to restore $ inside template strings (e.g. backticks).
    // Actually, it's safer to restore ?{ to ${ anywhere EXCEPT where we want a currency symbol.
    // Let's first restore ALL ? to $.
    // Wait, were there any legitimate ? in the code?
    // Yes, optional chaining (e.g. product?.image), ternary operators (cond ? a : b).
    // The PowerShell script ONLY replaced '$' with '?'. So the ONLY '?' that were added were originally '$'.
    // BUT PowerShell -replace '\$', '?' replaces all '$' with '?'. Wait, the command was -replace '\$', '₹', but due to encoding it wrote '?'.
    // This means EVERY original '$' is now '?'.
    // And original '?' are still '?'. We can't simply replace all '?' with '$'.
    
    // Let's look for specific patterns:
    // 1. Template literal interpolations: /product/\?\{/g -> /product/\$\{/g
    content = content.replace(/`([^`]*)\?\{/g, (match, p1) => {
        return '`' + p1 + '${';
    });
    // Let's just do a generic replace for template literals: `\?\{` inside backticks is hard. 
    // Actually, `?{` is very rare outside of what used to be `${`.
    // Let's replace `?{` with `${` where it looks like a variable interpolation.
    content = content.replace(/\?\{/g, '${');
    
    // 2. JSX Currency: >?{ -> >₹{
    content = content.replace(/>\$\{/g, '>₹{'); 
    
    // 3. String Currency: "?100" -> "₹100", "$69.99" -> "₹69.99"
    content = content.replace(/\?(\d+(\.\d+)?)/g, '₹$1');
    
    // 4. In admin dashboard stats: '$45,231.89' -> became '?45,231.89'
    content = content.replace(/\?(\d+,\d+(\.\d+)?)/g, '₹$1');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Fix completed");
