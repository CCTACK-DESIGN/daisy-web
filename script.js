// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 视频背景处理
    const heroVideo = document.querySelector('.hero-video');
    const videoBackground = document.querySelector('.video-background');
    const audioToggle = document.getElementById('audioToggle');
    
    if (heroVideo) {
        // 确保视频静音并自动播放
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        
        // 视频加载完成后的处理
        heroVideo.addEventListener('loadeddata', function() {
            console.log('视频加载完成');
            // 添加loaded类来触发淡入效果
            heroVideo.classList.add('loaded');
            heroVideo.play().catch(function(error) {
                console.log('视频自动播放失败:', error);
                // 如果自动播放失败，显示回退背景
                if (videoBackground) {
                    videoBackground.style.display = 'none';
                }
            });
        });
        
        // 视频可以播放时的处理
        heroVideo.addEventListener('canplay', function() {
            console.log('视频可以播放');
            heroVideo.classList.add('loaded');
        });
        
        // 视频加载错误处理
        heroVideo.addEventListener('error', function(e) {
            console.log('视频加载错误:', e);
            if (videoBackground) {
                videoBackground.style.display = 'none';
            }
        });
        
        // 视频播放错误处理
        heroVideo.addEventListener('stalled', function() {
            console.log('视频播放停滞');
        });
        
        // 尝试播放视频
        heroVideo.play().catch(function(error) {
            console.log('初始播放尝试失败:', error);
        });
        
        // 窗口大小改变时重新调整视频尺寸
        window.addEventListener('resize', function() {
            adjustVideoSize();
        });
        
        // 调整视频尺寸函数
        function adjustVideoSize() {
            if (heroVideo && heroVideo.videoWidth && heroVideo.videoHeight) {
                // 重置样式，让CSS的object-fit: cover 来处理
                heroVideo.style.width = '';
                heroVideo.style.height = '';
                
                console.log('视频尺寸:', heroVideo.videoWidth + 'x' + heroVideo.videoHeight);
                console.log('容器尺寸:', heroVideo.parentElement.offsetWidth + 'x' + heroVideo.parentElement.offsetHeight);
            }
        }
        
        // 视频元数据加载完成后调整尺寸
        heroVideo.addEventListener('loadedmetadata', function() {
            adjustVideoSize();
        });
    }
    
    // 音频控制功能
    if (audioToggle && heroVideo) {
        audioToggle.addEventListener('click', function() {
            if (heroVideo.muted) {
                // 开启声音
                heroVideo.muted = false;
                audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                audioToggle.classList.add('unmuted');
                audioToggle.title = '点击关闭声音';
                showNotification('视频声音已开启', 'success');
            } else {
                // 关闭声音
                heroVideo.muted = true;
                audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audioToggle.classList.remove('unmuted');
                audioToggle.title = '点击开启声音';
                showNotification('视频声音已关闭', 'info');
            }
        });
        
        // 键盘快捷键：按M键切换静音
        document.addEventListener('keydown', function(e) {
            if (e.key === 'm' || e.key === 'M') {
                audioToggle.click();
            }
        });
    }
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(255, 255, 255, 0.15)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 255, 255, 0.1)';
        }
    });

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 平滑滚动到指定部分
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 音乐分类筛选功能
    const categoryBtns = document.querySelectorAll('.category-btn');
    const musicItems = document.querySelectorAll('.music-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            musicItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // 添加淡入动画
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 音乐播放功能（模拟）
    const musicCovers = document.querySelectorAll('.music-cover');
    
    musicCovers.forEach(cover => {
        cover.addEventListener('click', function() {
            const playIcon = this.querySelector('i');
            const musicItem = this.closest('.music-item');
            const musicTitle = musicItem.querySelector('h4').textContent;
            
            // 切换播放图标
            if (playIcon.classList.contains('fa-play-circle')) {
                playIcon.classList.remove('fa-play-circle');
                playIcon.classList.add('fa-pause-circle');
                
                // 显示播放状态
                showNotification(`正在播放: ${musicTitle}`, 'success');
                
                // 添加播放动画
                this.style.animation = 'pulse 2s infinite';
            } else {
                playIcon.classList.remove('fa-pause-circle');
                playIcon.classList.add('fa-play-circle');
                
                // 显示暂停状态
                showNotification(`已暂停: ${musicTitle}`, 'info');
                
                // 移除播放动画
                this.style.animation = 'none';
            }
        });
    });

    // 演出卡片悬停效果增强
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 社交链接点击效果
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('weibo') ? '微博' :
                           this.classList.contains('wechat') ? '微信' :
                           this.classList.contains('douyin') ? '抖音' : 'B站';
            
            showNotification(`即将跳转到${platform}，请稍候...`, 'info');
            
            // 模拟跳转延迟
            setTimeout(() => {
                showNotification(`由于这是演示网站，无法实际跳转。在实际使用中，这里会跳转到真实的${platform}页面。`, 'warning');
            }, 1500);
        });
    });

    // 通知系统
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-times-circle';
            default: return 'fa-info-circle';
        }
    }
    
    function getNotificationColor(type) {
        switch(type) {
            case 'success': return '#27ae60';
            case 'warning': return '#f39c12';
            case 'error': return '#e74c3c';
            default: return '#3498db';
        }
    }

    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.about-content, .event-card, .music-item, .social-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: auto;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);

    // 页面加载完成后的欢迎消息
    setTimeout(() => {
        showNotification('欢迎来到我的个人网站！', 'success');
    }, 1000);

    console.log('个人介绍网站已加载完成！');
});
