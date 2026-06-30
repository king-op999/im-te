// ============================================
// 🎨 BRONX TEXT TO IMAGE API
// Render Ready – HD Quality PNG Output
// ============================================
const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const app = express();

// ============ CONFIG ============
const PORT = process.env.PORT || 3000;
const CREDIT = "BRONX_ULTRA";

// ============ TEXT TO IMAGE GENERATOR ============
function generateImage(text, options = {}) {
    const {
        width = 1200,
        height = 630,
        bgColor = '#0a0a1a',
        textColor = '#ffffff',
        fontSize = 48,
        fontFamily = 'sans-serif',
        padding = 40
    } = options;

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a3e');
    gradient.addColorStop(0.5, '#0d0d2b');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative dots
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Text settings
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px "${fontFamily}", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = width - padding * 2;

    words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);

    // Draw text
    const lineHeight = fontSize * 1.4;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, i) => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText(line, width / 2 + 2, startY + i * lineHeight + 2);
        
        // Main text
        ctx.fillStyle = textColor;
        ctx.fillText(line, width / 2, startY + i * lineHeight);
    });

    // Bottom watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('BRONX ULTRA API', width - 20, height - 20);

    return canvas;
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
    <title>🎨 BRONX TEXT TO IMAGE API</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#000a14;color:#d0d8f0;font-family:'Rajdhani',sans-serif;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(139,0,255,.06),transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(0,150,255,.04),transparent 60%);pointer-events:none;z-index:0}
        .card{background:rgba(5,15,35,.95);border:1px solid rgba(139,0,255,.15);border-radius:20px;padding:40px;max-width:700px;width:100%;text-align:center;position:relative;z-index:1;backdrop-filter:blur(20px)}
        h1{font-family:'Orbitron',sans-serif;font-size:28px;background:linear-gradient(90deg,#8b00ff,#0096ff,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
        .badge{display:inline-block;background:rgba(139,0,255,.08);color:#8b00ff;padding:4px 14px;border-radius:20px;font-size:10px;border:1px solid rgba(139,0,255,.15);margin:4px}
        .section{background:rgba(0,0,0,.5);border:1px solid rgba(139,0,255,.1);border-radius:12px;padding:16px;margin:14px 0;text-align:left}
        code{color:#00ff88;font-family:monospace;font-size:11px;word-break:break-all;display:block;margin:6px 0;background:rgba(0,0,0,.3);padding:8px;border-radius:6px}
        input,textarea,select{width:100%;padding:10px;background:rgba(0,0,0,.5);border:1px solid rgba(139,0,255,.1);border-radius:10px;color:#fff;font-size:13px;outline:none;margin:6px 0;font-family:'Rajdhani',sans-serif;resize:vertical}
        input:focus,textarea:focus,select:focus{border-color:#8b00ff;box-shadow:0 0 15px rgba(139,0,255,.1)}
        button{width:100%;padding:12px;background:linear-gradient(135deg,#8b00ff,#0096ff);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;margin:6px 0;transition:.3s}
        button:hover{transform:scale(1.02);box-shadow:0 0 25px rgba(139,0,255,.25)}
        button.green{background:linear-gradient(135deg,#00c853,#009624)}
        .preview{max-width:100%;border-radius:12px;margin-top:10px;border:2px solid rgba(139,0,255,.2);display:none}
        .preview.show{display:block}
        .color-row{display:flex;gap:8px;flex-wrap:wrap}
        .color-btn{width:35px;height:35px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:.3s}
        .color-btn:hover,.color-btn.active{border-color:#fff;transform:scale(1.1)}
    </style>
</head>
<body>
<div class="card">
    <h1>🎨 TEXT TO IMAGE API</h1>
    <p style="color:#667;font-size:12px">HD Quality • Custom Colors • Render Ready</p>
    <div style="margin:10px 0">
        <span class="badge">🎨 HD PNG</span>
        <span class="badge">🌈 Gradient</span>
        <span class="badge">⚡ Fast</span>
    </div>

    <div class="section">
        <p style="color:#8b00ff;font-weight:700">📝 QUICK GENERATOR</p>
        <textarea id="textInput" rows="3" placeholder="Type your text here..."></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <input type="number" id="widthInput" placeholder="Width (px)" value="1200">
            <input type="number" id="heightInput" placeholder="Height (px)" value="630">
        </div>
        <input type="text" id="colorInput" placeholder="Text Color (e.g., #ffffff)" value="#ffffff">
        <button class="green" onclick="generatePreview()">🎨 GENERATE PREVIEW</button>
    </div>

    <img id="previewImg" class="preview" alt="Preview">

    <div class="section">
        <p style="color:#00ff88;font-weight:700">🔗 API ENDPOINT</p>
        <code>GET /generate?text=YOUR_TEXT&width=1200&height=630&color=#fff</code>
        <p style="color:#ffb400;font-size:10px">Direct URL → Image opens in browser!</p>
    </div>

    <p style="color:#667;font-size:10px;margin-top:14px">Created by BRONX_ULTRA</p>
</div>

<script>
function generatePreview(){
    var text = document.getElementById('textInput').value.trim();
    var width = document.getElementById('widthInput').value || 1200;
    var height = document.getElementById('heightInput').value || 630;
    var color = document.getElementById('colorInput').value.replace('#','') || 'ffffff';
    
    if(!text) return alert('Enter some text!');
    
    var url = '/generate?text=' + encodeURIComponent(text) + '&width=' + width + '&height=' + height + '&color=' + color;
    var img = document.getElementById('previewImg');
    img.src = url;
    img.classList.add('show');
}
</script>
</body></html>`);
});

// ============ TEXT TO IMAGE API ============
app.get('/generate', (req, res) => {
    const {
        text,
        width,
        height,
        color,
        bg,
        size
    } = req.query;

    if (!text) {
        return res.status(400).json({
            error: "Missing 'text' parameter",
            usage: "/generate?text=Hello World&width=1200&height=630&color=#fff"
        });
    }

    try {
        const options = {
            width: parseInt(width) || 1200,
            height: parseInt(height) || 630,
            textColor: color ? '#' + color.replace('#', '') : '#ffffff',
            bgColor: bg ? '#' + bg.replace('#', '') : '#0a0a1a',
            fontSize: parseInt(size) || 48,
            padding: 40
        };

        // Generate image
        const canvas = generateImage(text, options);
        const buffer = canvas.toBuffer('image/png');

        // Send as PNG
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="bronx-text-${Date.now()}.png"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(buffer);

    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({
            error: "Image generation failed",
            message: error.message
        });
    }
});

// ============ JSON API (Returns Base64) ============
app.get('/api/generate', (req, res) => {
    const {
        text,
        width,
        height,
        color,
        size
    } = req.query;

    if (!text) {
        return res.json({
            error: "Missing 'text' parameter",
            usage: "/api/generate?text=Hello&width=1200&height=630"
        });
    }

    try {
        const options = {
            width: parseInt(width) || 1200,
            height: parseInt(height) || 630,
            textColor: color ? '#' + color.replace('#', '') : '#ffffff',
            fontSize: parseInt(size) || 48,
            padding: 40
        };

        const canvas = generateImage(text, options);
        const buffer = canvas.toBuffer('image/png');
        const base64 = buffer.toString('base64');

        res.json({
            success: true,
            text: text,
            width: options.width,
            height: options.height,
            format: 'png',
            image_base64: `data:image/png;base64,${base64}`,
            credit: CREDIT
        });

    } catch (error) {
        res.status(500).json({
            error: "Generation failed",
            message: error.message
        });
    }
});

// ============ TEST ============
app.get('/test', (req, res) => {
    res.json({
        status: "✅ TEXT TO IMAGE API ONLINE",
        endpoints: {
            generate: "/generate?text=Hello+World&width=1200&height=630",
            api_json: "/api/generate?text=Hello&width=800&height=400"
        },
        credit: CREDIT
    });
});

// ============ 404 ============
app.use((req, res) => {
    res.status(404).json({
        error: "Not found",
        home: "/",
        test: "/test",
        generate: "/generate?text=Your+Text+Here"
    });
});

// ============ START ============
app.listen(PORT, '0.0.0.0', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 BRONX TEXT TO IMAGE API');
    console.log(`🚀 Running on port ${PORT}`);
    console.log(`📱 Test: http://localhost:${PORT}/generate?text=Hello+World`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
