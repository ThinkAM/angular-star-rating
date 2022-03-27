import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientService } from 'apps/embedded/src/services/client.service';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

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

  rating = 4;
  ratings = [{
    rating: this.rating,
    ip: "0.0.0.0",
    url: "http://localhost:4200/#/form-control",
    sum: 4,
    average: 4
  }];
  comments = [];
  countUserOnline = 1;
  faCircle = faCircle;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientService.getClientIPAddress().subscribe((response) => {
      this.form.get('ip').setValue(response.ip);
      this.form.get('url').setValue(location.href);
      this.comments.push('Muito bom!');
      this.comments.push('Excelente!');
    });
  }

  get ratingInput() {
    return this.form.get('ratingInput').value;
  }

  onSubmit() {
    const rating = this.ratings.find(prop => prop.ip === this.form.get('ip').value && prop.url === location.href);
    this.ratings = this.ratings.filter(props => props != rating);
    if (!rating || !this.ratings.length) {
      const sum = this.ratings.length > 0 ? this.ratings[this.ratings.length - 1].sum + this.ratingInput : this.ratingInput;
      this.rating = sum / (this.ratings.length + 1);
      this.ratings.push({
        rating: this.ratingInput,
        ip: this.form.get('ip').value,
        url: location.href,
        sum: sum,
        average: this.rating
      });
      
      console.log('Inserted:', this.form.value);
      return;
    }
    
    const index = this.ratings.findIndex(prop => prop.ip === this.form.get('ip').value && prop.url === location.href);
    const sum = this.ratings.length > 0 ? this.ratings[this.ratings.length - 1].sum + this.ratingInput : this.ratingInput;
    this.rating = sum / (this.ratings.length + 1);
    rating.average = this.rating;
    this.ratings[index] = rating;
    console.log('Updated:', this.form.value);
  }
}
