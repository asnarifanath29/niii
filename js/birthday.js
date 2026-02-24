;(function () {
	'use strict';

	var $ = window.jQuery;
	if (!$) return;

	// Typing lines
	var typingLines = [
		'Document Controller in Dubai 🇦🇪',
		'Passion: Business & Cars 🏎️',
		'Dream: To Become a Successful Businessman',
		'My Forever Foodie 😋'
	];
	var typingIndex = 0;
	var charIndex = 0;
	var isDeleting = false;
	var typingSpeed = 80;
	var deleteSpeed = 45;
	var linePause = 2200;

	function typeNextChar() {
		var el = document.getElementById('typing-text');
		if (!el) return;
		var line = typingLines[typingIndex];
		if (isDeleting) {
			el.textContent = line.substring(0, charIndex - 1);
			charIndex--;
			if (charIndex === 0) {
				isDeleting = false;
				typingIndex = (typingIndex + 1) % typingLines.length;
				setTimeout(typeNextChar, 400);
				return;
			}
			setTimeout(typeNextChar, deleteSpeed);
		} else {
			el.textContent = line.substring(0, charIndex + 1);
			charIndex++;
			if (charIndex === line.length) {
				isDeleting = true;
				setTimeout(typeNextChar, linePause);
				return;
			}
			setTimeout(typeNextChar, typingSpeed);
		}
	}

	// Engine intro: sound, vibration, racing line, headlight
	function runEngineIntro() {
		var intro = document.getElementById('engine-intro');
		var engineAudio = document.getElementById('engine-sound');
		if (!intro) return;

		intro.classList.add('active');
		// Headlight flash early
		setTimeout(function () {
			intro.classList.add('flash');
		}, 200);
		setTimeout(function () {
			intro.classList.remove('flash');
		}, 800);
		// Vibration 0.5s (5 x 0.1s)
		intro.classList.add('vibrate');
		setTimeout(function () {
			intro.classList.remove('vibrate');
		}, 500);
		// Play engine sound (2s only) – user adds sounds/engine.mp3
		if (engineAudio && engineAudio.play) {
			engineAudio.volume = 0.4;
			engineAudio.play().catch(function () {});
			setTimeout(function () {
				engineAudio.pause();
				engineAudio.currentTime = 0;
			}, 2000);
		}
		// Hide intro after racing line + fade
		setTimeout(function () {
			intro.classList.remove('active');
		}, 3500);
	}

	// Reveal Surprise section (teaser → content) + confetti celebration
	function revealSurprise() {
		var teaser = document.getElementById('surprise-teaser');
		var content = document.getElementById('surprise-content');
		if (teaser) teaser.classList.add('hidden');
		if (content) {
			content.classList.add('visible');
			content.setAttribute('aria-hidden', 'false');
			runConfetti(true);
		}
	}
	function initRevealSurprise() {
		var btn = document.getElementById('reveal-surprise-btn');
		var teaser = document.getElementById('surprise-teaser');
		var content = document.getElementById('surprise-content');
		if (!teaser || !content) return;
		// "Reveal Surprise" button inside section
		if (btn) btn.addEventListener('click', revealSurprise);
		// Hero "Click for a Surprise" – scroll to section then reveal
		$('.js-surprise-btn').on('click', function (e) {
			var href = $(this).attr('href');
			if (href && href.indexOf('#surprise') !== -1) {
				e.preventDefault();
				var target = document.getElementById('surprise');
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				setTimeout(revealSurprise, 400);
			}
		});
	}

	// Particles in hero
	function createParticles(containerId, count, symbol) {
		symbol = symbol || '✦';
		var container = document.getElementById(containerId);
		if (!container) return;
		for (var i = 0; i < (count || 35); i++) {
			var p = document.createElement('span');
			p.className = 'particle';
			p.textContent = symbol;
			p.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;animation-delay:' + (Math.random() * 5) + 's;opacity:' + (0.2 + Math.random() * 0.5) + ';';
			container.appendChild(p);
		}
	}

	// Confetti (romantic colors). soft = fewer pieces for cake-click
	function runConfetti(soft) {
		var container = document.getElementById('confetti-container');
		if (!container) return;
		container.innerHTML = '';
		var colors = ['#d4af37', '#e8c547', '#e8a0b8', '#c44569', '#9b59b6', '#f5f0e6'];
		var pieces = soft ? 25 : 70;
		var size = soft ? 5 : (6 + Math.random() * 8);
		for (var i = 0; i < pieces; i++) {
			var c = document.createElement('div');
			c.className = 'confetti-piece';
			c.style.cssText = 'left:' + (40 + Math.random() * 20) + '%;top:' + (30 + Math.random() * 30) + '%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';width:' + (soft ? 4 + Math.random() * 4 : 6 + Math.random() * 8) + 'px;height:' + (soft ? 4 + Math.random() * 4 : 6 + Math.random() * 8) + 'px;animation-duration:' + (2 + Math.random() * 2) + 's;animation-delay:' + (Math.random() * 0.3) + 's;transform:rotate(' + (Math.random() * 360) + 'deg);';
			container.appendChild(c);
			setTimeout(function (el) {
				if (el && el.parentNode) el.parentNode.removeChild(el);
			}, soft ? 2500 : 4000, c);
		}
	}

	// Sparkles when lighting candles
	function addCakeSparkles(container) {
		if (!container) return;
		container.innerHTML = '';
		for (var i = 0; i < 12; i++) {
			var s = document.createElement('span');
			s.className = 'cake-sparkle';
			s.style.cssText = 'left:' + (30 + Math.random() * 40) + '%;top:' + (20 + Math.random() * 60) + '%;animation-delay:' + (Math.random() * 0.3) + 's;';
			container.appendChild(s);
		}
		setTimeout(function () {
			container.innerHTML = '';
		}, 1200);
	}

	// Cake: click to light candles, then blow
	function initSurprise() {
		var cake = document.getElementById('cake-3d');
		var blowBtn = document.getElementById('blow-candles');
		var candlesWrap = document.getElementById('candles-wrap');
		var bouquetWrap = document.getElementById('bouquet-wrap');
		var sparklesEl = document.getElementById('cake-sparkles');
		var romanticAudio = document.getElementById('romantic-music');
		var candlesLit = false;
		var candlesBlown = false;

		// Click cake: light candles, sparkles, soft confetti, optional sound
		if (cake && candlesWrap) {
			cake.addEventListener('click', function () {
				if (candlesLit) return;
				candlesLit = true;
				var candles = candlesWrap.querySelectorAll('.candle');
				for (var i = 0; i < candles.length; i++) {
					candles[i].classList.add('lit');
					candles[i].setAttribute('data-lit', 'true');
				}
				if (blowBtn) blowBtn.removeAttribute('disabled');
				addCakeSparkles(sparklesEl);
				runConfetti(true);
				var sparkleSound = document.getElementById('sparkle-sound');
				if (sparkleSound && sparkleSound.play) {
					sparkleSound.volume = 0.3;
					sparkleSound.play().catch(function () {});
				}
			});
		}

		// Blow candles: smoke, fade sparkles, magic glow, confetti, bouquet, music
		if (blowBtn && candlesWrap) {
			blowBtn.addEventListener('click', function () {
				if (candlesBlown) return;
				candlesBlown = true;
				var candles = candlesWrap.querySelectorAll('.candle');
				for (var i = 0; i < candles.length; i++) {
					candles[i].classList.add('blown');
					candles[i].classList.remove('lit');
					candles[i].setAttribute('data-lit', 'false');
				}
				if (sparklesEl) sparklesEl.classList.add('fade-out');
				addSmokeEffect(document.getElementById('cake-smoke'));
				var glowEl = document.getElementById('cake-magic-glow');
				if (glowEl) {
					setTimeout(function () {
						glowEl.classList.add('visible');
						glowEl.setAttribute('aria-hidden', 'false');
					}, 400);
				}
				runConfetti(false);
				if (bouquetWrap) {
					setTimeout(function () {
						bouquetWrap.classList.add('visible');
					}, 800);
				}
				if (romanticAudio && romanticAudio.play) {
					romanticAudio.volume = 0.35;
					romanticAudio.play().catch(function () {});
				}
				var btn = document.getElementById('music-toggle');
				if (btn) btn.classList.add('playing');
			});
		}
	}

	function addSmokeEffect(container) {
		if (!container) return;
		container.classList.add('visible');
		container.setAttribute('aria-hidden', 'false');
		container.innerHTML = '';
		for (var i = 0; i < 6; i++) {
			var puff = document.createElement('div');
			puff.className = 'smoke-puff';
			puff.style.left = (45 + Math.random() * 10) + '%';
			puff.style.animationDelay = (i * 0.15) + 's';
			container.appendChild(puff);
		}
		setTimeout(function () {
			container.classList.remove('visible');
			container.innerHTML = '';
		}, 2200);
	}

	// Music toggle
	function initMusicToggle() {
		var btn = document.getElementById('music-toggle');
		var audio = document.getElementById('romantic-music');
		if (!btn || !audio) return;
		btn.addEventListener('click', function () {
			if (audio.paused) {
				audio.volume = 0.35;
				audio.play().catch(function () {});
				btn.classList.add('playing');
			} else {
				audio.pause();
				btn.classList.remove('playing');
			}
		});
	}

	// Romantic background: particles + hearts
	function createRomanticBg() {
		var particlesEl = document.getElementById('romantic-particles');
		var heartsEl = document.getElementById('romantic-hearts');
		if (particlesEl) {
			for (var i = 0; i < 35; i++) {
				var p = document.createElement('span');
				p.className = 'romantic-particle';
				if (i % 3 === 0) p.classList.add('pink');
				if (i % 3 === 1) p.classList.add('purple');
				p.style.left = Math.random() * 100 + '%';
				p.style.top = Math.random() * 100 + '%';
				p.style.animationDelay = (Math.random() * 8) + 's';
				particlesEl.appendChild(p);
			}
		}
		if (heartsEl) {
			var symbols = ['❤️', '💕', '💗', '💖', '✨'];
			for (var j = 0; j < 20; j++) {
				var h = document.createElement('span');
				h.className = 'romantic-heart';
				h.textContent = symbols[j % symbols.length];
				h.style.left = Math.random() * 100 + '%';
				h.style.animationDelay = (Math.random() * 18) + 's';
				h.style.animationDuration = (14 + Math.random() * 8) + 's';
				heartsEl.appendChild(h);
			}
		}
	}

	// Secret name click 3x
	function initSecretPopup() {
		var nameEl = document.getElementById('secret-name');
		var popup = document.getElementById('secret-popup');
		var closeBtn = document.getElementById('close-secret-popup');
		if (!nameEl || !popup) return;
		nameEl.addEventListener('click', function (e) {
			e.preventDefault();
			var clicks = parseInt(nameEl.getAttribute('data-clicks') || '0', 10) + 1;
			nameEl.setAttribute('data-clicks', clicks);
			if (clicks >= 3) {
				popup.classList.add('visible');
				nameEl.setAttribute('data-clicks', '0');
			}
		});
		if (closeBtn) {
			closeBtn.addEventListener('click', function () {
				popup.classList.remove('visible');
			});
		}
		popup.addEventListener('click', function (e) {
			if (e.target === popup) popup.classList.remove('visible');
		});
	}

	// Smooth scroll for other anchor links (surprise handled in initRevealSurprise)
	function initSmoothScroll() {
		$('a[href^="#"]').not('.js-surprise-btn').on('click', function (e) {
			var href = $(this).attr('href');
			if (href && href.length > 1) {
				var target = $(href);
				if (target.length) {
					e.preventDefault();
					target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	}

	// Footer floating hearts
	function createHearts(containerId, count) {
		count = count || 12;
		var container = document.getElementById('hearts-bg');
		if (!container) return;
		var symbols = ['❤️', '💛'];
		for (var i = 0; i < count; i++) {
			var h = document.createElement('span');
			h.className = 'floating-heart';
			h.textContent = symbols[i % 2];
			h.style.cssText = 'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 4) + 's;font-size:' + (12 + Math.random() * 10) + 'px;opacity:' + (0.15 + Math.random() * 0.2) + ';';
			container.appendChild(h);
		}
	}

	// Download letter as PDF (opens print dialog – user can save as PDF)
	function initDownloadLetter() {
		var btn = document.getElementById('download-letter');
		if (!btn) return;
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			window.print();
		});
	}

	// Add particle and confetti CSS dynamically so we don't require editing animate.css
	function injectKeyframes() {
		var style = document.createElement('style');
		style.textContent = [
			'.particle{position:absolute;color:#d4af37;font-size:12px;pointer-events:none;animation:particle-float 15s ease-in-out infinite;}',
			'@keyframes particle-float{0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}25%{transform:translate(10px,-20px) scale(1.2);opacity:0.6;}50%{transform:translate(-5px,10px) scale(0.9);opacity:0.4;}75%{transform:translate(-10px,-10px) scale(1.1);opacity:0.5;}',
			'.floating-heart{position:absolute;pointer-events:none;animation:heart-float 12s ease-in-out infinite;}',
			'@keyframes heart-float{0%,100%{transform:translateY(0) scale(1);opacity:0.2;}50%{transform:translateY(-15px) scale(1.1);opacity:0.35;}',
			'.confetti-piece{position:absolute;border-radius:2px;animation:confetti-fall 4s ease-out forwards;pointer-events:none;}',
			'@keyframes confetti-fall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}',
			'.cake-sparkle{position:absolute;width:8px;height:8px;background:radial-gradient(circle,#e8c547,#d4af37);border-radius:50%;pointer-events:none;animation:cake-sparkle 1.2s ease-out forwards;box-shadow:0 0 10px #d4af37;}',
			'@keyframes cake-sparkle{0%{transform:scale(0);opacity:1;}100%{transform:scale(1.5);opacity:0;}'
		].join('');
		document.head.appendChild(style);
	}

	// Nav background on scroll
	function initNavScroll() {
		var nav = document.querySelector('.birthday-nav');
		if (!nav) return;
		window.addEventListener('scroll', function () {
			if (window.scrollY > 80) nav.classList.add('scrolled');
			else nav.classList.remove('scrolled');
		});
	}

	// // Our Story: floating hearts + scroll reveal for timeline cards
	// function createStoryHearts() {
	// 	var container = document.getElementById('story-hearts');
	// 	if (!container) return;
	// 	var symbols = ['❤️', '💕', '💗'];
	// 	for (var i = 0; i < 10; i++) {
	// 		var h = document.createElement('span');
	// 		h.className = 'story-heart';
	// 		h.textContent = symbols[i % symbols.length];
	// 		h.style.cssText = 'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 4) + 's;';
	// 		container.appendChild(h);
	// 	}
	// }
	// Our Story: floating hearts + scroll reveal for timeline cards
function createStoryHearts() {
    var ids = ['story-hearts', 'story-hearts-bouquet'];
    var symbols = ['❤️', '💕', '💗'];
    
    ids.forEach(function(id) {
        var container = document.getElementById(id);
        if (!container) return;
        for (var i = 0; i < 10; i++) {
            var h = document.createElement('span');
            h.className = 'story-heart';
            h.textContent = symbols[i % symbols.length];
            h.style.cssText = 'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 4) + 's;';
            container.appendChild(h);
        }
    });
}
	function initScrollReveal() {
		if (!$ || !$.fn.waypoint) return;
		$('.scroll-reveal').waypoint(function (direction) {
			if (direction === 'down') $(this.element).addClass('revealed');
		}, { offset: '85%' });
	}

// 	function createEmojiParticles(containerId, count) {
//     var container = document.getElementById(containerId);
//     if (!container) return;
//     var emojis = ['🎉', '🎊', '🎁', '✨', '💥'];
//     for (var i = 0; i < count; i++) {
//         var p = document.createElement('span');
//         p.className = 'story-heart'; // reuses existing floating animation CSS
//         p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
//         p.style.cssText = 'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 5) + 's;font-size:' + (16 + Math.random() * 20) + 'px;';
//         container.appendChild(p);
//     }
// }

	$(function () {
		injectKeyframes();
		initNavScroll();
		runEngineIntro();
		setTimeout(function () {
			typeNextChar();
		}, 3800);
		createParticles('particles-hero', 40, '✦');
		createParticles('particles-surprise', 40, '💝'); 
		createHearts('hearts-bg', 14);
		createRomanticBg();
		createStoryHearts();
		initScrollReveal();
		initRevealSurprise();
		initSurprise();
		initMusicToggle();
		initSecretPopup();
		initSmoothScroll();
		initDownloadLetter();
	});
})();
