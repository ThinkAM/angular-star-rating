import { Injectable } from "@angular/core";
import { AirtableConfiguration, SortParam } from "ngx-airtable/lib/interfaces";
import { HttpClient } from '@angular/common/http';
import { Airtable, Base } from "ngx-airtable";

@Injectable({
    providedIn: 'root'
})
export class AirtableService {
  options: AirtableConfiguration;
  baseId = '';

  constructor(private http: HttpClient) {}

  configure(opts?: AirtableConfiguration): Airtable {
    opts = opts ? opts : this.options;
    return new Airtable(this.http, opts);
  }

  base(baseId: string): Base {
    this.baseId = baseId;
    return new Base(baseId, this.configure(this.options));
  }

  getAll<T>(entityName: string, sortParam: SortParam) {
    return new Promise((resolve) => {
      const observable = this.base(this.baseId).table(
        {
          tableName: entityName
        }
      ).select({
        sort: [sortParam]
      }).all();
      observable.subscribe((result) => {
        resolve(result);
      })
    });
  }

  getList<T>(entityName: string,
    filterByFormula: string,
    sortParam: SortParam) {
    return new Promise((resolve) => {
      const observable = this.base(this.baseId).table(
        {
          tableName: entityName
        }
      ).select({
        filterByFormula: filterByFormula,
        sort: [sortParam]
      }).all();
      observable.subscribe((result) => {
        resolve(result);
      })
    });
  }

  get<T>(entityName: string,
    filterByFormula: string): Promise<T> {
    return new Promise((resolve) => {
      const observable = this.base(this.baseId).table(
        {
          tableName: entityName
        }
      ).select({
        filterByFormula: filterByFormula
      }).firstPage();
      observable.subscribe((result) => {
        resolve(result[0]);
      })
    });
  }

  getById<T>(entityName: string, entityId: string): Promise<T> {
    return new Promise((resolve) => {
      const observable = this.base(this.baseId).table({tableName: entityName}).find(entityId);
      observable.subscribe((result) => {
        resolve(result);
      });
    });
  }

  add<T>(entityName: string,
    fields: T): Promise<T> {
    return new Promise((resolve) => {
      const input = {
        fields: fields
      };
      const observable = this.base(this.baseId)
        .table({
          tableName: entityName
        })
        .create(input);
      observable.subscribe((result) => {
        resolve(result);
      })
    });
  }

  update<T>(entityName: string,
    fields: T,
    airtableId: string) {
    return new Promise((resolve) => {
      const input = {
        fields: fields
      };
      const observable = this.base(this.baseId)
        .table({
          tableName: entityName
        })
        .update(airtableId, input);
      observable.subscribe((result) => {
        resolve(result);
      })
    });
  }

  delete<T>(entityName: string, fieldId: string) {
    return new Promise((resolve) => {
      const observable = this.base(this.baseId)
        .table({
          tableName: entityName
        })
        .destroy(fieldId);
      observable.subscribe((result) => {
        resolve(result);
      })
    });
  }
}
