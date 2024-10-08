import { Component, AfterViewInit, Inject, HostListener, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements AfterViewInit {
  private katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  private latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private nums = '0123456789';
  private alphabet = this.katakana + this.latin + this.nums;
  private fontSize = 16;
  private columns!: number;
  private rainDrops: number[] = [];
  private context!: CanvasRenderingContext2D;
  private isBrowser: boolean;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object, private renderer: Renderer2) {
    // Check if the current platform is the browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const canvas = this.document.getElementById('Matrix') as HTMLCanvasElement;
      this.context = canvas.getContext('2d')!;
      this.resizeCanvas();
      this.initRainDrops();
      setInterval(() => this.draw(), 30);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.resizeCanvas();
    }
  }

  private resizeCanvas() {
    const canvas = this.document.getElementById('Matrix') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.columns = canvas.width / this.fontSize;
  }

  private initRainDrops() {
    this.rainDrops = Array(Math.floor(this.columns)).fill(1);
  }

  private draw() {
    const canvas = this.document.getElementById('Matrix') as HTMLCanvasElement;

    this.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    this.context.fillStyle = '#0F0';
    this.context.font = this.fontSize + 'px monospace';

    for (let i = 0; i < this.rainDrops.length; i++) {
      const text = this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
      this.context.fillText(text, i * this.fontSize, this.rainDrops[i] * this.fontSize);

      if (this.rainDrops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
        this.rainDrops[i] = 0;
      }

      this.rainDrops[i]++;
    }
  }
}
