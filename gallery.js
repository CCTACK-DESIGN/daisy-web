// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // 下拉菜单功能
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    dropdownItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            // 鼠标悬停显示下拉菜单
            item.addEventListener('mouseenter', function() {
                dropdownMenu.style.display = 'block';
                setTimeout(() => {
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.transform = 'translateY(0)';
                }, 10);
            });
            
            // 鼠标离开隐藏下拉菜单
            item.addEventListener('mouseleave', function() {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    dropdownMenu.style.display = 'none';
                }, 200);
            });
        }
    });
    
    // 照片分类筛选
    const categoryBtns = document.querySelectorAll('.category-btn');
    const photoItems = document.querySelectorAll('.photo-item');
    
    console.log('找到分类按钮数量:', categoryBtns.length);
    console.log('找到照片项目数量:', photoItems.length);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('点击了分类:', category);
            
            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选照片 - 移动端完全静态显示
            photoItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    // 移动端直接显示，不使用任何动画
                    if (window.innerWidth <= 768) {
                        item.style.opacity = '1';
                        item.style.transform = 'none';
                        item.style.transition = 'none';
                    } else {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    }
                } else {
                    if (window.innerWidth <= 768) {
                        // 移动端直接隐藏，不使用动画
                        item.classList.add('hidden');
                        item.style.opacity = '0';
                        item.style.transform = 'none';
                        item.style.transition = 'none';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        });
    });
    
    // 照片点击展示模态框
    const photoModal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const closeBtn = document.querySelector('.close-btn');
    
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageElement = this.querySelector('.photo-image');
            
            // 使用实际的图片路径
            if (imageElement) {
                modalImage.src = imageElement.src;
                // 使用alt属性作为标题
                modalTitle.textContent = imageElement.alt || '照片';
                modalDate.textContent = ''; // 不显示日期
            } else {
                // 如果没有找到图片元素，使用占位符
                modalImage.src = '';
                modalTitle.textContent = '照片';
                modalDate.textContent = '';
            }
            
            photoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });
    
    // 关闭模态框
    function closeModal() {
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // 点击模态框背景关闭
    photoModal.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && photoModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 照片项目动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // 移动端完全禁用滚动观察器动画
    if (window.innerWidth <= 768) {
        // 移动端：直接显示所有照片，不使用观察器
        photoItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'none';
            item.style.transition = 'none';
        });
    } else {
        // 桌面端：使用滚动观察器
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        photoItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }
    
    console.log('照片展示页面已加载完成！');
});
