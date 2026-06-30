// ============================================
// 🎨 BRONX TEXT TO IMAGE API – SVG BASED
// No Native Dependencies – Render Ready
// ============================================
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const CREDIT = "BRONX_ULTRA";

// ============ TEXT TO SVG ============
function generateSVG(text, options = {}) {
    const {
        width = 1200,
        height = 630,
        textColor = '#ffffff',
        fontSize = 48,
        padding = 40
    } = options;

    // Word wrap calculation
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxCharsPerLine = Math.floor((width - padding * 2) / (fontSize * 0.55));
    
    words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (testLine.length > maxCharsPerLine && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);

    const lineHeight = fontSize * 1.4;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;

    // Generate text elements
    const textElements = lines.map((line, i) => {
        const y = startY + i * lineHeight;
        return `
            <!-- Shadow -->
            <text x="${width/2 + 2}" y="${y + 2}" 
                  fill="rgba(0,0,0,0.3)" 
                  font-size="${fontSize}" 
                  font-weight="bold" 
                  font-family="Arial, sans-serif" 
                  text-anchor="middle" 
                  dominant-baseline="middle">${line}</text>
            <!-- Main Text -->
            <text x="${width/2}" y="${y}" 
                  fill="${textColor}" 
                  font-size="${fontSize}" 
                  font-weight="bold" 
                  font-family="Arial, sans-serif" 
                  text-anchor="middle" 
                  dominant-baseline="middle">${line}</text>`;
    }).join('\n');

    // Generate random dots
    const dots = [];
    for (let i = 0; i < 60; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * 3;
        const opacity = Math.random() * 0.08;
        dots.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,${opacity})"/>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a3e;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#0d0d2b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a0a2e;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0096ff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b00ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff0080;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
    
    <!-- Decorative Dots -->
    ${dots.join('\n')}
    
    <!-- Border Glow -->
    <rect x="2" y="2" width="${width-4}" height="${height-4}" 
          fill="none" stroke="rgba(139,0,255,0.15)" stroke-width="2" rx="12"/>
    
    <!-- Text -->
    <g filter="url(#glow)">
        ${textElements}
    </g>
    
    <!-- Watermark -->
    <text x="${width - 20}" y="${height - 20}" 
          fill="rgba(255,255,255,0.12)" 
          font-size="12" 
          font-family="Arial" 
          text-anchor="end">BRONX ULTRA API</text>
</svg>`;
}

// ============ CORS ============
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ============ HOME PAGE ============
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>🎨 BRONX TEXT TO IMAGE</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#000a14;color:#d0d8f0;font-family:'Rajdhani',sans-serif;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(139,0,255,.06),transparent 60%);pointer-events:none;z-index:0}
        .card{background:rgba(5,15,35,.95);border:1px solid rgba(139,0,255,.15);border-radius:20px;padding:40px;max-width:750px;width:100%;text-align:center;position:relative;z-index:1;backdrop-filter:blur(20px)}
        h1{font-family:'Orbitron',sans-serif;font-size:28px;background:linear-gradient(90deg,#8b00ff,#0096ff,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
        .badge{display:inline-block;background:rgba(139,0,255,.08);color:#8b00ff;padding:4px 14px;border-radius:20px;font-size:10px;border:1px solid rgba(139,0,255,.15);margin:4px}
        .section{background:rgba(0,0,0,.5);border:1px solid rgba(139,0,255,.1);border-radius:12px;padding:16px;margin:14px 0;text-align:left}
        code{color:#00ff88;font-family:monospace;font-size:10px;word-break:break-all;display:block;margin:6px 0;background:rgba(0,0,0,.3);padding:8px;border-radius:6px}
        input,textarea{width:100%;padding:10px;background:rgba(0,0,0,.5);border:1px solid rgba(139,0,255,.1);border-radius:10px;color:#fff;font-size:13px;outline:none;margin:6px 0;font-family:'Rajdhani',sans-serif;resize:vertical}
        input:focus,textarea:focus{border-color:#8b00ff;box-shadow:0 0 15px rgba(139,0,255,.1)}
        button{width:100%;padding:12px;background:linear-gradient(135deg,#8b00ff,#0096ff);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;margin:6px 0;transition:.3s}
        button:hover{transform:scale(1.02);box-shadow:0 0 25px rgba(139,0,255,.25)}
        button.green{background:linear-gradient(135deg,#00c853,#009624)}
        button.orange{background:linear-gradient(135deg,#ff6d00,#ff9100)}
        .preview-box{background:rgba(0,0,0,.3);border-radius:12px;overflow:hidden;margin:10px 0}
        .preview-box img{width:100%;height:auto;display:block}
        .result{display:none;margin-top:10px}
        .result.show{display:block}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    </style>
</head>
<body>
<div class="card">
    <h1>🎨 BRONX TEXT TO IMAGE</h1>
    <p style="color:#667;font-size:12px">SVG Based • HD Quality • Glow Effect • Render Ready</p>
    <div style="margin:10px 0">
        <span class="badge">🎨 SVG</span>
        <span class="badge">🌈 Gradient</span>
        <span class="badge">✨ Glow</span>
        <span class="badge">⚡ Fast</span>
    </div>

    <div class="section">
        <p style="color:#8b00ff;font-weight:700">📝 TEXT TO IMAGE GENERATOR</p>
        <textarea id="textInput" rows="3" placeholder="Type your text here...">BRONX ULTRA</textarea>
        <div class="grid2">
            <input type="number" id="widthInput" placeholder="Width" value="1200">
            <input type="number" id="heightInput" placeholder="Height" value="630">
        </div>
        <input type="text" id="colorInput" placeholder="Text Color (hex without #)" value="ffffff">
        <button class="green" onclick="generate()">🎨 GENERATE IMAGE</button>
    </div>

    <div class="result" id="result">
        <div class="preview-box" id="imageBox"></div>
        <button class="orange" onclick="download()">📥 DOWNLOAD PNG</button>
    </div>

    <div class="section">
        <p style="color:#00ff88;font-weight:700">🔗 API ENDPOINTS</p>
        <code>GET /generate?text=Hello+World&width=1200&height=630&color=fff</code>
        <code>GET /api/generate?text=Hello&width=800 (JSON Base64)</code>
    </div>

    <p style="color:#667;font-size:10px;margin-top:14px">Created by BRONX_ULTRA</p>
</div>
<script>
var currentSVG = '';

function generate(){
    var text = document.getElementById('textInput').value.trim();
    var width = document.getElementById('widthInput').value || 1200;
    var height = document.getElementById('heightInput').value || 630;
    var color = document.getElementById('colorInput').value.replace('#','') || 'ffffff';
    
    if(!text) return alert('Enter text!');
    
    var url = '/generate?text=' + encodeURIComponent(text) + '&width=' + width + '&height=' + height + '&color=' + color;
    
    document.getElementById('imageBox').innerHTML = '<img src="' + url + '" alt="Generated Image" style="width:100%">';
    document.getElementById('result').classList.add('show');
    currentSVG = url;
}

function download(){
    if(!currentSVG) return;
    var a = document.createElement('a');
    a.href = currentSVG;
    a.download = 'bronx-image-' + Date.now() + '.svg';
    a.click();
}
</script>
</body></html>`);
});

// ============ GENERATE SVG IMAGE ============
app.get('/generate', (req, res) => {
    const { text, width, height, color, size } = req.query;

    if (!text) {
        return res.status(400).send('Missing text parameter. Use: /generate?text=Hello+World');
    }

    const options = {
        width: parseInt(width) || 1200,
        height: parseInt(height) || 630,
        textColor: '#' + (color || 'ffffff').replace('#', ''),
        fontSize: parseInt(size) || 48,
        padding: 40
    };

    const svg = generateSVG(text, options);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
});

// ============ JSON API (Base64) ============
app.get('/api/generate', (req, res) => {
    const { text, width, height, color, size } = req.query;

    if (!text) {
        return res.json({ error: "Missing text parameter" });
    }

    const options = {
        width: parseInt(width) || 1200,
        height: parseInt(height) || 630,
        textColor: '#' + (color || 'ffffff').replace('#', ''),
        fontSize: parseInt(size) || 48,
        padding: 40
    };

    const svg = generateSVG(text, options);
    const base64 = Buffer.from(svg).toString('base64');

    res.json({
        success: true,
        text: text,
        width: options.width,
        height: options.height,
        format: 'svg',
        image_base64: `data:image/svg+xml;base64,${base64}`,
        svg_raw: svg,
        credit: CREDIT
    });
});

// ============ TEST ============
app.get('/test', (req, res) => {
    res.json({
        status: "✅ TEXT TO IMAGE API ONLINE",
        endpoints: {
            generate: "/generate?text=Hello+World&width=1200&height=630",
            api_json: "/api/generate?text=Hello&width=800"
        },
        credit: CREDIT
    });
});

// ============ 404 ============
app.use((req, res) => {
    res.status(404).json({ error: "Not found", home: "/", generate: "/generate?text=Your+Text" });
});

// ============ START ============
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎨 BRONX TEXT TO IMAGE API on port ${PORT}`);
    console.log(`📱 Test: http://localhost:${PORT}/generate?text=Hello+World`);
});
