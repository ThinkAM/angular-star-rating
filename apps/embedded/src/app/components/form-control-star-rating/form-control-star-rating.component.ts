import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientService } from 'apps/embedded/src/services/client.service';
import { faCircle, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AirtableService } from 'apps/embedded/src/services/airtable.service';

@Component({
  selector: 'app-form-test',
  templateUrl: 'form-control-star-rating.component.html',
  styleUrls: ['./form-control-star-rating.component.scss'],
})
export class FormControlStarRatingComponent implements OnInit {
  form = new FormGroup({
    ratingInput: new FormControl(''),
    commentInput: new FormControl(''),
    url: new FormControl(''),
    ip: new FormControl(''),
  });

  rating = 0;
  ratings = [];
  comments = [];
  countUserOnline = 1;
  faCircle = faCircle;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  logged = true;
  debug = false;
  commentsFeature = false;
  id: string;
  entityName = 'Ratings';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: ActivatedRoute,
    private airtableService: AirtableService
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      if (params?.apiKey) {
        const firebaseConfig = {
          apiKey: params.apiKey,
          authDomain: params.authDomain,
          projectId: params.projectId,
          storageBucket: params.storageBucket,
          messagingSenderId: params.messagingSenderId,
          appId: params.appId,
          measurementId: params.measurementId
        };
        const app = initializeApp(firebaseConfig);
        getAnalytics(app);
        this.airtableService.configure({
          apiKey: params.airtableApiKey,
          apiVersion: 0
        });
        this.airtableService.base(params.baseId);
        this.init();
      }
    });
  }

  get ratingInput() {
    return this.form.get('ratingInput').value;
  }

  get commentInput() {
    return this.form.get('commentInput').value;
  }

  get url() {
    return this.form.get('url').value;
  }

  get ip() {
    return this.form.get('ip').value;
  }

  init() {
    this.clientService.getClientIPAddress().subscribe((response) => {
      this.form.get('ip').setValue(response.ip);
      this.form.get('url').setValue(location.href);
      this.airtableService.getList(this.entityName, `AND(url='${this.url}', ip='${this.ip}')`, {
        field: 'ip',
        direction: 'asc'
      }).then((response: any) => {
        if (response.length) {
          this.id = response[0].id;
          this.rating = response[0].fields.average;
        }
      });
      this.airtableService.getList(this.entityName, `url='${this.url}'`, 
      {
        field: 'createdTime',
        direction: 'desc'
      }).then((response: any) => {
        if (response.length) {
          this.ratings = response.map(item => item.fields);
          this.rating = this.ratings.length ? this.ratings[0].average : 0;
        }
      });
    });
  }

  humanize = (rating: string) => rating.includes('.00') ? Number(rating) : rating;

  async onSubmit() {
    if (!this.id) {
      const sum = this.ratings.length > 0 ? this.calculeSum() : this.ratingInput;
      this.rating = Math.round(sum / (this.ratings.length + 1));
      const fields = {
        rating: this.ratingInput,
        ip: this.ip,
        url: this.url,
        average: Math.round(this.rating),
        createdTime: new Date(),
        sum: String(sum)
      };
      this.ratings.push(fields);

      if (this.commentInput && this.commentInput !== '')
        this.comments.push(this.commentInput);

      const response: any = await this.airtableService.add(this.entityName, fields);
      this.id = response.id;

      this.init();
      return;
    }

    const sum = this.ratings.length > 0 ? this.calculeSum() : this.ratingInput;
    this.rating = Math.round(sum / (this.ratings.length + 1));

    await this.airtableService.update(this.entityName, {
      rating: this.ratingInput,
      ip: this.ip,
      url: this.url,
      average: Math.round(this.rating),
      createdTime: new Date(),
      sum: String(sum)
    }, this.id);

    if (this.commentInput && this.commentInput !== '')
      this.comments.push(this.commentInput);

    this.init();
  }

  calculeSum() {
    let sum = 0;
    this.ratings.forEach(item => {
      sum = sum + item.rating;
    });
    return sum + this.rating;
  }
}
