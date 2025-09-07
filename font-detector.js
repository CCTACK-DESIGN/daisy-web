// 字体检测和备用方案脚本
(function() {
    'use strict';
    
    // 字体检测函数
    function detectFont(fontFamily) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const testText = '测试字体ABCabc123';
        
        // 使用默认字体测量文本
        context.font = '72px monospace';
        const defaultWidth = context.measureText(testText).width;
        
        // 使用目标字体测量文本
        context.font = `72px ${fontFamily}, monospace`;
        const targetWidth = context.measureText(testText).width;
        
        // 如果宽度不同，说明字体加载成功
        return defaultWidth !== targetWidth;
    }
    
    // 应用备用字体的函数
    function applyFallbackFonts() {
        console.log('应用备用字体方案...');
        
        // 为英雄体元素应用备用字体
        const heroElements = document.querySelectorAll('.hero-name, .main-title, .music-section .section-title');
        heroElements.forEach(el => {
            el.style.fontFamily = "'PingFang SC Heavy', 'Helvetica Neue', 'Arial Black', '黑体', sans-serif";
            el.style.fontWeight = '900';
            el.classList.add('fallback-hero');
        });
        
        // 为手写体元素应用备用字体
        const handwritingElements = document.querySelectorAll('.hero-subtitle, .gallery-title, .nav-logo h2, .performance-link, .cloud-link, .cloud-title');
        handwritingElements.forEach(el => {
            el.style.fontFamily = "'Kaiti SC', 'STKaiti', '楷体', serif";
            el.style.fontStyle = 'italic';
            el.classList.add('fallback-handwriting');
        });
    }
    
    // 检测所有字体
    function checkAllFonts() {
        const fonts = [
            { name: 'VideoTheme', displayName: '英雄体（主题）', usage: '主标题' },
            { name: 'HandwritingSharp', displayName: '手写（锋利）', usage: '导航和页面标题' },
            { name: 'HandwritingStyle', displayName: '手写（潇洒）', usage: '副标题' }
        ];
        
        let loadedFonts = 0;
        let totalFonts = fonts.length;
        let fontStatus = [];
        
        console.log('=== 字体加载状态检测 ===');
        
        fonts.forEach(font => {
            const isLoaded = detectFont(font.name);
            if (isLoaded) {
                console.log(`✓ ${font.displayName} 字体加载成功 - 用于: ${font.usage}`);
                loadedFonts++;
                fontStatus.push(`✓ ${font.displayName}: 成功`);
            } else {
                console.log(`✗ ${font.displayName} 字体加载失败 - 用于: ${font.usage}`);
                fontStatus.push(`✗ ${font.displayName}: 失败`);
            }
        });
        
        // 显示详细状态
        console.log(`字体加载完成：${loadedFonts}/${totalFonts} 个字体可用`);
        console.log('字体映射关系：');
        console.log('- 主标题(.hero-name, .section-title): 英雄体（主题）');
        console.log('- 导航栏(.nav-logo h2): 手写（锋利）');
        console.log('- 副标题(.hero-subtitle): 手写（潇洒）');
        
        // 如果有字体加载失败，显示提示
        if (loadedFonts < totalFonts) {
            console.warn('部分字体未能加载，可能的原因：');
            console.warn('1. 字体文件路径不正确');
            console.warn('2. 字体文件损坏');
            console.warn('3. 浏览器安全限制（建议使用HTTP服务器访问）');
            
            // 显示用户提示
            if (typeof window !== 'undefined') {
                const notice = document.createElement('div');
                notice.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 14px;
                    max-width: 350px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                `;
                notice.innerHTML = `
                    <strong>🔤 字体加载状态</strong><br>
                    <div style="margin: 10px 0; font-size: 12px;">
                        ${fontStatus.join('<br>')}
                    </div>
                    <small style="color: #ccc;">
                        ${loadedFonts}/${totalFonts} 个自定义字体可用<br>
                        未加载的字体将使用系统备用字体
                    </small>
                `;
                document.body.appendChild(notice);
                
                // 点击关闭
                notice.addEventListener('click', () => {
                    if (notice.parentNode) {
                        notice.parentNode.removeChild(notice);
                    }
                });
                
                // 8秒后自动隐藏提示
                setTimeout(() => {
                    if (notice.parentNode) {
                        notice.parentNode.removeChild(notice);
                    }
                }, 8000);
            }
        } else {
            console.log('🎉 所有自定义字体都已成功加载！');
        }
    }
    
    // 页面加载完成后检测字体
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(checkAllFonts, 1000); // 延迟1秒确保字体有时间加载
        });
    } else {
        setTimeout(checkAllFonts, 1000);
    }
    
    // 字体API检测（如果浏览器支持）
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() {
            console.log('Font API: 所有字体加载完成');
            setTimeout(checkAllFonts, 500);
        });
    }
    
})();
