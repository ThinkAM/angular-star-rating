import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    setTimeout(() => {
      this.rating = 2.7;
      this.ratings.push(this.rating);
      this.comments.push('Muito bom!');
    }, 2000);
  }

  onSubmit() {
    this.ratings.push(this.rating);
    this.form.get('url').setValue(location.href);
    console.log('Submitted value:', this.form.value);
  }
}
