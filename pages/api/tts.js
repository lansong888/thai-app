export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: "Method not allowed" });
    
    const text = req.query.text || "สวัสดี";
    
    // B 计划：直接调用免 Key 的公开高清晰泰语语音接口（基于公共翻译 CDN 节点）
    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=th&client=tw-ob`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error("获取语音失败");

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 直接将高清晰泰语 MP3 音频流返回给你的前端网页
        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length
        });
        res.end(buffer);
    } catch (err) {
        res.status(500).json({ error: "公共语音合成请求失败: " + err.toString() });
    }
}