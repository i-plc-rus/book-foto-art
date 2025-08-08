import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-focal-point',
  templateUrl: './focal-point.component.html',
  styleUrls: ['./focal-point.component.css']
})
export class FocalPointComponent implements AfterViewInit, OnChanges {
  @Input() imageUrl: string = '';
  @Input() initialPosition: { x: number; y: number } = { x: 20, y: 20 };
  @Output() positionChanged = new EventEmitter<{ x: number; y: number }>();

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('focalPoint') focalPoint!: ElementRef<HTMLDivElement>;

  position = { x: 20, y: 20 };
  isDragging = false;
  containerRect: DOMRect | null = null;

  ngAfterViewInit() {
    this.updateContainerRect();
    window.addEventListener('resize', this.updateContainerRect);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialPosition']) {
      this.position = { ...this.initialPosition };
    }
  }

  updateContainerRect = () => {
    if (this.imageContainer) {
      this.containerRect = this.imageContainer.nativeElement.getBoundingClientRect();
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.updatePosition(event);
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updatePosition(event);
  }

  endDrag() {
    this.isDragging = false;
    this.positionChanged.emit(this.position);
  }

  updatePosition(event: MouseEvent | TouchEvent) {
    if (!this.containerRect) return;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    // Calculate position relative to container
    let x = ((clientX - this.containerRect.left) / this.containerRect.width) * 100;
    let y = ((clientY - this.containerRect.top) / this.containerRect.height) * 100;

    // Constrain to 0-100%
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    this.position = { x, y };
  }

  getPositionStyle() {
    // Рассчитываем точное положение с учетом краев
    const left = Math.max(0, Math.min(100, this.position.x));
    const top = Math.max(0, Math.min(100, this.position.y));

    return {
      left: `${left}%`,
      top: `${top}%`,
      transform: 'translate(-50%, -50%)'
    };
  }
}
