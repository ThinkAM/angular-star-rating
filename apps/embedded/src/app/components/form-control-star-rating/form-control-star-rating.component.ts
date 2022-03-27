import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientService } from 'apps/embedded/src/services/client.service';

@Component({
  selector: 'app-form-test',
  templateUrl: 'form-control-star-rating.component.html',
  styleUrls: ['./form-control-star-rating.component.scss'],
})
export class FormControlStarRatingComponent {
  form = new FormGroup({
    ratingInput: new FormControl(''),
    comment: new FormControl(''),
    url: new FormControl(''),
    ip: new FormControl('')
  });

  rating = 0;
  ratings = [];
  comments = [];

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientService.getClientIPAddress().subscribe((response) => {
      this.form.get('ip').setValue(response.ip);
      this.rating = 2.7;
      this.ratings.push(this.rating);
      this.comments.push('Muito bom!');
    });
  }

  onSubmit() {
    this.ratings.push(this.rating);
    this.form.get('url').setValue(location.href);
    console.log('Submitted value:', this.form.value);
  }
}
