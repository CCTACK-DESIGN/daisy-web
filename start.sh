#!/bin/bash
echo "🚀 启动网站服务器..."
cd "/Users/ljw/Desktop/网站代码/gehan-music-web"
echo "📁 当前目录: $(pwd)"
echo "📄 检查文件:"
ls -la *.html | head -3

echo ""
echo "🌐 启动HTTP服务器在端口9000..."
python3 -m http.server 9000 --bind 0.0.0.0 &
SERVER_PID=$!
sleep 3

echo "📱 访问地址:"
echo "   本地: http://localhost:9000/gallery.html"
echo "   局域网: http://192.168.2.16:9000/gallery.html"
echo ""
echo "💡 在其他设备的浏览器中输入上述网址"
echo "   按 Ctrl+C 停止服务器"

wait $SERVER_PID
