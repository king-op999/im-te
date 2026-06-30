// ============================================
// 🎨 BRONX AI TEXT-TO-IMAGE API
// Uses FREE Pollinations.ai API
// HD Realistic Images from Text Prompts
// ============================================
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// ============ AI IMAGE API (FREE) ============
const AI_API_BASE = "https://image.pollinations.ai/prompt";

// ============ CORS ============
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ============ HOME PAGE ============
app.get('/', (req, res) => {
    const host = req.get('host');
    const baseURL = `https://${host}`;
    
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>🎨 BRONX AI IMAGE API</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root{--bg:#000a14;--s:rgba(5,15,35,.85);--b:rgba(139,0,255,.1);--t:#d0d8f0;--a:#8b00ff;--g:#00ff88;--r:#ff3366}
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--bg);color:var(--t);font-family:'Rajdhani',sans-serif;min-height:100vh}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% -20%,rgba(139,0,255,.08),transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(0,150,255,.05),transparent 50%);pointer-events:none;z-index:0}
        .container{max-width:900px;margin:0 auto;padding:20px;position:relative;z-index:1}
        .header{text-align:center;padding:30px 0 20px}
        .header h1{font-family:'Orbitron',sans-serif;font-size:clamp(24px,5vw,38px);background:linear-gradient(90deg,#8b00ff,#0096ff,#00d4ff,#ff0080,#ffb400);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rainbow 4s linear infinite}@keyframes rainbow{0%{background-position:0% 50%}100%{background-position:300% 50%}}
        .header p{color:#667;font-size:13px;margin-top:6px}
        .badge{display:inline-block;background:rgba(139,0,255,.08);color:var(--a);padding:4px 14px;border-radius:20px;font-size:10px;border:1px solid rgba(139,0,255,.15);margin:3px}
        
        .card{background:var(--s);border:1px solid var(--b);border-radius:16px;padding:20px;margin:14px 0;backdrop-filter:blur(20px)}
        .card h3{color:#fff;font-size:16px;margin-bottom:10px;font-family:'Orbitron',sans-serif}
        textarea,input,select{width:100%;padding:12px;background:rgba(0,0,0,.5);border:1px solid var(--b);border-radius:10px;color:#fff;font-size:13px;outline:none;margin:6px 0;font-family:'Rajdhani',sans-serif;resize:vertical}
        textarea:focus,input:focus,select:focus{border-color:var(--a);box-shadow:0 0 20px rgba(139,0,255,.15)}
        .row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
        button{width:100%;padding:13px;background:linear-gradient(135deg,#8b00ff,#0096ff);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:14px;margin:6px 0;transition:.3s}
        button:hover{transform:scale(1.02);box-shadow:0 0 30px rgba(139,0,255,.25)}
        button.green{background:linear-gradient(135deg,#00c853,#009624)}
        button.orange{background:linear-gradient(135deg,#ff6d00,#ff9100)}
        .image-box{text-align:center;margin:10px 0}
        .image-box img{max-width:100%;border-radius:14px;border:2px solid var(--b);box-shadow:0 0 50px rgba(139,0,255,.1)}
        .image-box img[src=""]{display:none}
        .loading{text-align:center;padding:30px;display:none}
        .loading.show{display:block}
        .spinner{width:40px;height:40px;border:3px solid rgba(139,0,255,.15);border-top:3px solid var(--a);border-radius:50%;animation:spin 1s linear infinite;margin:10px auto}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        code{display:block;background:rgba(0,0,0,.5);color:var(--g);padding:10px;border-radius:8px;font-size:10px;word-break:break-all;margin:6px 0}
        .examples{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
        .example-btn{background:rgba(139,0,255,.06);color:var(--a);padding:6px 14px;border-radius:20px;font-size:10px;cursor:pointer;border:1px solid rgba(139,0,255,.12);transition:.3s}
        .example-btn:hover{background:rgba(139,0,255,.15);color:#fff}
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🎨 BRONX AI IMAGE API</h1>
        <p>AI-Powered Text-to-Image • HD Realistic • Multiple Styles</p>
        <div style="margin-top:10px">
            <span class="badge">🤖 AI Generated</span>
            <span class="badge">🎨 HD Quality</span>
            <span class="badge">🌈 Colorful</span>
            <span class="badge">⚡ Fast</span>
        </div>
    </div>

    <div class="card">
        <h3>📝 CREATE IMAGE FROM TEXT</h3>
        <textarea id="prompt" rows="3" placeholder="Describe your image... (e.g., A beautiful sunset over mountains with colorful sky)">A futuristic city with neon lights, flying cars, purple and blue sky, highly detailed, 8k</textarea>
        
        <div class="examples">
            <span style="color:#667;font-size:10px;margin-right:4px">Quick:</span>
            <span class="example-btn" onclick="setPrompt('Beautiful garden with colorful flowers, butterflies, morning sunlight')">🌸 Garden</span>
            <span class="example-btn" onclick="setPrompt('Cyberpunk city at night, neon lights, rain, highly detailed')">🌃 Cyberpunk</span>
            <span class="example-btn" onclick="setPrompt('Cute baby dragon with colorful scales, fantasy art, magical')">🐉 Dragon</span>
            <span class="example-btn" onclick="setPrompt('Sports car on mountain road, sunset, golden hour, realistic')">🏎️ Car</span>
            <span class="example-btn" onclick="setPrompt('Japanese cherry blossom temple, peaceful, anime style')">🏯 Anime</span>
        </div>

        <div class="row">
            <select id="style">
                <option value="">🎨 Default Style</option>
                <option value="realistic">📸 Realistic Photo</option>
                <option value="anime">🎌 Anime/Manga</option>
                <option value="painting">🖼️ Oil Painting</option>
                <option value="3d">🧊 3D Render</option>
                <option value="sketch">✏️ Pencil Sketch</option>
                <option value="watercolor">🎨 Watercolor</option>
                <option value="cyberpunk">🌆 Cyberpunk</option>
            </select>
            <select id="size">
                <option value="1024">📐 1024px (Fast)</option>
                <option value="1280" selected>📐 1280px (HD)</option>
                <option value="1600">📐 1600px (Ultra HD)</option>
            </select>
            <input type="text" id="seed" placeholder="Seed (optional)">
        </div>

        <button onclick="generateImage()">🎨 GENERATE AI IMAGE</button>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p style="color:#8b00ff;font-size:13px">🤖 AI is creating your image...</p>
            <p style="color:#667;font-size:10px">This may take 10-30 seconds</p>
        </div>

        <div class="image-box" id="imageBox"></div>
        <button class="orange" id="downloadBtn" onclick="downloadImage()" style="display:none">📥 DOWNLOAD HD IMAGE</button>
    </div>

    <div class="card">
        <h3>🔗 API ENDPOINTS</h3>
        <code>GET /generate?prompt=DESCRIPTION&size=1280&style=realistic</code>
        <code>GET /api/generate?prompt=DESCRIPTION (JSON with URL)</code>
        <p style="color:#667;font-size:10px;margin-top:6px">Use in Telegram Bot, Website, or any App!</p>
    </div>

    <p style="text-align:center;color:#667;font-size:10px;padding:10px">Created by BRONX_ULTRA | Powered by Pollinations.ai</p>
</div>

<script>
var currentImageUrl = '';

function setPrompt(text) {
    document.getElementById('prompt').value = text;
}

async function generateImage() {
    var prompt = document.getElementById('prompt').value.trim();
    var style = document.getElementById('style').value;
    var size = document.getElementById('size').value;
    var seed = document.getElementById('seed').value;
    
    if (!prompt) return alert('Please enter a prompt!');
    
    // Build full prompt
    var fullPrompt = prompt;
    if (style) fullPrompt += ', ' + style + ' style';
    if (size) fullPrompt += ', ' + size + 'px';
    fullPrompt += ', high quality, detailed, 8k';
    
    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('imageBox').innerHTML = '';
    document.getElementById('downloadBtn').style.display = 'none';
    
    // Build URL
    var imageUrl = '/generate?prompt=' + encodeURIComponent(fullPrompt);
    if (size) imageUrl += '&size=' + size;
    if (seed) imageUrl += '&seed=' + seed;
    
    console.log('Generating:', imageUrl);
    
    // Create image
    var img = new Image();
    img.onload = function() {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('imageBox').innerHTML = '<img src="' + imageUrl + '" alt="AI Generated Image">';
        document.getElementById('downloadBtn').style.display = 'block';
        currentImageUrl = imageUrl;
    };
    img.onerror = function() {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('imageBox').innerHTML = '<p style="color:#ff3366;padding:20px">❌ Generation failed. Try a different prompt.</p>';
    };
    img.src = imageUrl;
}

function downloadImage() {
    if (!currentImageUrl) return;
    var a = document.createElement('a');
    a.href = currentImageUrl;
    a.download = 'bronx-ai-image-' + Date.now() + '.jpg';
    a.click();
}
</script>
</body></html>`);
});

// ============ AI IMAGE GENERATION ============
app.get('/generate', async (req, res) => {
    const prompt = req.query.prompt;
    
    if (!prompt) {
        return res.status(400).json({ error: "Missing 'prompt' parameter", usage: "/generate?prompt=Beautiful+sunset" });
    }

    const size = req.query.size || '1280';
    const seed = req.query.seed || Math.floor(Math.random() * 1000000);
    
    // Build AI API URL
    const aiUrl = `${AI_API_BASE}/${encodeURIComponent(prompt)}?width=${size}&height=${size}&seed=${seed}&nologo=true`;
    
    console.log('🤖 Generating:', prompt.substring(0, 80) + '...');

    try {
        // Fetch image from AI API
        const response = await axios.get(aiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: { 'User-Agent': 'BRONX-API/2.0' }
        });

        const imageBuffer = Buffer.from(response.data);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `inline; filename="bronx-ai-${Date.now()}.jpg"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(imageBuffer);

    } catch (error) {
        console.error('❌ AI API Error:', error.message);
        res.status(500).json({ error: "Image generation failed. Try again.", message: error.message });
    }
});

// ============ JSON API ============
app.get('/api/generate', (req, res) => {
    const prompt = req.query.prompt;
    
    if (!prompt) {
        return res.json({ error: "Missing prompt", usage: "/api/generate?prompt=Sunset" });
    }

    const size = req.query.size || '1280';
    const seed = req.query.seed || Math.floor(Math.random() * 1000000);
    
    const imageUrl = `${AI_API_BASE}/${encodeURIComponent(prompt)}?width=${size}&height=${size}&seed=${seed}&nologo=true`;

    res.json({
        success: true,
        prompt: prompt,
        width: parseInt(size),
        height: parseInt(size),
        image_url: imageUrl,
        credit: "BRONX_ULTRA",
        note: "AI generated image using Pollinations.ai"
    });
});

// ============ TEST ============
app.get('/test', (req, res) => {
    res.json({
        status: "✅ BRONX AI IMAGE API ONLINE",
        endpoints: {
            generate: "/generate?prompt=Beautiful+sunset+over+ocean",
            api_json: "/api/generate?prompt=Futuristic+city"
        },
        credit: "BRONX_ULTRA"
    });
});

// ============ 404 ============
app.use((req, res) => {
    res.status(404).json({ error: "Not found", home: "/", generate: "/generate?prompt=Your+description" });
});

// ============ START ============
app.listen(PORT, '0.0.0.0', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 BRONX AI IMAGE API');
    console.log(`🚀 Running on port ${PORT}`);
    console.log('🤖 Powered by Pollinations.ai');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
