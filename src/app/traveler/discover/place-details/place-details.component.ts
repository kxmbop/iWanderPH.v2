import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../services/place.service';

@Component({
    selector: 'app-place-details',
    templateUrl: './place-details.component.html',
    styleUrls: ['./place-details.component.scss'],
    standalone: false
})
export class PlaceDetailsComponent implements OnInit {
  place: any = {};
  placeImages: any[] = [];
  mainImage: string = '';
  selectedImage: string = ''; 
  placeId!: number; 

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

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
      console.log(this.placeImages);
    });
  }

  changeMainImage(image: string): void {
    this.selectedImage = image; 
  }

  resetToMainImage(): void {
    this.selectedImage = this.mainImage; 
  }
}
