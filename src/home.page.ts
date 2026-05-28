import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PianoKey {
  note: string;
  frequency: number;
  isBlack: boolean;
  isPressed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  currentNote: string = '';

  keys: PianoKey[] = [
    { note: 'Do', frequency: 261.63, isBlack: false, isPressed: false },
    { note: 'Do#', frequency: 277.18, isBlack: true, isPressed: false },
    { note: 'Re', frequency: 293.66, isBlack: false, isPressed: false },
    { note: 'Re#', frequency: 311.13, isBlack: true, isPressed: false },
    { note: 'Mi', frequency: 329.63, isBlack: false, isPressed: false },
    { note: 'Fa', frequency: 349.23, isBlack: false, isPressed: false },
    { note: 'Fa#', frequency: 369.99, isBlack: true, isPressed: false },
    { note: 'Sol', frequency: 392.0, isBlack: false, isPressed: false },
    { note: 'Sol#', frequency: 415.3, isBlack: true, isPressed: false },
    { note: 'La', frequency: 440.0, isBlack: false, isPressed: false },
    { note: 'La#', frequency: 466.16, isBlack: true, isPressed: false },
    { note: 'Si', frequency: 493.88, isBlack: false, isPressed: false },
  ];

  get whiteKeys() {
    return this.keys.filter((k) => !k.isBlack);
  }

  playNote(key: PianoKey) {
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    key.isPressed = true;
    this.currentNote = key.note;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.frequency.value = key.frequency;
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioCtx.currentTime + 1
    );

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1);
    setTimeout(() => (key.isPressed = false), 200);
  }

  getBlackKeyPosition(i: number): number {
    const offsets: any = { 1: 35, 3: 110, 6: 260, 8: 335, 10: 410 };
    return offsets[i] || 0;
  }
}
