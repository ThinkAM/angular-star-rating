import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    constructor(private http: HttpClient) { }

    public getClientIPAddress(): Observable<any> {
        return this.http.get('https://api.ipgeolocation.io/getip');
    }

    public getClientIPDetails(clientIP: string): Observable<any> {
        return this.http.get(`https://api.ipgeolocation.io/ipgeo?apiKey=800b519b8d224ac1b2e53da2808cd5af&ip=${clientIP}`);
    }
}
