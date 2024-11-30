import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {
  currentTab: string = 'location';
  place: any = {};
  placeImages: any[] = [];
  mainImage: string = '';
  selectedImage: string = ''; 
  placeId!: number; 
  safeMapEmbedLink!: SafeResourceUrl;

  constructor(private route: ActivatedRoute, private placeService: PlaceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const placeIdParam = this.route.snapshot.paramMap.get('id');
    if (placeIdParam) {
      this.placeId = parseInt(placeIdParam, 10);
      this.loadPlaceDetails(this.placeId);
    }
  }

  loadPlaceDetails(placeId: number): void {
    this.placeService.getPlaceById(placeId).subscribe(data => {
      this.place = data.place;
      this.placeImages = data.images;
      this.mainImage = this.place.main_image || ''; 
      this.selectedImage = this.mainImage;
      this.safeMapEmbedLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.place.map_embed_link);
    });
  }

  changeMainImage(image: string): void {
    this.selectedImage = image; 
  }

  resetToMainImage(): void {
    this.selectedImage = this.mainImage; 
  }

  // Method to split comma-separated data into an array and return it
  splitCommaSeparatedData(data: string): string[] {
    return data ? data.split(',').map(item => item.trim()) : [];
  }
}
