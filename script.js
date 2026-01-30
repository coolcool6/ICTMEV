// ============================================
// 全局变量与初始化
// ============================================

let particleSystem = null;
let mouseX = 0;
let mouseY = 0;
let stars = []; // 存储点击产生的星星粒子

// ============================================
// 页面加载完成后初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initParticleSystem();
    initMouseTracking();
    initClickStars();
    initNavigation();
    initAIChat();
    initHeroAnimations();
    initModuleModal();
});

// ============================================
// 粒子系统初始化（Canvas）
// ============================================
function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子类
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.color = Math.random() > 0.5 ? '#FF6B35' : '#00B8A9';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界检测
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // 鼠标交互
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 107, 53, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// 鼠标跟踪（跟随光点）
// ============================================
function initMouseTracking() {
    const cursorLight = document.querySelector('.cursor-light');
    if (!cursorLight) return;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorLight.style.left = mouseX + 'px';
        cursorLight.style.top = mouseY + 'px';
    });
}

// ============================================
// 点击星星特效
// ============================================
function initClickStars() {
    const starEmojis = ['✨', '⭐', '💫', '🌟'];
    const colors = ['#FF6B35', '#00B8A9', '#FFD93D', '#6BCF7F'];
    
    document.addEventListener('click', (e) => {
        // 排除AI聊天窗口和按钮的点击
        if (e.target.closest('.ai-chat-container') || 
            e.target.closest('.ai-assistant-btn')) {
            return;
        }
        
        const starCount = 8;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
            star.style.left = e.clientX + 'px';
            star.style.top = e.clientY + 'px';
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机方向和距离
            const angle = (Math.PI * 2 * i) / starCount + Math.random() * 0.5;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            star.style.setProperty('--tx', tx + 'px');
            star.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(star);
            
            // 动画结束后移除
            setTimeout(() => {
                star.remove();
            }, 1000);
        }
    });
}

// ============================================
// 模块弹窗系统
// ============================================
function initModuleModal() {
    const modal = document.getElementById('moduleModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementById('closeModal');
    
    if (!modal || !modalContent || !closeBtn) return;
    
    // 关闭弹窗函数
    function closeModal() {
        modal.classList.remove('active');
        
        // 延迟清空内容，等待动画结束
        setTimeout(() => {
            // 将内容移回原位 (如果是移动过来的话)
            const activeSection = modalContent.querySelector('.content-section');
            if (activeSection) {
                document.body.appendChild(activeSection);
            }
            modalContent.innerHTML = '';
            document.body.style.overflow = 'auto'; // 恢复滚动
        }, 400);
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // 点击遮罩层关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// 打开弹窗并注入内容
function openModule(sectionId) {
    const modal = document.getElementById('moduleModal');
    const modalContent = document.getElementById('modalContent');
    const section = document.getElementById(sectionId + '-section');
    
    if (!modal || !modalContent || !section) return;
    
    // 清空现有内容
    modalContent.innerHTML = '';
    
    // 如果是教材介绍模块，重置标签状态
    if (sectionId === 'book') {
        const tabs = section.querySelectorAll('.book-tab-btn');
        const contents = section.querySelectorAll('.book-tab-content');
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        section.querySelector('.book-tab-btn[data-tab="home"]').classList.add('active');
        section.querySelector('#tab-home').classList.add('active');
    }

    // 如果是核心内容模块，重置为显示网格列表
    if (sectionId === 'content') {
        const grid = section.querySelector('.content-grid');
        const details = section.querySelector('#chapterDetails');
        if (grid && details) {
            grid.style.display = 'grid';
            grid.style.opacity = '1';
            grid.style.transform = 'none';
            details.style.display = 'none';
        }
    }
    
    // 移动 section 到 modal 中
    modalContent.appendChild(section);
    
    // 显示弹窗
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
    
    // 触发内部动画
    if (typeof gsap !== 'undefined') {
        const cards = section.querySelectorAll('.content-card, .ai-card, .book-card, .reference-card, .course-card, .case-card, .book-text-card, .book-copyright-card');
        gsap.set(cards, { opacity: 0, y: 30, scale: 0.9 });
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2
        });
    }
}

// ============================================
// 教材模块标签切换逻辑
// ============================================
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-tab-btn')) {
        const tabId = e.target.getAttribute('data-tab');
        const section = e.target.closest('.book-section');
        
        // 切换按钮
        section.querySelectorAll('.book-tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // 切换内容
        section.querySelectorAll('.book-tab-content').forEach(content => content.classList.remove('active'));
        const targetContent = section.querySelector('#tab-' + tabId);
        targetContent.classList.add('active');
        
        // 动画过渡
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(targetContent, 
                { opacity: 0, y: 15 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }
});

// ============================================
// 核心内容模块详情切换逻辑
// ============================================
document.addEventListener('click', (e) => {
    // 点击核心内容卡片进入详情
    const card = e.target.closest('.content-card');
    if (card && card.closest('#content-section')) {
        const index = card.getAttribute('data-index');
        const section = card.closest('#content-section');
        const grid = section.querySelector('.content-grid');
        const detailsContainer = section.querySelector('#chapterDetails');
        
        if (grid && detailsContainer) {
            // 动画过渡
            if (typeof gsap !== 'undefined') {
                gsap.to(grid, { 
                    opacity: 0, 
                    y: -20, 
                    duration: 0.3, 
                    onComplete: () => {
                        grid.style.display = 'none';
                        detailsContainer.style.display = 'block';
                        
                        // 显示对应的章节详情
                        detailsContainer.querySelectorAll('.chapter-detail').forEach(d => d.classList.remove('active'));
                        const targetDetail = detailsContainer.querySelector(`.chapter-detail[data-chapter="${index}"]`);
                        if (targetDetail) targetDetail.classList.add('active');
                        
                        gsap.fromTo(detailsContainer, 
                            { opacity: 0, y: 20 }, 
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    }
                });
            } else {
                grid.style.display = 'none';
                detailsContainer.style.display = 'block';
                detailsContainer.querySelectorAll('.chapter-detail').forEach(d => d.classList.remove('active'));
                const targetDetail = detailsContainer.querySelector(`.chapter-detail[data-chapter="${index}"]`);
                if (targetDetail) targetDetail.classList.add('active');
            }
        }
    }

    // 点击返回按钮回到网格列表
    if (e.target.closest('.back-to-grid-btn')) {
        const section = e.target.closest('#content-section');
        const grid = section.querySelector('.content-grid');
        const detailsContainer = section.querySelector('#chapterDetails');
        
        if (grid && detailsContainer) {
            if (typeof gsap !== 'undefined') {
                gsap.to(detailsContainer, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    onComplete: () => {
                        detailsContainer.style.display = 'none';
                        grid.style.display = 'grid';
                        
                        gsap.fromTo(grid, 
                            { opacity: 0, y: -20 }, 
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    }
                });
            } else {
                detailsContainer.style.display = 'none';
                grid.style.display = 'grid';
            }
        }
    }
});

// ============================================
// 导航滚动系统 (修改为弹窗模式)
// ============================================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-module-btn');
    
    // 为所有导航按钮添加点击事件
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetSection = btn.getAttribute('data-section');
            if (targetSection) {
                e.preventDefault();
                openModule(targetSection);
            }
        });
    });
    
    // 移除原有的 IntersectionObserver 逻辑，因为现在是弹窗模式
}


// ============================================
// Hero区域动画初始化
// ============================================
function initHeroAnimations() {
    // 使用GSAP动画（如果可用）
    if (typeof gsap !== 'undefined') {
        gsap.to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.5
        });
        
        gsap.to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.8
        });
        
        gsap.to('.hero-badge', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            delay: 1.2
        });
        
        // Hero导航按钮动画
        const heroNavButtons = document.querySelector('.hero-nav-buttons');
        if (heroNavButtons) {
            gsap.to(heroNavButtons, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 1.5
            });
            
            gsap.utils.toArray('.hero-nav-btn').forEach((btn, index) => {
                gsap.from(btn, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    delay: 1.5 + index * 0.1
                });
            });
        }
    } else {
        // 如果GSAP未加载，使用CSS动画
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const heroBadge = document.querySelector('.hero-badge');
            
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }
            if (heroSubtitle) {
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }
            if (heroBadge) {
                heroBadge.style.opacity = '1';
                heroBadge.style.transform = 'scale(1)';
            }
        }, 300);
    }
}

// ============================================
// AI聊天功能
// ============================================
function initAIChat() {
    const aiBtn = document.getElementById('aiAssistantBtn');
    const chatContainer = document.getElementById('aiChatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!aiBtn || !chatContainer) return;
    
    // 打开聊天窗口
    aiBtn.addEventListener('click', () => {
        chatContainer.classList.add('active');
        chatInput.focus();
    });
    
    // 关闭聊天窗口
    chatClose.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    // 发送消息
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addMessage(message, 'user');
        chatInput.value = '';
        
        // 模拟AI回复（这里可以接入真实的AI API）
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addMessage(aiResponse, 'ai');
        }, 1000);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 添加消息到聊天窗口
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 如果是AI消息，添加打字机效果
        if (type === 'ai') {
            const contentP = messageDiv.querySelector('.message-content p');
            const fullText = contentP.textContent;
            contentP.textContent = '';
            
            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < fullText.length) {
                    contentP.textContent += fullText[index];
                    index++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);
        }
    }
    
    // 生成AI回复（模拟，实际应调用API）
    function generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // 关键词匹配回复
        if (lowerMessage.includes('动力学') || lowerMessage.includes('建模')) {
            return '电动汽车动力学建模是智能控制的基础。主要包括纵向动力学、横向动力学和垂向动力学模型。纵向动力学关注车辆的加速和制动，横向动力学涉及转向和稳定性，垂向动力学则研究悬架系统。这些模型为后续的控制器设计提供了精确的数学描述。';
        } else if (lowerMessage.includes('控制') || lowerMessage.includes('控制器')) {
            return '智能控制理论融合了经典控制、现代控制和人工智能技术。主要包括PID控制、状态反馈控制、自适应控制、鲁棒控制以及基于模糊逻辑、神经网络和强化学习的智能控制方法。这些方法能够应对电动汽车系统的非线性和不确定性。';
        } else if (lowerMessage.includes('状态估计') || lowerMessage.includes('观测器')) {
            return '状态估计与观测器设计用于实时估计无法直接测量的车辆状态，如质心侧偏角、轮胎力等。常用的方法包括卡尔曼滤波、扩展卡尔曼滤波、无迹卡尔曼滤波以及滑模观测器等。准确的状态估计是高性能控制的前提。';
        } else if (lowerMessage.includes('自适应')) {
            return '自适应控制能够根据系统参数的变化自动调整控制器参数，保持系统性能。主要包括模型参考自适应控制和自校正控制。在电动汽车中，自适应控制可以应对电池老化、路面变化等不确定性因素。';
        } else if (lowerMessage.includes('鲁棒') || lowerMessage.includes('稳定性')) {
            return '鲁棒控制设计在系统存在不确定性和外部干扰的情况下，仍能保证系统的稳定性和性能。常用的方法包括H∞控制、μ分析和滑模控制。这对于电动汽车在复杂工况下的稳定运行至关重要。';
        } else if (lowerMessage.includes('神经网络') || lowerMessage.includes('模糊') || lowerMessage.includes('强化学习')) {
            return '智能算法在电动汽车控制中发挥着越来越重要的作用。模糊控制擅长处理不确定性，神经网络具有强大的学习和逼近能力，强化学习则能够通过与环境交互优化控制策略。这些方法为电动汽车的智能化提供了新的途径。';
        } else if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('介绍')) {
            return '您好！我是AI智能助手，专门为您解答《电动汽车智能控制理论与方法》的相关问题。我可以帮助您理解教材中的核心概念，包括动力学建模、控制理论、状态估计等内容。请随时提问！';
        } else {
            return '感谢您的提问！关于《电动汽车智能控制理论与方法》，我可以为您解答以下方面的问题：\n\n1. 电动汽车动力学建模\n2. 智能控制理论\n3. 状态估计与观测器\n4. 自适应控制\n5. 鲁棒控制\n6. 智能算法（模糊、神经网络、强化学习）\n\n请告诉我您想了解哪个方面？';
        }
    }
}

// ============================================
// 视差效果（鼠标移动时轻微偏移）- 仅在当前显示的section中生效
// ============================================
document.addEventListener('mousemove', (e) => {
    const activeSection = document.querySelector('.active-section');
    if (!activeSection) return;
    
    const cards = activeSection.querySelectorAll('.content-card, .book-card, .ai-card, .case-card');
    const mouseXPercent = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseYPercent = (e.clientY / window.innerHeight - 0.5) * 2;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(e.clientY - cardCenterY);
        
        if (distanceFromCenter < 300) {
            const intensity = (300 - distanceFromCenter) / 300 * 3;
            const currentTransform = card.style.transform || '';
            // 保留原有的transform，只添加视差偏移
            if (!currentTransform.includes('translateY') && !currentTransform.includes('translateX')) {
                card.style.transform = `translateY(${-intensity * mouseYPercent}px) translateX(${intensity * mouseXPercent}px)`;
            }
        }
    });
});

// ============================================
// 性能优化：节流函数
// ============================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 应用节流到鼠标事件
const throttledMouseMove = throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, 16); // 约60fps

document.addEventListener('mousemove', throttledMouseMove);