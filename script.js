// 强制字体加载函数 - 解决锚点URL问题
function forceLoadFonts() {
    console.log('强制加载字体...');
    
    // 检查字体是否已加载
    const checkFont = (fontFamily, testText = '测试Aa') => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = `16px monospace`;
        const baselineWidth = context.measureText(testText).width;
        context.font = `16px ${fontFamily}, monospace`;
        const testWidth = context.measureText(testText).width;
        return baselineWidth !== testWidth;
    };
    
    // 强制触发字体加载
    const fonts = ['VideoTheme', 'HandwritingSharp', 'HandwritingStyle'];
    fonts.forEach(font => {
        if (!checkFont(font)) {
            console.log(`字体 ${font} 未加载，强制触发...`);
            // 创建临时元素强制加载字体
            const tempElement = document.createElement('div');
            tempElement.style.fontFamily = font;
            tempElement.style.position = 'absolute';
            tempElement.style.left = '-9999px';
            tempElement.style.fontSize = '1px';
            tempElement.textContent = '字体加载测试';
            document.body.appendChild(tempElement);
            
            // 强制重排和重绘
            tempElement.offsetHeight;
            
            setTimeout(() => {
                document.body.removeChild(tempElement);
            }, 100);
        } else {
            console.log(`字体 ${font} 已加载`);
        }
    });
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 立即强制加载字体
    forceLoadFonts();
    
    // 如果是锚点URL，延迟再次强制加载
    if (window.location.hash) {
        console.log('检测到锚点URL，延迟强制加载字体');
        setTimeout(forceLoadFonts, 100);
        setTimeout(forceLoadFonts, 500);
    }
    // 视频背景处理
    const heroVideo = document.querySelector('.hero-video');
    const videoBackground = document.querySelector('.video-background');
    const audioToggle = document.getElementById('audioToggle');
    
    // 视频背景已更新为阿里云OSS链接
    
    if (heroVideo) {
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 强制设置视频属性
        heroVideo.playsInline = true;
        heroVideo.currentTime = 0;
        heroVideo.autoplay = true;
        heroVideo.loop = true;
        
        // 移动端优化：立即加载策略
        if (isMobile) {
            heroVideo.muted = false; // 移动端默认有声播放
            heroVideo.volume = 1.0; // 设置最大音量
            heroVideo.preload = 'auto'; // 立即开始加载
            
            // 显示加载指示器
            const loadingIndicator = document.getElementById('videoLoadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('show');
            }
            
            console.log('移动端立即开始加载视频...');
            
            // 监听加载进度
            heroVideo.addEventListener('loadstart', () => {
                console.log('视频开始加载');
            });
            
            heroVideo.addEventListener('progress', () => {
                if (heroVideo.buffered.length > 0) {
                    const bufferedEnd = heroVideo.buffered.end(heroVideo.buffered.length - 1);
                    const duration = heroVideo.duration;
                    if (duration > 0) {
                        const progress = (bufferedEnd / duration) * 100;
                        console.log(`视频加载进度: ${Math.round(progress)}%`);
                        
                        // 更新加载文本显示进度
                        const loadingText = document.querySelector('.loading-text');
                        if (loadingText) {
                            loadingText.textContent = `视频加载中... ${Math.round(progress)}%`;
                        }
                    }
                }
            });
            
            heroVideo.addEventListener('canplay', () => {
                console.log('视频可以开始播放');
                // 隐藏加载指示器
                if (loadingIndicator) {
                    loadingIndicator.classList.remove('show');
                }
            });
            
            // 立即尝试有声播放
            heroVideo.play().then(() => {
                console.log('移动端有声播放成功');
                updateAudioButtonState();
                // 确保隐藏加载指示器
                if (loadingIndicator) {
                    loadingIndicator.classList.remove('show');
                }
            }).catch(error => {
                console.log('移动端有声播放失败，尝试静音播放:', error);
                // 如果有声播放失败，尝试静音播放
                heroVideo.muted = true;
                heroVideo.play().then(() => {
                    console.log('移动端静音播放成功');
                    updateAudioButtonState();
                    if (loadingIndicator) {
                        loadingIndicator.classList.remove('show');
                    }
                }).catch(e => {
                    console.log('移动端静音播放也失败:', e);
                    if (loadingIndicator) {
                        loadingIndicator.classList.remove('show');
                    }
                });
            });
        } else {
            // 桌面端默认有声音播放
            heroVideo.muted = false;
            heroVideo.volume = 1.0;
            
            // 积极的有声音播放策略
            function attemptPlayWithSound() {
                heroVideo.muted = false;
                heroVideo.volume = 1.0;
                return heroVideo.play().then(() => {
                    console.log('桌面端有声音播放成功');
                    updateAudioButtonState();
                    return true;
                }).catch(error => {
                    console.log('桌面端有声音播放失败:', error);
                    return false;
                });
            }
            
            // 立即尝试播放
            attemptPlayWithSound().then(success => {
                if (!success) {
                    // 多次重试有声播放
                    let retryCount = 0;
                    const retryPlay = () => {
                        if (retryCount < 5) {
                            retryCount++;
                            setTimeout(() => {
                                attemptPlayWithSound().then(success => {
                                    if (!success) {
                                        retryPlay();
                                    }
                                });
                            }, 500 * retryCount); // 逐渐增加重试间隔
                        } else {
                            // 最后尝试静音播放作为后备
                            heroVideo.muted = true;
                            heroVideo.play().then(() => {
                                console.log('桌面端静音播放成功，等待用户交互启用声音');
                                updateAudioButtonState();
                            }).catch(e => {
                                console.log('桌面端静音播放也失败:', e);
                                updateAudioButtonState();
                            });
                        }
                    };
                    retryPlay();
                }
            });
        }
        
        // 视频加载完成后的处理
        heroVideo.addEventListener('loadeddata', function() {
            console.log('视频加载完成');
            // 添加loaded类来触发淡入效果
            heroVideo.classList.add('loaded');
            // 确保视频可见
            heroVideo.style.opacity = '1';
            
            // 移动端立即尝试播放
            if (isMobile) {
                heroVideo.muted = true; // 确保静音
                heroVideo.play().then(() => {
                    console.log('视频加载完成后移动端播放成功');
                }).catch(error => {
                    console.log('视频加载完成后移动端播放失败:', error);
                    // 即使播放失败，也保持视频可见（静态第一帧）
                    heroVideo.style.opacity = '1';
                });
            } else {
                heroVideo.play().catch(function(error) {
                    console.log('视频自动播放失败:', error);
                    // 即使播放失败，也保持视频可见（静态第一帧）
                    heroVideo.style.opacity = '1';
                });
            }
        });
        
        // 视频可以播放时的处理
        heroVideo.addEventListener('canplay', function() {
            console.log('视频可以播放');
            heroVideo.classList.add('loaded');
            
            // 移动端在canplay时也尝试播放
            if (isMobile) {
                heroVideo.muted = true;
                heroVideo.play().then(() => {
                    console.log('canplay事件触发后移动端播放成功');
                }).catch(error => {
                    console.log('canplay事件触发后移动端播放失败:', error);
                });
            }
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
    
    // 全局的音频按钮状态更新函数
    function updateAudioButtonState() {
        if (audioToggle && heroVideo) {
            if (heroVideo.muted || heroVideo.volume === 0) {
                audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audioToggle.classList.remove('unmuted');
                audioToggle.title = '点击开启声音';
            } else {
                audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                audioToggle.classList.add('unmuted');
                audioToggle.title = '点击关闭声音';
            }
        }
    }

    // 音频控制功能 - 根据实际状态初始化
    if (audioToggle && heroVideo) {
        
        // 初始化按钮状态
        updateAudioButtonState();
        
        audioToggle.addEventListener('click', function() {
            if (heroVideo.muted) {
                // 开启声音
                heroVideo.muted = false;
                // 强制播放以确保声音生效
                heroVideo.play().then(() => {
                    console.log('点击开启声音成功');
                    updateAudioButtonState();
                }).catch(e => {
                    console.log('点击开启声音失败:', e);
                    // 即使播放失败，也更新按钮状态
                    updateAudioButtonState();
                });
            } else {
                // 关闭声音
                heroVideo.muted = true;
                updateAudioButtonState();
            }
        });
        
        // 键盘快捷键：按M键切换静音
        document.addEventListener('keydown', function(e) {
            if (e.key === 'm' || e.key === 'M') {
                audioToggle.click();
            }
        });
        
        // 定期检查音频状态并更新按钮
        setInterval(() => {
            updateAudioButtonState();
        }, 1000);
    }
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.5)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.3)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        }
        
        // 检测个人介绍部分是否进入视口，触发动画
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection && !aboutSection.classList.contains('animated')) {
            const rect = aboutSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 当部分进入视口时触发动画
            if (rect.top < windowHeight * 0.8) {
                aboutSection.classList.add('animated');
                console.log('个人介绍部分动画已触发');
            }
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
            const href = this.getAttribute('href');
            
            // 检查是否是跨页面的锚点链接
            if (href.includes('index.html#') && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                // 允许跨页面跳转，不阻止默认行为
                return;
            }
            
            // 检查是否是当前页面的锚点链接
            if (href.startsWith('#')) {
            e.preventDefault();
                const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                }
            }
        });
    });

    // 下拉菜单功能
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdownMenu = item.querySelector('.dropdown-menu');
        
        // 鼠标悬停显示下拉菜单
        item.addEventListener('mouseenter', function() {
            if (dropdownMenu) {
                dropdownMenu.style.display = 'block';
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });
        
        // 鼠标离开隐藏下拉菜单
        item.addEventListener('mouseleave', function() {
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    dropdownMenu.style.display = 'none';
                }, 200);
            }
        });
        
        // 点击链接时，如果是跨页面链接，允许跳转
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('index.html#') && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                // 允许跳转到主网页的对应部分
                return;
            }
        });
    });

    // 音乐视频播放控制功能
    const musicVideos = document.querySelectorAll('.music-video');
    
    musicVideos.forEach(video => {
        // 当音乐视频开始播放时，静音首页背景视频
        video.addEventListener('play', function() {
            if (heroVideo) {
                heroVideo.muted = true;
                // 更新音频按钮状态
                const audioToggle = document.getElementById('audioToggle');
                if (audioToggle) {
                    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    audioToggle.title = '点击开启声音';
                }
            }
        });
        
        // 当音乐视频暂停时，恢复首页背景视频的音频状态
        video.addEventListener('pause', function() {
            if (heroVideo) {
                // 检查是否有其他音乐视频正在播放
                const anyVideoPlaying = Array.from(musicVideos).some(v => !v.paused);
                if (!anyVideoPlaying) {
                    // 恢复之前的音频状态
                    const audioToggle = document.getElementById('audioToggle');
                    if (audioToggle) {
                        const isMuted = audioToggle.innerHTML.includes('fa-volume-mute');
                        heroVideo.muted = isMuted;
                    }
                }
            }
        });
        
        // 当音乐视频结束时，恢复首页背景视频的音频状态
        video.addEventListener('ended', function() {
            if (heroVideo) {
                // 检查是否有其他音乐视频正在播放
                const anyVideoPlaying = Array.from(musicVideos).some(v => !v.paused);
                if (!anyVideoPlaying) {
                    // 恢复之前的音频状态
                    const audioToggle = document.getElementById('audioToggle');
                    if (audioToggle) {
                        const isMuted = audioToggle.innerHTML.includes('fa-volume-mute');
                        heroVideo.muted = isMuted;
                    }
                }
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

                
                // 添加播放动画
                this.style.animation = 'pulse 2s infinite';
            } else {
                playIcon.classList.remove('fa-pause-circle');
                playIcon.classList.add('fa-play-circle');
                
                // 显示暂停状态

                
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
            

            
            // 模拟跳转延迟
            setTimeout(() => {

            }, 1500);
        });
    });



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

    // 清理任何遗留的欢迎通知元素（若浏览器缓存曾插入过）
    setTimeout(() => {
        const oldNotices = document.querySelectorAll('[class*="notification"]');
        oldNotices.forEach(n => n.remove());
    }, 100);

    // 打字机效果
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        // 页面加载后立即开始动画
        heroName.classList.add('typewriter');
    }

    // 诗句滑入动画
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        // 页面加载后触发动画
        setTimeout(() => {
            heroSubtitle.classList.add('animate');
        }, 100);
    }

    // 向下箭头
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (scrollArrow) {
        // 4秒后显示向下箭头
        setTimeout(() => {
            scrollArrow.classList.add('show');
            console.log('⬇️ 向下箭头显示');
        }, 4000);
        
        // 监听滚动，当离开首页时隐藏箭头
        window.addEventListener('scroll', () => {
            const heroSection = document.querySelector('.hero');
            const heroRect = heroSection.getBoundingClientRect();
            
            if (heroRect.bottom < window.innerHeight * 0.5) {
                scrollArrow.classList.remove('show');
            } else if (heroRect.bottom > window.innerHeight * 0.5) {
                // 如果已经显示过，回到首页时重新显示
                scrollArrow.classList.add('show');
            }
        });
        
        // 箭头点击事件
        scrollArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 页面可见性变化时重新尝试播放声音
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && heroVideo) {
            setTimeout(() => {
                heroVideo.muted = false;
                heroVideo.play().then(() => {
                    console.log('页面重新可见时播放成功');
                    if (audioToggle) {
                        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                        audioToggle.classList.add('unmuted');
                        audioToggle.title = '点击关闭声音';
                    }
                }).catch(e => console.log('页面重新可见时播放失败:', e));
            }, 100);
        }
    });

    // 添加用户交互后立即启用声音的机制 - 更积极的策略
    let userInteracted = false;
    let soundEnableAttempts = 0;
    
    function enableAudioAfterInteraction() {
        if (!userInteracted && heroVideo && soundEnableAttempts < 3) {
            userInteracted = true;
            soundEnableAttempts++;
            console.log(`用户交互，立即启用声音 (尝试 ${soundEnableAttempts})`);
            
            heroVideo.muted = false;
            heroVideo.volume = 1.0;
            
            // 强制重新播放以启用声音
            const currentTime = heroVideo.currentTime;
            heroVideo.currentTime = currentTime;
            
            heroVideo.play().then(() => {
                console.log('用户交互后有声音播放成功');
                updateAudioButtonState();
            }).catch(e => {
                console.log('用户交互后播放失败:', e);
                // 如果失败，重置标志以便下次尝试
                userInteracted = false;
                updateAudioButtonState();
            });
        }
    }
    
    // 监听各种用户交互事件 - 更积极的监听
    document.addEventListener('click', enableAudioAfterInteraction);
    document.addEventListener('keydown', enableAudioAfterInteraction);
    document.addEventListener('touchstart', enableAudioAfterInteraction);
    document.addEventListener('touchend', enableAudioAfterInteraction);
    document.addEventListener('scroll', enableAudioAfterInteraction);
    document.addEventListener('mousemove', enableAudioAfterInteraction);
    document.addEventListener('mousedown', enableAudioAfterInteraction);
    
    // 页面获得焦点时也尝试启用声音
    window.addEventListener('focus', enableAudioAfterInteraction);

    // 个人介绍部分动画触发
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        // 确保初始状态所有元素都是隐藏的
        const animatedElements = aboutSection.querySelectorAll('.rainbow-bg-image, .identity-text, .main-title, .bio-line');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
        });
        
        const observerOptions = {
            threshold: 0.2, // 当20%的区域可见时触发
            rootMargin: '0px 0px -100px 0px' // 提前100px触发，确保用户看到动画开始
        };
        
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                    console.log('✅ 触发个人介绍部分动画 - 滚动到页面20%可见');
                    entry.target.classList.add('animate');
                    
                    // 设置云层观察器和滚动方向检测
                    setTimeout(() => {
                        const cloudSection = document.querySelector('.cloud-transition-section');
                        if (cloudSection) {
                            console.log('🔍 设置云层动画观察器');
                            
                            let lastScrollY = window.scrollY;
                            let isAnimated = false;
                            
                            const cloudObserver = new IntersectionObserver((entries) => {
                                entries.forEach(entry => {
                                    const currentScrollY = window.scrollY;
                                    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                                    
                                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                                        if (scrollDirection === 'down' && !isAnimated) {
                                            console.log('✅ 向下滚动 - 触发拨云见日动画');
                                            entry.target.classList.add('animated');
                                            entry.target.classList.remove('scroll-up');
                                            isAnimated = true;
                                        }
                                    } else if (entry.intersectionRatio < 0.3 && isAnimated) {
                                        if (scrollDirection === 'up') {
                                            console.log('⬆️ 向上滚动 - 触发撤回动画');
                                            entry.target.classList.remove('animated');
                                            entry.target.classList.add('scroll-up');
                                            isAnimated = false;
                                        }
                                    }
                                    
                                    lastScrollY = currentScrollY;
                                });
                            }, {
                                threshold: [0.3, 0.6],
                                rootMargin: '0px 0px -50px 0px'
                            });
                            
                            cloudObserver.observe(cloudSection);
                        }
    }, 1000);
                    
                    // 添加增强的视差效果
                    const addParallaxEffect = () => {
                        const cloudContainer = document.querySelector('.cloud-container');
                        let ticking = false;
                        
                        const handleScroll = () => {
                            if (!ticking) {
                                requestAnimationFrame(() => {
                                    const scrollY = window.scrollY;
                                    const aboutSection = document.querySelector('.about-section');
                                    
                                    if (aboutSection && cloudContainer) {
                                        const sectionTop = aboutSection.offsetTop;
                                        const sectionHeight = aboutSection.offsetHeight;
                                        
                                        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
                                            const progress = (scrollY - sectionTop) / sectionHeight;
                                            const parallaxOffset = progress * 225; // 在150基础上增加1.5倍 (150 * 1.5 = 225)
                                            
                                            // 添加更强的缓动效果
                                            const easedOffset = parallaxOffset * (3.0 - progress * 2.0); // 进一步增强缓出效果
                                            
                                            // 为云层容器设置视差变量
                                            cloudContainer.style.setProperty('--parallax-offset', `${easedOffset}px`);
                                            
                                            // 添加轻微的旋转视差效果
                                            const rotationOffset = progress * 4.5; // 在3度基础上增加1.5倍 (3 * 1.5 = 4.5)
                                            cloudContainer.style.setProperty('--rotation-offset', `${rotationOffset}deg`);
                                            
                                            cloudContainer.classList.add('cloud-parallax');
                                        }
                                    }
                                    ticking = false;
                                });
                                ticking = true;
                            }
                        };
                        
                        window.addEventListener('scroll', handleScroll, { passive: true });
                    };
                    
                    setTimeout(addParallaxEffect, 4000); // 延迟到动画完成后
                    
                    // 一次性触发：动画触发后立即停止观察，避免重复
                    aboutObserver.unobserve(entry.target);
                    console.log('🛑 停止观察个人介绍部分，避免重复触发');
                }
            });
        }, observerOptions);
        
        aboutObserver.observe(aboutSection);
        console.log('👀 开始观察个人介绍部分，等待滚动触发动画');
    }

    // 字体加载检测和修复 - 解决锚点URL字体显示问题
    function checkAndFixFonts() {
        const testElements = [
            { selector: '.hero-name', font: 'VideoTheme' },
            { selector: '.hero-subtitle', font: 'HandwritingStyle' },
            { selector: '.nav-logo h2', font: 'HandwritingSharp' }
        ];
        
        testElements.forEach(({ selector, font }) => {
            const element = document.querySelector(selector);
            if (element) {
                // 强制重新应用字体
                element.style.fontFamily = '';
                setTimeout(() => {
                    element.style.fontFamily = `'${font}', sans-serif`;
                }, 100);
                
                // 检查字体是否正确加载
                setTimeout(() => {
                    const computedStyle = window.getComputedStyle(element);
                    const fontFamily = computedStyle.fontFamily;
                    console.log(`${selector} 字体检测:`, fontFamily);
                    
                    if (!fontFamily.includes(font)) {
                        console.warn(`${font} 字体可能未正确加载，尝试修复...`);
                        // 强制重新加载字体
                        element.style.fontFamily = `'${font}', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`;
                    }
                }, 500);
            }
        });
    }
    
    // 页面加载完成后检查字体
    checkAndFixFonts();
    
    // 如果是锚点URL，延迟再次检查
    if (window.location.hash) {
        setTimeout(checkAndFixFonts, 1000);
        setTimeout(checkAndFixFonts, 2000);
    }
    
    // 字体加载完成事件监听
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log('所有字体加载完成');
            checkAndFixFonts();
        });
        
        // 监听单个字体加载
        ['VideoTheme', 'HandwritingStyle', 'HandwritingSharp'].forEach(fontName => {
            document.fonts.load(`16px ${fontName}`).then(() => {
                console.log(`${fontName} 字体加载完成`);
            }).catch(error => {
                console.error(`${fontName} 字体加载失败:`, error);
            });
        });
    }

    console.log('个人介绍网站已加载完成！');
    
    // 云层动画现在可以自动工作，无需测试按钮
    console.log('✅ 云层动画系统已就绪，向下滚动到云层区域即可自动触发');
    
    // 最终字体检查 - 确保所有字体都已正确加载
    setTimeout(() => {
        forceLoadFonts();
        console.log('执行最终字体检查');
    }, 1000);
    
    // 设置云层观察器和滚动方向检测
    setTimeout(() => {
        const cloudSection = document.querySelector('.cloud-transition-section');
        
        if (cloudSection) {
            let isAnimated = false;
            let lastScrollY = window.scrollY;
            
            // 创建云层观察器
            const cloudObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    // 当云层区域60%可见时触发动画
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6 && !isAnimated) {
                        cloudSection.classList.add('animated');
                        isAnimated = true;
                    }
                });
            }, {
                threshold: [0.1, 0.2, 0.3, 0.5, 0.7, 0.9],
                rootMargin: '0px 0px -100px 0px'
            });
            
            cloudObserver.observe(cloudSection);
            
            // 简化的滚动方向检测
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                lastScrollY = currentScrollY;
                
                const rect = cloudSection.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                const isVisible = rect.top < viewHeight && rect.bottom > 0;
                const intersectionRatio = Math.min(1, Math.max(0, (viewHeight - rect.top) / viewHeight));
                
                // 向下滚动：触发动画
                if (scrollDirection === 'down' && isVisible && intersectionRatio > 0.2 && !isAnimated) {
                    cloudSection.classList.add('animated');
                    isAnimated = true;
                }
                
                // 向上滚动：移除动画
                if (scrollDirection === 'up' && isAnimated) {
                    const exitRatio = Math.min(1, Math.max(0, (viewHeight - rect.bottom) / viewHeight));
                    if (exitRatio > 0.5) {
                        cloudSection.classList.remove('animated');
                        isAnimated = false;
                    }
                }
            });
            
        } else {
            console.log('❌ 未找到云层元素，尝试其他选择器...');
            
            // 尝试其他可能的选择器
            const alternativeSelectors = [
                '.cloud-container',
                '[class*="cloud"]',
                '.performance-preview'
            ];
            
            alternativeSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`✅ 找到替代元素 ${selector}:`, element);
                }
            });
        }
    }, 1000);
});

// 监听URL哈希变化，重新加载字体
window.addEventListener('hashchange', function() {
    console.log('URL哈希变化，重新加载字体');
    setTimeout(forceLoadFonts, 100);
});

// 页面完全加载后再次检查字体
window.addEventListener('load', function() {
    console.log('页面完全加载，最终字体检查');
    setTimeout(forceLoadFonts, 200);
});
