class AudioManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * High-fidelity, premium digital UI click
   * Faster sweep for a "glassy" tactile feel
   */
  public playClick() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(7000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Distinctive double-pulse for copy success
   */
  public playCopy() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const playTone = (freq: number, start: number, length: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + length);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + length);
    };

    playTone(1200, now, 0.06);
    playTone(1600, now + 0.08, 0.08);
  }

  public playError() {
    this.resume();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    [440, 466].forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.setValueAtTime(0.05, now + 0.2);
      gain.gain.setValueAtTime(0, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  public playSoftClick() { this.playClick(); }
  public playSuccess() { this.playClick(); }
  public playScan() { this.playClick(); }
}

export const audioManager = new AudioManager();