#!/usr/bin/env python3
"""
局域网网站服务器启动脚本
支持局域网内其他设备访问
"""

import os
import sys
import subprocess
import socket
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

def get_local_ip():
    """获取本机局域网IP地址"""
    try:
        # 创建一个UDP socket连接到外部地址来获取本机IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"

def check_fonts():
    """检查字体文件是否存在"""
    fonts = [
        "英雄体（主题）.ttf",
        "手写（潇洒）.TTF", 
        "手写（锋利）.ttf"
    ]
    
    print("🔤 检查字体文件...")
    for font in fonts:
        if os.path.exists(font):
            print(f"  ✓ {font} 存在")
        else:
            print(f"  ✗ {font} 不存在")

def check_files():
    """检查关键文件是否存在"""
    files = ["index.html", "gallery.html", "styles.css"]
    print("📄 检查网站文件...")
    for file in files:
        if os.path.exists(file):
            print(f"  ✓ {file} 存在")
        else:
            print(f"  ✗ {file} 不存在")

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器，添加CORS支持"""
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f"[{self.address_string()}] {format % args}")

def main():
    # 确保在正确的目录中
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🚀 启动局域网网站服务器...")
    print(f"📁 工作目录: {os.getcwd()}")
    
    # 检查文件
    check_files()
    check_fonts()
    
    # 获取IP地址
    local_ip = get_local_ip()
    port = 8000
    
    # 停止现有服务器
    try:
        subprocess.run(["pkill", "-f", "python3 -m http.server"], 
                      capture_output=True, check=False)
        time.sleep(1)
    except:
        pass
    
    print(f"🌐 启动HTTP服务器...")
    print(f"   IP地址: {local_ip}")
    print(f"   端口: {port}")
    
    try:
        # 创建HTTP服务器
        server = HTTPServer(('0.0.0.0', port), CustomHTTPRequestHandler)
        
        print("\n🎉 服务器启动成功！")
        print("\n📱 访问网址:")
        print(f"   本机访问: http://localhost:{port}")
        print(f"   局域网访问: http://{local_ip}:{port}")
        print("\n📖 页面链接:")
        print(f"   主页: http://{local_ip}:{port}/index.html")
        print(f"   照片展示: http://{local_ip}:{port}/gallery.html")
        print(f"   字体测试: http://{local_ip}:{port}/font-test.html")
        
        print("\n💡 提示:")
        print("   - 确保设备连接在同一个WiFi网络")
        print("   - 在手机/平板上打开浏览器访问上述网址")
        print("   - 按 Ctrl+C 停止服务器")
        print("   - 打开浏览器开发者工具查看字体加载状态")
        print("\n🔄 服务器日志:")
        
        # 启动服务器
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n\n🛑 服务器已停止")
        server.server_close()
    except Exception as e:
        print(f"\n❌ 服务器启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
