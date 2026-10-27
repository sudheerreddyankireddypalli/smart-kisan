/**
 * Zero-Cost Ad Mediation Adapter
 * Seamlessly hooks into CrazyGames SDK, GameDistribution SDK, or Local Simulator.
 */
class AdManager {
    constructor() {
        this.sdkType = 'simulator'; // 'crazygames', 'gamedistribution', or 'simulator'
        this.crazyGamesSDK = null;
        this.isAdPlaying = false;
        this.init();
    }

    async init() {
        // Detect CrazyGames SDK
        if (window.CrazyGames && window.CrazyGames.SDK) {
            try {
                this.crazyGamesSDK = await window.CrazyGames.SDK.init();
                this.sdkType = 'crazygames';
                console.log('[AdManager] CrazyGames SDK initialized.');
                return;
            } catch (e) {
                console.warn('[AdManager] CrazyGames init failed, falling back:', e);
            }
        }

        // Detect GameDistribution SDK
        if (typeof window.gdsdk !== 'undefined') {
            this.sdkType = 'gamedistribution';
            console.log('[AdManager] GameDistribution SDK detected.');
            return;
        }

        // Default to local simulator for testing
        console.log('[AdManager] Running in Simulation Mode (No external SDK required).');
    }

    /**
     * Show Rewarded Ad (for Revive, 2x Coins, or Free Skins)
     * @param {Object} options - { onReward: Function, onClose: Function }
     */
    showRewardedAd({ onReward, onClose }) {
        if (this.isAdPlaying) return;
        this.isAdPlaying = true;

        if (this.sdkType === 'crazygames' && this.crazyGamesSDK) {
            this.crazyGamesSDK.ad.requestAd('rewarded', {
                adStarted: () => {
                    console.log('[Ad] CrazyGames rewarded ad started');
                },
                adFinished: () => {
                    this.isAdPlaying = false;
                    if (onReward) onReward();
                    if (onClose) onClose();
                },
                adError: (err) => {
                    console.warn('[Ad] CrazyGames ad error:', err);
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                }
            });
            return;
        }

        if (this.sdkType === 'gamedistribution' && window.gdsdk) {
            window.gdsdk.showAd('rewarded')
                .then(() => {
                    this.isAdPlaying = false;
                    if (onReward) onReward();
                    if (onClose) onClose();
                })
                .catch((err) => {
                    console.warn('[Ad] GD ad error:', err);
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                });
            return;
        }

        // Development Ad Simulator
        this.runSimulationModal('Rewarded Video Ad', 3, () => {
            this.isAdPlaying = false;
            if (onReward) onReward();
            if (onClose) onClose();
        });
    }

    /**
     * Show Interstitial Ad (Between rounds)
     * @param {Object} options - { onClose: Function }
     */
    showInterstitialAd({ onClose }) {
        if (this.isAdPlaying) return;
        this.isAdPlaying = true;

        if (this.sdkType === 'crazygames' && this.crazyGamesSDK) {
            this.crazyGamesSDK.ad.requestAd('midgame', {
                adFinished: () => {
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                },
                adError: () => {
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                }
            });
            return;
        }

        if (this.sdkType === 'gamedistribution' && window.gdsdk) {
            window.gdsdk.showAd()
                .then(() => {
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                })
                .catch(() => {
                    this.isAdPlaying = false;
                    if (onClose) onClose();
                });
            return;
        }

        // Simulator
        this.runSimulationModal('Sponsor Break (Interstitial)', 2, () => {
            this.isAdPlaying = false;
            if (onClose) onClose();
        });
    }

    /**
     * Interactive visual ad simulator for local testing
     */
    runSimulationModal(title, seconds, callback) {
        const modal = document.createElement('div');
        modal.id = 'ad-simulator-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(10, 15, 25, 0.95)';
        modal.style.backdropFilter = 'blur(8px)';
        modal.style.zIndex = '99999';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.color = '#ffffff';
        modal.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        let remaining = seconds;
        modal.innerHTML = `
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 32px 40px; text-align: center; max-width: 380px;">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #64ffda; margin-bottom: 8px;">Ad Revenue Simulation</div>
                <h3 style="margin: 0 0 16px 0; font-size: 22px;">${title}</h3>
                <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
                    In production on CrazyGames/Poki, this plays real high-paying video ads.
                </p>
                <div id="ad-sim-timer" style="font-size: 32px; font-weight: 800; color: #38bdf8; margin-bottom: 12px;">${remaining}s</div>
                <div style="font-size: 12px; color: #94a3b8;">Reward unlocks automatically when timer ends</div>
            </div>
        `;

        document.body.appendChild(modal);

        const timerEl = modal.querySelector('#ad-sim-timer');
        const interval = setInterval(() => {
            remaining -= 1;
            if (timerEl) timerEl.innerText = `${remaining}s`;
            if (remaining <= 0) {
                clearInterval(interval);
                modal.remove();
                callback();
            }
        }, 1000);
    }
}

window.adManager = new AdManager();
