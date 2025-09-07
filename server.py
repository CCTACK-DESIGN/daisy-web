#!/usr/bin/env python3
"""
简单的局域网HTTP服务器
"""
import os
import sys
import http.server
import socketserver
import socket

# 强制切换到脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

def get_local_ip():
    """获取本机IP地址"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except:
        return "127.0.0.1"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    port = 8080
    local_ip = get_local_ip()
    
    print(f"🚀 启动HTTP服务器...")
    print(f"📁 工作目录: {os.getcwd()}")
    print(f"🌐 本地访问: http://localhost:{port}")
    print(f"📱 局域网访问: http://{local_ip}:{port}")
    print(f"")
    print(f"📖 页面链接:")
    print(f"   主页: http://{local_ip}:{port}/index.html")
    print(f"   照片: http://{local_ip}:{port}/gallery.html")
    print(f"   字体测试: http://{local_ip}:{port}/font-test.html")
    print(f"")
    print(f"💡 按 Ctrl+C 停止服务器")
    print(f"" + "="*50)
    
    try:
        with socketserver.TCPServer(("0.0.0.0", port), CustomHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 服务器已停止")
    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == "__main__":
    main()
