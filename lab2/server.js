const connect = require('connect');
const http = require('http');
const url = require('url');

const app = connect();

app.use('/lab2', (req, res) => {
    const parsed = url.parse(req.url, true);
    const { method, x, y } = parsed.query;

    if (!method || x === undefined || y === undefined) {
        return sendError(res, 400, "Missing required query parameters: method, x, y");
    }

    const xn = Number(x);
    const yn = Number(y);
    if (Number.isNaN(xn) || Number.isNaN(yn)) {
        return sendError(res, 400, "Parameters x and y must be numbers");
    }

    let result;
    switch (method) {
        case 'add':
            result = xn + yn;
            break;
        case 'subtract':
            result = xn - yn;
            break;
        case 'multiply':
            result = xn * yn;
            break;
        case 'divide':
            if (yn === 0) return sendError(res, 400, "Cannot divide by zero");
            result = xn / yn;
            break;
        default:
            return sendError(res, 400, "Invalid method. Use add, subtract, multiply, or divide");
    }
    const payload = {
        x: String(x),
        y: String(y),
        operation: String(method),
        result: String(result)
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
});

app.use((req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Not found. Try /lab2?method=add&x=16&y=4" }));
});

function sendError(res, status, message) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: message }));
}

const server = http.createServer(app);
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`lab2 running at http://localhost:${PORT}/lab2?method=add&x=16&y=4`);
});
