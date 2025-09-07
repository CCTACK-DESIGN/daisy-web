#!/bin/bash

# 字体测试和网站服务器启动脚本

echo "🚀 启动网站服务器..."
echo "📁 当前目录: $(pwd)"

# 检查字体文件
echo "🔤 检查字体文件..."
for font in "英雄体（主题）.ttf" "手写（潇洒）.TTF" "手写（锋利）.ttf"; do
    if [ -f "$font" ]; then
        echo "  ✓ $font 存在"
    else
        echo "  ✗ $font 不存在"
    fi
done

# 停止现有服务器
echo "🛑 停止现有服务器..."
pkill -f "python3 -m http.server" 2>/dev/null || true

# 启动服务器
echo "🌐 启动HTTP服务器在端口8000..."
python3 -m http.server 8000 &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 测试服务器
echo "🧪 测试服务器连接..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/gallery.html | grep -q "200"; then
    echo "  ✓ 服务器运行正常"
    echo ""
    echo "🎉 网站已启动！"
    echo "📖 请在浏览器中访问："
    echo "   主页: http://localhost:8000/index.html"
    echo "   照片: http://localhost:8000/gallery.html"
    echo "   字体测试: http://localhost:8000/font-test.html"
    echo ""
    echo "💡 提示："
    echo "   - 打开浏览器开发者工具(F12)查看字体加载状态"
    echo "   - 按 Ctrl+C 停止服务器"
    echo ""
else
    echo "  ✗ 服务器启动失败"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# 等待用户中断
wait $SERVER_PID
