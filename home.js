// Home page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio context on first user interaction
    document.addEventListener('click', () => {
        if (window.soundManager && window.soundManager.audioContext) {
            window.soundManager.resumeAudioContext();
        }
    }, { once: true });

    // Add smooth animations to game cards
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        // Add touch support for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-5px) scale(1.01)';
        });

        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        // Add click sound for game card navigation
        card.addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playSound('button');
            }
        });
    });

    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Add some interactive elements
    const upcomingGames = document.querySelectorAll('.upcoming-game');
    upcomingGames.forEach(game => {
        game.addEventListener('click', () => {
            // Play button sound
            if (window.soundManager) {
                window.soundManager.playSound('button');
            }
            // Show coming soon message
            showComingSoonMessage();
        });
    });
});

function showComingSoonMessage() {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'coming-soon-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🚧 Coming Soon!</h4>
            <p>This game is under development. Check back later!</p>
            <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Add smooth page transitions
window.addEventListener('beforeunload', () => {
    document.body.classList.add('unloading');
});

// Add some fun particle effects (optional)
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random();

    document.body.appendChild(particle);

    setTimeout(() => {
        if (particle.parentElement) {
            particle.remove();
        }
    }, 5000);
}

// Create particles occasionally
setInterval(createParticle, 3000);
