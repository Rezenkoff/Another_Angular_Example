import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { ImageMapModel } from '../models/image-map.model';

@Component({
    selector: 'mapped-image',
    templateUrl: './__mobile__/mapped-image.component.html'
})

export class MappedImageComponent implements OnInit {
    @Input() imageUrl: string;
    @Input() imageMap: Array<ImageMapModel>;
    @Output() markerSelected: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('myCanvas') myCanvas: ElementRef;
    @ViewChild('imgElement') myImg: ElementRef;
    @ViewChild('imageContainer') container: ElementRef;
    public canvasHeight: number = 800;
    public context: CanvasRenderingContext2D;
    public zoomCoefficient: number = 1;
    public markers: Array<ImageMapModel> = new Array<ImageMapModel>();

    constructor(private renderer: Renderer2) {}

    ngOnInit() {        
        let img = new Image();
        img.onload = () => {
            let height = img.naturalHeight;
            let width = img.naturalWidth;
      
            this.setZoomCoefficient(width, this.myImg.nativeElement.offsetWidth);
            this.setHeights(height);
            this.setMarkers();
            this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        };
        img.src = this.imageUrl;
    }

    setHeights(originalImageHeight: number) {
        let newHeight = Math.round(originalImageHeight * this.zoomCoefficient);    
        this.renderer.setStyle(this.container.nativeElement, 'height', `${newHeight}px`);
        this.canvasHeight = newHeight;
    }

    setZoomCoefficient(originalWidth: number, currentWidth: number) {
        this.zoomCoefficient = currentWidth / originalWidth;        
    }

    setMarkers() {
        for (let marker of this.imageMap) {
            let x1 = Math.round(marker.x1 * this.zoomCoefficient);
            let x2 = Math.round(marker.x2 * this.zoomCoefficient);
            let y1 = Math.round(marker.y1 * this.zoomCoefficient);
            let y2 = Math.round(marker.y2 * this.zoomCoefficient);
            this.markers.push({ code: marker.code, x1: x1, x2: x2, y1: y1, y2: y2, type: marker.type });
        }        
    }

    drawRect(marker) {    
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#86c934";
        this.context.strokeRect(marker.x1 , marker.y1 , marker.x2 - marker.x1 , marker.y2 - marker.y1 );
        
    }

    onMarkerSelect(marker: any) {
        this.clearMarkerSelect(marker);
        this.drawRect(marker);
        this.markerSelected.emit(marker.code);
    }

    clearMarkerSelect(marker) {        
        //this.context.clearRect(marker.x1 - 1, marker.y1 - 1, marker.x2 - marker.x1 + 2, marker.y2 - marker.y1 + 2);
        this.context.clearRect(0, 0, 600, this.canvasHeight); // clear whole canvas
    }

    draw(code: string) {        
        let marker = this.markers.find(marker => marker.code === code);
        if (marker) {
            this.drawRect(marker);
        }
    }

    clear(code: string) {
        let marker = this.markers.find(marker => marker.code === code);
        if (marker) {
            this.clearMarkerSelect(marker);
        }
    }
}