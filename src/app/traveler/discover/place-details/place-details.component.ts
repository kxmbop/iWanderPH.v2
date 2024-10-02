import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {
  place: any = {};
  placeImages: any[] = [];

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit(): void {
    const placeId = this.route.snapshot.paramMap.get('id');
    if (placeId) {
      this.loadPlaceDetails(parseInt(placeId, 10));
    }
  }

  loadPlaceDetails(placeId: number): void {
    this.placeService.getPlaceById(placeId).subscribe(data => {
      this.place = data.place;
      this.placeImages = data.images;
    });
  }
}
