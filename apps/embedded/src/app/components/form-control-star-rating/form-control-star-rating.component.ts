import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientService } from 'apps/embedded/src/services/client.service';
import { faCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-test',
  templateUrl: 'form-control-star-rating.component.html',
  styleUrls: ['./form-control-star-rating.component.scss'],
})
export class FormControlStarRatingComponent {
  form = new FormGroup({
    ratingInput: new FormControl(''),
    commentInput: new FormControl(''),
    url: new FormControl(''),
    ip: new FormControl(''),
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
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  logged = true;
  debug = false;
  commentsFeature = false;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.init();
  }

  get ratingInput() {
    return this.form.get('ratingInput').value;
  }

  get commentInput() {
    return this.form.get('commentInput').value;
  }

  init() {
    this.clientService.getClientIPAddress().subscribe((response) => {
      this.form.get('ip').setValue(response.ip);
      this.form.get('url').setValue(location.href);
    });
  }

  humanize = (rating: string) => rating.includes('.00') ? Number(rating) : rating;

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

      if (this.commentInput && this.commentInput !== '')
        this.comments.push(this.commentInput);

      console.log('Inserted:', this.form.value);
      this.form.reset();
      this.init();
      return;
    }

    const index = this.ratings.findIndex(prop => prop.ip === this.form.get('ip').value && prop.url === location.href);
    const sum = this.ratings.length > 0 ? this.ratings[this.ratings.length - 1].sum + this.ratingInput : this.ratingInput;
    this.rating = sum / (this.ratings.length + 1);
    rating.average = this.rating;
    this.ratings[index] = rating;

    if (this.commentInput && this.commentInput !== '')
      this.comments.push(this.commentInput);

    console.log('Updated:', this.form.value);
    this.form.reset();
    this.init();
  }
}
