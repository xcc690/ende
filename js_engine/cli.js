/**
 * Node.js CLI wrapper - 从 stdin 读取 JSON，调用 crypto_engine，结果写 stdout
 */
const { dispatch } = require('./crypto_engine');

let chunks = [];
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) { chunks.push(chunk); });
process.stdin.on('end', function() {
    const input = chunks.join('');
    try {
        const req = JSON.parse(input);
        const data = String(req.data);
        const result = dispatch(
            req.action,
            req.algorithm,
            data,
            JSON.stringify(req.params || {})
        );
        process.stdout.write(JSON.stringify({ ok: true, result: result }));
    } catch (e) {
        process.stdout.write(JSON.stringify({ ok: false, error: e.message }));
    }
});
